---
layout: post
title:  "shark-tank - m05: ICMP Analizi"
date:   2026-07-22 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 05: ICMP Analizi

**Neden?** Güvenlik duvarı loglarında dışarıya giden ICMP trafiği dikkat çekiyor. Ping paketlerinin boyutu normalden çok büyük. ICMP tunneling olabilir. Saldırgan güvenlik duvarını aşmak için ICMP echo request/reply paketlerinin içine veri gizler (ping tunnel, icmptunnel). ICMP flood (Smurf attack, Ping of Death) DDoS saldırılarında kullanılır. ICMP trafiğine çoğu güvenlik duvarı izin verir: Bu onu ideal bir gizleme aracı yapar. Bu modülde, ICMP anomalilerini yakalamayı öğreneceksin.

**Görev:** ICMP trafiğini incele. Echo Request/Reply yapısını anla. Payload'da ne var?

**Öğrenim Hedefleri:**
- ICMP Echo Request (Type 8) ve Echo Reply (Type 0) yapısını ve farklı boyutlardaki paketleri anlamak
- RTT (Round Trip Time) hesaplamayı ve Time Display Format kullanarak ölçmeyi öğrenmek
- TTL (Time To Live) analizi yapabilmek
- Destination Unreachable (Type 3) ve Time Exceeded (Type 11) mesajlarını tanımak
- ICMP tunneling ve covert channel tespiti yapabilmek
- IO Graph ile trafik yoğunluğunu zaman ekseninde analiz edebilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **ICMP** | Internet Control Message Protocol: Ağ tanılama ve hata bildirimi için kullanılan protokol. Port kullanmaz; Layer 3'te (IP katmanı) doğrudan çalışır, bu yüzden "Layer 3.5" olarak da adlandırılır. En bilinen kullanımı ping komutudur: Bir cihaza "orada mısın?" diye sorar (Echo Request), karşı taraf "evet, buradayım" diye yanıtlar (Echo Reply). traceroute aracı da ICMP kullanarak bir paketin geçtiği router'ları adım adım tespit eder. Güvenlik duvarları ICMP trafiğine genellikle izin verir; bu yüzden saldırganlar ICMP paketlerinin içine veri gizleyerek güvenlik duvarını aşabilir (ICMP tunneling). |
| **ping** | Bir cihazın ağ üzerinden ulaşılabilirliğini test eden araç ve işlem. ICMP Echo Request (Type 8) gönderir ve karşı taraftan Echo Reply (Type 0) bekler. Yanıt gelirse cihaz açık ve ulaşılabilirdir; yanıt gelmezse cihaz kapalı, erişilemez veya güvenlik duvarı ICMP'yi engelliyordur. Ping ayrıca gidiş-dönüş süresini (RTT) ölçerek ağ gecikmesi hakkında bilgi verir. `ping -s 1400` gibi parametrelerle farklı boyutlarda paket göndererek ağın MTU sınırlarını test etmek de mümkündür. |
| **Echo Request / Echo Reply** | ICMP'nin en yaygın mesaj tipleri. Echo Request (Type 8), bir cihazın "orada mısın?" sorusudur; Echo Reply (Type 0), karşı cihazın "evet, buradayım" yanıtıdır. Her ikisi bir Identifier (oturum kimliği) ve Sequence Number (paket sıra numarası) taşır; Wireshark bu alanları kullanarak Request-Reply çiftlerini otomatik eşleştirir. Echo Reply'ın payload kısmı, Echo Request'ten gelen payload'ın aynısıdır: Bu, verinin bozulmadan gidiş-dönüş yaptığını doğrulamak içindir. |
| **RTT** | Round Trip Time: Bir paketin kaynaktan hedefe gidip geri dönmesi için geçen toplam süre. ICMP ping'inde, Echo Request'in gönderilmesi ile Echo Reply'nin alınması arasındaki süre RTT'dir. Wireshark bu değeri paket detaylarında `[Response Time: X.XXX ms]` olarak otomatik hesaplar. RTT, ağ gecikmesinin (latency) temel ölçüsüdür: Düşük RTT hızlı bağlantıyı, yüksek RTT uzak veya tıkalı bir bağlantıyı gösterir. Sınavda `Edit > Time Display Format > Seconds Since Previous Packet` ile manuel RTT ölçümü de test edilir. |
| **TTL** | Time To Live: Bir paketin ağda yaşayabileceği maksimum atlama (hop) sayısı. Her paketin IP header'ında bulunan ve her router'dan geçişte 1 azaltılan bir alandır. TTL sıfıra ulaştığında paket düşürülür ve kaynağa ICMP Time Exceeded (Type 11) mesajı gönderilir. Bu mekanizma, sonsuz döngüye giren paketlerin ağı tıkamasını önler. Linux cihazlar genellikle TTL=64, Windows cihazlar TTL=128 başlangıç değeri kullanır; Wireshark'ta bir paketin TTL değerinden işletim sistemi tahmin edilebilir (OS fingerprinting). |
| **traceroute** | Bir paketin kaynaktan hedefe giderken hangi router'lardan geçtiğini adım adım gösteren araç. Çalışma prensibi TTL alanını kasten düşük tutmaktır: İlk paket TTL=1 ile gönderilir ve ilk router tarafından düşürülür (Time Exceeded döner), ikinci paket TTL=2 ile gönderilir ve ikinci router'a ulaşır, bu şekilde devam eder. Her router'ın IP adresi, dönen Time Exceeded mesajının kaynak adresinden öğrenilir. Wireshark'ta traceroute trafiği `icmp.type == 11` ve `icmp.type == 8` filtreleriyle görülebilir. Not: Linux'taki `traceroute` varsayılan olarak UDP probe'ları gönderir (yüksek portlara); ICMP Time Exceeded yanıtları yine ICMP olarak döner. `traceroute -I` (veya Windows `tracert`) probe'ları da ICMP ile gönderir — sınav kalıbındaki "ICMP traceroute" bu ikincisidir. |
| **Destination Unreachable** | ICMP Type 3 mesajı: Bir paketin hedefe ulaşamadığını bildiren hata mesajı. Code alanı altında farklı nedenler belirtilir: Network Unreachable (Code 0, ağa giden yol yok), Host Unreachable (Code 1, cihaz kapalı veya yanıt vermiyor), Port Unreachable (Code 3, hedef portta servis çalışmıyor). Güvenlik duvarları genellikle paketleri sessizce düşürür, bu yüzden Destination Unreachable görmek ya gerçek bir ağ sorunu ya da ICMP döndüren bir güvenlik duvarı anlamına gelir. |
| **payload** | Bir paketin içinde taşıdığı asıl veri: Adresleme ve kontrol bilgileri (header) hariç. ICMP Echo Request'inde payload genellikle 32-56 byte arası test verisidir (harfler, sayılar). Ancak saldırganlar ICMP payload'ının içine gizli veri yerleştirebilir; bu durumda payload anlamsız karakterler (base64, hex) içerir ve normalden büyüktür. Wireshark'ta Data katmanında görüntülenir. |
| **IO Graph** | Wireshark'ın trafik miktarını zaman ekseni üzerinde görselleştiren aracı (`Statistics > IO Graph`). X ekseni zamanı, Y ekseni paket veya byte sayısını gösterir. Belirli bir display filter girilerek sadece o filtreye uyan trafiğin zaman içindeki dağılımı görülebilir (örneğin `icmp.type == 8` ile sadece ping isteklerinin dağılımı). Ani trafik artışları (spike) DDoS saldırılarını, düzenli aralıklı küçük pikler C2 beaconing'i gösterebilir. |

## Teori

ICMP (Internet Control Message Protocol), ağ tanılama ve hata bildirimi için kullanılır.
- **Protokol numarası:** 1 (IP header'da)
- **Port kullanmaz** (Layer 4 değil, Layer 3.5)
- **Ping** = ICMP Echo Request (Type 8) + Echo Reply (Type 0)
- **Traceroute** = TTL süresi dolmuş paketler (Type 11)

### ICMP Mesaj Tipleri:

| Type | Kod | Anlamı |
|------|-----|--------|
| **0** | 0 | Echo Reply (ping yanıtı) |
| **5** | 1 | Redirect for Host — "daha iyi yol var" (MITM aracı!) |
| **8** | 0 | Echo Request (ping isteği) |
| **3** | 0 | Destination Unreachable - Network |
| **3** | 1 | Destination Unreachable - Host |
| **3** | 3 | Destination Unreachable - Port |
| **11** | 0 | Time Exceeded (TTL doldu) |

> **İstihbarat İşaretleri, ICMP, saldırganların en sevdiği "görünmez" kanaldır:**
>
> - ICMP payload'ı **64 byte'tan büyük** = Şüpheli (tunneling olabilir)
> - Bir IP'den sürekli ICMP ama **Echo Reply yok** = ICMP flooding
> - ICMP Type 3 (Unreachable) fırtınası = Ağ tarama veya yanlış yapılandırma
> - ICMP Type 11 (Time Exceeded) = Normal traceroute: Ama **hedef dışı IP'ye** = şüpheli
> - ICMP Type 5 (Redirect) = Yönlendirme manipülasyonu: Gateway kılıklı saldırgan

### ICMP Redirect (Type 5): Yolu Saldırgana Çevirmek

Redirect, router'ın host'a "bu hedefe daha iyi şu adresten gidilir" demenin
meşru yoludur (kod 0=ağ, 1=host). Saldırgan bunu sahteleyerek kurbanın
trafiğini kendi makinesine akıtır — ARP spoofing'in L3 kuzeni.

**pcap'te gerçek deneme var** (attacker, gateway'i taklit edip
172.50.2.100'e "172.50.2.13'e artık 172.50.2.200 üzerinden git" demiş):

```text
icmp.type == 5
```

Paketi açtığında:
```text
v Internet Protocol: Src 172.50.2.1 (gateway taklidi!) → Dst 172.50.2.100
v ICMP: Redirect (5), Code 1 (for host)
    Gateway: 172.50.2.200         <-- "şuradan git" = saldırgan
    v IP (orijinal paket): 172.50.2.100 → 172.50.2.13:443
```

Sahtecilik kanıtı: Paketin **Ethernet kaynak MAC'i** gateway'inki değil,
attacker'ın MAC'idir (IP 172.50.2.1'e rağmen). IP-MAC çelişkisi =
spoofing (Modül 3'teki ARP anomalisinin aynısı, farklı protokolde).

> **SINAV İPUCU:** "ICMP Redirect'ı nasıl tespit edersin?" → `icmp.type
> == 5` + gateway alanındaki IP'nin gerçek gateway olup olmadığını MAC
> üzerinden doğrula.

## Hazırlık

```sh
./scripts/generate-traffic.sh icmp
# macOS: open -a Wireshark module-05-icmp.pcap
# Linux: wireshark module-05-icmp.pcap &
# Windows: start wireshark module-05-icmp.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

## Alıştırma 1: Echo Request ve Reply

### Filtre:
```text
icmp
```

### Echo Request (Type 8) İnceleme:
1. Bir Echo Request paketine tıkla
2. **Internet Control Message Protocol** katmanını genişlet:

```text
 v Internet Control Message Protocol
     Type: 8 (Echo (ping) request)      <-- İSTEĞİ gösterir
     Code: 0
     Checksum: 0xXXXX                   <-- Hata kontrol
     Identifier (BE): 0xXXXX            <-- Ping oturumu ID
     Identifier (LE): 0xXXXX
     Sequence number (BE): 0            <-- Paket sırası (1, 2, 3...)
     Sequence number (LE): 0
     Data (56 bytes)                    <-- Ping veri yükü
```

### Echo Reply (Type 0):
```text
     Type: 0 (Echo (ping) reply)        <-- YANITI gösterir
     ...
     Identifier (BE): 0xXXXX            <-- AYNI ID (eşleşir)
     Sequence number (BE): 0            <-- AYNI seq no
```

> **SINAV İPUCU:** Identifier + Sequence number ile Request-Reply çiftlerini eşleştir.

## Alıştırma 2: Ping RTT (Round Trip Time) Hesaplama

1. Echo Request paketinin **Time** değerini not et (örneğin 0.500)
2. Eşleşen Echo Reply'nin **Time** değerini not et (örneğin 0.501)
3. RTT = Reply Time - Request Time = 0.001 saniye = 1ms

Veya daha kolay:
- Wireshark zaten RTT'yi gösterir: Paket detaylarında **[Response Time:]** alanına bak

> **SINAV İPUCU:** Yüksek RTT = ağda gecikme var.

## Alıştırma 3: Farklı Boyutlarda Ping

Capture'da farklı boyutlarda ping paketleri var:

```text
ping -s 64    -> 64 byte veri     (toplam: ~92 byte)
ping -s 512   -> 512 byte veri    (toplam: ~540 byte)
ping -s 1400  -> 1400 byte veri   (toplam: ~1428 byte)
```

### Filtre ile büyük paketleri bul:
```text
icmp && frame.len > 100
```

> **SINAV İPUCU:** Büyük ICMP paketleri fragmentation testi için kullanılır.
>
> 1500 byte'tan büyük paketler fragment'e ayrılır.

## Alıştırma 4: Hata Mesajları (Destination Unreachable + Time Exceeded)

### Destination Unreachable (Type 3)
```text
icmp.type == 3
```

Capture'da 172.50.2.99'a ping atıldı (olmayan IP). Bu hedefe hiçbir ICMP yanıtı dönmedi: Yalnızca cevapsız ARP request'leri görülür (cihaz ağda olmadığı için MAC adresi çözümlenemedi).

Eğer hedef ağda olsaydı ama portu kapalı olsaydı, şu mesajı görürdük:
```text
     Type: 3 (Destination unreachable)
     Code: 1 (Host unreachable)
```

### Time Exceeded (Type 11)
```text
icmp.type == 11
```

Bir paketin TTL'i sıfırlandığında router bu hatayı döndürür. Bu, **traceroute**'un çalışma prensibidir:
- 1. paket: TTL=1 → ilk router düşürür → Time Exceeded
- 2. paket: TTL=2 → ikinci router düşürür → Time Exceeded
- ... hedefe ulaşana kadar devam eder

Bu pcap'te Type 11 yok (hedef aynı Docker ağında: Router geçilmez), ancak kendi ağında traceroute testi yapabilirsin:
```sh
# Terminal'de:
traceroute 8.8.8.8
# Wireshark'ta icmp.type == 11 filtresiyle gör
```

> **SINAV İPUCU:** Destination Unreachable (Type 3) ve Time Exceeded (Type 11), traceroute ve ağ sorunlarını tespit için kullanılır.
>
> WCNA sınavında her iki tip de sorulur.

## Alıştırma 5: IP TTL Analizi

Her IP paketinde bir **TTL** (Time To Live) değeri vardır.
Her router TTL'i 1 azaltır. TTL = 0 olursa paket düşürülür.

### ICMP paketlerinde TTL:
1. Echo Request paketini aç
2. **Internet Protocol** katmanında **Time to Live** alanını bul
3. Linux container'larda TTL genellikle 64 başlar

```text
 v Internet Protocol
     Time to Live: 64                   <-- Başlangıç TTL
     Protocol: ICMP (1)
```

> **SINAV İPUCU:** TTL değerinden kaç router'dan geçtiğini anlayabilirsin.
>
> Örneğin TTL=62 ise 2 router geçildi (64-2=62).

## Alıştırma 6: ICMP Checksum Doğrulama

1. ICMP paketini aç
2. Checksum alanını bul
3. Wireshark otomatik doğrular -> hatalıysa kırmızı gösterir

> **SINAV İPUCU:** Checksum hatası = paket bozulmuş (ağda veya yakalama sırasında).

## Hızlı Referans - ICMP Filtreleri

```text
# Tüm ICMP
icmp

# Mesaj tipleri
icmp.type == 0     # Echo Reply
icmp.type == 3     # Destination Unreachable
icmp.type == 8     # Echo Request
icmp.type == 11    # Time Exceeded

# Sadece ping
icmp.type == 8 || icmp.type == 0

# Büyük ICMP paketleri
icmp && frame.len > 200

# Belirli bir identifier
icmp.ident == 0x1234

# Belirli sequence number
icmp.seq == 1

# Destination Unreachable kodları
icmp.code == 0     # Network unreachable
icmp.code == 1     # Host unreachable
icmp.code == 3     # Port unreachable
```

## Alıştırma 7: Edit > Time Display Format

Zaman gösterim formatını değiştirmek analizi kolaylaştırır:

| Format | Kullanım |
|--------|----------|
| Date and Time of Day | Tarih + saat (genel kullanım) |
| Seconds Since Beginning of Capture | İlk paketten itibaren saniye (RTT ölçümü) |
| Seconds Since Previous Packet | **RTT için en uygun**: Her paket arası süre |
| UTC Date and Time of Day | UTC zamanı (log korelasyonu) |

1. Edit > Time Display Format > Seconds Since Previous Packet
2. İlk Echo Request'e tıkla → Time sütununda 0.000 görürsün
3. İlk Echo Reply'a tıkla → Time sütununda RTT değerini görürsün (örn. 0.145)
4. **Edit > Time Display Format > Seconds Since Beginning of Capture** ile genel akışı gör

> **SINAV İPUCU:** "Seconds Since Previous Packet" RTT analizi için en kullanışlı formattır.

## Alıştırma 8: Statistics > IO Graph

IO Graph, trafik yoğunluğunu zaman ekseninde gösterir:

1. Statistics > IO Graph
2. X ekseni: Zaman, Y ekseni: Paket sayısı veya byte
3. **Filter** alanına `icmp.type == 8` yaz: Sadece Echo Request'ler gösterilir
4. **Graph type:** Line / Bar / Dot değiştir
5. **Unit:** Packets / Bytes / Bits değiştir

ICMP pcap'de IO Graph ile şunları görebilirsin:
- Ping grupları arasındaki boşluklar (farklı boyut testleri)
- Timeout olan ping'lerde boşluk
- Trafik yoğunluğunun zaman içindeki dağılımı

> **SINAV İPUCU:** IO Graph, trafik anomalisi tespiti için temel araçtır.
>
> SYN flood'da dikey bir artış, beaconing'de düzenli aralıklı küçük pikler görünür.

## Alıştırma 9: ICMP Tunneling Tespiti

ICMP tunneling, saldırganın veriyi ICMP Echo Request/Reply payload'larının içine gizlemesidir. Normal ICMP ping'leri genellikle güvenlik duvarlarından geçer: Bu da onu ideal bir gizli kanal yapar.

### Normal ICMP vs Tunneling:

| Özellik | Normal Ping | ICMP Tunneling |
|---------|-------------|----------------|
| Payload boyutu | 32-56 byte (sabit) | Rastgele, genellikle 64+ byte |
| Payload içeriği | Harfler, sayılar (düzenli) | Base64, anlamsız karakterler |
| Sıklık | Aralıklı (1-5 saniye) | Sürekli ve yoğun |
| TTL değeri | Sabit | Değişken (farklı hedefler) |

### Tespit Filtreleri:
```text
# Büyük ICMP paketleri (tunneling şüphesi)
icmp && frame.len > 100

# Anormal payload: data katmanını incele
icmp.type == 8 && data.len > 56
```

### Ne Yapmalısın?
1. Bu pcap'te `icmp && frame.len > 100` filtrele: Var mı?
2. Data katmanını incele: Payload'da base64 benzeri karakterler görüyor musun?
3. Normal ping ile tunneling arasındaki farkı anlamak için `icmp.type == 8` ile tüm Echo Request'leri listele

### Gerçek Tünel Bu pcap'te: Sabit Identifier Takibi

pcap'e artık **gerçek bir tünel oturumu** yerleştirildi: Saldırgan
(172.50.2.200), istemciye (172.50.2.100) doğru **aynı identifier
(0x7354)** kullanan 4 Echo Request gönderiyor ve her birinin payload'ında
base64 kodlu gizli veri taşıyor.

### Filtre:
```text
icmp.ident == 0x7354
```

Paketi açtığında:
```text
v Internet Control Message Protocol
    Type: 8 (Echo Request)
    Identifier (BE): 0x7354 (29524)     <-- TÜNEL İMZASI: sabit kalır
    Sequence Number: 1, 2, 3, 4
v Data (487 bytes)
    0800 4943 4d50 5455 4e  ...         <-- "ICMPTUN" etiketi + base64
```

**Neden identifier kilit göstergesi?** Gerçek ping araçları her işlem
için rastgele identifier üretir; tünel araçları (icmptunnel, ptunnel)
tüm oturumu tek identifier üzerinden taşır. Aynı identifier'lı 4+
ardışık Echo = bir uygulamanın ICMP'i köprü olarak kullandığının kanıtı.

**Payload'u çöz (analiz):**
```sh
tshark -r shared/pcaps/module-05-icmp.pcap -Y 'icmp.ident == 0x7354 && icmp.type == 8' \
  -T fields -e data.data | tr -d '\n' | xxd -r -p | \
  sed 's/^.*ICMPTUN//' | base64 -d 2>/dev/null | head -2
```
Çıktı: `CONFIDENTIAL-DB-DUMP:users=1247;hashes=NTLMx12;...` —
saldırganın veritabanı dökümünü pinglerin içinden geçirdiği apaçık
ortada.

> **SINAV İPUCU:** ICMP tunneling tespiti:
>
> - Payload boyutu normalden büyükse (> 64 byte)
> - Payload'da anlamsız karakterler varsa (base64, hex)
> - **Sabit identifier ile 4+ Echo Request** = tünel oturumu (en keskin imza)
> - **icmptunnel**, **pingtunnel**, **ptunnel** gibi araçlar bu yöntemi kullanır

## Sınav Soruları (Çöz)

1. Kaç tane Echo Request ve kaç tane Echo Reply paketi var? Eşleşme sayıları eşit mi?
2. En düşük RTT (Round Trip Time) kaç milisaniye?
3. 172.50.2.99'a ping atıldığında ne oldu? Hangi ICMP mesaj döndü?
4. En büyük ICMP paketi kaç byte? Bu neden önemlidir?
5. TTL değeri kaçtır? Buna göre kaç router geçilmiş?
6. ICMP tünel oturumunun identifier değeri nedir ve bu paketlerin payload'ında ne taşınıyor?
7. ICMP Redirect paketlerinde "Gateway Address" hangi IP'yi gösteriyor? Bu ne anlama gelir?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. 13 Echo Request (type 8), 13 Echo Reply (type 0): Sayılar eşit. Başarılı ping'lerde her request'in bir reply'si vardır. 172.50.2.99'a ping atıldığında ICMP paketi üretilmedi (ARP çözümlemesi başarısız olduğu için).
2. Değişkendir. RTT sütununu kontrol et.
3. Hiçbir ICMP mesajı dönmedi (timeout). 172.50.2.99 ağda yok, ARP çözümlemesi başarısız oldu. pcap'te sadece cevapsız ARP request'leri görülür.
4. 1400 byte data payload (1428 byte toplam). Fragmentation eşiğine yakın.
5. TTL = 64. 64 - 64 = 0 router (aynı Docker ağındalar).
6. Identifier **0x7354 (29524)**: 4 Echo Request + 4 Reply bu tek kimlikle taşındı. Payload'da "ICMPTUN" etiketi + base64 veri: çözülünce `CONFIDENTIAL-DB-DUMP:users=1247;...` sızıntısı çıkar.
7. **172.50.2.200** (saldırgan): "trafiği benden geçirin" mesajı = MITM yönlendirme denemesi (IP 172.50.2.1 sahtesi).

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!