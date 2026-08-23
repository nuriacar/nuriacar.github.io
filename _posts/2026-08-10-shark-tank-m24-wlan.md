---
layout: post
title:  "shark-tank - m24: WLAN Analizi"
date:   2026-08-10 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 24: WLAN Analizi

**Neden?** Ofiste Wi-Fi kopuyor, sürekli yeniden bağlanıyorsun. Deauth attack olabilir. Kablosuz ağlar Ethernet'ten daha kırılgandır: Evil twin (sahte AP), deauth attack (Wi-Fi bağlantısını kesme), WPA2 KRACK (anahtar yeniden kullanımı), PMKID attack (router şifre kırma), beacon flood, probe request tracking. WLAN analizi bu saldırıların tümünü tespit edebilir. Bu modülde, kablosuz saldırıları Wireshark ile tespit etmeyi öğreneceksin.

**Görev:** 802.11 kablosuz ağ trafiğini analiz et.

**Öğrenim Hedefleri:**
- 802.11 frame tiplerini (Management, Control, Data) ve alt tiplerini ayırt edebilmek
- Beacon/Probe Request/Response ile AP ve istemci keşfini anlamak
- Authentication/Association sürecini adım adım takip edebilmek
- Deauth saldırısı ve Evil Twin tespiti yapabilmek
- WPA/WPA2 4-way handshake'i analiz edebilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **802.11** | IEEE 802.11: Kablosuz yerel alan ağları (WLAN/Wi-Fi) için standart. Ethernet (802.3) kablolu ağlar için nasıl standartsa, 802.11 de kablosuz ağlar için aynı görevi üstlenir. 802.11 frame yapısı Ethernet frame'inden farklıdır: 4 adres alanı taşır (Ethernet 2), frame başlığı 30-34 byte'dır (Ethernet 14 byte). 802.11 frame'leri üç ana kategoriye ayrılır: Management (ağ keşfi ve bağlantı yönetimi), Control (çarpışma önleme ve onay), Data (kullanıcı verisi). Wireshark'ta `wlan` filtresi ile 802.11 trafiği görüntülenir. Kablosuz capture için monitör modunda bir ağ kartı gerekir. |
| **Beacon** | Wi-Fi erişim noktasının (AP) periyodik olarak yayınladığı duyuru çerçevesi. Beacon frame'inde ağ adı (SSID), AP'nin MAC adresi (BSSID), kullanılan kanal (channel), desteklenen hızlar ve güvenlik protokolü (WPA2/WPA3) bulunur. AP'ler genellikle her 102.4 ms'de (100 TU) bir Beacon gönderir. Bir telefon Wi-Fi ağlarını tararken gördüğü liste, bu Beacon frame'lerinden gelir. Wireshark'ta `wlan.fc.type == 0 && wlan.fc.subtype == 8` filtresiyle görüntülenir. Saldırganlar sahte Beacon'lar (Evil Twin) veya çok sayıda Beacon (Beacon flood) göndererek saldırı yapabilir. |
| **SSID** | Service Set Identifier: Bir kablosuz ağın adı. Kullanıcıların telefonunda veya bilgisayarında gördüğü Wi-Fi ağ adıdır (örn. "Shark-Tank-Corp"). SSID, Beacon frame'leri içinde yayınlanır. 1-32 karakter uzunluğunda olabilir ve gizlenebilir (hidden SSID); gizli ağlarda Beacon'da SSID alanı boş bırakılır. BSSID (Basic Service Set Identifier) ise AP'nin MAC adresidir ve aynı SSID'ye sahip birden fazla AP'yi birbirinden ayırmak için kullanılır. |
| **Deauthentication (Deauth)** | Bir Wi-Fi cihazının ağla bağlantısını zorla kesen 802.11 management frame'i. Normalde bir istemci ayrılırken gönderilir, ama saldırganlar bunu kötüye kullanır: Sahte deauthentication frame'leri göndererek bir cihazı ağdan koparır. Cihaz kopunca yeniden bağlanmaya çalışır ve bu sırada WPA2 4-way handshake'i yakalanabilir (şifre kırma için). Wireshark'ta `wlan.fc.type == 0 && wlan.fc.subtype == 12` filtresiyle görüntülenir. Çok sayıda deauth frame'i bir deauth saldırısını (DoS) gösterir. |
| **WPA handshake** | Wi-Fi Protected Access: Kablosuz ağda şifreleme anahtarının oluşturulduğu el sıkışma süreci. WPA2'de bu sürece "4-way handshake" denir: AP ve istemci, önceden paylaşılan şifreden (PSK) türetilen PMK anahtarını kullanarak oturum anahtarlarını (PTK, GTK) dört mesajla değiş tokuş eder. Bu dört mesaj yakalanırsa, şifre çevrimdışı brute-force ile kırılabilir. Wireshark'ta EAPOL frame'leri olarak görünür (`eapol` filtresi). WPA3'te bu süreç SAE (Simultaneous Authentication of Equals) ile değiştirilmiş ve çevrimdışı kırma girişimlerine karşı dayanıklı hale getirilmiştir. |

## Teori

| Tip | Alt Tip | Açıklama |
|-----|---------|----------|
| **Management** (0) | Beacon (8) | AP periyodik duyuru (SSID, BSSID, channel) |
| | Probe Request/Response (4/5) | İstemci keşfi |
| | Association (0/1) | Bağlantı kurma |
| | Authentication (11) | Kimlik doğrulama |
| | Deauthentication (12) | Bağlantı kesme (saldırı!) |
| **Control** (1) | RTS/CTS (11/12) | Çarpışma önleme |
| | ACK (13) | Frame onayı |
| **Data** (2) | Data (0) | Kullanıcı verisi |
| | QoS Data (8) | Öncelikli veri |

### 802.11 vs Ethernet:

| Özellik | 802.11 (WiFi) | Ethernet |
|---------|--------------|----------|
| **Medya** | Paylaşımlı (hava) | Switch (noktadan noktaya) |
| **Frame başlığı** | 30-34 byte | 14 byte |
| **Adres sayısı** | 4 adres alanı | 2 adres (MAC) |
| **Çarpışma** | CSMA/CA (önleme) | CSMA/CD (tespit) |
| **Güvenlik** | WEP/WPA/WPA2/WPA3 | Genelde yok (port-based) |
| **Yönetim** | Management frame'ler | Yok |

### Management Frame'ler:

```text
Radio Tap Header          ← Sinyal gücü, channel, rate
  802.11 Beacon Frame     ← SSID: "Shark-Tank-Corp"    Timestamp
    Beacon Interval: 100 TU (102.4 ms)
    Capabilities: ESS, Privacy
    SSID: "Shark-Tank-Corp"
    Supported Rates: 1, 2, 5.5, 11, 12, 24 Mbps
    DS Parameter Set: Channel 6
    Vendor Specific: WPA/WPA2
```

### Radiotap Başlığı: Wi-Fi Paketinin "Ölçüm Zarfı"

Monitor mode ile yakalanan her 802.11 çerçevesinin önünde bir **radiotap
header** bulunur — bu, radyo katmanının ölçümlerini (metadata) taşır;
Ethernet'te karşılığı yoktur. pcap'te 90+ frame radiotap taşır:

```text
v Radiotap Header
    Version: 0
    Length: 12 (veya daha fazla)
    v Present flags: hangi alanların olduğu burada bildirilir
        [x] Flags (FCS var mı)
        [x] Rate: 12.0 Mb/s          ← fiziksel hız
        [x] Channel: 2437 MHz (Ch 6) ← dinlenen kanal
        [x] RSSI / SSI Signal: -59 dBm  <-- SİNYAL GÜCÜ
        [x] Antenna: 1
```

| Alan | Analist Değeri |
|------|----------------|
| **SSI Signal (dBm)** | Sinyal gücü: -30 mükemmel, -70 zayıf, -90 sınırda. **Konum/indirgeme kanıtı**: Cihaz yaklaşıp uzaklaştıysa RSSI eğrisi değişir |
| **Channel/Frequency** | Hangi kanalda dinlenildiği; kanal atlama (hop) analizi |
| **Rate** | Bağlantının anlık fiziksel hızı; 1 Mbps yönetim, 54+ Mbps veri tipiktir |
| **Flags** | FCS (checksum) dahil mi — bozuk paket tespiti |

Filtreler:
```text
radiotap                          # radiotap taşıyan tüm paketler
radiotap.dbm_antsignal < -80      # zayıf sinyalli (uzak) göndericiler
wlan.fc.type == 0 && radiotap     # yönetim çerçeveleri + ölçümleri
```

**SINAV İPUCU:** "Sinyal gücü (dBm) nedir?" / "hangi kanal?" sorularının
cevabı radiotap başlığındadır; 802.11 başlığında DEĞİL. RSSI + zaman
birlikte okunursa cihazın ağa göre konumu hakkında çıkarım yapılabilir
(trafik analizi).

> **Standartlar eşlemesi:** 802.11n/ac/ax pazar adlarıyla Wi-Fi 4/5/6'dır.
> Wireshark bunları radiotap ve HT/VHT/HE bilgi elemanlarında gösterir
> (ör. beacon'da "HE (Wi-Fi 6)" capability). Sınav için: n=4 (2.4/5 GHz,
> MIMO), ac=5 GHz, ax=6/5/2.4 GHz (OFDMA) eşlemesini tanıman yeterli.

---

## Hazırlık

Pcap dosyası `shared/pcaps/` içinde hazırdır. İhtiyaç olursa yeniden üretmek için:

```sh
# Otomatik indir + yönetim çerçeveleri ekle:
./scripts/download-sample-pcaps.sh
```

Dosya: `shared/pcaps/module-24-wlan.pcap` (WPA-EAP TLS + yönetim çerçeveleri)

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

> **Önemli Not: WLAN Capture Sınırlaması:** Bu pcap Wireshark'ın resmi örnek capture'ından indirilmiş ve sentetik yönetim çerçeveleri eklenmiştir.
>
> Gerçek bir WLAN analizi için fiziksel bir Wi-Fi adaptörü ve **monitor mode** gereklidir. Docker ortamında Wi-Fi adaptörü ve monitor mode çalışmaz. Kendi ağında WLAN capture yapmak için:
>
> **Donanım:** Monitor mode destekleyen bir USB Wi-Fi adaptörü (Alfa AWUS036ACH, TP-Link TL-WN722N v1, veya AirPcap).
>
> **Yazılım:**
> ```sh
> # Linux: airmon-ng ile monitor mode'a geç
> sudo airmon-ng start wlan0
> # Wireshark'ta wlan0mon arayüzünü seç
>
> # macOS:Airport utility
> sudo /System/Library/PrivateFrameworks/Apple80211.framework/\
> Versions/Current/Resources/airport en0 sniff 6
> # 6 = channel numarası
>
> # Windows: AirPcap NX veya Npcap + monitor mode destekleyen adaptör
> ```
>
> **WLAN Capture Kaynakları:**
>
> - [Wireshark Sample Captures](https://wiki.wireshark.org/SampleCaptures#Wireless): Çeşitli WLAN pcap örnekleri
> - [Kismet](https://www.kismetwireless.net/): Profesyonel WLAN sniffer
> - [Aircrack-ng](https://www.aircrack-ng.org/): WLAN güvenlik denetimi araç seti

---

## Alıştırma 1: Beacon Frame Analizi

Beacon frame'ler, AP'nin varlığını duyurduğu periyodik paketlerdir.

### Filtre:
```text
wlan.fc.type_subtype == 8
```

### Adımlar:

1. 802.11 pcap'i Wireshark'ta aç
2. Filtre: `wlan.fc.type_subtype == 8`
3. Bir Beacon frame'i seç ve incele:

```text
v IEEE 802.11 Beacon Frame
    v Tagged parameters
        SSID: "Shark-Tank-Corp"          ← Ağ adı
        Supported Rates: 1, 2, 5.5, 11, 6, 9, 12, 18 Mbps
        DS Parameter Set: Channel 6      ← Kanal
        v RSN Information                ← WPA2 güvenlik
            RSN Version: 1
```

> **Not:** Bu pcap'te AP'nin BSSID'si `00:11:22:33:44:55`'tir. Wireshark ilk üç byte'ı (OUI) üretici adına çözdüğü için paket listesinde gönderici **CIMSYS_33:44:55** olarak görünür; bu, MAC adresinin ilk yarısının kayıtlı olduğu firmanın adıdır.

### Beacon'dan Çıkarılacak Bilgiler:

| Alan | Anlamı |
|------|--------|
| **SSID** | Ağ adı |
| **BSSID** | AP MAC adresi |
| **Channel** | Kullanılan kanal |
| **Supported Rates** | Desteklenen hızlar |
| **Beacon Interval** | 100 TU (genelde) |
| **WPA/WPA2** | Güvenlik tipi |
| **RSN** | Robust Security Network |

> **SINAV İPUÇLARI:**
>
> - Beacon frame = periyodik AP duyurusu (genelde her 102.4 ms)
> - SSID ve BSSID bu frame'den öğrenilir
> - Channel bilgisi DS Parameter Set'te bulunur
> - Güvenlik tipi (WEP/WPA/WPA2) beacon'da belirtilir

---

## Alıştırma 2: Probe Request/Response

İstemci, AP'leri keşfetmek için Probe Request gönderir.

### Filtre:
```text
wlan.fc.type_subtype == 4 || wlan.fc.type_subtype == 5
```

### Adımlar:

1. Probe Request (tip 4):
   - İstemci MAC adresini bul
   - Hangi SSID'yi soruyor? (broadcast veya spesifik)
   - Desteklenen hızlar neler?
2. Probe Response (tip 5):
   - Hangi AP cevap verdi?
   - Beacon ile aynı bilgileri içerir

> **SINAV İPUÇLARI:**
>
> - Probe Request = istemci keşfi
> - Probe Response = AP'nin cevabı
> - Broadcast Probe: "Herhangi bir AP var mı?"
> - Directed Probe: "X AP'si var mı?"

---

## Alıştırma 3: Authentication ve Association

İstemci AP'ye bağlanma süreci.

### Filtre:
```text
wlan.fc.type_subtype == 11 ||
wlan.fc.type_subtype == 0 ||
wlan.fc.type_subtype == 1
```

### Bağlantı Süreci:

```text
İstemci                      AP
  |--- Auth (Open System) --->|    1. Kimlik doğrulama
  |<-- Auth (Open System) ----|    2. Kabul
  |--- Assoc Request -------->|    3. Bağlantı isteği
  |<-- Assoc Response --------|    4. Onay (AID verilir)
  |=== Data frame'ler ========|
  |--- Deauth (Saldırı!) ---->|    5. (Kötü: deauth saldırısı)
```

> **Not:** Bu pcap'te Auth ve Deauth çerçeveleri gönderilmiştir; Assoc çerçevesi yoktur.
### Adımlar:

1. Auth frame'leri bul
2. Association Request'te hangi parametreler var?
3. Association Response'da AID (Association ID) kaç?

> **SINAV İPUCULARI:**
>
> - Auth → Assoc → Data sırası takip edilir
> - Deauth frame = bağlantı kesme (saldırgan tarafından kullanılabilir)
> - AID = AP'nin istemciye verdiği ID

---

## Alıştırma 4: Deauth Saldırısı Tespiti

Deauthentication frame, istemciyi AP'den koparmak için kullanılır.

### Filtre:
```text
wlan.fc.type_subtype == 12
```

### Adımlar:

1. Deauth frame'leri bul
2. Kaynak MAC adresi AP mi? (AP'nin kendisi göndermiş gibi görünür)
3. Hedef MAC (istemci) kim?
4. **Reason Code** nedir?
   - 1: Unspecified
   - 2: Previous authentication no longer valid
   - 3: Deauthenticated because sending station is leaving
   - 7: Class 3 frame received from nonassociated station
   - 8: Disassociated because sending station is leaving

### Deauth Saldırısı Tespiti:

```text
Saldırgan (spoofed AP MAC)    Hedef İstemci
  |--- Deauth (Reason: 7) --->|
  |--- Deauth (Reason: 7) --->|
  |--- Deauth (Reason: 7) --->|   ← Sürekli deauth = saldırı!
```

> **SINAV İPUÇLARI:**
>
> - Deauth = istemciyi AP'den koparma
> - Saldırgan AP'nin MAC'ini taklit eder (spoof)
> - Sürekli deauth frame = Deauth saldırısı
> - WPA2 bile deauth'a karşı korumasızdır (management frame koruması yok)

> **İstihbarat İşaretleri, Deauth saldırısı:**
>
> - Aynı kaynaktan çok sayıda Deauth = aktif saldırı
> - Saldırgan, WPA/WPA2 handshake yakalamak için deauth kullanır
> - Handshake yakalandıktan sonra offline brute force yapılabilir

---

## Alıştırma 5: WPA/EAP Kimlik Doğrulama Analizi

> **Not:** Bu pcap'te klasik WPA-Personal 4-way EAPOL-Key handshake **yoktur**. Yakalanan kimlik doğrulama, kurumsal ağlarda kullanılan **802.1X/EAP-TLS** akışıdır (Identity istek/yanıtı + TLS handshake). Aşağıdaki 4-way handshake bölümü, WPA-Personal ağlarda göreceğin akışı gösterir; kendi ağında test için monitor mode ile WPA2-Personal bir ağda capture al.

### Filtre:
```text
eapol
```

### Bu pcap'teki EAPOL akışı (802.1X/EAP-TLS):

```text
AP/Authenticator                İstemci
  |--- EAP Request (Identity) --->|   "Kimsin?"
  |<-- EAP Response (Identity) ---|   Kullanıcı adı
  |--- EAP Request (EAP-TLS) ---->|   TLS tüneli başlar
  |<-- EAP Response (ClientHello)-|   İstemci sertifikası alışverişi
  |  ... TLS handshake ...        |
  |--- EAP Success -------------->|   Kimlik doğrulandı
```

### Klasik WPA2-Personal 4-Way Handshake (başka ağlarda):

```text
AP                              İstemci
  |--- EAPOL-Key M1 (ANonce) ---->|    1. AP'nin nonce'ı
  |<-- EAPOL-Key M2 (SNonce,MIC) -|    2. İstemcinin nonce + MIC
  |--- EAPOL-Key M3 (GTK, MIC) -->|    3. GTK gönderimi
  |<-- EAPOL-Key M4 (ACK) ------->|    4. Onay
```

### Adımlar:

1. Filtre: `eapol`
2. Bu pcap'te EAP Identity istek/yanıtlarını ve EAP-TLS handshake paketlerini bul (Message 1-4 arama: Bu pcap WPA-Personal değildir)
3. EAP-TLS akışında kim ne gönderdi takip et: Identity, ClientHello, Success
4. **Follow → TCP Stream** ile handshake'i gör (EAPOL Ethernet üzerinden gider)

> **SINAV İPUCULARI:**
>
> - EAPOL hem 802.1X (Enterprise, bu pcap) hem WPA 4-way (Personal) kimlik doğrulamayı taşır
> - 4-way'de: Message 1 = AP'nin nonce'ı (ANonce), Message 2 = SNonce + MIC, Message 3 = GTK
> - Offline brute force: Message 2'deki MIC kırılmaya çalışılır (WPA-Personal)
> - EAP-TLS'de ise güçlü kimlik doğrulama sertifikalarla yapılır: brute force hedefi yoktur
> - Wireshark, EAPOL frame'lerini otomatik tanır

### 802.11 Frame Type/Subtype Filtre Referansı:

Wireshark'ta her frame tipi `wlan.fc.type` ve `wlan.fc.subtype` ile filtrelenir.

| Type | Subtype | Adı | Filtre |
|------|---------|-----|--------|
| 0 (Management) | 0 | Association Request | `wlan.fc.type==0 && wlan.fc.subtype==0` |
| 0 | 1 | Association Response | `wlan.fc.type==0 && wlan.fc.subtype==1` |
| 0 | 4 | Probe Request | `wlan.fc.type==0 && wlan.fc.subtype==4` |
| 0 | 5 | Probe Response | `wlan.fc.type==0 && wlan.fc.subtype==5` |
| 0 | 8 | **Beacon** | `wlan.fc.type==0 && wlan.fc.subtype==8` |
| 0 | 11 | **Authentication** | `wlan.fc.type==0 && wlan.fc.subtype==11` |
| 0 | 12 | **Deauthentication** | `wlan.fc.type==0 && wlan.fc.subtype==12` |
| 1 (Control) |: | RTS/CTS/ACK | `wlan.fc.type==1` |
| 2 (Data) | 0 | Data | `wlan.fc.type==2 && wlan.fc.subtype==0` |
| 2 | 8 | QoS Data | `wlan.fc.type==2 && wlan.fc.subtype==8` |

> **SINAV İPUCU:** `wlan.fc.type` değerleri: 0=Management, 1=Control, 2=Data.
>
> Subtype değerlerini ezberlemek yerine, Wireshark'ın paket detaylarından `wlan.fc.subtype` alanını oku ve sağ tık → "Apply as Filter" kullan.

---

## Alıştırma 6: 802.11 Data Frame ve QoS

Data frame'ler, gerçek kullanıcı verisini taşır.

### Filtre:
```text
wlan.fc.type == 2
```

### QoS Data:
```text
wlan.fc.type_subtype == 8
```

### Qos Control:

| Bit | Anlamı |
|-----|--------|
| TID (0-7) | Traffic ID (0=BE, 1=BK, 2-3=Voice, 4-5=Video) |
| Ack Policy | Normal / No Ack / Block Ack |

### Adımlar:

1. Data frame'leri bul
2. QoS data frame'lerinde TID değerini incele
3. Adres alanlarını karşılaştır:
   - **Address 1**: Receiver (alıcı)
   - **Address 2**: Transmitter (gönderici)
   - **Address 3**: BSSID veya destination/source
   - **Address 4**: Wireless bridge (opsiyonel)

> **SINAV İPUCULARI:**
>
> - 802.11 data frame'de 3-4 MAC adresi bulunur (Ethernet'te 2)
> - QoS = önceliklendirme (Voice/Video yüksek öncelik)
> - TID 0 = Best Effort, TID 6 = Voice

---

## Hızlı Referans - 802.11 Filtreleri

| Filtre | Anlamı |
|--------|--------|
| `wlan.fc.type == 0` | Management frame'ler |
| `wlan.fc.type == 1` | Control frame'ler |
| `wlan.fc.type == 2` | Data frame'ler |
| `wlan.fc.type_subtype == 8` | Beacon |
| `wlan.fc.type_subtype == 4` | Probe Request |
| `wlan.fc.type_subtype == 5` | Probe Response |
| `wlan.fc.type_subtype == 0` | Association Request |
| `wlan.fc.type_subtype == 1` | Association Response |
| `wlan.fc.type_subtype == 11` | Authentication |
| `wlan.fc.type_subtype == 12` | Deauthentication |
| `eapol` | WPA/WPA2 4-way handshake |
| `wlan_radio.signal_dbm` | Sinyal gücü (dBm) |
| `wlan_radio.channel` | Kanal numarası |
| `wlan.bssid` | BSSID (AP MAC) |

---

## Sınav Soruları (Çöz)

1. 802.11'de kaç frame tipi vardır? Hangileridir?
2. Beacon frame hangi bilgileri içerir? En az 4 tane say.
3. WPA/WPA2 4-way handshake hangi filtre ile bulunur?
4. Deauth saldırısı nasıl tespit edilir? WPA2 deauth'a karşı korumalı mıdır?
5. 802.11 data frame'de neden 4 adres alanı bulunur? Ethernet'te neden 2 adres var?
6. QoS TID değerleri ne anlama gelir?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. 3 tip: Management (0), Control (1), Data (2). Management: Beacon, Probe, Auth, Assoc. Control: RTS/CTS, ACK. Data: Kullanıcı verisi.

2. SSID (ağ adı), BSSID (AP MAC), Channel, Supported Rates, Beacon Interval, WPA/WPA2 güvenlik tipi, RSN.

3. `eapol` filtresi ile. EAPOL, 4-way handshake'in taşındığı protokoldür.

4. Sürekli Deauth frame'leri (wlan.fc.type_subtype == 12) aynı kaynaktan gönderiliyorsa = deauth saldırısı. WPA2, management frame koruması olmadığı için deauth'a karşı korumalı değildir. Bu nedenle deauth saldırısı WPA2/WPA3 ağlarda da çalışır.

5. Kablosuz ağlarda frame'ler farklı yönlerde hareket edebilir: Gönderici, alıcı, BSSID, ve kablosuz bridge durumunda 4. adres gerekir. Ethernet'te sadece kaynak ve hedef MAC yeterlidir (noktadan noktaya).

6. TID (Traffic ID) 0-7 arası: 0=Best Effort, 1=Background, 2-3=Voice, 4-5=Video, 6-7=Voice/Video yedek. Yüksek TID = yüksek öncelik.

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
