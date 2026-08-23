---
layout: post
title:  "shark-tank - m23: Performans Analizi"
date:   2026-08-09 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 23: Performans Analizi

**Neden?** Sistem yavaş, sebebi bulunamıyor. Yönetici "network kaynaklı" diyor ama kimse emin değil. Performans düşüşü çoğu zaman saldırının ilk belirtisidir: Ani retransmission artışı (SYN flood), RTT dalgalanması (tunneling veya proxy), throughput düşüşü (DoS), Expert Info uyarıları (TCP Reset, Window violation). Performans metrikleri saldırıyı erken uyarı sistemi gibi yakalar. Bu modülde, performans metriklerinden saldırıyı okumayı öğreneceksin.

**Görev:** Ağ performans sorunlarını TCP analizi ile tespit et.

**Öğrenim Hedefleri:**
- Yüksek RTT, retransmission ve Zero Window gibi performans sorunlarını tespit edebilmek
- Throughput = Window Size / RTT denklemini kavrayıp uygulayabilmek
- Window Scaling factor'ünün throughput'a etkisini anlamak
- Slow App Response ve Nagle gecikmesini ayırt edebilmek
- Expert Info ile performans anormalliklerini hızlıca bulabilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **TCP** | Transmission Control Protocol: İnternetin güvenilir ve sıralı veri iletimini sağlayan protokol. Veriyi göndermeden önce alıcıyla bağlantı kurar (3-way handshake), gönderdiği her paket için onay (ACK) bekler ve onay gelmeyen paketleri yeniden gönderir (retransmission). Bu mekanizmalar sayesinde veri kaybı olmadan ve gönderim sırasında bozulmadan teslim edilir. Web (HTTP), email (SMTP), dosya transferi (FTP) gibi kritik işlemlerin tamamı TCP üzerinden çalışır. Bağlantı kurma ve onay bekleme yükü nedeniyle UDP'den yavaştır, ama güvenilirlik gerektiğinde tek seçenektir. |
| **RTT** | Round Trip Time: Bir paketin kaynaktan hedefe gidip geri dönmesi için geçen toplam süre. ICMP ping'inde, Echo Request'in gönderilmesi ile Echo Reply'nin alınması arasındaki süre RTT'dir. Wireshark bu değeri paket detaylarında `[Response Time: X.XXX ms]` olarak otomatik hesaplar. RTT, ağ gecikmesinin (latency) temel ölçüsüdür: Düşük RTT hızlı bağlantıyı, yüksek RTT uzak veya tıkalı bir bağlantıyı gösterir. Sınavda `Edit > Time Display Format > Seconds Since Previous Packet` ile manuel RTT ölçümü de test edilir. |
| **throughput** | Bir ağ bağlantısında saniyede taşınan veri miktarı (byte/saniye veya bit/saniye). Throughput, bağlantının verimini ölçer: Yüksek throughput hızlı veri transferini, düşük throughput darboğaz veya sorun olduğunu gösterir. Wireshark'ta Statistics → TCP Stream Graphs → Throughput grafiği, bir TCP bağlantısındaki veri aktarım hızını zaman içinde gösterir. Grafikteki ani düşüşler ağ tıkanıklığı, paket kaybı veya retransmission göstergesidir. Throughput ile bandwidth (bant genişliği) farklıdır: Bandwidth ağ kapasitesidir, throughput ise bu kapasitenin ne kadarının fiilen kullanıldığıdır. |
| **retransmission** | TCP'de onay (ACK) gelmeyen bir paketin kaynak tarafından yeniden gönderilmesi. TCP güvenilir bir protokoldür: Her gönderdiği paket için bir zamanlayıcı (timer) başlatır ve belirli süre içinde ACK gelmezse paketi tekrar gönderir. Wireshark varsayılan renk kurallarında retransmission içeren paketler "Bad TCP" kuralıyla açık kırmızı arka planla işaretlenir. Çok sayıda retransmission, ağ tıkanıklığı, kablosuz sinyal sorunu veya kasıtlı saldırı (ACK flood) gösterebilir. |
| **zero window** | TCP akış kontrolünde alıcının pencere boyutunu sıfır (0) olarak bildirmesi. TCP'de alıcı, kabul edebileceği veri miktarını "window size" alanında bildirir. Bu değer sıfır olduğunda alıcı şunu söyler: "Buffer'ım tamamen dolu, şu anda daha fazla veri alamam." Gönderici bu durumda veri göndermeyi durdurur ve periyodik olarak "Zero Window Probe" paketleri göndererek alıcının hazır olup olmadığını kontrol eder. Uzamış zero window durumları yavaş bir alıcı uygulaması, yetersiz buffer veya kaynak tüketimi saldırısını gösterebilir. |
| **Expert Information** | Wireshark'ın pcap içindeki anormallikleri ve sorunları otomatik olarak tespit edip listelediği panel. `View > Expert Information` (Ctrl+Alt+Shift+E) menüsünden açılır. Sorunları dört ciddiyet seviyesinde gruplar: Error (kırmızı), Warn (sarı), Note (mavi), Chat (yeşil). Bir analist pcap'i açtığında ilk bakması gereken yerlerden biridir; çünkü retransmission, duplicate ACK, zero window, HTTP 404 gibi sorunları paket tek tek aranmadan özet olarak gösterir. |

## Teori

TCP performansını etkileyen faktörler:

| Faktör | Etki | Tespit |
|--------|------|--------|
| **Yüksek RTT** | Uzun bekleme süreleri | RTT Graph > 100 ms |
| **Zero Window** | Alıcı tıkanıklığı | tcp.analysis.zero_window |
| **Retransmission** | Veri tekrarı | tcp.analysis.retransmission |
| **Dup ACK** | Sıra dışı paket | tcp.analysis.duplicate_ack |
| **Small Window** | Düşük throughput | Window Scaling Graph |
| **Window Scale** | Yanlış scale faktörü | TCP options (SYN) |
| **MSS** | Küçük segment boyutu | TCP options (SYN) |
| **Nagle** | Gecikmeli küçük paket | TCP_NODELAY eksik |

### Performans Denklemi:

```text
Throughput = Window Size / RTT
  - Window Size = min(cwnd, rwnd)
  - RWND = Receive Window × Scale Factor
  - Örnek: 65535 byte window / 100 ms RTT = 5.2 Mbps
```

> **İki ince kavram:**
>
> - **Goodput**, throughput'un "faydalı" kısmıdır: Retransmission'larla
>   yeniden gönderilen ve header overhead'i düşüldükten sonra kalan
>   kullanılabilir veri hızı. 10 Mbps throughput + %30 retransmission ≈
>   7 Mbps goodput. Kullanıcı hissettiği şey goodput'tur.
> - **Bytes in flight**: Gönderilmiş ama henüz ACK gelmemiş veri miktarı
>   (`sequence - last_ack` farkından çıkarılır). Window/RTT denkleminde
>   bağlantı bu değeri doldurmuşsa "pencere sınırlı" (window-limited),
>   doldurmamışsa "hız sınırlı" (rate-limited) olduğu söylenir —
>   Time-Sequence grafiğinde gönderilen verinin ACK çizgisinden ne kadar
>   önde olduğunu izleyerek görülür.

---

## Hazırlık

```sh
./scripts/generate-traffic.sh performance
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

---

## Alıştırma 1: Yüksek RTT Tespiti

Round Trip Time, bir paketin gidip gelme süresidir.

### Adımlar:

1. `module-23-performance.pcap`'i aç
2. Filtre: `tcp.stream == 0`
3. Statistics → TCP Stream Graphs → Round Trip Time
4. RTT değerlerini incele:
   - Ortalama RTT kaç ms?
   - Maksimum RTT kaç ms?
   - RTT değişken mi (jitter) yoksa sabit mi?

### RTT Kaynaklı Sorunlar:

| Durum | RTT | Etki |
|-------|-----|------|
| Normal LAN | < 1 ms | ~ |
| Normal WAN | 10-50 ms | ~ |
| Yavaş WAN | 100-300 ms | Web sayfası yavaş açar |
| Uydu | > 500 ms | SSH kullanılamaz |
| Değişken | 1-200 ms | Video/voice bozulur |

> **SINAV İPUCU:** RTT yüksekse, throughput düşer: `Throughput = Window / RTT`.
>
> RTT iki katına çıkarsa throughput yarıya iner.

### tcp.analysis.ack_rtt Alanı: Wireshark'ın Hesapladığı RTT

Manuel zaman ölçümüne (Time Display Format) gerek kalmadan, Wireshark her
ACK paketi için RTT'yi kendisi hesaplar: `tcp.analysis.ack_rtt` = bu
ACK'in onayladığı verinin gönderilmesinden geçen süre.

```text
tcp.analysis.ack_rtt
```

**Alıştırma:** Bu filtreyi uygula; paket detaylarında şunu gör:

```text
v Transmission Control Protocol
    v [4 Bytes(s) of segment data]
    v Analysis flags
        [i] ACKed segment len: 4
        [i] Rtt to ACK the segment: 0.041 seconds   <-- tcp.analysis.ack_rtt
```

**tshark ile ortalama RTT (tek satır):**
```sh
tshark -r shared/pcaps/module-23-performance.pcap -Y 'tcp.analysis.ack_rtt' \
  -T fields -e tcp.analysis.ack_rtt \
| awk '{s+=$1; n++} END {printf "Ortalama RTT: %.3f sn (n=%d)\n", s/n, n}'
```

Sınavda "bağlantının ortalama RTT'si kaç?" sorusunda en hızlı yol budur:
Manuel değil, alan değerlerinin ortalaması.

> **İstihbarat İşaretleri:** `tcp.analysis.ack_rtt` 40-200 ms'lik
> düzenli kümeler = delayed ACK (bkz. Modül 11); ani RTT sıçramaları =
> ağ tıkanıklığı ya da yol (route) değişimi.

---

## Alıştırma 2: Zero Window Tespiti

> **Not:** Bu pcap'te zero window paketi üretilmemiştir; filtreyi uyguladığında boş sonuç normaldir. Aşağıdaki akış temsilidir. (Bu pcap'te ağ sorunu olarak 3 retransmission vardır — Alıştırma 5'te oranı hesaplayacaksın.)

Zero Window, alıcının uygulama katmanında veriyi işleyemediğini gösterir.

### Filtre:
```text
tcp.analysis.zero_window
```

### Adımlar:

1. Filtre: `tcp.analysis.zero_window`
2. Zero Window varsa:
   - Hangi tarafta? (istemci mi sunucu mu?)
   - Ne sıklıkta tekrarlanıyor?
   - Zero Window Probe var mı? (`tcp.analysis.zero_window_probe`)
3. Statistics → TCP Stream Graphs → Window Scaling
   - Window size'ın sıfıra düştüğü anı gör

### Zero Window Nedenleri:

| Neden | Açıklama | Çözüm |
|-------|----------|-------|
| Slow App Server | Sunucu veriyi işleyemiyor | Uygulama optimizasyonu |
| Database Query | Uzun süren sorgu | Query optimizasyonu |
| Buffer Tuning | Küçük buffer | SO_RCVBUF artırma |
| Memory Pressure | Sistem belleği yetersiz | RAM yükseltme |

> **SINAV İPUÇLARI:**
>
> - Zero Window = alıcı taraflı sorun
> - Retransmission = ağ taraflı sorun (veya gönderici)
> - Zero Window Probe ile gönderici periyodik kontrol eder
> - Sık Zero Window = uygulama katmanında sorun

> **İstihbarat İşaretleri, Zero Window kötüye kullanımı:**
>
> - Zero window saldırısı: Hedefin buffer'ını şişirme
> - Slow read saldırısı: HTTP slow read
> - Resource exhaustion tespiti

---

## Alıştırma 3: Slow Application Response

Sunucunun uygulama katmanında yavaş cevap vermesi.

### Tespit:

HTTP istek-response arasındaki süre:

```text
İstek:     GET / HTTP/1.1
           [Zaman: T1]
           --- TCP ACK ---
           --- TCP ACK ---
           --- TCP ACK ---  <-- Bu arada sunucu düşünüyor
Response:  HTTP/1.1 200 OK
           [Zaman: T2]

İşlem Süresi = T2 - T1
```

### Adımlar:

1. `module-13-http.pcap`'i aç
2. Bir HTTP isteği seç
3. **Follow → TCP Stream** ile akışı gör
4. İstek ile yanıt arasındaki zaman farkını hesapla:
   - HTTP request paketinin zamanı
   - HTTP response'un ilk paketinin zamanı
   - Aradaki fark = sunucu işlem süresi

### Performans Kategorileri:

| Süre | Değerlendirme |
|------|--------------|
| < 10 ms | Mükemmel |
| 10-100 ms | İyi |
| 100-500 ms | Kabul edilebilir |
| 500 ms - 2 sn | Yavaş |
| > 2 sn | Çok yavaş (kullanıcı terk eder) |

> **SINAV İPUCU:** İstek-response arası süre = Application Response Time.
>
> Bu süre uzunsa sorun sunucu uygulamasındadır, ağda değil.

---

## Alıştırma 4: Small Window ve Window Scale

Window size çok küçükse throughput düşer.

### Teori:

```text
Gerçek Window = Window Size × 2^Window Scale

Örnek:
  Window Size = 65535
  Scale = 0 → gerçek window = 65535 bytes (64 KB)
  Scale = 7 → gerçek window = 65535 × 128 = 8 MB
```

### Adımlar:

1. SYN paketini bul: `tcp.flags.syn == 1 && tcp.flags.ack == 0`
2. TCP options'ı incele:
   - **Window Scale**: Kaç? (genelde 3, 7 veya 9)
   - **MSS**: Kaç? (genelde 1460, 8960, 65535)
3. SYN-ACK paketini incele:
   - Window Scale aynı mı? (her iki taraf da kabul etmeli)
   - MSS küçük olan kullanılır (path MTU)
4. Farklı akışlarda scale faktörlerini karşılaştır

### Yanlış Yapılandırma Örnekleri:

| Sorun | Tespit | Etki |
|-------|--------|------|
| Scale 0 | SYN'de window scale yok | Max 64 KB window |
| Small MSS | MSS < 1000 | Header oranı yüksek |
| Asymmetric Scale | İstemci/sunucu scale farklı | İletişim sorunu |
| No Window Scale | Eski TCP stack | Düşük throughput |

> **SINAV İPUÇLARI:**
>
> - Window scale olmadan max window = 65535 byte
> - Scale 7 ile max window = 65535 × 128 = 8 MB
> - Scale SYN ve SYN-ACK'te belirlenir, bağlantı boyunca sabit
> - High-latency bağlantılarda window scale kritiktir

---

## Alıştırma 5: Retransmission Oranı Analizi

Retransmission oranı, ağ kalitesinin en önemli göstergesidir.

### Hesaplama:

```text
Retrans Rate = (Retrans Paketleri / Toplam Paketler) × 100
```

### Adımlar:

1. Filtre: `tcp.analysis.retransmission` → retransmission sayısı
2. **Statistics → Capture File Properties** → toplam paket sayısı
3. Oranı hesapla:
   - < %1: Mükemmel
   - %1-3: Kabul edilebilir
   - %3-10: Sorunlu
   - > %10: Kritik (acil müdahale gerekli)
4. Hangi IP/port en çok retransmission üretiyor?
   - **Statistics → Endpoints** → TCP sekmesi
   - **Statistics → Conversations** → TCP sekmesi

### Retransmission Dağılımı:

```sh
# tshark ile en çok retransmission yapan IP'yi bul
tshark -r shared/pcaps/module-23-performance.pcap \
  -Y "tcp.analysis.retransmission" \
  -T fields -e ip.src -e ip.dst | sort | uniq -c | sort -rn
```

> **SINAV İPUCU:** Retransmission oranı > %3 ise ağ sorunu vardır.
>
> Hangi IP'nin en çok retransmission ürettiğini bulmak sorunun kaynağını belirler.

---

## Hızlı Referans - Performans Filtreleri

| Filtre | Anlamı |
|--------|--------|
| `tcp.analysis.retransmission` | Yeniden iletim |
| `tcp.analysis.zero_window` | Alıcı buffer dolu |
| `tcp.analysis.window_full` | Gönderici pencere limiti |
| `tcp.analysis.duplicate_ack` | Dup ACK |
| `tcp.analysis.ack_lost_segment` | Kayıp segment ACK |
| `tcp.analysis.bytes_in_flight` | Uçuştaki byte sayısı |
| `tcp.window_size < 1000` | Küçük pencere |

### Performans Analiz Sırası:

```text
1. IO Graph → genel trafik deseni
2. Expert Information → Error/Warn tara
3. TCP Stream Graphs:
   a. RTT Graph → gecikme
   b. Throughput Graph → hız
   c. Window Scaling → flow control
4. Retransmission oranı hesapla
5. Application Response Time ölç
6. Window Scale ve MSS kontrol et
```

> **SINAV İPUCU:** Performans sorunu çözerken önce RTT'ye, sonra retransmission'a, sonra window'a bakılır.
>
> Application response time en son kontrol edilir (çünkü ağ sorunu değildir).

> **İstihbarat İşaretleri, Performans anomalileri:**
>
> - Normal trafiğe göre yüksek retransmission = ağ sabotajı
> - Belirli bir sunucuya sürekli zero window = hedef sistem zorlanıyor
> - Düşük throughput = bandwidth saturation veya throttling
> - Yüksek RTT + düşük window = TCP tuning gerekiyor

---

## Sınav Soruları (Çöz)

1. Throughput = Window / RTT formülü ne anlama gelir? RTT iki katına çıkarsa throughput ne olur?
2. Zero Window hangi tarafı gösterir? Retransmission'dan farkı nedir?
3. Application response time nasıl ölçülür? Hangi durumda sorun ağdadır, hangi durumda uygulamadadır?
4. Window scale neden önemlidir? Scale olmadan max window boyutu nedir?
5. Retransmission oranı kaç olmalıdır? Hangi değer kritiktir?
6. High-latency bağlantılarda throughput'u artırmak için hangi TCP parametreleri ayarlanmalıdır?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. Throughput = Window Size / RTT. RTT iki katına çıkarsa throughput yarıya iner. Aynı throughput'u korumak için window size'ın iki katına çıkarılması gerekir.

2. Zero Window alıcı taraflı sorundur: Uygulama veriyi işleyemiyor. Retransmission ağ taraflı veya gönderici taraflı sorundur: Paket kayboldu veya ACK zamanında gelmedi.

3. İstek (HTTP Request) ile yanıt (HTTP Response) arasındaki zaman farkı ölçülür. RTT düşük ama response süresi yüksekse = uygulama sorunu. RTT yüksekse + response süresi de yüksekse = ağ sorunu.

4. Window scale, receive window'un 65535 byte'ın üzerine çıkmasını sağlar. Scale olmadan max window boyutu 65535 byte'tır (64 KB). Scale 7 ile 8 MB'a kadar çıkabilir.

5. < %1 mükemmel, %1-3 kabul edilebilir, %3-10 sorunlu, > %10 kritik. > %3 ise ağ sorunu araştırılmalıdır.

6. Window scale faktörü artırılmalı (yüksek scale), MSS doğru ayarlanmalı (path MTU), TCP_NODELAY (Nagle disable) kullanılmalı, buffer boyutları (SO_RCVBUF/SO_SNDBUF) artırılmalıdır.

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
