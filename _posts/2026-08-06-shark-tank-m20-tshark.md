---
layout: post
title:  "shark-tank - m20: tshark CLI Analizi"
date:   2026-08-06 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 20: tshark CLI Analizi

**Neden?** Olay müdahale ekibine 500 pcap dosyası geldi. GUI ile tek tek açmak imkansız: Haftalar sürer. Tshark bu analizi otomatize eder: Komut satırından filtreleme, field extraction, istatistik, object export. Scripting ile tüm pcap'leri tarar, IOC (Indicator of Compromise) eşleştirmesi yapar. Wireshark GUI tek bir pcap içindir; tshark binlerce pcap içindir. Bu modülde, tshark ile toplu pcap analizini otomatize etmeyi öğreneceksin.

**Görev:** tshark CLI araçlarını öğren. Otomasyon scriptleri yaz. Saldırgan IP'yi otomatik tespit et.

**Öğrenim Hedefleri:**
- tshark temel parametrelerini (-r, -Y, -T, -e, -z) kullanabilmek
- Display filter ile paketleri filtreleyip belirli alanları dışa aktarabilmek
- Protocol Hierarchy, Conversations, Endpoints gibi istatistikleri CLI'dan alabilmek
- Export Objects ile HTTP/FTP objelerini komut satırından çıkarabilmek
- Bash/PowerShell scriptleri ile pcap analizini otomatize edebilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **tshark** | Wireshark'ın komut satırı (CLI) versiyonu. Wireshark GUI ile yapılan tüm analiz işlemlerini grafik arayüz olmadan terminalden yapar. En temel kullanımı `tshark -r dosya.pcap` şeklindedir. Display filter (`-Y`), belirli alanların çıkarılması (`-T fields -e`), istatistik (`-z`) ve obje export (`--export-objects`) gibi özellikleri destekler. GUI'ye göre en büyük avantajı, script'lenebilir olmasıdır: Bash veya PowerShell ile yüzlerce pcap dosyası otomatik olarak taranabilir, belirli IOC'ler aranabilir. Bu yüzden SOC ve olay müdahale ekipleri toplu analiz için GUI yerine tshark kullanır. |
| **display filter** | Wireshark'ta yakalanan paketler arasında filtreleme yapmak için kullanılan sistem. Yakalama bittikten sonra çalışır: Paketleri silmez, yalnızca belirttiğin kritere uymayanları gizler. Display filter yazımı Wireshark'a özgü bir syntax kullanır: `ip.addr == 172.50.2.10`, `tcp.port == 80`, `http.request.method == "GET"` gibi. Birden fazla koşul `&&` (ve), `\|\|` (veya), `!` (değil) operatörleriyle birleştirilebilir. WCNA sınavında en çok test edilen filtreleme türüdür. |
| **capture filter** | Trafik yakalanırken, yani capture öncesi uygulanan filtre. Display filter'dan temel farkı: Capture filter'a uymayan paketler hiç yakalanmaz ve kalıcı olarak kaybolur. Bu nedenle capture filter kullanırken kritik paketleri kazara eleme riski vardır. Capture filter, BPF (Berkeley Packet Filter) syntax'ı kullanır; display filter'dan farklı bir yazım kuralı vardır. Canlı trafik izlerken performansı artırmak için kullanılır, ama sınavda hazır pcap dosyaları verildiği için display filter daha sık kullanılır. |
| **BPF** | Berkeley Packet Filter: Capture filter'ların kullandığı dil ve altyapı. tcpdump, Wireshark capture filter ve diğer paket yakalama araçları BPF syntax'ını kullanır. Display filter'dan farklı olarak protokol katmanlarına değil, raw byte offset'lere dayanır: `tcp dst port 80`, `host 172.50.2.10`, `not port 22` gibi. Doğru yazılmış bir BPF ifadesi çekirdek (kernel) seviyesinde çalıştığı için yüksek hızlı trafikte bile performans yükü en azdır. |
| **Expert Information** | Wireshark'ın pcap içindeki anormallikleri ve sorunları otomatik olarak tespit edip listelediği panel. `View > Expert Information` (Ctrl+Alt+Shift+E) menüsünden açılır. Sorunları dört ciddiyet seviyesinde gruplar: Error (kırmızı), Warn (sarı), Note (mavi), Chat (yeşil). Bir analist pcap'i açtığında ilk bakması gereken yerlerden biridir; çünkü retransmission, duplicate ACK, zero window, HTTP 404 gibi sorunları paket tek tek aranmadan özet olarak gösterir. |
| **IOC** | Indicator of Compromise (ihlal göstergesi): Bir saldırının veya zararlının izini taşıran kanıt parçası — zararlı dosyanın SHA-256 hash'i, C2 sunucu IP'si, alan adı, şüpheli User-Agent gibi. Otomatik taramanın birimi budur: tshark script'i yüzlerce pcap'i IOC listesiyle eşleştirir. Trafikten çıkarılıp raporlanır, VirusTotal/MalwareBazaar gibi kaynaklarla doğrulanır. |
| **SHA-256 / hash** | Dosyanın veya verinin özeti: İçerikten üretilen 64 haneli sabit uzunluklu parmak izi. Aynı içerik → aynı hash; tek bit değişse hash tamamen değişir. Bu yüzden adı/URL'si değişen zararlının tanınmasını ve bütünlük kanıtını sağlar. macOS'ta `shasum -a 256`, Linux'ta `sha256sum` ile hesaplanır. |
| **Protocol Hierarchy** | Wireshark ve tshark'ın bir pcap içindeki protokolleri katman katman özetleyen istatistik aracı. Her protokolün pcap içindeki paket sayısını ve yüzde oranını gösterir: Örneğin "%85 TCP, %60 HTTP, %20 DNS, %15 ARP" gibi. Bu özet, pcap'in genel içeriğini hızlıca anlamak için ilk bakılan araçtır. GUI'de `Statistics > Protocol Hierarchy`, tshark'ta `-q -z io,phs` komutuyla kullanılır. |

## Teori

tshark, Wireshark'ın komut satırı (CLI) versiyonudur. Aynı paket analizini GUI olmadan yapar.

| Özellik | Wireshark GUI | tshark CLI |
|---------|---------------|------------|
| Arayüz | Grafiksel | Terminal |
| Filtreler | Display + Capture | Display + Capture |
| Export | Menü ile | `--export-objects` |
| Otomasyon | Yok | Script ile |
| Performans | Yavaş (büyük pcap) | Hızlı |
| Kullanım | İnceleme | Toplu analiz, CI/CD |

> **SINAV İPUCU:** WCNA sınavı tshark'ı ayrı bir bölüm olarak test eder. `-r`, `-Y`, `-T fields`, `-e`, `-z` en çok sorulan parametrelerdir.

### tshark Kurulumu

```sh
# macOS (Wireshark ile birlikte kurulur)
brew install --cask wireshark
# PATH'e ekle:
sudo ln -sf /Applications/Wireshark.app/Contents/MacOS/tshark \
  /usr/local/bin/tshark

# Ubuntu / Debian
sudo apt-get install tshark

# Fedora
sudo dnf install wireshark-cli

# Windows
# Wireshark kurulumu ile birlikte gelir:
# C:\Program Files\Wireshark\tshark.exe
# PATH'e ekle veya tam yol kullan
```

> **DİKKAT:** Windows'ta PowerShell kullanılır, Linux/macOS'ta Bash. Komutlar aynıdır ama scripting sözdizimi farklıdır.

> **İstihbarat İşaretleri, tshark, bir blue team operatörünün en güçlü silahıdır:**
>
> - `tshark -r file.pcap -Y "tcp.flags.syn==1" -c 10` → Hızlı SYN taraması
> - `tshark -r file.pcap -q -z expert` → Expert Info: Retransmission, anomaly tespiti
> - `tshark -r file.pcap -Y 'http contains "password"' -T fields -e http.file_data` → Credential avı
> - Otomasyon: `for f in *.pcap; do tshark -r "$f" ...` → Toplu pcap analizi
> - Saldırganın 172.50.2.200 IP'sini tüm pcap'lerde ara: `tshark -r $f -Y "ip.src==172.50.2.200"`

## Hazırlık

Bu modülde yeni trafik üretilmez. Önceki modüllerin pcap dosyaları kullanılır:

```sh
# tshark'ı doğrula:
tshark --version

# Mevcut bir pcap ile test et:
tshark -r shared/pcaps/module-01-basics.pcap -c 5
```

Repoyu indirmediysen pcap dosyalarını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

---

## Alıştırma 1: Tshark Temel Kullanım

### Pcap dosyasını okuma:

```sh
# macOS / Linux
tshark -r shared/pcaps/module-13-http.pcap

# Windows (PowerShell)
tshark -r shared\pcaps\module-13-http.pcap
```

### İlk N paketi gösterme:

```sh
tshark -r shared/pcaps/module-13-http.pcap -c 10
```

### Sadece özet bilgi:

```sh
tshark -r shared/pcaps/module-13-http.pcap -q -z io,phs
```

> **SINAV İPUCU:** `-q` (quiet) + `-z io,phs` = Protocol Hierarchy Statistics.
>
> GUI'deki Statistics > Protocol Hierarchy ile aynıdır.

---

## Alıştırma 2: Display Filter (tshark -Y)

tshark, Wireshark GUI ile **aynı display filter syntax**'ını kullanır:

```sh
# HTTP istekleri
tshark -r shared/pcaps/module-13-http.pcap -Y "http.request"

# POST isteği
tshark -r shared/pcaps/module-13-http.pcap \
  -Y 'http.request.method == "POST"'

# DNS sorguları
tshark -r shared/pcaps/module-12-dns.pcap -Y "dns.flags.response == 0"

# TCP SYN paketleri
tshark -r shared/pcaps/module-08-tcp.pcap \
  -Y "tcp.flags.syn == 1 && tcp.flags.ack == 0"

# ICMP ping
tshark -r shared/pcaps/module-05-icmp.pcap -Y "icmp.type == 8"
```

> **SINAV İPUCU:** `-Y` display filter, `-f` capture filter. Sınavda karıştırılır!

---

## Alıştırma 3: Belirli Alanları Çıkarma (-T fields -e)

```sh
# Kaynak ve hedef IP
tshark -r shared/pcaps/module-13-http.pcap -Y "http.request" \
  -T fields -e ip.src -e ip.dst \
  -e http.request.method -e http.request.uri

# DNS sorgu isimleri
tshark -r shared/pcaps/module-12-dns.pcap \
  -Y "dns.flags.response == 0" \
  -T fields -e dns.qry.name -e dns.qry.type

# TCP bayrakları
tshark -r shared/pcaps/module-08-tcp.pcap -Y "tcp.flags.syn == 1" \
  -T fields -e ip.src -e tcp.srcport -e ip.dst \
  -e tcp.dstport -e tcp.flags
```

### Windows PowerShell:

```sh
# PowerShell'de tek tırnak kullan
tshark -r shared\pcaps\module-13-http.pcap -Y "http.request" \
  -T fields -e ip.src -e ip.dst -e http.request.method
```

> **SINAV İPUCU:** `-T fields -e field1 -e field2` en çok sorulan tshark komutudur.
>
> Her `-e` bir sütun ekler.

### Çıktı Formatları: JSON ve CSV (-T json, -T csv)

 `-T fields` düz metin verir; yapılandırılmış çıktı için iki format var:

```sh
# JSON: Programatik işlem için (jq ile zincirleme)
tshark -r shared/pcaps/module-13-http.pcap -Y "http.request" \
  -T json -e ip.src -e http.request.method -e http.request.uri

# CSV: Tabloya/Excel'e doğrudan aktarım (her -e bir sütun, üstte header)
tshark -r shared/pcaps/module-13-http.pcap -Y "http.request" \
  -T csv -e frame.number -e ip.src -e http.request.method -e http.request.uri
```

JSON çıktısı `jq` ile işlenir (macOS: `brew install jq`):
```sh
tshark -r shared/pcaps/module-12-dns.pcap -Y "dns" -T json \
  -e dns.qry.name -e dns.flags.response \
| jq -r '.[] .["_index"].dns.qry.name[]?' | sort | uniq -c | sort -rn | head
```
CSV ise `-T csv` + `-e` sütunlarıyla SIEM raporlarına hazır tablo üretir.

> **SINAV İPUCU:** "Bir araca aktarılacak yapılandırılmış çıktı" istenirse:
> `-T json` (nested veri) veya `-T csv` (düz tablo). İkisi de `-e` ile
> seçilen alanları taşıyabilir.

---

## Alıştırma 4: İstatistikler (-z)

### Protocol Hierarchy:

```sh
tshark -r shared/pcaps/module-27-exam-practice.pcap -q -z io,phs
```

### Conversations (TCP):

```sh
tshark -r shared/pcaps/module-13-http.pcap -q -z conv,tcp
```

### Endpoints:

```sh
tshark -r shared/pcaps/module-27-exam-practice.pcap -q -z endpoints,ip
```

### Expert Info:

```sh
tshark -r shared/pcaps/module-08-tcp.pcap -q -z expert
```

> **SINAV İPUCU:** `-z expert` tshark'ın Expert Info'sudur.
>
> Chat, Note, Warn, Error seviyelerini gösterir.

### HTTP İstek İstatistikleri:

```sh
tshark -r shared/pcaps/module-13-http.pcap -q -z http,tree
```

---

## Alıştırma 5: TCP Stream Takibi

```sh
# ASCII olarak TCP stream 0'ı oku
tshark -r shared/pcaps/module-13-http.pcap -q -z follow,tcp,ascii,0

# Tüm TCP stream ID'lerini listele
tshark -r shared/pcaps/module-13-http.pcap -Y "tcp.stream" \
  -T fields -e tcp.stream | sort -n | uniq
```

---

## Alıştırma 6: Export Objects

### HTTP objelerini export et:

```sh
# macOS / Linux
mkdir -p /tmp/tshark-export
tshark -r shared/pcaps/module-13-http.pcap \
  --export-objects http,/tmp/tshark-export

# Windows
mkdir C:\temp\tshark-export
tshark -r shared\pcaps\module-13-http.pcap \
  --export-objects http,C:\temp\tshark-export
```

> **SINAV İPUCU:** `--export-objects` parametresi sınavda sorulur.
>
> HTTP, SMB, DICOM desteği vardır.

---

## Alıştırma 7: Otomasyon Scriptleri

### Repo'nun Kendi Analiz Aracı: shark-tank.lua

Bu repo, bu modülde öğrendiğin her tshark tekniğini tek seferde çalıştıran
bir Lua analiz aracıyla gelir: `shared/shark-tank.lua`. Wireshark'ın Lua
API'siyle yazıldı; tshark üzerinden çalışır — tek pcap veya tam bir dizin
tarar, her pcap'in yanına aynı adda bir `.md` bulgu raporu yazar.

Araç, bu müfredattaki tüm bulgu sınıflarını (port scan, credential
sızıntısı, SQLi/XSS, DNS/ICMP tunneling, Kerberos spray/Kerberoasting (RC4
bilet), SMB brute force/svcctl (PsExec ayak izi), OCSP + sertifika sağlığı,
beaconing, entropy/exfil, fragment overlap...) desen tabanlı tespitle
tarar ve kill-chain sırasına dizilmiş bir Markdown raporu üretir. Kaynak kodunu
okumak, "tshark çıktısı nasıl rapora dönüşür" sorusunun canlı cevabıdır.

> **Otomasyon merakın varsa:** Modül 29 tam sana göre — Lua'nın
> hikâyesini, Wireshark'ı neden Lua'yla konuşturduğumuzu ve bu aracın
> nasıl evrildiğini anlatıyor. Bu bölüm aracı *kullanmayı*, m29 onu
> *anlamayı* öğretir.

### Üç Çalıştırma Yolu

**1) Betikle (repo içi, en kolay):** yukarıdaki `shark-tank.sh` kullanımı.

**2) Doğrudan tshark** (betiksiz — her platformda aynı komut; Wireshark
kurulu olduğu sürece `tshark` PATH'tedir):

```sh
# macOS / Linux
tshark -q -X lua_script:shared/shark-tank.lua -r <pcap>

# Windows
tshark.exe -q -X lua_script:C:\tools\shark-tank.lua -r C:\captures\firma.pcap
```

**3) Wireshark GUI** (menüden yükleme):

- Kalıcı: script'i Lua plugin dizinine kopyala, Wireshark'ı yeniden başlat:
  - macOS/Linux: `~/.local/lib/wireshark/plugins/shark-tank.lua`
  - Windows: `%APPDATA%\Wireshark\plugins\shark-tank.lua`
    (veya `C:\Program Files\Wireshark\plugins\`)
- Menü: **Analyze/Tools > Shark-Tank > Rapor Üret** (açık pcap'i tarar,
  raporu pencerede gösterir; dosya yazılmaz)
- Geçici: **File > Run Lua Script** > `shark-tank.lua` seç > pcap aç >
  aynı menü (betik, dosyayı `retap` ile baştan işler — kaçırdığı paket kalmaz)

Ek modlar:
```sh
SHARK_TANK_JSON=1 ./scripts/shark-tank.sh <pcap>   # yanına .json (SIEM'e)
./scripts/shark-tank.sh <dizin>                    # kampanya görünümü:
                                                   # pcap'ler arası ortak IOC
make test-sharktank                                # regresyon testi:
                                                   # bilinen pcap'lerde beklenen
                                                   # bulgular doğrulanır
```

Kullanım (kolay yol — tek pcap veya dizin):
```sh
./scripts/shark-tank.sh shared/pcaps/module-28-forensics.pcap
./scripts/shark-tank.sh shared/pcaps    # dizindeki tüm pcap/pcapng
```

Doğrudan tshark ile:
```sh
# Tek pcap analizi -> yanına <pcap-adı>.md bulgu raporu yazar
SHARK_TANK_PCAP=shared/pcaps/module-28-forensics.pcap tshark -q \
  -r shared/pcaps/module-28-forensics.pcap \
  -X lua_script:shared/shark-tank.lua
```

GUI'de (Wireshark): script `~/.local/lib/wireshark/plugins/` altına
kopyalanırsa **Tools > Shark-Tank > Rapor Üret** menüsü açılan dosyayı
raporlar.

### Bash (macOS / Linux):

```sh
# Tüm pcap'lerdeki HTTP POST isteklerini bul
for f in shared/pcaps/*.pcap; do
    count=$(tshark -r "$f" -Y 'http.request.method == "POST"' \
      -T fields -e frame.number 2>/dev/null | wc -l)
    if [ "$count" -gt 0 ]; then
        echo "$f: $count POST isteği bulundu"
    fi
done
```

```sh
# Tüm pcap'lerde credentials ara
for f in shared/pcaps/*.pcap; do
    results=$(tshark -r "$f" -Y 'http.request.method == "POST"' \
      -T fields -e http.file_data 2>/dev/null | grep -i "password")
    if [ -n "$results" ]; then
        echo "=== $f ==="
        echo "$results"
    fi
done
```

### PowerShell (Windows):

```sh
# Tüm pcap'lerde DNS sorgularını listele
Get-ChildItem shared\pcaps\*.pcap | ForEach-Object {
    $f = $_.Name
    $count = (tshark -r $_.FullName -Y "dns.flags.response == 0" `
      -T fields -e dns.qry.name 2>$null | Measure-Object).Count
    if ($count -gt 0) {
        Write-Host "$f : $count DNS sorgusu"
    }
}
```

```sh
# Port scan tespiti
tshark -r shared\pcaps\module-28-forensics.pcap `
  -Y "tcp.flags.syn==1 && tcp.flags.ack==0" `
  -T fields -e ip.src -e tcp.dstport `
  | Group-Object ip.src | Select-Object Name, Count
```

---

## Alıştırma 8: Capture (Canlı Yakalama)

```sh
# Canlı capture (sudo gerekli)
# macOS / Linux:
sudo tshark -i en0 -c 100 -w /tmp/capture.pcap

# Sadece HTTP yakala:
sudo tshark -i en0 -f "tcp port 80" -c 50

# Capture filter ile DNS:
sudo tshark -i en0 -f "udp port 53" -c 20
```

> **Not:** Bu lab'de capture Docker içinde `tcpdump` ile yapılır.
>
> tshark capture için host'ta çalıştırılmalıdır.

---

## Alıştırma 9: Dosya Çıkarma + SHA-256 Hash (DFIR Zinciri)

Ağdan çıkardığın dosyanın kimliğini hash ile sabitlersin — IOC
raporlamasının temel adımı.

### Adımlar:

1. HTTP nesnelerini çıkar (modül 13 pcap'i üzerinde):

```sh
tshark -r shared/pcaps/module-13-http.pcap \
  --export-objects http,/tmp/tshark-export
ls -la /tmp/tshark-export/
```

2. Çıkan dosyalardan birinin SHA-256 özetini hesapla:

```sh
shasum -a 256 /tmp/tshark-export/auth
# 8d68183a32c2704d866573989f4b1574d756c6f24ea1d01901fb99a400c67932
```

3. Hash ne için kullanılır?

| Kullanım | Nasıl |
|----------|-------|
| IOC paylaşımı | Hash'i rapora yaz — herkes aynı dosyayı tanır |
| Bilinen zararlı sorgusu | VirusTotal/MalwareBazaar'da ara |
| Bütünlük kanıtı | İki pcap'ten çıkan dosya aynı mı? |

> **SINAV İPUÇLARI:**
>
> - SHA-256, dosyanın içeriğinden üretilir; ad değişse de aynı kalır
> - `--export-objects` http dışında smb, tftp, imf da destekler
> - Karşılaştırma sorularında: aynı hash = aynı içerik, isim/URL önemsiz

> **İstihbarat İşaretleri, Hash:**
>
> - Bilinen zararlı hash'i VirusTotal eşleşmesiyle doğrulanır
> - Hash içerikten üretilir: TLS şifreliyse export boş döner — önce
>   şifre çöz (modül 16), sonra çıkar (bu alıştırma)

---

## Hızlı Referans: Tshark Parametreleri

| Parametre | Açıklama | Örnek |
|-----------|----------|-------|
| `-r file` | Pcap oku | `tshark -r file.pcap` |
| `-w file` | Pcap yaz | `tshark -r in.pcap -Y "http" -w http.pcap` |
| `-Y filter` | Display filter | `tshark -r f.pcap -Y "http.request"` |
| `-f filter` | Capture filter (BPF) | `tshark -i eth0 -f "tcp port 80"` |
| `-c N` | N paket göster | `tshark -r f.pcap -c 10` |
| `-T fields` | Alan çıktısı | `tshark -r f.pcap -T fields -e ip.src` |
| `-T json` | JSON çıktı | `tshark -r f.pcap -T json -e ip.src` |
| `-T csv` | CSV çıktı | `tshark -r f.pcap -T csv -e frame.number -e ip.src` |
| `-e field` | Alan belirt | `-e ip.src -e ip.dst -e tcp.port` |
| `-X lua_script` | Lua script yükle | `tshark -X lua_script:shared/shark-tank.lua -r f.pcap` |
| `-q` | Sessiz (istatistik için) | `tshark -r f.pcap -q -z io,phs` |
| `-z stat` | İstatistik | `-z io,phs` `-z conv,tcp` `-z expert` |
| `--export-objects` | Obje export | `--export-objects http,/tmp/out` |
| `-i iface` | Arayüz (capture) | `tshark -i eth0` |
| `-V` | Detaylı çıktı | `tshark -r f.pcap -V` |
| `-O proto` | Sadece protokol detayı | `tshark -r f.pcap -O http` |

> **Aile notu:** pcap birleştirme/silme/dilimleme araçları `mergecap` ve
> `editcap` Modül 21'de (gelişmiş yakalama) işlenir; tshark okur, onlar
> pcap dosyaları üzerinde yazar.

> Lua script yazma merakı: bkz. Modül 29 (Lua ile Otomasyon).

---

## Sınav Soruları (Çöz)

1. `tshark -r file.pcap -Y "dns" -c 5` komutu ne yapar?
2. `-Y` ve `-f` parametreleri arasındaki fark nedir?
3. Bir pcap'deki tüm IP adreslerini nasıl listelersin (tekrarsız)?
4. `tshark -r file.pcap -q -z expert` ne gösterir?
5. HTTP POST body'deki şifreleri tshark ile nasıl bulursun?
6. `--export-objects http,/tmp/out` ne yapar? Hangi durumlarda kullanılır?
7. Tüm pcap'lerde SYN flood tespiti yapan bir Bash scripti yaz.

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. file.pcap dosyasını okur, "dns" display filter'ını uygular ve sadece ilk 5 paketi gösterir.

2. `-Y` display filter'dır (pcap okunurken filtreler, kayıp yok). `-f` capture filter'dır (BPF syntax, sadece eşleşen paketler yakalanır, diğerleri kaybolur).

3. `tshark -r file.pcap -T fields -e ip.src -e ip.dst | tr '\t' '\n' | sort -u`

4. Expert Info'u gösterir: Chat, Note, Warning, Error seviyelerinde TCP/IP sorunlarını listeler. Retransmission, duplicate ACK, zero window gibi sorunları tespit eder.

5. `tshark -r file.pcap -Y 'http.request.method == "POST"' -T fields -e http.file_data` ile POST body'leri çıkarılır, `grep -i password` ile filtrelenir.

6. HTTP response body'lerini (resim, dosya, JSON vb.) belirtilen dizine kaydeder. GUI'deki File > Export Objects > HTTP ile aynıdır. Web forensics'te kullanılır.

7. `for f in shared/pcaps/*.pcap; do count=$(tshark -r "$f" -Y "tcp.flags.syn==1 && tcp.flags.ack==0" 2>/dev/null | wc -l); if [ "$count" -gt 10 ]; then echo "ALERT: $f - $count SYN paketi"; fi; done`

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
