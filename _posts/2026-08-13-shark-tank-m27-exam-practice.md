---
layout: post
title:  "shark-tank - m27: Sınav Pratiği"
date:   2026-08-13 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 27: Sınav Pratiği

**Neden?** Sınav günü. 60 dakikan var. Karışık pcap'te port scan, SQL injection, HTTP credential capture, DNS tunneling, FTP brute force, C2 beaconing, gizlice indirilmiş bir ZIP arşivi: Hepsi aynı dosyada. Saldırgan DNS çözümlemesiyle işe başlamış, ardından web sunucudan dosya indirmiş — zincirin halkaları pcap'te birbirini takip ediyor. Tüm protokolleri birleştirip kill chain'i oluşturmak sınavın ve gerçek hayatın ta kendisidir. Bu modülde, sınav formatında tüm becerileri uygulamayı öğreneceksin.

**Görev:** Karışık pcap'i analiz et. Tüm protokolleri tanı, anomalileri bul, indirme zincirini ve ZIP içeriğini kurtar, soruları cevapla.

**Öğrenim Hedefleri:**
- Karışık protokol trafiğinde (HTTP, DNS, TLS, ICMP, FTP, TCP) hızlıca gezinebilmek
- Port scan, SYN flood, credential capture, brute force gibi saldırıları tek pcap'te tespit edebilmek
- DNS çözümlemesi → dosya indirme zincirini takip edip indirilen dosyayı kurtarabilmek
- Protocol Hierarchy, Conversations, IO Graph gibi istatistik araçlarını etkin kullanabilmek
- Tüm Wireshark becerilerini 60 dakika içinde sınav formatında uygulayabilmek
- Saldırganın kill chain'ini oluşturup adımları kronolojik sıraya koyabilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **pcap** | Packet Capture: Ağ trafiğinin yakalanıp kaydedildiği dosya formatı. Bir pcap dosyası, ağ kartından geçen her paketin kopyasını alır ve zaman damgasıyla birlikte saklar. Güvenlik analistleri bir olayı incelerken "ağda ne oldu?" sorusunun cevabını pcap dosyasında arar. Wireshark ile açıldığında her paket katman katman (Ethernet → IP → TCP → uygulama) görüntülenebilir. Ders boyunca `shared/pcaps/` klasöründeki pcap dosyaları üzerinde çalışacaksın. |
| **display filter** | Wireshark'ta yakalanan paketler arasında filtreleme yapmak için kullanılan sistem. Yakalama bittikten sonra çalışır: Paketleri silmez, yalnızca belirttiğin kritere uymayanları gizler. Display filter yazımı Wireshark'a özgü bir syntax kullanır: `ip.addr == 172.50.2.10`, `tcp.port == 80`, `http.request.method == "GET"` gibi. Birden fazla koşul `&&` (ve), `\|\|` (veya), `!` (değil) operatörleriyle birleştirilebilir. WCNA sınavında en çok test edilen filtreleme türüdür. |
| **Protocol Hierarchy** | Wireshark ve tshark'ın bir pcap içindeki protokolleri katman katman özetleyen istatistik aracı. Her protokolün pcap içindeki paket sayısını ve yüzde oranını gösterir: Örneğin "%85 TCP, %60 HTTP, %20 DNS, %15 ARP" gibi. Bu özet, pcap'in genel içeriğini hızlıca anlamak için ilk bakılan araçtır. GUI'de `Statistics > Protocol Hierarchy`, tshark'ta `-q -z io,phs` komutuyla kullanılır. |
| **Conversations** | Wireshark'ın bir pcap içindeki tüm iletişim çiftlerini (conversation) listeleyen istatistik aracı. `Statistics → Conversations` menüsünden açılır. Her satır iki cihaz arasındaki trafiği özetler: Kaynak ve hedef IP, port, paket sayısı, byte sayısı, süre. TCP, UDP ve IP seviyesinde ayrı ayrı gösterilir. Baseline analizinde hangi IP çiftlerinin normalde ne kadar veri transfer ettiğini belirlemek için kullanılır. Beklenmeyen yeni conversation'lar (bilinmeyen bir dış IP ile çok veri) veri sızdırma veya C2 bağlantısı gösterebilir. |
| **IO Graph** | Wireshark'ın tüm trafiğin zaman içindeki dağılımını gösteren genel amaçlı grafik aracı. `Statistics → IO Graph` menüsünden açılır. X ekseni zamanı, Y ekseni paket/saniye veya byte/saniyeyi gösterir. Belirli zaman aralıklarında (interval) trafik yoğunluğunu görselleştirir: Ani spike'lar DDoS veya veri sızdırma, düz ve düşük seviye normal trafiği gösterir. Display filter ile farklı protokolleri veya IP'leri ayrı renklerde çizdirebilirsin. Sınavda "hangi grafik toplam trafik yoğunluğunu gösterir?" sorusunun cevabı IO Graph'tir. |
| **Expert Information** | Wireshark'ın pcap içindeki anormallikleri ve sorunları otomatik olarak tespit edip listelediği panel. `View > Expert Information` (Ctrl+Alt+Shift+E) menüsünden açılır. Sorunları dört ciddiyet seviyesinde gruplar: Error (kırmızı), Warn (sarı), Note (mavi), Chat (yeşil). Bir analist pcap'i açtığında ilk bakması gereken yerlerden biridir; çünkü retransmission, duplicate ACK, zero window, HTTP 404 gibi sorunları paket tek tek aranmadan özet olarak gösterir. |

## Teori

Gerçek bir sınav veya olay müdahalesinde karşına **tek bir protokolün** pcap'i çıkmaz. Saldırganlar:

- **HTTP** ile C2 (Command & Control) haberleşmesi yapar
- **DNS** ile veri sızdırır (DNS tunneling)
- **FTP** ile çalınan verileri dışarı aktarır
- **ICMP** ile keşif yapar (ping sweep, covert channels)
- **TLS** ile trafiği şifreleyip gizler

Bu modül, tüm bu protokolleri aynı anda analiz etme becerini ölçer.

### Anahtar Kavramlar:

| Kavram | Anlamı |
|--------|--------|
| **Protocol Hierarchy** | Hangi protokoller var? Oranları nedir? |
| **Conversations** | Hangi IP'ler hangi portlardan konuşuyor? |
| **Time Delta** | Paketler arası süre: Saldırı desenlerini yakala |
| **Anomali** | Normalden sapan her şey (yanlış port, hatalı paket, scan) |
| **Follow TCP Stream** | Bir TCP akışının tam içeriğini gör |

## Genel Bakış

Bu modül, sınavda karşılaşacağın türdeki soruları pratik etmen içindir.
Karışık trafik içeren bir pcap dosyası üzerinde çalışacaksın.

> **İstihbarat İşaretleri, Gerçek dünyada saldırılar tek protokolle gelmez:**
>
> - Aynı pcap'de HTTP + DNS + FTP + ICMP = **Karışık senaryo** (gerçek incident)
> - Statistics > Protocol Hierarchy ile genel resmi gör
> - Statistics > Conversations ile **kim kimle konuşuyor** tespit et
> - `ip.addr == 172.50.2.200` ile saldırganın tüm aktivitesini filtrele
> - **Dikkat:** Saldırganın davranış kalıpları tutarlı mı? Bir APT bu kadar mı "gürültülü" olur?

## Hazırlık

```sh
# Karışık trafik oluştur:
./scripts/generate-traffic.sh mixed

# Wireshark ile aç:
# macOS: open -a Wireshark module-27-exam-practice.pcap
# Linux: wireshark module-27-exam-practice.pcap &
# Windows: start wireshark module-27-exam-practice.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

---

## SENARYO 1: Genel Trafik Analizi

### Soru 1: Kaç farklı protokol var?

**İpucu:** Wireshark'ta **Statistics > Protocol Hierarchy** menüsünü kullan.

```text
Beklenen sonuç:
- Ethernet
- Internet Protocol (IP)
  - TCP
    - HTTP
    - TLS
  - UDP
    - DNS
  - ICMP
```

### Soru 2: Ağdaki IP adreslerini listele

**İpucu:** **Statistics > Endpoints > IPv4**

```text
Beklenen:
- 172.50.2.100  (Client)
- 172.50.2.10   (Web)
- 172.50.2.11   (DNS)
- 172.50.2.12   (TCP Echo)
- 172.50.2.13   (HTTPS)
- 172.50.2.14   (ICMP Target)
- 172.50.2.15   (FTP)
- 172.50.2.200  (Attacker)
```

### Soru 3: Hangi IP en çok trafik üretti?

**İpucu:** **Statistics > Conversations > IPv4** -> Bytes sütununa göre sırala.

---

## SENARYO 2: HTTP Forensics

### Soru 4: Admin kullanıcısının şifresi nedir?

```text
# Filtre:
http.request.method == "POST"
```

POST body'sindeki `password` alanını bul.

**Beklenen:** `secret123`

### Soru 5: Hangi web sayfaları ziyaret edildi?

```text
# Filtre:
http.request
```

Her GET/POST isteğinin URI'sini listele.

### Soru 6: HTTP response'lardan hangi dosya/dosyalar export edilebilir?

**İpucu:** **File > Export Objects > HTTP**

---

## SENARYO 3: DNS Analizi

### Soru 7: Hangi domainler sorgulandı?

```text
# Filtre:
dns.flags.response == 0
```

Her DNS query'nin `Query Name` alanını not al.

### Soru 8: web.shark-tank.local hangi IP'ye çözümlendi?

```text
# Filtre:
dns.qry.name == "web.shark-tank.local" && dns.flags.response == 1
```

Answer RR'deki IP adresini bul.

**Beklenen:** `172.50.2.10`

### Soru 9: NXDomain (bulunamayan) domain var mı?

```text
# Filtre:
dns.flags.rcode == 3
```

### Soru 9b: DNS → İndirme Zinciri: ZIP Dosyası Kim İndirdi?

Aynı pcap'te bir **resolver → download** zinciri var: DNS yanıtı geldiğinden
yarım saniye sonra, çözümlenen sunucudan bir ZIP indirildi. Sınavın klasik
"bağlantıyı kur" sorusu budur.

```text
# Adım 1 — DNS çözümlemesi:
dns.qry.name == "web.shark-tank.local"

# Adım 2 — hemen ardından gelen indirme:
http.request.uri contains "batch-report.zip"
```

1. DNS yanıtının IP'si (172.50.2.10) ile GET'in gittiği IP aynı mı?
2. `http.response.code == 200` ve `Content-Type: application/zip` —
   yanıt satırında dosya boyutu ne? (775 byte)
3. **Dosyayı kurtar:** İndirme paketine sağ tık → **Follow > TCP
   Stream** → "Show data as: Raw" → Save. Alternatif:
   **File > Export Objects > HTTP** → `batch-report.zip` seç → Save.
4. Bütünlük kanıtı — hash al:
   ```sh
   shasum -a 256 batch-report.zip
   # 71fb05262807ec6f9a61f41a51dae43d69e96077d95cee825d715056e1551275
   ```
5. İçerik kanıtı — magic bytes:
   ```sh
   xxd batch-report.zip | head -1
   # 00000000: 504b 0304 ...   <-- "PK\x03\x04" = ZIP imzası
   ```
   `unzip -l batch-report.zip` ile arşiv listesini çıkar (3 rapor dosyası).

> **SINAV İPUCU:** "pcap'ten indirilen dosyayı çıkarın + hash'ini
> verin" sorusu Export Objects ile 30 saniyedir. Magic bytes, dosya
> uzantısı yalansa bile gerçek tipi kanıtlar (PK=ZIP, MZ=Windows
> çalıştırılabilir, %PDF=PDF).

---

## SENARYO 4: TLS Analizi

### Soru 10: TLS handshake'de hangi cipher suite seçildi?

```text
# Filtre:
tls.handshake.type == 2    # ServerHello
```

`Cipher Suite` alanını bul.

### Soru 11: TLS sertifikasını kim verdi (issuer)?

> **Not:** Bu pcap'te Certificate (tip 11) paketi **yoktur**: TLS oturumu yalnızca handshake başlangıcı ve şifreli veri içerir. Sertifika analizi için `module-16-tls.pcap`'i aç (aynı filtre).

```text
# Filtre:
tls.handshake.type == 11   # Certificate
```

Certificate > issuer alanını incele.

**Beklenen (module-16 pcap):** `O=Shark-Tank, OU=Network Analysis Lab`

### Soru 12: Şifrelenmiş veri okunabilir mi?

```text
# Filtre:
tls.record.content_type == 23
```

Application Data paketlerini incele -> hex veri görünür, ama anlamlı değil.

---

## SENARYO 5: ICMP Analizi

### Soru 13: Kaç ping başarılı oldu?

```text
# Filtre:
icmp.type == 0    # Echo Reply
```

Başarılı ping sayısı = Reply sayısı.

### Soru 14: RTT (Round Trip Time) ortalama kaç ms?

Her Request-Reply çifti arasındaki zaman farkını hesapla.

---

## SENARYO 6: Güvenlik Analizi (Port Scan)

### Soru 15: Port scan hangi IP'den geldi?

```text
# Filtre:
tcp.flags.syn == 1 && tcp.flags.ack == 0
```

Tek bir IP'den çok fazla farklı porta SYN gönderildiğini göreceksin.

**Beklenen:** `172.50.2.200` (Attacker)

### Soru 16: Hangi portlar AÇIK bulundu?

AÇIK portlar: SYN'e SYN-ACK cevap geldi.
```text
tcp.flags.syn == 1 && tcp.flags.ack == 1 && tcp.srcport < 1024
```

### Soru 17: Hangi portlar KAPALI?

KAPALI portlar: SYN'e RST cevap geldi.
```text
tcp.flags.reset == 1
```

### Soru 18: SYN flood simulasyonunu bul

```text
# Filtre:
tcp.flags.syn == 1 && tcp.flags.ack == 0 && ip.src == 172.50.2.200
```

Kısa sürede çok fazla SYN paketi = SYN flood.

**Kaç SYN paketi gönderildi?** Say.

### Soru 19: IO Graph ile SYN Flood'u Görselleştir

1. Statistics > IO Graph
2. X ekseni: Zaman, Y ekseni: Packets/Tick
3. **Filter** alanına `tcp.flags.syn == 1 && tcp.flags.ack == 0` yaz
4. SYN flood'un oluşturduğu dikey pik'i görsel olarak tespit et
5. Normal trafik ile saldırı trafiği arasındaki farkı IO Graph üzerinde gözlemle

> **SINAV İPUCU:** IO Graph, SYN flood gibi volumetrik saldırıları görselleştirmek için en hızlı araçtır.
>
> Normal trafik düşük seyrederken, saldırı anında grafikte anlık bir "tepe" (spike) görürsün.

---

## SENARYO 7: FTP Analizi

Bu pcap'te FTP sunucusuna (172.50.2.15) başarılı bir giriş var.

### Soru 20: FTP kullanıcı adı ve şifre nedir?

```text
# Filtre:
ftp.request.command == "USER" || ftp.request.command == "PASS"
```

FTP, tıpkı HTTP gibi şifresizdir. Kullanıcı adı ve şifre açıkça görünür.

**Beklenen:** `ftpuser / ftppass123`

### Soru 21: Başarılı giriş sonrası hangi komutlar gönderildi?

```text
# Tüm FTP komutları:
ftp.request.command
```

### Soru 22: FTP hangi portları kullanıyor?

- **Kontrol (komut):** TCP 21
- **Veri (data):** TCP 20 veya rastgele yüksek port (PASV mode)

> **SINAV İPUCU:** FTP, HTTP gibi cleartext protokoldür. Wireshark ile FTP şifrelerini okuyabilirsin.
>
> FTP'de iki kanal vardır: Control (21) ve Data (20/PASV).

---

## SENARYO 8: Kill Chain Oluşturma

Tüm senaryoları birleştirip saldırganın adımlarını kronolojik sıraya koy:

### Aşamalar:

| Aşama | Bulgu | Filter/IP |
|-------|-------|-----------|
| **1. Reconnaissance** | Port scan | SYN → farklı portlara |
| **2. Weaponization** | (Bu pcap'te yok: Saldırı araçları önceden hazırlanır) | - |
| **3. Delivery** | HTTP POST /auth + FTP giriş | curl istekleri |
| **4. Exploitation** | (Bu pcap'te yok: Zafiyet sömürme) | - |
| **5. Installation** | SYN flood (DoS) | Aynı porta çok SYN |
| **6. C2** | (Bu pcap'te yok: Düzenli beaconing) | - |
| **7. Exfiltration** | Credential sızıntısı (HTTP) | POST body: Secret123 |

> **Not:** Bu pcap karışıktır: HTTP POST /auth ve FTP girişi **Client (.100)** trafiğidir (zaman: 0.10 sn ve 8.71 sn); saldırgan (.200) yalnız scan (9.87), SYN flood ve beacon (11.19+) üretir. Kill chain'i kurarken aktörleri ayır: klasik zincir "adamın" adımlarını takip eder, karışık pcap'te her bulguyu sahibine bağla.

### Ne Yapmalısın?
1. **Statistics > Conversations > IPv4** ile tüm konuşmaları listele
2. Zaman sütununa göre sırala: Hangi paket önce geldi?
3. Attacker (172.50.2.200) ile Client (172.50.2.100) aktivitelerini ayır
4. Kronolojik sırayı belirle: Scan mı önce, flood mu önce, FTP mi önce?
5. Her aşama için kanıt paket numarasını not et

### Statistics > Flow Graph ile Kill Chain Timeline:

**Flow Graph**, tüm trafiğin görsel zaman çizelgesini gösterir: Kill chain oluşturmak için en hızlı araçtır.

1. **Statistics > Flow Graph** menüsünü aç
2. Her bağlantı ayrı bir satırda, paketler zaman çizelgesinde gösterilir
3. Attacker (172.50.2.200) satırını bul: Hangi paketlerden başlıyor?
4. Saldırı aşamalarını çizelgede işaretle:
   - İlk SYN paketleri = Reconnaissance (port scan)
   - HTTP istekleri = Delivery (credential deneme)
   - FTP bağlantısı = Delivery (veri erişimi)
   - SYN flood = Installation/DoS
5. **Bars** yerine **Default** görünümü dene: Her protokol farklı renkte

> **SINAV İPUCU:** Flow Graph, "saldırgan ne zaman ne yaptı?" sorusunun görsel cevabıdır.
>
> Conversations tablosu + Flow Graph birlikte kullanıldığında kill chain kronolojisi tam olarak ortaya çıkar.

> **SINAV İPUCU:** Gerçek bir incident response'ta kill chain oluşturmak, saldırganın ne yaptığını anlamanın en etkili yoludur.
>
> Wireshark'ta zaman damgalarını takip ederek her adımı sıralayabilirsin.

---

## SENARYO 9: TCP Akış Analizi

### Soru 23: TCP echo sunucusuna gönderilen mesaj neydi?

```text
# Filtre:
tcp.dstport == 8080 && tcp.payload
```

Payload alanını incele.

**Beklenen:** `test`

### Soru 24: 3-way handshake örneği bul

```text
# Filtre:
tcp.flags.syn == 1 && tcp.flags.ack == 0
```

Her SYN için sonraki SYN-ACK ve ACK paketlerini bul.

---

## SENARYO 10: AD Keşfi (Kerberoasting)

> Bu senaryo `shared/pcaps/module-17-kerberos.pcap` üzerinde çalışır —
> modül 17'nin sentez provasıdır.

### Soru 25: Yanlış parola denemesi kaçıncı karede ve hangi kullanıcıya?

```text
# Filtre:
kerberos.error_code == 24
```

**Beklenen:** Frame 16, kullanıcı analyst (cname alanından)

### Soru 26: Saldırgan kaç farklı SPN'e bilet istedi?

```text
# Filtre:
kerberos.msg_type == 12 && ip.src == 172.50.2.200
```

**Beklenen:** 5 SPN (www, ldap, cifs, host, backup — Kerberoast imzası)

### Soru 27: Saldırgan TGT'sini nasıl aldı ve bu neden tespit zor?

```text
# Filtre:
kerberos.msg_type == 11 && ip.addr == 172.50.2.200
```

**Beklenen:** Geçerli analyst kimliğiyle normal AS akışı (frame 78-80) —
kimlik doğrulama BAŞARILI görünür; kalıp analizi (çoklu SPN) şarttır.

---

## BONUS: Wireshark İstatistik Araçları

Sınavda işine yarayacak istatistik menüleri:

| Menü | Ne İşe Yarar |
|------|-------------|
| **Statistics > Summary** | Genel özet (toplam paket, süre, vb.) |
| **Statistics > Protocol Hierarchy** | Protokol dağılımı |
| **Statistics > Conversations** | IP/TCP/UDP konuşmaları |
| **Statistics > Endpoints** | IP/MAC endpoint'leri |
| **Statistics > HTTP > Requests** | HTTP istek listesi |
| **Statistics > DNS** | DNS sorgu istatistikleri |
| **Statistics > Flow Graph** | Görsel akış grafikleri |
| **Statistics > TCP Stream Graphs** | TCP performans grafikleri |
| **Statistics > IO Graph** | Zaman bazlı trafik yoğunluğu, saldırı tespiti |

---

## Sınavda Zaman Yönetimi

1. **Önce pcap'i aç ve genel bakış at** (Protocol Hierarchy, Conversations)
2. Soruyu oku -> uygun filtre yaz
3. **Follow TCP Stream** ile tam oturumları oku
4. **Export Objects** ile dosyaları kurtar
5. **Statistics** menüleriyle genel istatistikleri al
6. **Zamanın varsa** her soruyu ikinci kez kontrol et

---

## Sınav Soruları (Çöz)

1. pcap'de kaç farklı **protokol** tespit ediliyor?
2. Hangi IP adresleri trafiğe katılıyor?
3. En çok trafik üreten IP hangisi? (**Statistics > Endpoints**)
4. HTTP POST body'sinde hangi credential var?
5. HTTP ile hangi endpoint'lere istek yapılmış?
6. HTTP response'dan hangi veriler export edilebilir?
7. DNS'de hangi domain'ler sorgulanıyor?
8. web.shark-tank.local hangi IP'ye çözümleniyor?
9. DNS'de hata alan (NXDOMAIN) sorgu var mı?
10. TLS handshake'de hangi TLS sürümü kullanılıyor?
11. Sertifikanın **Issuer** bilgisi nedir?
12. TLS Application Data içeriği görülebilir mi?
13. Toplam kaç ICMP Echo Reply var?
14. En düşük RTT değeri nedir?
15. Ping atan IP hangisi?
16. Hangi portlar açık (SYN-ACK dönen)?
17. Hangi portlar kapalı (RST dönen)?
18. Kaç SYN paketi gönderilmiş?
19. IO Graph ile SYN flood'u görselleştir: Grafikte ne görüyorsun?
20. FTP kullanıcı adı ve şifresi nedir?
21. Başarılı FTP giriş sonrası hangi komutlar gönderildi?
22. FTP hangi portları kullanıyor?
23. TCP echo akışında hangi metin gönderilmiş?
24. TCP handshake'de sıralama nasıl?
25. ZIP dosyası hangi DNS çözümlemesinin hemen ardından indirildi?
26. İndirilen ZIP'in SHA-256 hash'i nedir? (pcap'ten kurtar + shasum)
27. ZIP'in içindeki dosya adları neler? (unzip -l)
28. DNS yanıtı ile ZIP GET isteği arasında ne kadar zaman geçti? (delta)

Cevaplar aşağıda:

**Tebrikler!** Tüm modülleri tamamladın. Başarılar!

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

**SENARYO 1:**
1. TCP, UDP, ICMP, ARP: Protocol Hierarchy'de TCP altında HTTP/TLS, UDP altında DNS görülür. FTP de TCP üzerinde gelir.
2. 172.50.2.10, .11, .12, .13, .14, .15, .100, .200
3. 172.50.2.100 (Client) veya 172.50.2.200 (Attacker): Statistics > Endpoints ile bulunur

**SENARYO 2:**
4. secret123 (POST /auth body: Username=admin&password=secret123)
5. / (ana sayfa), /api/data, /auth
6. HTTP Object Export ile JSON response'lar

**SENARYO 3:**
7. web.shark-tank.local, secure.shark-tank.local, google.com, nonexistent.shark-tank.local
8. 172.50.2.10
9. Evet, nonexistent.shark-tank.local

**SENARYO 4:**
10. TLS handshake > ServerHello içinde görülür
11. O=Shark-Tank, OU=Network Analysis Lab (self-signed) — bu pcap'te Certificate yok; module-16-tls.pcap'te görünür
12. Hayır, Application Data şifrelidir

**SENARYO 5:**
13. Bu pcap'te 3 başarılı ping var (3 Echo Reply; `icmp.type == 0` filtresiyle say).
14. Değişkendir. RTT sütununu kontrol et.
15. 172.50.2.100 (Client): ICMP Echo Request'ler bu IP'den gönderildi

**SENARYO 6:**
16. 80 (HTTP), SYN-ACK gelen portlar
17. RST gelen veya yanıt vermeyen portlar
18. SYN sayısı değişkendir. `ip.src==172.50.2.200 && tcp.flags.syn==1 && tcp.flags.ack==0` filtresiyle say.
19. IO Graph'da SYN flood anında dikey bir pik (spike) görülür. Normal trafik düşük seyrederken saldırı anında ani yükseliş olur.

**SENARYO 7 (FTP):**
20. ftpuser / ftppass123: FTP cleartext olduğu için Wireshark'ta açıkça görünür
21. SYST, PWD, PASV, LIST gibi komutlar: `ftp.request.command` filtresiyle görülür
22. Kontrol: TCP 21, Veri: PASV response'unda verilen yüksek port (21100-21110 arası)

**SENARYO 8 (Kill Chain):**
> **Reconnaissance (port scan), Delivery (HTTP + FTP), Installation (SYN flood), Exfiltration (credential sızıntısı). Weaponization, Exploitation, C2 bu pcap'te yok.**

**SENARYO 9:**
23. "test" (echo "test" | nc 172.50.2.12 8080)
24. Herhangi bir TCP bağlantısında SYN → SYN-ACK → ACK görülür

**SENARYO 3b (ZIP zinciri):**
25. `web.shark-tank.local` → `172.50.2.10` çözümlemesinin hemen ardından `GET /downloads/batch-report.zip` (dns.qry.name == "web.shark-tank.local" + http.request.uri contains "batch-report.zip" ile zincir kurulur)
26. `71fb05262807ec6f9a61f41a51dae43d69e96077d95cee825d715056e1551275` (Export Objects > HTTP ile kurtar, sonra `shasum -a 256`)
27. `rapor-ozet.txt`, `rapor-detay.txt`, `hash-listesi.txt` (magic bytes: `PK\x03\x04`)
28. frame.time_relative ile ölçülür; DNS yanıtı ile GET arası ~0.2-0.5 sn (Time Display Format > Seconds Since Previous Captured Packet kolaylık sağlar; değer ortam hızına göre değişir)

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
