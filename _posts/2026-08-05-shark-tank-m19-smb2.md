---
layout: post
title:  "shark-tank - m19: SMB2 Analizi"
date:   2026-08-05 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 19: SMB2 Analizi

**Neden?** Şirketin dosya sunucusundan gizli belgeler dışarı sızdı.
Windows ağlarında dosya paylaşımının kalbi SMB2'dir: Ağ sürücüleri,
yazıcı kuyrukları, hatta uzak yönetim — hepsi aynı protokolün üzerinde.
Saldırganlar için SMB2 çok değerlidir: Parola denemeleri (password spray)
sessizce logon failure üretir, paylaşılan dosyalar exfiltration kanalıdır
ve zayıf yapılandırılmış oturumlar geçiş noktasıdır. Bu modülde, SMB2
oturum akışını adım adım okumayı, dosya operasyonlarını takip etmeyi ve
parola denemesi izlerini tespit etmeyi öğreneceksin.

**Görev:** SHARK-TANK.LOCAL dosya sunucusunun SMB2 trafiğini analiz et.

**Öğrenim Hedefleri:**
- SMB2 oturum kurma zincirini (negotiate → session setup → tree connect)
  adım adım takip edebilmek
- Kerberos ile NTLM oturum kurma farkını tespit edebilmek
- Dosya operasyonlarını (Create, Read, Write, Delete) izleyip hangi
  dosyada ne yapıldığını çıkarabilmek
- STATUS_LOGON_FAILURE serilerinden parola denemesi tespit edebilmek
- SMB1'e göre SMB2'nin getirdiği iyileştirmeleri sayabilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **SMB2** | Server Message Block version 2: Windows ağlarında dosya ve yazıcı paylaşımının modern protokolü. TCP 445 portunda çalışır. SMB1'in (WannaCry gibi saldırıların yolu) güvenlik zaaflarına yanıt olarak tasarlandı: İmzalama desteği geliştirildi, oplock mantığı kiralamaya (lease) döndü, komut seti sadeleşti. Wireshark'ta `smb2` filtresiyle görüntülenir. |
| **Negotiate** | Oturumun ilk eli sıkışması: İstemci desteklediği SMB sürümlerini ve yetenekleri (örn. 2.1, 3.1.1, şifreleme, çok kanal) gönderir; sunucu en yüksek ortak sürümü seçer. `smb2.cmd == 0` paketlerinde dialect listesi görünür. |
| **Session Setup** | Kimlik doğrulama adımı: Kerberos biletli (AP-REQ, modül 17'nin 3. aşaması) veya NTLM (karşılaştırma yanıtına dayalı) olabilir. SPNEGO pazarlığı mekanizmayı belirler. Parola spreyleri bu adımda STATUS_LOGON_FAILURE üretir. |
| **Tree Connect** | Paylaşım bağlama: İstemci `\\sunucu\paylaşım` adına bağlanır (örn. `\\dc\shark-share`). Bağlanan ağaç, sonraki tüm dosya operasyonlarının kapsayıcısıdır. IPC$ ise adlandırılmış kanallar için özel paylaşımıdır ve istemciler önce ona bağlanır. |
| **SMB imzalama** | Her SMB paketinin HMAC ile imzalanması: Ortadaki saldırgan (MITM) paketleri değiştiremez. Kerberos oturumlarında otomatik etkindir; NTLM'de yapılandırma gerektirir. Relay saldırılarına karşı ana savunmadır. |
| **NT_STATUS kodları** | SMB2 yanıtlarının sonuç kodları: 0x0 başarılı; 0xc000006d STATUS_LOGON_FAILURE (parola yanlış); 0xc0000022 STATUS_ACCESS_DENIED (yetki yok); 0xc0000034 STATUS_OBJECT_NAME_NOT_FOUND (dosya yok). `smb2.nt_status` alanında görünür. |
| **NTLM** | NT Lan Manager: Kerberos alternatifi, challenge/response temelli Windows kimlik doğrulama protokolü. Sunucu rastgele bir challenge gönderir; istemci parola türevli hash ile yanıtlar — parola ağda iletilmez ama paroladan üretilen zayıf hash'ler yakalanıp çevrimdışı kırılabilir. NTLMSSP (NEGOTIATE → CHALLENGE → AUTH üçlüsü) paketlerde ayrı görünür; relay saldırılarına açık olduğu için modern ortamlarda Kerberos tercih edilir. |
| **SPNEGO** | Simple and Protected NEGOtiation: İstemci ile sunucunun "hangi kimlik doğrulama mekanizmasını kullanalım?" sorusunu cevaplayan pazarlık katmanı. Session Setup paketlerinin Security Blob'unda taşınır ve desteklenen mekanizmaları OID listesi olarak sunar (Kerberos, NTLM). Wireshark'ta `spnego` olarak çözümlenir; hangi OID seçildiyse oturum o mekanizmayla kurulur. |
| **IPC$** | Inter-Process Communication paylaşımı: Her Windows sunucusunda bulunan, dosya değil adlandırılmış kanalları (named pipes) sunan gizli yönetim paylaşımı. SMB istemcileri asıl paylaşıma bağlanmadan önce IPC$'e bağlanıp DFS yönlendirmesi ve kanal sorguları yapar — bu yüzden trafikte IPC$ bağlantısı görmek normal akışın parçasıdır, ayrıca uzaktan yönetim araçlarının (psexec vb.) da giriş kapısıdır. |

## Teori

SMB2 oturumu dört aşamalı bir zincirle kurulur:

```text
İstemci                        Sunucu (dc, TCP 445)
  |                                |
  |-- Negotiate (sürüm listesi) -->|   1. Anlaş
  |<-- Negotiate (SMB 3.1.1) ------|
  |                                |
  |-- Session Setup (AP-REQ) ----->|   2. Kimlik kanıtla
  |<-- Session Setup (OK, uid) ----|      (Kerberos veya NTLM)
  |                                |
  |-- Tree Connect (\\dc\share) -->|   3. Paylaşıma bağlan
  |<-- Tree Connect (tid) ---------|
  |                                |
  |-- Create → Read/Write → Close  |   4. Dosya işle
  |<-- ----------------------------|
```

### SMB2 Komutları (smb2.cmd):

| cmd | Ad | İş |
|-----|-----|----|
| 0 | Negotiate | Sürüm/yetenek anlaşması |
| 1 | Session Setup | Kimlik doğrulama |
| 2 | Logoff | Oturum kapatma |
| 3 | Tree Connect | Paylaşım bağlama |
| 4 | Tree Disconnect | Paylaşım koparma |
| 5 | Create | Dosya açma/oluşturma |
| 6 | Close | Dosya kapatma |
| 8 | Read | Dosyadan oku |
| 9 | Write | Dosyaya yaz |
| 14 | Find | Dizin listeleme (ls) |
| 16 | Set Info | Öznitelik/değiştirme (silme dahil) |

### SMB1 vs SMB2:

| Özellik | SMB1 (1980'ler) | SMB2 (2006+) |
|---------|------------------|--------------|
| Güvenlik | İmzalama zayıf, oplock yarışları | İmzalama + şifreleme (3.x) |
| Performans | Komut başına teyit | Batching, pipelining |
| Kullanım | Devre dışı bırakılmalı | Varsayılan |

---

## Hazırlık

```sh
./scripts/generate-traffic.sh smb2
# macOS: open -a Wireshark module-19-smb2.pcap
# Linux: wireshark module-19-smb2.pcap &
# Windows: start wireshark module-19-smb2.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

Bu pcap'te Kerberos biletli normal bir dosya oturumu (listeleme, indirme, yükleme, silme), istemcinin yanlış parola denemesi ve saldırganın (172.50.2.200) 3 denemelik parola spreyi bir aradadır.

---

## Alıştırma 1: Oturum Zinciri

Dört aşamalı kurulumu sırayla izle.

### Filtre:
```text
smb2.cmd == 0 || smb2.cmd == 1 || smb2.cmd == 3
```

### Adımlar:

1. `module-19-smb2.pcap`'i Wireshark'ta aç ve filtreyi uygula
2. Frame 26/28 (Negotiate): Dialect listesinde hangi sürümler var?
   (0x0210 = 2.1, 0x0300 = 3.0, 0x0311 = 3.1.1 — sunucu 3.1.1 seçti)
3. Frame 50/52 (Session Setup): Orta panelde SPNEGO mekanizmasını bul:

```text
v Session Setup Request
    v Security Blob (SPNEGO)
        v negTokenInit
            v mechTypes: 1.3.6.1.5.5.2 (SPNEGO)
                1.2.840.113554.1.2.2 (Kerberos)   ← bilet geliyor!
```

4. Frame 53/54 (Tree Connect): Önce IPC$'e, sonra frame 59/60'ta
   shark-share'a bağlanılıyor
5. Zinciri kendi cümlelerinle özetle

> **SINAV İPUÇLARI:**
>
> - Sıra hep aynıdır: Negotiate → Session Setup → Tree Connect
> - SPNEGO'da Kerberos OID'si (1.2.840.113554.1.2.2) görünce modül 17
>   bağlantısı kur: Bilet bu oturumun anahtarıdır
> - IPC$ bağlantısı normaldir (adlandırılmış kanallar, DFS sorgusu)

---

## Alıştırma 2: Dosya Operasyonlarını Takip Et

Hangi dosyada ne yapıldığını paketlerden çıkar.

### Filtre:
```text
smb2.cmd == 5 && smb2.fileName
```

### Adımlar:

1. Create paketlerini sırayla aç ve dosya adlarını not et:

```text
Frame 61:  Create  File: <share>         ← ls için klasör açıldı
Frame 75:  Create  File: rapor.txt       ← get: indirme
Frame 83:  Create  File: not.txt         ← put: yükleme
Frame 107: Create (delete on close)      ← del: silme
```

2. Read işlemleri: `smb2.cmd == 8` — frame 79'da rapor.txt (53 byte)
   sunucudan istemciye okundu
3. Write işlemleri: `smb2.cmd == 9` — frame 85'te not.txt (31 byte)
   istemciden sunucuya yazıldı
4. Silme: frame 107'de Create "delete on close" ile açıldı
5. Akış grafiğiyle görselleştir: Statistics → Flow Graph

### Operasyon → Komut Eşlemesi:

| Kullanıcı eylemi | SMB2 komutları |
|------------------|----------------|
| `ls` | Create (dizin) + Find (cmd 14) + Close |
| `get rapor.txt` | Create + Read + Close |
| `put not.txt` | Create + Write + Close |
| `del not.txt` | Create (delete on close) + Close |

> **SINAV İPUÇLARI:**
>
> - smb2.fileName alanı Create paketlerinde görünür
> - Write (9) istemciden sunucuya veri = yükleme/exfiltration adayı
> - Silme, dosyanın "delete on close" bayrağıyla açılıp kapatılmasıdır
>   (Set Info ile öznitelik değiştirme de mümkündür ama bu pcap'te
>   kullanılmamıştır)
> - File → Export Objects → SMB ile aktarılan dosyaları çıkarabilirsin

> **İstihbarat İşaretleri, Veri sızdırma:**
>
> - Kullanım dışı saatlerde yoğun Write trafiği
> - Daha önce hiç erişilmemiş paylaşımlara toplu Create/Read
> - Aynı istemciden arşiv uzantılı (zip/rar) büyük Write'lar

### Kaç Bayt Okundu/Yazıldı? (Read/Write Length Toplama)

pcap'te 96 KB'lık `veritabani.bin` hem yüklendi hem indirildi — miktarı
paketlerden toplamak mümkün:

```text
smb2.cmd == 8 && smb2.read_length > 0     # Read: sunucudan okunan
smb2.cmd == 9 && smb2.write_length > 0    # Write: sunucuya yazılan
```

Read paketinde:
```text
v SMB2 Read Request
    Length: 96000        <-- tek istekte istenen bayt
v SMB2 Read Response
    Data length: 65536   <-- gerçekte dönen (MSS sınırı)
```

**tshark ile toplam (sınav tekniği):**
```sh
tshark -r shared/pcaps/module-19-smb2.pcap -Y 'smb2.cmd == 8' \
  -T fields -e smb2.read_length | awk '{s+=$1} END {print s " bayt okundu"}'
# → 1048576+96000+... (96KB dosya birden çok Read ile çekilir)
```

**Analist çıkarımı:** `Create(veritabani.bin) → Read(96000) → Close`
zinciri = dosya **indirildi**; `Write(96000)` = dosya **dışarı çıkarıldı**.
Kill chain'de exfil kanıtı sayılabilecek olan ikincisidir.

### svcctl: Uzaktan Servis Kontrolü (PSExec Ayak İzi)

pcap'te yönetici oturumuyla (administrator, NTLM) **svcctl** (Service
Control Manager) RPC'si çalıştırıldı — servis listesi alındı:

```text
svcctl
```

Ne göreceksin:
1. Tree Connect → `\\dc.shark-tank.local\IPC$` (RPC kanalı)
2. `Create Request File: svcctl` — pipe açıldı
3. DCERPC Bind (svcctl UUID'si) + `EnumServicesStatus` çağrıları

Bu desen neden kritik? **PsExec ve impacket'in services.py aracı tam bu
zinciri kullanır**: svcctl bind → servis oluştur/başlat → komut çalıştır.
Listeleme nispeten zararsızdır ama aynı pipe'ta `CreateService/StartService`
opnum'ları görürsen **uzaktan kod çalıştırma** aşamasındasınız demektir.

> **SINAV İPUCU:** "Saldırgan uzakta ne çalıştırdı?" sorusunda sırayla
> bak: `\pipe\svcctl` (Create) → bind (DCERPC) → opnum 15/16
> (CreateService/StartService) → ardından gelen FILE/BINPATH alanları.

---

## Alıştırma 3: Parola Denemesi — LOGON_FAILURE

Hem istemcinin hem saldırganın başarısız denemelerini bul.

### Filtre:
```text
smb2.cmd == 1 && smb2.nt_status == 0xc000006d
```

### Adımlar:

1. Filtreyi uygula: 4 Session Setup yanıtı görünecek
2. Her biri için `ip.dst`'e bak (yanıtlar sunucudan gelir):

```text
Frame 134: dc → .100 (istemci)        ← yanlış parola: tek deneme
Frame 152: dc → .200 (saldırgan)     ┐
Frame 166: dc → .200                  ├ parola spreyi: 3 deneme
Frame 180: dc → .200                  ┘
```

3. Saldırganın denemelerinde NTLM mi Kerberos mu kullanıldı?
   (Session Setup isteklerindeki mekanizmaya bak)
4. Başarısız denemelerin ardından saldırgan bileti alabildi mi?
   `kerberos.msg_type == 11 && ip.addr == 172.50.2.200` filtresiyle
   modül 17 pcap'iyle ilişkilendir

> **SINAV İPUÇLARI:**
>
> - 0xc000006d = STATUS_LOGON_FAILURE = kimlik kanıtı reddedildi
> - Yanıt paketinde ip.dst istemciyi gösterir (yanıt sunucudan döner)
> - Art arda denemeler + tek kullanıcı = brute force; çok kullanıcı +
>   az deneme = sprey

> **İstihbarat İşaretleri, Parola spreyi:**
>
> - Aynı kaynaktan dakikalar içinde farklı hesaplara denemeler
> - Kilitlenme eşiğinin altında kalmaya çalışan yavaş tempo
> - Başarısız NTLM yanıtları (6d) genellikle 4625 event log'uyla
>   eşleşir — pcap + log korelasyonu en güçlü kanıttır

---

## Alıştırma 4: Kerberos ile NTLM Karşılaştırması

İki kimlik doğrulama mekanizmasını aynı pcap'te ayır.

### Filtre:
```text
smb2.cmd == 1
```

### Adımlar:

1. Tüm Session Setup paketlerini listele
2. İstemcinin (172.50.2.100) BAŞARILI oturumu: Kerberos AP-REQ
3. Saldırganın (172.50.2.200) denemeleri: NTLM (karşılaştırma yanıtına
   dayalı — parola doğrulaması sunucuda yapılır)
4. Farkları tabloya dök:

| Özellik | Kerberos oturumu | NTLM oturumu |
|---------|------------------|--------------|
| Kimlik kanıtı | Bilet (AP-REQ) | Challenge/response |
| Parola ağda | Hayır | Hayır (ama zayıf hash türevi) |
| MITM/dayanıklılık | Yüksek (bilet süreli) | Düşük (relay riski) |
| Bu pcap'te | İstemci, başarılı | Saldırgan, başarısız |

> **SINAV İPUÇLARI:**
>
> - NTLMSSP filtreleri: `ntlmssp` — AUTH paketlerinde mekanizma görünür
> - Kerberos gören Session Setup'ta `kerberos` protokolü gömülü gelir
> - Modern ortam hedefi: Kerberos mümkün, NTLM kısıtlı

### NTLM Relay Saldırısının Mekaniği

Relay, kimlik doğrulamayı "iletme" saldırısıdır: Saldırgan, kurbanın
NTLMSSP üçlüsünü (NEGOTIATE → CHALLENGE → AUTH) olduğu gibi bir hedef
sunucuya iletir — parola hiçbir yerde kırılmaz, **kimlik kanıtı
kendisi** taşınır. Ağda imzası:

```text
# Aynı NTLMSSP negotiate/authorize nonce'unu iki farklı yönde görmek:
ntlmssp.messagetype == 1 || ntlmssp.messagetype == 3
```

Relay göründüğünde: Saldırgan IP'si (200) hem kurbanla hem hedefle aynı
zamanda SMB konuşur — iki paralel TCP oturumu, biri kurban-saldırgan,
diğeri saldırgan-hedef. **Savunma SMB imzalamadır** (signing): İmzalı
oturumda AUTH mesajı başka oturuma taşınamaz; `smb2.flags.signed == 1`
ile imzalı oturumları doğrulayabilirsin. Bu pcap'te oturumlar imzasızdır
(gerçekçi zafiyet), relay için açık kapıdır.

> **SINAV İPUCU:** "NTLM relay neden çalışır?" → Kimlik kanıtı sunucuya
> bağlamadan taşınabilir; çözüm imzalama (signing) + EPA'dır.

### Named Pipes Detayı

SMB üzerinden RPC konuşmak için `\\pipe\` ile başlayan named pipe'lar
kullanılır (örn. `\pipe\srvsvc` servis listesi, `\pipe\lsarpc` yerel
güvenlik, `\pipe\winreg` kayıt defteri, `\pipe\svcctl` servis kontrol).
Pcap'te Tree Connect'te bunları görürsün:
```text
smb2.path contains "pipe"
```
Saldırı bağlamı: svcctl/samr pipe'ları, uzaktan servis kurma/hesap
listeleme (PsExec benzeri araçların ayak izi) demektir — kill chain'in
"installation" adımının SMB'deki imzasıdır.

---

## Hızlı Referans - SMB2 Filtreleri

| Filtre | Anlamı |
|--------|--------|
| `smb2` | Tüm SMB2 trafiği |
| `smb2.cmd == 0` | Negotiate paketleri |
| `smb2.cmd == 1` | Session Setup (kimlik doğrulama) |
| `smb2.cmd == 3` | Tree Connect (paylaşım bağlama) |
| `smb2.cmd == 5` | Create (dosya açma) |
| `smb2.cmd == 8` | Read (okuma) |
| `smb2.cmd == 9` | Write (yazma) |
| `smb2.cmd == 14` | Find (listeleme) |
| `smb2.cmd == 16` | Set Info (öznitelik/silme) |
| `smb2.nt_status == 0xc000006d` | LOGON_FAILURE (parola hatası) |
| `smb2.tree` | Bağlanan paylaşım yolu |
| `tcp.port == 445` | SMB portu |

---

## Sınav Soruları (Çöz)

1. SMB2 oturum kurma zincirini sırasıyla say ve her adımın smb2.cmd
   değerini ver.
2. IPC$ paylaşımına bağlanmanın normal akıştaki rolü nedir?
3. Bir kullanıcının paylaşımdan dosya indirmesi hangi komut dizisini
   üretir? Yüklemedeki fark nedir?
4. STATUS_LOGON_FAILURE (0xc000006d) ne anlama gelir ve hangi saldırı
   kalıplarıyla bir arada görülür?
5. Kerberos biletli Session Setup ile NTLM Session Setup paket
   seviyesinde nasıl ayırt edilir?
6. SMB imzalama hangi saldırı sınıfını önler?
7. SMB1 neden devre dışı bırakılmalıdır? İki gerekçe say.
8. svcctl pipe'ına bağlanıp CreateService çağıran bir istemci ne yapmış
   olabilir? Hangi ünlü araç bu deseni üretir?
9. veritabani.bin için okunan toplam baytı smb2.read_length alanlarından
   hesapla.

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. Negotiate (0) → Session Setup (1) → Tree Connect (3) → dosya
   operasyonları (Create/Read/Write/Close). Kapanış: Tree Disconnect (4)
   ve Logoff (2).

2. İstemci önce IPC$'e bağlanarak adlandırılmış kanalları ve DFS
   yönlendirmelerini sorgular; ardından asıl paylaşıma bağlanır.

3. İndirme: Create + Read + Close (veri sunucudan istemciye). Yükleme:
   Create + Write + Close (veri istemciden sunucuya). Fark cmd 8'e
   karşı cmd 9 ve verinin yönü.

4. Kimlik kanıtının reddedildiğini (yanlış parola/kullanıcı) gösterir.
   Hedefli brute force (tek hesap, çok parola) ve parola spreyi (çok
   hesap, tek parola) kalıplarıyla görülür.

5. Kerberos'ta Security Blob içinde Kerberos OID'si ve AP-REQ bileti
   görünür; NTLM'de NTLMSSP NEGOTIATE/CHALLENGE/AUTH mesajları izlenir.

6. Ortadaki adam (MITM/relay) saldırılarını: İmzasız paket değiştirilemez,
   başka oturuma aktarılamaz.

7. Zayıf imzalama ve oplock yarışları gibi güvenlik açıkları (WannaCry
   gibi saldırıların yolu) ve komut başına teyit gerektiren verimsiz
   tasarım.

</details>

8. Uzakta servis kurup başlatmıştır (uzaktan kod çalıştırma). PsExec ve impacket'in services.py/psexec.py aracı tam bu deseni üretir: svcctl bind → CreateService → StartService.
9. Read istekleri 96.000 bayt ister (tek büyük Read) ve veri 65.536'lık dilimlerle döner; `tshark -Y 'smb2.cmd == 8' -T fields -e smb2.read_length` toplamı dosyanın tamamını (96 KB) kapsar.

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
