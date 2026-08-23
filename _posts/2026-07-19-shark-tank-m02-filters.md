---
layout: post
title:  "shark-tank - m02: Wireshark Filtreleme"
date:   2026-07-19 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 02: Wireshark Filtreleme

**Neden?** SOC ekibinde alert geldi: "Dış IP'den anormal HTTP istekleri". Saniyede 5000 paket akıyor. Doğru filtreyi bulamazsan 1 saat sonra hâlâ ilk pakete bakıyor olursun. `http.request` ile SQL injection'ı, `dns` ile tunneling'i, `tcp.flags.syn` ile port scan'i ayıklamak gerekir. Filtre bilmeyen analist veri gölünde boğulur. Bu modülde, saldırganın trafiğini denizde iğne gibi bulmayı öğreneceksin.

**Görev:** Wireshark filtre sistemini öğren. Gerekli paketi gereksizden ayır.

**Öğrenim Hedefleri:**
- Display filter syntax'ini (`==`, `!=`, `&&`, `||`, `!`) kullanabilmek
- Protokol, IP adresi, port ve TCP flag filtrelerini yazabilmek
- Capture filter (BPF) ile canlı yakalama öncesi filtreleyebilmek
- Filtreleri birleştirip karmaşık sorgular oluşturabilmek
- Sınavda zaman kazandıracak filtre ipuçlarını öğrenmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **pcap** | Packet Capture: Ağ trafiğinin yakalanıp kaydedildiği dosya formatı. Bir pcap dosyası, ağ kartından geçen her paketin kopyasını alır ve zaman damgasıyla birlikte saklar. Güvenlik analistleri bir olayı incelerken "ağda ne oldu?" sorusunun cevabını pcap dosyasında arar. Wireshark ile açıldığında her paket katman katman (Ethernet → IP → TCP → uygulama) görüntülenebilir. Ders boyunca `shared/pcaps/` klasöründeki pcap dosyaları üzerinde çalışacaksın. |
| **display filter** | Wireshark'ta yakalanan paketler arasında filtreleme yapmak için kullanılan sistem. Yakalama bittikten sonra çalışır: Paketleri silmez, yalnızca belirttiğin kritere uymayanları gizler. Display filter yazımı Wireshark'a özgü bir syntax kullanır: `ip.addr == 172.50.2.10`, `tcp.port == 80`, `http.request.method == "GET"` gibi. Birden fazla koşul `&&` (ve), `\|\|` (veya), `!` (değil) operatörleriyle birleştirilebilir. WCNA sınavında en çok test edilen filtreleme türüdür. |
| **capture filter** | Trafik yakalanırken, yani capture öncesi uygulanan filtre. Display filter'dan temel farkı: Capture filter'a uymayan paketler hiç yakalanmaz ve kalıcı olarak kaybolur. Bu nedenle capture filter kullanırken kritik paketleri kazara eleme riski vardır. Capture filter, BPF (Berkeley Packet Filter) syntax'ı kullanır; display filter'dan farklı bir yazım kuralı vardır. Canlı trafik izlerken performansı artırmak için kullanılır, ama sınavda hazır pcap dosyaları verildiği için display filter daha sık kullanılır. |
| **BPF** | Berkeley Packet Filter: Capture filter'ların kullandığı dil ve altyapı. tcpdump, Wireshark capture filter ve diğer paket yakalama araçları BPF syntax'ını kullanır. Display filter'dan farklı olarak protokol katmanlarına değil, raw byte offset'lere dayanır: `tcp dst port 80`, `host 172.50.2.10`, `not port 22` gibi. Doğru yazılmış bir BPF ifadesi çekirdek (kernel) seviyesinde çalıştığı için yüksek hızlı trafikte bile performans yükü en azdır. |
| **TCP flags** | TCP header'ındaki 1 bitlik kontrol sinyalleri. Her flag bağlantının durumunu belirtir: SYN (bağlantı açma), ACK (onay), FIN (kapatma), RST (zorla kesme), PSH (veriyi hemen ilet), URG (acil veri). Wireshark'ta `tcp.flags.syn`, `tcp.flags.ack` gibi alanlarla filtrelenebilir. Güvenlik analizinde flag kombinasyonları kritiktir: Örneğin `SYN=1 && ACK=0` port scan'i, sadece `RST=1` ise kapalı portu gösterir. |
| **Expert Information** | Wireshark'ın pcap içindeki anormallikleri ve sorunları otomatik olarak tespit edip listelediği panel. `View > Expert Information` (Ctrl+Alt+Shift+E) menüsünden açılır. Sorunları dört ciddiyet seviyesinde gruplar: Error (kırmızı), Warn (sarı), Note (mavi), Chat (yeşil). Bir analist pcap'i açtığında ilk bakması gereken yerlerden biridir; çünkü retransmission, duplicate ACK, zero window, HTTP 404 gibi sorunları paket tek tek aranmadan özet olarak gösterir. |
| **checksum** | Bir paketin içeriğinin bütünlüğünü doğrulamak için kullanılan matematiksel kontrol değeri. Her katmanın kendi checksum alanı vardır: IP header checksum, TCP checksum, UDP checksum. Gönderen taraf paketi iletirken içeriğe göre bir checksum hesaplar ve pakete ekler; alıcı taraf paketi aldığında aynı hesaplamayı yapıp sonucu karşılaştırır. Eşleşmezse paket bozulmuş demektir. Wireshark'ta checksum hatası (bad checksum), genellikle NIC offloading nedeniyle yakalama noktasında hesaplanmamış anlık checksum'ları gösterir ve her zaman gerçek bir hata anlamına gelmez. |
| **Coloring Rules** | Wireshark'ın paketleri display filter'lara göre otomatik renklendirdiği kural sistemi. `View → Coloring Rules` (Ctrl+Alt+Shift+C) menüsünden yönetilir. Her kural üç parçadan oluşur: Ad, display filter ve renk (yazı + arka plan). Kurallar yukarıdan aşağı değerlendirilir ve ilk eşleşen kazanır; bu yüzden belirli kurallar genel kurallardan önce gelmelidir (örn. DNS kuralı UDP kuralının üstünde olmalı, çünkü DNS UDP üzerinde taşınır). Kurallar profile-specific'tir: Her profil kendi renk kurallarını taşır. Varsayılan renklerle Wireshark protokolleri birbirinden ayırır: HTTP açık yeşil, TCP lavanta, UDP açık mavi, ICMP açık pembe, ARP krem; sorunlu TCP paketleri ise "Bad TCP" kuralıyla açık kırmızı arka planla işaretlenir. |

## Teori

Wireshark'ta iki tür filtre vardır:

| Tür | Ne Zaman | Ne Yapar |
|-----|----------|----------|
| **Capture Filter** | Yakalama ÖNCESİ | Sadece eşleşen paketleri yakalar (diğerleri kaybolur) |
| **Display Filter** | Yakalama SONRASI | Yakalanan paketler arasında filtreler (kayıp yok) |

> **SINAV İPUCU:** Sınavda genellikle hazır pcap dosyası verilir; bu yüzden **Display Filter** kullanılır.
>
> Capture Filter ise yalnızca canlı trafik yakalarken gereklidir.

## Hazırlık

Bu modülde yeni trafik üretilmez. Mevcut pcap dosyaları üzerinde filtre çalışması yapılır:

```sh
# Herhangi bir pcap'i açıp filtreleri dene:
make open FILE=shared/pcaps/module-01-basics.pcap
```

Repoyu indirmediysen pcap dosyalarını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

---

## BÖLÜM 1: DISPLAY FILTERS (Sınav İçin En Önemlisi)

### Temel Kurallar:

```text
# Karşılaştırma operatörleri
==   eşittir
!=   eşit değildir
>    büyüktür
<    küçüktür
>=   büyük veya eşit
<=   küçük veya eşit

# Mantıksal operatörler
&&   VE (and)
||   VEYA (or)
!    DEĞİL (not)

# İçerik arama
contains    içinde geçen
matches     regex eşleşmesi
```

---

### PROTOKOL FİLTRELERİ

```text
# Protokol adı direkt yazılır
http
dns
tcp
udp
icmp
arp
tls
dhcp
```

---

### IP ADRESI FİLTRELERİ

```text
# Belirli IP (kaynak veya hedef)
ip.addr == 172.50.2.10

# Sadece kaynak IP
ip.src == 172.50.2.100

# Sadece hedef IP
ip.dst == 172.50.2.10

# IP aralığı (subnet)
ip.addr == 172.50.2.0/24

# Birden fazla IP
ip.addr == 172.50.2.10 || ip.addr == 172.50.2.11

# Belirli IP'yi hariç tut
!(ip.addr == 172.50.2.100)
ip.addr != 172.50.2.100         # DİKKAT: src VEYA dst 100 olmayanı
```

> **SINAV İPUCU:** `ip.addr != X` genellikle beklediğini vermez!
>
> `!(ip.addr == X)` kullan.

---

### PORT FİLTRELERİ

```text
# TCP port (kaynak veya hedef)
tcp.port == 80

# Sadece kaynak port
tcp.srcport == 8080

# Sadece hedef port
tcp.dstport == 53

# UDP port
udp.port == 53

# Port aralığı
tcp.port >= 1024 && tcp.port <= 65535

# Birden fazla port
tcp.port == 80 || tcp.port == 443
```

---

### TCP FLAGS FİLTRELERİ

```text
tcp.flags.syn == 1                          # SYN set
tcp.flags.ack == 1                          # ACK set
tcp.flags.fin == 1                          # FIN set
tcp.flags.reset == 1                        # RST set
tcp.flags.push == 1                         # PSH set

# Kombinasyonlar
tcp.flags.syn == 1 && tcp.flags.ack == 0    # Sadece SYN
tcp.flags.syn == 1 && tcp.flags.ack == 1    # SYN-ACK
tcp.flags == 0x0002                         # Raw flag değeri (SYN)
tcp.flags == 0x0012                         # SYN-ACK
tcp.flags == 0x0010                         # ACK only
tcp.flags == 0x0011                         # FIN-ACK
```

---

### HTTP FİLTRELERİ

```text
# Temel
http                                          # Tüm HTTP
http.request                                  # Sadece istekler
http.response                                 # Sadece response'lar

# Method
http.request.method == "GET"
http.request.method == "POST"
http.request.method == "PUT"
http.request.method == "DELETE"

# URL / URI
http.request.uri == "/"
http.request.uri contains "api"
http.request.uri contains "login"
http.request.uri contains "secret"

# Status code
http.response.code == 200
http.response.code == 301
http.response.code == 302
http.response.code == 403
http.response.code == 404
http.response.code == 500

# Header
http.host contains "example"
http.user_agent contains "curl"
http.content_type contains "json"
http.authorization                           # Auth header varsa (varlık testi)

# İçerik arama
http contains "password"
http contains "admin"
http contains "flag"
http contains "secret"
http.file_data contains "user"
```

---

### DNS FİLTRELERİ

```text
# Temel
dns
dns.flags.response == 0                       # Query (soru)
dns.flags.response == 1                       # Response (cevap)

# Domain
dns.qry.name == "web.shark-tank.local"
dns.qry.name contains "shark-tank"
dns.qry.name contains "google"

# Kayıt tipi
dns.qry.type == 1                             # A kaydı
dns.qry.type == 28                            # AAAA kaydı
dns.qry.type == 5                             # CNAME kaydı
dns.qry.type == 15                            # MX kaydı
dns.qry.type == 2                             # NS kaydı

# Response kodu
dns.flags.rcode == 0                          # NoError
dns.flags.rcode == 3                          # NXDomain

# Cevap IP
dns.a == "172.50.2.10"
dns.a contains "172.50.2"
```

---

### TLS FİLTRELERİ

```text
tls
tls.record.content_type == 22                 # Handshake
tls.record.content_type == 23                 # Application Data
tls.handshake.type == 1                       # ClientHello
tls.handshake.type == 2                       # ServerHello
tls.handshake.type == 11                      # Certificate
tls.handshake.extensions_server_name contains "secure"
```

---

### ICMP FİLTRELERİ

```text
icmp
icmp.type == 0                                # Echo Reply
icmp.type == 8                                # Echo Request
icmp.type == 3                                # Destination Unreachable
icmp.type == 11                               # Time Exceeded
```

---

### ARP FİLTRELERİ

```text
arp
arp.opcode == 1                               # Request
arp.opcode == 2                               # Reply
eth.dst == ff:ff:ff:ff:ff:ff                  # Broadcast
```

---

### FRAME / PAKET FİLTRELERİ

```text
frame.len > 1000                              # Büyük paketler
frame.len < 64                                # Küçük paketler
frame.time_relative > 1                       # 1 saniyeden sonra
frame.number == 42                            # Belirli paket no
```

---

### FİLTRE KAYDETME (Kendi Kuralını Oluştur)

Display filter çubuğunun sağındaki **"+"** butonuna tıkla ve filtreni kaydet.

---

## BÖLÜM 2: CAPTURE FILTERS (BPF Syntax)

> Capture filter **BPF (Berkeley Packet Filter)** syntax kullanır.
>
> Display filter'dan FARKLIDIR!

```text
# Host tabanlı
host 172.50.2.10                          # Bu IP ile ilgili her şey
src host 172.50.2.100                     # Bu IP'den gelen
dst host 172.50.2.10                      # Bu IP'ye giden

# Port tabanlı
port 80                                   # 80. port (TCP+UDP)
tcp port 80                               # Sadece TCP 80
udp port 53                               # Sadece UDP 53
src port 8080                             # Kaynak port 8080

# Protokol tabanlı
icmp                                      # Sadece ICMP
arp                                       # Sadece ARP
tcp                                       # Sadece TCP
udp                                       # Sadece UDP

# Mantıksal operatörler
and                                       # VE
or                                        # VEYA
not                                       # DEĞİL

# Örnekler
host 172.50.2.10 and tcp port 80          # Web trafiği
src host 172.50.2.100 and not port 22     # SSH hariç istemci trafiği
tcp port 80 or tcp port 443               # HTTP veya HTTPS
not broadcast and not multicast           # Broadcast hariç
```

---

## BÖLÜM 3: İLERİ DÜZEY FİLTRELER (Sınav İçin)

### Troubleshooting filtreleri:
```text
# Yeniden iletim
tcp.analysis.retransmission

# Duplicate ACK
tcp.analysis.duplicate_ack

# Sıfır pencere
tcp.analysis.zero_window

# Tüm sorunlar
tcp.analysis.flags
```

### Şablonlar (Sınavda Çok Kullanılır):

**"Bir HTTP oturumundaki tüm paketleri bul"**
```text
tcp.stream == 0 && http
```

**"Belirli bir istemcinin tüm trafiği"**
```text
ip.addr == 172.50.2.100
```

**"Şifreli trafik dışındakileri göster"**
```text
!(tls || ssl)
```

**"Tüm şifre metin kimlik doğrulama"**
```text
http.request.method == "POST" && http contains "password"
```

**"Port scan tespiti"**
```text
tcp.flags.syn == 1 && tcp.flags.ack == 0
```

**"Tüm DNS sorguları"**
```text
dns.qry.name
```

### Filter Makroları (Yeniden Kullanılabilir Filtreler)

Sık yazdığın uzun filtreleri isimlendirmenin yolu: **Analyze > Display
Filter Macros** (Preferences altında). Tanım şablonu:

```text
İsim:    scan
Formül:  tcp.flags.syn == 1 && tcp.flags.ack == 0 && ip.src == $1
```

Kullanım ( `$1` yerine argüman girilir, `${...}` da olur):
```text
${scan:172.50.2.200}     # 172.50.2.200 kaynaklı SYN taraması
```

Makro tanımı `~/.config/wireshark/dfilter_macros` dosyasında saklanır;
Configuration Profile ile birlikte taşınabilir (bkz. Modül 1). Sınavda
makro tanımlamak istemezsin ama "aynı filtreyi hızla tekrar uygulama"
gereksiniminde (500 pcap taraması, Modül 20) makrolar zaman kazandırır.

---

## BÖLÜM 4: COLORING RULES (WCNA #4)

Wireshark, paketleri belirli kurallara göre renklendirerek protokolleri ve dikkat çekmesi gereken durumları görsel olarak ayırt etmeni sağlar.

### Varsayılan Renkler:

| Renk | Protokol/Durum |
|------|----------------|
| Açık Mor (lavanta) | TCP |
| Açık Mavi | UDP |
| Açık Yeşil | HTTP (tcp/80, HTTP2) |
| Açık Pembe | ICMP |
| Krem | ARP |
| Açık kırmızı arka plan | Bad TCP (retransmission vb.) |
| Koyu kırmızı metin | TCP RST |
| Gri metin | TCP SYN/FIN |

> Not: DNS ve TLS/SSL için varsayılan renk kuralı yoktur; DNS paketleri UDP renginde, TLS paketleri TCP renginde görünür.

### Coloring Rules Yönetimi:

- **View → Coloring Rules** (Ctrl+Alt+Shift+C)
- **Yeni kural**: New → Name + Filter + Foreground/Background color
- **Düzenle**: → işareti ile yukarı/aşağı sıralama (ilk eşleşen kazanır)
- **İçe/Dışa Aktar**: Export/Import butonları (JSON formatında)
- **Geçici kapatma**: View → Colorize Packet List (Ctrl+Alt+C) toggle

### Kural Yapısı:

Her kural:
1. **Name**: Kural adı
2. **Filter**: Display filter expression
3. **Foreground**: Yazı rengi
4. **Background**: Arka plan rengi

Kural listesinde üst sıradakiler önce değerlendirilir. İlk eşleşen kural uygulanır.

### Profile Bağımlılığı:

Coloring rules **profile-specific**'dir. Her profile özel renk kuralları tanımlanabilir. Bu sayede Security profili kırmızı/siyah renklerle tehditleri vurgularken, VoIP profili yeşil/mavi tonlarla normal trafiği gösterebilir.

#### Alıştırma:

1. `module-27-exam-practice.pcap`'i Wireshark'ta aç
2. **View → Coloring Rules** (Ctrl+Alt+Shift+C) ile mevcut kuralları incele
3. Yeni bir kural oluştur:
    - Name: `Şüpheli Trafik`
    - Filter: `ip.addr == 172.50.2.200`
    - Foreground: White
    - Background: Dark Red
    - OK → kural eklendi, listede yukarı taşı
4. HTTP 404 paketleri için kural ekle:
   - Name: `HTTP Error`
   - Filter: `http.response.code >= 400`
   - Foreground: Yellow
   - Background: Dark Red
5. TCP sorunları için kural ekle:
   - Name: `TCP Problems`
   - Filter: `tcp.analysis.flags`
   - Foreground: White
   - Background: Dark Orange
6. **View → Colorize Packet List** (Ctrl+Alt+C) toggle ile renkleri kapatıp aç
7. **Export** butonu ile kuralları bir JSON dosyasına kaydet
8. Coloring Rules penceresini kapat

> **SINAV İPUÇLARI:**
>
> - **Ctrl+Alt+Shift+C = Coloring Rules**
> - **Ctrl+Alt+C = Colorize toggle**
> - Renk kuralları profile-specific'dir
> - İlk eşleşen kural kazanır (sıralama önemli!)
> - Varsayılan renkler sınavda sorulabilir (TCP=açık mor, UDP=açık mavi, HTTP=açık yeşil, ICMP=açık pembe, ARP=krem)
> - Coloring rules JSON formatında export/import edilir

> **İstihbarat İşaretleri, Renkler analiz hızını artırır:**
>
> - Saldırganın IP'sini kırmızı ile vurgula
> - HTTP hatalarını turuncu göster
> - TCP sorunlarını koyu renkle belirt
> - Normal trafiği soluk renklerde bırak

---

## BÖLÜM 5: EXPERT SYSTEM (WCNA #26)

Wireshark Expert System, yakalanan paketleri otomatik olarak analiz eder ve potansiyel sorunları, anomalileri ve ilginç durumları işaretler.

### Expert Information:

**View → Expert Information** (Ctrl+Alt+Shift+E) ile açılır.

### Severity Seviyeleri:

| Seviye | Simge | Anlamı | Örnek |
|--------|-------|--------|-------|
| **Error** | Kırmızı X | Hata | TCP Retransmission, Bad checksum |
| **Warn** | Sarı üçgen | Uyarı | Duplicate ACK, Zero Window |
| **Note** | Mavi daire | Not | TCP Window Update, HTTP 404 |
| **Chat** | Yeşil konuşma | Bilgi | TCP SYN, FIN, HTTP Request |

### Kategoriler:

| Kategori | Açıklama | Örnek Expert Çıktısı |
|----------|----------|---------------------|
| **Checksum** | Sağlama toplamı hataları | IP/TCP/UDP checksum error |
| **Sequence** | TCP sıra numarası anomalileri | Retransmission, Dup ACK, Out-of-Order |
| **Response** | Yanıt süreleri ve kodları | HTTP 404, DNS NXDOMAIN |
| **Request** | İstek analizi | HTTP Request, DNS Query |
| **Chat** | Normal konuşma mesajları | TCP SYN/FIN/RST |

### Expert System Kullanımı:

1. **Expert Information** tablosunda severity'ye göre gruplama
2. Bir satıra tıkla → ilgili pakete otomatik atlama
3. **Limit to display filter** ile belirli trafiğe odaklan
4. **Sütunlar**: Severity, Group, Protocol, Summary, Count
5. Expert bilgileri **pcapng** içinde kaydedilir

#### Alıştırma:

1. `module-27-exam-practice.pcap`'i Wireshark'ta aç
2. **View → Expert Information** (Ctrl+Alt+Shift+E)
3. Hangi severity'ler görünüyor? Kaç tane Error var? Kaç tane Warn?
4. **Sequence** kategorisindeki paketleri incele:
   - TCP Retransmission var mı?
   - Duplicate ACK var mı?
   - Out-of-Order paket var mı?
5. **Response** kategorisini incele:
   - HTTP 404 görünüyor mu?
   - DNS NXDomain var mı?
6. Expert Information'da bir **Error** satırına tıkla → ilgili pakete atlar
7. **Limit to display filter** kutusuna `ip.addr == 172.50.2.200` yaz → sadece saldırganın trafiğindeki expert olaylarını göster
8. Expert bilgilerini CSV olarak export et: **Copy → All Visible → CSV**

> **SINAV İPUÇLARI:**
>
> - **Ctrl+Alt+Shift+E = Expert Information**
> - **4 severity** seviyesi: Error, Warn, Note, Chat
> - **5 kategori**: Checksum, Sequence, Response, Request, Chat
> - Expert System, pcap üzerinde "ilk bakış" analizi için kullanılır
> - En kritik: **Error** ve **Warn** seviyeleri

> **İstihbarat İşaretleri, Expert System analizi hızlandırır:**
>
> - İlk olarak Expert Information aç → sorunlu paketleri gör
> - Error/Warn seviyelerine odaklan
> - TCP Sequence sorunları ağ problemine işaret eder
> - HTTP 404/500 Response'ları hedef sistemde sorun olduğunu gösterir
> - Limit to display filter ile sadece ilgili IP/port'a odaklan

---

> **İstihbarat İşaretleri, Filtreler bir SOC analistinin günlük silahlarıdır:**
>
> - `tcp.flags.syn == 1 && tcp.flags.ack == 0` → Port scan tespiti
> - `http.request.method == "POST"` → Form verisi (credential sızıntısı riski)
> - `dns.qry.name.len > 30` → DNS exfiltration şüphesi
> - `tcp.analysis.retransmission` → Ağ sorunu veya SYN flood
> - `ip.src == 172.50.2.200` → Saldırganın bilinen IP'si

## Pratik Alıştırmaları

`module-27-exam-practice.pcap` dosyasını aç ve şu filtreleri uygula:

1. Sadece HTTP POST isteklerini göster
2. DNS ile sorgulanan tüm domainleri bul
3. TLS handshake paketlerini göster
4. ICMP ping paketlerini göster
5. 172.50.2.200 IP'sinden gelen tüm trafiği göster
6. 1000 byte'tan büyük paketleri göster
7. TCP RST paketlerini bul
8. HTTP 403 ve 404 response'larini bul (`module-13-http.pcap` kullan)

**Alıştırma Cevapları:**

| # | Filtre |
|---|--------|
| 1 | `http.request.method == "POST"` |
| 2 | `dns.qry.name` |
| 3 | `tls.record.content_type == 22` |
| 4 | `icmp.type == 8 \|\| icmp.type == 0` |
| 5 | `ip.src == 172.50.2.200` |
| 6 | `frame.len > 1000` |
| 7 | `tcp.flags.reset == 1` |
| 8 | `http.response.code == 403 \|\| http.response.code == 404` |

---

## Sınav Soruları (Çöz)

`module-27-exam-practice.pcap` dosyasını kullanarak cevapla:

1. `ip.addr != 172.50.2.100` filtresi ile `!(ip.addr == 172.50.2.100)` filtresi arasındaki fark nedir? Hangisi sınavda kullanılmalıdır?
2. Sadece TCP 80 ve 443 portlarına giden paketleri gösterecek tek satırlık bir display filter yaz.
3. `tcp.flags == 0x0012` ne anlama gelir? Hangi TCP aşamasında görünür?
4. DNS NXDOMAIN hatası veren paketleri bulmak için hangi filtre kullanılır?
5. Bir pcap'de yalnızca şifrelenmemiş (cleartext) HTTP trafiğini görmek istiyorsun. Filtren ne olur?
6. Capture filter `host 172.50.2.10 and tcp port 80` yazıldığında hangi paketler yakalanır? Neler kaçar?
7. Wireshark varsayılan coloring rules hangi protokollere hangi renkleri atar? En az 4 tane say.
8. Expert System'de kaç severity seviyesi vardır? En kritik olan hangisidir?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. `ip.addr != 172.50.2.100` kaynak **VEYA** hedefi 100 olmayan paketleri gösterir: Sonuçta 100 ile ilgili birçok paket yine listelenir. `!(ip.addr == 172.50.2.100)` ise 100 IP'sinin hiçbir rolde olmadığı paketleri gösterir. **Sınavda `!(ip.addr == X)` kullan.**

2. `tcp.dstport == 80 || tcp.dstport == 443`

3. `0x0012` = SYN + ACK bayrakları set. TCP 3-way handshake'in 2. adımında (sunucu→istemci) görünür.

4. `dns.flags.rcode == 3`

5. `http && !(tcp.port == 443)` veya `http.request || http.response` (HTTPS zaten http display filter ile görünmez).

6. Sadece 172.50.2.10 IP'si ile ilgili ve TCP portu 80 olan paketler yakalanır. UDP 53 (DNS), ICMP ping, TCP 443 (HTTPS) ve diğer tüm trafiğe ait paketler **kaçar**.

7. **TCP=Açık Mor (lavanta), UDP=Açık Mavi, HTTP=Açık Yeşil, ICMP=Açık Pembe, ARP=Krem.** DNS ve TLS/SSL için varsayılan renk kuralı yoktur. (En az 4 tanesi yeterli)

8. 4 severity seviyesi: Error (Kırmızı X), Warn (Sarı üçgen), Note (Mavi daire), Chat (Yeşil konuşma). En kritik: Error, ardından Warn.

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!