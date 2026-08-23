---
layout: post
title:  "shark-tank - m08: TCP Analizi"
date:   2026-07-25 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 08: TCP Analizi

**Neden?** SOC alarmı: Dış IP'den sana doğru binlerce SYN paketi geliyor. Port scan mı, SYN flood mu? TCP, internetteki tüm kritik trafiğin temelidir. Port scanning (SYN scan, Connect scan), SYN flood DDoS, TCP hijacking, Null/FIN/Xmas scan: Hepsi TCP flag'leriyle çalışır. TCP handshake'i analiz etmek, saldırganın ağ haritasını çıkarmasının ilk adımını anlamaktır. Bu modülde, TCP flag'lerini okuyarak scan'i normal trafikten ayırmayı öğreneceksin.

**Görev:** TCP SYN filtresini yaz. Saldırgan hangi portları hedefledi? Hangileri açık?

**Öğrenim Hedefleri:**
- TCP 3-way handshake (SYN, SYN-ACK, ACK) adımlarını analiz edebilmek
- TCP flag'lerini (SYN, ACK, FIN, RST, PSH, URG) tanıyıp yorumlayabilmek
- Sequence ve acknowledgment numaralarını takip edebilmek
- Port scanning (SYN scan, Connect scan, FIN scan) tespiti yapabilmek
- TCP bağlantı sonlandırma (FIN, RST) sürecini anlamak

## Terimler

| Terim | Açıklama |
|-------|----------|
| **TCP** | Transmission Control Protocol: İnternetin güvenilir ve sıralı veri iletimini sağlayan protokol. Veriyi göndermeden önce alıcıyla bağlantı kurar (3-way handshake), gönderdiği her paket için onay (ACK) bekler ve onay gelmeyen paketleri yeniden gönderir (retransmission). Bu mekanizmalar sayesinde veri kaybı olmadan ve gönderim sırasında bozulmadan teslim edilir. Web (HTTP), email (SMTP), dosya transferi (FTP) gibi kritik işlemlerin tamamı TCP üzerinden çalışır. Bağlantı kurma ve onay bekleme yükü nedeniyle UDP'den yavaştır, ama güvenilirlik gerektiğinde tek seçenektir. |
| **port** | Bir cihaz üzerindeki uygulama girişi. 16 bitlik bir numaradır (0–65535) ve her ağ servisi belirli bir port numarasını kullanır: HTTP 80, HTTPS 443, DNS 53, FTP 21 gibi. Bir paket cihaza ulaştığında, port numarasına bakarak hangi uygulamaya teslim edileceği belirlenir. 0–1023 arası "well-known" (iyi bilinen) portlarıdır ve standart servislere ayrılmıştır. |
| **3-way handshake** | TCP bağlantısının kurulduğu üç adımlı süreç. İlk adımda istemci sunucuya SYN (bağlantı açma isteği) gönderir. İkinci adımda sunucu SYN-ACK (isteğin alındığı ve kabul edildiği) ile yanıt verir. Üçüncü adımda istemci ACK gönderir ve bağlantı kurulmuş olur. Bu sürecin amacı, her iki tarafın da birbirini duyabildiğini ve veri almaya hazır olduğunu teyit etmektir. Wireshark'ta her TCP bağlantısının ilk üç paketi bu sırayı izler. Bağlantı kapatılırken de benzer ama dört adımlı bir süreç (FIN → ACK → FIN → ACK) kullanılır. |
| **SYN** | Synchronize: TCP header'ındaki bağlantı kurma bayrağı. Bir cihaz başka bir cihazla TCP bağlantısı kurmak istediğinde ilk gönderdiği pakette SYN flag set eder. SYN paketi ayrık olarak gelir: SYN=1, ACK=0. SYN-ACK ise sunucunun yanıtıdır: Hem SYN hem ACK set edilir. Wireshark'ta `tcp.flags.syn == 1 && tcp.flags.ack == 0` filtresiyle bulunur. Aynı IP'den çok sayıda farklı porta SYN gönderilmesi port scan göstergesidir; aynı porta yüksek hızda sürekli SYN gönderilmesi ise SYN flood saldırısıdır. |
| **ACK** | Acknowledgment: TCP'de alınan veriyi onaylama mekanizması. TCP güvenilir bir protokol olduğu için, aldığı her veri için kaynak tarafa ACK gönderir. ACK numarası, "bu numaraya kadar olan tüm byte'ları aldım, bir sonrakini bekliyorum" anlamına gelir. SYN paketi hariç, bir TCP bağlantısındaki neredeyse her pakette ACK flag set edilir. Sadece ACK set olan paketler `tcp.flags == 0x010` filtresiyle bulunur. ACK gelmeyen paketler zaman aşımı sonrası yeniden gönderilir (retransmission). |
| **FIN** | Finish: TCP bağlantısını kapatma bayrağı. Veri iletimi bittiğinde, tarafı gönderen bir FIN paketi gönderir ve karşı taraf ACK ile yanıtlar. Bağlantı her iki yönden ayrı ayrı kapatılır, bu yüzden kapatma süreci dört adımlıdır: FIN → ACK → FIN → ACK. Bazen FIN ve ACK aynı pakette birleşir (FIN-ACK). Wireshark'ta `tcp.flags.fin == 1` filtresiyle görülür. FIN, bağlantının normal (graceful) şekilde kapatıldığını gösterir; RST ise zorla kesildiğini. |
| **RST** | Reset: TCP bağlantısını zorla kesme bayrağı. Bir cihaz, beklenmeyen veya geçersiz bir paket aldığında bağlantıyı aniden sonlandırmak için RST gönderir. En yaygın senaryo: Kapalı bir porta bağlanma denemesi (SYN gönderilir, sunucu RST döner). Port scan sırasında RST alan portlar kapalı, SYN-ACK alan portlar açıktır. Çok sayıda RST paketi port scan, bağlantı sorunu veya güvenlik duvarı reddi gösterebilir. Wireshark'ta `tcp.flags.reset == 1` filtresiyle görülür. |
| **PSH** | Push: TCP'de verinin arabelleğe (buffer) alınmadan doğrudan uygulama katmanına iletilmesi gerektiğini belirten bayrak. Normalde TCP, küçük veri parçalarını biriktirip yeterince büyüdüğünde gönderir (Nagle algoritması). PSH flag bu davranışı atlatır ve veriyi anında teslim eder. HTTP isteklerinin ve response'larının son paketinde genellikle PSH setlidir. İnteraktif oturumlarda (SSH, Telnet) her tuş vuruşu PSH ile gönderilir. Wireshark'ta `tcp.flags.push == 1` filtresiyle görülür. |
| **URG** | Urgent: Pakette acil (öncelikli) veri bulunduğunu belirten bayrak; Urgent Pointer alanı, acil verinin veri bloğunun neresinde bittiğini gösterir. Tarihsel olarak Telnet kontrol karakterleri için kullanıldı; modern trafikte neredeyse hiç görünmediği için bir URG paketi anomali — bazı güvenlik duvarları ve IDS'ler URG'lı paketleri şüpheli olarak işaretler. Wireshark'ta `tcp.flags.urg == 1` filtresiyle görülür. |
| **sequence number** | TCP header'ındaki, gönderilen verinin sırasını takip eden 32 bitlik numara. Her byte'ın TCP akışında bir sıra numarası vardır; sequence number, bir paketin taşıdığı ilk byte'ın sırasını belirtir. Alıcı bu numaraya bakarak verinin doğru sırada gelip gelmediğini ve eksik byte olup olmadığını anlar. Bağlantı kurulurken her taraf rastgele bir başlangıç sequence number (ISN) seçer; Wireshark bunları 0'dan başlayacak şekilde göreceli (relative) olarak gösterir, bu da analizi kolaylaştırır. |
| **port scan** | Bir ağdaki cihazın hangi portlarında servis (uygulama) çalıştığını tespit etme işlemi. Saldırgan, hedef cihaza çok sayıda farklı porta sırayla SYN paketleri gönderir. Açık portlar SYN-ACK ile yanıt verirken, kapalı portlar RST gönderir veya hiç yanıt vermez. En yaygın port scan türü SYN scan'dır (nmap `-sS`): Bağlantıyı tam kurmadan, SYN ve yanıtı inceleyerek port durumunu öğrenir. Wireshark'ta aynı kaynak IP'den kısa sürede çok sayıda farklı hedef porta SYN gönderilmesi olarak tespit edilir. |

## Teori

TCP (Transmission Control Protocol), güvenilir veri iletim protokolüdür.
- **Port:** Herhangi bir port (80=HTTP, 443=HTTPS, 8080=echo)
- **Güvenilir:** Her paket için onay (ACK) gönderilir
- **Sıralı:** Paketler sıralı teslim edilir
- **Bağlantı odaklı:** Önce bağlantı kurulur (handshake), sonra veri, sonra kapatılır

### TCP Flags:

| Flag | Anlamı | Kullanım |
|------|--------|----------|
| **SYN** | Senkronizasyon | Bağlantı kurma |
| **ACK** | Onay | Paket alındı |
| **FIN** | Bitiş | Bağlantı kapatma |
| **RST** | Sıfırlama | Bağlantıyı zorla kesme |
| **PSH** | Push | Veriyi hemen uygulama katmanına gönder |
| **URG** | Acil | Öncelikli veri |

### 3-Way Handshake:
```text
CLIENT                          SERVER
  |--- SYN (Seq=x) ------------>|    1. "Bağlantı kurmak istiyorum"
  |<-- SYN-ACK (Seq=y, Ack=x+1)-|    2. "Tamam, ben de hazırım"
  |--- ACK (Ack=y+1) ---------->|    3. "Anlaşıldı, başlıyoruz"
  |                             |
  |--- DATA (Seq=x+1) --------->|    Artık veri gönderilebilir
```

> **İstihbarat İşaretleri, Her siber saldırı reconnaissance ile başlar:**
>
> - Aynı IP'den **100+ farklı porta SYN** = Port scan (nmap -sS)
> - Aynı IP'den **saniyede 1000+ SYN aynı porta** = SYN Flood (DDoS)
> - **SYN gönderilmeden ACK gelmesi** = TCP Anomaly (olası spoofing)
> - **MSS veya Window Size anormal** = OS fingerprinting denemesi
> - **172.50.2.200** = Saldırganın bilinen IP'si: Ama gerçek IP'si bu olmayabilir

## Hazırlık

```sh
./scripts/generate-traffic.sh tcp
# macOS: open -a Wireshark module-08-tcp.pcap
# Linux: wireshark module-08-tcp.pcap &
# Windows: start wireshark module-08-tcp.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

## Alıştırma 1: 3-Way Handshake Yakala

### Filtre:
```text
tcp.flags.syn == 1 && tcp.flags.ack == 0
```
(Sadece SYN paketleri - bağlantı başlangıcı)

### Adımlar:
1. SYN paketini bul (ilk paket olmalı)
2. Orta panelde **Transmission Control Protocol** katmanını genişlet
3. Şu alanları incele:

```text
 v Transmission Control Protocol
     Source Port: 54306             <-- Rastgele istemci port'u
     Destination Port: 8080         <-- Hedef port (echo server)
     Sequence number: 0 (relative)  <-- Başlangıç seq no
     Flags: 0x002 (SYN)             <-- SADECE SYN set
     Window size value: 64240
     Maximum segment size: 1460     <-- MSS (maksimum segment boyutu)
```

4. Şimdi SYN-ACK paketini bul:
```text
tcp.flags.syn == 1 && tcp.flags.ack == 1
```

```text
     Flags: 0x012 (SYN, ACK)        <-- SYN ve ACK set
     Sequence number: 0 (relative)
     Acknowledgment number: 1       <-- İstemcinin Seq+1
```

5. Son olarak ACK paketini:
```text
tcp.flags == 0x010                   # Sadece ACK
```

> **SINAV İPUCU:** SYN -> SYN-ACK -> ACK üçlüsünü her TCP bağlantısında görürsün.
>
> İlk 3 paketi bulmak için `tcp.flags.syn==1 || (tcp.flags==0x010 && tcp.seq==1 && tcp.ack==1)` kullan.

## Alıştırma 2: Sequence ve Acknowledgment Numbers

TCP'de her byte sayılır. Seq/Ack numaraları **byte sayacıdır**.

### Örnek Akış:
```text
Paket 1: SYN          Seq=0,    Ack=0
Paket 2: SYN-ACK      Seq=0,    Ack=1      (SYN 1 byte sayılır)
Paket 3: ACK          Seq=1,    Ack=1
Paket 4: DATA (20 byte) Seq=1,  Ack=1      (20 byte veri gönderiliyor)
Paket 5: ACK          Seq=1,  Ack=21  (20 byte alındı, sonraki: 21)
```

### Ne Yapmalısın?
1. TCP echo sunucuna gönderilen mesajı bul
2. Her paket için Seq ve Ack numaralarını takip et
3. Seq = gönderilen son byte'in sırası
4. Ack = karşıdan beklenen bir sonraki byte'in sırası

> **SINAV İPUCU:** Seq/Ack numaralarını takip ederek veri akışını doğrulayabilirsin.
>
> Wireshark **relative sequence numbers** gösterir (gerçek değerler 0'dan başlamaz).

## Alıştırma 3: TCP Connection Teardown (FIN)

### Filtre:
```text
tcp.flags.fin == 1
```

TCP bağlantı kapatma (4-way handshake):
```text
CLIENT                          SERVER
  |--- FIN (Seq=x) --------->|    1. "Verim bitti, kapatmak istiyorum"
  |<-- ACK (Ack=x+1) --------|    2. "Tamam, aldım"
  |<-- FIN (Seq=y) ----------|    3. "Benim de verim bitti"
  |--- ACK (Ack=y+1) ------->|    4. "Tamam, görüldü"
```

> Bazen FIN ve ACK aynı pakette birleşir (FIN-ACK).

## Alıştırma 4: TCP RST (Zorla Kapatma)

### Filtre:
```text
tcp.flags.reset == 1
```

Port kapaliysa veya bağlantı reddediliyorsa RST gönderilir.
- Port scan sırasında kapalı portlara bağlanma denemesi -> RST
- Hatalı paket -> RST

> **SINAV İPUCU:** Çok sayıda RST paketi = port scan veya bağlantı sorunu.

## Alıştırma 5: PSH ve URG Flag'leri

PSH (Push) ve URG (Urgent), TCP'de daha az kullanılan flag'lerdir:

### PSH (Push):
```text
tcp.flags.push == 1
```

Veriyi beklemeden hemen uygulama katmanına gönderir. Normalde TCP veriyi buffer'lar, PSH ile buffer atlanır.
- HTTP isteklerinde PSH genellikle SET'tir
- Interaktif oturumlarda (SSH, Telnet) her tuş vuruşunda PSH görülür

### URG (Urgent):
```text
tcp.flags.urg == 1
```

Acil veri işareti: Normal veri akışını keser. Günümüzde çok nadir kullanılır.
- Kullanıldığında TCP header'da **Urgent Pointer** alanı görünür
- Saldırganlar bazen IDS/IPS'yi atlatmak için URG flag set eder

### Bul:
1. pcap'te `tcp.flags.push == 1` filtresini dene: Hangi paketlerde PSH var?
2. PSH genellikle HTTP isteklerinin ve response'larının son paketinde görülür
3. URG flag'ini ara: `tcp.flags.urg == 1`: Bu pcap'te muhtemelen yok (çok nadir)

> **SINAV İPUCU:** PSH flag'i sınavda genellikle "veri aktarımının bittiğini gösteren flag" olarak sorulur. URG ise saldırganların IDS bypass için kullandığı nadir bir flag'dir.

## Alıştırma 6: Port Scan Analizi

pcap dosyasında port tarama da var. Bul:

```text
tcp.flags.syn == 1 && tcp.flags.ack == 0
```

Birden fazla farklı hedef porta SYN gönderildiğini göreceksin:
- Port 8080: OPEN (SYN-ACK geldi)
- Port 21, 22, 25, 80, 443, 3306, 5432: CLOSED (RST geldi)

> **SINAV İPUCU:** Aynı IP'den kısa sürede çok fazla farklı porta SYN = PORT SCAN.

### Half-Open (SYN) Scan Nedir?

Bu taramadaki SYN'lerin hiçbirinin üçlü el sıkışma tamamlanmadan
bırakıldığına dikkat et: İstemci SYN gönderir, sunucu SYN-ACK döner,
ama istemci **ACK yerine RST** yollar. Bağlantı hiç "ESTABLISHED"
olmadığı için buna **half-open (yarım açık) tarama** denir — nmap'deki
adıyla `nmap -sS`, yani bizim lab'de saldırganın kullandığı yöntem.

Neden tercih edilir?
- Uygulama katmanında log oluşmaz (connect() hiç tamamlanmaz)
- Klasik (connect) taramadan daha hızlı ve daha sessizdir

Karşıtı **connect scan** (`nmap -sT`): Tam üçlü el sıkışma yapılır,
bağlantı kapanır — Wireshark'ta SYN → SYN-ACK → ACK → (veri yok) →
FIN/RST dizisi görürsün. Lab pcap'inde her iki taramayı da bulabilirsin:

```text
# half-open izi: SYN-ACK'ten hemen sonra istemciden RST
tcp.flags.syn == 1 && tcp.flags.ack == 0
# connect izi: tamamlanmış el sıkışma + hemen kapanış
tcp.flags.syn == 1 && tcp.flags.ack == 1
```

**SINAV İPUCU:** "Tarama half-open mı connect mi?" sorusunda istemciden
ACK gelip gelmediğine bak: ACK yok + RST var = half-open (SYN scan).

## Hızlı Referans - TCP Filtreleri

```text
# TCP flags
tcp.flags.syn == 1                        # SYN set
tcp.flags.ack == 1                        # ACK set
tcp.flags.fin == 1                        # FIN set
tcp.flags.reset == 1                      # RST set
tcp.flags.syn == 1 && tcp.flags.ack == 0  # Sadece SYN (baglanti basl.)
tcp.flags.syn == 1 && tcp.flags.ack == 1  # SYN-ACK

# Port tabanlı
tcp.port == 8080                          # Belirli port
tcp.srcport == 8080                       # Kaynak port
tcp.dstport == 8080                       # Hedef port

# Belirli IP ile TCP
tcp && ip.addr == 172.50.2.12

# TCP stream numarası
tcp.stream == 0                           # İlk TCP akışı
```

> **SINAV İPUCU:** TCP port scan tespiti için `tcp.flags.syn == 1 && tcp.flags.ack == 0` kullanılır. Açık port sayısı SYN-ACK sayısına eşittir.

## Sınav Soruları (Çöz)

1. 3-way handshake'de istemcinin gönderdiği ilk SYN paketinde Seq number nedir?
2. SYN-ACK paketinde Ack number nedir? Neden?
3. Port taramasında hangi portlar AÇIK (open) bulundu?
4. RST paketlerinin sebebi nedir? Hangi portlara bağlanılmaya çalışıldı?
5. FIN paketlerini bul. Bağlantı kapatma kaç adımda oldu?
6. TCP header'da hangi flag'ler bulunur? En az 4 tane say.

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. ISN rastgele üretilir, her bağlantıda değişir. SYN paketindeki Sequence Number alanını kontrol et.
2. SYN paketindeki ISN + 1'dir. SYN paketindeki Seq değerini bulup +1 ekle.
3. Attacker (172.50.2.200) tarafından 172.50.2.12'ye SYN scan yapıldı. Port 8080 AÇIK (TCP echo); port 21, 22, 25, 80, 443, 3306, 5432 KAPALI (RST döndü).
4. Kapalı portlara bağlanma girişimi. nc connect scan ile test edildi.
5. Teoride 4 adım (FIN → ACK → FIN → ACK). Bu pcap'te her iki taraf da FIN+ACK'i tek pakette birleştirdiği için kapanma 2 pakette tamamlanır (frame 12: istemci FIN-ACK, frame 13: sunucu FIN-ACK).
6. SYN, ACK, FIN, RST, PSH, URG. En az 4 tanesi yeterli.

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!