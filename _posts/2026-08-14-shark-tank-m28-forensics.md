---
layout: post
title:  "shark-tank - m28: Ağ Forensics"
date:   2026-08-14 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 28: Ağ Forensics

**Neden?** Büyük resim. Bir saldırgan ağa sızdı. Tüm aşamaları pcap'te izliyorsun. Kill chain: Reconnaissance (port scan) → weaponization → delivery (SQL injection, XSS) → exploitation → installation (C2 beaconing) → command & control → exfiltration (DNS tunneling, yüksek entropili POST gövdeleri). Her aşama farklı bir protokolde iz bırakır. Bu modülde, kill chain'in tamamını pcap'ten yeniden oluşturmayı ve sızıntının "görünmez" biçimini (entropy analiziyle) yakalamayı öğreneceksin.

**Görev:** Forensics pcap'ini analiz et. Tüm senaryoları çöz. Kill chain'i oluştur.

**Öğrenim Hedefleri:**
- Kill chain'in her aşamasını (reconnaissance → weaponization → delivery → exploitation → installation → C2 → exfiltration) pcap'te tespit edebilmek
- Port scan, SYN flood, SQL injection, XSS, FTP brute force gibi saldırıları Wireshark'ta tanıyabilmek
- C2 beaconing ve DNS exfiltration gibi ileri düzey gizleme tekniklerini analiz edebilmek
- IOC (Indicator of Compromise) çıkarıp saldırgan profilini oluşturabilmek
- Tüm modülleri birleştirip kapsamlı bir güvenlik olay raporu (incident report) yazabilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **pcap** | Packet Capture: Ağ trafiğinin yakalanıp kaydedildiği dosya formatı. Bir pcap dosyası, ağ kartından geçen her paketin kopyasını alır ve zaman damgasıyla birlikte saklar. Güvenlik analistleri bir olayı incelerken "ağda ne oldu?" sorusunun cevabını pcap dosyasında arar. Wireshark ile açıldığında her paket katman katman (Ethernet → IP → TCP → uygulama) görüntülenebilir. Ders boyunca `shared/pcaps/` klasöründeki pcap dosyaları üzerinde çalışacaksın. |
| **Follow TCP Stream** | Wireshark'ın bir TCP bağlantısındaki tüm veriyi baştan sona tek pencerede gösteren özelliği. Bir HTTP oturumunu, bir FTP transferini veya bir email gönderimini tam olarak görmek için kullanılır. Paket listesindeki herhangi bir pakete sağ tıklayıp "Follow > TCP Stream" seçilerek açılır. İstemcinin gönderdiği veri (request) ve sunucunun yanıtı (response) farklı renklerle ayrılarak görüntülenir. Sınavda credential sızıntısı, SQL injection payload'ı veya email içeriği gibi verileri hızlıca okumak için en kullanışlı araçtır. |
| **Export Objects** | Wireshark'ın bir pcap içinde transfer edilen dosyaları (HTTP response body'leri, resimler, belgeler, indirilen dosyalar) otomatik olarak çıkarıp diske kaydeden özelliği. `File → Export Objects → HTTP` menüsünden açılır. Pcap'te geçen tüm HTTP yanıt içeriklerini listeler ve herhangi birini kaydetmene izin verir. Ağ forensics'te kritik bir araçtır: Bir saldırganın indirdiği bir dosyayı, bir web sunucusundan çekilen bir zararlıyı (malware) veya sızdırılan bir belgeyi orijinal halinde kurtarmak için kullanılır. tshark'ta `--export-objects http,/tmp/output` parametresiyle de kullanılabilir. |
| **Expert Information** | Wireshark'ın pcap içindeki anormallikleri ve sorunları otomatik olarak tespit edip listelediği panel. `View > Expert Information` (Ctrl+Alt+Shift+E) menüsünden açılır. Sorunları dört ciddiyet seviyesinde gruplar: Error (kırmızı), Warn (sarı), Note (mavi), Chat (yeşil). Bir analist pcap'i açtığında ilk bakması gereken yerlerden biridir; çünkü retransmission, duplicate ACK, zero window, HTTP 404 gibi sorunları paket tek tek aranmadan özet olarak gösterir. |
| **Protocol Hierarchy** | Wireshark ve tshark'ın bir pcap içindeki protokolleri katman katman özetleyen istatistik aracı. Her protokolün pcap içindeki paket sayısını ve yüzde oranını gösterir: Örneğin "%85 TCP, %60 HTTP, %20 DNS, %15 ARP" gibi. Bu özet, pcap'in genel içeriğini hızlıca anlamak için ilk bakılan araçtır. GUI'de `Statistics > Protocol Hierarchy`, tshark'ta `-q -z io,phs` komutuyla kullanılır. |

## Teori

Ağ forensics, yakalanmış trafik üzerinden güvenlik olaylarını analiz etmektir.
Wireshark ile tespit edilebilen yaygın saldırı ve anomali türleri:

| Saldırı Türü | Wireshark'ta Görünümü |
|-------------|----------------------|
| Port Scan | Çok fazla SYN paketi (farklı portlara) |
| SYN Flood | Aynı porta çok sayıda SYN |
| Brute Force | Aynı servise çok sayıda login denemesi |
| DNS Exfiltration | Aşırı uzun veya sık DNS sorguları |
| Data Exfiltration | Yüksek miktarda dışarı veri gönderme |
| Command & Control | Düzenli aralıklarla belirli bir sunucuya bağlantı |
| ARP Spoofing | Aynı IP için farklı MAC adresleri |
| XSS / SQLi | HTTP request'lerde zararlı payload'lar |

> **İstihbarat İşaretleri, Gerçek dünya forensics'i bu tablodan çok daha karmaşıktır:**
>
> - Port scan + SYN flood + SQLi + XSS aynı pcap'de = **Gerçek incident**: Saldırılar tek gelmez
> - **Zamanlama analizi** kritik: Saldırı ne zaman başladı, ne zaman bitti, öğle arası var mı?
> - `ip.src == 172.50.2.200` ile tüm saldırgan aktivitesini filtrele: **davranış kalıbını** çıkar
> - **User-Agent** string'leri önemli: `sqlmap`, `nikto`, `nmap` = otomatize araç (script kiddie göstergesi)
> - Unutma: Her "saldırı" gerçek bir saldırı değildir. Ama **yanlış teşhis** de bir hatadır

## Hazırlık

```sh
./scripts/generate-traffic.sh forensics
# macOS: open -a Wireshark module-28-forensics.pcap
# Linux: wireshark module-28-forensics.pcap &
# Windows: start wireshark module-28-forensics.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

---

## SENARYO 1: Port Scan Tespiti

### Filtre:
```text
tcp.flags.syn == 1 && tcp.flags.ack == 0
```

### Analiz:
1. Tek bir IP'den (172.50.2.200) çok fazla farklı porta SYN gönderiliyor
2. Her port için:
   - **SYN-ACK geldi** = port AÇIK
   - **RST geldi** = port KAPALI
   - **Cevap yok** = filtrelenmiş (firewall)

### İstatistik:
```text
Statistics > Conversations > TCP
```
- Attacker (172.50.2.200) ile hedef arasında çok fazla kısa süreli bağlantı

> **SINAV İPUCU:** Port scan tespitinde:
>
> - Aynı kaynaktan kısa sürede çok fazla farklı porta bağlantı = SCAN
> - SYN Scan: Sadece SYN gönderilir, RST ile kapatılır
> - Connect Scan: Tam TCP handshake yapılır

### Nmap Scan Tipleri:

| Scan Tipi | Wireshark'ta | Filtre |
|-----------|-------------|--------|
| **SYN Scan** (-sS) | SYN -> SYN-ACK -> RST | `tcp.flags.syn==1 && tcp.flags.ack==0` |
| **Connect Scan** (-sT) | SYN -> SYN-ACK -> ACK -> RST | `tcp.flags.reset==1` |
| **UDP Scan** (-sU) | UDP paketleri | `udp` |
| **FIN Scan** (-sF) | FIN paketleri | `tcp.flags.fin==1 && tcp.flags.syn==0 && tcp.flags.ack==0` |

---

## SENARYO 2: Brute Force Tespiti

### Filtre:
```text
http.request.method == "POST" && http.request.uri contains "login"
```

### Analiz:
1. Aynı IP'den çok sayıda POST /login isteği
2. Her istekte farklı şifre denemesi
3. Response'larin çoğu 401 veya 403

### Zamanlama Analizi:
```text
frame.time_relative
```
- Brute force'ta istekler çok sık aralıklarla gelir (ms seviyesi)

> **SINAV İPUCU:** Çok sayıda başarısız login denemesi = brute force.

---

## SENARYO 3: SYN Flood Tespiti

### Filtre:
```text
tcp.flags.syn == 1 && tcp.flags.ack == 0 && ip.src == 172.50.2.200
```

### Analiz:
1. Aynı IP'den aynı porta çok sayıda SYN paketi
2. SYN-ACK gönderiliyor ama ACK (3. handshake adımı) gelmiyor
3. Sunucu yarısı-açık bağlantılarla doluyor

### İstatistik:
```text
Statistics > Conversations > TCP
```
- Çok fazla "TCP half-open" bağlantı görünür

> **SINAV İPUCU:** SYN Flood = SYN gönderilir, SYN-ACK alınır, AMA
>
> 3-way handshake tamamlanmaz (ACK gönderilmez).

---

## SENARYO 4: FTP Brute Force Tespiti

Bu pcap'te Attacker (172.50.2.200) FTP sunucusuna (172.50.2.15) brute force yapıyor.

### Filtre:
```text
ftp.request.command == "PASS"
```

### Analiz:
1. Aynı IP'den 7 farklı şifre denemesi:
   - `wrong1`, `wrong2`, `wrong3`, `wrongpassword`, `admin123`, `letmein`, `pass123`
2. Her başarısız denemede FTP response code 530 (Login incorrect)
3. Son denemede `ftppass123` ile başarılı giriş (response code 230)

### Başarısız Giriş:
```text
USER ftpuser
PASS wrong1
Response: 530 Login incorrect
```

### Başarılı Giriş:
```text
USER ftpuser
PASS ftppass123
Response: 230 Login successful
```

### Zamanlama Analizi:
```text
frame.time_relative
```
- Bu pcap'te denemeler ~3.2-3.5 saniye aralıklı gelir (lab üretimi sleep'i; otomatize aracın tipik ms-seviyesi hızına kıyasla yavaş)
- Aralıkların makine gibi düzenli (saati ölçülebilir sabitlik) olması otomasyonu ele verir; insan denemeleri düzensiz aralıklı olur

> **SINAV İPUCU:** FTP brute force tespiti:
>
> - Aynı kullanıcı adına çok sayıda farklı şifre denemesi
> - 530 (Login incorrect) response'larının sayısı
> - Denemeler arası süre çok kısaysa (ms seviyesi) otomatize araçtır

---

## SENARYO 5: Veri Sızıntısı Tespiti

### Filtre:
```text
http.response && ip.src == 172.50.2.10 && tcp.len > 500
```

### Analiz:
1. Büyük HTTP response'lar - hassas veri sızıntısı olabilir
2. Content-Type kontrolü:
```text
http.content_type contains "json" && http contains "secret"
```
3. Hassas veri içeren response'lari bul

### Wireshark ile İçerik Arama:
**Edit > Find Packet > String**
- "password", "secret", "token", "key", "flag" gibi kelimeler

> **SINAV İPUCU:** Hassas veri aramak için:
>
> - `http contains "password"` - HTTP'de şifre
> - `ftp contains "PASS"` - FTP'de şifre
> - `dns.qry.name contains "flag"` - DNS'de veri

---

## SENARYO 6: DNS Exfiltration

### Filtre:
```text
dns.qry.name.len > 30
```

### Analiz:
DNS exfiltration, veriyi DNS sorgularına gizleyerek dışarıya sızdırmadır:
```text
Normal:    web.shark-tank.local
Şüpheli:   c2RiYXNlNjRlbmNvZGVkZGF0YQ.evil.attacker.com
```

- Aşırı uzun subdomain adı = base64 ile encode edilmiş veri olabilir
- Çok sık DNS sorguları = veri sızdırma olabilir

> **SINAV İPUCU:** DNS exfiltration:
>
> - Uzun domain isimleri (subdomain'lere veri gizlenir)
> - Çok sık DNS sorguları
> - Az olabilir ama suspicious domainlere giden sorgular

---

## SENARYO 6b: Entropy Analizi — Exfil POST'u Yakalamak

Sızıntı her zaman uzun domain'lerde gizlenmez. Bu pcap'te exfil'in ikinci
yolu **POST gövdesinde**: Saldırgan (172.50.2.200), 2048 byte'lık
**yüksek entropili base64 veriyi** normal bir tarayıcı User-Agent'ıyla
`POST /api/data`'ya göndermiş.

### Entropy (Shannon) Nedir?

**Entropy**, bir veri kümesindeki belirsizliktir: Kompreslenmiş/şifreli
veri her byte'ın eşit olasılıkla çıkmasına yol açtığından **yüksek
entropy** gösterir (base64 için teorik üst sınır ~6.0 bit/karakter).
İnsan metni, form verisi, JSON gibi yapılar tekrarlıdır: **düşük
entropy** (tipik 3.5-4.5 bit/karakter).

| Gövde | Lab Ölçümü (gerçek) |
|-------|---------------------|
| Benign POST: `username=employee&password=companySecret2024` | **4.1371 bit/char** (44 byte) |
| Exfil POST: base64(random) gövde | **5.9784 bit/char** (2048 byte, 64 benzersiz sembol) |

### Adımlar:

1. Şüpheli POST'u bul:
   ```text
   http.request.method == "POST" && http.content_length > 1500
   ```
2. Follow TCP Stream ile gövdeyi gör: Anlamsız base64 bloğu — bir
   form alanı, bir JSON yok. `Content-Type: application/octet-stream`.
3. Karşılaştır: Normal `/auth` POST'u okunabilir form verisidir.
4. (Opsiyonel) Hesapla — tshark + python:
   ```sh
   tshark -r shared/pcaps/module-28-forensics.pcap -q \
     -z follow,tcp,ascii,<stream> 2>/dev/null \
   | sed -n '/Content-Length: 2048/,$p' | grep -E '^[A-Za-z0-9+/=]+$' \
   | python3 -c "import sys,math,collections; s=sys.stdin.read().strip(); c=collections.Counter(s); n=len(s); print('%.4f bit/char' % (-sum(v/n*math.log2(v/n) for v in c.values())))"
   ```

### Anomali Tablosu:

| Gösterge | Değer | Yorum |
|----------|-------|-------|
| Content-Length | 2048 (benign: 44) | 46 kat büyük gövde |
| Entropy | 5.98 (benign: 4.14) | Şifreli/sıkıştırılmış veri |
| User-Agent | `Mozilla/5.0 (Windows NT 10.0...)` | curl değil — kimlik gizleme |
| Content-Type | application/octet-stream | Form değil, binary |

**Sonuç:** Tek bir "şifreli görünümlü büyük POST", DNS exfil'i kadar
konuşkan bir IOC'dir. Sınavda "en şüpheli POST hangisi ve neden?"
sorusunun cevabı: en büyük + en yüksek entropy'li + sahte UA'lı olan.

> **SINAV İPUCU:** Entropy hesaplaması çoğu kez "yüksek/düşük" olarak
> sorulur: Anlamsız, sıkıştırılmış görünümlü, tekrarsız gövde = yüksek
> entropy = exfil/şifreli C2 adayı. Okunabilir form/JSON = düşük.

---

## SENARYO 7: Şüpheli HTTP Request'ler

### SQL Injection:
```text
http.request.uri contains "'" ||
http.request.uri contains "UNION" ||
http.request.uri contains "SELECT"
```

### XSS (Cross-Site Scripting):
```text
http.request.uri contains "<script>" ||
http.request.uri contains "javascript:"
```

### Directory Traversal:
```text
http.request.uri contains "../" || http.request.uri contains "..%2f"
```

### Command Injection:
```text
http.request.uri contains ";" ||
http.request.uri contains "|" ||
http.request.uri contains "`"
```

> **SINAV İPUCU:** Şüpheli URL karakterleri görürsen saldırı girişimi olabilir.

---

## SENARYO 8: Zamanlama Anomalisi (Beaconing)

### Filtre:
```text
http.user_agent contains "Beacon"
```

Bu pcap'te C2 beaconing simülasyonu **vardır**. Saldırgan (172.50.2.200) düzgün aralıklarla web sunucusuna HTTP istekleri gönderir:

```text
# Beaconing isteklerini bul:
http.user_agent contains "Beacon"

# IO Graph ile periyodik deseni gör:
# Statistics → IO Graph → Filter: ip.src == 172.50.2.200 && http
```

C2 (Command & Control) beaconing özellikleri:
- **Düzenli aralıklar** (bu pcap'te ~2 saniyede bir)
- **Sabıt URL pattern** (`/api/data?sid=1`, `?sid=2`, ...)
- **Belirgin User-Agent** (`Mozilla/5.0 (Beacon)`)
- Gerçek dünyada TLS ile şifreli olabilir (bu pcap'te HTTP)

### Analiz:
1. `http.user_agent contains "Beacon"` ile beaconing isteklerini listele
2. **Time** sütunundaki aralıklara bak: ~2 saniye düzenli aralık
3. **Statistics → IO Graph** ile `ip.src == 172.50.2.200 && http` filtresi uygula
4. Grafikte periyodik dik çizgiler = beaconing deseni

> **SINAV İPUCU:** Düzenli aralıklarla aynı sunucuya bağlantı = C2 beaconing.
>
> IO Graph'te periyodik tepeler, belirgin User-Agent ve sabit URL pattern en önemli göstergelerdir.

---

## SENARYO 9: Trafik Profili Oluşturma

Bir pcap'de neler olduğunu anlamak için:

### Adım 1: Genel Bakış
```text
Statistics > Protocol Hierarchy
```
- Hangi protokoller var? Yüzde kaç?

### Adım 2: Konuşan IP'ler
```text
Statistics > Conversations > IPv4
```
- En çok konuşan IP'ler
- Beklenmeyen IP'ler

### Adım 3: Endpoint'ler
```text
Statistics > Endpoints > IPv4
```
- Ağdaki tüm cihazlar

### Adım 4: Akış Grafiği
```text
Statistics > Flow Graph
```
- Görsel olarak tüm bağlantılar

### Adım 5: HTTP Obje Export
```text
File > Export Objects > HTTP
```
- Transfer edilen dosyaları kurtar

---

## SENARYO 10: Kill Chain ve Incident Report

Tüm senaryoları birleştirerek saldırganın kill chain'ini yeniden oluştur ve bir güvenlik olay raporu yaz.

### Kill Chain Tablosu:

| Aşama | Tespit | Bulgu |
|-------|--------|-------|
| **1. Reconnaissance** | Port scan (SYN scan) | Attacker 172.50.2.200 → web, https, ftp |
| **2. Weaponization** | User-Agent analizi | `Sqlmap/1.5` gibi otomatize araçlar: Saldırgan önceden hazırlık yapmış |
| **3. Delivery** | HTTP + FTP istekleri | SQLi payload'ları, XSS payload'ları, FTP brute force |
| **4. Exploitation** | SQL injection, XSS | `UNION SELECT`, `<script>` URL parametrelerinde |
| **5. Installation** | Beaconing (düzenli TLS) | HTTPS /secure-data'ya her 1 sn'de bir bağlantı: C2 kurulumu |
| **6. C2** | Zamanlama anomalisi | Düzenli aralıklı TLS bağlantıları (beaconing) |
| **7. Exfiltration** | DNS exfiltration, HTTP | Uzun DNS sorguları, HTTP'de credential sızıntısı |

### Incident Report (Güvenlik Olay Raporu)

Aşağıdaki şablonu kullanarak bir incident report yaz:

```text
# GÜVENLİK OLAY RAPORU

## 1. Özet
- Tarih: [pcap tarihi]
- Saldırgan IP: 172.50.2.200
- Hedef IP'ler: 172.50.2.10 (Web), 172.50.2.13 (HTTPS),
  172.50.2.15 (FTP)
- Saldırı Türü: Çok aşamalı (multi-stage) siber saldırı

## 2. Zaman Çizelgesi (Timeline)
| Zaman | Olay |
|-------|------|
| [ilk paket] | Port scan başladı |
| ... | SYN flood saldırısı |
| ... | HTTP brute force |
| ... | FTP brute force |
| ... | SQL injection + XSS denemeleri |
| ... | C2 beaconing başladı |
| [son paket] | DNS exfiltration |

## 3. Tespit Edilen Zafiyetler
1. HTTP şifresiz (credential sızıntısı)
2. FTP şifresiz (brute force)
3. DNS exfiltration (güvenlik duvarı engellememiş)
4. SYN flood (DoS)
5. C2 beaconing (IDS/IPS tespit edememiş)

## 4. IOC (Indicator of Compromise)
- IP: 172.50.2.200
- User-Agent: curl, Sqlmap/1.5
- Domain'ler: exfil.shark-tank.local
- Port'lar: 80, 443, 21, 8080

## 5. Öneriler
1. HTTP yerine HTTPS zorunlu tutulmalı
2. FTP yerine SFTP/SCP kullanılmalı
3. DNS filtreleme (uzun domain isimleri engellenmeli)
4. Rate limiting (brute force koruması)
5. C2 beaconing tespiti için TLS metadata analizi
```

### Ne Yapmalısın?
1. Yukarıdaki şablonu kullanarak kendi raporunu yaz
2. Wireshark'tan aldığın kanıt paket numaralarını ekle
3. Her bulgu için bir filtre referansı ver
4. Raporu `docs/incident-report.md` olarak kaydet

> **SINAV İPUCU:** Gerçek bir SOC analisti gibi düşün: Bulgu + Kanıt + Öneri.
>
> Incident report, teknik analizi yönetime anlatmanın en etkili yoludur. WCNA sınavında rapor yazma sorusu çıkabilir.

---

## Hızlı Referans - Forensics Filtreleri

```text
# Port Scan
tcp.flags.syn == 1 && tcp.flags.ack == 0 && tcp.flags.reset == 0
tcp.flags.syn == 1 && ip.src == 172.50.2.200

# SYN Flood
tcp.flags.syn == 1 && tcp.flags.ack == 0 && tcp.dstport == 80

# Brute Force
http.request.method == "POST" && http contains "pass"

# SQL Injection
http.request.uri contains "'" || http.request.uri contains "UNION"

# XSS
http.request.uri contains "<script>"

# DNS Exfil
dns.qry.name.len > 30
dns.qry.name matches "[A-Za-z0-9+/]{20,}"

# Data Exfil
tcp.len > 1000 && ip.src == <hedef>

# Suspicious User-Agent
http.user_agent matches "(?i)(nikto|sqlmap|nmap|dirbuster|metasploit)"

# Tor/Proxy
tcp.dstport == 9050 || tcp.dstport == 9051

# İçerik arama (tüm paketlerde)
frame contains "password"
frame contains "secret"
frame contains "flag{"

# Broadcast/Anomali
eth.dst == ff:ff:ff:ff:ff:ff && !arp && !dhcp
```

---

## Forensics Is Akışı (Sınavda Takip Et)

```text
1. PCAP'i aç
2. Statistics > Protocol Hierarchy  -> Genel bakış
3. Statistics > Conversations        -> Kim kimle konuşuyor?
4. Statistics > Endpoints            -> Tüm cihazlar
5. Şüpheli IP belirle               -> Filtre uygula
6. Follow TCP Stream                -> Oturum oku
7. İçerik arama                     -> password, secret, flag
8. File > Export Objects            -> Dosyaları kurtar
9. Zamanlama analizi                -> Beaconing, scan
10. Raporla                         -> Bulgu ve kanıtlar
```

## Sınav Soruları (Çöz)

1. Attacker IP'si kaçtır? Hangi IP'yi hedefledi?
2. Port scan sonucunda hangi portlar açık bulundu?
3. SYN flood saldırısı kaç SYN paketinden oluşuyor?
4. Ağda veri sızıntısı var mı? Hangi protokol üzerinden?
5. Şüpheli DNS sorguları var mı? Açıkla.
6. HTTP içerisinde SQL injection veya XSS girişimi var mı?
7. Toplam kaç farklı protokol görüldü? En çok hangisi?
8. Attacker'in nmap taraması hangi scan tipiyle yapıldı? (SYN mi Connect mi?)

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. 172.50.2.200. Hedef: 172.50.2.10 (Web), 172.50.2.13 (HTTPS), 172.50.2.15 (FTP)
2. 21 (FTP), 80 (HTTP), 443 (HTTPS): SYN-ACK alınan portlar. FTP PASV data port'u da açık görünebilir.
3. Bu pcap'te saldırgandan 41 adet SYN paketi vardır (`ip.src==172.50.2.200 && tcp.flags.syn==1 && tcp.flags.ack==0`).
4. HTTP POST ile credentials: Username=employee&password=companySecret2024. /large endpoint'ten boyut değişkendir. Content-Length header'ını kontrol et. (veri sızıntısı şüphesi)
5. Normal DNS sorguları var (web, secure, google) **ve** DNS exfiltration da var: `c2F1c2FnZS1k...exfil.shark-tank.local` — base64 subdomain'li sorgular (`dns.qry.name.len > 30` ile bulunur).
6. Evet! GET /api/data?id=1'+UNION+SELECT+*+FROM+users-- (SQLi) ve GET /api/data?q=<script>document.cookie</script> (XSS)
7. TCP, UDP, ICMP, ARP: Protocol Hierarchy'de TCP altında HTTP/FTP/TLS, UDP altında DNS görülür. En çok TCP paketi vardır.
8. SYN scan (-sS). SYN paketi gönderip SYN-ACK gelirse "open", RST gelirse "closed" der. Connect scan olsaydı tam handshake yapardı.

</details>

---

**Tebrikler!** Tüm modülleri tamamladın.

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!

