---
layout: post
title:  "shark-tank - m21: Gelişmiş Capture Teknikleri"
date:   2026-08-07 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 21: Gelişmiş Capture Teknikleri

**Neden?** APT saldırısı 6 ay önce başlamış. Hâlâ capture log'ları var mı? Yoksa saldırganın izini süremezsin. APT saldırıları aylarca sürebilir. Uzun süreli capture (ring buffer, multi-file) ile saldırının geçmişe dönük analizi yapılır. Remote capture (SSH, RDP) ile merkezi toplama, merge ile farklı kaynakları birleştirme, snaplen ile performans optimizasyonu gerçek IR senaryolarında kritiktir. Bu modülde, kurumsal capture altyapısını kurmayı öğreneceksin.

**Görev:** Wireshark'ın ileri düzey capture özelliklerini öğren. Ring buffer, multi-file capture ve capture filtrelerini ustaca kullan.

**Öğrenim Hedefleri:**
- Ring buffer ve multi-file capture ile uzun süreli yakalama yapabilmek
- Snap length (snaplen) ile performans optimizasyonu yapabilmek
- Capture filter (BPF) ile canlı yakalamada sadece ilgili trafiği alabilmek
- Remote capture (SSH, UDP) ile merkezi toplama yapabilmek
- Mergecap ile birden fazla pcap dosyasını birleştirebilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **promiscuous mode** | Ağ kartının (NIC) sadece kendisine gönderilen paketleri değil, ağda dolaşan tüm paketleri yakalamasını sağlayan çalışma modu. Normal modda bir ağ kartı, hedef MAC adresi kendisi olmayan paketleri göz ardı eder. Promiscuous mode'da ise tüm paketler yakalanır. Switch ortamında bir port sadece kendisiyle ilgili trafiği gördüğü için, tüm ağ trafiğini yakalamak için switch'in port mirroring (SPAN) özelliği kullanılır. Wireshark'ın capture başlatırken varsayılan olarak promiscuous mode'u açıktır. Hub ortamında tüm trafik zaten tüm portlara gönderildiği için promiscuous mode otomatik olarak tüm trafiği yakalar. |
| **ring buffer** | Yakalanan trafiğin belirli sayıda dosya arasında döngüsel olarak yazılması ve en eski dosyanın otomatik olarak üzerine yazılması tekniği. Örneğin 10 dosya, her biri 100 MB olarak ayarlanırsa, Wireshark ilk dosyayı 100 MB'a kadar doldurur, sonra ikinci dosyaya geçer ve 10. dosya dolduğunda tekrar 1. dosyanın üzerine yazar. Bu sayede disk alanı sonsuz gibi kullanılır ve her zaman en güncel trafiğe erişilir. APT (Advanced Persistent Threat) saldırılarında aylar öncesinin trafiğini incelemek gerektiğinde ring buffer ile sürekli capture yapılarak geçmişe dönük analiz mümkün olur. |
| **snap length (snaplen)** | Capture sırasında her paketin kaç byte'ının yakalandığını belirleyen ayar. Varsayılan değer 262144 byte'tır (256 KB), bu da bir paketin tamamını yakalamak için yeterlidir. Ancak paketlerin sadece header kısımları incelenecekse (IP, TCP header gibi), snaplen küçültülerek (örn. 128 byte) disk alanı ve işlemci yükü azaltılabilir. Dezavantajı, uygulama verisinin (payload) kesilmesidir: Snaplen 128 ise bir HTTP response body'sinin sadece ilk bir kısmı yakalanır, geri kalanı kaybolur. Güvenlik analizinde payload önemli olduğu için genellikle tam snaplen kullanılır. |
| **capture filter** | Trafik yakalanırken, yani capture öncesi uygulanan filtre. Display filter'dan temel farkı: Capture filter'a uymayan paketler hiç yakalanmaz ve kalıcı olarak kaybolur. Bu nedenle capture filter kullanırken kritik paketleri kazara eleme riski vardır. Capture filter, BPF (Berkeley Packet Filter) syntax'ı kullanır; display filter'dan farklı bir yazım kuralı vardır. Canlı trafik izlerken performansı artırmak için kullanılır, ama sınavda hazır pcap dosyaları verildiği için display filter daha sık kullanılır. |
| **BPF** | Berkeley Packet Filter: Capture filter'ların kullandığı dil ve altyapı. tcpdump, Wireshark capture filter ve diğer paket yakalama araçları BPF syntax'ını kullanır. Display filter'dan farklı olarak protokol katmanlarına değil, raw byte offset'lere dayanır: `tcp dst port 80`, `host 172.50.2.10`, `not port 22` gibi. Doğru yazılmış bir BPF ifadesi çekirdek (kernel) seviyesinde çalıştığı için yüksek hızlı trafikte bile performans yükü en azdır. |

## Teori

Wireshark sadece "başla ve dur" butonlarından ibaret değildir. Production ortamında sürekli, optimize edilmiş ve yönetilebilir capture yapmak için gelişmiş ayarlar gerekir.

### Capture Options Dialog (Ctrl+K)

Capture > Options (veya Ctrl+K) menüsü tüm capture ayarlarının merkezi:

| Seçenek | Açıklama |
|---------|----------|
| **Interface list** | Hangi ağ arayüzünden capture yapılacağı |
| **Promiscuous mode** | Tüm paketleri yakala (sadece bana gönderileni değil) |
| **Snap length** | Her paketin kaç byte'ını yakala (default: 262144) |
| **Ring buffer** | N dosya arasında döngüsel yazma |
| **Multi-file** | Dosya boyut/süre sınırına göre yeni dosya |
| **Auto-stop** | Paket/boyut/süre limiti |
| **Capture filter** | BPF syntax ile sadece ilgili paketler |
| **Name resolution** | Capture sırasında DNS/MAC çözümleme (performans etkisi) |

### Promiscuous Mode

Normal modda ağ kartı sadece kendisine gönderilen paketleri işler. Promiscuous mode'da ağ kartı **tüm paketleri** yakalar, hedef adres ne olursa olsun.

- Switch ortamında: Sadece kendi port'una gelen trafik görünür
- Hub ortamında: Tüm trafik görünür
- Port mirroring ile: Switch'in tüm trafiği bir porta kopyalanır

### Snap Length

Her paketin yakalanan byte sayısıdır. Default: 262144 byte (256 KB). Çoğu paket bundan çok daha küçüktür.

| Snap Length | Yakalanan | Kullanım |
|-------------|-----------|----------|
| **262144** (default) | Tüm paket | Tam analiz |
| **128** | Header + biraz payload | Genel izleme |
| **68** | IP + TCP header | Sadece header analizi |
| **0** (65535) | Tüm paket | Default ile aynı |

> Header analizi için snap length küçültmek, capture performansını önemli ölçüde artırır.
>
> Payload gerekmiyorsa 68 byte yeterlidir: 14 (Ethernet) + 20 (IP) + 20 (TCP) + geriye kalan.

### Ring Buffer

Ring buffer, sabit sayıda dosya arasında döngüsel yazma yapar:

```text
Dosya 1 (100KB) → Dolunca → Dosya 2 (100KB) → Dolunca
→ Dosya 3 (100KB) → Dolunca → Dosya 1 (üzerine yaz)
                                             ↑
                                    En eski dosya silinir
```

- **N dosya**, her biri **M KB/MB** boyutunda
- En eski dosya otomatik üzerine yazılır
- Disk asla dolmaz
- Continuous monitoring için ideal

### Multi-File Capture

Ring buffer'dan farklı olarak, eski dosyalar silinmez. Yeni dosya oluşturulur:

- **Dosya boyutuna göre:** her 1MB'da yeni dosya
- **Süreye göre:** her 60 saniyede yeni dosya
- Dosyalar: `capture_00001.pcap`, `capture_00002.pcap`, ...

### Auto-Stop Conditions

Capture'ın otomatik duracağı koşullar:

| Koşul | Parametre | Örnek |
|-------|-----------|-------|
| Paket sayısı | After N packets | 100 paket sonra dur |
| Dosya boyutu | After N MB | 1 MB sonra dur |
| Süre | After N seconds | 60 saniye sonra dur |

### Capture Filters (BPF)

Display filter'dan farklı olarak, capture filter paketleri **yakalama anında** filtreler. Yakalanmayan paketler kaybolur. BPF (Berkeley Packet Filter) syntax kullanır.

| BPF Filtre | Açıklama |
|------------|----------|
| `host 172.50.2.10` | Belirli IP adresi |
| `net 172.50.2.0/24` | Alt ağ |
| `port 80` | Belirli port |
| `portrange 1-1024` | Port aralığı |
| `tcp` | Sadece TCP |
| `udp` | Sadece UDP |
| `icmp` | Sadece ICMP |
| `tcp port 80 and host 172.50.2.10` | Bileşik filtre |
| `tcp[tcpflags] & (tcp-syn) != 0` | SYN paketleri |
| `tcp[tcpflags] & (tcp-syn\|tcp-fin) != 0` | SYN veya FIN |
| `not port 22` | SSH hariç |
| `ether host aa:bb:cc:dd:ee:ff` | MAC adresi |
| `vlan` | VLAN etiketli paketler |

> **SINAV İPUCU:** Capture filter (BPF) ile display filter farklıdır.
>
> Capture filter capture sırasında uygulanır, yakalanmayan paketler kaybolur. Display filter capture sonrası uygulanır, hiçbir paket kaybolmaz.
>
> Capture filter syntax: `host X and port Y`. Display filter syntax: `ip.src == X && tcp.port == Y`.

### Name Resolution

Capture sırasında DNS ve MAC adres çözümleme:

| Seçenek | Etki |
|---------|------|
| **Resolve MAC addresses** | MAC → üretici adı (OUI lookup) |
| **Resolve network addresses** | IP → hostname (DNS lookup) |
| **Resolve transport names** | Port → protokol adı |

> Name resolution capture hızını düşürür. Her paket için DNS sorgusu yapılabilir.
>
> Production'da kapalı tutulur, analiz sırasında açılır.

### Monitor Mode (Wireless)

WiFi arayüzlerinde monitor mode, tüm WiFi frameleri yakalar:

- Normal mode: Sadece associated olduğu AP'nin trafiği
- Monitor mode: Tüm WiFi kanalları, tüm AP'ler, tüm cihazlar
- 802.11 header'lar görünür (management, control, data frames)

> **SINAV İPUCU:** Ring buffer ve multi-file capture sınavda sorulur. tshark'ın `-b` (buffer) ve `-a` (autostop) parametreleri önemli.
>
> Snap length'ı küçültmek capture performansını artırır.

> **İstihbarat İşaretleri, Capture stratejisi incident response için kritik:**
>
> - Ring buffer ile disk dolması engellenir
> - Snap length küçültmek header analizi için yeterlidir (payload gerekmiyorsa)
> - BPF capture filter ile sadece ilgili trafik yakalanır
> - Name resolution'ı kapatmak capture hızını artırır
> - Production'da dumpcap + tshark kombinasyonu kullanılır

## Hazırlık

Bu modül canlı capture gerektirir. Wireshark'ın capture ayarlarını keşfetmek için:

```sh
# Docker ağını kontrol et:
docker network ls

# Container'ların ağ arayüzlerini gör:
docker exec shark-tank-client ip link show

# Capture için host makinede Wireshark çalıştır:
# macOS: open -a Wireshark
# Linux: sudo wireshark &
# Windows: Wireshark'i yönetici olarak çalıştır
```

> **Not:** Canlı capture için yönetici (root/administrator) yetkisi gerekir. Docker ortamında capture yapmak için `tcpdump` veya host makinede Wireshark/tshark kullanılır.

> **Not:** Bu modülün kendine ait bir pcap dosyası yoktur. Alıştırmalarda `shared/pcaps/module-13-http.pcap` (Modül 13 HTTP) kullanılır. Bu modülün amacı capture **tekniklerini** öğrenmektir, belirli bir pcap'i analiz etmek değildir.
>
> Repoyu indirmediysen pcap dosyalarını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

---

## Alıştırmalar

### Alıştırma 1: Capture Options Keşfi

### Adımlar:

1. Wireshark'ı aç ve **Capture > Options** menüsüne git (Ctrl+K)
2. Interface listesini incele:
   - Hangi arayüzler mevcut?
   - Hangisinin IP adresi var?
   - Traffic sütununda hangi arayüzde hareket var?
3. **Promiscuous mode** checkbox'ını bul: Tüm arayüzlerde varsayılan olarak açık
4. **Snap length** alanını bul: default 262144
5. **Output** sekmesini aç: Dosya kaydetme seçenekleri
6. **Options** sekmesini aç: Auto-stop ve name resolution ayarları

### Capture Options Alanları:

```text
+-- Capture Options --------------------------------------+
|                                                         |
|  Interface:  [en0 v]                                    |
|  Promiscuous: [x] Enable promiscuous mode               |
|  Snap length: [262144] bytes                            |
|                                                         |
|  +-- Output -------------------------------+            |
|  | File:        [capture.pcap       ]      |            |
|  | Ring buffer:  [3] files                 |            |
|  | New file after: [1000] KB               |            |
|  +-----------------------------------------+            |
|                                                         |
|  +-- Options --------------------------------+          |
|  | Stop after:  [  ] packets                 |          |
|  |              [  ] MB                      |          |
|  |              [  ] seconds                 |          |
|  |                                           |          |
|  | Capture filter: [                  ]      |          |
|  |                                           |          |
|  | Name resolution:                          |          |
|  | [x] Resolve MAC addresses                 |          |
|  | [ ] Resolve network addresses             |          |
|  | [ ] Resolve transport names               |          |
|  +-------------------------------------------+          |
|                                                         |
|              [ Start ]  [ Cancel ]                      |
+---------------------------------------------------------+
```

> **SINAV İPUCU:** Capture Options dialog sınavda "Wireshark'da hangi ayar nerededir?" şeklinde sorulabilir.
>
> Ctrl+K kısayolunu bil.

---

### Alıştırma 2: Ring Buffer

Ring buffer ile sürekli capture yap. Disk dolması engellenir.

### Adımlar:

1. **Capture > Options** (Ctrl+K)
2. Arayüzü seç (en0, eth0 veya aktif arayüz)
3. **Output** sekmesine geç
4. Dosya adı: `ring_capture.pcap`
5. **"Create a new file automatically after"** seçeneğini aktif et
6. **"100" KB** olarak ayarla (test için küçük tut)
7. **"Use a ring buffer with"** seçeneğini aktif et
8. **"3" files** olarak ayarla
9. **Start** butonuna bas
10. Trafik oluştur (browser'ı aç, ping at, vs.)
11. Dosyaların döndüğünü gözlemle:
```text
    ring_capture_00001_20240101_0000.pcap
    ring_capture_00002_20240101_0001.pcap
    ring_capture_00003_20240101_0002.pcap
```
12. 4. dosya oluştuktan sonra 1. dosyanın üzerine yazıldığını teyit et

### Ring Buffer Mantığı:

```text
Zaman →  Dosya 1   Dosya 2   Dosya 3
t=0     [YAZILIYOR]  [  BOŞ  ]  [  BOŞ  ]
t=1     [   DOLU  ] [YAZILIYOR]  [  BOŞ  ]
t=2     [   DOLU  ] [   DOLU  ] [YAZILIYOR]
t=3     [YAZILIYOR] [   DOLU  ] [   DOLU  ]  ← Dosya 1 üzerine yazılır
t=4     [   DOLU  ] [YAZILIYOR] [   DOLU  ]  ← Dosya 2 üzerine yazılır
```

> **SINAV İPUCU:** Ring buffer'da en eski dosya otomatik silinir. Toplam disk kullanımı = N × dosya boyutu.
>
> Hiçbir zaman bu değeri aşmaz.

---

### Alıştırma 3: Multi-File Capture

Ring buffer'dan farklı olarak eski dosyalar korunur.

### Adımlar:

1. **Capture > Options** (Ctrl+K)
2. Arayüzü seç
3. **Output** sekmesine geç
4. Dosya adı: `multi_capture.pcap`
5. **"Create a new file automatically after"** seç
6. **"1" MB** olarak ayarla
7. Ring buffer'ı **BOŞ** bırak (multi-file, ring değil)
8. **Start** butonuna bas
9. 60 saniye boyunca trafik oluştur
10. Capture'ı durdur
11. Birden fazla dosya oluştuğunu teyit et:
```text
    multi_capture_00001_20240101_0000.pcap  (1.0 MB)
    multi_capture_00002_20240101_0001.pcap  (1.0 MB)
    multi_capture_00003_20240101_0002.pcap  (0.3 MB)
```

### Ring Buffer vs Multi-File:

| Özellik | Ring Buffer | Multi-File |
|---------|-------------|------------|
| Eski dosyalar | Silinir (üzerine yazılır) | Korunur |
| Disk kullanımı | Sabit (N × boyut) | Sürekli artar |
| Kullanım | 7/24 monitoring | Forensic kayıt |
| Dosya sayısı | Sabit (N) | Sürekli artar |

> **SINAV İPUCU:** Multi-file capture büyük capture dosyalarını yönetmek için kullanılır. Her dosya tek başına açılabilir ve analiz edilebilir.
>
> Ring buffer ise disk dolmasını önlemek için kullanılır.

---

### Alıştırma 4: Auto-Stop Conditions

Capture'ın otomatik duracağı koşulları ayarla.

### Test 1: Paket Sayısı ile Durdurma

1. Capture > Options
2. **Options** sekmesine geç
3. **Stop after N packets:** `100`
4. Diğer auto-stop değerlerini boş bırak
5. Start butonuna bas
6. Tam 100 paket yakalandıktan sonra capture'ın durduğunu teyit et
7. Status bar'da: "Captured: 100 packets" görmeli

### Test 2: Süre ile Durdurma

1. **Stop after N seconds:** `10`
2. Start butonuna bas
3. Tam 10 saniye sonra capture'ın durduğunu teyit et

### Test 3: Dosya Boyutu ile Durdurma

1. **Stop after N MBs:** `1`
2. Start butonuna bas
3. 1 MB yakaladıktan sonra capture'ın durduğunu teyit et

> **SINAV İPUCU:** Auto-stop koşulları birleştirilebilir. İlk karşılanan koşulda capture durur.
>
> Örneğin "100 paket VEYA 60 saniye" denirse, hangisi önce gerçekleşirse capture o anda durur.

---

### Alıştırma 5: Snap Length Optimizasyonu

Snap length'i değiştirip dosya boyutunu karşılaştır.

### Adım 1: Full Capture (Default)

1. Capture > Options
2. Snap length: **262144** (default)
3. 100 paket yakala (auto-stop: 100 packets)
4. Dosyayı kaydet: `snap_full.pcap`
5. Dosya boyutunu not et

### Adım 2: Header-Only Capture

1. Capture > Options
2. Snap length'i **68** olarak ayarla (14 Ethernet + 20 IP + 20 TCP + 14 geriye kalan)
3. Aynı ortamda 100 paket yakala (auto-stop: 100 packets)
4. Dosyayı kaydet: `snap_68.pcap`
5. Dosya boyutunu not et

### Karşılaştırma:

```sh
# macOS / Linux:
ls -la snap_full.pcap snap_68.pcap

# Windows (PowerShell):
Get-Item snap_full.pcap, snap_68.pcap | Select-Object Name, Length
```

### Beklenen Sonuç:

| Snap Length | Dosya Boyutu | Payload | Analiz |
|-------------|-------------|---------|--------|
| 262144 (full) | ~100-200 KB | Tam | Tüm içerik görünür |
| 68 (header) | ~10-20 KB | Yok | Sadece header |

### Truncated Paket Tespiti:

Wireshark truncated paketleri gösterir:
```text
[Packet size limited during capture: TCP header + data]
```

> **SINAV İPUCU:** Snap length'ı küçültmek capture performansını artırır, çünkü her paket için daha az veri yazılır. Header analizi için 68 byte yeterlidir.
>
> Payload analizi gerekiyorsa default bırakılmalıdır.

---

### Alıştırma 6: Capture Filter Performansı

BPF capture filter ile performansı karşılaştır.

### Test 1: Filtresiz Capture

1. Capture > Options
2. Capture filter: **boş**
3. Auto-stop: 10 saniye
4. Start butonuna bas
5. Kaç paket yakalandığını not et
6. Dosyayı kaydet: `no_filter.pcap`

### Test 2: BPF Filter ile Capture

1. Capture > Options
2. Capture filter: `host 172.50.2.10 and port 80`
3. Auto-stop: 10 saniye
4. Start butonuna bas
5. Kaç paket yakalandığını not et
6. Dosyayı kaydet: `bpf_filter.pcap`

### Karşılaştırma:

| Metrik | Filtresiz | BPF Filter |
|--------|-----------|------------|
| Paket sayısı | Tüm trafik | Sadece belirli host:port |
| Dosya boyutu | Büyük | Küçük |
| Capture yükü | Yüksek | Düşük |
| Kayıp paket | Olabilir (yük trafikte) | Az (kernel seviyesinde filtre) |

### BPF Syntax Kuralları:

```text
# Mantıksal operatörler: and, or, not
host 172.50.2.10 and port 80
host 172.50.2.10 or host 172.50.2.200
not port 22

# Protokol bazlı:
tcp
udp port 53
icmp

# Port aralığı:
portrange 1-1024

# TCP bayrakları:
tcp[tcpflags] & (tcp-syn) != 0
tcp[tcpflags] & (tcp-syn|tcp-fin) != 0
tcp[tcpflags] & (tcp-rst) != 0

# MAC adresi:
ether host 02:42:ac:14:02:0a

# Alt ağ:
net 172.50.2.0/24

# Boyut bazlı:
greater 1000          # 1000 byte'tan büyük
less 200              # 200 byte'tan küçük
```

> **SINAV İPUCU:** Capture filter BPF syntax kullanır, display filter değil. `host X and port Y` (BPF) vs `ip.src == X && tcp.port == Y` (display).
>
> Karıştırılmaz.

---

### Alıştırma 7: File Merge

Birden fazla pcap dosyasını birleştir.

### Adımlar:

1. İki ayrı capture yap:
```text
   # Capture 1: 30 saniye, normal trafik
   capture1.pcap

   # Capture 2: 30 saniye, farklı trafik (örneğin ping)
   capture2.pcap
```

2. `capture1.pcap` dosyasını Wireshark'ta aç
3. **File > Merge** menüsüne git
4. `capture2.pcap` dosyasını seç
5. Merge yöntemini seç:
   - **Merge by timestamp** (önerilen): Paketler zaman
     sırasına göre birleştirilir
   - **Merge by prepend:** ikinci dosya başa eklenir
   - **Merge by append:** ikinci dosya sona eklenir
6. Merge sonrası paket sırasını kontrol et:
```text
   frame.time_relative sütununda artan sıra olmalı
```

### tshark ile Merge:

```sh
# mergecap ile birleştir (Wireshark ile birlikte gelir):
mergecap -w merged.pcap capture1.pcap capture2.pcap

# Timestamp sırasına göre:
mergecap -a -w merged.pcap capture1.pcap capture2.pcap
```

> **SINAV İPUCU:** mergecap, Wireshark kurulumuyla gelen bir araçtır. `-a` parametresi timestamp sırasına göre birleştirir.
>
> Birden fazla dosya verilebilir.

---

### Alıştırma 8: Tshark ile Sürekli Capture

CLI'da ring buffer ve auto-stop kullanımı.

### Ring Buffer ile tshark:

```sh
# Ring buffer: 5 dosya, her biri 1000 KB
sudo tshark -i en0 -w ring.pcap -b filesize:1000 -b files:5

# Açıklama:
# -i en0        : arayüz (macOS: en0, Linux: eth0)
# -w ring.pcap  : dosya adı prefix'i
# -b filesize:1000 : her dosya max 1000 KB
# -b files:5    : max 5 dosya (ring buffer)

# Dosyalar:
# ring_00001_20240101_0000.pcap
# ring_00002_20240101_0001.pcap
# ring_00003_20240101_0002.pcap
# ring_00004_20240101_0003.pcap
# ring_00005_20240101_0004.pcap
# → 6. dosyada 1. dosyanın üzerine yazılır
```

### Auto-Stop ile tshark:

```sh
# 60 saniye capture, sonra otomatik dur:
sudo tshark -i en0 -a duration:60 -w timed.pcap

# 100 paket capture, sonra dur:
sudo tshark -i en0 -a packets:100 -w packet_limited.pcap

# 1 MB capture, sonra dur:
sudo tshark -i en0 -a filesize:1024 -w size_limited.pcap

# Bileşik: 60 saniye VEYA 1000 paket (hangisi önce):
sudo tshark -i en0 -a duration:60 -a packets:1000 -w combined.pcap
```

### Capture Filter ile tshark:

```sh
# Sadece HTTP trafiği yakala:
sudo tshark -i en0 -f "tcp port 80" -w http_only.pcap

# Sadece belirli IP:
sudo tshark -i en0 -f "host 172.50.2.10" -w host_capture.pcap

# Ring buffer + capture filter:
sudo tshark -i en0 -f "tcp port 80" -w http_ring.pcap \
  -b filesize:1000 -b files:3
```

### dumpcap ile Capture (Daha Hafif):

```sh
# dumpcap, Wireshark'ın arka plan capture aracıdır
# tshark'tan daha hafif, sadece capture yapar (analiz yok)

# Ring buffer ile:
sudo dumpcap -i en0 -w dump.pcap -b filesize:1000 -b files:5

# Multi-file:
sudo dumpcap -i en0 -w dump.pcap -b filesize:1024
```

### tshark Parametre Karşılaştırması:

| Parametre | Anlamı | Ring Buffer mi? | Auto-Stop mu? |
|-----------|--------|-----------------|---------------|
| `-b filesize:N` | Dosya boyutu limiti (KB) | Evet | Hayır |
| `-b files:N` | Maks dosya sayısı | Evet (ring) | Hayır |
| `-b interval:N` | Yeni dosya N saniyede bir | Evet | Hayır |
| `-a duration:N` | N saniye sonra dur | Hayır | Evet |
| `-a packets:N` | N paket sonra dur | Hayır | Evet |
| `-a filesize:N` | N KB sonra dur | Hayır | Evet |

> **SINAV İPUCU:** tshark'ta `-b` buffer parametreleri (ring buffer ve multi-file) ile `-a` autostop parametrelerini karıştırma.
>
> `-b` dosya yönetimi, `-a` capture'ı durdurma.

---

### Alıştırma 9: Wireshark Profilleri

Profiller, Wireshark arayüzünü farklı analiz senaryolarına göre özelleştirmeni sağlar. Her profil kendi:
- Coloring rules, column layout, display filter butonları
- Capture/display filter makroları
- Protocol preferences, name resolution, layout ayarları

#### Varsayılan Profil Yolu:

| Platform | Dizin |
|----------|-------|
| Windows | `%APPDATA%\Wireshark\profiles` |
| macOS | `~/.config/wireshark/profiles/` |
| Linux | `~/.config/wireshark/profiles/` |

Her profil `profiles/` dizini altında bir alt dizindir.

#### Profil Oluşturma:

1. **Manage Profiles → Profiles → New** (Ctrl+Shift+A)
2. İsim ve isteğe bağlı açıklama gir
3. Mevcut ayarları kopyala veya sıfırdan başla
4. OK → otomatik geçiş yapılır

#### Profil Kullanımı:

- **Alt + Sağ/Sol ok**: Hızlı profil geçişi
- **Manage Profiles → Profiles**: Silme, kopyalama, export/import
- **Profillerin dosya yapısı:**

```text
~/.config/wireshark/profiles/
|-- Security/
|   |-- coloring_rules
|   |-- dfilter_macros
|   |-- dfilter_buttons
|   |-- preferences
|   `-- recent
|-- VoIP/
`-- Database/
```

#### Alıştırma:

> **Not:** Bu alıştırma gerçek Wireshark kurulumunda yapılır. Container ortamında Wireshark GUI bulunmaz.

1. Wireshark'ı aç, **Manage Profiles** (Ctrl+Shift+A)
2. **New** → `Security-Analiz` profili oluştur
3. `shared/pcaps/module-13-http.pcap` dosyasını aç
4. Coloring Rules: **View → Coloring Rules** → yeni kural ekle:
   - Adı: `HTTP Error`
   - Filtre: `http.response.code >= 400`
   - Renk: Açık kırmızı arka plan, koyu kırmızı yazı
5. Columns: **Edit → Preferences → Appearance → Columns** ekle:
   - `http.request.method` (type: Custom)
   - `http.response.code` (type: Custom)
6. **Apply** → yeni profil aktif
7. Profile'i kapatmak için **Alt + Sol ok** ile Default'a dön

> **SINAV İPUCU:** Profiller, Wireshark sınavında sık sorulan konulardan biridir. Özellikle profil yolu, yeni profil oluşturma ve kolon ekleme bilinmeli.
>
> Profiller farklı analiz senaryoları (Security, VoIP, Database) için ayrı ayrı tasarlanabilir.

> **İstihbarat İşaretleri, Profiller SOAR entegrasyonlarında kullanışlıdır:**
>
> - Security profili ile tehdit avcılığı (threat hunting)
> - VoIP profili ile SIP/RTP analizi
> - Custom column'lar ile spesifik IoC görselleştirme

---

### Alıştırma 10: Global Preferences

Wireshark'ın tüm davranışını kontrol eden ayarlar **Edit → Preferences** (Ctrl+Shift+P) altında kategorize edilmiştir.

#### Önemli Preferences Kategorileri:

| Kategori | Açıklama |
|----------|----------|
| **User Interface** | Layout (paned/tabbed), font, colors, columns |
| **Capture** | Default interface, promiscuous mode, snaplen |
| **Printing** | Yazdırma formatı (Ascii, PostScript, CSV) |
| **Name Resolution** | MAC, transport, network name resolution |
| **Protocols** | Her protokol için özel ayarlar (port, decoding, vb.) |

#### Layout Seçenekleri:

Wireshark arayüzü 3 farklı layout'a sahiptir:

1. **Paned (Default)**: Packet list üstte, details altta
2. **Tabbed**: Packet list ve details aynı yatay alanda sekmeli
3. **Unused**: Ayrı pencereler

**User Interface → Layout**'dan seçilir.

#### Name Resolution:

| Ayarlar | Varsayılan | Etkisi |
|---------|-----------|--------|
| Resolve MAC addresses | Açık | OUI vendor gösterimi |
| Resolve network/IP addresses | Kapalı | DNS sorgusu (yavaşlatır) |
| Resolve transport names | Açık | Port → servis adı (80→http) |

#### Alıştırma:

1. Wireshark'ı aç, **Edit → Preferences** (Ctrl+Shift+P)
2. **Appearance → Layout** altında layout'u değiştir:
   - Packet List: Top
   - Packet Details: Bottom
   - Packet Bytes: Right (3-panel vertical)
3. **Appearance → Columns** altında kolon ekle:
   - **Delta time**: `frame.time_delta_displayed`
   - **Source Port**: `tcp.srcport`
   - **Dest Port**: `tcp.dstport`
4. **Capture** ayarlara gidin:
   - Default interface seç
   - Promiscuous mode: enabled
   - Snaplen: 65535 (ya da 262144 default)
5. **Name Resolution** kısmında:
   - Enable MAC name resolution: enabled
   - Enable network/IP name resolution: disabled (performans)
   - Enable transport name resolution: enabled
6. **Protocols → HTTP**:
   - "Reassemble HTTP headers spanning multiple TCP segments": enabled
   - Port: 80, 8080, 3128

> **SINAV İPUÇLARI:**
>
> - **Layout soruları:** Wireshark'ın 3 paneli (Packet List, Packet Details, Packet Bytes) farklı layout'larda konumlandırılabilir
> - **Name Resolution:** Capture sırasında açılırsa performans düşer, analiz sırasında açılması önerilir
> - **Protocol Preferences:** Her protokolün reassemble, port mapping, decoding ayarları Preferences altındadır
> - **Ctrl+Shift+P = Preferences**, **Ctrl+Shift+A = Manage Profiles**

---

### Alıştırma 11: Mark/Ignore/Annotate

Wireshark, paketleri işaretleme ve yorum ekleme özellikleri ile analiz sırasında dikkat edilmesi gereken noktaları vurgulamanı sağlar.

#### Mark Packet (Ctrl+M):

- Paket satırı koyu arka plan + beyaz yazı olur (varsayılan: koyu petrol mavisi #00202A; Preferences'dan değiştirilebilir)
- İstatistiklerde "Marked" paket olarak sayılır
- **File → Export Specified Packets** → "Marked" seçeneği ile export edilebilir
- Birden fazla paket işaretlenebilir

#### Ignore Packet (Ctrl+D):

- Paket display filter'dan gizlenir (çıkarılır)
- Paket numarası korunur, ancak görünmez
- **View → Ignore/Unignore** ile geri alınır
- İstatistik hesaplamalarına dahil edilmez

#### Time Reference (Ctrl+T):

- Seçili paketten itibaren süre sıfırlanır
- Delta time kolonunda referans noktası
- **Analyze → Reload as Time Reference**
- Yeniden başlatma: Aynı pakete tekrar Ctrl+T

#### Packet Comment (Ctrl+Alt+Shift+C):

- Pakete metin yorumu eklenir
- Packet Details panelinde "Packet Comments" dalı
- Kaydedildiğinde pcapng'de saklanır (pcap kaybeder!)
- **View → Packet Comments** ile tüm yorumlar listelenir

#### Alıştırma:

1. `shared/pcaps/module-13-http.pcap` dosyasını Wireshark'ta aç
2. HTTP 404 dönen paketi bul (Display Filter: `http.response.code == 404`)
   - Mark: Ctrl+M → siyah arka plan
   - Packet Comment (Ctrl+Alt+Shift+C): `"HTTP 404 Bulunamadı"`
3. HTTP 200 OK paketlerini bul (`http.response.code == 200`)
   - Her birini Ignore: Ctrl+D → Satır kaybolur
4. İlk SYN paketini bul (`tcp.flags.syn == 1 && tcp.flags.ack == 0`)
   - Time Reference: Ctrl+T → "T" sütununda referans oluşur
   - Sonraki paketlerin delta time'ı bu noktadan itibaren hesaplanır
5. **Statistics → Capture File Properties** → "Marked" paketleri gör
6. **View → Packet Comments** → eklediğin yorumları listele
7. Ignore'ları geri getirmek için: **View → Ignore/Unignore All**

> **SINAV İPUÇLARI:**
>
> - **Mark (Ctrl+M)** ve **Ignore (Ctrl+D)** sık karıştırılan kısayollardır
> - **Packet Comment sadece pcapng'de saklanır**, eski pcap formatında kaybolur
> - **Export Specified Packets** ile sadece Marked paketler export edilebilir
> - **Time Reference** delta time analizinde kritik öneme sahiptir

> **İstihbarat İşaretleri, Adli bilişimde Mark/Annotate kritiktir:**
>
> - Şüpheli paketler markalanır, sonra topluca export edilir
> - İlgisiz trafik ignore edilerek analiz daraltılır
> - Packet comment ile inceleme notları eklenir
> - Time reference ile saldırı anından itibaren zaman akışı takip edilir

---

### Alıştırma 12: Print/Export/Save Paketler

#### Save vs Export:

- **Save (Ctrl+S)**: Tüm capture'ı kaydeder, format korunur
- **Export**: Belirli paketleri, belirli formata dönüştürür

#### Export Specified Packets:

**File → Export Specified Packets** ile:

| Seçenek | Açıklama |
|---------|----------|
| **All packets** | Tüm paketler |
| **Selected packet only** | Sadece seçili paket |
| **Marked packets** | Sadece işaretli paketler |
| **First to last marked** | İlk işaretli ↔ son işaretli arası |
| **Range** | Paket numarası aralığı |
| **Remove ignored** | Ignore edilenleri çıkar |

Export filtrelenebilir: "Display Filter" girilir.

#### Export Formats:

| Format | Uzantı | Kullanım |
|--------|--------|----------|
| **Plain Text** | .txt | Raporlama |
| **CSV** | .csv | Excel/Splunk aktarımı |
| **JSON** | .json | API/log sistemi entegrasyonu |
| **PSML** | .psml | Sadece packet summary (XML) |
| **PDML** | .pdml | Packet details (XML) |

#### Print:

**File → Print** ile:

| Seçenek | Açıklama |
|---------|----------|
| **Packet Range** | All, Selected, Marked, First-Last Marked, Specified Range |
| **Packet Format** | Line (summary), Packet details, Bytes, Hex dump (Data Link) |
| **Printer** | PDF yazdırma için "Save as PDF" |

#### Save ile Export Arasındaki Fark:

| Özellik | Save | Export |
|---------|------|--------|
| Format | pcapng (native) | TXT, CSV, JSON, PSML, PDML |
| Paket Seçimi | Tüm paketler | Range, marked, selected |
| Filtre | Hayır | Evet (Display Filter) |
| Sıkıştırma | Evet (gzip) | Hayır |

> **pcapng metadata notu:** pcapng formatı yalnızca paketlerden fazlasını
> taşır: **Capture comment** (Statistics > Capture File Properties >
> Capture comment, dosya geneline) ve **packet comment'ler** (paket
> başına, sağ tık > Packet Comment) dosyaya gömülür. Eski pcap formatında
> bunlar kaybolur. DFIR pratiği: Olay yeri bilgisi (analist, tarih,
> delil numarası) capture comment'e yazılır — dosya kendi künyesini
> taşır. tshark ile okuma: `tshark -r dosya.pcapng --export-objects ...`
> yerine `capinfos dosya.pcapng` (comment satırını gösterir).

#### Alıştırma:

> **Not:** Export işlemleri için Wireshark GUI gereklidir. Container'da çalışmaz.

1. `shared/pcaps/module-13-http.pcap` dosyasını Wireshark'ta aç
2. **File → Export Specified Packets**:
   - **Export as CSV**: `http_export.csv`
     - Packet Range: Selected (ilk HTTP paketini seç)
     - Packet Format: Packet details (tüm alanlar)
   - CSV'yi bir text editor ile açıp incele
3. **File → Export Specified Packets → JSON**:
   - Range: 1-50 (ilk 50 paket)
   - Display Filter: `http` (sadece HTTP paketleri)
   - Çıktı: `http_export.json`
   - JSON yapısını incele
4. **File → Print**:
   - Packet Range: Marked packets (önce 3 paketi markala)
   - Packet Format: Line (summary satırı)
   - Output: "Save as PDF" → `marked_summary.pdf`
5. **Edit → Copy** ile clipboard'a kopyalama:
   - Bir paket seç → sağ tık → **Copy → Bytes → Hex Stream**
   - **Copy → All Visible Packets → CSV**
6. Export edilen dosyaları incele: Format farkını gör

> **SINAV İPUÇLARI:**
>
> - Export Specified Packets'te **Display Filter** girilebilir, sadece eşleşen paketler export edilir
> - **CSV** Splunk/ELK gibi SIEM sistemlerine aktarım için idealdir
> - **JSON** API entegrasyonlarında kullanılır
> - **PSML/PDML** XML tabanlıdır, programatik işleme için uygundur
> - **Copy → Bytes → Hex Stream** imza paylaşımında kullanılır

> **İstihbarat İşaretleri, Export format seçimi raporlama için kritiktir:**
>
> - CSV: Excel'de analiz ve grafik
> - JSON: SOAR/API otomasyonu
> - Plain Text: İnceleme raporu
> - PSML: Packet summary (yüksek seviye rapor)
> - PDML: Packet details (detaylı teknik rapor)
> - Copy ile hedef sisteme IOC aktarımı

---

## Filtre Referansı

### Capture Filter (BPF) Referansı

| BPF Filtre | Açıklama |
|------------|----------|
| `host 172.50.2.10` | Belirli IP adresi |
| `src host 172.50.2.10` | Kaynak IP |
| `dst host 172.50.2.10` | Hedef IP |
| `net 172.50.2.0/24` | Alt ağ |
| `port 80` | Belirli port |
| `src port 80` | Kaynak port |
| `dst port 80` | Hedef port |
| `portrange 1-1024` | Port aralığı |
| `tcp` | Sadece TCP |
| `udp` | Sadece UDP |
| `icmp` | Sadece ICMP |
| `arp` | Sadece ARP |
| `tcp port 80` | TCP port 80 |
| `udp port 53` | UDP port 53 |
| `tcp[tcpflags] & (tcp-syn) != 0` | SYN paketleri |
| `tcp[tcpflags] & (tcp-syn\|tcp-fin) != 0` | SYN veya FIN |
| `tcp[tcpflags] & (tcp-rst) != 0` | RST paketleri |
| `tcp[tcpflags] & (tcp-ack) != 0` | ACK paketleri |
| `not port 22` | SSH hariç |
| `ether host aa:bb:cc:dd:ee:ff` | MAC adresi |
| `ether src aa:bb:cc:dd:ee:ff` | Kaynak MAC |
| `ether broadcast` | Broadcast |
| `ether multicast` | Multicast |
| `vlan` | VLAN etiketli |
| `greater 1000` | 1000 byte'tan büyük |
| `less 200` | 200 byte'tan küçük |
| `ip` | Sadece IPv4 |
| `ip6` | Sadece IPv6 |

### BPF Mantıksal Operatörler:

| Operatör | Anlamı | Örnek |
|----------|--------|-------|
| `and` | VE | `host X and port Y` |
| `or` | VEYA | `host X or host Y` |
| `not` | DEĞİL | `not port 22` |

### Capture Filter vs Display Filter:

| Özellik | Capture Filter (BPF) | Display Filter |
|---------|---------------------|----------------|
| **Syntax** | `host X and port Y` | `ip.src == X && tcp.port == Y` |
| **Ne zaman** | Capture sırasında | Capture sonrasında |
| **Kayıp** | Filtre dışı paketler kaybolur | Hiçbir paket kaybolmaz |
| **Performans** | Kernel seviyesinde (hızlı) | Uygulama seviyesinde |
| **Kullanım** | Capture Options, tshark -f | Filtre çubuğu, tshark -Y |

> **SINAV İPUCU:** Ring buffer ve multi-file capture sınavda sorulur. tshark'ın `-b` (buffer) ve `-a` (autostop) parametreleri önemli. Snap length'ı küçültmek capture performansını artırır.

> **İstihbarat İşaretleri, Capture stratejisi incident response için kritik:**
>
> - Ring buffer ile disk dolması engellenir
> - Snap length küçültmek header analizi için yeterlidir (payload gerekmiyorsa)
> - BPF capture filter ile sadece ilgili trafik yakalanır
> - Name resolution'ı kapatmak capture hızını artırır
> - Production'da dumpcap + tshark kombinasyonu kullanılır

---

## Alıştırma: Wireshark Profile Oluşturma

Profiller, farklı analiz senaryoları için özelleştirilmiş Wireshark ortamı sağlar.

### Adımlar:

1. **Edit > Configuration Profiles** (veya durum çubuğundaki profil adına tıkla)
2. **+** ile yeni profil oluştur: "Security Analysis"
3. Bu profilde şunları özelleştir:
   - **Columns**: "Response Time" sütunu ekle (`tcp.analysis.ack_rtt`)
   - **Coloring Rules**: Saldırgan IP'si için kırmızı kural ekle
   - **Display Filter Expressions**: Sık kullanılan filtreleri kaydet
4. "Performance" profili oluştur: TCP Stream Graph ayarları için
5. Profiller arasında hızlı geçiş: Durum çubuğundan profil adına tıkla

> Profil dizini:
>
> - Windows: `%APPDATA%\Wireshark\profiles`
> - macOS/Linux: `~/.config/wireshark/profiles/`

---

## Alıştırma: Mergecap ile pcap Birleştirme

Birden fazla pcap dosyasını tek dosyada birleştirme.

### Adımlar:

```sh
# İki pcap'i timestamp sırasına göre birleştir:
mergecap -a -w merged.pcap \
  shared/pcaps/module-08-tcp.pcap shared/pcaps/module-13-http.pcap

# Birleştirilmiş pcap'i kontrol et:
tshark -r merged.pcap -c 5
```

`-a` parametresi: Timestamp sırasına göre birleştir (en eskiden en yeniye).
`-w` parametresi: Çıktı dosyası.

### editcap ile pcap Düzenleme:

```sh
# İlk 100 paketi al:
editcap -c 100 shared/pcaps/module-27-exam-practice.pcap short.pcap

# Belirli zaman aralığını kes:
editcap -A "2026-07-14 00:00:00" \
  -B "2026-07-14 00:01:00" input.pcap output.pcap

# Her N paketi ayrı dosyaya böl:
editcap -c 50 input.pcap output.pcap
# output_00000.pcap, output_00001.pcap, ...
```

> **SINAV İPUCU:** mergecap ve editcap, Wireshark paketi ile birlikte gelir. mergecap `-a` parametresi timestamp sıralı birleştirme için kritiktir.
>
> editcap ise büyük pcap'leri bölme ve belirli zaman aralıklarını kesme için kullanılır.

---

## Sınav Soruları (Çöz)

1. Ring buffer ne işe yarar?
2. Snap length ne demek? Ne işe yarar?
3. Capture filter ne zaman kullanılır? Display filter'dan farkı nedir?
4. Multi-file capture ne zaman faydalı? Ring buffer'dan farkı nedir?
5. tshark'da ring buffer nasıl ayarlanır?
6. Promiscuous mode ne demek? Neden gereklidir?
7. Name resolution'ı capture sırasında açmak hangi dezavantajı getirir?
8. mergecap ne işe yarar? Hangi parametre timestamp sırasına göre birleştirir?
9. `tshark -i eth0 -a duration:60 -b filesize:1000 -b files:5 -w out.pcap` komutu ne yapar?
10. BPF filtre `tcp[tcpflags] & (tcp-syn) != 0` neyi yakalar?
11. Wireshark profili nedir? Hangi amaçla kullanılır?
12. Wireshark Preferences'da Name Resolution ayarları nerededir? Capture sırasında açık olmasının dezavantajı nedir?
13. Mark (Ctrl+M) ile Ignore (Ctrl+D) arasındaki fark nedir?
14. Export Specified Packets ile Save arasındaki fark nedir? Hangi formatlar export edilebilir?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. Sabit disk alanında döngüsel capture yapar. N dosya arasında sırayla yazar, en eskinin üzerine yazar. Disk asla dolmaz. 7/24 monitoring için idealdir.

2. Her paketin yakalanan byte sayısıdır. Default 262144 byte. Küçültmek capture performansını artırır, çünkü daha az veri yazılır. Header analizi için 68 byte yeterlidir.

3. Capture sırasında kullanılır, sadece eşleşen paketler yakalanır. Display filter capture sonrasında filtre uygular, hiçbir paket kaybolmaz. Capture filter BPF syntax kullanır: `host X and port Y`. Display filter Wireshark syntax kullanır: `ip.src == X && tcp.port == Y`.

4. Büyük capture dosyalarını yönetmek için kullanılır. Dosya boyutuna veya süreye göre yeni dosya oluşturur, eski dosyalar korunur. Ring buffer'dan farkı: Disk kullanımı sürekli artar, eski dosyalar silinmez.

5. `-b filesize:N -b files:N` parametreleri ile. Örnek: `tshark -i eth0 -w capture.pcap -b filesize:1000 -b files:5`. 5 dosya, her biri 1000 KB, en eskisinin üzerine yazar.

6. Ağ kartının tüm paketleri yakalamasını sağlar, hedef adres ne olursa olsun. Normal modda sadece kendisine gönderilen paketler işlenir. Ağ izleme için zorunludur. Switch ortamında port mirroring ile birlikte kullanılır.

7. Her paket için DNS sorgusu yapılabilir. Capture hızını düşürür. Özellikle yoğun trafikte ciddi performans kaybına yol açar. Production'da kapalı tutulur, analiz sırasında açılır.

8. Birden fazla pcap dosyasını tek dosyada birleştirir. `-a` parametresi timestamp sırasına göre birleştirir. Örnek: `mergecap -a -w merged.pcap file1.pcap file2.pcap`.

9. eth0 arayüzünden capture başlatır. Her dosya max 1000 KB, ring buffer ile 5 dosya arasında döngüsel yazar. 60 saniye sonra otomatik durur. Dosya adı prefix: Out.pcap.

10. TCP SYN bayrağı set olan tüm paketleri yakalar. TCP bağlantı başlatma (handshake ilk adım) paketlerini filtreler. Port scan ve SYN flood tespitinde kullanılır.

11. Wireshark profili, arayüz ayarlarının (coloring rules, columns, display filters, preferences) bir bütün olarak kaydedildiği bir özelleştirme şablonudur. Farklı analiz senaryoları (Security, VoIP, Database) arasında hızlı geçiş için kullanılır. Profil yolu: Windows `%APPDATA%\Wireshark\profiles`, macOS/Linux `~/.config/wireshark/profiles/`. Ctrl+Shift+A ile yönetilir.

12. Edit → Preferences → Name Resolution altındadır. Capture sırasında açık olursa her paket için DNS sorgusu yapılır, bu da capture hızını ciddi şekilde düşürür. Analiz sırasında açılması önerilir.

13. Mark (Ctrl+M): Paketi görsel olarak işaretler (siyah arka plan), paket analize dahil kalır. Ignore (Ctrl+D): Paketi display filter'dan tamamen gizler, istatistik hesaplamalarına dahil edilmez. Ignore edilen paketler View → Ignore/Unignore ile geri getirilir.

14. Save (Ctrl+S) tüm capture'ı pcapng formatında kaydeder. Export Specified Packets ise belirli paketleri (range, marked, selected) seçip TXT, CSV, JSON, PSML, PDML formatlarına dönüştürür. Export'ta Display Filter uygulanabilir, Save'de uygulanamaz.

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
