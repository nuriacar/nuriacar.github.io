---
layout: post
title:  "shark-tank - m16: TLS/SSL Analizi"
date:   2026-08-02 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 16: TLS/SSL Analizi

**Neden?** HTTPS olmasına rağmen kullanıcı bilgileri çalınıyor. SSL stripping saldırısı olabilir: HTTPS HTTP'ye düşürülüyor. TLS trafiği şifrelidir, ancak zafiyetleri vardır: Self-signed sertifika tespiti, expired sertifika, iptal edilmiş sertifika (OCSP ile doğrulanır), Heartbleed (CVE-2014-0160: TLS heartbeat ile memory sızdırma). Ayrıca TLS handshake'ten cipher suite, SNI ve sertifika zinciri bilgileri okunur. Bu modülde, TLS handshake ve sertifika analizi yaparak zafiyetleri bulmayı ve sertifikanın geçerliliğini (zincir + OCSP) doğrulamayı öğreneceksin.

**Görev:** TLS handshake'i analiz et. Cipher suite ve sertifika zincirini incele. OCSP ile iptal durumunu doğrula. Private key ile trafiği deşifre et.

**Öğrenim Hedefleri:**
- TLS handshake adımlarını (ClientHello, ServerHello, Certificate, KeyExchange, Finished) adım adım takip edebilmek
- Cipher suite, TLS versiyonu ve sertifika bilgilerini okuyabilmek
- Sertifika zincirini (server → root CA) ve issuer/subject ilişkisini doğrulayabilmek
- OCSP istek/yanıtı ile sertifika iptal durumunu (good/revoked/unknown) tespit edebilmek
- TLS 1.2 ile TLS 1.3 arasındaki farkları bilmek
- Private key ile TLS trafiğini deşifre edebilmek
- SSL stripping, self-signed sertifika ve Heartbleed gibi TLS zafiyetlerini tespit edebilmek
- Şifrelenmiş TLS verisini (Application Data) tanımak ve HTTP vs HTTPS farkını bilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **TLS** | Transport Layer Security: Bir protokolün (genellikle HTTP) verisini uçtan uca şifreleyen güvenlik katmanı. TLS'nin öncülü SSL (Secure Sockets Layer) olduğundan ikisi genellikle birbirinin yerine kullanılır. TLS, şifreleme (encryption), kimlik doğrulama (certificate ile) ve veri bütünlüğü (MAC/hash ile) sağlar. TLS handshake adı verilen el sıkışma aşaması şifresizdir: İstemci ve sunucu bu aşamada hangi şifreleme algoritmasının (cipher suite) kullanılacağını, sertifikaları ve anahtar değişim parametrelerini görüşür. Handshake tamamlandıktan sonra tüm uygulama verisi (Application Data) şifrelenir ve Wireshark'ta okunamaz. HTTPS, HTTP'in TLS ile şifrelenmiş halidir (port 443). |
| **TLS handshake** | İstemci ve sunucunun şifreli iletişim için anlaştığı el sıkışma süreci. TLS 1.2'de adımlar şöyledir: İstemci ClientHello gönderir (desteklediği şifreleme yöntemlerini listeler), sunucu ServerHello ile yanıtlar (bir yöntem seçer) ve Certificate ile dijital sertifikasını gönderir, ardından anahtar değişimi (KeyExchange) yapılır ve her iki taraf da ChangeCipherSpec ile "artık şifreli konuşacağım" der, Finished mesajlarıyla handshake tamamlanır. TLS 1.3'te bu süreç kısaldı: Anahtar değişimi ClientHello/ServerHello içine gömüldü, ayrı KeyExchange adımları kaldırıldı. Handshake tamamlandıktan sonraki tüm paketler Application Data (şifreli) olarak iletilir. |
| **cipher suite** | TLS bağlantısında kullanılacak şifreleme algoritmalarının bileşimi. Bir cipher suite dört bileşen belirler: Anahtar değişim algoritması (örn. ECDHE), kimlik doğrulama algoritması (örn. RSA), toplu şifreleme algoritması (örn. AES_256_GCM) ve hash algoritması (örn. SHA384). Örnek: `TLS_RSA_WITH_AES_256_GCM_SHA384`. İstemci, ClientHello'da desteklediği tüm cipher suite'leri listeler; sunucu, ServerHello'da bunlardan birini seçer. Güvenlik açısından zayıf algoritmalar (RC4, DES, 3DES) içeren cipher suite'ler deşifre edilebilir ve kullanılmamalıdır. TLS 1.3 cipher suite isimleri farklıdır (örn. `TLS_AES_256_GCM_SHA384`). |
| **certificate** | TLS'de sunucunun (veya istemcinin) kimliğini doğrulayan dijital belge. Bir sertifika, sahibinin açık anahtarını (public key) ve kimlik bilgilerini (CN, O, C gibi alanlar) içerir ve bu bilgileri bir Certificate Authority (CA) tarafından dijital olarak imzalanır. Tarayıcılar, bir HTTPS sitesine bağlanırken sunucunun sertifikasını kontrol eder: Sertifika güvenilir bir CA tarafından imzalanmış mı, süresi dolmamış mı (validity), CN değeri bağlanılan alan adıyla eşleşiyor mu. Eğer eşleşmezse tarayıcı uyarı verir. TLS handshake'inin Certificate adımında Wireshark ile sertifika içeriği (issuer, subject, validity, CN) açıkça görülebilir. |
| **self-signed certificate** | Kendi kendine imzalanmış sertifika: Sertifikayı veren (issuer) ile sertifika sahibinin (subject) aynı olduğu sertifika türü. Normalde bir sertifika güvenilir bir CA (Certificate Authority) tarafından imzalanır, ama self-signed sertifikada sunucu kendi sertifikasını imzalar. Bu, tarayıcılarda güven uyarısına yol açar çünkü sertifikanın sahibi bağımsız bir kuruluş tarafından doğrulanmamıştır. Test ve geliştirme ortamlarında yaygındır (bu laboratuvardaki sertifika self-signed'dır). Üretim ortamında self-signed sertifika, MITM (Man-in-the-Middle) saldırısı göstergesi olabilir. Wireshark'ta issuer = subject olarak görülür. |
| **SNI (Server Name Indication)** | ClientHello'da taşınan, istemcinin bağlanmak istediği alan adı (örn. "secure.shark-tank.local"). Aynı IP'te birden çok sertifika barındıran sunucuların (SNI-based vhosting) doğru sertifikayı seçmesini sağlar. TLS kurulmadan ÖNCE gönderildiği için şifrelenmez: Sertifikalar TLS 1.3'te şifrelense bile SNI düz metin kalır — bu yüzden şifreli trafikte "kim nereye bağlandı" bilgisini yalnız SNI verir. Wireshark'ta `tls.handshake.extensions_server_name` alanında görünür. |
| **SSL stripping** | HTTPS'e gitmesi gereken bir bağlantıyı saldırganın (MITM) HTTP'ye düşürmesi: Kullanıcı "http://" ile servise girer, trafiğin tamamı düz metin akar ve kimlik bilgileri dinlenir. Ağda imzası: Aynı alan adı için 80 portu trafiğinin beklenmedik artışı + 443'e hiç geçilmemesi. TLS 1.3 → 1.2 downgrade görülmesi de benzer şüphe uyandırır. Tarayıcı tarafındaki savunma HSTS header'ıdır (tarayıcı, siteyi hiçbir koşulda HTTP ile açmaz). |
| **OCSP** | Online Certificate Status Protocol: Sertifikanın iptal edilip edilmediğini sertifikanın veren CA'ya (OCSP responder) soran protokol. İstemci, sertifikadaki AIA uzantısındaki URL'ye HTTP POST ile sorgu atar; yanıt `good` (geçerli), `revoked` (iptal edilmiş) veya `unknown` olur. Wireshark'ta `ocsp` protokol filtresiyle, durum `ocsp.certStatus` alanıyla okunur (0=good, 1=revoked). Tarayıcılar bu sorguyu bazen toplu yapar (OCSP stapling: sunucu yanıtı kendisi taşır). |
| **HTTP** | HyperText Transfer Protocol: Web tarayıcıları ile web sunucuları arasındaki iletişim protokolü. İstemci (browser) bir istek (request) gönderir, sunucu bir yanıt (response) döner. Tüm içerik düz metin (cleartext) olarak iletilir: Hiçbir şifreleme yoktur. Bu yüzden Wireshark ile HTTP trafiğini izleyen biri şifreleri, cookie'leri, form verilerini dahil her şeyi açıkça görebilir. Port 80 kullanır. HTTPS, HTTP'in TLS ile şifrelenmiş halidir (port 443). |

## Teori

TLS (Transport Layer Security), HTTP gibi protokolleri şifreler.
- **Port:** 443 (HTTPS)
- **Şifreli:** Uygulama verisi Wireshark'ta görünmez
- **Ama:** TLS handshake (el sıkışma) aşaması AÇIK görünür

### TLS Handshake Adımları (TLS 1.2):
```text
CLIENT                          SERVER
  |--- ClientHello ------------>|    Cipher listesi, TLS sürümü
  |<-- ServerHello -------------|    Seçilen cipher suite, sertifika
  |<-- Certificate -------------|    Sunucunun SSL sertifikası
  |<-- ServerKeyExchange -------|    Anahtar değişim parametreleri
  |<-- ServerHelloDone ---------|    "Ben hazırım, sen devam et"
  |--- ClientKeyExchange ------>|    Premaster secret (şifreli)
  |--- ChangeCipherSpec ------->|    "Artık şifreli konuşacağım"
  |--- Finished (encrypted) --->|    Şifreli onay
  |<-- ChangeCipherSpec --------|    "Ben de şifreli konuşacağım"
  |<-- Finished (encrypted) ----|    Şifreli onay
  |                             |
  |<===== ŞİFRELİ VERİ ========>|    Artık tüm veri şifreli
```

> **Not:** Sunucumuz hem TLS 1.2 hem TLS 1.3 destekler. Çoğu curl/openssl istemcisi TLS 1.3'ü tercih eder.
>
> TLS 1.3'te handshake daha kısadır: ClientHello → ServerHello + EncryptedExtensions + Certificate + Finished → Finished
>
> TLS 1.3'te ServerKeyExchange ve ClientKeyExchange **yoktur**: Anahtar değişimi ClientHello/ServerHello içine gömülüdür.
>
> Aşağıdaki alıştırmalarda hangi TLS sürümünün gerçekleştiğini Wireshark'tan kontrol et.

> **İstihbarat İşaretleri, TLS zafiyetleri, modern siber saldırıların merkezindedir:**
>
> - **Self-signed sertifika** = MITM saldırısı olabilir
> - **TLS 1.0 / 1.1** kullanılıyor = Güvenlik açığı (POODLE, BEAST)
> - **Zayıf cipher suite** (RC4, DES, 3DES) = Deşifre edilebilir
> - **Sertifika CN** hedef sunucuyla eşleşmiyor = Phishing veya MITM
> - TLS downgrade (1.3 → 1.2) = **SSL stripping** saldırısı olabilir

## Hazırlık

```sh
./scripts/generate-traffic.sh tls
# macOS: open -a Wireshark module-16-tls.pcap
# Linux: wireshark module-16-tls.pcap &
# Windows: start wireshark module-16-tls.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

**TLS 1.2 zorlama (decryption için):**
```sh
docker exec shark-tank-client curl --tlsv1.2 --tls-max 1.2 \
  -sk https://172.50.2.13/secure-data
```

## Alıştırma 1: ClientHello Analizi

### Filtre:
```text
tls.record.content_type == 22    # Handshake
```

İlk paket ClientHello olmalı. İçindekiler:

```text
 v Transport Layer Security
     Content Type: Handshake (22)
     Version: TLS 1.0 (0x0301)            <-- Record layer versiyonu
     v Handshake Protocol: Client Hello
         Version: TLS 1.2 (0x0303)     <-- Desteklenen sürüm
         Random: ...                      <-- 32 byte rastgele değer
         Session ID Length: 0
          v Cipher Suites (31 suites, 62 bytes)
              TLS_AES_256_GCM_SHA384       <-- TLS 1.3 suite'leri başta
              TLS_CHACHA20_POLY1305_SHA256
              TLS_AES_128_GCM_SHA256
              TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384  <-- TLS 1.2 suite'leri
              ...
```

### Ne Yapmalısın?
1. Cipher Suites listesini genişlet
2. Kaç farklı cipher suite destekleniyor? Say
3. TLS versiyonu nedir?

> **SINAV İPUCU:** ClientHello'da istemcinin desteklediği TÜM cipher suite'ler listelenir.

## Alıştırma 2: ServerHello + Cipher Suite Seçimi

### ServerHello'u bul (ikinci handshake paketi):

```text
 v Handshake Protocol: Server Hello
     Version: TLS 1.2 (0x0303)               <-- veya TLS 1.3 (0x0304)
     Random: ...
     Session ID Length: 32
     Cipher Suite: TLS_AES_256_GCM_SHA384    <-- SEÇİLEN cipher suite
     Compression Method: null
```

> **Not:** TLS 1.3 cipher suite'leri (TLS_AES_256_GCM_SHA384 gibi) TLS 1.2 cipher suite'lerinden farklıdır.
>
> Eğer TLS 1.2 gerçekleşirse TLS_RSA_WITH_AES_256_GCM_SHA384 gibi bir suite görürsün.
>
> Hangi sürüm olduğunu anlamak için ServerHello'daki Version alanına bak:
>
> - `TLS 1.3 (0x0304)` = TLS 1.3
> - `TLS 1.2 (0x0303)` = TLS 1.2

> **SINAV İPUCU:** Sunucu ClientHello'daki cipher suite'lerden birini seçer.
>
> Bu seçim hangi şifreleme algoritmasının kullanılacağını belirler.

## Alıştırma 3: KeyExchange ve Finished Adımları

TLS handshake'inde ClientHello → ServerHello → Certificate'ten sonraki adımlar:

### TLS 1.2 Handshake'te:
```text
ServerKeyExchange   (type 12) : Diffie-Hellman parametreleri
ServerHelloDone     (type 14) : Sunucu hazır
ClientKeyExchange   (type 16) : İstemci anahtarını gönderir
ChangeCipherSpec    (content 20): "Artık şifreli konuşacağım"
Finished            (content 22, encrypted): Şifreli onay
```

Filtreler:
```text
# ServerKeyExchange
tls.handshake.type == 12

# ClientKeyExchange
tls.handshake.type == 16

# ChangeCipherSpec
tls.record.content_type == 20
```

### TLS 1.3 Farkı:
TLS 1.3'te **ServerKeyExchange** ve **ClientKeyExchange** yoktur! Anahtar değişimi ClientHello/ServerHello içine gömülüdür. Bu nedenle TLS 1.3 handshake'i daha kısadır.

### Ne Yapmalısın?
1. `tls.handshake.type` filtreleriyle her adımı tek tek bul
2. Hangi TLS sürümü kullanılıyor? (Version alanından kontrol et)
3. TLS 1.3 ise: KeyExchange adımlarını göremezsin: Bu normaldir!
4. Finished paketini bul: `tls.record.content_type == 22 && frame contains "Finished"`

> **SINAV İPUCU:** TLS 1.2'de 5 handshake adımı (ClientHello, ServerHello, Certificate, KeyExchange, Finished), TLS 1.3'te 3 adım (ClientHello → ServerHello + Certificate → Finished) olabilir.

## Alıştırma 4: Sertifika Analizi

### Certificate paketini bul:

```text
 v Handshake Protocol: Certificate
     Certificates Length: XXX
     v Certificate
         signedCertificate
             version: v3
             serialNumber: ...
             v signature (sha256WithRSAEncryption)
             v issuer: C=TR, ST=İstanbul, L=İstanbul, O=Shark-Tank,
              OU=Network Analysis Lab, CN=secure.shark-tank.local
             v validity
                 notBefore: ...
                 notAfter: ...
             v subject: C=TR, ST=İstanbul, O=Shark-Tank,
                      CN=secure.shark-tank.local
             subjectPublicKeyInfo: ...
```

### Ne Yapmalısın?
1. **Issuer** (veren): Sertifikayı kim verdi? (self-signed = kendi verdiği)
2. **Subject** (sahip): Sertifika kime ait?
3. **Validity**: Sertifika ne zamandan ne zamana geçerli?
4. **CN** (Common Name): Domain adı nedir?

### Sertifika Zinciri (Certificate Chain)

Bu lab'ın HTTPS sunucusu artık bir **mini-CA** tarafından imzalanıyor:
`Shark-Tank Lab Root CA` sunucu sertifikasını imzalamış ve nginx, Certificate
mesajında **iki sertifikayı birden** (server + root CA) gönderiyor.

```text
v Handshake Protocol: Certificate
    v Certificate              # 1. sertifika: sunucu (CN=secure.shark-tank.local)
        issuer: CN=Shark-Tank Lab Root CA     <-- CA imzalı!
        subject: CN=secure.shark-tank.local
    v Certificate              # 2. sertifika: Root CA (zincirin üstü)
        issuer: CN=Shark-Tank Lab Root CA     <-- issuer = subject (root)
        subject: CN=Shark-Tank Lab Root CA
```

Zincir doğrulama filtreleri:
```text
tls.handshake.type == 11                                     # Certificate mesajı
tls.handshake.certificate contains "Shark-Tank Lab Root CA"  # zincirde CA var mı
```

Sunucu sertifikasının `Authority Information Access` uzantısında bir de
**OCSP URL'i** taşındığını gör: `http://172.50.2.19:9080`. Tarayıcı bu
adresi sertifika iptal kontrolü için kullanır — bir sonraki alıştırmada
biz de kullanacağız.

> **SINAV İPUCU:** Self-signed sertifikalarda issuer = subject. CA imzalı
> sertifikalarda ise sunucu sertifikasının issuer'ı, zincirdeki üst
> sertifikaların subject'iyle eşleşir. Zincir köke böyle kapanır.

### Sertifika Sağlık Kontrol Listesi (Analist Rutini)

Sertifikayı gördün; şimdi **sağlıklı mı** diye sorgula — dört kontrol:

| # | Kontrol | Nasıl | Kötü işaret |
|---|---------|-------|-------------|
| 1 | **Self-signed mı?** | issuer == subject mi? | EVET → MITM/kurumsal araya girme şüphesi |
| 2 | **Süresi dolmuş mu?** | `notAfter` vs. paket zamanı | DOLMUŞ → ihmalkâr altyapı; sahte sayfa şüphesi |
| 3 | **Zayıf imza?** | `signatureAlgorithm` | SHA-1/MD5 → sahtelenebilir (collision) |
| 4 | **CN/SNI eşleşiyor mu?** | CN + SAN vs. bağlanılan sunucu | Farklı → kimlik uyşmazlığı |

**Bu lab'ın sertifikası (mini-CA):** issuer = `Shark-Tank Lab Root CA`
(subject değil) → imzalı ✓ · SHA-256 ✓ · notAfter 2028 ✓ ·
CN=`secure.shark-tank.local` = bağlanılan sunucu ✓ → dört kontrol geçer.

Filtreler ve okuma:
```text
tls.handshake.type == 11          # Certificate mesajı
x509af.utcTime                    # notBefore/notAfter satırları (string)
```
`validity` düğümündeki iki `utcTime` değerini (`2026-08-23 ...` /
`2028-08-22 ...`) paketin zamanıyla karşılaştır: `notAfter` geçmişse
sertifika ölüdür. Zayıf imzayı `signatureAlgorithm
(sha256WithRSAEncryption)` satırından okursun; SHA-1/MD5 görürsen kırmızı
bayrak. (Süreler FT_STRING olduğu için tshark'la kıyaslama yapmak
yerine gözle/`-T fields -e x509af.utcTime` çıktısıyla yapılır.)

> **SINAV İPUCU:** "Bu sertifika güvenilir mi?" sorusu bu dört maddenin
> ezber taramasıdır: issuer zinciri, tarih aralığı, imza algoritması,
> isim eşleşmesi. OCSP iptal kontrolü (bir sonraki alıştırma) beşinci
> ve son maddedir.

## Alıştırma 5: OCSP ile İptal Durumu Doğrulama

Sertifika geçerli tarihli ve CA imzalı olsa bile **iptal edilmiş**
(revoked) olabilir. OCSP (Online Certificate Status Protocol), sertifikayı
veren CA'ya "bu sertifika hala geçerli mi?" diye sorar.

pcap'te client, HTTPS oturumlarının ardından OCSP responder'a
(172.50.2.19:9080) sorgu yapmış durumda.

### Filtreler:
```text
ocsp                                   # hem istek hem yanıt
ocsp.response_status == 0              # başarılı yanıt
ocsp.certStatus == 0                   # good (iptal edilmemiş)
```

### Ne Görmelisin?
1. **OCSP Request** (HTTP POST üzerinden): Serinin (serial number)
   hash'lenmiş hali `certID` alanında taşınır. Hostname kanıtı:
   `http.host == "172.50.2.19"` — OCSP trafiği HTTP üzerinden gider.
2. **OCSP Response**:
   ```text
   v Online Certificate Status Protocol
       responseStatus: successful (0)
       v basicResponse
           v responseData
               v responderID: CN=Shark-Tank OCSP
               v response
                   v certID
                       serialNumber: 0x1001        <-- sunucu sertifikası
                   certStatus: good (0)             <-- İPTAL EDİLMEMİŞ
   ```

`certStatus` değerleri: `good` (0), `revoked` (1), `unknown` (2).
Bir saldırı senaryosunda `revoked` görürsen: sertifika çalınmış/iptal
edilmiş ama hala kullanılıyor — ciddi bir göstergedir.

**Doğrulama zinciri tamamlandı:** tarih geçerli (validity) + CA imzalı
(chain) + iptal edilmemiş (OCSP good) = güvenilir sertifika. Üçünden
biri bile eksikse analist şüphelenmelidir.

> **SINAV İPUCU:** "Sertifika iptal edilmiş mi?" → `ocsp.certStatus`
> alanına bak: 0=good, 1=revoked, 2=unknown. OCSP trafiği HTTP POST
> olarak (genelde 80/8080) görünür — TLS değil!

## Alıştırma 6: Şifrelenmiş Veri

### Filtre:
```text
tls.record.content_type == 23    # Application Data
```

TLS handshake'den sonraki TÜM veri şifrelidir:
```text
 v Transport Layer Security
     Content Type: Application Data (23)
     Version: TLS 1.2
     Length: 123
     Encrypted Application Data: 4a3f8b...   <-- ANLAMSIZ HEX
```

> **SINAV İPUCU:** Şifreli veriyi göremezsin! Ama metadata'yı görebilirsin:
>
> - Kaç byte transfer edildi?
> - Hangi yone?
> - Ne kadar sürede?

### Payload Length (Record Length) Analizi

Şifre açılamasa bile TLS kayıt uzunlukları analyst için değerlidir:
`tls.record.length` alanı her Application Data kaydının payload boyutunu
verir (maks. ~16 KB).

```text
tls.record.content_type == 23
```
Lab ölçümü — ilk kayıt uzunlukları: `92, 1000, 102, 287, 103, ...` byte.

**Neden önemli?** Uzunluk deseni, içerik hakkında bilgi sızdırır
(traffic analysis): Örn. parola yazarken her tuş vuruşu ayrı küçük
kayıt olursa (Ex: 92 byte sonra 103 byte), tuş zamanlaması analiziyle
parola tahmin edilebilir. Sınavda "şifreli trafikte neler görünür?"
sorununun cevabı: versiyon, cipher, SNI, sertifika, **uzunluk ve zaman**
— ama içerik asla.

**tshark ile toplam şifreli payload:**
```sh
tshark -r shared/pcaps/module-16-tls.pcap -Y 'tls.record.content_type == 23' \
  -T fields -e tls.record.length | awk '{s+=$1} END {print "Toplam:", s, "byte"}'
```

## Alıştırma 8: HTTP vs HTTPS Karşılaştırma

Capture dosyasında hem HTTP hem HTTPS trafiği var.

### HTTP:
```text
http
```
- Tüm içerik AÇIKÇA görünür (request, response, header, body)

### HTTPS:
```text
tls
```
- Sadece handshake görünür, veri ŞİFRELİ

> **SINAV İPUCU:** HTTP vs HTTPS farkı sınavda KESİN çıkar.
>
> HTTP'de şifreler açık, HTTPS'de şifreli görünür.

## Alıştırma 9: TLS Trafiğini Deşifre Etme (SSLKEYLOGFILE)

Şifreli TLS trafiğini SSL keylog dosyası ile deşifre edeceksin. Bu yöntem TLS 1.2 ve TLS 1.3 için çalışır.

> **Neden private key değil?** Modern TLS (1.2 ECDHE ve TLS 1.3) Perfect Forward Secrecy (PFS) kullanır.
>
> PFS ile private key trafiği deşifre edemezsin. Bunun yerine istemcinin yazdığı keylog dosyası kullanılır.
>
> Gerçek dünyada tarayıcılarda `SSLKEYLOGFILE` ortam değişkeni ayarlanarak aynı şey yapılır.

**Adım 1:** `shared/pcaps/module-16-tls.pcap` dosyasını Wireshark'ta aç.

**Adım 2:** `Edit > Preferences > Protocols > TLS` menüsüne git.

**Adım 3:** **(Pre)-Master-Secret log file** alanına şu dosyayı seç:
```text
shared/certs/sslkeys.log
```

**Adım 4:** "OK" ile pencereyi kapat.

**Adım 5:** Pcap'ı kapat ve tekrar aç (File > Close, File > Open). Wireshark keylog dosyasını okuyarak TLS trafiğini deşifre eder.

**Adım 6:** Artık şu filtreleri kullanabilirsin:
- `http`: Deşifre edilen HTTP isteklerini gör
- `http.request.method == "POST"`: POST body'lerini oku
- `http.response.code`: Status code'ları gör
- `http.file_data contains "secret"`: Şifreli kanalda gizlenen veriyi bul

**Adım 7:** Deşifre edilmiş paketleri incele:
- Application Data paketlerinin içinde artık "Decrypted TLS" katmanı görünür
- HTTP protokolü içeriği tamamen okunabilir
- `/secure-api` endpoint'ine gönderilen POST body'sini oku

> **SINAV İPUCU:** SSLKEYLOGFILE yöntemi TLS decryption için en güvenilir yoldur.
>
> Wireshark > Preferences > Protocols > TLS > (Pre)-Master-Secret log file. Private key yöntemi sadece RSA key exchange (PFS olmayan) ile çalışır.

> **Kendi capture'ını oluştur:** İstemcide `SSLKEYLOGFILE=/tmp/keys.log` ortam değişkenini ayarla, trafiği yakala, sonra Wireshark'ta keylog dosyasını göster.
>
> Gerçek IR senaryolarında browser memory dump'inden veya malware sandbox'ından keylog elde edilebilir.

## Alıştırma 10: TLS Versiyon Tespiti ve TLS 1.2 vs 1.3 Karşılaştırması

Bu pcap hem TLS 1.2 hem TLS 1.3 bağlantıları içerir. İkisini karşılaştır.

### Filtre:
```text
tls.handshake.type == 2    # ServerHello: seçilen cipher ve sürüm
```

### Adımlar:
1. ServerHello paketlerini listele
2. Her birinde `tls.handshake.ciphersuite` alanını bul
3. Cipher suite değerinden TLS sürümünü çıkar:

| Cipher | TLS Sürümü | Anlamı |
|--------|-----------|--------|
| `0x1302` (TLS_AES_256_GCM_SHA384) | TLS 1.3 | Modern, hızlı handshake |
| `0xc030` (TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384) | TLS 1.2 | Daha uzun handshake |

### TLS 1.2 vs TLS 1.3 Handshake Karşılaştırması:

| Özellik | TLS 1.2 | TLS 1.3 |
|---------|---------|---------|
| Handshake adım sayısı | Daha fazla (7-9 paket) | Daha az (3-5 paket) |
| ServerKeyExchange | Ayrı paket | Yok (gömülü) |
| ClientKeyExchange | Ayrı paket | Yok (gömülü) |
| ChangeCipherSpec | Ayrı paket | Yok (veya sanity check) |
| Certificate şifreli mi? | Hayır (açık) | Evet (şifreli, keylog olmadan görünmez) |
| PFS (Forward Secrecy) | Opsiyonel (ECDHE) | Zorunlu |

### Wireshark'ta Farkı Gör:
1. TLS 1.2 bağlantısında (cipher 0xc030): Certificate paketini görebilirsin (şifresiz)
2. TLS 1.3 bağlantısında (cipher 0x1302): Certificate şifrelidir: Keylog olmadan görülemez
3. TLS 1.3'te handshake daha az paketle tamamlanır

> **SINAV İPUCU:** TLS 1.3'te Certificate şifrelidir. Bu yüzden keylog dosyası olmadan sertifika detayları görülemez. TLS 1.2'de ise Certificate açıktır.
>
> Ayrıca TLS 1.3'te ChangeCipherSpec ve ayrı KeyExchange paketleri yoktur: Anahtar değişimi handshake içine gömülüdür.

> **TLS 1.3 0-RTT risk notu:** TLS 1.3'ün 0-RTT (early data) özelliği,
> daha önce bağlanılmış sunuculara ilk pakette veri göndermeye izin verir
> (handshake beklemeden). Hız kazandırır ama **replay saldırısına**
> açıktır: Aynı early-data paketi yakalanıp tekrar oynatılabilir.
> Wireshark'ta `tls.handshake.extensions.psk_key_exchange_modes` veya
> early data uzantıları görüldüğünde bu riski not etmen gerekir. Bu lab
> 0-RTT kullanmaz (nginx'de kapalıdır).

Farklı paketlerde TLS versiyonunu kontrol et.

## Alıştırma 11: TLS Zafiyet Tespiti (SSL Stripping, Heartbleed)

Bu pcap'te TLS zafiyeti yoktur, ancak gerçek dünyada tespit yöntemlerini bilmek sınav için kritiktir.

### SSL Stripping (Downgrade Saldırısı)

Saldırgan, HTTPS bağlantısını HTTP'ye düşürür:
1. Kullanıcı `https://site.com` yazmak isterken saldırgan `http://site.com`'e yönlendirir
2. Tüm trafik şifresiz akar, saldırgan her şeyi okur

Tespit:
```text
# Aynı sunucuya hem HTTP hem HTTPS bağlantısı: şüpheli
http && ip.addr == 172.50.2.13

# TLS version downgrade (1.3 → 1.2 veya 1.2 → 1.1)
tls.record.version < 0x0303
```

> **SINAV İPUCU:** SSL stripping, HTTPS'yi HTTP'ye düşüren MITM saldırısıdır. HSTS header'ı bu saldırıyı engeller.
>
> Wireshark'ta aynı IP'ye hem HTTP hem TLS trafiği görürsen SSL stripping olabilir.

### Heartbleed (CVE-2014-0160)

OpenSSL'nin heartbeat extension'ındaki bir bellek sızıntısı zafiyetidir:
1. Saldırı, TLS heartbeat request ile yapılır
2. Sunucunun RAM'inden 64KB'ye kadar veri sızdırılabilir
3. Private key'ler, şifreler, kullanıcı oturumları çalınabilir

Tespit:
```text
# Heartbeat request
tls.record.content_type == 24

# Anormal heartbeat payload uzunluğu
tls.heartbeat_message.payload_length > 0
```

> **SINAV İPUCU:** Heartbleed, TLS heartbeat'teki buffer over-read zafiyetidir.
>
> Wireshark'ta `tls.record.content_type == 24` filtresi heartbeat mesajlarını gösterir. Normal heartbeat çok az yer kaplarken, exploit'te payload length anormal büyüktür.

### Self-Signed Sertifika Tespiti

Self-signed sertifikalarda issuer = subject (kendi kendine imzalanmış):
```text
# Sertifika karşılaştırması
tls.handshake.type == 11
```
Wireshark'ın işaretçileri:
- Sertifika detayında **issuer ve subject RDN listeleri birebir aynıdır**
- Sertifika zincirinde **CA sertifikası yoktur** (tek sertifika)
- Tarayıcıda görülen "güvenilir olmayan sertifika" uyarısı aynı teblihi yapar

> **SINAV İPUCU:** Self-signed sertifika tespiti:
>
> - Issuer = Subject
> - Sertifika zincirinde sadece 1 sertifika var
> - Wireshark Expert Info'da "Self-Signed Certificate" uyarısı
> - Gerçek dünyada: MITM saldırısı, test ortamı veya IoT cihazı

## Alıştırma 12: SNI — Şifreli Trafiğin Görünen Yüzü

TLS şifreli olsa bile ClientHello içindeki SNI (Server Name Indication)
alanı düz metindir: İstemcinin HANGİ sunucuya bağlandığını ele verir.

### Filtre:
```text
tls.handshake.extensions_server_name
```

### Adımlar:

1. Filtreyi uygula: ClientHello paketleri listelenir
2. Paketi aç ve orta panelde uzantıyı bul:

```text
v Extension: server_name (len=28)
    v Server Name Indication extension
        Server Name: "secure.shark-tank.local"    ← düz metin!
```

3. Aynı pcap'te bu SNI'ye sahip bağlantının sunucu IP'sini belirle:
   ClientHello paketinin `ip.dst` değeriyle eşle (172.50.2.13 = https
   sunucusu, ref5 servis envanterinden)

### SNI Neden Var?

| Soru | Cevap |
|------|-------|
| Sunucu neden ismi öğrenmek ister? | Aynı IP'te birden çok sertifika barındırır (SNI-based vhosting) |
| Neden şifreli değil? | Handshake'in isim bölümü TLS kurulmadan ÖNCE gider |
| Sızdırdığı bilgi ne? | Kullanıcının ziyaret ettiği alan adı (metadata) |

> **SINAV İPUÇLARI:**
>
> - SNI = ClientHello uzantısı; ServerHello'da OLMAZ
> - Filtre doğrudan: `tls.handshake.extensions_server_name`
> - ESKİ istemciler (veya ECH kullananlar) SNI göndermez — boş sonuç
>   anomali değil, tekniktir
> - TLS 1.3'te sertifikalar şifrelendi ama SNI hâlâ görünür kalır

> **İstihbarat İşaretleri, SNI:**
>
> - SNI envanteri çıkararak şifreli trafikte "kim nereye" haritası
>   kurulabilir (tedarikçi, C2 altyapısı, tunnel servisleri)
> - Parolasız/unusual TLD'li SNI'ler (xyz, zip, online) C2 adayıdır
> - ECH (Encrypted Client Hello) kullanan istemciler bu görünürlüğü
>   kapatır — boşluk, kendisi bir bulgudur

## Hızlı Referans - TLS Filtreleri

```text
# TLS record tipleri
tls.record.content_type == 20       # ChangeCipherSpec
tls.record.content_type == 21       # Alert
tls.record.content_type == 22       # Handshake
tls.record.content_type == 23       # Application Data (şifreli)

# Handshake mesaj tipleri
tls.handshake.type == 1             # ClientHello
tls.handshake.type == 2             # ServerHello
tls.handshake.type == 11            # Certificate
tls.handshake.type == 12            # ServerKeyExchange
tls.handshake.type == 14            # ServerHelloDone
tls.handshake.type == 16            # ClientKeyExchange

# Sertifika bilgileri
tls.handshake.extensions_server_name == "secure.shark-tank.local"

# Cipher suite
tls.handshake.ciphersuite == 0x009D # TLS_RSA_WITH_AES_256_GCM_SHA384

# Alert
tls.alert_message.level == 2        # Fatal error
```

## TLS Şifre Çözme (Decryption)

Wireshark, TLS trafiğini şifreli halde gösterir. Ama SSLKEYLOGFILE ile şifreyi çözebilirsin:

### Yöntem 1: SSLKEYLOGFILE (Tarayıcıdan Key Log)

1. Tarayıcıyı key log dosyası ile başlat:
```sh
   # macOS
   SSLKEYLOGFILE=/tmp/sslkeys.log \
     /Applications/Firefox.app/Contents/MacOS/firefox

   # Linux
   SSLKEYLOGFILE=/tmp/sslkeys.log firefox

   # Windows (PowerShell)
   $env:SSLKEYLOGFILE="C:\temp\sslkeys.log"; Start-Process firefox
```
2. Wireshark'ta: **Edit > Preferences > Protocols > TLS**
3. **(Pre)-Master-Secret log filename** alanına `/tmp/sslkeys.log` yaz
4. Artık TLS Application Data paketlerinin içeriği okunabilir!

### Yöntem 2: Private Key ile Çözme

1. Edit > Preferences > Protocols > TLS > RSA keys list
2. Edit** butonuna tıkla → **Add
3. IP: 172.50.2.13, Port: 443, Protocol: Http, Key File: Shared/certs/server.key
4. TLS handshake paketlerinin Application Data'sı artık cleartext HTTP olarak görünür

> **SINAV İPUCU:** WCNA sınavı TLS decryption'ı test eder. SSLKEYLOGFILE yöntemi sınavda en çok sorulan konudur. Private key yöntemi sadece RSA key exchange ile çalışır (TLS 1.3'te çalışmaz).

## Sınav Soruları (Çöz)

1. ClientHello'da istemci kaç farklı cipher suite destekliyor?
2. Sunucu hangi cipher suite'i seçti?
3. Sertifikanın CN (Common Name) değeri nedir?
4. Sertifika self-signed mi? Issuer ve subject'i karşılaştır.
5. Şifrelenmiş Application Data paketlerinde kaç byte veri var? İçerik okunabiliyor mu?
6. HTTP ve HTTPS arasındaki görünür fark nedir?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. Cipher suite sayısı istemci kütüphanesine bağlıdır. ClientHello'daki Cipher Suites listesini say.
2. TLS_AES_256_GCM_SHA384 (TLS 1.3) veya TLS_RSA_WITH_AES_256_GCM_SHA384 (TLS 1.2): ServerHello'da görünür
3. secure.shark-tank.local
4. Evet. Issuer = Subject (C=TR, O=Shark-Tank, CN=secure.shark-tank.local)
5. Hayır, şifreli. Byte sayısı görülür ama içerik okunmaz.
6. HTTP'de tüm içerik cleartext okunur. HTTPS'de sadece TLS handshake görünür, uygulama verisi şifrelidir.

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
