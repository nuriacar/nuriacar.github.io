---
layout: post
title:  "shark-tank - m09: TCP Dizi Analizi"
date:   2026-07-26 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 09: TCP Dizi Analizi

**Neden?** TCP bağlantıları sürekli kopuyor. Kullanıcı dosya indiremiyor. Retransmission yağmuru var. Sequence prediction ile saldırgan TCP bağlantısına enjekte yapabilir (blind TCP injection). Retransmission, duplicate ACK, out-of-order paketler ağ sorunlarını ve bazen saldırı girişimlerini (ACK flood) gösterir. Bu modülde, TCP sequence analizi ile ağ sorunlarını ve saldırıları teşhis etmeyi öğreneceksin.

**Görev:** TCP analiz araçlarıyla bağlantı sorunlarını tespit et.

**Öğrenim Hedefleri:**
- Retransmission, Duplicate ACK ve Out-of-Order paketlerini tanımak
- TCP sequence/acknowledgment numaralarını takip ederek kayıp tespiti yapabilmek
- Zero Window ve Window Full olaylarını anlamak
- SACK (Selective Acknowledgment) mekanizmasını kavramak
- Wireshark TCP Analysis flag'lerini (açık kırmızı arka planlı satırlar) yorumlayabilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **TCP** | Transmission Control Protocol: İnternetin güvenilir ve sıralı veri iletimini sağlayan protokol. Veriyi göndermeden önce alıcıyla bağlantı kurar (3-way handshake), gönderdiği her paket için onay (ACK) bekler ve onay gelmeyen paketleri yeniden gönderir (retransmission). Bu mekanizmalar sayesinde veri kaybı olmadan ve gönderim sırasında bozulmadan teslim edilir. Web (HTTP), email (SMTP), dosya transferi (FTP) gibi kritik işlemlerin tamamı TCP üzerinden çalışır. Bağlantı kurma ve onay bekleme yükü nedeniyle UDP'den yavaştır, ama güvenilirlik gerektiğinde tek seçenektir. |
| **retransmission** | TCP'de onay (ACK) gelmeyen bir paketin kaynak tarafından yeniden gönderilmesi. TCP güvenilir bir protokoldür: Her gönderdiği paket için bir zamanlayıcı (timer) başlatır ve belirli süre içinde ACK gelmezse paketi tekrar gönderir. Wireshark varsayılan renk kurallarında retransmission içeren paketler "Bad TCP" kuralıyla açık kırmızı arka planla işaretlenir. Çok sayıda retransmission, ağ tıkanıklığı, kablosuz sinyal sorunu veya kasıtlı saldırı (ACK flood) gösterebilir. |
| **sequence number** | TCP header'ındaki, gönderilen verinin sırasını takip eden 32 bitlik numara. Her byte'ın TCP akışında bir sıra numarası vardır; sequence number, bir paketin taşıdığı ilk byte'ın sırasını belirtir. Alıcı bu numaraya bakarak verinin doğru sırada gelip gelmediğini ve eksik byte olup olmadığını anlar. Bağlantı kurulurken her taraf rastgele bir başlangıç sequence number (ISN) seçer; Wireshark bunları 0'dan başlayacak şekilde göreceli (relative) olarak gösterir, bu da analizi kolaylaştırır. |
| **duplicate ACK** | Alıcının beklediği sequence number yerine daha yüksek bir sequence number içeren paket aldığında gönderdiği tekrar onayı. Örneğin alıcı Seq=1 beklerken Seq=1001 gelirse, Seq=1 için tekrar ACK gönderir: Bu "duplicate ACK" (tekerrür eden onay) olarak adlandırılır. Alıcı her sıra dışı pakette aynı ACK numarasını tekrarladığı için birden fazla duplicate ACK oluşur. 3 ardışık duplicate ACK, göndericiye "bir paket kayboldu" sinyali verir ve Fast Retransmission mekanizmasını tetikler: Gönderici zaman aşımını beklemeden kayıp paketi hemen yeniden gönderir. |
| **out-of-order** | TCP paketlerinin gönderildiği sıradan farklı bir sırayla alıcıya ulaşması. Ağda paketler farklı yollardan geçebileceği için, daha sonra gönderilen bir paket daha önce gönderilen bir paketten önce ulaşabilir. Alıcı bunu sequence number'a bakarak tespit eder ve duplicate ACK göndererek göndericiye eksik paket olduğunu bildirir. Wireshark bu paketleri "Out-of-Order" analiz flag'iyle işaretler. Tek tek out-of-order paketler normaldir, ancak çok fazla görülmesi ağ yol değişikliği veya kararsız bağlantı sorununa işaret edebilir. |
| **zero window** | TCP akış kontrolünde alıcının pencere boyutunu sıfır (0) olarak bildirmesi. TCP'de alıcı, kabul edebileceği veri miktarını "window size" alanında bildirir. Bu değer sıfır olduğunda alıcı şunu söyler: "Buffer'ım tamamen dolu, şu anda daha fazla veri alamam." Gönderici bu durumda veri göndermeyi durdurur ve periyodik olarak "Zero Window Probe" paketleri göndererek alıcının hazır olup olmadığını kontrol eder. Uzamış zero window durumları yavaş bir alıcı uygulaması, yetersiz buffer veya kaynak tüketimi saldırısını gösterebilir. |
| **SACK** | Selective Acknowledgment: Alıcının, boşluklar olsa bile aldığı veri aralıklarını seçici olarak bildirmesini sağlayan TCP seçeneği. Normal ACK sadece "bir sonraki beklenen byte" numarasını söyler; ama arada kayıp paket varsa, kayıp sonrası alınan paketler için SACK kullanılır. Örneğin Seq=1 kayıp, Seq=1001 ve Seq=2001 alındıysa, alıcı "ACK=1, SACK=1001-3001" gönderir. Böylece gönderici sadece Seq=1'i yeniden gönderir, 1001'den itibaren her şeyi değil. SACK, TCP handshake sırasında müzakere edilir ve modern TCP yığınlarının tamamı tarafından desteklenir. |
| **throughput** | Bir ağ bağlantısında saniyede taşınan veri miktarı (byte/saniye veya bit/saniye). Throughput, bağlantının verimini ölçer: Yüksek throughput hızlı veri transferini, düşük throughput darboğaz veya sorun olduğunu gösterir. Wireshark'ta Statistics → TCP Stream Graphs → Throughput grafiği, bir TCP bağlantısındaki veri aktarım hızını zaman içinde gösterir. Grafikteki ani düşüşler ağ tıkanıklığı, paket kaybı veya retransmission göstergesidir. Throughput ile bandwidth (bant genişliği) farklıdır: Bandwidth ağ kapasitesidir, throughput ise bu kapasitenin ne kadarının fiilen kullanıldığıdır. |
| **Expert Information** | Wireshark'ın pcap içindeki anormallikleri ve sorunları otomatik olarak tespit edip listelediği panel. `View > Expert Information` (Ctrl+Alt+Shift+E) menüsünden açılır. Sorunları dört ciddiyet seviyesinde gruplar: Error (kırmızı), Warn (sarı), Note (mavi), Chat (yeşil). Bir analist pcap'i açtığında ilk bakması gereken yerlerden biridir; çünkü retransmission, duplicate ACK, zero window, HTTP 404 gibi sorunları paket tek tek aranmadan özet olarak gösterir. |

## Teori

TCP güvenilir iletim sağlamak için sequence number ve acknowledgment number kullanır. Wireshark'ın TCP analiz araçları, bu numaraları takip ederek bağlantı sorunlarını otomatik tespit eder.

### TCP Analysis Flags:

| Flag | Anlamı | Sebep |
|------|--------|-------|
| **Retransmission** | Paket yeniden gönderildi | ACK zamanında gelmedi |
| **Duplicate ACK** | Aynı ACK tekrarlandı | Sıra dışı paket algılandı |
| **Out-of-Order** | Sıra dışı paket | Gecikme veya yol değişikliği |
| **Zero Window** | Alıcı buffer'ı dolu | Alıcı işlem yapamıyor |
| **Window Full** | Gönderici pencereyi doldurdu | Akış kontrolü aktif |
| **Fast Retransmission** | 3x Dup ACK sonrası hızlı yeniden iletim | Hızlı kurtarma |

### Retransmission Tipleri:

| Tip | Açıklama | Wireshark Gösterimi |
|-----|----------|---------------------|
| **Retransmission** | Zaman aşımı sonrası yeniden gönderme | Açık kırmızı arka plan (Bad TCP) |
| **Fast Retransmission** | 3 Dup ACK sonrası erken yeniden gönderme | Açık kırmızı arka plan (Bad TCP) |
| **Spurious Retransmission** | Gereksiz yeniden iletim (ACK gecikti) | Açık kırmızı arka plan (Bad TCP) |
| **Tail Loss Probe** | Bağlantı sonunda kayıp tespiti (TCP yığını mekanizması) | Ayrı işaret yok; normal Retransmission olarak görünür |

---

## Hazırlık

```sh
./scripts/generate-traffic.sh tcp-sequence
# Kullanılacak pcap: module-09-tcp-sequence.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

---

## Alıştırma 1: TCP Retransmission Analizi

### Filtre:
```text
tcp.analysis.retransmission
```

Retransmission, bir paket karşı tarafa ulaşmadığında veya ACK zamanında gelmediğinde oluşur.

### Adımlar:
1. `module-09-tcp-sequence.pcap`'i aç
2. Filtre: `tcp.analysis.retransmission`
3. Retransmission varsa incele:
   - Hangi paket yeniden gönderilmiş?
   - Kaç milisaniye sonra yeniden gönderilmiş? (Time delta)
   - Orijinal paket ile retransmission arasındaki fark nedir?
4. Statistics → TCP Stream Graphs → Time-Sequence (tcptrace)
   - Retransmission'da sequence number geri sıçrar
   - Grafikteki "düşüşleri" tespit et

### Retransmission Sebepleri:

| Sebep | Açıklama |
|-------|----------|
| Ağ tıkanıklığı | Paket düşürüldü |
| Yüksek gecikme | ACK zamanında ulaşmadı |
| Hatalı donanım | Fiziksel katman sorunu |
| Firewall/drop | Güvenlik duvarı paketi düşürdü |
| Port scan | SYN flood savunması |

> **SINAV İPUCU:** Retransmission varsa, ağda bir sorun var demektir. Wireshark "Bad TCP" kuralıyla açık kırmızı arka planda gösterir.
>
> Time-Sequence grafiğinde seq no geri sıçrar.

> **İstihbarat İşaretleri, Retransmission analizi:**
>
> - Tek bir retransmission = geçici ağ sorunu
> - Sürekli retransmission = ağ tıkanıklığı veya SYN flood
> - Belirli bir IP'ye yoğun retransmission = hedef sistem çökebilir

---

## Alıştırma 2: Duplicate ACK ve Out-of-Order

### Filtre:
```text
tcp.analysis.duplicate_ack
```

Duplicate ACK, alıcının beklediği sırada olmayan bir segment aldığında gönderilir.

### Akış:
```text
Gönderici:   Seq=1 (10 byte)   Seq=11 (10 byte)   Seq=21 (10 byte)
Alıcı:       ACK=11            ACK=11              ACK=11 (3x Dup ACK)
```

### Filtre:
```text
tcp.analysis.out_of_order
```

Out-of-Order, paketler yanlış sırada geldiğinde oluşur.

### Adımlar:
1. Filtre: `tcp.analysis.duplicate_ack`
   - Not: Bu pcap'te tek bir duplicate ACK vardır; fast retransmission tetiklenmemiştir. 3x kuralını teorik olarak değerlendir
2. Kaç tane duplicate ACK var?
3. Hangi TCP stream'de?
4. Out-of-Order paket var mı?
5. Aynı stream'de mi yoksa farklı stream'lerde mi?

> **SINAV İPUÇLARI:**
>
> - **3x Duplicate ACK = Fast Retransmission tetiklenir**
> - Out-of-Order genellikle farklı yollar üzerinden gelen paketlerden kaynaklanır
> - Tek Dup ACK sorun değildir, birçok Dup ACK sorundur

---

## Alıştırma 3: Zero Window ve Flow Control

### Filtre:
```text
tcp.analysis.zero_window
```

Zero Window, alıcının buffer'ının dolduğunu ve daha fazla veri alamayacağını belirtir.

### Window Scaling:
```text
tcp.analysis.window_full
```

TCP receive window boyutu, alıcının ne kadar veri alabileceğini belirtir.

### Adımlar:
1. Filtre: `tcp.analysis.zero_window`
2. Zero window varsa:
   - Hangi tarafta? (istemci mi sunucu mu?)
   - Ne kadar sürdü? (Zero Window Probe)
3. Statistics → TCP Stream Graphs → Window Scaling
   - Window boyutunun zaman içindeki değişimi
   - Sıfıra düşüş akış kontrol sorununu gösterir

### Zero Window Nedenleri:

| Neden | Açıklama |
|-------|----------|
| Yavaş alıcı | Uygulama veriyi işleyemiyor |
| Buffer limiti | Alıcı buffer dolu |
| Kötü niyet | Zero window saldırısı |
| Resource exhaustion | Hedef sistem kaynakları tükendi |

> **SINAV İPUÇLARI:**
>
> - **Zero Window = alıcı buffer dolu, daha fazla veri alamaz**
> - **Window Full = gönderici pencere limitine ulaştı**
> - Zero Window Probe ile gönderici periyodik olarak kontrol eder
> - Window Scaling grafiği akış kontrolünü görselleştirir

> **İstihbarat İşaretleri, Zero Window kötüye kullanılabilir:**
>
> - Zero window saldırısı: Alıcı sürekli sıfır gönderir, bağlantıyı açar
> - Resource exhaustion tespiti
> - Slowloris benzeri saldırıları tespit

### Akış Kontrolü mü, Tıkanıklık Kontrolü mü?

Zero window gördüğünde sorulacak ilk soru: **Suçlu alıcı mı, ağ mı?**
Bu iki mekanizma sık karıştırılır ama sorumluları farklıdır:

| Mekanizma | Karar Veren | Sinyal | Yorum |
|-----------|-------------|--------|-------|
| **Flow control** (akış kontrolü) | ALICI, kendi buffer'ına bakar | `tcp.window_size == 0`, zero window | Alıcı uygulamayı kastediyor: "Yavaş işliyorum" |
| **Congestion control** (tıkanıklık kontrolü) | GÖNDERİCİ, ağı tahmin eder | Retransmission'lar, pencerenin kendiliğinden küçülmesi | Ağı kastediyor: "Paket kaybediyorum, yavaşlayayım" |

Pratik ayrım: Zero window var ama retransmission yoksa sorun **alıcıda**.
Hem retransmission hem daralan pencere varsa sorun **ağda** (lossy link).
Tıkanıklık kontrolünün ayrıntıları — slow start, fast retransmit/recovery —
Modül 11'de derinlemesine işlenecek; burada yalnızca hangi tarafın
"yavaşlayın" dediğini ayırt etmen yeterli.

---

## Alıştırma 4: TCP Stream Graphs

Wireshark'ın TCP Stream Graph'ları, TCP bağlantılarının performansını görselleştirir.

### Time-Sequence (tcptrace):
**Statistics → TCP Stream Graphs → Time-Sequence (tcptrace)**

- X ekseni: Zaman
- Y ekseni: Sequence number
- Düz çizgi: Normal akış
- Geri sıçrama: Retransmission
- Yatay düz: Duraklama

### Throughput:
**Statistics → TCP Stream Graphs → Throughput**

- X ekseni: Zaman
- Y ekseni: Byte/saniye
- Darboğaz tespiti
- Ani düşüşler = sorun

### Round Trip Time:
**Statistics → TCP Stream Graphs → Round Trip Time**

- X ekseni: Zaman
- Y ekseni: RTT (ms)
- Yüksek RTT = gecikme sorunu
- Değişken RTT = ağ dengesizliği

### Window Scaling:
**Statistics → TCP Stream Graphs → Window Scaling**

- X ekseni: Zaman
- Y ekseni: Window size
- Sıfıra düşüş = akış kontrol problemi

### Adımlar:
1. İlk TCP akışını seç: Filtre `tcp.stream == 0`
2. Her grafik tipini sırayla aç:
   - **Time-Sequence**: Seq numarasının ilerleyişi
   - **Throughput**: Transfer hızı
   - **Round Trip Time**: Gecikme
   - **Window Scaling**: Pencere boyutu
3. Hangi stream'de sorun var? Grafiklerden tespit et
4. Her grafik tipinde ne tür bilgiler çıkarılabilir?

> **SINAV İPUÇLARI:**
>
> - **Time-Sequence**: Seq no geri sıçrarsa = retransmission
> - **Throughput**: Ani düşüş = ağ sorunu
> - **RTT**: Yüksek değer = gecikme
> - **Window Scaling**: Sıfır = alıcı buffer dolu
> - Sınavda hangi grafiğin hangi sorunu tespit ettiği sorulur

---

## Alıştırma 5: Expert Information

**View → Expert Information** (Ctrl+Alt+Shift+E)

Expert System, Wireshark'ın TCP analizini otomatik yapan aracıdır.

### Severity Seviyeleri (TCP için):

| Seviye | TCP Anlamı |
|--------|------------|
| **Error** | Bad checksum, Malformed packet |
| **Warn** | Out-of-Order, Previous segment lost, Zero Window, Connection reset |
| **Note** | Retransmission, Duplicate ACK, Fast Retransmission, Window Update |
| **Chat** | TCP SYN/FIN, Connection established |

### Adımlar:
1. **View → Expert Information** (Ctrl+Alt+Shift+E)
2. **Group by Severity**: Error/Warn/Note/Chat
3. TCP ile ilgili expert olayları:
   - TCP Retransmission (Note)
   - TCP Duplicate ACK (Note)
   - TCP Out-of-Order (Warn)
   - TCP Zero Window (Warn)
   - TCP Window Update (Note)

4. Bir Note veya Warn satırına tıkla → ilgili pakete git
5. **Copy → All Visible → CSV** ile export

> **SINAV İPUCU:** Expert Information, TCP analizine başlarken ilk açılması gereken araçtır.
>
> Error/Warn seviyeleri öncelikli incelenir.

---

## Alıştırma 6: SACK (Selective Acknowledgment)

TCP SACK, kayıp paketlerin seçici olarak onaylanmasını sağlar.

### Filtre:
```text
tcp.options.sack
```

### SACK Çalışma Prensibi:
```text
Gönderici: Seq=1, Seq=1001, Seq=2001 (3 paket)
Alıcı:     Seq=1001 geldi, Seq=1 gelmedi
           ACK=1, SACK=1001-2001 (1001-2001 alındı, 1 gelmedi)
Gönderici: Sadece Seq=1'i yeniden gönderir
```

### Adımlar:
1. Filtre: `tcp.options.sack`
2. SACK kullanılan stream'leri bul
3. Hangi segmentler SACK ile onaylanmış?
4. SACK olmasaydı ne olurdu? (Gönderici tümünü yeniden gönderirdi)

> **SINAV İPUÇLARI:**
>
> - SACK, TCP performansını artırır (sadece kayıp paket yeniden gönderilir)
> - SACK olmadan gönderici bilinmeyen tüm paketleri yeniden gönderir
> - SACK seçeneği TCP handshake'de müzakere edilir

---

## Hızlı Referans - TCP Analiz Filtreleri

| Filtre | Anlamı |
|--------|--------|
| `tcp.analysis.retransmission` | TCP yeniden iletim |
| `tcp.analysis.fast_retransmission` | Hızlı yeniden iletim |
| `tcp.analysis.duplicate_ack` | Duplicate ACK |
| `tcp.analysis.out_of_order` | Sıra dışı paket |
| `tcp.analysis.zero_window` | Alıcı buffer dolu |
| `tcp.analysis.window_full` | Gönderici pencere limiti |
| `tcp.analysis.lost_segment` | Kayıp segment |
| `tcp.analysis.ack_lost_segment` | Kayıp segment için ACK |
| `tcp.analysis.flags` | Tüm TCP analiz flag'leri |
| `tcp.options.sack` | SACK seçeneği |

### Analiz Stream Graph'ları:

| Grafik | Amaç |
|--------|------|
| Time-Sequence (tcptrace) | Retransmission tespiti |
| Throughput | Bant genişliği ölçümü |
| Round Trip Time | Gecikme analizi |
| Window Scaling | Akış kontrol sorunları |

> **SINAV İPUCU:** `tcp.analysis.flags` tüm TCP sorunlarını tek seferde gösterir.
>
> Herhangi bir analiz flag'i set olan tüm paketleri listeler.

---

## Sınav Soruları (Çöz)

`module-09-tcp-sequence.pcap` dosyasını kullanarak cevapla:

1. TCP Retransmission ile Fast Retransmission arasındaki fark nedir?
2. Duplicate ACK ne zaman oluşur? Kaç tane dup ACK fast retransmission'ı tetikler?
3. Zero Window ne anlama gelir? Hangi taraf bunu gönderir?
4. Time-Sequence Graph'da seq numarasının geri sıçraması neyi gösterir?
5. SACK ne işe yarar? SACK olmazsa ne olur?
6. TCP Throughput Graph'da ani düşüş neyi gösterir?
7. Expert Information'da TCP ile ilgili kaç farklı severity seviyesi görürsün?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. Retransmission = timeout sonrası yeniden gönderme (RTO). Fast Retransmission = 3x Duplicate ACK sonrası timeout beklemeden hemen yeniden gönderme. Fast Retransmission daha hızlıdır.

2. Alıcı sıra dışı paket aldığında oluşur. Gönderici beklediği seq no yerine farklı bir seq no alınca, bildiği son seq no'yu tekrar gönderir. 3 adet dup ACK, fast retransmission'ı tetikler.

3. Alıcının buffer'ının tamamen dolduğu anlamına gelir. Alıcı taraf gönderir. Alıcı uygulama veriyi işleyene kadar daha fazla veri alınamaz.

4. Retransmission'ı gösterir. Seq no geri sıçradığında, o paket daha önce gönderilmiş ve şimdi yeniden gönderiliyor demektir.

5. SACK (Selective Acknowledgment), alıcının hangi segmentleri aldığını seçici olarak bildirmesini sağlar. SACK olmazsa, gönderici kayıp paketten sonraki tüm paketleri yeniden göndermek zorunda kalır. SACK ile sadece kayıp paket yeniden gönderilir, performans artar.

6. Ani düşüş ağ tıkanıklığı, paket kaybı veya retransmission olduğunu gösterir. Throughput grafiği darboğaz tespiti için en kullanışlı araçtır.

7. 4 seviye: Error (bad checksum), Warn (out-of-order, previous segment lost, zero window, connection reset), Note (retransmission, duplicate ACK, fast retransmission, window update), Chat (SYN, FIN, RST).

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
