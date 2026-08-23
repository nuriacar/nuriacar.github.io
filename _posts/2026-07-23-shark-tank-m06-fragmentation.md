---
layout: post
title:  "shark-tank - m06: IP Fragmentation Analizi"
date:   2026-07-23 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 06: IP Fragmentation Analizi

**Neden?** IDS/IPS saldırı tespit etmiyor ama sistemler çöküyor. Saldırgan IDS'yi atlatmak için paketleri parçalıyor. Fragmentation overlap (teardrop attack) ile paketleri yeniden birleştirme sırasında sistem çöker. Parçalanmış paketler içinde kötü amaçlı yük gizlenebilir (fragmentation evasion). Nmap'in `-f` bayrağı tam da bunun içindir. Bu modülde, parçalanmış paketleri yeniden birleştirip saldırıyı görmeyi öğreneceksin.

**Görev:** IP fragmentation'ı analiz et. Fragment offset, MF flag ve reassembly sürecini anla.

**Öğrenim Hedefleri:**
- Fragment offset, MF (More Fragments) ve DF (Don't Fragment) flag'lerini okuyabilmek
- IP parçalama ve yeniden birleştirme (reassembly) sürecini anlamak
- Path MTU Discovery (PMTUD) kavramını kavramak
- Fragmentation evasion saldırılarını (teardrop, overlap) tespit edebilmek
- IPv6'da fragmentation'ın IPv4'ten farkını bilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **fragmentation** | Bir IP paketinin, ağın taşıyabileceği maksimum boyutu (MTU) aştığında daha küçük parçalara (fragment) bölünmesi. Örneğin 3000 byte'lık bir paket, MTU'su 1500 byte olan Ethernet ağında 3 parçaya ayrılır. Her parça kendi IP header'ını taşır ve ayrı ayrı iletilir. Parçalama, IPv4'te hem kaynak cihaz hem de router'lar tarafından yapılabilir; IPv6'da ise sadece kaynak cihaz yapar. Saldırganlar parçalanmış paketleri IDS/IPS sistemlerini atlatmak için kullanabilir (fragmentation evasion). |
| **MTU** | Maximum Transmission Unit: Bir ağ arayüzünün tek bir çerçevede (frame) taşıyabileceği maksimum veri boyutu. Standart Ethernet'te MTU 1500 byte'tır (IP header dahil). Bir paketin boyutu MTU'yu aşarsa, ya parçalanır (fragmentation) ya da iletilmez (eğer DF flag setliyse). MTU değeri ağ teknolojisine göre değişir: PPPoE'de 1492, VPN tünellerinde daha düşüktür. Jumbo frame desteği olan ağlarda 9000 byte'a kadar çıkabilir. |
| **fragment offset** | Bir fragment'ın orijinal paket içindeki konumunu belirten değer. 13 bit uzunluğundadır ve 8 byte biriminde hesaplanır: Yani offset değeri 185, 185 × 8 = 1480. byte'tan başladığı anlamına gelir. İlk fragment'ın offset'i her zaman 0'dır. Hedef cihaz bu değeri kullanarak parçaları doğru sırayla birleştirir (reassembly). Offset değerlerinin çakışması (overlap) saldırı göstergesidir. |
| **MF (More Fragments)** | IP header'ındaki 1 bitlik flag: "daha fazla fragment var" anlamına gelir. MF = 1 olan paketten sonra aynı Identification değerine sahip en az bir fragment daha gelir. MF = 0 ise ya son fragment'tır ya da paket hiç parçalanmamıştır. Wireshark'ta `ip.flags.mf == 1` filtresiyle tüm ara fragment'lar görülebilir. |
| **DF (Don't Fragment)** | IP header'ındaki 1 bitlik flag: "bu paketi parçalama" talimatı. DF = 1 olan bir paket MTU'yu aşıyorsa, router paketi iletmez ve kaynağa ICMP Destination Unreachable / Fragmentation Needed (Type 3, Code 4) mesajı gönderir. TCP trafiğinde genellikle DF flag setlidir çünkü TCP kendi segment boyutunu (MSS) PMTUD ile ayarlar. `ping -M do` parametresi DF setli ping gönderir. |
| **reassembly** | Parçalanmış fragment'ların hedef cihazda orijinal pakete geri birleştirilmesi. Reassembly sadece hedef cihazda yapılır: Router'lar fragment'ları olduğu gibi iletir. Hedef cihaz, aynı Identification değerine sahip tüm fragment'ları toplar, offset değerlerine göre sıralar ve birleştirir. Wireshark bu işlemi otomatik yapar ve "Reassembled" başlığı altında orijinal paketin tamamını gösterir. Belirli süre içinde tüm fragment'lar gelmezse (reassembly timeout: Linux 30s, Windows 60s) fragment'lar silinir. |
| **PMTUD** | Path MTU Discovery: Kaynaktan hedefe kadar olan yoldaki en küçük MTU değerini bulma mekanizması. Kaynak cihaz, DF flag setli olarak büyük paketler gönderir; yoldaki bir router'ın MTU'su küçükse paketi düşürür ve ICMP Fragmentation Needed (Type 3, Code 4) mesajıyla MTU değerini bildirir. Kaynak bu değere göre segment boyutunu küçültür ve iletim devam eder. Eğer güvenlik duvarı ICMP mesajını engellerse PMTUD çalışmaz ve bağlantı "black hole" olur: Paket gönderilir ama hedefe ulaşmaz. |
| **Identification** | IP header'ındaki 16 bitlik (IPv6'da 32 bit) alan: Aynı orijinal paketten gelen tüm fragment'ları gruplandırmak için kullanılır. Bir paket parçalandığında, tüm fragment'lar aynı Identification değerini taşır. Hedef cihaz bu değere bakarak hangi fragment'ların birlikte birleştirilmesi gerektiğini belirler. Wireshark'ta `ip.id` filtresiyle belirli bir fragment grubu izlenebilir. |
| **ICMP** | Internet Control Message Protocol: Ağ tanılama ve hata bildirimi için kullanılan protokol. Port kullanmaz; Layer 3'te (IP katmanı) doğrudan çalışır, bu yüzden "Layer 3.5" olarak da adlandırılır. En bilinen kullanımı ping komutudur: Bir cihaza "orada mısın?" diye sorar (Echo Request), karşı taraf "evet, buradayım" diye yanıtlar (Echo Reply). traceroute aracı da ICMP kullanarak bir paketin geçtiği router'ları adım adım tespit eder. Güvenlik duvarları ICMP trafiğine genellikle izin verir; bu yüzden saldırganlar ICMP paketlerinin içine veri gizleyerek güvenlik duvarını aşabilir (ICMP tunneling). |

## Teori

IP fragmentation, bir IP paketinin MTU'dan (Maximum Transmission Unit) büyük olması durumunda daha küçük parçalara bölünmesidir.

- **Neden fragmentation?** Paket boyutu MTU'yu aştığında
- **Ethernet MTU:** 1500 byte
- **Fragmentation alanları (IPv4 header):** Identification, Flags (MF, DF), Fragment Offset
- **Reassembly:** Sadece hedefte yapılır, router'larda yapılmaz
- **Path MTU Discovery (PMTUD):** DF flag + ICMP Fragmentation Needed ile optimum MTU bulma
- **IPv6:** Fragmentation sadece extension header ile, router fragmentation yok

### Fragmentation Alanları:

| Alan | Boyut | Açıklama |
|------|-------|----------|
| **Identification** | 16 bit | Fragment grup ID (aynı paketin tüm fragment'ları aynı değere sahip) |
| **MF (More Fragments)** | 1 bit | 1 = daha fragment var, 0 = son fragment veya fragment değil |
| **DF (Don't Fragment)** | 1 bit | 1 = fragment etme (PMTUD için kullanılır) |
| **Fragment Offset** | 13 bit | 8 byte biriminde offset (ilk fragment = 0) |

### Fragmentation Nasıl Çalışır:

```text
ORİJİNAL PAKET (3000 byte ping verisi + 8 byte ICMP header = 3008 byte IP verisi)
MTU = 1500 byte → 3 fragment'e bölünür

Fragment 1: IP header (20) + data (1480) = 1500 byte
  Identification: 0x1234
  MF = 1 (daha var)
  Offset = 0

Fragment 2: IP header (20) + data (1480) = 1500 byte
  Identification: 0x1234
  MF = 1 (daha var)
  Offset = 185 (185 × 8 = 1480)

Fragment 3: IP header (20) + data (48) = 68 byte
  Identification: 0x1234
  MF = 0 (son fragment)
  Offset = 370 (370 × 8 = 2960)
```

### IPv4 Flags Byte Yapısı:

```text
  Bit 0: Reserved (her zaman 0)
  Bit 1: DF (Don't Fragment)
  Bit 2: MF (More Fragments)

  Örnek: 0x01 = 0000 0001 = MF set (daha fragment var)
         0x02 = 0000 0010 = DF set (fragment etme)
         0x04 = 0000 0100 = reserved
         0x00 = 0000 0000 = son fragment veya fragment değil
```

### Path MTU Discovery (PMTUD):

```text
GÖNDEREN                                     ALICI
  |--- IP paketi (DF=1, 2000 byte) --------->|
  |                                          |
  |             Router (MTU=1500)            |
  |             DF set, fragment edemez!     |
  |                                          |
  |<-- ICMP Fragmentation Needed ------------|  (Type 3, Code 4)
  |    "MTU = 1500"                          |
  |                                          |
  |--- IP paketi (DF=1, 1500 byte) --------->|  (başarılı)
```

### IPv4 vs IPv6 Fragmentation:

| Özellik | IPv4 | IPv6 |
|---------|------|------|
| **Konum** | Ana header'da (Flags + Offset) | Fragment Extension Header'da |
| **Router fragmentation** | Router'lar fragment yapabilir | Sadece kaynak cihaz fragment eder |
| **DF flag** | Var | Yok (zaten sadece kaynak yapar) |
| **Identification** | 16 bit | 32 bit |
| **Minimum MTU** | 68 byte | 1280 byte |

> **İstihbarat İşaretleri, Fragmentation saldırıları:**
>
> - **Tiny fragment attack:** TCP header'ı iki fragment'a bölme. İlk fragment sadece SYN içerir, ikinci fragment kaynak/hedef port taşır. Firewall ilk fragment'a bakar ve kuralları uygulayamaz
> - **Overlap attack:** Fragment'lar çakışıyor. Hedef sistem ve IDS farklı reassembly yapar. IDS yanlış içerik görür
> - **Fragment flood:** Hedef sistemde reassembly buffer tükenmesi. Fragment'lar gönderilir ama son fragment hiç gelmez. Buffer dolarak DoS oluşur
> - **Path MTU Discovery saldırısı:** ICMP "Fragmentation Needed" mesajları engellenirse PMTUD çalışmaz, bağlantı kopar

## Hazırlık

```sh
# Fragmentation trafik oluştur:
./scripts/generate-traffic.sh fragmentation

# PCAP'i Wireshark ile aç:
# macOS: open -a Wireshark module-06-fragmentation.pcap
# Linux: wireshark module-06-fragmentation.pcap &
# Windows: start wireshark module-06-fragmentation.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

### Fragmentation Trafik Üret:

```sh
# Normal ping (fragment yok, 64 byte data):
docker exec shark-tank-client ping -c 3 172.50.2.14

# Büyük ping (MTU'yu aşar, fragment oluşur):
docker exec shark-tank-client ping -c 3 -s 3000 172.50.2.14

# Daha büyük ping:
docker exec shark-tank-client ping -c 3 -s 6000 172.50.2.14

# DF set ile ping (fragment etme, PMTUD testi):
docker exec shark-tank-client ping -c 3 -s 3000 -M do 172.50.2.14
```

## Alıştırmalar

### Alıştırma 1: Büyük Ping ile Fragmentation

### Filtre:
```text
ip.flags.mf == 1 || ip.frag_offset > 0
```

### Adımlar:
1. Wireshark'ta capture'ı aç ve yukarıdaki filtreyi uygula
2. `ping -s 3000` ile oluşturulan fragment paketlerini göreceksin
3. İlk fragment paketine tıkla ve **Internet Protocol** katmanını genişlet:

```text
 v Internet Protocol
     Version: 4
     Header Length: 20 bytes
     Total Length: 1500                        <-- MTU sınırında
     Identification: 0x1234                    <-- Fragment grup ID
     Flags: 0x01 (More Fragments)              <-- MF = 1
         0... .... = Reserved: Not set
         .0.. .... = Don't Fragment: Not set
         ..1. .... = More Fragments: Set       <-- Daha fragment var!
     Fragment Offset: 0                        <-- İlk fragment
     Time to Live: 64
     Protocol: ICMP (1)
```

4. İkinci fragment'i bul:

```text
 v Internet Protocol
     Identification: 0x1234                    <-- AYNI ID
     Flags: 0x01 (More Fragments)              <-- MF = 1 (daha var)
     Fragment Offset: 185                      <-- 185x8=1480 offset
     Protocol: ICMP (1)
```

5. Son fragment'i bul:

```text
 v Internet Protocol
     Identification: 0x1234                    <-- AYNI ID
     Flags: 0x00                               <-- MF=0 (son fragment!)
     Fragment Offset: 370                      <-- 370x8=2960 offset
     Protocol: ICMP (1)
     Total Length: 68                          <-- 20 hdr + 48 data
```

6. Kaç fragment var? 3000 byte data + 8 byte ICMP header = 3008 byte payload. 3008 / 1480 = 2.03 → 3 fragment

> **SINAV İPUCU:** Fragment sayısı hesaplama: `(toplam_data) / (MTU - IP_header)`. Kalan olursa +1 fragment.
>
> MTU 1500, IP header 20 byte = 1480 byte data per fragment.

### Alıştırma 2: Fragment Offset Analizi

### Filtre:
```text
ip.flags.mf == 1 || ip.frag_offset > 0
```

### Her Fragment'ın Offset Hesaplaması:

`ping -s 3000` için (3000 byte data + 8 byte ICMP header = 3008 byte toplam ICMP):

| Fragment | Data Boyutu | Offset Değeri | Offset (byte) | MF |
|----------|-------------|---------------|---------------|-----|
| 1 | 1480 byte | 0 | 0 | 1 |
| 2 | 1480 byte | 185 | 1480 | 1 |
| 3 | 48 byte | 370 | 2960 | 0 |

**Doğrulama:** 1480 + 1480 + 48 = 3008 byte (toplam ICMP data)

### Offset Hesaplama Formülü:

```text
Offset = (önceki_fragment_data_toplamı) / 8

Fragment 1: offset = 0 / 8 = 0
Fragment 2: offset = 1480 / 8 = 185
Fragment 3: offset = (1480 + 1480) / 8 = 2960 / 8 = 370
```

### Adımlar:
1. Tüm fragment paketlerini listele
2. Her birinin Identification değerinin aynı olduğunu teyit et
3. Offset değerlerini not et ve yukarıdaki tablo ile karşılaştır
4. MF flag'lerini kontrol et: Son fragment'ta MF = 0

> **SINAV İPUCU:** Fragment offset her zaman 8 byte birimindedir.
>
> Bu, offset alanının 13 bit olmasına rağmen 65536 byte'a kadar adresleme yapabilmesini sağlar (8191 × 8 = 65528 byte). Sınavda "offset değeri nedir?" ve "kaçıncı byte'tan başlıyor?" sorulur.

### Alıştırma 3: Reassembly in Wireshark

Wireshark fragment'ları otomatik olarak birleştirir ve orijinal paketi gösterir.

### Filtre:
```text
ip.reassembled.length
```

### Adımlar:
1. Fragment filtresini uygula: `ip.flags.mf == 1 || ip.frag_offset > 0`
2. İlk fragment'e tıkla (offset = 0)
3. Packet details'da **[Reassembled IPv6]** veya **IPv4 Reassembly** başlığını bul:

```text
 v [Reassembled ICMP]
     Frame 1: 1500 bytes                       <-- Fragment 1
     Frame 2: 1500 bytes                       <-- Fragment 2
     Frame 3: 68 bytes                         <-- Fragment 3
     Reassembled length: 3008                  <-- Orijinal ICMP boyutu
```

4. Son fragment'e (MF = 0) tıkla. Bu pakette reassembly tamamlanmıştır:

```text
 v Internet Protocol
     [3 IPv4 Fragments (3008 bytes): #1(1480), #2(1480), #3(48)]
```

5. Wireshark'ın reassembly'i göstermesi için:
   - **Edit > Preferences > Protocols > IPv4**
   - **Reassemble fragmented IPv4 datagrams** seçili olmalı

### Reassembly Zaman Aşımı:
- Linux: 30 saniye (varsayılan)
- Windows: 60 saniye
- Süre dolarsa fragment'lar silinir ve ICMP Time Exceeded (Type 11, Code 1) gönderilir

> **SINAV İPUCU:** Reassembly sadece hedefte yapılır. Router'lar fragment'ları olduğu gibi iletir.
>
> Wireshark otomatik reassembly yapar ama Analyze > Expert Information'da fragmentation uyarılarını gösterir.

### Alıştırma 4: DF Flag ve Path MTU Discovery

### Filtre:
```text
ip.flags.df == 1
```

### Adımlar:
1. DF flag setli paketleri filtrele
2. Normal TCP trafiğinde (HTTP, SSH, vb.) DF flag genellikle setlidir:

```text
 v Internet Protocol
     Flags: 0x02 (Don't Fragment)
         0... .... = Reserved: Not set
         .1.. .... = Don't Fragment: Set       <-- DF = 1
         ..0. .... = More Fragments: Not set
```

3. Neden TCP'de DF setli? Çünkü TCP PMTUD kullanır:
   - TCP büyük segment gönderir, DF ile işaretler
   - Router MTU'dan büyükse → ICMP Fragmentation Needed döner
   - TCP MSS (Maximum Segment Size) ayarlar ve küçük segment gönderir

### ICMP Fragmentation Needed Yakalama:

```text
# ICMP Destination Unreachable - Fragmentation Needed:
icmp.type == 3 && icmp.code == 4
```

Eğer capture'da varsa:

```text
 v Internet Control Message Protocol
     Type: 3 (Destination unreachable)
     Code: 4 (Fragmentation needed)
     MTU of next hop: 1500                     <-- Önerilen MTU
```

4. PMTUD'un başarısız olduğu durumlar:
   - ICMP Fragmentation Needed engellenmiş (firewall)
   - Bağlantı "black hole" olur (paket gönderilir ama ulaşmaz)
   - TCP MSS clamping ile çözülebilir

### DF Flag ile Ping Testi:

```sh
# DF set, büyük ping (Linux'ta -M do):
docker exec shark-tank-client ping -c 3 -s 3000 -M do 172.50.2.10

# Sonuç: local fragment = yerel ağ MTU aşımı → yine fragment olur
# DF set + router MTU aşımı → ICMP Fragmentation Needed döner
```

> **SINAV İPUCU:** DF flag = 1 olan paketler fragment edilemez.
>
> MTU aşılırsa ICMP Type 3 Code 4 (Fragmentation Needed) döner. TCP trafiğinde DF genellikle setlidir.

### Alıştırma 5: Fragment Overlap (Saldırı Tespiti)

Fragment overlap, fragment'ların offset değerlerinin çakışması durumudur. Bu normal trafihte olmaz ve saldırı göstergesidir.

### Filtre:
```text
ip.analysis.error
```

### Overlap Senaryoları:

**Tiny Fragment Attack:**
```text
Fragment 1: Offset=0, Data=8 byte (sadece TCP src/dst port)
Fragment 2: Offset=1, Data=20 byte (TCP flags ve kalan header)

→ İlk fragment'ta port bilgisi eksik, firewall kuralı uygulayamaz
→ İkinci fragment offset=1 → overlap! Hedef farklı reassembly yapabilir
```

**Overlap Attack:**
```text
Fragment 1: Offset=0, Data=100 byte ("GET /safe-page HTTP/1.1")
Fragment 2: Offset=50, Data=100 byte ("GET /admin     HTTP/1.1")

→ Offset 50'den itibaren çakışma var
→ IDS ilk fragment'a bakar: "GET /safe-page" (güvenli)
→ Hedef son fragment'ı kullanır: "GET /admin" (tehlikeli)
```

### Adımlar (pcap'te gerçek overlap var — ident 0x7771):
1. Tüneli yakala:
   ```text
   ip.id == 0x7771
   ```
   Üç fragment görürsün: offset **0** (MF=1), offset **125×8=1000 byte**
   (MF=1), offset **300×8=2400 byte** (MF=0, kuyruk).
2. Çakışmayı hesapla: İlk parça 0–1480 byte'ı kaplar; ikinci parça
   **1000'den** başlar → 1000–1480 arası **iki parçada da var** = overlap.
3. Wireshark bunu kendiliğinden işaretler — reassembled paketi aç:
   ```text
   v Frame 51: [Reassembled IPv4]
       [Fragment overlap: True]
       [Conflicting data in fragment overlap: True]
   ```
4. Doğru tespit filtreleri (bunlar gerçek alan adlarıdır):
   ```text
   ip.fragment.overlap              # çakışan reassembly
   ip.fragment.overlap.conflict     # çakışan veri FARKLI (teardrop imzası)
   ip.fragment.error                # yasadışı fragment dizisi
   ip.fragment.multipletails        # birden fazla kuyruk fragment
   ip.reassembled.length            # birleşmiş paket boyutu
   ```
5. Analyze > Expert Info'da Warning/Error olarak listelenir.

### Expert Info Seviyeleri:

| Seviye | Anlamı | Simge |
|--------|--------|------|
| **Chat** | Bilgi | Yeşil konuşma balonu |
| **Note** | Dikkat | Mavi daire |
| **Warning** | Uyarı | Sarı üçgen |
| **Error** | Hata | Kırmızı X |

> **SINAV İPUCU:** Fragment overlap her zaman şüphelidir. Expert Info'da "Warning" veya "Error" olarak görünür.
>
> Tiny fragment attack, TCP header'ı iki parçaya bölerek firewall kurallarını bypass eder.

### Alıştırma 6: IPv6 Fragmentation

IPv6'da fragmentation ana header'da değil, ayrı bir **Fragment Extension Header**'da taşınır.

### Filtre:
```text
ipv6.fragment
```

### IPv6 Fragment Extension Header:

```text
 v IPv6 Fragment Header
     Next Header: ICMPv6 (58)         <-- Üst katman protokolü
     Reserved: 0000
     Fragment Offset: 0               <-- 8 byte biriminde
     1... .... = More Fragments: Yes  <-- MF flag
     Identification: 0x00001234       <-- 32 bit (IPv4'ten büyük!)
```

### IPv6 vs IPv4 Fragmentation Karşılaştırması:

| Özellik | IPv4 | IPv6 |
|---------|------|------|
| **Header'da fragmentation alanı** | Evet (Flags + Offset) | Hayır (extension header) |
| **Router fragmentasyonu** | Router yapabilir | **Sadece kaynak** yapar |
| **Minimum MTU** | 68 byte | 1280 byte |
| **Identification boyutu** | 16 bit | 32 bit |
| **DF flag** | Var | Yok |
| **PMTUD** | Opsiyonel | **Zorunlu** |

### Adımlar:
1. Eğer capture'da IPv6 fragment varsa, `ipv6.fragment` filtresi ile listele
2. Fragment Extension Header'ı incele
3. IPv4 fragmentation ile farkları not et:
   - Identification 32 bit (daha büyük alan)
   - Next Header alanı ile zincirleme
   - Router fragmentation yok

### IPv6 Fragmentation Zorunlu PMTUD:

```text
GÖNDEREN                                     ALICI
  |--- IPv6 paketi (3000 byte) ------------->|
  |                                          |
  |             Router (MTU=1500)            |
  |             Sadece kaynak fragment eder! |
  |                                          |
  |<-- ICMPv6 Packet Too Big ----------------|  (Type 2)
  |    "MTU = 1500"                          |
  |                                          |
  |--- 2 IPv6 fragment (MTU uyumlu) -------->|  (kaynak fragment eder)
```

> **SINAV İPUCU:** IPv6'da router'lar fragment yapmaz. Sadece kaynak cihaz fragment eder.
>
> Bu nedenle PMTUD zorunludur. ICMPv6 Type 2 (Packet Too Big) ile MTU uyumsuzluğu bildirilir.

## Filtre Referansı

| Filtre | Açıklama |
|--------|----------|
| `ip.flags.mf == 1` | More Fragments set (daha fragment var) |
| `ip.flags.df == 1` | Don't Fragment set (fragment etme) |
| `ip.flags == 0x01` | Sadece MF set |
| `ip.flags == 0x02` | Sadece DF set |
| `ip.flags.mf == 1 \|\| ip.frag_offset > 0` | Tüm fragment paketleri |
| `ip.frag_offset > 0` | İlk fragment olmayanlar (offset > 0) |
| `ip.frag_offset == 0` | İlk fragment |
| `ip.reassembled.length` | Reassembly yapılan paketler |
| `ip.analysis.error` | Fragmentation hataları (overlap vb.) |
| `ip.analysis.overlap` | Fragment overlap |
| `icmp.type == 3 && icmp.code == 4` | ICMP Fragmentation Needed |
| `ipv6.fragment` | IPv6 fragment paketleri |
| `icmpv6.type == 2` | IPv6 Packet Too Big |

### Bileşik Filtreler:

```text
# Tüm fragmented trafik:
ip.flags.mf == 1 || ip.frag_offset > 0

# İlk fragment'lar:
ip.flags.mf == 1 && ip.frag_offset == 0

# Son fragment'lar:
ip.flags.mf == 0 && ip.frag_offset > 0

# DF setli paketler:
ip.flags.df == 1

# Belirli Identification değeri:
ip.id == 0x1234

# Büyük paketler (fragment adayı):
ip.length > 1500

# Fragmentation + ICMP (PMTUD):
(ip.flags.mf == 1 || ip.frag_offset > 0) || (icmp.type == 3 && icmp.code == 4)

# IPv6 fragmentation:
ipv6.fragment || icmpv6.type == 2
```

## Sınav Soruları (Çöz)

1. Ethernet MTU kaç byte'tır?
2. MF = 1 ne demektir?
3. Fragment offset birimi nedir?
4. 3000 byte'lık bir ping kaç fragment'a ayrılır (MTU 1500)?
5. DF flag ne işe yarar? PMTUD'da rolü nedir?
6. Fragment offset değeri 185 olan fragment hangi byte'tan başlar?
7. Reassembly nerede yapılır? Router'da mı, hedefte mi?
8. Overlap fragment nedir? Neden tehlikelidir?
9. IPv6'da router'lar fragment yapabilir mi?
10. ICMP Type 3 Code 4 ne anlama gelir?
11. Bu pcap'te hangi filtre çakışan reassembly'i (overlap) bulur ve hangi ident değerlidir?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. 1500 byte. Bu, Ethernet frame'inin data kısmının maksimum boyutudur.
2. Daha fragment var. MF = 1 olan paketten sonra en az bir fragment daha gelir. Son fragment'ta MF = 0'dır.
3. 8 byte. Fragment offset alanı 13 bit olup 8 byte biriminde değer taşır. Maksimum offset = 8191 × 8 = 65528 byte.
4. 3 fragment. 3000 byte data + 8 byte ICMP header = 3008 byte. 3008 / 1480 = 2.03 → 3 fragment (1480 + 1480 + 48).
5. Don't Fragment. Paketin fragment edilmesini engeller. PMTUD'da: DF setli paket gönderilir, MTU aşılırsa ICMP Fragmentation Needed (Type 3, Code 4) döner, gönderen MTU'yu küçültür.
6. 1480 byte'tan başlar. 185 × 8 = 1480. İlk fragment 1480 byte data taşımış, ikinci fragment 1480 offset'ten başlar.
7. Sadece hedefte yapılır. Router'lar fragment'ları olduğu gibi iletir. Reassembly sadece final destinasyonda gerçekleşir.
8. Fragment offset'lerinin çakışmasıdır. Tehlikelidir çünkü IDS ve hedef sistem farklı reassembly yapabilir. IDS tehlikeli içeriği göremeyebilir (evasion). Firewall kuralları bypass edilebilir.
9. Hayır. IPv6'da sadece kaynak cihaz fragment eder. Router'lar fragment yapmaz. MTU aşılırsa ICMPv6 Packet Too Big (Type 2) ile kaynak bilgilendirilir.
10. ICMP Destination Unreachable - Fragmentation Needed. DF setli bir paket router'da MTU'yu aştığında, router bu ICMP mesajını gönderir ve MTU değerini bildirir.
11. `ip.fragment.overlap` (ve `ip.fragment.overlap.conflict` — veri de çakışıyor). Zincir ident **0x7771**: fragment'lar offset 0, 1000 ve 2400; 0–1480 ile 1000–2400 arası üst üste biniyor.

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
