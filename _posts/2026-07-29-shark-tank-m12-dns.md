---
layout: post
title:  "shark-tank - m12: DNS Analizi"
date:   2026-07-29 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 12: DNS Analizi

**Neden?** Şirket verilerinin sızdığı tespit edildi. Ama güvenlik duvarı HTTP/HTTPS dışındaki çıkışları engelliyor. Saldırgan DNS sorgularının içine veri gizlemiş. DNS, saldırganın en sevdiği protokoldür. DNS tunneling ile veri sızdırma (iodine, dnscat2): Sorgu alan adlarına base64 ile veri gizlenir. DNS cache poisoning (Kaminsky attack) ile kullanıcılar sahte sitelere yönlendirilir. DNS amplification DDoS ile büyük çaplı saldırılar düzenlenir. Bu modülde, DNS trafiğini analiz ederek tunneling'i yakalamayı öğreneceksin.

**Görev:** DNS trafiğini analiz et. Query/response eşleştir. Şüpheli sorguları tespit et.

**Öğrenim Hedefleri:**
- DNS query/response ve Transaction ID eşleştirmesini yapabilmek
- DNS kayıt tiplerini (A, AAAA, CNAME, MX, NS, TXT) tanıyıp ayırt edebilmek
- NXDOMAIN (bulunamadı) ve NOERROR (başarılı) yanıtlarını yorumlayabilmek
- DNS tunneling (iodine, dnscat2) ile veri sızma girişimini tespit edebilmek
- DNS cache poisoning (Kaminsky attack) prensibini anlamak
- DNS sorgu süresi analizi, UDP vs TCP farkı ve Statistics > DNS kullanımını bilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **DNS** | Domain Name System: İnsan tarafından okunabilir alan adlarını (örn. `web.shark-tank.local`) IP adreslerine (örn. `172.50.2.10`) çeviren sistem. Cihazlar birbiriyle IP adresleriyle iletişim kurar, ama insanlar alan adlarını hatırlar; DNS bu çeviriyi yapar. Port 53 kullanır ve normalde UDP üzerinden çalışır. Güvenlik açısından DNS, veri sızdırmak (DNS tunneling) veya kullanıcıları sahte sitelere yönlendirmek (DNS poisoning) için istismar edilebilen bir protokoldür. |
| **DNS kayıt tipleri** | DNS sisteminde her alan adının farklı türde bilgiler içeren kayıtları vardır. A kaydı, bir alan adını IPv4 adresine çevirir (en yaygın tür). AAAA kaydı IPv6 adresine çevirir. CNAME (Canonical Name), bir alan adını başka bir alan adına yönlendirir: Alias (takma ad) görevi görür; örneğin `www.shark-tank.local` → `web.shark-tank.local`. MX (Mail Exchange), bir alan adı için e-posta sunucusunu belirtir. NS (Name Server), bir alan adının DNS sunucusunu belirtir. TXT (Text), alan adına serbest metin ekler; SPF, DKIM gibi e-posta güvenlik kayıtları TXT olarak tutulur. |
| **NXDOMAIN** | Non-Existent Domain: Sorgulanan alan adının DNS'te bulunamadığını belirten DNS yanıt kodu (rcode 3). Bir istemci var olmayan bir alan adını sorguladığında DNS sunucusu NXDOMAIN yanıtı döner. Bu normal bir durumdur (kullanıcı yanlış yazmıştır), ancak çok sayıda NXDOMAIN yanıtı güvenlik açısından şüphelidir: Bir saldırgan mevcut subdomain'leri keşfetmeye çalışıyor olabilir (subdomain enumeration) veya DNS tunneling aracı yanlış sorgular üretiyor olabilir. Başarılı bir sorgunun yanıt kodu ise NOERROR (rcode 0)'dır. |
| **recursive query** | Bir DNS istemcisinin DNS sunucusuna sorduğu ve sunucunun cevabı nihai olarak bulana kadar diğer DNS sunucularına da soru sormasını beklediği sorgu türü. Örneğin istemci "google.com nedir?" diye sorar; yerel DNS sunucusu cevabı bilmiyorsa, önce root DNS sunucusuna, sonra TLD sunucusuna, sonra authoritative sunucusuna sırayla sorar ve nihai cevabı istemciye döner. İstemcinin tek bir sorgu gönderip tam cevap aldığı bu model, recursive (özyinelemeli) olarak adlandırılır. Wireshark'ta genellikle sadece istemci-sunucu arasındaki tek sorgu ve nihai yanıt görülür; sunucunun arka planda yaptığı diğer sorgular görünmez. |
| **DNS tunneling** | Veriyi DNS sorgularının içine gizleyerek güvenlik duvarlarını aşma tekniği. Çoğu ağ DNS trafiğine (port 53) izin verir çünkü internet erişimi için zorunludur. Saldırgan bu kuralı sömürür: Veriyi base64 ile encode edip bir subdomain gibi sorgular (örn. `c2RiYXNlNjRlbmNvZGVk.evil.com`). DNS sunucusu bu sorguyu saldırganın DNS sunucusuna iletir, saldırgan veriyi orada toplar. iodine ve dnscat2 bu teknikle çalışan en bilinen araçlardır. Wireshark'ta tespit için: Anormal uzun domain adları (`dns.qry.name.len > 30`), yüksek hacimli TXT sorguları ve bir IP'den ani DNS sorgu artışı aranır. |
| **Transaction ID** | Bir protokolde sorgu-yanıt eşleştirmesi için kullanılan benzersiz kimlik numarası. DNS'de her sorgu rastgele bir Transaction ID üretir ve yanıt aynı ID'yi taşır; Wireshark bu ID'ye bakarak hangi sorgunun hangi yanıtın karşılığı olduğunu eşleştirir. Eğer bir yanıtın Transaction ID'si beklenen sorgudan farklıysa, bu DNS spoofing girişimi olabilir. `dns.id == 0x1234` filtresiyle belirli bir sorgu-yanıt çifti izlenebilir. Transaction ID kavramı DHCP'de de benzer şekilde kullanılır (XID olarak adlandırılır). |

## Teori

DNS (Domain Name System), domain adlarını IP adreslerine çeviren sistemdir.
- **Port:** 53 (UDP veya TCP)
- **Query** (sorgu) -> **Response** (yanıt) eşleştirmesi
- Her sorguda bir **Transaction ID** vardır (query ve response'u eşleştirir)

### DNS Kayıt Tipleri:

| Tip | Anlamı | Örnek |
|-----|--------|-------|
| **A** | IPv4 adresi | web.shark-tank.local -> 172.50.2.10 |
| **AAAA** | IPv6 adresi | `fd00:2::10` (web.shark-tank.local) |
| **CNAME** | Takma ad (alias) | www -> web.shark-tank.local |
| **MX** | Mail sunucu | mail.shark-tank.local |
| **NS** | Name server | ns1.shark-tank.local |
| **TXT** | Metin kaydı | (yok) |
| **RRSIG** | DNSSEC imzası | (yok — lab DNSSEC'siz; bkz. aşağıdaki not) |

### DNSSEC, DoH ve DoT: Güvenli DNS'in Üç Yüzü

| Teknoloji | Neyi Çözer | Wireshark'ta Görünüm |
|-----------|-----------|----------------------|
| **DNSSEC** | Yanıt sahteciliği: RRSIG (imza), DNSKEY, DS kayıtlarıyla yanıtlar imzalanır | `dns.qry.type == 46` (RRSIG), `== 48` (DNSKEY); yanıtlarda `dns.flags.authenticated_data == 1` (AD bit) |
| **DoT** (DNS over TLS) | Sorgunun dinlenmesi: TLS tüneline alınır | 853/TCP portu: `tcp.port == 853` — içerik şifreli |
| **DoH** (DNS over HTTPS) | Sorgunun "web trafiği gibi" saklanması: 443 üzerinden HTTP/2+TLS | DNS başlığı TLS içinde gizli; tespit imzası bilinen genel çözümleyici IP'lerine (1.1.1.1, 8.8.8.8) 443 trafiği: `tls && ip.addr == 1.1.1.1` |

Analist gerçeği: Bu lab'ın DNS'i DNSSEC'sizdir (RRSIG görmezsin — gerçeğe
uygun bir eksiklik). Kurumsal ağda DoH görmek, kurum çözümleyicisi
atlanıyor (bypass) demektir — politikaya göre şüphelidir.

**SINAV İPUCU:** "Sorgu TLS ile mi taşınıyor?" → porta bak: 53 = klasik
(açık), 853 = DoT, 443'e genel DNS IP'leri = DoH. "Yanıt imzalı mı?" →
AD bit / RRSIG kaydı.

### DNS Response Kodları:

| Kod | Anlamı |
|-----|--------|
| **NOERROR** (0) | Başarılı |
| **NXDOMAIN** (3) | Domain bulunamadı |
| **SERVFAIL** (2) | Sunucu hatası |

> **İstihbarat İşaretleri, DNS, saldırganların "arka kapısı"dır:**
>
> - `dns.qry.name.len > 30` → **DNS exfiltration** şüphesi
> - TXT veya NULL kayıt sorguları → Veri taşıma olabilir
> - **Çok sayıda NXDOMAIN** yanıtı = Var olmayan subdomain'ler taranıyor
> - Bir IP'den **ani DNS sorgu artışı** = DNS tunneling veya C2 aktivitesi
> - Transaction ID **eşleşmeyen** query/response = DNS spoofing

## Hazırlık

```sh
./scripts/generate-traffic.sh dns
# macOS: open -a Wireshark module-12-dns.pcap
# Linux: wireshark module-12-dns.pcap &
# Windows: start wireshark module-12-dns.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

## Alıştırma 1: DNS Query + Response Eşleşen mi

### Filtre:
```text
dns
```

### Ne Yapmalısın?
1. Filtreyi uygula
2. İlk DNS paketine tıkla (bu bir **Query** olmalı)
3. Orta panelde **Domain Name System** katmanını genişlet
4. Şu alanları bul:

```text
 v Domain Name System (query)
     Transaction ID: 0xXXXX          <-- Query/Response eşleştirme ID
     Flags: 0x0100 Standard query
     Questions: 1
     Answer RRs: 0                   <-- Query'de 0 cevap
     Authority RRs: 0
     Additional RRs: 0
     Queries
         web.shark-tank.local: type A, class IN
```

5. Şimdi **aynı Transaction ID'ye** sahip Response paketini bul:
```text
 v Domain Name System (response)
     Transaction ID: 0xXXXX          <-- AYNI ID!
     Flags: 0x8180 Standard query response, No error
     Questions: 1
     Answer RRs: 1                   <-- Response'ta 1+ cevap
     Answers
         web.shark-tank.local: type A, class IN, addr 172.50.2.10
```

> **SINAV İPUCU:** Transaction ID ile query-response çiftlerini eşleştir.
>
> Aynı Transaction ID'ye sahip iki paket = bir soru + bir cevap.

## Alıştırma 2: Farklı Kayıt Tipleri

### A Kaydı (IPv4 Adresi)
```text
dns.qry.name == "web.shark-tank.local"
```
- Response'ta `type A, addr 172.50.2.10` görünmeli

### CNAME Kaydı (Takma Ad)
```text
dns.qry.name == "www.shark-tank.local"
```
- Response'ta önce CNAME kaydı, sonra A kaydı görünür:
```text
Answers
  www.shark-tank.local: type CNAME, cname web.shark-tank.local
  web.shark-tank.local: type A, class IN, addr 172.50.2.10
```

> **SINAV İPUCU:** CNAME zincirini takip et. www -> web -> 172.50.2.10

### MX Kaydı (Mail Sunucu)
```text
dns.qry.name == "mail.shark-tank.local"
```
- Response'ta MX kaydı ve öncelik (preference) değeri görünür

### NXDOMAIN (Domain Bulunamadı)
```text
dns.flags.rcode == NXDomain
```
- Olmayan bir domain sorgulandığında bu hata döner
- `Flags: 0x8183 Standard query response, No such name`

### NOERROR (Başarılı Yanıt)
```text
dns.flags.rcode == 0
```
- Domain başarıyla çözümlendi
- Response'ta Answer RRs > 0 olmalı
- `Flags: 0x8180 Standard query response, No error`

## Alıştırma 3: DNS Zamanlama Analizi

1. İlk query paketinin zamanını not et (Time sütunu)
2. Response paketinin zamanını not et
3. Fark = DNS sorgu süresi (genellikle < 1ms local ağda)

> **SINAV İPUCU:** Yavaş DNS sorguları ağ performans sorunlarına işaret edebilir.

## Alıştırma 4: DNS UDP vs TCP

DNS normalde **UDP** kullanır. TCP kullanım durumları:
- Response 512 byte'tan büyükse (zone transfer)
- DNSSEC

Filtre:
```text
dns && tcp
```
(Bu capture'da muhtemelen hiç TCP DNS paketi görünmez - hepsi UDP)

## Alıştırma 5: Dış Domain Sorgusu

```text
dns.qry.name == "google.com"
```

1. Bu sorguyu bul
2. Dikkat: Bizim DNS sunucumuz (172.50.2.11) önce recursive olarak dış DNS'e sorar
3. Response'ta google.com'un IP adreslerini göreceksin

> **SINAV İPUCU:** Recursive DNS sorgusu = istemci DNS'e sorar, DNS bulana kadar başkalarına sorar.

## Hızlı Referans - DNS Filtreleri

```text
# Tüm DNS
dns

# Sadece sorgular
dns.flags.response == 0

# Sadece cevaplar
dns.flags.response == 1

# Belirli domain
dns.qry.name contains "shark-tank"
dns.qry.name == "web.shark-tank.local"

# Belirli kayıt tipi
dns.qry.type == 1             # A
dns.qry.type == 28            # AAAA
dns.qry.type == 5             # CNAME
dns.qry.type == 15            # MX
dns.qry.type == 2             # NS

# Hatalar
dns.flags.rcode == NXDomain   # Domain bulunamadı
dns.flags.rcode == NoError    # Başarılı

# Belirli IP adresi dönenler
dns.a == "172.50.2.10"

# Transaction ID ile eşleşme
dns.id == 0x1234
```

## Alıştırma 6: Statistics > DNS

Wireshark'ın DNS istatistik menüsü:

1. Statistics > DNS (tshark: `-z dns,tree`)
2. Query ve Response paket sayılarını, oranlarını (rate) ve burst değerlerini özetler
3. Bu pcap'te 14 query + 14 response = 28 DNS paketi görülür

> Domain bazlı özet için dns,tree yeterli değildir: Sorgulanan adları görmek için filtre kullan (`dns.qry.name`), akış bazlı bakış için Statistics → Conversations açılabilir.

### Sorgu Süresi Hakkında Dürüst Not:

Wireshark'ın **Service Response Time** istatistiği her protokol için yoktur ve **DNS için yoktur** (SRT listesinde LDAP, Kerberos, SMB/RPC, SNMP, ICMP gibi protokoller vardır). DNS sorgu süresi gerekirse query ve response paketlerinin Time sütunu karşılaştırılarak manuel hesaplanır (Alıştırma 3'teki gibi) ya da `dns.qry.name == "..."` filtresiyle ilgili çift bulunup zaman farkına bakılır.

> **SINAV İPUCU:** DNS performans analizi Time sütunu ve filtrelerle yapılır. 100ms üzeri yanıt süreleri sorun göstergesidir.

## Alıştırma 7: DNS Tespit ve Güvenlik

### DNS Tunneling Tespiti

DNS tunneling, veriyi DNS sorgularının içine gizler:
```text
Normal:   web.shark-tank.local  (13 karakter)
Şüpheli:  c2RiYXNlNjRlbmNvZGVkZGF0YQ.evil.attacker.com  (45+ karakter)
```

Tespit için:
```text
# Uzun domain isimleri
dns.qry.name.len > 30

# Yüksek hacimli TXT sorguları
dns.qry.type == 16   # TXT kaydı
```

Bu pcap'te DNS exfiltration simülasyonu **vardır**! Base64 ile kodlanmış uzun subdomain'ler `exfil.shark-tank.local` altında gönderilir:

```text
# Exfiltration sorgularını filtrele:
dns.qry.name contains "exfil"

# Uzun domain adları (DNS exfil şüphesi):
dns.qry.name.len > 30
```

Bu sorguların subdomain kısımları (`c2NhcmFhcmFhLXNheWEtZGFsZ2EtZGU.bXV0ZXNpbGltZS0xMjM0.dmlsbGEtb25lLXNleWk` gibi) base64 ile kodlanmış gizli veridir. Gerçek dünyada kullanılan araçlar:
- **iodine**: IP over DNS: Tüm TCP/IP trafiğini DNS üzerinden tüneller
- **dnscat2**: C2 iletişimini DNS üzerinden yapar

### DNS Cache Poisoning (Kaminsky Attack)

Saldırgan, DNS sunucusuna sahip olmadığı domain'ler için yanlış IP adresleri ekletir:
1. Saldırgan, DNS sunucusuna bir sorgu gönderir
2. Aynı anda sahte cevaplar gönderir (Transaction ID tahmini)
3. DNS sunucusu sahte kaydı cache'ine ekler
4. Kullanıcılar sahte siteye yönlendirilir

Tespit:
```text
dns.flags.rcode == 0 && dns.count.auth_rr > 0
```
- Beklenmeyen Authority RR'ler = şüpheli

> **SINAV İPUCU:** DNS güvenlik zafiyetleri WCNA'da sık sorulur:
>
> - Transaction ID tahmini = Kaminsky attack
> - Uzun domain adı = DNS exfiltration
> - TXT sorguları = veri taşıma

## Sınav Soruları (Çöz)

1. web.shark-tank.local için DNS sorgusu kaç milisaniyede yanıtlandı?
2. www.shark-tank.local bir CNAME mi? Hedefi nedir?
3. Olmayan bir domain sorgulandığında DNS hangi hata kodunu döndü?
4. google.com sorgusunun response'unda kaç IP adresi var?
5. DNS trafiği hangi transport protokolünü kullanıyor? (UDP mi TCP mi?) Neden?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. Genellikle < 1 ms (aynı ağ)
2. Evet, CNAME → web.shark-tank.local → 172.50.2.10
3. NXDOMAIN (rcode = 3)
4. 1 IP adresi (CoreDNS upstream üzerinden çözümlendi)
5. UDP (port 53). TCP büyük yanıtlar ve zone transfer için kullanılır.

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!