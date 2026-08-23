---
layout: post
title:  "shark-tank - m04: DHCP Analizi"
date:   2026-07-21 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 04: DHCP Analizi

**Neden?** Ofiste bazı bilgisayarlar internete çıkamıyor. DHCP server'dan IP alamıyorlar. Araştırınca ağda yetkisiz bir DHCP sunucusu çalıştığı ortaya çıkıyor. Rogue DHCP server saldırısında saldırgan ağa sahte bir DHCP sunucusu koyar. Kurbanlara sahte DNS (trafiği yönlendirmek için), sahte gateway (MITM için) ve sahte IP dağıtır. DHCP starvation ile gerçek sunucunun havuzu tüketilir, ardından sahte sunucu devreye girer. Bu modülde, rogue DHCP'yi tespit etmeyi öğreneceksin.

**Görev:** DHCP trafiğini analiz et. DORA sürecinde anomali var mı?

**Öğrenim Hedefleri:**
- DHCP DORA sürecini (Discover/Offer/Request/ACK) adım adım takip edebilmek
- DHCP option'larını (subnet mask, gateway, DNS, lease time) okuyabilmek
- 0.0.0.0 kaynağı ve UDP 67/68 portlarını anlamak
- Rogue DHCP server saldırısını tespit edebilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **DHCP** | Dynamic Host Configuration Protocol: Ağa bağlanan cihazlara otomatik olarak IP adresi, subnet mask, gateway ve DNS sunucu bilgisi atayan protokol. Bir cihaz ağa bağlandığında veya mevcut IP'sinin süresi dolduğunda DHCP sunucusuna başvurur ve gerekli ağ bilgilerini alır. UDP tabanlıdır; sunucu 67, istemci 68 portunu kullanır. İletişim broadcast ile başlar çünkü istemcinin henüz IP adresi yoktur. Wireshark'ta `dhcp` veya `bootp` filtresiyle görüntülenir. |
| **UDP** | User Datagram Protocol: Bağlantı kurmadan doğrudan veri gönderen hızlı protokol. Handshake yoktur, onay (ACK) beklenmez, kaybolan paketler yeniden gönderilmez. Bu sayede TCP'den çok daha hızlı ve düşük gecikmeli çalışır, ancak güvenilirlik garantisi yoktur. DNS sorguları, video streaming, VoIP ve çevrimiçi oyunlar gibi hızın güvenilirlikten önemli olduğu uygulamalar UDP kullanır. Başlığı (header) sadece 8 byte'tır; TCP'nin minimum 20 byte'ına kıyasla çok daha hafiftir. |
| **broadcast** | Bir ağdaki tüm cihazlara aynı anda gönderilen mesaj. Ethernet'te broadcast adresi `ff:ff:ff:ff:ff:ff`'dir ve IP seviyesinde `255.255.255.255` kullanılır. DHCP Discover ve Request mesajları broadcast olarak gönderilir çünkü istemcinin henüz IP adresi yoktur ve "bir bana IP verecek sunucu var mı?" sorusunu tüm ağa sormak zorundadır. Router'lar broadcast trafiğini diğer ağlara geçirmez; bu yüzden DHCP sadece aynı yerel ağda çalışır. |
| **DORA** | DHCP'nin dört adımlı IP atama sürecinin kısaltması: Discover, Offer, Request, ACK. İstemci önce ağda bir DHCP sunucusu arar (Discover), sunucu kullanılabilir bir IP önerir (Offer), istemci bu IP'yi istediğini bildirir (Request) ve sunucu onaylar (ACK). Bu sıra her zaman aynıdır. Birden fazla DHCP sunucusu varsa, istemci birden fazla Offer alabilir ama sadece birini Request ile seçer. Wireshark'ta `dhcp.option.dhcp` filtresiyle her adım ayrı ayrı izlenebilir. |
| **subnet mask** | Bir IP adresinin ağ kısmını ve cihaz kısmını ayıran maske. IPv4'de genellikle `255.255.255.0` gibi bir değerle ifade edilir veya CIDR gösterimiyle `/24` olarak yazılır. Cihaz, hedef IP adresi ile kendi IP adresini subnet mask ile karşılaştırarak hedefin aynı yerel ağda mı yoksa farklı bir ağda mı (router gerekiyor mu) olduğunu belirler. DHCP aracılığıyla otomatik olarak dağıtılır (DHCP Option 1). |
| **gateway** | Bir ağdan dışarıya, yani başka ağlara veya internete çıkış noktası olarak kullanılan router'ın IP adresi. Aynı yerel ağdaki cihazlar birbiriyle doğrudan iletişim kurabilir, ancak farklı ağdaki bir cihaza ulaşmak için trafik gateway'e gönderilir ve gateway trafiği doğru yöne iletir. DHCP aracılığıyla otomatik olarak dağıtılır (DHCP Option 3, "Router" olarak da adlandırılır). Saldırgan rogue DHCP ile yanlış gateway IP'si dağıtarak tüm trafiği kendisine yönlendirebilir. |
| **lease time** | DHCP tarafından atanan IP adresinin geçerli olduğu süre (saniye cinsinden). Lease time dolmadan önce istemci, süreyi yenilemek (renew) için sunucuya DHCP Request gönderir. Tipik değer 24 saat (86400 saniye) olmakla birlikte ağ politikasına göre değişebilir. İstemci ağdan ayrılıp lease time içinde geri dönmezse, IP adresi havuza geri döner ve başka bir cihaza atanabilir. Wireshark'ta DHCP Option 51 alanında görülür. |
| **Transaction ID (XID)** | Bir DHCP oturumunu benzersiz şekilde tanımlayan 4 byte'lık kimlik numarası. İstemci Discover mesajını gönderirken rastgele bir Transaction ID üretir ve aynı oturumdaki tüm mesajlar (Discover, Offer, Request, ACK) aynı Transaction ID'yi taşır. Birden fazla cihaz aynı anda DHCP işlemi yaptığında, Wireshark Transaction ID'ye göre mesajları birbiriyle eşleştirir. `bootp.id == 0x12345678` filtresiyle belirli bir oturum izlenebilir. |
| **MAC adresi** | Media Access Control: Bir ağ kartının donanımsal fiziksel adresi. 6 byte (48 bit) uzunluğundadır ve `aa:bb:cc:dd:ee:ff` biçiminde yazılır. Her ağ kartı fabrikadan çıkarken benzersiz bir MAC adresi alır; teoride değişmez, ama işletim sistemi seviyesinde geçici olarak değiştirilebilir. Ethernet (Layer 2) trafiği MAC adresleriyle çalışır: Aynı yerel ağdaki iki cihaz birbirlerini MAC adresleriyle bulur ve veri gönderir. |

## Teori

DHCP (Dynamic Host Configuration Protocol), cihazlara otomatik IP adresi atar.
- **Port:** 67 (sunucu), 68 (istemci)
- **UDP** tabanlı
- **Broadcast** kullanır (çünkü istemcinin henüz IP'si yok!)

### DORA Süreci (4 Adım):

```text
İSTEMCİ (0.0.0.0)                    DHCP SUNUCU
  |--- DISCOVER (broadcast) -------->|    1. "Bir IP adresi var mı?"
  |<-- OFFER ------------------------|    2. "Bu IP'yi al: 172.50.9.50"
  |--- REQUEST (broadcast) --------->|    3. "Bu IP'yi istiyorum!"
  |<-- ACK --------------------------|    4. "Tamam, bu IP senin!"
```

### DHCP Paket Yapısı:
```text
v Dynamic Host Configuration Protocol
    Message type: Boot Request (1) / Boot Reply (2)
    Hardware type: Ethernet
    Hardware address length: 6
    Transaction ID: 0xXXXXXX            <-- Oturum ID
    Seconds elapsed: 0
    Client IP address: 0.0.0.0          <-- Henüz IP yok!
    Your (client) IP address: 0.0.0.0
    Next server IP address: 0.0.0.0
    Client MAC address: aa:bb:cc:dd:ee:ff
    v Option: (53) DHCP Message Type
        Value: Discover (1) / Offer (2) / Request (3) / ACK (5)
    v Option: (54) DHCP Server Identifier
        Value: 172.50.9.2
    v Option: (1) Subnet Mask
        Value: 255.255.255.0
    v Option: (3) Router
        Value: 172.50.9.1
    v Option: (6) Domain Name Server
        Value: 172.50.2.11
    v Option: (51) IP Address Lease Time
        Value: 600 (10 dakika)
```

> **İstihbarat İşaretleri, DHCP saldırıları kurumsal ağlarda yaygındır:**
>
> - **İki farklı DHCP sunucusundan Offer** = Rogue DHCP
> - Source IP `0.0.0.0` = Normal (istemci henüz IP almadı)
> - DHCP Offer'da **yanlış gateway IP** = Trafik yönlendirme (MITM)
> - Çok sayıda DHCP Request ama ACK yok = DHCP starvation saldırısı

## Hazırlık

```sh
# DHCP trafiği üret:
./scripts/generate-traffic.sh dhcp

# Wireshark ile aç:
# macOS: open -a Wireshark module-04-dhcp.pcap
# Linux: wireshark module-04-dhcp.pcap &
# Windows: start wireshark module-04-dhcp.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

## Alıştırma 1: DHCP Discover

### Filtre:
```text
dhcp.option.dhcp == 1    # Discover
```

İncelenecek alanlar:
- **Source IP: 0.0.0.0** (istemcinin IP'si yok!)
- **Destination IP: 255.255.255.255** (broadcast)
- **Source MAC:** İstemcinin MAC adresi
- **Transaction ID:** Bu oturumun benzersiz ID'si

> **SINAV İPUCU:** DHCP Discover'da src IP = 0.0.0.0 çünkü istemcinin henüz IP'si yok.

## Alıştırma 2: DHCP Offer

### Filtre:
```text
dhcp.option.dhcp == 2    # Offer
```

- **Offered IP:** `dhcp.option.requested_ip_address` veya `dhcp.ip.your`
- **Subnet Mask:** Option 1
- **Router (Gateway):** Option 3
- **DNS Server:** Option 6
- **Lease Time:** Option 51

> **SINAV İPUCU:** DHCP Offer sunucunun verdiği TÜM ağ bilgilerini içerir.

## Alıştırma 3: DHCP Request

### Filtre:
```text
dhcp.option.dhcp == 3    # Request
```

- İstemci sunucunun sunduğu IP'yi **onaylıyor**
- **Requested IP Address:** Option 50
- **Server Identifier:** Option 54 (hangi sunucudan alıyor)

> **SINAV İPUCU:** Neden Discover'dan sonra tekrar Request?
>
> Çünkü birden fazla DHCP sunucusu Offer göndermiş olabilir. İstemci birini seçer ve "bu sunucudan bu IP'yi istiyorum" der.

## Alıştırma 4: DHCP ACK

### Filtre:
```text
dhcp.option.dhcp == 5    # ACK
```

- Sunucu "Tamam, bu IP senin" diyor
- Lease time başlar

> **SINAV İPUCU:** DORA = Discover, Offer, Request, ACK. Bu sıra her zaman böyledir.

## Alıştırma 5: DHCP Options Analizi

DHCP'de en önemli bilgi **options** alanındadır:

| Option | Ad | Açıklama |
|--------|-----|----------|
| 1 | Subnet Mask | 255.255.255.0 |
| 3 | Router | Gateway IP |
| 6 | DNS | DNS sunucu IP |
| 12 | Host Name | İstemcinin adı |
| 15 | Domain Name | Domain |
| 51 | Lease Time | IP kullanım süresi |
| 53 | DHCP Type | Discover/Offer/Request/ACK |
| 54 | Server ID | DHCP sunucu IP |
| 50 | Requested IP | İstemcinin istediği IP |

## Alıştırma 6: DHCP Release ve Renew

### Release:
```text
dhcp.option.dhcp == 7    # Release
```
- İstemci "Bu IP'yi bırakmak istiyorum" der

### Renew:
- İstemci lease time'in yarısında sunucuya Request gönderir
- Lease time dolmadan IP'yi yeniler

### IPv6 Tarafı: DHCPv6 ve SLAAC

IPv4'teki DHCP'nin IPv6 karşılığı **DHCPv6**'dır (UDP 546/547, mesaj
tipleri 1=Solicit, 2=Advertise, 3=Request, 5=Reply):
```text
dhcpv6           # Wireshark filtresi
icmpv6.type == 133   # Router Solicitation (SLAAC yolunu tetikler)
```

İki fark sık sorulur:

| Özellik | DHCP (IPv4) | DHCPv6 / SLAAC (IPv6) |
|---------|-------------|----------------------|
| Adres kaynağı | Her zaman sunucu | Ya sunucu (stateful DHCPv6) ya router duyurusu (SLAAC, stateless) |
| Broadcast | Discover broadcast'tir | Multicast (ff02::1:2 DHCPv6 relay / ff02::1:ffxx:xxxx DAD) |
| Kimlik | MAC (chaddr) | DUID + IAID |

Analist için pratik değer: Bir IPv6 istemci gördüğünde adresin SLAAC mı
DHCPv6 mı olduğunu RA'daki M/O bitleri belirler (Modül 7). Bu lab'ın
DHCP hattı IPv4'tür; IPv6 tarafı Modül 7'de ele alınır.

## Hızlı Referans - DHCP Filtreleri

```text
# Tüm DHCP
dhcp
bootp

# DHCP mesaj tipleri
dhcp.option.dhcp == 1                       # Discover
dhcp.option.dhcp == 2                       # Offer
dhcp.option.dhcp == 3                       # Request
dhcp.option.dhcp == 5                       # ACK
dhcp.option.dhcp == 6                       # NAK
dhcp.option.dhcp == 7                       # Release
dhcp.option.dhcp == 8                       # Inform

# Belirli IP ile
dhcp.option.requested_ip_address == 172.50.9.50
dhcp.ip.your == 172.50.9.50                # Offered/Assigned IP

# Belirli MAC
dhcp.hw.addr == aa:bb:cc:dd:ee:ff

# Belirli DHCP sunucu
dhcp.option.dhcp_server_id == 172.50.9.2

# Transaction ID ile
bootp.id == 0x12345678

# Broadcast
ip.dst == 255.255.255.255
```

## Alıştırma 7: İstatistikler ve Yanıt Süresi

### Statistics → DHCP (BOOTP):

1. **Statistics → DHCP (BOOTP)** (tshark: `-z dhcp,stat`)
2. Tüm DHCP mesaj tiplerini sayar: Bu pcap'te 4 Discover, 2 Offer, 4 Request, 2 ACK — iki tam DORA turu (yeniden üretimde sayılar değişebilir)
3. Discover sayısı ACK sayısından fazlaysa yarım kalan/anormal süreç araştır

### Service Response Time Hakkında Dürüst Not:

Wireshark'ın **Service Response Time** istatistiği her protokol için yoktur. Var olanlar arasında LDAP, Kerberos, SMB/SMB2 (modül 17-19'in protokolleri), RPC, SNMP ve ICMP sayılabilir; **DHCP için yoktur.** DHCP sunucu gecikmesi gerekirse Discover ile Offer paketlerinin zaman damgaları karşılaştırılarak (Time sütunu) manuel hesaplanır.

## Sınav Soruları (Çöz)

1. DORA sürecinin 4 adımını sırayla yaz.
2. DHCP Discover'da kaynak IP neden 0.0.0.0?
3. DHCP Offer'da sunulan IP nedir? Hangi option'da geçer?
4. Lease time kaç saniye? Bu kaç saat eder?
5. İstemci neden Offer'dan sonra tekrar Request gönderir?
6. DHCP hangi transport protokolünü kullanır? (UDP mi TCP mi?) Port numaraları nedir?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. Discover → Offer → Request → ACK
2. Çünkü istemcinin henüz IP adresi yok. İlk kez ağa bağlanıyor.
3. yiaddr (Your IP Address) alanında sunulan IP görünür. Option 50 (Requested IP Address) ise Request mesajında kullanılır.
4. 600 saniye (10 dakika). dhcpd.conf'ta `default-lease-time 600` olarak tanımlı. Production'da genellikle 86400 saniye (24 saat) kullanılır.
5. Birden fazla DHCP sunucu Offer gönderebilir. İstemci birini seçip Request ile onaylar.
6. UDP. Port 67 (sunucu), 68 (istemci).

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
