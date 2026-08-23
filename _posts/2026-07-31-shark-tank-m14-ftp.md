---
layout: post
title:  "shark-tank - m14: FTP Analizi"
date:   2026-07-31 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 14: FTP Analizi

**Neden?** FTP sunucusunda anormal bir hesap görüldü. Brute force ile ele geçirilmiş olabilir. FTP, kullanıcı adı ve şifreyi düz metin olarak gönderir. Saldırgan Wireshark ile FTP oturumunu izleyerek `USER` ve `PASS` komutlarını okur. Anonymous FTP (açık dosya sunucusu), FTP bounce attack (proxy ile port tarama), brute force tespiti FTP analizinin temel konularıdır. Bu modülde, FTP oturumlarındaki güvenlik açıklarını bulmayı öğreneceksin.

**Görev:** FTP oturumunu analiz et. Command/response yapısını, credential sızıntısını, dosya transferini incele.

**Öğrenim Hedefleri:**
- FTP USER/PASS komutlarında cleartext credential'ları okuyabilmek
- Active (PORT) ve Passive (PASV) mod arasındaki farkı anlamak
- FTP response kodlarını (220, 227, 230, 331) yorumlayabilmek
- FTP brute force saldırısını tespit edebilmek
- FTP bounce attack prensibini bilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **FTP** | File Transfer Protocol: Bir cihazdan diğerine dosya göndermek ve almak için kullanılan protokol. Port 21'de komut (kontrol) bağlantısı, ayrı bir portta da veri bağlantısı olmak üzere iki ayrı TCP bağlantısı kullanır. Tüm komutlar, kullanıcı adı ve şifre dahil, düz metin (cleartext) olarak iletilir: Wireshark ile trafiği izleyen biri giriş bilgilerini açıkça görebilir. Bu güvenlik açığı nedeniyle modern sistemlerde FTP yerine SFTP (SSH üzerinden) veya FTPS (TLS üzerinden) tercih edilir. Ancak eski sistemlerde ve bu laboratuvarda eğitim amaçlı hala FTP kullanılır. |
| **TCP** | Transmission Control Protocol: İnternetin güvenilir ve sıralı veri iletimini sağlayan protokol. Veriyi göndermeden önce alıcıyla bağlantı kurar (3-way handshake), gönderdiği her paket için onay (ACK) bekler ve onay gelmeyen paketleri yeniden gönderir (retransmission). Bu mekanizmalar sayesinde veri kaybı olmadan ve gönderim sırasında bozulmadan teslim edilir. Web (HTTP), email (SMTP), dosya transferi (FTP) gibi kritik işlemlerin tamamı TCP üzerinden çalışır. Bağlantı kurma ve onay bekleme yükü nedeniyle UDP'den yavaştır, ama güvenilirlik gerektiğinde tek seçenektir. |
| **cleartext** | Verinin hiçbir şifreleme uygulanmadan, olduğu gibi (düz metin) iletilmesi. HTTP, FTP, Telnet, SMTP cleartext protokollerdir: Ağ trafiğini dinleyen biri (Wireshark, tcpdump) şifreler, mesaj içerikleri ve kişisel verileri açıkça görebilir. HTTPS (HTTP + TLS), veriyi şifreleyerek bu sorunu çözer. Cleartext trafiğin güvenlik riski, Wireshark gibi araçlarla analiz yapmayı da kolaylaştırır: Bu yüzden bu laboratuvarda HTTP kullanılarak tüm trafiğin paket seviyesinde görülebilmesi sağlanmıştır. |
| **active mode** | FTP'de veri bağlantısının sunucudan istemciye doğru (inbound) kurulduğu çalışma modu. İstemci, PORT komutuyla sunucuya "şu IP ve portta dinliyorum, bana bağlan" der ve sunucu port 20'den istemcinin belirttiği porta TCP bağlantısı başlatır. Bu mod, istemcinin bir portu dışarıdan gelen bağlantıya açmasını gerektirir; güvenlik duvarı arkasındaki veya NAT arkasındaki istemcilerde sorun yaratır. Modern FTP istemcilerinin çoğu varsayılan olarak active mode yerine passive mode kullanır. |
| **passive mode** | FTP'de veri bağlantısının istemciden sunucuya doğru (outbound) kurulduğu çalışma modu. İstemci PASV komutunu gönderir, sunucu "şu rastgele porta bağlan" diyerek yanıt verir (227 koduyla). İstemci daha sonra sunucunun belirttiği porta TCP bağlantısı açar. Passive mode, tüm bağlantıların istemciden çıkış yönünde olması nedeniyle güvenlik duvarları ve NAT cihazlarıyla sorunsuz çalışır. Wireshark'ta PASV yanıtındaki 6 sayıdan ilk 4'ü IP adresini, son 2'si de port numarasını (p1 × 256 + p2) verir. |
| **FTP kontrol ve veri bağlantısı** | FTP'nin iki ayrı TCP bağlantısı kullanma özelliği. Kontrol bağlantısı (port 21) komutlar ve yanıtlar için kullanılır: USER, PASS, LIST, RETR gibi komutlar bu bağlantıdan gönderilir ve oturum boyunca açık kalır. Veri bağlantısı ise dosya transferi ve dizin listesi için kullanılır: Her dosya transferinde veya LIST komutunda yeni bir TCP bağlantısı açılır ve transfer bitince kapatılır. Wireshark'ta `ftp` filtresi kontrol bağlantısını, `ftp-data` filtresi veri bağlantısını gösterir. İki bağlantı farklı portlar kullandığı için Wireshark bunları ayrı TCP stream'leri olarak görür. |
| **Follow TCP Stream** | Wireshark'ın bir TCP bağlantısındaki tüm veriyi baştan sona tek pencerede gösteren özelliği. Bir HTTP oturumunu, bir FTP transferini veya bir email gönderimini tam olarak görmek için kullanılır. Paket listesindeki herhangi bir pakete sağ tıklayıp "Follow > TCP Stream" seçilerek açılır. İstemcinin gönderdiği veri (request) ve sunucunun yanıtı (response) farklı renklerle ayrılarak görüntülenir. Sınavda credential sızıntısı, SQL injection payload'ı veya email içeriği gibi verileri hızlıca okumak için en kullanışlı araçtır. |

## Teori

FTP (File Transfer Protocol), dosya transferi için kullanılan protokoldür.
- **Port:** 21 (komut), 20 (veri - yalnızca active mode kaynak portu; passive modda rastgele)
- **Cleartext!** Kullanıcı adı ve şifre açıkça görünür
- **İki mod:** Active ve Passive
- **İki bağlantı:** Kontrol (komut) + Veri (dosya)

### Active Mode (bu pcap'te üretilen gerçek akış):
```text
CLIENT                          FTP SERVER (172.50.2.15:21)
  |--- PORT 172,50,2,100,4,210 -->|    "172.50.2.100:1234 dinle"
  |<-- 200 PORT OK ---------------|    "Tamam, bağlanıyorum"
  |--- LIST --------------------->|    Dizin listesi iste
  |<-- 150 Opening data ----------|    Veri bağlantısı açılıyor
  |=== SERVER:20 → CLIENT:1234 ===|    VERİ BAĞLANTISI (inbound!)
  |<-- 425 Cannot open data ------|    İstemci dinlemedi → başarısız
```

### Passive Mode (gerçek akış — EPSV):
```text
CLIENT                          FTP SERVER (172.50.2.15:21)
  |--- EPSV --------------------->|    "Hangi porta bağlanayım?"
  |<-- 229 (|||21110|) -----------|    "Port 21110'e bağlan"
  |=== CLIENT → SERVER:21110 =====|    VERİ BAĞLANTISI (outbound)
  |--- LIST --------------------->|    Dizin listesi iste
  |<-- 150 Opening data --------->|    Veri bağlantısı açılıyor
  |<-- 226 Transfer complete ---->|    Tamamlandı
```

### FTP Oturumu:
```text
CLIENT                          FTP SERVER (172.50.2.15:21)
  |<-- 220 Welcome ------------>|    Sunucu hazır
  |--- USER ftpuser ----------->|    Kullanıcı adı
  |<-- 331 Password needed ---->|    Şifre gerekli
  |--- PASS ftppass123 -------->|    ŞİFRE (CLEARTEXT!)
  |<-- 230 Login successful --->|    Giriş başarılı
  |--- PWD -------------------->|    Mevcut dizin
  |<-- 257 "/" is the current --|    Root dizini
  |--- EPSV ------------------->|    Extended Passive mode
  |<-- 229 (|||21110|) ---------|    Veri portunu söyle
  |--- LIST ------------------->|    Dizin listesi işte
  |<-- 150 Opening data ------->|    Veri bağlantısı açıldı
  |<-- (dosya listesi) -------->|    Veri transferi
  |<-- 226 Transfer complete -->|    Tamamlandı
  |--- QUIT ------------------->|    Çıkış
  |<-- 221 Goodbye ------------>|    Hoşça kal
```

### FTP Response Kodları:

| Kod | Anlamı |
|-----|--------|
| **220** | Sunucu hazır (Welcome) |
| **230** | Giriş başarılı |
| **331** | Şifre gerekli |
| **530** | Giriş başarısız |
| **227** | Passive mode (PASV) port bilgisi |
| **150** | Veri bağlantısı açıldı |
| **226** | Transfer tamamlandı |
| **257** | Mevcut dizin (PWD) |

> **İstihbarat İşaretleri, FTP, compliance audit'lerde en çok eleştirilen protokoldür:**
>
> - `ftp.request.command == "USER"` / `"PASS"` → **Cleartext credentials** (PCI-DSS ihlali)
> - `ftp.response.code == 530` art arda → **Brute force** denemesi
> - `ftp.request.command == "PASV"` → Passive mode (veri kanalı ayrı)
> - `ftp.request.command == "RETR"` → Dosya **indirme** (exfiltration olabilir)
> - `ftp.request.command == "STOR"` → Dosya **yükleme** (malware bırakma olabilir)

## Hazırlık

```sh
./scripts/generate-traffic.sh ftp
# macOS: open -a Wireshark module-14-ftp.pcap
# Linux: wireshark module-14-ftp.pcap &
# Windows: start wireshark module-14-ftp.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

## Alıştırma 1: FTP Login - Cleartext Credentials

### Filtre:
```text
ftp.request.command == "USER" || ftp.request.command == "PASS"
```

### Ne Yapmalısın?
1. USER paketini bul ve tıkla
2. FTP katmanını genişlet:

```text
 v File Transfer Protocol (FTP)
     Request command: USER
     Request arg: ftpuser               <-- KULLANICI ADI (açık!)
```

3. PASS paketini bul:

```text
 v File Transfer Protocol (FTP)
     Request command: PASS
     Request arg: ftppass123            <-- ŞİFRE (açık!)
```

> **SINAV İPUCU:** FTP credentials Wireshark'ta AÇIKÇA görünür!
>
> Bu, güvenlik açısından çok kritik bir zafiyettir.
>
> Çözüm: FTPS (FTP over TLS) veya SFTP (SSH File Transfer) kullanmak.

## Alıştırma 2: FTP Command/Response Akışı

### Filtre:
```text
ftp
```

Tüm FTP oturumunu incele:
1. **220 Welcome** -> Sunucu mesajı
2. **USER/PASS** -> Kimlik doğrulama
3. **SYST** -> Sunucu işletim sistemi
4. **PWD** -> Mevcut dizin
5. **PASV** -> Passive mode geçiş
6. **LIST** -> Dizin listesi
7. **RETR** -> Dosya indirme
8. **QUIT** -> Oturum kapatma

### Follow TCP Stream (stream 0):
1. FTP paketine sağ tıkla -> **Follow > TCP Stream**
2. Tam FTP oturumunu göreceksin:

```text
220 (vsFTPd 3.0.5)                               <-- SERVER
USER ftpuser                                     <-- CLIENT
331 Please specify the password.                 <-- SERVER
PASS ftppass123                                  <-- CLIENT
230 Login successful.                            <-- SERVER
PWD                                              <-- CLIENT
257 "/" is the current directory                 <-- SERVER
EPSV                                             <-- CLIENT
229 Entering Extended Passive Mode (|||21110|).  <-- SERVER
TYPE A                                           <-- CLIENT
200 Switching to ASCII mode.                     <-- SERVER
LIST                                             <-- CLIENT
150 Here comes the directory listing.            <-- SERVER
226 Directory send OK.                           <-- SERVER
QUIT                                             <-- CLIENT
221 Goodbye.                                     <-- SERVER
```

> **Not:** Bu istemci (curl) SYST göndermez ve klasik PASV yerine modern **EPSV** kullanır. Klasik 227 yanıtı yalnızca `--disable-epsv` ile üretilen ayrı bir oturumda görünür (Alıştırma 3).

> **SINAV İPUCU:** FTP command/response numaralarını bilmen gerekir.
>
> 2xx = başarılı, 3xx = daha fazla bilgi gerekli, 5xx = hata.

## Alıştırma 3: Passive Mode Analizi

### Filtre:
```text
ftp.response.code == 229
```

> **Not:** Bu lab'da istemci (curl) modern **EPSV** kullanır: `229 Entering Extended Passive Mode (|||21110|)`. Klasik `227 (h1,h2,h3,h4,p1,p2)` yanıtı yalnızca `--disable-epsv` ile üretilen oturumlarda görünür; bu pcap'te bir tane vardır: `(172,50,2,15,82,117)`. Aşağıdaki örnek de o gerçek yanıttır.

PASV response'u (bu pcap'teki gerçek yanıt):
```text
227 Entering Passive Mode (172,50,2,15,82,117).
```

Port hesaplama: `82 * 256 + 117 = 21109`

Yani veri bağlantısı `172.50.2.15:21109` portuna yapılır.

### Veri bağlantısını bul:
```text
tcp.dstport == 21100 || tcp.srcport == 21100
```

> **SINAV İPUCU:** PASV response'taki 6 sayı: İlk 4 = IP, son 2 = port.
>
> Port = (5. sayı * 256) + 6. sayı

## Alıştırma 4: FTP Veri Transferi

FTP'de iki ayrı TCP bağlantısı vardır:

1. **Kontrol bağlantısı**: Port 21 (komutlar)
2. **Veri bağlantısı**: Dinamik port (dosyalar, dizin listesi)

### Filtre ile ayır:
```text
# Kontrol (komutlar):
tcp.dstport == 21 || tcp.srcport == 21

# Veri (dosya transferi):
!(tcp.dstport == 21 || tcp.srcport == 21) && ftp-data
```

> **SINAV İPUCU:** FTP'de veri ve kontrol ayrı TCP bağlantılarında gider.

## Alıştırma 5: Active Mode Analizi

> **Not:** pcap'te iki active mode oturumu var: Biri normal (PORT istemcinin
> kendi IP'sine), biri bounce denemesi (PORT üçüncü bir makineye). İkisini de
> `ftp.request.command == "PORT"` filtresiyle bulabilirsin.

Active mode'da, PORT komutu ile istemci server'a hangi IP ve portta dinlediğini söyler. Server daha sonra **kendi port 20'sinden istemciye** veri bağlantısı başlatır.

### PORT Komutu Formatı:
```text
PORT h1,h2,h3,h4,p1,p2
  IP = h1.h2.h3.h4
  Port = p1 * 256 + p2

Örnek: PORT 172,50,2,100,4,210
  IP   = 172.50.2.100
  Port = 4 * 256 + 210 = 1234
```

### Active vs Passive Karşılaştırması:

| Özellik | Active (PORT) | Passive (PASV) |
|---------|--------------|----------------|
| **Veri bağlantısı yönü** | Server → Client | Client → Server |
| **Server veri portu** | 20 (kaynak) | Rastgele (hedef) |
| **Client gereksinimi** | Inbound port açık | Sadece outbound |
| **Firewall sorunu** | Evet (inbound engellenir) | Hayır |
| **Güvenlik** | Düşük (gelen bağlantı) | Daha iyi |

### Adımlar:

1. Filtre: `ftp.request.command == "PORT"`
2. PORT komutunun parametrelerini incele:

```text
v File Transfer Protocol (FTP)
    Request command: PORT
    Request arg: 172,50,2,100,4,210
```

3. IP adresini hesapla:
   - 172,50,2,100 → 172.50.2.100 (istemci IP'si)
4. Port numarasını hesapla:
   - 4 * 256 + 210 = 1234
5. Bu bağlantıda server hangi porttan veri gönderecek?
   - Port 20 (FTP veri portu)
6. Active mode'un güvenlik dezavantajı nedir?
   - İstemcinin bir portu inbound bağlantıya açması gerekir
   - Firewall bu bağlantıyı engelleyebilir
   - NAT arkasındaki istemciler çalışmaz

> **SINAV İPUÇLARI:**
>
> - **PORT** = Active mode, **PASV** = Passive mode
> - PORT'ta IP ve port istemci tarafından belirlenir
> - Active mode'da server port 20'den bağlantı başlatır
> - Port hesaplama: `p1 * 256 + p2`
> - Active mode firewall'lar tarafından genellikle engellenir
> - Pasif mode modern FTP'nin varsayılanıdır

> **İstihbarat İşaretleri, Active mode tespiti:**
>
> - PORT komutu görürsen, istemcinin inbound bağlantı kabul ettiğini anlarsın
> - Bu, istemcinin DMZ'de veya firewall arkasında olmadığını gösterebilir
> - Server port 20'den gelen SYN = Active mode veri bağlantısı

### FTP Bounce Attack (PORT ile Üçüncü Tarafa Atlama)

FTP bounce, active mode'un kötüye kullanımıdır: Saldırgan, FTP sunucusuna
PORT komutuyla **kendi adresi yerine üçüncü bir makinenin** IP/portunu
verir ve LIST/RETR ile sunucuyu o makineye bağlanmaya zorlar. Sonuç:
FTP sunucusu saldırgan adına port taraması yapar (kaynak izi FTP
sunucusunda kalır, saldırganınkinde değil).

pcap'teki deneme (ikinci PORT oturumu):
```text
PORT 172,50,2,16,0,25    →  hedef: SMTP sunucusu (172.50.2.16), port 0*256+25 = 25
LIST                    →  500 (reddedildi) — vsftpd PORT hedefini doğrular
PORT 172,50,2,14,39,116 →  hedef: icmp-target (172.50.2.14), port 39*256+116 = 10100
LIST                    →  500 / 425 — bağlantı kurulamadı
```

**Filtreler:**
```text
ftp.request.command == "PORT"                       # tüm PORT denemeleri
ftp.response.code == 500 || ftp.response.code == 425 # reddedilen veri bağlantıları
tcp contains "PORT 172,50,2,16"                     # ham hedef IP kanıtı
```

Analist çıkarımı: PORT argümanındaki IP, kontrol bağlantısının kurulduğu
istemci IP'sinden farklıysa **bounce denemesidir**. Modern sunucular
(vsftpd dahil) bu durumu 500 ile reddeder; ama denemenin kendisi pcap'te
cleartext olarak durur — saldırganın kimliği ve hedefi buradadır.

> **SINAV İPUCU:** "PORT komutuyla hangi üçüncü makine hedeflendi?"
> sorusunda `ftp.request.command == "PORT"` çıktısındaki argümanı çöz:
> `h1,h2,h3,h4` hedef IP'dir. (Bizim pcap'te: 172.50.2.16 ve 172.50.2.14.)

## Alıştırma 6: FTP vs HTTP vs HTTPS - Şifre Karşılaştırma

Aynı pcap'de (mixed) hem FTP hem HTTP hem HTTPS varsa:

| Protokol | Credentials Görünür mu? |
|----------|------------------------|
| **FTP** | EVET - USER/PASS açık metin |
| **HTTP** (POST) | EVET - body'de açık metin |
| **HTTPS** | HAYIR - TLS ile şifreli |

> **SINAV İPUCU:** Sınavda "hangi protokolde şifre görünür?" sorusu çıkabilir.

## Hızlı Referans - FTP Filtreleri

```text
# Tüm FTP
ftp

# Komutlar
ftp.request.command == "USER"          # Kullanıcı adı
ftp.request.command == "PASS"          # Şifre
ftp.request.command == "LIST"          # Dizin listesi
ftp.request.command == "RETR"          # Dosya indirme
ftp.request.command == "STOR"          # Dosya yükleme
ftp.request.command == "CWD"           # Dizin değiştir
ftp.request.command == "PASV"          # Passive mode (klasik)
ftp.request.command == "EPSV"          # Extended Passive mode (curl varsayılanı)
ftp.request.command == "PORT"          # Active mode (bu pcap'te yok)
ftp.request.command == "QUIT"          # Çıkış
ftp.request.command == "SYST"          # Sistem bilgisi
ftp.request.command == "PWD"           # Dizin

# Response kodları
ftp.response.code == 220               # Welcome
ftp.response.code == 230               # Login OK
ftp.response.code == 331               # Password needed
ftp.response.code == 530               # Login failed
ftp.response.code == 227               # Passive mode
ftp.response.code == 226               # Transfer complete

# İçerik arama
ftp contains "password"
ftp contains "ftpuser"
ftp.request.arg contains "secret"

# FTP veri bağlantısı
ftp-data
```

## Alıştırma 7: Paket İşaretleme (Mark Packet)

Forensic analizde önemli paketleri işaretleyebilirsin:

1. **Edit > Mark Packet** (veya Ctrl+M): Seçili paketi işaretler
2. İşaretli paketler siyah arka planla gösterilir
3. **Edit > Mark All Displayed**: Filtrelenmiş tüm paketleri işaretler
4. **Edit > Find Packet > Marked**: İşaretli paketler arasında gezin
5. **Edit > Unmark All Displayed**: Tüm işaretleri kaldır

### Packet Comments (Paket Notları):

1. Bir pakete sağ tıkla → **Packet Comment...**
2. Not ekle: "FTP login credentials tespit edildi: Şüpheli"
3. Yorumlu paketler paket listesinde kalem ikonu ile gösterilir
4. **Edit > Packet Comment** ile yorumları düzenle

> **SINAV İPUCU:** Packet Comments, forensic analizde kanıt notlaması için kullanılır. Export ederken yorumlar pcap dosyasına kaydedilir.

### Analyze > Decode As:

Wireshark'ı yanlış tanınan bir protokolü farklı çözümlemeye zorlayabilirsin:
1. Analyze > Decode As...
2. "Current" sütunundan protokolü değiştir
3. Örnek: FTP kontrol bağlantısını HTTP olarak çözümlemeyi dene (hatalı gösterim)

> **SINAV İPUCU:** Decode As, standart olmayan portlarda çalışan protokolleri tanımak için kullanılır. Örneğin port 8080'de çalışan FTP'yi FTP olarak çözümlemek.

## Sınav Soruları (Çöz)

1. FTP ile gönderilen kullanıcı adı ve şifre nedir?
2. FTP kontrol bağlantısı hangi portta? Veri bağlantısı hangi portta?
3. PASV response'da verilen port nedir? (Hesapla)
4. FTP session kaç farklı TCP bağlantısından oluşur?
5. Sunucunun işletim sistemi bilgisi hangi komutla öğrenildi?
6. FTP ile dosya transferi sırasında veri hangi protokolle taşınıyor?
7. PORT komutu ile PASV komutu arasındaki temel fark nedir?
8. PORT komutunda IP ve port nasıl hesaplanır? Örnek: `PORT 172,50,2,100,4,210`

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. ftpuser / ftppass123
2. Kontrol: 21, Veri: PASV port numaraları her bağlantıda değişir. `ftp.response.code == 227` filtresiyle PASV yanıtlarını bulup port hesapla.
3. Bu pcap'teki tek klasik 227 yanıtı: `(172,50,2,15,82,117)` → Port = 82 × 256 + 117 = **21109**. Diğer oturumlar EPSV kullanır (229).
4. TCP bağlantı sayısı değişkendir. Statistics > Conversations ile say.
5. Bu istemci (curl) SYST göndermez; sunucu yazılımı 220 Welcome banner'ından okunur: vsFTPd 3.0.5.
6. TCP (ftp-data). FTP kontrol ve veri ayrı TCP bağlantıları kullanır.
7. PORT (Active mode): İstemci IP/port söyler, server port 20'den istemciye bağlanır. PASV (Passive mode): Server IP/port söyler, istemci server'a bağlanır. Active mode'da inbound bağlantı gerekir, firewall sorunu yaratır.
8. IP = h1.h2.h3.h4 = 172.50.2.100. Port = p1 × 256 + p2 = 4 × 256 + 210 = 1234.

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
