---
layout: post
title:  "shark-tank - m26: Baseline Analizi"
date:   2026-08-12 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 26: Baseline Analizi

**Neden?** Gece yarısı anormal trafik artışı var. Ama normalde ağda neler oluyor bilmiyorsan anormali bulamazsın. Normal olanı bilmeden anormal olanı bulamazsın. Baseline (trafik profili) olmadan, bir DNS tunneling saldırısını normal DNS sorgularından ayırt edemezsin. Protocol Hierarchy ile anormal protokol oranları, Conversations ile şüpheli IP çiftleri, Endpoints ile yabancı IP'ler tespit edilir. Bu modülde, baseline çıkararak anomali tespiti yapmayı öğreneceksin.

**Görev:** Ağ trafiğinin normal desenlerini öğren, anormallikleri tespit et.

**Öğrenim Hedefleri:**
- Protocol Hierarchy ile protokol dağılımını analiz edebilmek
- Conversations ve Endpoints ile trafikteki IP/port çiftlerini çıkarabilmek
- IO Graph ile zaman bazlı trafik desenlerini yorumlayabilmek
- Baseline metriklerini (packet/s, protokol oranı, hedef IP sayısı) anlamak
- Normal trafikten sapan anormallikleri (C2 beaconing, data exfiltration) tespit edebilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **baseline** | Bir ağın normal çalışma koşullarındaki trafik profilini tanımlayan ölçütler dizisi. Baseline, "normal" olarak kabul edilen paket/saniye sayısını, protokol dağılımını (örn. %50 HTTP, %20 DNS, %10 ARP), aktif IP sayısını, SYN/ACK oranını ve ortalama payload boyutunu içerir. Baseline olmadan, bir anormallik (örn. gece yarısı ani DNS sorgu artışı) normal mi yoksa saldırı mı olduğunu söylemek imkansızdır. Baseline çıkarıldıktan sonra, sapmalar kolayca tespit edilir: Normalde 1000 paket/sn olan trafik aniden 10000'e çıkarsa DDoS, DNS oranı %5'ten %50'ye çıkarsa DNS amplification saldırısı şüphesi uyandırır. Wireshark'ın Protocol Hierarchy, Conversations, Endpoints ve IO Graph araçları baseline çıkarmak için kullanılır. |
| **Protocol Hierarchy** | Wireshark ve tshark'ın bir pcap içindeki protokolleri katman katman özetleyen istatistik aracı. Her protokolün pcap içindeki paket sayısını ve yüzde oranını gösterir: Örneğin "%85 TCP, %60 HTTP, %20 DNS, %15 ARP" gibi. Bu özet, pcap'in genel içeriğini hızlıca anlamak için ilk bakılan araçtır. GUI'de `Statistics > Protocol Hierarchy`, tshark'ta `-q -z io,phs` komutuyla kullanılır. |
| **Conversations** | Wireshark'ın bir pcap içindeki tüm iletişim çiftlerini (conversation) listeleyen istatistik aracı. `Statistics → Conversations` menüsünden açılır. Her satır iki cihaz arasındaki trafiği özetler: Kaynak ve hedef IP, port, paket sayısı, byte sayısı, süre. TCP, UDP ve IP seviyesinde ayrı ayrı gösterilir. Baseline analizinde hangi IP çiftlerinin normalde ne kadar veri transfer ettiğini belirlemek için kullanılır. Beklenmeyen yeni conversation'lar (bilinmeyen bir dış IP ile çok veri) veri sızdırma veya C2 bağlantısı gösterebilir. |
| **Endpoints** | Wireshark'ın bir pcap içindeki tüm cihazları (IP veya MAC adresi) listeleyen istatistik aracı. `Statistics → Endpoints` menüsünden açılır. Her cihaz için toplam paket sayısı, byte sayısı ve görüldüğü ağ arayüzü bilgisi gösterilir. Baseline analizinde, ağda normalde kaç cihazın aktif olduğunu ve hangilerinin en çok trafik ürettiğini belirlemek için kullanılır. Bilinmeyen bir IP'nin aniden çok trafik üretmesi, yeni bir cihazın ağa katıldığını veya bir cihazın compromised (ele geçirilmiş) olduğunu gösterebilir. |

## Teori

### Baseline Nedir?

Baseline, bir ağın **normal çalışma koşullarındaki** trafik profili:

| Metrik | Normal | Anormal |
|--------|--------|---------|
| **Toplam paket/sn** | ~1000 | > 10000 (DDoS) |
| **DNS sorgusu/sn** | ~5-10 | > 100 (DNS amplification) |
| **HTTP oranı** | %40-60 | <%10 (exfiltration) |
| **TCP SYN/ACK oranı** | ~1:1 | SYN >> ACK (port scan) |
| **Hedef IP sayısı** | ~10-20 | > 100 (scan/beacon) |
| **Payload boyutu** | 500-1500 byte | > 65535 (anomali) |

### Wireshark Baseline Araçları:

| Araç | Menü | Kullanım |
|------|------|----------|
| **Protocol Hierarchy** | Statistics → Protocol Hierarchy | Protokol dağılımı |
| **Conversations** | Statistics → Conversations | IP/port çiftleri |
| **Endpoints** | Statistics → Endpoints | Tüm IP'ler |
| **IO Graph** | Statistics → IO Graph | Zaman bazlı dağılım |
| **Capture File Properties** | Statistics → Capture File Properties | Genel istatistik |

---

## Hazırlık

```sh
./scripts/generate-traffic.sh baseline
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

---

## Alıştırma 1: Protocol Hierarchy

Tüm protokollerin hiyerarşik dağılımını gösterir.

### Adımlar:

1. `module-26-baseline.pcap`'i Wireshark'ta aç
2. Statistics → Protocol Hierarchy
3. Protokol ağacını incele:

```text
Protocol                          % Packets    Bytes
Ethernet                          100.00%      100%
  IPv4                            100.00%      100%
    TCP                           60.00%       70%
      HTTP                        25.00%       30%
      TLS                         15.00%       20%
      FTP                         10.00%       10%
    UDP                           40.00%       30%
      DNS                         30.00%       20%
      DHCP                        10.00%       10%
```

### Yorumlama:

| Bulgu | Anlamı |
|-------|--------|
| **En çok hangi protokol?** | Ağın ana kullanım amacı |
| **TCP/UDP oranı?** | Web vs DNS ağırlıklı |
| **HTTP vs HTTPS?** | Şifreli/şifresiz oranı |
| **DNS oranı?** | Normalde %5-15 arası |
| **Beklenmeyen protokol?** | Anomali işareti |

> **SINAV İPUCULARI:**
>
> - Protocol Hierarchy = ağın protokol profili
> - % oranı normalde beklenen değerlerle karşılaştırılır
> - Ani protokol değişikliği = anomali
> - **Sağ tık → Apply as Filter** ile protokole özel filtre uygulanabilir

> **İstihbarat İşaretleri, Protocol Hierarchy anormallikleri:**
>
> - DNS oranı normalden yüksek = DNS tunneling veya exfiltration
> - Beklenmeyen protokol (SMB, ICMP) yüksek = yanlış yapılandırma veya saldırı
> - HTTP oranı çok düşük = HTTPS forced (normal)
> - ICMP yüksek = ping sweep veya tunnel

---

## Alıştırma 2: Conversations

IP ve port çiftlerinin konuşma istatistikleri.

### Adımlar:

1. **Statistics → Conversations** → IPv4 sekmesi
2. IPv4 konuşmalarını incele:

| Adress A | Adress B | Paket | Bayt | Başlangıç | Süre |
|----------|----------|-------|------|-----------|------|
| 172.50.2.100 | 172.50.2.10 | 1500 | 2.5 MB | 0.0s | 60s |
| 172.50.2.100 | 172.50.2.11 | 200 | 50 KB | 0.5s | 55s |
| 172.50.2.200 | 172.50.2.10 | 50 | 5 KB | 5.0s | 2s |

3. TCP sekmesine geç:
   - Hangi portlar en yoğun?
   - Kaç farklı TCP konuşma var?
4. UDP sekmesine geç:
   - DNS sorguları kaç konuşma?
   - DHCP var mı?

### Baseline Çıkarma:

```sh
# tshark ile conversations export
tshark -r shared/pcaps/module-26-baseline.pcap -z conv,tcp
tshark -r shared/pcaps/module-26-baseline.pcap -z conv,udp
```

> **SINAV İPUCULARI:**
>
> - Conversations = IP çiftleri arasındaki iletişim
> - En çok paket gönderen IP = ağın en aktif cihazı
> - Kısa sürede çok IP = port scan veya tarama
> - **Name resolution** açıkken IP'ler hostname olarak görünür

---

## Alıştırma 3: Endpoints

Tüm uç noktaların (IP adresleri) istatistikleri.

### Adımlar:

1. **Statistics → Endpoints** → IPv4 sekmesi
2. Endpoint listesini incele:

| Adres | Paket Gönderme | Paket Alma | Bayt Toplam |
|-------|---------------|------------|-------------|
| 172.50.2.10 | 500 | 600 | 1.2 MB |
| 172.50.2.100 | 800 | 400 | 1.5 MB |
| 172.50.2.200 | 50 | 10 | 5 KB |

3. Hangi IP en çok trafik üretiyor?
4. Hangi IP en az trafik üretiyor? (anomali olabilir)
5. **Sağ tık → Apply as Filter** ile sadece o IP'nin trafiğini gör

### Normal vs Anormal IP Davranışları:

| Davranış | Normal | Anormal |
|----------|--------|---------|
| İstemci trafiği | Gün boyu sabit | Sadece gece (exfiltration) |
| Sunucu trafiği | Dengeli al/gönder | Çok al az gönder (backdoor) |
| Yeni IP | Nadiren | Sık sık (bot/scan) |
| IP range | Bilinen subnet | Bilinmeyen subnet |

> **SINAV İPUCULARI:**
>
> - Endpoints = tüm IP'lerin özeti
> - En çok veri gönderen IP = dikkat edilecek nokta
> - Bilinmeyen IP = araştırılmalı
> - **IPv4, IPv6, TCP, UDP** sekmeleri arasında geçiş yapılabilir

---

## Alıştırma 4: Capture File Properties

Capture dosyasının genel istatistikleri.

### Adımlar:

1. **Statistics → Capture File Properties** (Ctrl+Alt+Shift+C)
2. Genel bilgiler:

```text
Capture
  Filename: module-26-baseline.pcap
  Size: 12 kB
  Packets: 84
  First packet: 2026-07-14 16:09:19
  Last packet: 2026-07-14 16:09:26
  Elapsed: 00:00:07

Statistics
  Avg packets/s: 11
  Avg bytes/s: ~1.5 KB
  Avg packet size: 128 bytes
```

3. **Hash** sekmesi:
   - MD5, SHA1, SHA256 hash'leri
   - Forensic chain of custody için kullanılır
4. **Statistics** sekmesi:
   - TCP, UDP, ICMP, ARP paket sayıları

> **SINAV İPUCULARI:**
>
> - File Properties = capture'ın kimlik bilgileri
> - Hash = dosya bütünlüğü doğrulama
> - Average packet size = küçük paketler anomaly (scan)
> - Elapsed time = capture süresi

---

## Alıştırma 5: Karşılaştırmalı Baseline

Farklı modüllerin pcap'lerini karşılaştırma.

### Adımlar:

1. Her modülün pcap'ini ayrı ayrı aç:
   - `module-13-http.pcap` (HTTP)
   - `module-12-dns.pcap` (DNS)
   - `module-08-tcp.pcap` (TCP)
   - `module-26-baseline.pcap` (Karışık)

2. Her biri için Protocol Hierarchy kaydet:

| Protokol | HTTP pcap | DNS pcap | TCP pcap | Mixed pcap |
|----------|-----------|----------|----------|------------|
| TCP      | %100      | %0       | %100     | %67 (56/84) |
| UDP      | %0        | %96      | %0       | %5 (4/84)  |
| HTTP     | %21 (28/132) | %0   | %0       | %5 (4/84)  |
| DNS      | %0        | %90 (27/30) | %0  | %5 (4/84)  |

3. Her pcap'in **ortalama paket boyutu**:
   - HTTP: ~141 byte
   - DNS: ~152 byte
   - TCP scan: ~104 byte (küçük!)
   - Mixed: ~128 byte

### Baseline Değişiklikleri:

| Zaman | Trafik Profili | Olay |
|-------|---------------|------|
| 09:00-12:00 | HTTP %50, DNS %10 | Normal mesai |
| 12:00-13:00 | HTTP %20, DNS %5 | Öğle arası (düşük) |
| 13:00-14:00 | HTTP %60, DNS %15 | Mesai dönüşü |
| 03:00-04:00 | HTTP %10, DNS %30 | Anormal! (exfiltration) |

> **SINAV İPUÇLARI:**
>
> - Her protokolün kendine özgü paket boyutu vardır
> - Ortalama paket boyutunun değişmesi = anomali
> - Beklenmeyen zamanda trafik artışı = şüpheli
> - Baseline periyodik olarak güncellenmelidir

---

## Alıştırma 6: Anomali Tespit Senaryosu

Bir pcap'de normal ve anormal trafiği ayırma.

### Adımlar:

1. `module-26-baseline.pcap`'i aç
2. Önce **normal baseline** çıkar:
   - Protocol Hierarchy: Hangi protokoller?
   - Conversations: Hangi IP'ler konuşuyor?
   - Endpoints: Kaç farklı IP var?
3. Anormallikleri tespit et:
   - Port scan var mı? `tcp.flags.syn == 1 && tcp.flags.ack == 0`
   - Brute force var mı? `ftp.response.code == 530`
   - DNS anomali var mı? `dns.flags.rcode == 3`
   - HTTP 404/500 var mı? `http.response.code >= 400`
4. **IO Graph** ile zaman bazlı anormallik:
   - Normal trafik seviyesi nedir?
   - Ani yükselişler ne zaman?

### Tespit Edilen Anormallikler:

| Anomali | Filtre | Sayı |
|---------|--------|------|
| Port scan | `tcp.flags.syn == 1 && tcp.flags.ack == 0` | 50+ |
| Brute force | `ftp.response.code == 530` | 5 |
| HTTP error | `http.response.code >= 400` | 3 |
| DNS NXDomain | `dns.flags.rcode == 3` | 2 |

> **SINAV İPUCULARI:**
>
> - Baseline olmadan anomali tespit edilemez
> - IO Graph'taki ani yükselişler her zaman anomali değildir (mesai başlangıcı)
> - Zaman bazlı analiz = anomali tespitinin temeli
> - Protocol Hierarchy + Conversations + IO Graph = üçlü tarama

> **İstihbarat İşaretleri, Baseline stratejisi:**
>
> - Haftalık baseline tutulur
> - Beklenmeyen protokol değişikliği = tehdit
> - Gece trafiği insan kaynaklı değilse = bot/script
> - Yeni IP'ler takip edilir (saldırgan yeni IP kullanabilir)

---

## Hızlı Referans - Baseline Araçları

| Menü | Kısayol | Amaç |
|------|---------|------|
| Statistics → Protocol Hierarchy | - | Protokol dağılımı |
| Statistics → Conversations | - | IP çiftleri |
| Statistics → Endpoints | Ctrl+E | Tüm uç noktalar |
| Statistics → Capture File Properties | Ctrl+Alt+Shift+C | Capture özeti |
| Statistics → IO Graph | - | Zaman bazlı dağılım |

### tshark Baseline Komutları:

```sh
# Protocol Hierarchy
tshark -r shared/pcaps/module-26-baseline.pcap -z io,phs

# Conversations
tshark -r shared/pcaps/module-26-baseline.pcap -z conv,tcp
tshark -r shared/pcaps/module-26-baseline.pcap -z conv,udp

# Endpoints
tshark -r shared/pcaps/module-26-baseline.pcap -z endpoints,ip
tshark -r shared/pcaps/module-26-baseline.pcap -z endpoints,tcp

# IO Graph (1 sn aralık)
tshark -r shared/pcaps/module-26-baseline.pcap \
  -z io,stat,1,"tcp.port==80","tcp.port==443"
```

> **SINAV İPUCU:** Baseline oluşturmak, sınavda pcap analizi sorularında ilk adımdır.
>
> Önce Protocol Hierarchy'e bak, sonra Conversations, sonra IO Graph.

> **İstihbarat İşaretleri, Baseline stratejik önemi:**
>
> - Düzenli baseline = anomali tespit hızı artar
> - Baseline sapmaları = SOC alarmı
> - Saldırganın trafiği baseline dışında kalır
> - Her yeni cihaz baseline'ı değiştirir

---

## Sınav Soruları (Çöz)

1. Protocol Hierarchy hangi bilgileri verir? Hangi protokolün normal oranı nedir?
2. Conversations ile Endpoints arasındaki fark nedir?
3. Capture File Properties'de hash neden önemlidir?
4. Bir pcap'de baseline nasıl çıkarılır? Hangi 3 araç kullanılır?
5. Ortalama paket boyutu hangi durumlarda düşer? Bu neyi gösterir?
6. Zaman bazlı baseline neden önemlidir?
7. Normal bir HTTP ağında Protocol Hierarchy'de TCP oranı neden yüksektir?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. Tüm protokollerin paket ve byte dağılımını hiyerarşik olarak gösterir. Normal bir ağda TCP %40-70, UDP %10-30, DNS %5-15, HTTP %20-40 oranında olabilir.

2. Conversations = iki IP arasındaki iletişim (çift). Endpoints = tek bir IP'nin tüm trafiği. Conversations bağlantı odaklıdır, Endpoints cihaz odaklıdır.

3. Hash, capture dosyasının bütünlüğünü ve değişmediğini kanıtlar. Forensic zincirinde (chain of custody) delilin bozulmadığını göstermek için kullanılır.

4. 1) Protocol Hierarchy → protokol dağılımı, 2) Conversations → IP çiftleri, 3) IO Graph → zaman bazlı dağılım. Bu 3 araç temel baseline'ı oluşturur.

5. Port scan, DNS, ACK-only paketleri gibi küçük paketler arttığında ortalama paket boyutu düşer. Bu genellikle tarama, keşif veya anomali işaretidir.

6. Zaman, trafiğin normal desenini belirler (mesai saatleri vs gece). Gece gelen trafik insan kaynaklı değilse otomasyon/bot/tehdit işaretidir.

7. HTTP, TCP üzerinde çalışır. Her HTTP istek-response'u TCP bağlantısı gerektirir. Bu nedenle HTTP ağırlıklı bir pcap'de TCP oranı doğal olarak yüksektir.

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
