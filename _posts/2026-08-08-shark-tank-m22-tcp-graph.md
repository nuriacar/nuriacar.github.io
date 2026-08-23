---
layout: post
title:  "shark-tank - m22: TCP Grafikleri"
date:   2026-08-08 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 22: TCP Grafikleri

**Neden?** C2 sunucusuyla iletişim düzenli aralıklarla gerçekleşiyor. Paket listesine bakınca görmek zor, ama grafiğe dökünce desen belli oluyor. Saldırı grafiklerde anomali olarak görünür: IO Graph'da throughput spike (DDoS veya veri sızdırma), Flow Graph'da ani bağlantı artışı (port scan veya botnet aktivasyonu), Stream Graph'da düzenli aralıklarla tekrar eden trafik (C2 beaconing). Sayısal veri gözle görülmeyen saldırıyı ortaya çıkarır. Bu modülde, grafiklerle saldırı desenlerini okumayı öğreneceksin.

**Görev:** Wireshark grafik araçlarıyla TCP davranışını görselleştir.

**Öğrenim Hedefleri:**
- IO Graph ile genel trafik yoğunluğunu ve throughput spike'ları görebilmek
- TCP Stream Graph (Time-Sequence, Throughput, RTT) ile tek bir akışı analiz edebilmek
- Grafiklerdeki anormallikleri (DDoS, C2 beaconing, port scan) tespit edebilmek
- Flow Graph ile bağlantı akışını görsel olarak takip edebilmek
- Grafik verilerini CSV/PDF olarak dışa aktarabilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **IO Graph** | Wireshark'ın tüm trafiğin zaman içindeki dağılımını gösteren genel amaçlı grafik aracı. `Statistics → IO Graph` menüsünden açılır. X ekseni zamanı, Y ekseni paket/saniye veya byte/saniyeyi gösterir. Belirli zaman aralıklarında (interval) trafik yoğunluğunu görselleştirir: Ani spike'lar DDoS veya veri sızdırma, düz ve düşük seviye normal trafiği gösterir. Display filter ile farklı protokolleri veya IP'leri ayrı renklerde çizdirebilirsin. Sınavda "hangi grafik toplam trafik yoğunluğunu gösterir?" sorusunun cevabı IO Graph'tir. |
| **Flow Graph** | Wireshark'ın paketlerin zaman içindeki akışını görsel olarak gösteren diyagram aracı. `Statistics → Flow Graph` menüsünden açılır. Her satır bir cihazı (IP/MAC), her ok bir paketi temsil eder; iletişimin başlangıcından sonuna kadar kimin ne zaman ne gönderdiği tek bir görüntüde özetlenir. Özellikle TCP 3-way handshake ve bağlantı kapatma süreçlerini, port scan desenlerini ve çoklu cihaz etkileşimini görselleştirmek için kullanılır. Sınavda bir saldırının zaman çizelgesini oluşturmak için Flow Graph kullanımı test edilir. |
| **TCP Stream Graph** | Wireshark'ın tek bir TCP bağlantısını (stream) derinlemesine analiz eden dört farklı grafikten oluşan araç seti. `Statistics → TCP Stream Graphs` menüsü altında dört grafik bulunur: Time-Sequence (tcptrace): Sequence number'ın zaman içindeki ilerleyişini ve retransmission'ları gösterir; Throughput: Saniyedeki veri miktarını gösterir; Round Trip Time: Her paketin gidiş-dönüş süresini gösterir; Window Scaling: Alıcının window boyutunun zaman içindeki değişimini gösterir. IO Graph tüm trafiği gösterirken, TCP Stream Graph tek bir bağlantıya odaklanır. |
| **TCP** | Transmission Control Protocol: İnternetin güvenilir ve sıralı veri iletimini sağlayan protokol. Veriyi göndermeden önce alıcıyla bağlantı kurar (3-way handshake), gönderdiği her paket için onay (ACK) bekler ve onay gelmeyen paketleri yeniden gönderir (retransmission). Bu mekanizmalar sayesinde veri kaybı olmadan ve gönderim sırasında bozulmadan teslim edilir. Web (HTTP), email (SMTP), dosya transferi (FTP) gibi kritik işlemlerin tamamı TCP üzerinden çalışır. Bağlantı kurma ve onay bekleme yükü nedeniyle UDP'den yavaştır, ama güvenilirlik gerektiğinde tek seçenektir. |
| **throughput** | Bir ağ bağlantısında saniyede taşınan veri miktarı (byte/saniye veya bit/saniye). Throughput, bağlantının verimini ölçer: Yüksek throughput hızlı veri transferini, düşük throughput darboğaz veya sorun olduğunu gösterir. Wireshark'ta Statistics → TCP Stream Graphs → Throughput grafiği, bir TCP bağlantısındaki veri aktarım hızını zaman içinde gösterir. Grafikteki ani düşüşler ağ tıkanıklığı, paket kaybı veya retransmission göstergesidir. Throughput ile bandwidth (bant genişliği) farklıdır: Bandwidth ağ kapasitesidir, throughput ise bu kapasitenin ne kadarının fiilen kullanıldığıdır. |
| **RTT** | Round Trip Time: Bir paketin kaynaktan hedefe gidip geri dönmesi için geçen toplam süre. ICMP ping'inde, Echo Request'in gönderilmesi ile Echo Reply'nin alınması arasındaki süre RTT'dir. Wireshark bu değeri paket detaylarında `[Response Time: X.XXX ms]` olarak otomatik hesaplar. RTT, ağ gecikmesinin (latency) temel ölçüsüdür: Düşük RTT hızlı bağlantıyı, yüksek RTT uzak veya tıkalı bir bağlantıyı gösterir. Sınavda `Edit > Time Display Format > Seconds Since Previous Packet` ile manuel RTT ölçümü de test edilir. |

## Teori

Wireshark'ın grafik araçları, sayısal veriyi görsel hale getirerek trafik desenlerini, anormallikleri ve performans sorunlarını anlamayı kolaylaştırır.

### IO Graph vs TCP Stream Graph:

| Özellik | IO Graph | TCP Stream Graph |
|---------|----------|-----------------|
| **Kapsam** | Tüm paketler | Tek bir TCP akışı |
| **X ekseni** | Zaman (sabit aralık) | Zaman veya paket no |
| **Y ekseni** | Paket/s, Byte/s, ... | Seq no, byte/s, RTT, window |
| **Filtre** | Display filter | TCP stream seçimi |
| **Kullanım** | Genel trafik analizi | Derin TCP analizi |

---

## Hazırlık

```sh
./scripts/generate-traffic.sh tcp-graph
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

---

## Alıştırma 1: IO Graph Temel Kullanımı

IO Graph, tüm trafiğin zaman içindeki dağılımını gösterir.

### Adımlar:

1. `module-22-tcp-graph.pcap`'i Wireshark'ta aç
2. Statistics → IO Graph
3. Varsayılan grafik: Tüm paketler (paket/saniye)
4. Grafik ayarları:
   - **X Axis**: Time (sec): Zaman aralığı
   - **Interval**: 1 sec: Her sütun 1 saniye
   - **Y Axis**: Packets/Tick: Paket sayısı
   - **Style**: Line: Çizgi grafik
5. Grafikteki **tepe noktaları** ne anlama geliyor?
   - Ani yükseliş = trafik patlaması (burst)
   - Düzlük = sessizlik
   - Periyodik tepe = tarama (scan) veya polling

### Birden Fazla Filtre Ekleme:

1. **IO Graph** penceresinde **Add** butonu ile yeni grafik çizgisi ekle:
   - **Line 2**: `tcp.port == 80` → HTTP trafiği
   - **Line 3**: `tcp.port == 443` → HTTPS trafiği
   - **Line 4**: `dns` → DNS trafiği
2. Her satır için farklı renk seç
3. Hangi protokol en yoğun? Hangi zaman aralığında?

> **SINAV İPUÇLARI:**
>
> - IO Graph = **zaman bazlı** trafik dağılımı
> - Interval küçüldükçe detay artar, büyüdükçe genel desen görünür
> - Her grafik satırına ayrı display filter uygulanabilir
> - **Smooth** seçeneği grafiği yumuşatır, tepe noktaları azalır

> **İstihbarat İşaretleri, IO Graph anormallik tespiti:**
>
> - Normalden yüksek trafik = veri sızıntısı veya DDoS
> - Periyodik tepeler = beaconing (C2 iletişimi)
> - Belirli protokolde ani artış = o protokole yönelik saldırı

---

## Alıştırma 2: IO Graph İleri Düzey

### Y Ekseni Türleri:

| Y Axis | Anlamı | Kullanım |
|--------|--------|----------|
| **Packets/Tick** | Paket sayısı | Genel yoğunluk |
| **Bytes/Tick** | Byte hacmi | Bant genişliği kullanımı |
| **Bits/Tick** | Bit hızı | Hat hızı karşılaştırması |
| **Advanced...** | SUM/AVG/MAX/MIN | İstatistiksel |

### Adımlar:

1. **IO Graph** aç, yeni bir Line ekle:
   - Filter: `tcp.analysis.retransmission`
   - Style: Bar (sütun)
   - Color: Kırmızı
2. İkinci Line ekle:
   - Filter: `tcp.analysis.zero_window`
   - Style: Bar
   - Color: Turuncu
3. Y Axis tipini **Bytes/Tick** yap → bant genişliği kullanımını gör
4. Interval'i değiştir:
   - 0.1 sn: Çok detaylı, gürültülü
   - 10 sn: Genel desen, detay kaybolur
   - **1 sn**: İdeal denge

### Zoom ve Navigasyon:

- **Fare tekeri**: Zoom in/out
- **Sürükle**: Zaman aralığı seç
- **Sağ tık → Zoom In/Out**: Detaylı inceleme
- **Save As**: Grafik PNG olarak kaydedilebilir

> **SINAV İPUÇLARI:**
>
> - **Y Axis değişimi** grafiğin yorumunu tamamen değiştirir
> - **Bytes/Tick** bant genişliği analizi için kullanılır
> - Retransmission grafiği üst üste binmişse = ağ sorunu
> - Bar stili tepe noktalarını vurgulamak için idealdir

---

## Alıştırma 3: Time-Sequence Graph (tcptrace)

TCP stream'de sequence number'ların zaman içindeki ilerleyişini gösterir.

### Adımlar:

1. `module-22-tcp-graph.pcap`'i aç
2. İlk TCP akışını seç: Filtre `tcp.stream == 0`
3. Statistics → TCP Stream Graphs → Time-Sequence (tcptrace)
4. Grafiği yorumla:

```text
Seq No
  ^
  |     /    /    /    /
  |    /    /    /    /          <- Düz çizgi = normal akış
  |   /    /    /    /
  |  /    /    ___/
  | /    /    /                  <- Geri sıçrama = RETRANSMISSION!
  |/ ___/    /
  +--------------------------------> Zaman
```

5. **Retransmission** varsa:
   - Seq no geri sıçrar (düşüş)
   - Aynı seq no tekrar gönderilir
6. **Slow Start** fazı:
   - Başlangıçta yavaş artış
   - Sonra hızlanma (exponential growth)

> **Not:** Bu pcap'te `tcp.analysis.retransmission` filtresi 2 paket bulur (frame 121, 133) ama ikisi de stream 7'de, sıfır-uzunluklu FIN/ACK'tir; seq çizgisini ilerletmedikleri için Time-Sequence grafiğinde belirgin geri sıçrama görünmez. Alıştırmanın kullandığı stream 0 tertemizdir: tırmanış ve 1-6. saniyeler arası sessizlik görürsün. Geri sıçrama desenini bu pcap'te teorik olarak değerlendir.

> **SINAV İPUÇLARI:**
>
> - Düz çizgi = normal TCP akışı
> - **Geri sıçrama = Retransmission**
> - Slow Start: Eğri artan çizgi (exponential)
> - Congestion Avoidance: Doğrusal artan çizgi

---

## Alıştırma 4: Throughput Graph

TCP stream'in bant genişliği kullanımını zaman içinde gösterir.

### Adımlar:

1. `module-22-tcp-graph.pcap`: `tcp.stream == 0`
2. Statistics → TCP Stream Graphs → Throughput
3. Grafiği yorumla:
   - Y ekseni: Byte/saniye
   - Tepe noktaları: Maksimum throughput
   - Düşüşler: Ağ sorunu veya retransmission

### Throughput Desenleri:

| Desen | Anlamı |
|-------|--------|
| **Kararlı throughput** | Sağlıklı bağlantı |
| **Ani düşüş** | Paket kaybı, retransmission |
| **Düzensiz dalgalanma** | Ağ tıkanıklığı |
| **Sıfıra düşüş** | Bağlantı kopması veya zero window |

> **SINAV İPUÇLARI:**
>
> - Throughput Graph = **gerçek transfer hızı**
> - Ani düşüşler genellikle retransmission kaynaklıdır
> - Slow Start'ta throughput exponential artar
> - Loss sonrası throughput yarıya düşer

---

## Alıştırma 5: Round Trip Time (RTT) Graph

Her paketin gidiş-geliş süresini (RTT) gösterir.

### Adımlar:

1. `module-22-tcp-graph.pcap`: `tcp.stream == 0`
2. Statistics → TCP Stream Graphs → Round Trip Time
3. Grafiği yorumla:
   - Y ekseni: RTT (milisaniye)
   - Düşük RTT = hızlı ağ
   - Yüksek RTT = gecikmeli ağ
   - Değişken RTT = dengesiz ağ

### RTT Değerleri:

| RTT | Ağ Durumu |
|-----|-----------|
| < 1 ms | Aynı anahtar/switch (çok hızlı) |
| 1-10 ms | Aynı veri merkezi |
| 10-50 ms | Metropol ağı |
| 50-150 ms | Kıtalararası |
| > 150 ms | Uydu veya çok yavaş bağlantı |

> **SINAV İPUÇLARI:**
>
> - RTT artışı = ağ gecikmesi
> - Değişken RTT = ağ dengesizliği (jitter)
> - RTT, retransmission timeout (RTO) hesaplamasında kullanılır (RTO ≈ 2-4× RTT)

---

## Alıştırma 6: Window Scaling Graph

Receive window boyutunun zaman içindeki değişimi.

### Adımlar:

1. `module-22-tcp-graph.pcap`: `tcp.stream == 0`
2. Statistics → TCP Stream Graphs → Window Scaling
3. Grafiği yorumla:
   - Y ekseni: Window size (byte)
   - Yüksek window = alıcı hazır
   - **Sıfır window = alıcı buffer dolu (Zero Window)**

### Window Desenleri:

| Desen | Anlamı |
|-------|--------|
| **Sabit window** | Sağlıklı akış |
| **Azalan window** | Alıcı yavaşlıyor |
| **Sıfır window** | Alıcı tıkandı (flow control) |
| **Ani artış** | Window scale uygulandı |

> **SINAV İPUÇLARI:**
>
> - Window Scaling Graph = alıcının durumu
> - Zero Window = flow control aktif
> - Window scale factor SYN'de belirlenir, bağlantı boyunca sabittir
> - Gerçek window = window size × 2^scale_factor

---

## Alıştırma 7: Flow Graph — Saldırının Zaman Çizelgesi

Hikayenin dediği gibi: "Paket listesine bakınca görmek zor, ama grafiğe
dökünce desen belli oluyor." Flow Graph, pcap'teki tüm bağlantıları tek
görselde dizerek saldırı zaman çizelgesini çıkarır.

### Adımlar:

1. `module-22-tcp-graph.pcap` dosyasını aç
2. **Statistics → Flow Graph** menüsünü aç
3. Görünümü ayarla:
   - **Flow type: TCP Flows** (default; UDP'yi de katmak için All Flows)
4. Oku: Her satır bir host; oklar paket yönünü, renkler protokolü gösterir.
   SYN ile başlayan kalın oklar yeni bağlantıdır.

### Ne Görmelisin?

- pcap'te **10 farklı TCP stream** var; Flow Graph bunları zaman sırasına
  dizer: art arda açılan bağlantılar (aynı hedefe) beaconing/scan deseni
  verir
- Aynı satırdan (172.50.2.200) çıkan çok sayıda kısa dikey ok dizisi =
  **port scan**: her ok bir SYN denemesi, arkasından RST
- Normal trafiğin yatay ve uzun, saldırı trafiğinin dikey ve kısa
  olduğuna dikkat et

### Zaman Çizelgesi Çıkarma (sınav tekniği):

1. Flow Graph'taki ilk saldırı paketine tıkla → paket listesi o frame'e
   atlar → `frame.time_relative` değerini not et
2. Son saldırı paketine kadar tekrarla
3. Elde ettiğin "T1'de keşif → T2'de bağlantı denemeleri → T3'te veri"
   dizisi, Modül 28'deki kill-chain raporunun iskeletidir

> **SINAV İPUCU:** "Saldırının zaman çizelgesini çıkarın" sorusunda
> Flow Graph + Time Display Format (Modül 1) ikilisini kullan: grafik
> olayları bulur, zaman formatı okumayı kolaylaştırır. Alternatif CLI:
> `tshark -q -z conv,tcp` bağlantı listesini verir ama görsel sıra
> yalnız Flow Graph'ta vardır.

---

## Alıştırma 8: Conversations — Kim Kime Kaç Bayt?

Flow Graph "ne zaman"ı verir; **Conversations** "ne kadar"ı verir.
`Statistics → Conversations` (sekme bazlı: Ethernet/TCP/UDP/IPv4):
her satır bir konuşma, sütunlar paket/byte ve A→B / B→A yönü.

### Adımlar:

1. `module-22-tcp-graph.pcap` → Statistics → Conversations → **IPv4** sekmesi
2. **Bytes** sütununa göre sırala: En büyük 5 konuşmayı not et
3. **TCP** sekmesine geç: A→B ve B→A baytlarını karşılaştır:
   - Dengeli (≈%50/%50): çift yönlü oturum (HTTP gibi)
   - Tek yönlü baskın (%95+): indirme/exfil adayı (bkz. Modül 28)
4. Aynı pencerede **Graph** butonu: seçili konuşmayı IO Graph'ta izole eder

**tshark eşdeğeri (sınavda hızlı yol):**
```sh
tshark -r shared/pcaps/module-22-tcp-graph.pcap -q -z conv,tcp | head -12
```

**Analist kalıbı:** Conversations ile 3 saniyede "bu pcap'in özeti hangi
çiftlerde?" sorusu cevaplanır; şüpheli çift bulunca sağ tık → Apply as
Filter → protokol derinliğine inilir.

> **SINAV İPUCU:** "En çok veri transfer eden iki ucuz hangileri?"
> sorusunun cevabı Conversations tablosunun Bytes sıralamasıdır —
> Endpoints tek yön toplarken, Conversations ikisini birlikte gösterir.

---

## Hızlı Referans - Grafik Araçları

| Menü | Kısayol | Amaç |
|------|---------|------|
| Statistics → IO Graph | - | Genel trafik dağılımı |
| Statistics → TCP Stream Graphs → Time-Sequence | - | Seq no / retransmission |
| Statistics → TCP Stream Graphs → Throughput | - | Bant genişliği |
| Statistics → TCP Stream Graphs → Round Trip Time | - | Gecikme analizi |
| Statistics → TCP Stream Graphs → Window Scaling | - | Flow control |

### IO Graph Kullanım İpuçları:

| İşlem | Açıklama |
|-------|----------|
| Add | Yeni filtre satırı ekle |
| Interval | Zaman aralığı (1 sn default) |
| Y Axis | Paket, byte, bit veya özel |
| Style | Line, Bar, Impulse, FBar, Dot |
| Smooth | Grafik yumuşatma |
| Copy | Grafiği PNG/clipboard'a kopyala |

> **SINAV İPUCU:** IO Graph ve TCP Stream Graph arasındaki fark sınavda sorulabilir.
>
> IO Graph tüm trafik içindir, TCP Stream Graph tek bir akış içindir.

> **İstihbarat İşaretleri, Grafiklerle anomali tespiti:**
>
> - IO Graph: Ani trafik artışı = DDoS veya veri sızıntısı
> - Time-Sequence: Geri sıçrama = retransmission
> - Throughput: Ani düşüş = ağ sorunu
> - RTT: Yükselme = gecikme
> - Window Scaling: Sıfır = alıcı tıkanıklığı

---

## Sınav Soruları (Çöz)

1. IO Graph ile TCP Stream Graph arasındaki fark nedir?
2. Time-Sequence Graph'da seq numarasının geri sıçraması neyi gösterir?
3. Throughput Graph'da ani düşüş ne anlama gelir?
4. RTT Graph'da yüksek değer neyi gösterir?
5. Window Scaling Graph'da sıfır window ne demektir?
6. IO Graph'da birden fazla satıra farklı display filter uygulanabilir mi?
7. Slow Start hangi grafikte exponential büyüme olarak görünür?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. IO Graph tüm paketlerin zaman içindeki dağılımını gösterir (genel). TCP Stream Graph tek bir TCP akışının detaylı analizini gösterir (özel). IO Graph birden fazla filtre satırı alabilir, TCP Stream Graph seçili stream'e odaklanır.

2. Retransmission'ı gösterir. Aynı seq no tekrar gönderildiği için grafikte geri sıçrama olur. Normal akış düz veya artan bir çizgidir.

3. Paket kaybı, retransmission veya ağ tıkanıklığı olduğunu gösterir. Throughput düşüşü genellikle congestion control'ün devreye girdiği anlamına gelir.

4. Ağ gecikmesi (latency) olduğunu gösterir. RTT < 1 ms = aynı switch, 1-10 ms = aynı DC, 10-50 ms = metropol, 50-150 ms = kıtalararası.

5. Alıcının buffer'ının tamamen dolduğunu ve daha fazla veri alamayacağını gösterir. Flow control mekanizması devrededir.

6. Evet. Her satıra ayrı bir display filter yazılabilir. Bu sayede farklı protokollerin veya trafik türlerinin dağılımı aynı grafikte karşılaştırılabilir.

7. Time-Sequence Graph'da Slow Start exponential büyüme olarak görünür (eğri artan çizgi). Throughput Graph'da da exponential artış görülür.

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
