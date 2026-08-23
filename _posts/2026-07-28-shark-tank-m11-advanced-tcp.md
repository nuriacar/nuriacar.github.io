---
layout: post
title:  "shark-tank - m11: TCP Akış Analizi"
date:   2026-07-28 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 11: TCP Akış Analizi

**Neden?** Sunucular periyodik olarak çöküyor, sebebi bulunamıyor. Yapılan analizde SACK Panic (CVE-2019-11477) tespit ediliyor. TCP'nin ileri özellikleri saldırganlar tarafından istismar edilir: Window Scale ile bandwidth exploitation, Zero Window probing (kurbanı bekletme), TCP Keep-Alive ile stealth C2 bağlantısı. Retransmission timing analizi ağdaki anormallikleri ortaya çıkarır. Bu modülde, TCP'nin derin sırlarını saldırı tespiti için kullanmayı öğreneceksin.

**Görev:** TCP akış ve tıkanıklık mekanizmalarını keşfet. SACK, window scaling, congestion control ve keep-alive analizi.

**Öğrenim Hedefleri:**
- TCP option'larını (MSS, Window Scale, SACK, Timestamps) tanıyıp yorumlayabilmek
- Window Scaling ile yüksek bant genişliği bağlantılarını analiz edebilmek
- SACK (Selective Acknowledgment) mekanizmasını kavramak
- TCP Keep-Alive ile stealth C2 bağlantılarını tespit edebilmek
- Congestion control (slow start, congestion avoidance) mekanizmalarını anlamak

## Terimler

| Terim | Açıklama |
|-------|----------|
| **TCP** | Transmission Control Protocol: İnternetin güvenilir ve sıralı veri iletimini sağlayan protokol. Veriyi göndermeden önce alıcıyla bağlantı kurar (3-way handshake), gönderdiği her paket için onay (ACK) bekler ve onay gelmeyen paketleri yeniden gönderir (retransmission). Bu mekanizmalar sayesinde veri kaybı olmadan ve gönderim sırasında bozulmadan teslim edilir. Web (HTTP), email (SMTP), dosya transferi (FTP) gibi kritik işlemlerin tamamı TCP üzerinden çalışır. Bağlantı kurma ve onay bekleme yükü nedeniyle UDP'den yavaştır, ama güvenilirlik gerektiğinde tek seçenektir. |
| **MSS** | Maximum Segment Size: TCP'nin tek bir pakette taşıyabileceği maksimum veri (payload) boyutu. TCP header ve IP header bu değere dahil değildir; MSS sadece uygulama verisini ifade eder. Tipik değer Ethernet ağlarında 1460 byte'tır (1500 byte MTU − 20 byte IP header − 20 byte TCP header = 1460). MSS, TCP SYN ve SYN-ACK paketlerinde bir TCP option olarak görüşülür ve bağlantı boyunca değişmez. İki taraf farklı MSS değerleri önerirse, küçük olan kullanılır. MSS yanlış yapılandırılırsa fragmentation oluşur. |
| **Window Scaling** | TCP'nin receive window (alım penceresi) boyutunu 16 bitin (maksimum 65535 byte) ötesine taşıyan mekanizma. SYN ve SYN-ACK paketlerinde bir TCP option olarak görüşülür ve bir shift count (kaydırma sayısı) belirtilir. Gerçek window boyutu = header'daki window değeri × 2^(shift count) formülüyle hesaplanır. Örneğin shift count 7 ise çarpan 128'dir (2^7). Bu sayede modern yüksek bant genişlikli ağlarda TCP, 64 KB yerine gigabyte seviyelerinde pencere boyutu kullanabilir. Çarpan sadece handshake sırasında belirlenir ve bağlantı boyunca değişmez. |
| **SACK** | Selective Acknowledgment: Alıcının, boşluklar olsa bile aldığı veri aralıklarını seçici olarak bildirmesini sağlayan TCP seçeneği. Normal ACK sadece "bir sonraki beklenen byte" numarasını söyler; ama arada kayıp paket varsa, kayıp sonrası alınan paketler için SACK kullanılır. Örneğin Seq=1 kayıp, Seq=1001 ve Seq=2001 alındıysa, alıcı "ACK=1, SACK=1001-3001" gönderir. Böylece gönderici sadece Seq=1'i yeniden gönderir, 1001'den itibaren her şeyi değil. SACK, TCP handshake sırasında müzakere edilir ve modern TCP yığınlarının tamamı tarafından desteklenir. |
| **zero window** | TCP akış kontrolünde alıcının pencere boyutunu sıfır (0) olarak bildirmesi. TCP'de alıcı, kabul edebileceği veri miktarını "window size" alanında bildirir. Bu değer sıfır olduğunda alıcı şunu söyler: "Buffer'ım tamamen dolu, şu anda daha fazla veri alamam." Gönderici bu durumda veri göndermeyi durdurur ve periyodik olarak "Zero Window Probe" paketleri göndererek alıcının hazır olup olmadığını kontrol eder. Uzamış zero window durumları yavaş bir alıcı uygulaması, yetersiz buffer veya kaynak tüketimi saldırısını gösterebilir. |
| **duplicate ACK** | Alıcının beklediği sequence number yerine daha yüksek bir sequence number içeren paket aldığında gönderdiği tekrar onayı. Örneğin alıcı Seq=1 beklerken Seq=1001 gelirse, Seq=1 için tekrar ACK gönderir: Bu "duplicate ACK" (tekerrür eden onay) olarak adlandırılır. Alıcı her sıra dışı pakette aynı ACK numarasını tekrarladığı için birden fazla duplicate ACK oluşur. 3 ardışık duplicate ACK, göndericiye "bir paket kayboldu" sinyali verir ve Fast Retransmission mekanizmasını tetikler: Gönderici zaman aşımını beklemeden kayıp paketi hemen yeniden gönderir. |
| **retransmission** | TCP'de onay (ACK) gelmeyen bir paketin kaynak tarafından yeniden gönderilmesi. TCP güvenilir bir protokoldür: Her gönderdiği paket için bir zamanlayıcı (timer) başlatır ve belirli süre içinde ACK gelmezse paketi tekrar gönderir. Wireshark varsayılan renk kurallarında retransmission içeren paketler "Bad TCP" kuralıyla açık kırmızı arka planla işaretlenir. Çok sayıda retransmission, ağ tıkanıklığı, kablosuz sinyal sorunu veya kasıtlı saldırı (ACK flood) gösterebilir. |
| **congestion control** | TCP'nin ağ tıkanıklığını önlemek için gönderme hızını ayarladığı mekanizmaların tamamı. TCP, ağın kapasitesini tahmin edip ona göre veri gönderme hızını (congestion window, cwnd) belirler. Bağlantı başında cwnd küçük başlar ve her RTT'de iki katına çıkar (Slow Start). Belirli bir eşiğe (ssthresh) ulaştığında büyüme yavaşlar: Her RTT'de sadece 1 MSS artar (Congestion Avoidance). Paket kaybı algılandığında (timeout veya 3 duplicate ACK), cwnd düşürülür ve gönderme hızı yavaşlatılır. Bu mekanizma ağın aşırı yüklenmesini önler ve tüm kullanıcıların adil paylaşım yapmasını sağlar. |
| **Nagle algorithm** | TCP'de küçük veri parçalarını birleştirerek ağ verimliliğini artıran algoritma. Kuralı şudur: Göndericide onaylanmamış (ACK gelmemiş) veri varsa, yeni küçük veri parçaları bekletilir ve yeterince büyüyene kadar gönderilmez. ACK geldiğinde birikmiş veriler tek paket olarak gönderilir. Bu, çok sayıda küçük paketin ağyı boğmasını önler. Ancak interaktif uygulamalar (SSH, online oyunlar) her tuş vuruşunun anında iletilmesini ister; bu yüzden TCP_NODELAY socket option'ı ile Nagle algoritmasını devre dışı bırakırlar. |
| **keep-alive** | TCP bağlantısında karşı tarafın hâlâ canlı olup olmadığını kontrol etmek için gönderilen küçük kontrol paketi. Uzun süre veri aktarımı olmayan (idle) bağlantılarda, bir taraf beklenmedik şekilde çökmüş olabilir; keep-alive bu durumu tespit etmek için periyodik olarak (genellikle 2 saat idle sonrası) 0 veya 1 byte'lık bir paket gönderir. Gönderilen paketin sequence numarası bilerek bir eksik gönderilir, bu da alıcının ACK ile yanıt vermesini sağlar. NAT cihazları ve güvenlik duvarları idle bağlantıları kapattığı için keep-alive bağlantıyı canlı tutmak için de kullanılır. |

## Teori

Modül 06'da TCP'nin temellerini öğrendin: Flags, handshake, seq/ack, teardown. Şimdi TCP'nin ileri düzey mekanizmalarına iniyoruz. Bunlar WCNA sınavının önemli konularıdır ve ağ performans analizi için kritiktir.

### TCP Options

TCP header'ın sonunda option alanları bulunur. Bu option'lar bağlantının davranışını belirler ve **SYN/SYN-ACK** paketlerinde görüşülür (negotiated). Bağlantı boyunca değişmez.

| Option | Amaç | Boyut |
|--------|------|-------|
| **MSS** (Maximum Segment Size) | Maksimum segment boyutu | 4 byte |
| **Window Scale** | Window büyütme çarpanı | 3 byte |
| **SACK Permitted** | SACK desteği bildirimi | 2 byte |
| **SACK** | Seçici onay bilgisi | Değişken |
| **Timestamps** | RTT ölçümü, PAWS | 10 byte |
| **NOP** | Hizalama (padding) | 1 byte |

> TCP option'ları SYN ve SYN-ACK'te görüşülür, bağlantı boyunca değişmez.
>
> Sadece SACK ve Timestamp verileri her pakette taşınabilir.

### SACK (Selective Acknowledgment)

Normal ACK mekanizması: "X numarasına kadar her şeyi aldım." Eğer X ile X+1000 arasındaki data'dan bir kısım kaybolduysa, gönderen tüm X+1'den itibaren yeniden göndermek zorundadır.

SACK ise: "X numarasına kadar aldım, ama ayrıca Y ile Z arasını da aldım." Böylece gönderen sadece eksik kısmı yeniden gönderir.

```text
Normal ACK (SACK yok):
  Gönderen: Seq 1-1000, 1001-2000, 2001-3000, 3001-4000
  Alıcı:    ACK 1001, ACK 2001, [kayıp], ACK 2001 (duplicate)
  Gönderen: 2001-3000, 3001-4000 yeniden gönderir (2 segment)

SACK ile:
  Gönderen: Seq 1-1000, 1001-2000, 2001-3000, 3001-4000
  Alıcı:    ACK 1001, ACK 2001, [kayıp], ACK 2001, SACK=3001-4001
  Gönderen: sadece 2001-3000 yeniden gönderir (1 segment)
```

- **SACK Permitted:** SYN ve SYN-ACK'te görüşülür. "Ben SACK anlıyorum" demek.
- **SACK Option:** ACK paketlerinde taşınır. Alınan data aralığını belirtir.
- Wireshark: `tcp.options.sack`

```text
 v Transmission Control Protocol
     Options: (12 bytes)
         TCP Option - Selective Acknowledgement (SACK)
             Left Edge: 3001              <-- Alınan blok başlangıcı
             Right Edge: 4001             <-- Alınan blok bitişi
```

> **SINAV İPUCU:** SACK, retransmission miktarını azaltır. SACK Permitted SYN'de görüşülür. SACK option ACK paketlerinde taşınır.
>
> Left Edge ve Right Edge alınan data bloğunu belirtir.

### Window Scaling

TCP Window alanı 16 bittir. Maksimum değer: 65535 byte (~64 KB). Günümüzde bu değer çok küçüktür. Window Scaling ile pencere boyutu çarpılır.

- **Window Scale option:** SYN ve SYN-ACK'te görüşülür
- **Çarpan:** 2^n (n = shift count)
- Sadece handshake sırasında belirlenir, sonradan değişmez

```text
 v Transmission Control Protocol
     Window size value: 511              <-- Header'daki raw değer
     Window size scaling factor: 128     <-- 2^7 = 128 çarpanı
     [Calculated window size: 65408]     <-- 511 × 128 = 65408 byte
```

| Shift Count | Çarpan (2^n) | Maks. Window |
|-------------|-------------|--------------|
| 0 | 1 | 65535 byte |
| 1 | 2 | 131070 byte |
| 2 | 4 | 262140 byte |
| 7 | 128 | ~8 MB |
| 14 | 16384 | ~1 GB |

> Wireshark calculated window size gösterir: `tcp.window_size_value`. Raw değer: `tcp.window_size`. Scale factor: `tcp.window_size_scalefactor`.

### TCP Keep-Alive

TCP bağlantıları uzun süre idle kalabilir. Keep-alive mekanizması karşı tarafın hâlâ canlı olup olmadığını kontrol eder.

- **Keep-Alive paketi:** 0 veya 1 byte data içerir
- **Zamanlama:** Genellikle idle 2 saat sonra (OS bağımlı)
- **Amaç:** Ölü bağlantıları tespit etme
- Wireshark: `tcp.analysis.keep_alive`

```text
 v Transmission Control Protocol
     Seq=1001, Ack=2001, Len=0            <-- Data yok
     [TCP Keep-Alive]                     <-- Wireshark notu
```

Keep-Alive ACK:
```text
 v Transmission Control Protocol
     Seq=1000, Ack=2001, Len=0            <-- Seq bir eksik! (probe)
     [TCP Keep-Alive ACK]                 <-- Wireshark notu
```

### Nagle Algorithm

Nagle algoritması küçük paketleri birleştirerek ağ verimliliğini artırır.

- **Kural:** ACK gelene kadar küçük data'ları buffer'lar, sonra birlikte gönderir
- **TCP_NODELAY:** Nagle'ı devre dışı bırakan socket option
- **Etki:** Interaktif uygulamalar (SSH, gaming) TCP_NODELAY kullanır
- **Wireshark:** Doğrudan filtre yok. Timing analizi ile tespit edilir

```text
Nagle AKTİF:
  Uygulama "A" gönderir → Buffer'da bekler
  Uygulama "B" gönderir → Buffer'da bekler
  ACK gelir → "AB" birlikte gönderilir

Nagle KAPALI (TCP_NODELAY):
  Uygulama "A" gönderir → Hemen gönderilir
  Uygulama "B" gönderir → Hemen gönderilir
  → Daha fazla küçük paket, ama daha düşük gecikme
```

> **SINAV İPUCU:** Nagle Algorithm küçük paketleri birleştirir. TCP_NODELAY ile devre dışı bırakılır.
>
> Interaktif uygulamalar TCP_NODELAY tercih eder.

### Delayed ACK

Alıcı tarafın da bir optimizasyonu var: **Delayed ACK**. Alıcı, ACK'ı
hemen değil, ~40-200 ms (Linux'ta tipik 40 ms) bekleyip gönderir — umar
o sürede kendi göndereceği veri çıkar ve ACK ona "bedava" biner (piggyback).

Küçük görünen bu kural, Nagle ile birleşince gecikme tuzağına dönüşür:

```text
Nagle + Delayed ACK etkileşimi (kötü senaryo):
  İstemci küçük paket yazar          [Nagle: ACK bekliyorum]
  Sunucu aldı                        [Delayed ACK: 40-200ms bekliyorum]
  ...iki taraf da diğerini bekliyor...
  Delayed ACK süresi dolar → ACK gider → Nagle buffer'ı boşalır
  Sonuç: Tek küçük yazma ~40-200 ms gecikir
```

Bu yüzden gecikmeye duyarlı protokoller (SSH, oyunlar, finansal uygulamalar)
hem `TCP_NODELAY` hem de `TCP_QUICKACK` kullanır.

**Wireshark'ta tespit:** ACK paketlerinin veri paketlerinden ~40 ms veya
~200 ms sonra geldiği düzenli desen `tcp.analysis.ack_rtt` alanıyla
görülebilir (bkz. Modül 23). m11 pcap'inde keep-alive oturumlarında
 ACK'ların anında değil küçük gecikmeyle döndüğünü görebilirsin:
```text
tcp.analysis.flags && tcp.len == 0
```

**SINAV İPUCU:** "Küçük paketler neden gecikiyor?" → Nagle (gönderici
tarafı) + Delayed ACK (alıcı tarafı) etkileşimi. Çözüm TCP_NODELAY.

### Flow Control vs Congestion Control

TCP akış yönetiminde iki ayrı kontrol mekanizması vardır:

| | Flow Control | Congestion Control |
|--|-------------|-------------------|
| **Kontrol eden** | Alıcı (receiver) | Ağ (network) |
| **Mekanizma** | Receive Window (rwnd) | Congestion Window (cwnd) |
| **Amaç** | Alıcıyı boğmamak | Ağ tıkanıklığını önlemek |
| **Sinyal** | Zero Window | Paket kaybı / ECN |
| **Görülen** | Window Scaling grafiği | Time-Sequence grafiği |

**Effective Window = min(cwnd, rwnd)**: Gerçek gönderme hızı, iki pencereden küçük olanına bağlıdır.

### Congestion Control

TCP tıkanıklık kontrolü (congestion control), ağın kapasitesini aşmadan veri göndermeyi sağlar.

**Congestion Window (cwnd):** Gönderenin ağ tıkanıklığına göre belirlediği pencere boyutu. TCP'nin gönderme hızı cwnd ile sınırlıdır.

> **Modern algoritmalar:** Klasik TCP Reno'nun yerini bugün Linux'ta varsayılan
> olarak **CUBIC**, Google ağlarında ise **BBR** aldı. pcap'de hangisinin
> kullanıldığını doğrudan göremezsin (pencere davranışından çıkarım yapılır:
> CUBIC kayıp sonrası pencereyi kübik eğriyle büyütür). Sınav için bilmen
> gereken: cwnd davranışı sürüme göre değişir, ama slow start / fast
> retransmit kavramları hepsinde ortaktır.

#### Slow Start

- Bağlantı başında cwnd küçük başlar (genellikle 1-10 MSS)
- Her RTT'de cwnd **iki katına** çıkar (exponential growth)
- ssthresh (slow start threshold) değerine kadar devam eder

```text
RTT 1: cwnd = 1 MSS    → 1 segment gönderilir
RTT 2: cwnd = 2 MSS    → 2 segment gönderilir
RTT 3: cwnd = 4 MSS    → 4 segment gönderilir
RTT 4: cwnd = 8 MSS    → 8 segment gönderilir
...
```

#### Congestion Avoidance

- cwnd ssthresh'a ulaştığında geçiş yapılır
- Her RTT'de cwnd **1 MSS artar** (linear growth)
- Daha yavaş ama kararlı büyüme

```text
Slow Start:  1 → 2 → 4 → 8 → 16 (exponential)
                                   ↓ ssthresh
Congestion Avoidance: 17 → 18 → 19 → 20 (linear)
```

#### Fast Retransmit

- 3 Duplicate ACK alındığında tetiklenir
- Timeout beklemeden hemen kayıp segment yeniden gönderilir
- Wireshark: `tcp.analysis.fast_retransmission`

```text
Gönderen: Seq 1, Seq 1001, Seq 2001, Seq 3001, Seq 4001
Alıcı:    ACK 1001, ACK 1001 (dup), ACK 1001 (dup), ACK 1001 (dup)
                                          ↑ 3. duplicate ACK
Gönderen: Seq 1001 (FAST RETRANSMIT)     ← Timeout beklemeden!
```

#### Fast Recovery

- Fast Retransmit sonrasında Slow Start'a geri dönülmez
- cwnd yarıya indirilir (ssthresh = cwnd / 2)
- Congestion Avoidance ile devam edilir

```text
Normal loss: cwnd = 32 → ssthresh = 16 → Slow Start (cwnd = 1)
Fast Recovery: cwnd=32 → ssthresh=16 → Cong. Avoidance (cwnd=16)
```

> **SINAV İPUCU:** 3 Duplicate ACK = Fast Retransmit tetikler. Fast Recovery ile Slow Start'a dönülmez.
>
> Slow Start exponential, Congestion Avoidance linear büyür.

### Zero Window

Alıcının buffer'ı dolduğunda window size'ı sıfıra düşürür. Gönderen data göndermeyi durdurur.

- **Zero Window:** `tcp.window_size == 0`
- **Window Probe:** Gönderen periyodik olarak 1 byte data göndererek window durumunu kontrol eder
- **Window Update:** Alıcı buffer boşalttığında yeni window size'ı bildirir

```text
Alıcı:   ACK, Window=0                      ← "Daha data alamıyorum"
Gönderen: 1 byte (Window Probe)             ← "Window hâlâ sıfır mı?"
Alıcı:   ACK, Window=0                      ← "Evet, hâlâ dolu"
... (bekleme) ...
Alıcı:   Window Update, Window=8192         ← "Artık data alabilirim"
Gönderen: Data gönderir                     ← Normal akış devam eder
```

Wireshark:
```text
 tcp.window_size == 0      ← Zero Window
 tcp.analysis.zero_window  ← Wireshark zero window uyarısı
```

### TCP Timestamps

TCP Timestamps option'ı her pakete zaman damgası ekler. İki amaç için kullanılır:

1. **RTT Ölçümü:** Her paketin gönderim ve alma zamanı
2. **PAWS (Protection Against Wrapped Sequences):** Eski duplicate paketleri reddetme

```text
 v Transmission Control Protocol
     Options: (10 bytes)
         TCP Option - Timestamps
             Timestamp value: 12345678       ← Paketin gönderim zamanı
             Timestamp echo reply: 12345000  ← Alınan son timestamp
```

- **tsval:** Bu paketin zaman damgası
- **tsecr:** Karşıdan alınan son zaman damgası (echo)
- **RTT hesabı:** tsval gönderim, tsecr echo

PAWS, sequence number 32 bit olduğu için yüksek hızlı bağlantılarda sıra numarası dönmesi (wrap-around) problemine karşı koruma sağlar. Eski bir paket yeni paket ile karıştırılamaz.

> **SINAV İPUCU:** TCP Timestamps SYN'de görüşülür. tsval ve tsecr ile RTT ölçülür.
>
> PAWS, sequence wrap-around korumasıdır.

> **İstihbarat İşaretleri, TCP analizi güvenlik için kritik:**
>
> - Çok sayıda retransmission = ağ sorunu VEYA manipulation
> - Zero window attack: Hedefin receive buffer'ını doldurma
> - SACK spoofing: Almadığı data'yı "aldım" deme
> - Keep-alive timing = connection pattern analizi
> - Window size OS fingerprinting: Farklı OS'ler farklı window büyüklükleri kullanır

## Hazırlık

```sh
# Advanced TCP trafik oluştur:
./scripts/generate-traffic.sh advanced-tcp

# PCAP'i Wireshark ile aç:
# macOS: open -a Wireshark module-11-advanced-tcp.pcap
# Linux: wireshark module-11-advanced-tcp.pcap &
# Windows: start wireshark module-11-advanced-tcp.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

## Alıştırmalar

### Alıştırma 1: TCP Options Analizi

TCP option'larını SYN paketinde incele. Tüm bağlantı parametreleri burada görüşülür.

### Filtre:

```text
tcp.flags.syn == 1 && tcp.flags.ack == 0
```

### Adımlar:

1. SYN paketini bul (3-way handshake'in ilk paketi)
2. **Transmission Control Protocol** katmanını genişlet
3. **Options** bölümünü genişlet:

```text
 v Transmission Control Protocol
     Options: (20 bytes)
         TCP Option - Maximum Segment Size (MSS): 1460
         TCP Option - Selective Acknowledgement (SACK Permitted)
         TCP Option - Timestamps: TSval 2691057818, TSecr 0
         TCP Option - No-Operation (NOP)
         TCP Option - Window Scale: 7 (multiply by 128)
```

4. Her option'ı not et:
   - **MSS:** 1460 (maksimum segment boyutu)
   - **Window Scale:** 7 (çarpan = 2^7 = 128)
   - **SACK Permitted:** SACK desteği var
   - **Timestamps:** Aktif

5. SYN-ACK paketinde aynı option'ları kontrol et (`tcp.flags.syn == 1 && tcp.flags.ack == 1`):

```text
 tcp.options.mss_val                         ← MSS değeri
 tcp.options.wscale                          ← Window Scale çarpanı
 tcp.options.sack_perm                       ← SACK Permitted (var/yok)
 tcp.options.timestamp.tsval                 ← Timestamp değeri
```

> **SINAV İPUCU:** TCP options SYN/SYN-ACK'te görüşülür, bağlantı boyunca değişmez.
>
> Wireshark'ın TCP tree'sinde her option'ı tek tek görebilirsin.

### Alıştırma 2: Window Scaling Hesaplama

Window Scaling çarpanını hesapla ve Wireshark'ın hesabını doğrula.

### Adımlar:

1. SYN paketinde Window Scale option'ını bul:

```text
 TCP Option - Window Scale: 7 (multiply by 128)
```

2. Herhangi bir data paketinde window size değerini bul:

```text
  Window size value: 502
  Window size scaling factor: 128
  [Calculated window size: 64256]
```

3. Hesaplama:

```text
  Gerçek window = window_value × 2^scale
  Gerçek window = 502 × 2^7
  Gerçek window = 502 × 128
  Gerçek window = 64256 byte
```

4. Wireshark'ın hesabını kontrol et:
   - `tcp.window_size_value` = raw header değeri
   - `tcp.window_size_scalefactor` = çarpan
   - Wireshark otomatik hesaplar ve `[Calculated window size]` olarak gösterir

5. Farklı paketlerde window size'ın değiştiğini gözlemle (flow control)

### Senaryo:

| Paket | Window Value | Scale Factor | Calculated Window |
|-------|-------------|-------------|-------------------|
| SYN | 64240 | - (henüz görüşülmedi) | 64240 |
| SYN-ACK | 65160 | 128 (görüşüldü) | 65160 |
| Data | 502 | 128 | 64256 |
| ACK | 502 | 128 | 64256 |

> **SINAV İPUCU:** Window Scaling sınavda sorulur. SYN'de scale factor bulunur, sonraki tüm paketlerde raw window × scale hesaplanır.
>
> SYN ve SYN-ACK paketlerinde scale henüz uygulanmaz; çarpan ancak handshake sonrası paketler için geçerlidir.

### Alıştırma 3: SACK Analizi

Paket kaybı senaryosunda SACK option'ını analiz et.

### Filtre:

```text
tcp.options.sack
```

### Adımlar:

1. Paket kaybı olan bir akışta SACK option'ı taşıyan ACK paketlerini listele
   - Bu pcap'te 29 SACK paketi vardır
2. Bir SACK paketini incele (frame 48):

```text
 v Transmission Control Protocol
     Acknowledgment number: 22673         ← "22673'e kadar aldım"
     Options:
         TCP Option - Selective Acknowledgement (SACK)
             Left Edge: 25569             ← "Ayrıca 25569 ile..."
             Right Edge: 28465            ← "...28465 arasını da aldım"
```

3. Yorumla:
   - ACK 22673 = 22673'e kadar tüm data alındı
   - SACK 25569-28465 = bu aralık da alındı
   - **Eksik data:** 22673-25569 (bu aralık gönderilmedi veya kayboldu)
   - Gönderen sadece 22673-25569 arasını yeniden göndermelidir

4. Birden fazla SACK bloğu olabilir (frame 50):

```text
  SACK Block 1: Left=30865, Right=33761  ← 1. alınan blok
  SACK Block 2: Left=25569, Right=28465  ← 2. alınan blok
  → Eksik: 22673-25569 ve 28465-30865
```

5. SACK Permitted'ı doğrula:

```text
tcp.options.sack_perm == 1
```

> **SINAV İPUCU:** SACK, hangi data'nın alındığını seçici olarak belirtir. Retransmission miktarını azaltır. SACK Permitted SYN'de görüşülür.
>
> SACK option ACK paketlerinde taşınır.

### Alıştırma 4: Keep-Alive Tespiti

Keep-alive paketlerini tespit et ve timing paternini analiz et.

### Filtre:

```text
tcp.analysis.keep_alive || tcp.analysis.keep_alive_ack
```

### Adımlar:

1. Keep-alive paketlerini filtrele
2. Bir keep-alive paketini incele (frame 188):

```text
 v Transmission Control Protocol
     Seq=7, Ack=8, Len=0                  ← Data yok
     [TCP Keep-Alive]
```

3. Keep-alive ACK'i incele:

> **Not:** Bu pcap'te Keep-Alive ACK yoktur: Sunucu yanıtlamak yerine bağlantıyı RST ile kapatır (frame 191). Keep-Alive ACK'nin görünümü şöyledir:

```text
 v Transmission Control Protocol
     Seq=7, Ack=8, Len=0                  ← Dikkat: Seq bir eksik!
     [TCP Keep-Alive ACK]
```

4. **Timing analizi:** Keep-alive paketleri arasındaki süre:
   - Wireshark'ta **Time** sütununa bak
   - Bu pcap'te üç keep-alive (frame 188-190) yaklaşık **1 saniye** aralıkla gelir (lab üretimi)
   - Gerçek dünyada OS defaultu genellikle 2 saat (7200 saniye); uygulama seviyesinde daha kısa olabilir (ör. SSH: Her 60 saniye)

5. Keep-alive neden önemli?
   - Güvenlik duvarları (firewall) idle bağlantıları kapatır
   - NAT cihazları idle bağlantıları unutur
   - Keep-alive bağlantıyı canlı tutar

6. tshark ile keep-alive analizi:

```sh
tshark -r shared/pcaps/module-11-advanced-tcp.pcap \
  -Y "tcp.analysis.keep_alive" \
  -T fields -e frame.time_relative -e ip.src -e ip.dst -e tcp.seq
```

> **SINAV İPUCU:** Keep-alive paketleri 0 veya 1 byte data taşır. Seq numarası bir eksik gönderilir (probe amaçlı).
>
> Alıcı ACK ile yanıt verir.

### Alıştırma 5: Retransmission Analizi

Retransmission ve Fast Retransmit arasındaki farkı analiz et.

### Filtreler:

```text
tcp.analysis.retransmission
tcp.analysis.fast_retransmission
tcp.analysis.duplicate_ack
```

### Adımlar:

1. Tüm retransmission'ları listele:

```text
tcp.analysis.retransmission
```

2. Normal retransmission vs fast retransmit:

| Özellik | Normal Retransmission | Fast Retransmit |
|---------|----------------------|-----------------|
| **Tetikleyici** | Timeout (RTO) | 3 Duplicate ACK |
| **Süre** | Uzun bekleme | Hızlı |
| **cwnd etkisi** | Slow Start'a dön | Fast Recovery |
| **Renk (Wireshark)** | Açık kırmızı arka plan (Bad TCP) | Açık kırmızı arka plan (Bad TCP) |
| **Expert Info** | Note | Note |

3. Duplicate ACK'leri analiz et:

```text
tcp.analysis.duplicate_ack
```

Her duplicate ACK için (frame 50):

```text
 v Transmission Control Protocol
     Acknowledgment number: 22673         ← Aynı ACK (tekrar)
     [TCP Dup ACK 48#2]                   ← Frame 48'in ACK'ı, 2. tekrar
     Options:
         SACK: 30865-33761, 25569-28465   ← "Ama bu araları aldım"
```

4. 3 Duplicate ACK kuralını doğrula:
   - Aynı Ack numarasına sahip 3 duplicate ACK bul
   - 3. duplicate ACK'ten hemen sonra retransmission geldiğini teyit et
   - Bu Fast Retransmit'tir

5. Expert Info ile kontrol et:
   - **Analyze > Expert Information**
   - **Note** seviyesinde: "Retransmission", "Duplicate ACK" (Fast Retransmission da Note'dur; bu pcap'te yoktur — 0 paket)
   - Her satıra tıklayarak ilgili pakete git

> **SINAV İPUCU:** 3 Duplicate ACK = Fast Retransmit. Fast Retransmit sonrası Fast Recovery uygulanır, Slow Start'a dönülmez.
>
> Normal retransmission timeout tabanlıdır.

### Alıştırma 6: TCP Stream Graph (Advanced)

TCP Stream Graph'ların ileri düzey kullanımı.

### Adımlar:

1. Statistics > TCP Stream Graphs > Time-Sequence (tcptrace)

TCPtrace graph'ı retransmission'ları geri sıçrama (backward jump) olarak gösterir:

```text
  Seq
   ↑
   |          /----\        /---  ← Retransmission (geri sıçrama)
   |         /      \      /
   |        /        \    /
   |       /          \--/
   |      /
   |     /
   |____/_________________________→ Time
```

- İleri doğru eğim: Normal data iletimi
- Geri sıçrama: Retransmission
- Yatay bölge: İdle (data yok)

2. Statistics > TCP Stream Graphs > Throughput

Throughput graph congestion window etkisini gösterir:

```text
  Throughput
   ↑
   |     ___________
   |    /           \         ___ ← Congestion Avoidance (linear)
   |   /             \       /
   |  /               \_____/
   | /                       ← Loss sonrası düşüş
   |/________________________→ Time
   Slow Start (exponential)
```

- Slow Start: Hızlı yükselme (exponential)
- Congestion Avoidance: Yavaş yükselme (linear)
- Loss: Anlık düşüş

3. Statistics > TCP Stream Graphs > Round Trip Time

RTT varyasyonlarını gösterir:

```text
  RTT
   ↑
   |  . .   .     . .
   |  .  . .   . .   .
   |  .    . . .      .
   |_________________________→ Time
```

- Yüksek RTT spike'ları = tıkanıklık veya queueing
- Düşük tutarlı RTT = iyi ağ koşulları

4. Statistics > TCP Stream Graphs > Window Scaling

Receiver window değişimlerini gösterir:

```text
  Window
   ↑
   |  ----       ----
   |      |     |    |
   |      |_____|    |___________
   |                         ↑ Zero window!
   |_________________________→ Time
```

- Window düşüşü: Alıcının buffer'ı doluyor
- Zero window: Alıcı tamamen dolu
- Window recovery: Buffer boşaldı

> **SINAV İPUCU:** TCP Stream Graph > Throughput, congestion window davranışını görselleştirir. Slow Start exponential, Congestion Avoidance linear büyüme gösterir.
>
> Loss sonrası cwnd düşer.

### Alıştırma 7: Zero Window Analizi

Receiver overload senaryosunda zero window durumunu analiz et.

> **Not:** Bu pcap'te zero window paketi üretilmemiştir; aşağıdaki örnek akış temsilidir. Filtre uygulandığında boş sonuç normaldir.

### Filtre:

```text
tcp.window_size == 0 || tcp.analysis.zero_window
```

### Adımlar:

1. Zero window paketlerini listele
2. Zero window akışını takip et:

```text
 Paket 1: Data → Seq=1001, Len=1460       ← Data gönderiliyor
 Paket 2: ACK → Ack=2461, Window=512      ← Buffer azalıyor
 Paket 3: Data → Seq=2461, Len=1460
 Paket 4: ACK → Ack=3921, Window=0        ← ZERO WINDOW (dolu!)
 Paket 5: Window Probe → Seq=3920, Len=1  ← Gönderen probe
 Paket 6: ACK → Ack=3921, Window=0        ← Hâlâ sıfır
 ... (alıcı buffer'ı boşaltıyor) ...
 Paket N: Window Update → Window=8192     ← Window açıldı!
 Paket N+1: Data gönderir                 ← Normal akış sürer
```

3. Expert Info'da kontrol et:
   - `tcp.analysis.zero_window` ile Wireshark uyarıları
   - **Analyze > Expert Info** > Warning: "Zero window"

4. Window Probe tespiti:

```text
tcp.len == 1 && tcp.analysis.zero_window
```

Window Probe: Gönderen 1 byte data gönderir, alıcı ACK ile window durumunu bildirir.

> **SINAV İPUCU:** Zero Window = alıcı daha fazla data alamıyor. Window Probe ile durum kontrol edilir.
>
> Window Update ile akış devam eder.

### Alıştırma 8: Tshark ile TCP Analizi

CLI ile ileri düzey TCP analizi.

### Retransmission Analizi:

```sh
tshark -r shared/pcaps/module-11-advanced-tcp.pcap \
  -Y "tcp.analysis.retransmission" \
  -T fields -e frame.number -e ip.src -e ip.dst \
  -e tcp.seq -e tcp.ack
```

### SACK Analizi:

```sh
tshark -r shared/pcaps/module-11-advanced-tcp.pcap \
  -Y "tcp.options.sack" \
  -T fields -e frame.number -e ip.src -e ip.dst \
  -e tcp.options.sack_le -e tcp.options.sack_re
```

### TCP Options Analizi (SYN paketleri):

```sh
tshark -r shared/pcaps/module-11-advanced-tcp.pcap \
  -Y "tcp.flags.syn==1 && tcp.flags.ack==0" \
  -T fields -e ip.src -e ip.dst \
  -e tcp.options.mss_val -e tcp.options.wscale \
  -e tcp.options.sack_perm \
  -e tcp.options.timestamp.tsval
```

### Conversation İstatistik:

```sh
tshark -r shared/pcaps/module-11-advanced-tcp.pcap -z conv,tcp
```

### Duplicate ACK Sayısı:

```sh
tshark -r shared/pcaps/module-11-advanced-tcp.pcap \
  -Y "tcp.analysis.duplicate_ack" \
  -T fields -e ip.src -e ip.dst -e tcp.ack \
  | sort | uniq -c | sort -rn
```

### Zero Window Tespiti:

```sh
tshark -r shared/pcaps/module-11-advanced-tcp.pcap \
  -Y "tcp.window_size == 0" \
  -T fields -e frame.number -e ip.src -e ip.dst -e tcp.seq
```

### Keep-Alive Timing:

```sh
tshark -r shared/pcaps/module-11-advanced-tcp.pcap \
  -Y "tcp.analysis.keep_alive" \
  -T fields -e frame.time_relative -e ip.src \
  -e ip.dst -e tcp.stream
```

### TCP Expert Info:

```sh
tshark -r shared/pcaps/module-11-advanced-tcp.pcap \
  -Y "tcp.analysis.flags" \
  -T fields -e frame.number -e ip.src -e ip.dst \
  -e tcp.analysis.flags
```

> **SINAV İPUCU:** tshark `-T fields -e` ile istediğin alanı çekebilirsin. TCP options için `tcp.options.*` filtrelerini kullan.
>
> `-z conv,tcp` ile conversation istatistik alınır.

## Filtre Referansı

| Filtre | Açıklama |
|--------|----------|
| `tcp.options.sack_perm` | SACK destekleniyor |
| `tcp.options.sack` | SACK option var |
| `tcp.options.sack_le` | SACK Left Edge |
| `tcp.options.sack_re` | SACK Right Edge |
| `tcp.options.wscale` | Window Scaling option |
| `tcp.window_size == 0` | Zero window |
| `tcp.window_size_value` | Calculated window size |
| `tcp.window_size_scalefactor` | Window scale çarpanı |
| `tcp.analysis.keep_alive` | Keep-alive paketi |
| `tcp.analysis.keep_alive_ack` | Keep-alive ACK |
| `tcp.analysis.retransmission` | Retransmission |
| `tcp.analysis.fast_retransmission` | Fast retransmit |
| `tcp.analysis.duplicate_ack` | Duplicate ACK |
| `tcp.analysis.zero_window` | Zero window uyarısı |
| `tcp.options.timestamp.tsval` | TCP timestamp değeri |
| `tcp.options.timestamp.tsecr` | TCP timestamp echo |
| `tcp.options.mss_val` | MSS değeri |
| `tcp.len == 0` | Data taşımayan paketler |

### Bileşik Filtreler:

```text
# TCP handshake'te tüm option'lar:
tcp.flags.syn == 1 && tcp.flags.ack == 0

# Tüm retransmission ve fast retransmit:
tcp.analysis.retransmission || tcp.analysis.fast_retransmission

# Zero window ve window probe:
tcp.window_size == 0 || tcp.analysis.zero_window

# Keep-alive ve keep-alive ACK:
tcp.analysis.keep_alive || tcp.analysis.keep_alive_ack

# Duplicate ACK + SACK:
tcp.analysis.duplicate_ack && tcp.options.sack

# Belirli stream'de retransmission:
tcp.stream == 0 && tcp.analysis.retransmission

# TCP option analizi (SYN) — tek satırda kullan:
tcp.flags.syn == 1 && (tcp.options.sack_perm ||
tcp.options.wscale || tcp.options.timestamp.tsval)
```

> **SINAV İPUCU:** TCP options SYN/SYN-ACK'te görüşülür, bağlantı boyunca değişmez. Window Scaling çarpanı sınavda sorulur. SACK, retransmission miktarını azaltır.
>
> 3 Duplicate ACK = Fast Retransmit tetikler.

> **İstihbarat İşaretleri, TCP analizi güvenlik için kritik:**
>
> - Çok sayıda retransmission = ağ sorunu VEYA manipulation
> - Zero window attack: Hedefin receive buffer'ını doldurma
> - SACK spoofing: Almadığı data'yı "aldım" deme
> - Keep-alive timing = connection pattern analizi
> - Window size OS fingerprinting: Farklı OS'ler farklı window büyüklükleri kullanır

## Sınav Soruları (Çöz)

1. SACK ne işe yarar? Normal ACK'tan farkı nedir?
2. Window Scaling hangi pakette görüşülür? Nasıl hesaplanır?
3. 3 Duplicate ACK neyi tetikler? Bu mekanizmanın adı nedir?
4. Zero Window ne demek? Gönderen ne yapar?
5. TCP Keep-Alive ne işe yarar? Paket boyutu nedir?
6. Nagle Algorithm ne yapar? TCP_NODELAY ne demek?
7. Slow Start ile Congestion Avoidance arasındaki fark nedir?
8. TCP Timestamps option'ının iki amacı nedir?
9. Fast Retransmit ile normal retransmission arasındaki fark nedir?
10. Window Probe ne demek? Ne zaman gönderilir?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. Seçici onay. Alıcı hangi data'nın alındığını seçici olarak belirtir. Normal ACK sadece "X'e kadar her şeyi aldım" der. SACK ise "X'e kadar aldım, ama ayrıca Y-Z arasını da aldım" der. Böylece gönderen sadece eksik kısmı yeniden gönderir, tüm data'yı değil.

2. SYN ve SYN-ACK paketlerinde görüşülür. Window Scale option'ında shift count (n) belirtilir. Gerçek window = header'daki window_value × 2^n. Örneğin shift count 7 ise çarpan 128'dir. Sadece handshake sırasında belirlenir, sonradan değişmez.

3. Fast Retransmit tetikler. 3 Duplicate ACK alındığında gönderen timeout beklemeden hemen kayıp segment'i yeniden gönderir. Normal retransmission timeout (RTO) beklerken, Fast Retransmit anında tepki verir.

4. Alıcının receive buffer'ı dolu, daha fazla data alamıyor. Gönderen data göndermeyi durdurur. Periyodik olarak Window Probe (1 byte) göndererek alıcının window durumunu kontrol eder. Alıcı buffer boşalttığında Window Update gönderir.

5. Ölü bağlantıları tespit etme. Karşı tarafın hâlâ canlı olup olmadığını kontrol eder. Keep-alive paketi 0 veya 1 byte data taşır. Seq numarası bir eksik gönderilir (probe). Default timing genellikle 2 saat idle sonrası.

6. Küçük paketleri birleştirir, ağ verimliliğini artırır. ACK gelene kadar küçük data'ları buffer'da tutar, sonra birlikte gönderir. TCP_NODELAY, Nagle'ı devre dışı bırakan socket option'dır. Interaktif uygulamalar (SSH, gaming) düşük gecikme için TCP_NODELAY kullanır.

7. Slow Start exponential büyür (cwnd her RTT'de iki katına çıkar). Congestion Avoidance linear büyür (cwnd her RTT'de 1 MSS artar). Slow Start ssthresh'a kadar devam eder, sonra Congestion Avoidance'a geçilir.

8. RTT ölçümü: Tsval ve tsecr ile her paketin gidiş-dönüş süresi hesaplanır. PAWS (Protection Against Wrapped Sequences): Yüksek hızlı bağlantılarda sequence number dönmesi durumunda eski paketlerin reddedilmesini sağlar.

9. Fast Retransmit 3 Duplicate ACK ile tetiklenir (hızlı, timeout beklemez). Normal retransmission timeout (RTO) ile tetiklenir (yavaş, bekleme süresi var). Fast Retransmit sonrası Fast Recovery uygulanır (cwnd yarıya iner). Normal retransmission sonrası Slow Start'a dönülür (cwnd = 1).

10. Window Probe, alıcının window durumunu kontrol etmek için gönderilen 1 byte'lık pakettir. Zero Window durumunda gönderilir. Alıcı ACK ile window değerini bildirir. Hâlâ sıfırsa gönderen beklemeye devam eder. Window açıldığında normal data iletimi devam eder.

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
