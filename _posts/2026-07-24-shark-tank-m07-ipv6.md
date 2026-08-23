---
layout: post
title:  "shark-tank - m07: IPv6 Analizi"
date:   2026-07-24 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 07: IPv6 Analizi

**Neden?** Ağın IPv6 destekliyor ama kimse izlemiyor. Saldırgan bunu biliyor ve IPv6 protokollerini kullanarak güvenlik duvarını atlıyor. IPv6'da ARP yerine NDP (Neighbor Discovery Protocol) vardır: NDP spoofing ile ARP poisoning'in aynısı yapılabilir. Router Advertisement spoofing ile sahte gateway tanıtılır. IPv6 tunneling (6to4, Teredo) ile IPv4 güvenlik duvarı atlanır. Çoğu ağ IPv6'yı izlemez: Saldırgan için cennet. Bu modülde, IPv6 saldırılarını tespit etmeyi öğreneceksin.

**Görev:** IPv6 protokolünü tanı. Wireshark'ta IPv6 trafiğini analiz et. Dual-stack ağlarda neyi gözden kaçırdığını öğren.

**Öğrenim Hedefleri:**
- IPv6 header yapısını (40 byte sabit, extension headers) tanımak
- IPv6 adres tiplerini (unicast, multicast, anycast) ayırt edebilmek
- ICMPv6 ve NDP (Neighbor Discovery Protocol) mesajlarını analiz edebilmek
- Dual-stack ağlarda IPv6 güvenlik zafiyetlerini (NDP spoofing, RA spoofing) tespit edebilmek
- IPv6 tunneling (6to4, Teredo) ile güvenlik duvarı atlatma yöntemlerini bilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **IPv6** | Internet Protocol version 6: IPv4'ün halefi olan, 128 bitlik adres uzayına sahip ağ protokolü. IPv4'te adresler 32 bit (örn. `172.50.2.10`) iken IPv6'da 128 bittir (örn. `2001:db8::1`) ve teoride tükenmez. Header yapısı IPv4'ten daha basittir: 40 byte sabit uzunlukta, checksum alanı yok, fragmentation ana header'da değil extension header'da taşınır. IPv6'da broadcast yoktur; bunun yerine multicast ve unicast kullanılır. Çoğu modern işletim sistemi IPv4 ve IPv6'yı aynı anda destekler (dual-stack). |
| **SLAAC** | Stateless Address Autoconfiguration: IPv6'da bir cihazın DHCP sunucusuna ihtiyaç duymadan kendine otomatik olarak IPv6 adresi ataması. Cihaz, ağdaki router'ın gönderdiği Router Advertisement (RA) mesajından ağ prefix'ini öğrenir ve kendi MAC adresini (EUI-64 formatında) kullanarak benzersiz bir IPv6 adresi oluşturur. DHCP'ye alternatiftir; cihaz ve router arasında herhangi bir durum bilgisi (state) tutulmaz. |
| **NDP** | Neighbor Discovery Protocol: IPv6'da ARP'nin yerini alan protokol. ICMPv6 üzerinden çalışır ve aynı yerel ağdaki komşu cihazların MAC adreslerini bulmak için kullanılır. Çalışma şekli ARP'ye benzer: Bir cihaz "Bu IPv6 adresinin MAC'i ne?" diye sorar (Neighbor Solicitation, ICMPv6 Type 135), karşı cihaz "Benim, MAC adresim şu" diye yanıt verir (Neighbor Advertisement, ICMPv6 Type 136). NDP ayrıca router keşfi (Router Solicitation/Advertisement) ve adres çakışması tespiti (DAD) işlevlerini de yerine getirir. |
| **ICMPv6** | IPv6 için ICMP'nin karşılığı olan protokol. IPv4'teki ICMP'nin tüm işlevlerini (ping, traceroute, hata bildirimi) içerir, ancak ek olarak IPv6'nın kritik işlemlerini de yürütür: Adres yapılandırma (SLAAC), komşu keşfi (NDP) ve MTU keşfi (Packet Too Big mesajı). IPv6'da ICMPv6 sadece bir tanılama aracı değil, protokolün normal çalışması için zorunlu bir bileşendir. |
| **dual-stack** | Bir cihazın veya ağın aynı anda hem IPv4 hem de IPv6 çalıştırması. Dual-stack modunda bir cihaz iki protokolü de destekler ve hedefe göre uygun olanı kullanır. DNS sorgusu hem A (IPv4) hem AAAA (IPv6) kaydı dönerse, cihaz genellikle IPv6'yı tercih eder. Bu lab'da tüm container'lar dual-stack olarak yapılandırılmıştır: Hem IPv4 (172.50.2.x) hem de IPv6 (fd00:2::x) adreslerine sahiptir. |
| **link-local** | Sadece aynı ağ segmentinde (aynı fiziksel ağda) geçerli olan IPv6 adres türü. `fe80::/10` prefix'i ile başlar ve router'lar tarafından diğer ağlara iletilmez. Her IPv6 arayüzü otomatik olarak bir link-local adres alır; bu adres komşu keşfi (NDP) ve router keşfi için kullanılır. Link-local adreslere erişirken hangi arayüzün kullanılacağını belirtmek gerekir: `fe80::1%eth0` gibi. IPv4'teki APIPA (169.254.x.x) adreslerine benzer ama IPv6'da her zaman aktiftir. |
| **multicast** | Belirli bir gruba ait tüm cihazlara aynı anda gönderilen mesaj. IPv6'da broadcast yoktur; onun yerine multicast kullanılır. Multicast adresleri `ff00::/8` prefix'i ile başlar. Örneğin `ff02::1` aynı ağdaki tüm cihazları, `ff02::2` tüm router'ları temsil eder. NDP mesajları multicast olarak gönderilir: Cihaz, bir IPv6 adresinin MAC'ini ararken sorguyu ilgili multicast adresine gönderir ve sadece o adresle ilgisi olan cihazlar yanıtlar. |
| **extension header** | IPv6'da, ana header'ın dışında ek protokol bilgisi taşımak için kullanılan zincirleme header yapısı. IPv4'te tüm option'lar ana header'da taşınırken, IPv6'da bunlar ayrı extension header'larda taşınır: Fragment Header (fragmentation bilgisi), Hop-by-Hop Options (tüm router'lar için), Routing (kaynak yönlendirme), ESP/AH (IPsec) gibi. Her extension header bir "Next Header" alanı içerir ve zincirin sonunda üst katman protokolü (TCP, UDP, ICMPv6) bulunur. Bu yapı, ana header'ın sabit 40 byte kalmasını sağlar. |
| **RA (Router Advertisement)** | ICMPv6 Type 134 mesajı: IPv6 router'ların ağdaki tüm cihazlara "ben buradayım ve bu ağda şu prefix'i kullanın" diye duyuru yapması. Router'lar periyodik olarak RA gönderir, ayrıca bir cihazın Router Solicitation (RS, Type 133) göndermesine yanıt olarak da gönderir. RA mesajı ağ prefix'ini, MTU değerini ve SLAAC için gereken bilgileri içerir. Saldırganlar sahte RA mesajları göndererek kendilerini ağ geçidi (gateway) gibi tanıtabilir (RA spoofing). |

## Teori

IPv6 (Internet Protocol version 6), IPv4'ün halefi protokoldür. 128-bit adres uzayıyla 340 undecillion adres sağlar.

- **Adres uzunluğu:** 128 bit (IPv4 = 32 bit)
- **Header:** 40 byte sabit (IPv4 = 20-60 byte değişken)
- **Yapılandırma:** SLAAC ( Stateless Address Autoconfiguration) ile otomatik
- **Güvenlik:** IPsec dahili (opsiyonel)
- **Broadcast yok:** Multicast ve anycast kullanılır

### IPv6 Header Yapısı:

```text
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|Version| Traffic Class |           Flow Label                  |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Payload Length        |  Next Header  |   Hop Limit   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                                                               +
|                                                               |
+                         Source Address                        +
|                                                               |
+                                                               +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                                                               +
|                                                               |
+                      Destination Address                      +
|                                                               |
+                                                               +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

### IPv6 Header Alanları:

| Alan | Boyut | Açıklama |
|------|-------|----------|
| **Version** | 4 bit | Her zaman 6 |
| **Traffic Class** | 8 bit | QoS önceliği (IPv4 ToS ile aynı) |
| **Flow Label** | 20 bit | Paket akışı etiketi (QoS) |
| **Payload Length** | 16 bit | Header sonrası veri boyutu |
| **Next Header** | 8 bit | Üst katman protokolü (IPv4 Protocol ile aynı) |
| **Hop Limit** | 8 bit | Maksimum router sayısı (IPv4 TTL ile aynı) |
| **Source Address** | 128 bit | Gönderen adresi |
| **Destination Address** | 128 bit | Alıcı adresi |

### IPv4 vs IPv6 Header Karşılaştırması:

| Özellik | IPv4 | IPv6 |
|---------|------|------|
| **Header boyutu** | 20-60 byte (değişken) | 40 byte (sabit) |
| **Adres uzunluğu** | 32 bit | 128 bit |
| **Checksum** | Var (header) | Yok (Layer 2 ve 4'de) |
| **Fragmentation** | Header'da (Flags, Offset) | Extension Header'da |
| **Options** | Header'da | Extension Header'da |
| **TTL / Hop Limit** | TTL | Hop Limit |
| **Protocol / Next Header** | Protocol (8 bit) | Next Header (8 bit) |
| **NAT gereksinimi** | Gerekli (adres azlığı) | Gerekmez (yeterli adres) |
| **Broadcast** | Var | Yok (multicast) |
| **Yapılandırma** | DHCP / Manuel | SLAAC / DHCPv6 |
| **IPsec** | Opsiyonel eklenti | Dahili (opsiyonel kullanım) |

### IPv6 Adres Tipleri:

| Adres Tipi | Prefix | Açıklama | Örnek |
|-----------|--------|----------|-------|
| **Global Unicast** | `2000::/3` | İnternette yönlendirilebilir | `2001:db8::1` |
| **Link-Local** | `fe80::/10` | Sadece aynı ağ segmentinde | `fe80::1%eth0` |
| **Loopback** | `::1/128` | Kendi cihazı | `::1` |
| **Multicast** | `ff00::/8` | Grup iletişimi | `ff02::1` (tüm düğümler) |
| **Unique Local** | `fc00::/7` | Özel ağ (RFC 4193) | `fd00::1` |
| **Unspecified** | `::/128` | Adres yok | `::` |
| **IPv4-mapped** | `::ffff:0:0/96` | IPv4 uyumluluk | `::ffff:192.168.1.1` |

### IPv6 Extension Headers:

| Sıra | Header | Next Header Değeri | Açıklama |
|------|--------|-------------------|----------|
| 0 | **Hop-by-Hop Options** | 0 | Tüm router'lar işler |
| 1 | **Destination Options** | 60 | Sadece hedef işler |
| 2 | **Routing** | 43 | Kaynak yönlendirme |
| 3 | **Fragment** | 44 | Fragmentasyon bilgisi |
| 4 | **Authentication (AH)** | 51 | IPsec doğrulama |
| 5 | **Encapsulating Security Payload (ESP)** | 50 | IPsec şifreleme |
| 6 | **Destination Options** | 60 | Sadece hedef işler |
| - | **No Next Header** | 59 | Payload yok |

> Extension header'lar zincirleme bağlanır. Her header bir "Next Header" alanı içerir, bir sonraki header'ın tipini gösterir. Bu zincirin sonunda üst katman protokolü (TCP=6, UDP=17, ICMPv6=58) bulunur.

### ICMPv6 ve Neighbor Discovery:

ICMPv6, IPv6 ağlarında kritik rol oynar. Sadece ping değil, adres yapılandırma ve komşu keşfi için de kullanılır.

| ICMPv6 Tipi | Adı | İşlev |
|-------------|-----|-------|
| **133** | Router Solicitation (RS) | "Router var mı?" sorgusu |
| **134** | Router Advertisement (RA) | "Ben router'ım, bu prefix'i kullan" |
| **135** | Neighbor Solicitation (NS) | "Bu IPv6 adresinin MAC'i ne?" (= ARP Request) |
| **136** | Neighbor Advertisement (NA) | "Bu MAC benim!" (= ARP Reply) |
| **137** | Redirect | "Daha iyi bir router şurada" |
| **128** | Echo Request | ping6 isteği |
| **129** | Echo Reply | ping6 yanıtı |
| **1** | Destination Unreachable | Ulaşılamaz hedef |
| **2** | Packet Too Big | MTU aşımı (PMTU discovery) |
| **3** | Time Exceeded | Hop Limit aşıldı |
| **4** | Parameter Problem | Header hatası |

### Neighbor Discovery Protocol (NDP):

NDP, IPv6'da ARP'nin yerini alan protokoldür. ICMPv6 üzerinden çalışır.

```text
CİHAZ A (fe80::1)                          CİHAZ B (fe80::2)
  |--- Neighbor Solicitation --------------->|  (Mcast: ff02::1:ff00:2)
  |    "fe80::2'nin MAC'i ne?"               |
  |                                          |
  |<-- Neighbor Advertisement ---------------|  (Unicast)
  |    "Benim! MAC = aa:bb:cc:dd:ee:ff"      |
```

### DAD (Duplicate Address Detection): Adres Çakışması Kontrolü

Yeni bir IPv6 adresi etkinleştirilmeden önce, cihaz o adrese **kendisi**
Neighbor Solicitation gönderir (hedef = kendi adresinin solicited-node
multicast'i). Yanıt gelirse adres **çakışıyor** demektir:

```text
# DAD sorgusu: NS paketi, hedef adres = kaynak adresin kendisi
icmpv6.type == 135 && ipv6.dst ~= ff02::1:ff00:0   # solicited-node mcast
# Çakışma kanıtı: beklenmedik bir NA
icmpv6.type == 136
```

Saldırı bağlamı: **DAD spoofing** — saldırgan her DAD NS'ine NA ile
"o adres benim" derse, kurbanın adresi hiç kullanıma girmez (DoS) veya
SLAAC manipülasyonu yapılır. `icmpv6.type == 135` yoğunluğu + ardışık NA
çiftleri, ağda DAD oyunu oynandığını gösterir.

### Dual-Stack, Tunneling ve Çeviri:

| Geçiş Yöntemi | Açıklama | Avantaj | Dezavantaj |
|---------------|----------|---------|-------------|
| **Dual-Stack** | IPv4 ve IPv6 aynı anda çalışır | Basit, uyumlu | Her iki protokol yönetilmeli |
| **Tunneling (6to4)** | IPv6, IPv4 tunnel içinde | IPv4 ağı üzerinden IPv6 | Ek header overhead |
| **Tunneling (Teredo)** | IPv6, UDP tunnel içinde | NAT arkasında çalışır | Karmaşık, güvenlik riski |
| **NAT64/DNS64** | IPv6-only ağdan IPv4'e erişim | IPv6'ya geçiş kolay | DNS bağımlılığı |

> **İstihbarat İşaretleri, IPv6 güvenlik açısından kritik:**
>
> - Çoğu firewall IPv6'yı filtrelemiyor. IPv6 trafiği görünmez geçebilir
> - IPv6 tunneling ile veri sızıntısı mümkün. 6to4, Teredo, ISATAP tunnel'ları kontrolsüz
> - Neighbor Discovery spoofing = ARP poisoning'in IPv6 versiyonu. RA rogue = sahte router
> - `::` (tüm sıfırlar) adresi = gereksiz, şüpheli. Kaynak adres olarak görülmemeli
> - Extension header'lar filtreleri atlatabilir. Fragment header ile IDS/IPS baypası mümkün
> - Multicast adresleri (`ff02::`) keşif amaçlı kullanılır, ama sızdırma için de kullanılabilir
> - IPv6 adreslerinde bilgi gizleme: Adresin son 64 bit'i MAC adresi olabilir (EUI-64 formatı)

## Hazırlık

Bu lab dual-stack ağ yapısına sahiptir: IPv4 (172.50.2.0/24) ve IPv6 (fd00:2::/64) aynı anda çalışır. Container'lar hem IPv4 hem de IPv6 adreslere sahiptir. IPv6 global unicast (fd00:2::/64) ve link-local (fe80::/10) adresleri keşfedeceğiz.

```sh
# IPv6 trafik oluştur:
./scripts/generate-traffic.sh ipv6

# PCAP'i Wireshark ile aç:
# macOS: open -a Wireshark module-07-ipv6.pcap
# Linux: wireshark module-07-ipv6.pcap &
# Windows: start wireshark module-07-ipv6.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

### Client Container'da IPv6 Adresleri Kontrol:

```sh
# Container'ın IPv6 adreslerini gör:
docker exec shark-tank-client ip -6 addr

# Link-local adresi gör (fe80:: ile başlayan):
docker exec shark-tank-client ip -6 addr show scope link

# ping6 ile test (ICMPv6 Echo):
docker exec shark-tank-client ping6 -c 3 fd00:2::14

# AAAA kaydı sorgula:
docker exec shark-tank-client dig AAAA google.com +short

# Neighbor cache gör:
docker exec shark-tank-client ip -6 neigh show
```

## Alıştırmalar

### Alıştırma 1: IPv6 Link-Local Keşfi

### Filtre:
```text
ipv6
```

### Adımlar:
1. Wireshark'ta capture'ı aç ve `ipv6` filtresini uygula
2. Paket listesinde IPv6 paketlerini göreceksin
3. Herhangi bir IPv6 paketine tıkla ve **Internet Protocol Version 6** katmanını genişlet:

```text
 v Internet Protocol Version 6
     0110 .... = Version: 6                  <-- IPv6
     .... 0000 0000 .... .... .... .... .... = Traffic Class: 0x00
     .... .... .... 0000 0000 0000 0000 0000 = Flow Label: 0x00000
     Payload Length: 32
     Next Header: ICMPv6 (58)                <-- Üst katman
     Hop Limit: 255                          <-- TTL karşılığı
     Source Address: fe80::ec2a:aeff:feb9:8df4  <-- Link-local (gateway)
     Destination Address: ff02::1:ff00:1     <-- Solicited-node mcast
```

4. Kaynak adreslerin `fe80::` ile başladığını teyit et
5. Hedef adreslerin multicast olup olmadığına bak (`ff02::`)

> **SINAV İPUCU:** Link-local adresler `fe80::/10` prefix'i ile başlar. Sadece aynı ağ segmentinde geçerlidirler. Router'lar bu adresleri yönlendirmez.

### Alıştırma 2: IPv6 Header Analizi

### Filtre:
```text
ipv6
```

### Adımlar:
1. Bir IPv6 paketini seç ve header alanlarını tek tek incele:

**Version (4 bit):**
```text
 0110 .... = Version: 6
```
Her zaman 6 olmalıdır. Wireshark bunu otomatik doğrular.

**Traffic Class (8 bit):**
```text
 .... 0000 0000 .... .... .... .... = Traffic Class: 0x00 (Routine)
```
IPv4'teki ToS (Type of Service) / DSCP karşılığı. QoS için kullanılır.

**Flow Label (20 bit):**
```text
 .... .... .... 0000 0000 0000 0000 0000 = Flow Label: 0x00000
```
Aynı akışa ait paketleri işaretler. Router'lar bu etikete göre QoS uygulayabilir.

**Payload Length (16 bit):**
```text
 Payload Length: 64
```
IPv6 header sonrası tüm verinin boyutu. IPv4'teki Total Length'ten farklı olarak header'ı saymaz.

**Next Header (8 bit):**
```text
 Next Header: ICMPv6 (58)
```
IPv4'teki Protocol alanının karşılığı. Yaygın değerler: 6=TCP, 17=UDP, 58=ICMPv6, 43=Routing, 44=Fragment.

**Hop Limit (8 bit):**
```text
 Hop Limit: 255
```
IPv4'teki TTL'nin karşılığı. Her router 1 azaltır. 0 olursa paket düşürülür.

2. IPv4 header ile karşılaştır:
   - IPv4'te **Protocol** alanı var, IPv6'da **Next Header**
   - IPv4'te **TTL** var, IPv6'da **Hop Limit**
   - IPv4'te **Total Length** var, IPv6'da **Payload Length** (header dahil değil)
   - IPv6'da **Checksum yok** (hata kontrolü üst katmanlarda)

> **SINAV İPUCU:** IPv6 header'da checksum yoktur. Bu bilerek kaldırıldı çünkü Layer 2 (Ethernet FCS) ve Layer 4 (TCP/UDP checksum) zaten hata kontrolü yapar. Her katmanda tekrar kontrol gereksizdi.

### Alıştırma 3: ICMPv6: Neighbor Discovery

### Filtre:
```text
icmpv6
```

### Neighbor Solicitation (Type 135) İnceleme:
1. Bir Neighbor Solicitation paketi bul
2. Internet Control Message Protocol v6 katmanını genişlet:

```text
 v Internet Control Message Protocol v6
     Type: 135 (Neighbor Solicit.)           <-- ARP Request karşılığı
     Code: 0
     Checksum: 0xXXXX
     Target Address: fd00:2::14              <-- "Bu adres kimin?"
 v ICMPv6 Option
     Type: Source Link-Layer Address (1)
     Link-Layer Address: c2:97:06:0f:b0:c7   <-- Soranın MAC'i
```

### Neighbor Advertisement (Type 136) İnceleme:
1. Bir Neighbor Advertisement paketi bul:

```text
 v Internet Control Message Protocol v6
     Type: 136 (Neighbor Advertisement)         <-- ARP Reply karşılığı
     Code: 0
     Flags: 0x60000000, Solicited, Override
         0... .... = Router: Not set
         .1.. .... = Solicited: True
         ..1. .... = Override: True
     Target Address: fd00:2::14                 <-- "Bu adres benim!"
 v ICMPv6 Option
     Type: Target Link-Layer Address (2)
     Link-Layer Address: ee:2a:ae:b9:8d:f4      <-- Cevap verenin MAC'i
```

### Router Solicitation (Type 133) ve Advertisement (Type 134):
```text
# Router Solicitation filtresi:
icmpv6.type == 133

# Router Advertisement filtresi:
icmpv6.type == 134
```

Bu pcap'te RA (Type 134) paketleri görülür; RS (Type 133) gönderilmemiş olabilir (Docker ortamında router duyuruyu kendiliğinden yapar). RA, router'ın "ben buradayım, bu prefix'i kullanın" duyurusudur. RA paketinde Prefix Information (fd00:2::/64) bulunur.

Router Advertisement paketinde önemli alanlar:
- **Managed Flag:** DHCPv6 kullanılacak mı?
- **Prefix Information:** Ağ prefix'i ve uzunluğu
- **Default Lifetime:** Router'ın varsayılan gateway olarak süresi

### NDP vs ARP Karşılaştırması:

| İşlev | IPv4 (ARP) | IPv6 (NDP) |
|-------|-----------|-----------|
| IP-MAC çözümleme | ARP Request/Reply | Neighbor Solicitation/Advertisement |
| Router bulma | DHCP veya manuel | Router Solicitation/Advertisement |
| Adres çakışma algılama | Gratuitous ARP | Duplicate Address Detection (DAD) |
| Yönlendirme | ICMP Redirect | ICMPv6 Redirect |
| Taşıma protokolü | Kendi protokolü (Ethertype 0x0806) | ICMPv6 üzerinden |
| Hedefleme | Broadcast (ff:ff:ff:ff:ff:ff) | Multicast (ff02::1:ffXX:XXXX) |

> **SINAV İPUCU:** Neighbor Solicitation (Type 135) ARP Request'in, Neighbor Advertisement (Type 136) ARP Reply'in IPv6 karşılığıdır. NDP, ARP'nin yerine geçmiştir ve ICMPv6 üzerinden çalışır.

### Alıştırma 4: IPv6 AAAA DNS Kayıtları

### Filtre:
```text
dns.qry.type == 28
```

### Adımlar:
1. AAAA sorgusu olan bir DNS paketi bul
2. Domain Name System katmanını genişlet
3. Sorgu kısmında:

```text
 v Queries
     web.shark-tank.local: type AAAA, class IN
         Name: web.shark-tank.local
         Type: AAAA (28)                       <-- IPv6 adres sorgusu
         Class: IN (0x0001)
```

4. Yanıtta IPv6 adresini bul:

```text
 v Answers
     web.shark-tank.local: type AAAA, class IN, addr fd00:2::10
         Name: web.shark-tank.local
         Type: AAAA (28)
         Address: fd00:2::10                   <-- Lab'ın IPv6 web adresi
```

### Client Container'dan AAAA Sorgusu Yap:

```sh
# AAAA kaydı sorgula:
docker exec shark-tank-client dig AAAA google.com

# Hem A hem AAAA sorgula (dual-stack kontrol):
docker exec shark-tank-client dig ANY google.com

# Sadece IPv6 adresini göster:
docker exec shark-tank-client dig AAAA google.com +short
```

### A vs AAAA Karşılaştırması:

| Özellik | A Kaydı | AAAA Kaydı |
|---------|---------|-----------|
| **Tip** | 1 | 28 |
| **Adres tipi** | IPv4 (32 bit) | IPv6 (128 bit) |
| **Filtre** | `dns.qry.type == 1` | `dns.qry.type == 28` |
| **Örnek** | `142.250.185.78` | `2a00:1450:4001:830::200e` |

> **SINAV İPUCU:** AAAA kaydı tip numarası 28'dir. "AAAA" adı, IPv4'ün 4 katı adres uzunluğundan gelir (4xA = AAAA). `dns.qry.type == 28` filtresi ile AAAA sorgularını yakalayabilirsin.

### Alıştırma 5: IPv6 Fragmentation

IPv4'te fragmentation header'ın içindeydi (Flags ve Fragment Offset alanları). IPv6'da ise fragmentation ayrı bir **Extension Header** olarak taşınır.

### Filtre:
```text
ipv6.fragment
```

### Fragment Extension Header İnceleme:
1. Fragmentli bir IPv6 paketi bul (eğer varsa)
2. IPv6 Fragment Header katmanını genişlet:

```text
 v IPv6 Fragment Header
     Next Header: ICMPv6 (58)
     Reserved: 000
     Fragment Offset: 0                         <-- İlk fragment
     1... .... = More Fragments: Yes            <-- Devamı var
     Identification: 0x00001234                 <-- Fragment grup ID
```

### Fragment Paketlerini Yeniden Birleştirme:
Wireshark fragmentleri otomatik birleştirir:
1. `ipv6.fragment` filtresi ile tüm fragmentleri listele
2. İlk fragmente tıkla
3. Packet details'da **[Reassembled IPv6]** başlığı altında tüm parçalar görünür

### IPv4 vs IPv6 Fragmentation:

| Özellik | IPv4 | IPv6 |
|---------|------|------|
| **Konum** | Ana header'da | Extension Header'da |
| **Router fragmentasyonu** | Router'lar fragment yapabilir | Sadece kaynak yapar (PMTU discovery) |
| **DF bayrağı** | Var (Don't Fragment) | Yok (zaten kaynak yapar) |
| **Identification** | 16 bit | 32 bit |

> **SINAV İPUCU:** IPv6'da router'lar fragment yapmaz. Sadece kaynak cihaz fragment eder. Bu nedenle PMTU (Path MTU) Discovery zorunludur. "Packet Too Big" (ICMPv6 Type 2) mesajı ile MTU uyumsuzluğu bildirilir.

### Alıştırma 6: Dual-Stack Analizi

### Filtre:
```text
ipv6 || ip
```

### Adımlar:
1. Tüm IP trafiğini göster (IPv4 ve IPv6 birlikte)
2. Hangi protokollerin IPv4, hangilerinin IPv6 kullandığını karşılaştır:

```text
# Sadece IPv4:
ip && !ipv6

# Sadece IPv6:
ipv6 && !ip

# IPv4 ve IPv6 yan yana:
ipv6 || ip
```

3. Statistics > Protocol Hierarchy ile protokol dağılımını kontrol et:
   - IPv4 ve IPv6 yüzdeleri ne?
   - Hangi uygulamalar hangi protokolü kullanıyor?

4. IPv6 trafiğinin içeriğini analiz et:
   - Link-local mi, global mi?
   - ICMPv6 Neighbor Discovery mi, uygulama trafiği mi?
   - Tunneling var mı?

### Dual-Stack Ağlarda Dikkat Edilmesi Gerekenler:

| Konu | Risk |
|------|------|
| **Firewall** | IPv6 kuralları unutulmuş olabilir |
| **IDS/IPS** | IPv6 imzaları eksik olabilir |
| **Monitoring** | IPv6 trafiği izlenmiyor olabilir |
| **DNS** | AAAA kayıtları kontrol edilmemiş olabilir |
| **Neighbor Discovery** | RA spoofing saldırısı mümkün |
| **Extension Headers** | Fragment ile filtre baypası olabilir |

### Client Container'dan Dual-Stack Test:

```sh
# IPv4 ile ping:
docker exec shark-tank-client ping -c 3 172.50.2.14

# IPv6 ile ping (global unicast):
docker exec shark-tank-client ping6 -c 3 fd00:2::14

# IPv6 ile ping (link-local: önce adresi bul):
docker exec shark-tank-client ip -6 addr show scope link
# Çıktıdaki fe80:: ile başlayan adresi kopyalayıp kullan, örn:
# docker exec shark-tank-client ping6 -c 3 fe80::xx:xx:xx:xx

# DNS sorgulama karşılaştırması:
docker exec shark-tank-client dig A www.shark-tank.local +short
docker exec shark-tank-client dig AAAA www.shark-tank.local +short
```

> **SINAV İPUCU:** Dual-stack ağda hem IPv4 hem IPv6 trafiği aynı anda bulunur. Her iki protokolü de analiz etmek gerekir. IPv6 trafiği görmezden gelinmemelidir.

### Alıştırma 7: IPv6 Multicast Adresleri

### Filtre:
```text
ipv6.dst matches "^ff"
```

### Önemli IPv6 Multicast Adresleri:

| Adres | Anlamı |
|-------|--------|
| `ff02::1` | Tüm düğümler (same link) |
| `ff02::2` | Tüm router'lar (same link) |
| `ff02::1:ffXX:XXXX` | Solicited-node multicast (NDP için) |
| `ff02::1:2` | Tüm DHCPv6 relay agent'lar |
| `ff05::1:3` | Tüm DHCPv6 sunucular |
| `ff02::16` | MLDv2 (Multicast Listener Discovery) |

### Adımlar:
1. Multicast hedefli IPv6 paketlerini filtrele
2. Hangi multicast adreslerine paket gittiğini listele
3. `ff02::1` (tüm düğümler) ve `ff02::2` (tüm router'lar) trafiğini ayır:

```text
# Tüm düğümler multicast:
ipv6.dst == ff02::1

# Tüm router'lar multicast:
ipv6.dst == ff02::2

# Solicited-node multicast:
ipv6.dst matches "^ff02::1:ff"
```

> **SINAV İPUCU:** IPv6'da broadcast yoktur. Onun yerine multicast kullanılır. `ff02::1` = tüm düğümler, `ff02::2` = tüm router'lar. NDP'de solicited-node multicast adresleri kullanılır.

### Alıştırma 8: Wireshark IPv6 Renk Kuralları

Wireshark IPv6 trafiğini otomatik renklendirir, ama kontrol etmek iyidir:

1. View > Coloring Rules menüsünü aç
2. IPv6 ile ilgili kuralları bul:
   - ICMPv6 paketleri genellikle farklı renk
   - IPv6 uzantı header'ları ayrı gösterilir
3. İsteğe bağlı: IPv6 için özel renk kuralı ekle:
   - Filter: `ipv6`
   - Background: Açık mor veya farklı bir renk

Bu, karmaşık capture'larda IPv6 paketlerini hızlıca görmeyi sağlar.

## Filtre Referansı

| Filtre | Açıklama |
|--------|----------|
| `ipv6` | Tüm IPv6 paketleri |
| `ipv6.src == fe80::1` | Kaynak IPv6 adresi |
| `ipv6.dst == ff02::1` | Hedef IPv6 multicast |
| `ipv6.addr == fe80::1` | Kaynak veya hedef IPv6 |
| `ipv6.hlim == 1` | Hop Limit = 1 |
| `ipv6.hlim < 10` | Hop Limit 10'dan küçük |
| `ipv6.nxt == 6` | Next Header = TCP |
| `ipv6.nxt == 17` | Next Header = UDP |
| `ipv6.nxt == 58` | Next Header = ICMPv6 |
| `ipv6.nxt == 44` | Next Header = Fragment |
| `ipv6.nxt == 43` | Next Header = Routing |
| `icmpv6` | Tüm ICMPv6 paketleri |
| `icmpv6.type == 128` | Echo Request (ping6) |
| `icmpv6.type == 129` | Echo Reply (ping6) |
| `icmpv6.type == 133` | Router Solicitation |
| `icmpv6.type == 134` | Router Advertisement |
| `icmpv6.type == 135` | Neighbor Solicitation |
| `icmpv6.type == 136` | Neighbor Advertisement |
| `icmpv6.type == 1` | Destination Unreachable |
| `icmpv6.type == 2` | Packet Too Big |
| `icmpv6.type == 3` | Time Exceeded |
| `dns.qry.type == 28` | AAAA kayıt sorgusu |
| `dns.qry.type == 1` | A kayıt sorgusu |
| `ipv6.fragment` | Fragmentli IPv6 paketleri |
| `ipv6.opt.type` | IPv6 Extension Header tipleri |
| `dhcpv6` | DHCPv6 paketleri |
| `mld` | Multicast Listener Discovery |

### Bileşik Filtreler:

```text
# Neighbor Discovery (tüm NDP):
icmpv6.type >= 133 && icmpv6.type <= 137

# Sadece ping6:
icmpv6.type == 128 || icmpv6.type == 129

# IPv6 ve TCP:
ipv6 && tcp

# IPv6 ve UDP:
ipv6 && udp

# Link-local kaynak:
ipv6.src matches "^fe80"

# Multicast hedef:
ipv6.dst matches "^ff"

# Hop Limit düşük (muhtemel yerel):
ipv6.hlim <= 1

# AAAA sorgusu ve yanıtı:
dns.qry.type == 28 || dns.resp.type == 28
```

## İstihbarat Raporu: IPv6 Güvenlik Analizi

Dual-stack ağlarda IPv6 trafiği güvenlik için kritik önem taşır:

| Tehdit | Açıklama | Tespit Filtresi |
|--------|----------|----------------|
| **RA Spoofing** | Sahte router advertisement | `icmpv6.type == 134 && !(ipv6.src == <beklenen_router>)` |
| **NDP Spoofing** | Sahte neighbor advertisement | `icmpv6.type == 136` (çift MAC kontrolü) |
| **IPv6 Tunneling** | Gizli veri kanalı (6to4, Teredo) | `ipv6.nxt == 41 \|\| udp.port == 3544` |
| **Fragment Saldırısı** | Overlay fragment ile filtre baypas | `ipv6.fragment && ipv6.fragment.offset > 0` |
| **Multicast Flood** | ff02::1'e sürekli trafik | `ipv6.dst == ff02::1 && frame.time_delta < 0.01` |
| **EUI-64 Sızıntısı** | MAC adresi IPv6 adresinde | IPv6 alanlarında `matches` çalışmaz; `ipv6.src` ile adresleri listele ve `ff:fe` desenini ara (örn. `fe80::ec2a:aeff:feb9:8df4` = MAC `ee:2a:ae:b9:8d:f4`); tek adres için `frame contains ec:2a:ae:ff:fe:b9` |
| **DHCPv6 Spoofing** | Sahte DHCPv6 sunucu | `dhcpv6 && ipv6.src != <beklenen_dhcp>` |

> **İstihbarat İşaretleri, IPv6 güvenlik açısından kritik:**
>
> - Çoğu firewall IPv6'yı filtrelemiyor. IPv6 trafiği görünmez geçebilir
> - IPv6 tunneling ile veri sızıntısı mümkündür. Tunnel trafiğini mutlaka kontrol et
> - Neighbor Discovery spoofing, ARP poisoning'in IPv6 versiyonudur. RA rogue saldırılarına dikkat
> - `::` (tüm sıfırlar) adresi gereksizdir, kaynak olarak görülmemeli
> - IPv6 adresinin son 64 bit'i MAC adresi içerebilir (EUI-64). Cihaz parmak izi için kullanılabilir

## Sınav Soruları (Çöz)

1. IPv6 adres kaç bittir? IPv4 ile arasındaki fark nedir?
2. Neighbor Discovery hangi protokolün yerini alır? Hangi ICMPv6 tipleri kullanılır?
3. IPv6 header kaç byte'tır? IPv4 header'dan farkı nedir?
4. Hop Limit neyi ifade eder? IPv4'teki karşılığı nedir?
5. `fe80::` ile başlayan adres ne demektir? Nerede kullanılır?
6. IPv6'da broadcast var mıdır? Yerine ne kullanılır?
7. Next Header alanı ne işe yarar? IPv4'teki karşılığı nedir?
8. AAAA DNS kaydı nedir? Tip numarası kaçtır?
9. IPv6 Extension Header'ların amacı nedir? En az 3 tane say.
10. Dual-stack ağ nedir? Güvenlik açısından riski nedir?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. 128 bit. IPv4 32 bittir. IPv6'nın adres uzayı 2^128 = 340 undecillion adres içerir.
2. ARP'nin yerini alır. Neighbor Solicitation (Type 135) ve Neighbor Advertisement (Type 136) ICMPv6 tipleri kullanılır.
3. 40 byte sabit. IPv4 header 20-60 byte arasında değişken. IPv6'da header basitleştirilmiş ve sabit boyutlu yapılmıştır.
4. Kaç router'dan geçtiğini gösterir. Her router 1 azaltır. IPv4'teki TTL'nin (Time To Live) karşılığıdır.
5. Link-local adres. Sadece aynı ağ segmentinde (link) geçerlidir. Router'lar bu adresleri yönlendirmez. SLAAC ile otomatik atanır.
6. Hayır, broadcast yoktur. Yerine multicast kullanılır. ff02::1 = tüm düğümler, ff02::2 = tüm router'lar.
7. Üst katman protokolünü veya bir sonraki extension header'ı gösterir. IPv4'teki Protocol alanının karşılığıdır. Yaygın değerler: 6=TCP, 17=UDP, 58=ICMPv6.
8. IPv6 adresi için DNS kaydı. Tip numarası 28'dir. `dns.qry.type == 28` filtresi ile yakalanır.
9. IPv6 header'ı basit tutmak için opsiyonel bilgiler extension header'larda taşınır. Hop-by-Hop Options, Routing, Fragment, Authentication (AH), ESP (Encapsulating Security Payload), Destination Options.
10. IPv4 ve IPv6'nın aynı anda çalıştığı ağ. Güvenlik riski: IPv6 trafiği genellikle izlenmez, firewall kuralları IPv4 için yazılır, IPv6 saldırıları tespit edilemeyebilir.

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
