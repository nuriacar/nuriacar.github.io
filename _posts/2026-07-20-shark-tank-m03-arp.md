---
layout: post
title:  "shark-tank - m03: ARP Analizi"
date:   2026-07-20 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 03: ARP Analizi

**Neden?** Bir sabah şirkette internet yavaşladı. Kullanıcılar login olamıyor. IT ekibi bir cihazın ağdaki tüm trafiği kendi üzerinden geçirdiğini fark etti: ARP spoofing. Saldırgan önce ağda kimin ayakta olduğuna bakmış (ARP keşfi), sonra sahte ARP yanıtları göndererek trafiği kendi makinesine yönlendirmiş. HTTP şifrelerini, FTP oturumlarını, TLS ile şifrelense bile SNI bilgilerini görebilir. Ettercap, Bettercap, arpspoof gibi araçlar ARP zehirlemeyle çalışır. Bu modülde, saldırganın keşif taramasından zehirlemeye kadar tüm ARP izlerini Wireshark'ta adım adım tespit etmeyi öğreneceksin.

**Görev:** ARP trafiğini analiz et. MAC-IP eşleştirmesinde anomali var mı?

**Öğrenim Hedefleri:**
- ARP request/reply ve broadcast/unicast ayrımını yapabilmek
- ARP ile host keşfi (sweep) izini tanımak ve normal sorgudan ayırt edebilmek
- ARP cache ve MAC-IP eşlemesini okuyabilmek
- Gratuitous ARP'yi tanımak ve normal ARP'den ayırt edebilmek
- ARP spoofing/poisoning saldırısını tespit edebilmek
- Wireshark Name Resolution özelliklerini ve forensic analizdeki risklerini bilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **ARP** | Address Resolution Protocol: Aynı yerel ağ (LAN) üzerinde, bilinen bir IP adresine karşılık gelen MAC adresini bulmak için kullanılan protokol. Bir cihaz başka bir cihazla iletişim kurmadan önce onun MAC adresini bilmelidir, çünkü Ethernet çerçeveleri MAC adresleriyle teslim edilir. ARP, "Bu IP adresi kimin?" diye tüm ağa sorar (broadcast) ve ilgili cihaz "Benim, MAC adresim şu" diye yanıt verir. Her cihaz bu eşleşmeleri ARP cache adı verilen geçici bir tabloda saklar. Saldırganlar sahte ARP yanıtları göndererek trafiği kendilerine yönlendirebilir (ARP spoofing). |
| **MAC adresi** | Media Access Control: Bir ağ kartının donanımsal fiziksel adresi. 6 byte (48 bit) uzunluğundadır ve `aa:bb:cc:dd:ee:ff` biçiminde yazılır. Her ağ kartı fabrikadan çıkarken benzersiz bir MAC adresi alır; teoride değişmez, ama işletim sistemi seviyesinde geçici olarak değiştirilebilir. Ethernet (Layer 2) trafiği MAC adresleriyle çalışır: Aynı yerel ağdaki iki cihaz birbirlerini MAC adresleriyle bulur ve veri gönderir. |
| **broadcast** | Bir ağdaki tüm cihazlara aynı anda gönderilen mesaj. Ethernet'te broadcast adresi `ff:ff:ff:ff:ff:ff`'dir ve bu adresi hedefleyen her çerçeve ağdaki tüm cihazlara iletilir. ARP Request her zaman broadcast olarak gönderilir çünkü soran cihaz hedefin MAC adresini henüz bilmez ve "bu IP kimin?" sorusunu herkese sormak zorundadır. Broadcast trafiği tüm cihazları ilgilendirdiği için yerel ağdaki trafik miktarını artırır; bu yüzden router'lar broadcast trafiğini diğer ağlara geçirmez. |
| **unicast** | Bir gönderenin, yalnızca tek bir hedef cihaza gönderdiği mesaj. Normal veri trafiğinin (HTTP, DNS, FTP vb.) tamamı unicast'tir. ARP Reply unicast olarak gönderilir çünkü artık isteyen cihazın MAC adresi bilinmektedir ve yanıtı sadece ona iletmek yeterlidir. Broadcast'den farkı: Herkes değil, sadece bir cihaz mesajı alır. |
| **ARP cache** | Bir cihazın öğrendiği IP-MAC eşleşmelerini sakladığı geçici bellek tablosu. Her ARP sorgusu/cevabından sonra cihaz, bulunan IP-MAC çiftini bu tabloya kaydeder ve bir sonraki seferde tekrar ARP sormasına gerek kalmaz. Tablodaki kayıtların bir ömrü (cache timeout) vardır: Tipik olarak birkaç dakika ile birkaç saat arasında: Süresi dolan kayıtlar silinir ve tekrar ARP sorgusu gerekir. Windows'ta `arp -a`, Linux/macOS'ta `arp -a` veya `ip neigh` komutuyla görüntülenebilir. |
| **gratuitous ARP** | Bir cihazın, kimse sormadan, kendi IP-MAC eşleşmesini tüm ağa duyurduğu ARP mesajı. Request veya Reply biçiminde gönderilebilir; kaynak IP ve hedef IP aynıdır: Yani cihaz "Ben bu IP'ye sahibim!" diye broadcast yapar. Normal kullanımı: IP değişikliği bildirimi, IP çakışması tespiti, HA (High Availability) failover sonrası yeni aktif cihazın kendini tanıtması. Ancak saldırganlar da gratuitous ARP kullanarak tüm trafiği kendilerine çekmeye çalışabilir. Wireshark'ta kaynak IP = hedef IP olan ARP paketleri olarak görülür. |
| **ARP spoofing** | Saldırganın, kendisine ait olmayan bir IP adresinin MAC adresinin kendi MAC adresi olduğunu sahte ARP yanıtlarıyla ağa bildirmesi. Amaç, hedef cihazın trafiğini saldırgana yönlendirmektir. Saldırgan ağ geçidinin (gateway) IP'sini sahtelerse, kurban cihaz tüm internet trafiğini önce saldırgana gönderir; saldırgan bu trafiği okuyup (MITM) sonra gerçek ağ geçidine iletir. Wireshark'ta bir IP adresi için iki farklı MAC adresi görünmesi bu saldırının temel göstergesidir. `arp.duplicate-address-detected` filtresi ile otomatik tespit edilebilir. |

## Teori

ARP (Address Resolution Protocol), IP adresini MAC adresine çevirir.
- **Layer 2** protokolüdür (Ethernet katmanı)
- **Sadece local ağda** çalışır (router'lar arası çalışmaz)
- Her cihaz bir **ARP cache** (tablo) tutar

### ARP Süreci:
```text
CİHAZ A (172.50.2.100)                    CİHAZ B (172.50.2.10)
  |--- ARP Request: "Kim 172.50.2.10?" -->|   (Broadcast - herkese)
  |<-- ARP Reply: "Benim! MAC=aa:bb:cc" --|   (Unicast - isteyene)
```

- **ARP Request**: Broadcast (ff:ff:ff:ff:ff:ff) - tüm ağa sorulur
- **ARP Reply**: Unicast - sadece sorana cevap verilir

> **İstihbarat İşaretleri, ARP saldırıları MITM'ın ilk adımıdır:**
>
> - Aynı IP için **iki farklı MAC** = ARP spoofing (olası MITM)
> - ARP Request **hedef IP = kaynak IP** = Gratuitous ARP (failover veya saldırı)
> - ff:ff:ff:ff:ff:ff hedef = broadcast (normal ARP Request)
> - Tek bir MAC'in **çok fazla IP'ye** cevap vermesi = ARP flooding

## Hazırlık

```sh
# ARP trafiği üret:
./scripts/generate-traffic.sh arp

# Wireshark ile aç:
# macOS: open -a Wireshark module-03-arp.pcap
# Linux: wireshark module-03-arp.pcap &
# Windows: start wireshark module-03-arp.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

> **Not:** Docker kendi ARP yönetimini yaptığı için, bu modülde ARP cache flush + ping yapılarak zorla ARP trafiği üretilir.
>
> Pcap'te ARP Request/Reply çiftleri ve gratuitous ARP görülür.

## Alıştırma 1: ARP Request Yakala

### Filtre:
```text
arp.opcode == 1    # ARP Request
```

### ARP Request Detayları:
```text
 v Address Resolution Protocol
     Hardware type: Ethernet (1)
     Protocol type: IPv4 (0x0800)
     Hardware size: 6                         # MAC = 6 byte
     Protocol size: 4                         # IP = 4 byte
     Opcode: request (1)                      # REQUEST
     Sender MAC address: aa:bb:cc:dd:ee:ff    # Kim soruyor?
     Sender IP address: 172.50.2.100          # Soranın IP'si
     Target MAC address: 00:00:00:00:00:00    # bilinmiyor
     Target IP address: 172.50.2.10           # Kimin MAC'i isteniyor?
```

> **SINAV İPUCU:** ARP Request'te Target MAC = 00:00:00:00:00:00 çünkü bu bilgi isteniyor!
>
> Eğer bilinseydi sorulmazdı.

### Ethernet katmanı:
```text
 v Ethernet II
     Source: aa:bb:cc:dd:ee:ff                # Gönderenin MAC'i
     Destination: ff:ff:ff:ff:ff:ff           # BROADCAST (herkese)
```

> **SINAV İPUCU:** ARP Request HER ZAMAN broadcast'tir (ff:ff:ff:ff:ff:ff).

## Alıştırma 2: ARP Reply Yakala

### Filtre:
```text
arp.opcode == 2    # ARP Reply
```

```text
 v Address Resolution Protocol
     Opcode: reply (2)                        # REPLY
     Sender MAC address: 11:22:33:44:55:66    # Cevap verenin MAC'i
     Sender IP address: 172.50.2.10           # Bu IP'ye ait MAC:
     Target MAC address: aa:bb:cc:dd:ee:ff    # İsteyenin MAC'i
     Target IP address: 172.50.2.100          # İsteyenin IP'si
```

> **SINAV İPUCU:** ARP Reply UNICAST'tir (sadece sorana gider).

## Alıştırma 3: Gratuitous ARP

### Filtre:
```text
arp.src.proto_ipv4 == arp.dst.proto_ipv4
```

> **Not:** Bu lab'da gratuitous paketleri Reply biçiminde (opcode=2) gönderilir; bu yüzden filtreye opcode şartı eklenmez.

Gratuitous ARP = bir cihazın "Ben bu IP'ye sahibim!" diye broadcast yapması.
- IP değişikliğinde
- IP çakışmasını önlemek için
- HA (High Availability) failover'da

## Alıştırma 4: ARP ile Host Keşfi (Sweep)

Zehirleme başlamadan ÖNCE saldırgan ağda kimin ayakta olduğunu tarar. ARP,
bu keşfin sessiz aracıdır: `nmap -sn 172.50.2.10-20` komutu yerel ağda
ARP request'leri fırlatır — cevap veren IP'ler "canlı host" listesine girer.
Bizim pcap'te bu tarama poisoning'den birkaç saniye önce yapılmıştır.

### Filtre:
```text
arp.opcode == 1 && arp.src.proto_ipv4 == 172.50.2.200
```

`172.50.2.200` saldırgan makinesidir. Bu filtre, SADECE saldırganın
gönderdiği ARP request'lerini gösterir.

### Ne Görmelisin?
- Saldırganın tek MAC adresinden (`arp.src.hw_mac`) çıkan **ardışık IP'lere**
  (`172.50.2.10`, `172.50.2.11`, `172.50.2.12`...) giden onlarca request
- Hepsi broadcast (`ff:ff:ff:ff:ff:ff`) hedefli
- Cevap verenlerin ARP Reply ile döndüğü:
  ```text
  arp.opcode == 2 && arp.dst.proto_ipv4 == 172.50.2.200
  ```

### Sweep'i Normal ARP'den Nasıl Ayırt Edersin?
| Özellik | Normal Kullanıcı ARP | ARP Sweep |
|---------|----------------------|-----------|
| Zaman deseni | Tekrarlayan, ihtiyaç anında | Sık aralıklı, ardışık IP'lere seri |
| Hedef çeşitliliği | 1-2 bilinen adres (gateway, DNS) | /24'ün tamamı veya geniş aralık |
| Kaynak | Çok sayıda farklı MAC | Tek MAC (tarayıcı) |

**tshark teyidi:**
```sh
tshark -r shared/pcaps/module-03-arp.pcap -Y \
  'arp.opcode == 1 && arp.src.proto_ipv4 == 172.50.2.200' \
  -T fields -e arp.dst.proto_ipv4 | sort -u | wc -l
```
Çıktı, saldırganın sorduğu **benzersiz IP sayısını** verir (lab'da 10+).
Bir kullanıcının "klavyesinden" çıkmayacak kadar çok hedef = keşif taraması.

**SINAV İPUCU:** "Hangi IP aralığı tarandı?" sorusunda saldırganın
sorduğu en küçük ve en büyük hedef IP'yi bu filtreyle bul: aradaki
aralık taramanın kapsamıdır. Keşif, kill chain'in ilk adımıdır
(Modül 28'de tekrar karşına çıkacak).

## Alıştırma 5: ARP Poisoning Anomalisi

Normal ARP:
- Her IP için 1 MAC adresi var

ARP Poisoning:
- Aynı IP için birden fazla farklı MAC adresi görünür

### Filtre (şüpheli ARP):
```text
arp.duplicate-address-detected
```

> **SINAV İPUCU:** ARP poisoning tespiti sınavda çıkabilir.
>
> Aynı IP için farklı MAC = ARP spoofing olabilir.

### ARP Poisoning Simülasyonu

Bu pcap'te ARP poisoning **yoktur**. Docker ağ katmanı kendi ARP tablosunu yönetir ve sahte ARP yanıtlarını (scapy, arpspoof ile gönderilsin bile) filtreler. Bu, Docker'ın güvenlik tasarımının bir parçasıdır.

**Gerçek dünyada ARP poisoning şu görünür:**

```text
Normal:
  172.50.2.1 → MAC: aa:bb:cc:dd:ee:ff (Gateway)

Poisoned:
  172.50.2.1 → MAC: aa:bb:cc:dd:ee:ff (Gerçek Gateway)
  172.50.2.1 → MAC: 11:22:33:44:55:66 (Saldırgan!) ← İKİ FARKLI MAC!
```

Wireshark otomatik olarak `arp.duplicate-address-detected` analiziyle bu durumu işaretler.

**Gerçek ağda nasıl test edilir:**

```sh
# 1. arpspoof (dsniff paketi):
sudo apt-get install dsniff
sudo arpspoof -i eth0 -t <kurban_IP> <gateway_IP>

# 2. bettercap (modern araç):
sudo apt-get install bettercap
sudo bettercap -iface eth0
> net.probe on
> set arp.spoof.targets <kurban_IP>
> arp.spoof on

# 3. ettercap (GUI + CLI):
# Not: ettercap'ta /IP// biçimi: port boş bırakılır.
sudo ettercap -T -i eth0 -M arp /<gateway_IP>// /<kurban_IP>//

# Wireshark tespit filtreleri:
arp.src.proto_ipv4 == "<gateway_IP>"
arp.duplicate-address-detected
```

**Sınavda bilmen gerekenler:**
- Aynı IP → iki farklı MAC = ARP poisoning
- `arp.duplicate-address-detected` Wireshark filtresi otomatik tespit yapar
- Çözüm: Dynamic ARP Inspection (DAI), statik ARP girişleri, DHCP Snooping

> **Not:** Bu laboratuvarda ARP poisoning simülasyonu yapılamaz çünkü Docker bridge ağ sürücüsü ARP yanıtlarını doğrular.
>
> Gerçek bir ağda (fiziksel switch + cihazlar) yukarıdaki araçlarla test edebilirsin.
>
> Sanal makine (VirtualBox/VMware internal network) ortamında da çalışır.

## Hızlı Referans - ARP Filtreleri

```text
# Tüm ARP
arp

# Request ve Reply
arp.opcode == 1                        # Request
arp.opcode == 2                        # Reply

# Belirli IP için ARP
arp.src.proto_ipv4 == "172.50.2.10"    # Kaynak IP
arp.dst.proto_ipv4 == "172.50.2.10"    # Hedef IP

# Belirli MAC
arp.src.hw_mac == "aa:bb:cc:dd:ee:ff"

# Broadcast (ARP Request)
eth.dst == ff:ff:ff:ff:ff:ff

# ARP anomaly
arp.duplicate-address-detected         # IP çakışması
arp.duplicate-address-frame            # MAC çakışması
```

## Ek: Local Ağda ARP İnceleme

Docker dışında, local ağında da ARP görebilirsin:
1. Wireshark'ı aç
2. Wi-Fi ağ arayüzünde capture başlat (`en0` macOS, `wlan0` Linux)
3. Başka bir terminal'de: `ping <local-ağdaki-başka-ip>`
4. ARP Request ve Reply paketlerini göreceksin

## Alıştırma 6: ARP Cache Okuma

Her cihaz bir ARP cache (tablo) tutar. Windows'ta `arp -a`, Linux/macOS'ta `arp -a` veya `ip neigh` ile görülür.

### Client ARP Cache:
```text
docker exec shark-tank-client arp -a
docker exec shark-tank-client ip neigh
```

MAC-IP eşlemesini Wireshark'ta da görebilirsin:
1. Bir ARP paketine tıkla
2. **Ethernet** katmanında Source/Destination MAC'i not et
3. **Internet Protocol** katmanında Source/Destination IP'yi not et
4. Hangi IP hangi MAC'e ait? ARP cache'dekiyle eşleşiyor mu?

### Örnek:
```text
IP: 172.50.2.10  →  MAC: 02:42:ac:14:02:0a  (Web sunucusu)
IP: 172.50.2.100 →  MAC: 02:42:ac:14:02:64  (Client)
```

> **SINAV İPUCU:** ARP cache zehirlenmişse (poisoned), aynı IP farklı MAC gösterir. `arp -a` çıktısını normal ARP yanıtlarıyla karşılaştır.

## Alıştırma 7: Name Resolution (İsim Çözümleme)

Wireshark, IP ve MAC adreslerini okunabilir isimlere çevirebilir:

1. **View > Name Resolution > Resolve Physical Addresses**: MAC adreslerini üretici adına çevirir (OUI veritabanı)
   - Örnek: `02:42:ac:14:02:0a` → Docker varsayılan MAC
2. **View > Name Resolution > Resolve Network Addresses**: IP'yi hostname'e çevirir (DNS sorgusu yapar!)
   - **DİKKAT:** Bu seçenek DNS sorgusu gönderir: Forensic analizde KULLANMAYIN (ağ izlenimi bırakır)
3. **View > Name Resolution > Resolve Transport Addresses**: Port numaralarını servis adına çevirir
   - Örnek: Port 80 → "http", Port 443 → "https"

> **SINAV İPUCU:** Name Resolution forensic analizde kapatılmalıdır.
>
> DNS sorguları ağ izi bırakır.

## Sınav Soruları (Çöz)

1. ARP Request neden broadcast'tir? ARP Reply neden unicast'tir?
2. ARP Request'te Target MAC adresi neden 00:00:00:00:00:00?
3. Bir cihazın ARP tablosu (cache) ne ise yarar? Neden her seferinde ARP sormaz?
4. ARP poisoning nasıl tespit edilir Wireshark'ta?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. Request broadcast çünkü hedef MAC henüz bilinmiyor. Reply unicast çünkü artık istek sahibinin MAC'i biliniyor.
2. Çünkü bu değer bilinmiyor: ARP sorusu soruluyor, cevap henüz yok.
3. IP-MAC eşleştirmesini saklar, her seferinde ARP sormayı önler. Performansı artırır. Cache süresi genellikle 60-1200 saniye.
4. Aynı IP için farklı MAC adresleri gelmesi. `arp.duplicate-address-detected` filtresi kullanılır. Wireshark kırmızı renk gösterebilir.

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
