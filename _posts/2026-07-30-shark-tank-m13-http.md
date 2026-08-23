---
layout: post
title:  "shark-tank - m13: HTTP Analizi"
date:   2026-07-30 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 13: HTTP Analizi

**Neden?** Web uygulamasına SQL injection yapıldı, kullanıcı veritabanı çalındı. Saldırgan işe DNS çözümlemesiyle başlamış, ardından web oturumunu taklit etmek için çalınmış cookie'yi kullanmış. HTTP trafiğinin tamamı şifresizdir: Saldırganın gönderdiği payload Wireshark'ta aynen görünür. SQL injection (veritabanı sızdırma), XSS (kullanıcı çalma), path traversal (dosya okuma), HTTP request smuggling (önbellek zehirleme), credential stuffing (POST body'de şifre dener), CSRF (işlem çalma). Bu modülde, HTTP saldırılarını paket seviyesinde tespit etmeyi ve DNS ile HTTP arasındaki zaman ilişkisini (delta) okumayı öğreneceksin.

**Görev:** HTTP trafiğini analiz et. GET/POST isteklerini, status kodlarını, credential sızıntısını, cookie akışını ve DNS→HTTP zincirini incele.

**Öğrenim Hedefleri:**
- HTTP GET/POST isteklerini ve response status kodlarını (200, 302, 403, 404) analiz edebilmek
- Cleartext credential sızıntısını POST body'de tespit edebilmek
- HTTP header'larını (Server, User-Agent, Cookie, Set-Cookie, Content-Type) okuyup yorumlayabilmek
- Content-Length ve Transfer-Encoding: chunked ile gövde uzunluğu okumayı bilmek
- Cookie oturum takibini (Set-Cookie → Cookie zinciri) Wireshark'ta izleyebilmek
- DNS çözümlemesi ile ilk HTTP isteği arasındaki süreyi (delta) ölçebilmek
- SQL injection ve XSS saldırı girişimlerini URL parametrelerinde tanıyabilmek
- Wireshark Export Objects ile HTTP içeriğini dışa aktarabilmek
- Follow TCP Stream ve Statistics > HTTP ile HTTP oturumlarını toplu inceleyebilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **HTTP** | HyperText Transfer Protocol: Web tarayıcıları ile web sunucuları arasındaki iletişim protokolü. İstemci (browser) bir istek (request) gönderir, sunucu bir yanıt (response) döner. Tüm içerik düz metin (cleartext) olarak iletilir: Hiçbir şifreleme yoktur. Bu yüzden Wireshark ile HTTP trafiğini izleyen biri şifreleri, cookie'leri, form verilerini dahil her şeyi açıkça görebilir. Port 80 kullanır. HTTPS, HTTP'in TLS ile şifrelenmiş halidir (port 443). |
| **TCP** | Transmission Control Protocol: İnternetin güvenilir ve sıralı veri iletimini sağlayan protokol. Veriyi göndermeden önce alıcıyla bağlantı kurar (3-way handshake), gönderdiği her paket için onay (ACK) bekler ve onay gelmeyen paketleri yeniden gönderir (retransmission). Bu mekanizmalar sayesinde veri kaybı olmadan ve gönderim sırasında bozulmadan teslim edilir. Web (HTTP), email (SMTP), dosya transferi (FTP) gibi kritik işlemlerin tamamı TCP üzerinden çalışır. Bağlantı kurma ve onay bekleme yükü nedeniyle UDP'den yavaştır, ama güvenilirlik gerektiğinde tek seçenektir. |
| **HTTP request method** | İstemcinin sunucudan ne istediğini belirten HTTP komutu. GET, bir kaynağı (web sayfası, API yanıtı) okumak için kullanılır ve parametreleri URL'nin sonuna ekler (örn. `/api/data?id=1`). POST, sunucuya veri göndermek için kullanılır ve veriyi gövdede (body) taşır; form gönderimi ve giriş işlemleri POST ile yapılır. PUT bir kaynağı oluşturur veya günceller, DELETE siler, HEAD sadece header bilgilerini ister (body yok). Wireshark'ta `http.request.method == "GET"` veya `"POST"` filtreleriyle bulunur. Güvenlik açısından POST body'leri önemlidir çünkü kullanıcı adı ve şifreler burada cleartext olarak görünür. |
| **HTTP status code** | Sunucunun isteğe verdiği yanıtın sonucunu belirten 3 haneli kod. 2xx başarılı: 200 OK (her şey normal). 3xx yönlendirme: 302 Moved Temporarily (geçici olarak başka URL'ye yönlendir). 4xx istemci hatası: 401 Unauthorized (giriş gerekli), 403 Forbidden (erişim yasak), 404 Not Found (sayfa yok). 5xx sunucu hatası: 500 Internal Server Error. Wireshark'ta `http.response.code == 200` filtresiyle belirli kodlar aranır. Art arda 401 veya 403 yanıtları brute force girişimini, çok sayıda 404 yanıtı ise directory scanning (dizin tarama) saldırısını gösterebilir. |
| **cleartext** | Verinin hiçbir şifreleme uygulanmadan, olduğu gibi (düz metin) iletilmesi. HTTP, FTP, Telnet, SMTP cleartext protokollerdir: Ağ trafiğini dinleyen biri (Wireshark, tcpdump) şifreler, mesaj içerikleri ve kişisel verileri açıkça görebilir. HTTPS (HTTP + TLS), veriyi şifreleyerek bu sorunu çözer. Cleartext trafiğin güvenlik riski, Wireshark gibi araçlarla analiz yapmayı da kolaylaştırır: Bu yüzden bu laboratuvarda HTTP kullanılarak tüm trafiğin paket seviyesinde görülebilmesi sağlanmıştır. |
| **HTTP header** | HTTP isteğinde veya yanıtında, gövde (body) öncesi gönderilen metadata alanları. İstek header'ları arasında `Host` (hedef sunucu adı), `User-Agent` (istemci uygulaması ve sürümü), `Cookie` (oturum kimliği), `Content-Type` (gövde veri tipi) bulunur. Yanıt header'ları arasında `Server` (sunucu yazılımı ve sürümü), `Content-Length` (gövde boyutu), `Location` (yönlendirme URL'si) bulunur. Header'lar `Ad: Değer` biçiminde yazılır ve her biri ayrı bir satırdadır. Wireshark'ta HTTP katmanı genişletilerek tüm header'lar tek tek görülebilir. |
| **Follow TCP Stream** | Wireshark'ın bir TCP bağlantısındaki tüm veriyi baştan sona tek pencerede gösteren özelliği. Bir HTTP oturumunu, bir FTP transferini veya bir email gönderimini tam olarak görmek için kullanılır. Paket listesindeki herhangi bir pakete sağ tıklayıp "Follow > TCP Stream" seçilerek açılır. İstemcinin gönderdiği veri (request) ve sunucunun yanıtı (response) farklı renklerle ayrılarak görüntülenir. Sınavda credential sızıntısı, SQL injection payload'ı veya email içeriği gibi verileri hızlıca okumak için en kullanışlı araçtır. |
| **SQL injection** | Web uygulamasının veritabanına gönderdiği sorguya, kullanıcı girdisi üzerinden zararlı SQL parçaları sızdırılması. Klasik örnek: URL'ye `' OR 1=1--` eklemek — kapatma tırnağı sorguyu böler, `OR 1=1` tüm kayıtları doğru kılar, `--` kalan kısmı yorum satırına çevirir. Wireshark'ta URL parametrelerinde `'`, `UNION`, `SELECT`, `OR 1=1` gibi kalıplar aranarak tespit edilir. OWASP Top 10'un ilk sıralarındadır. |
| **XSS (Cross-Site Scripting)** | Saldırganın zararlı JavaScript'i bir web sayfasına enjekte ederek diğer kullanıcıların tarayıcısında çalıştırması. Yansımalı (reflected) XSS'te payload URL parametresiyle taşınır: `<script>alert(1)</script>` gibi. Wireshark'ta `http.request.uri contains "<script>"` filtresiyle yakalanır; HTTP düz metin olduğu için payload URL'de açıkça görünür. |
| **brute force** | Kimlik bilgilerini ele geçirmek için şifrelerin otomatik olarak sırayla denendiği saldırı. Ağda imzası: Aynı kaynaktan art arda login denemeleri ve karşılığında dönen hata yanıtları (HTTP 401/403, FTP 530). Denemeler arası sürenin milisaniye seviyesinde düzgün olması, insan değil otomatize araç (script, Hydra, Medusa) işaretidir. |
| **chunked transfer** | HTTP gövdesinin uzunluğu önceden bilinmediğinde kullanılan aktarım biçimi: Gövde, her birinin uzunluğu hex olarak belirtilen parçalar (chunk) halinde gönderilir ve sıfır uzunluklu chunk ile sonlanır. Dinamik üretilen içeriklerde ve gzip akışlarında standarttır. Wireshark'ta `http.transfer_encoding contains "chunked"` filtresiyle bulunur; Content-Length başlığı bu yanıtlarda bulunmaz. |
| **Set-Cookie / Cookie** | Sunucu, yanıtında `Set-Cookie` başlığıyla istemciye oturum kimliği (örn. `session=st-abc123def456`) verir; istemci sonraki her istekte aynı değeri `Cookie` başlığıyla geri gönderir. HTTP şifresiz olduğundan bu token dinleyen herkes tarafından okunabilir ve saldırgan tarafından yeniden kullanılabilir (session hijacking). Wireshark'ta `http.set_cookie` ve `http.cookie` filtreleriyle izlenir. |

## Teori

HTTP (HyperText Transfer Protocol), web istemci-sunucu iletişim protokolüdür.
- **Request** (istemci -> sunucu): GET, POST, PUT, DELETE, HEAD
- **Response** (sunucu -> istemci): Status code + headers + body
- **Port:** 80 (varsayılan)
- **Düz metin** - Wireshark'ta tüm içerik görünür (şifresiz)

> **İstihbarat İşaretleri, HTTP, OWASP Top 10'un ana sahasıdır:**
>
> - `http.request.method == "POST"` + `http.file_data contains "password"` → **Cleartext credential sızıntısı**
> - URL'de `' OR 1=1 --` → **SQL injection** denemesi
> - URL'de `<script>alert(1)</script>` → **XSS** denemesi
> - `http.response.code == 401` art arda → **Brute force** girişimi
> - `http.user_agent` anormal → **Bot veya otomatize araç** (nmap, sqlmap, curl)

> **HTTP/2 ve HTTP/3 notu:** Modern web'de karşına HTTP/1.1 yerine
> **HTTP/2** (TCP üzerinde ikili çerçeveleme, tek bağlantıda çoklu akış) veya
> **HTTP/3** (QUIC/UDP üzerinde — bkz. Modül 10) çıkabilir. HTTP/2'de
> header'lar HPACK ile sıkıştırıldığı için metin olarak okunmaz; Wireshark
> `http2` dissector'ıyla akışları ayrıştırır ve filtresi `http2`'dir.
> Sınav kapsamı HTTP/1.1'dir; HTTP/2 görürsen "bu trafik ikili protokol"
> diye tanıman yeterli.

## Hazırlık

```sh
# Ortam çalışıyor olmalı. Değilse:
./scripts/start.sh

# HTTP trafiği üret:
./scripts/generate-traffic.sh http

# Pcap dosyasını aç:
# macOS: open -a Wireshark module-13-http.pcap
# Linux: wireshark module-13-http.pcap &
# Windows: start wireshark module-13-http.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

## Alıştırma 1: HTTP GET Isteini İncele

### Filtre:
```text
http.request.method == "GET"
```

### Ne Yapmalısın?
1. Filtreyi yazıp Enter'a bas
2. Herhangi bir GET paketine tıkla
3. Orta panelde **Hypertext Transfer Protocol** katmanını genişlet
4. Şu alanları bul:

| Alan | Açıklama | Örnek Değer |
|------|----------|-------------|
| Request Method | Hangi HTTP metodu | GET |
| Request URI | Hangi sayfa | /api/data |
| Request Version | HTTP versiyonu | HTTP/1.1 |
| Host | Hedef sunucu | 172.50.2.10 |
| User-Agent | İstemci bilgisi | curl/8.x.x |
| Accept | Beklenen içerik tipi | */* |

### Görsel Rehber:
```text
Orta Panel:
 v Hypertext Transfer Protocol
     GET /api/data HTTP/1.1        <-- Request line
     Host: 172.50.2.10             <-- Header
     User-Agent: curl/8.x.x        <-- Header
     Accept: */*                   <-- Header
```

## Alıştırma 2: HTTP Response'yi İncele

### Filtre:
```text
http.response
```

### İncelenecek Alanlar:

| Alan | Açıklama | Örnek Değerler |
|------|----------|---------------|
| Status Code | Sonuç kodu | 200, 302, 403, 404 |
| Content-Type | İçerik tipi | text/html, application/json |
| Content-Length | Gövde boyutu (byte) | 1234 |
| Server | Sunucu yazılımı | nginx/1.x.x |

### Status Kodları (Sınavda Çıkabilir):

| Kod | Anlamı | Bizim Örneğin |
|-----|--------|---------------|
| **200** | Başarılı | GET / , GET /api/data |
| **302** | Yönlendirme | GET /redirect |
| **403** | Yasaklı | GET /secret |
| **404** | Bulunamadı | GET /nonexistent |

### Content-Length mi, Transfer-Encoding: chunked mi?

HTTP gövdesinin uzunluğu iki farklı şekilde bildirilir:

| Yöntem | Nasıl Çalışır | pcap'te Nerede |
|--------|---------------|----------------|
| **Content-Length** | Sunucu gövde uzunluğunu başta söyler: `Content-Length: 1234` | /api/data yanıtları, POST istekleri |
| **Transfer-Encoding: chunked** | Uzunluk önceden bilinmez; gövde parça (chunk) parça gönderilir, her chunk'ın uzunluğu hex olarak kendi başında yazılır, `0\r\n\r\n` ile biter | `GET /chunked.txt` yanıtı |

**Alıştırma (m13):** Şu filtreyle chunked yanıtı bul:
```text
http.transfer_encoding contains "chunked"
```
Bu response'un **Content-Length başlığı olmadığına** dikkat et. Paket
detaylarında `Media Type` altında chunk satırlarını görürsün; Wireshark
bunları otomatik birleştirir. Chunked aktarım, uzunluğu önceden
bilinmeyen (dinamik üretilen, akış halindeki) içeriklerde kullanılır —
ve ters mühendislik için önemli bir gerçektir: **Content-Length yoksa
gövdeyi tek pakette aramamalısın.**

> **SINAV İPUCU:** "Response'un toplam gövde boyutu nedir?" sorusunda
> önce Content-Length var mı diye bak; yoksa chunk boyutlarını toplaman
> (ya da Wireshark'ın birleştirdiği gövdeye bakman) gerekir.

## Alıştırma 3: POST Isteğini İncele

### Filtre:
```text
http.request.method == "POST"
```

1. POST paketini bul ve tıkla
2. **Hypertext Transfer Protocol** katmanını genişlet
3. **HTML Form URL Encoded** alanını genişlet
4. Form verilerini gör:

```text
 v HTML Form URL Encoded
     Key: username    Value: admin
     Key: password    Value: secret123    <-- BU SINAVDA SORULUR!
```

> **SINAV İPUCU:** HTTP POST ile gönderilen şifreler Wireshark'ta AÇIKÇA görünür!
>
> HTTP güvenli değildir, bu yüzden HTTPS kullanılır.

### HTTP Basic Authentication: Header'da Taşınan Kimlik

POST gövdesi tek credential yolu değildir: **Basic auth**, kimlik bilgisini
her isteğin başlığında taşır — `Authorization: Basic <base64>` biçiminde.
Base64 şifreleme DEĞİLDİR, kodlamadır: Anında çözülür.

pcap'te iki Basic auth'lu istek var:

```text
http.authbasic
```

Paket detayında:
```text
v Hypertext Transfer Protocol
    Authorization: Basic a2FtZTpoYW1laGE=\r\n
    v Credentials: kame:hameha          <-- Wireshark KOŞULSUZ çözer!
```

**Terminalde çöz (kanıt üretimi):**
```sh
echo "a2FtZTpoYW1laGE=" | base64 -d     # -> kame:hameha
```

Aynı teknik ters yönde de çalışır — saldırgan exfil için veriyi
Basic auth başlığına gömebilir; her `Authorization` başlığını
`http.authorization` filtresiyle kontrol etmek analist refleksi olmalı.

> **SINAV İPUCU:** "Kimlik bilgisi nerede taşınamaz?" — hiçbir yerde:
> POST gövdesi (cleartext), Basic auth başlığı (base64), URL query'si
> (`http.request.uri contains "user="`) — üçünü de ayrı filtrele.

### Content-Length Toplama Tekniği

Büyük POST'lar tek TCP segmentine sığmaz. pcap'te ~74 KB'lık bir POST var
(`POST /api/data`, gövdesi rapor kayıtlarıyla dolu):

1. Filtrele: `http.request.method == "POST" && http.content_length > 50000`
2. İsteğin `Content-Length` değerini not et
3. Aynı TCP stream'inde istemciden çıkan veri segmentlerini topla:
   ```text
   tcp.stream == <numara> && ip.src == 172.50.2.100 && tcp.len > 0
   ```
4. **Statistics > Capture File Properties** yerine pratik yol: her paketin
   `tcp.len` değerlerini topla

Karşılaştır (lab ölçümü):
- Content-Length: **74670** (sadece gövde)
- Σ tcp.len: **74803** (7 segment) = 74670 gövde + **133** HTTP başlığı

İlk segment başlıkları da taşıdığı için toplam Content-Length'ten biraz
fazladır. Bu fark, başlık uzunluğudur — sınavda "gövde kaç byte?"
sorusunda Content-Length'i, "istemci kaç byte TCP verisi gönderdi?"
sorusunda tcp.len toplamını sorarlar.

## Alıştırma 4: Follow TCP Stream

1. Herhangi bir HTTP paketine **sağ tıkla**
2. Follow > TCP Stream
3. Yeni pencerede TÜM konuşmayı göreceksin:

```text
GET /api/data HTTP/1.1          <-- İSTEMCİ (kırmızı)
Host: 172.50.2.10
User-Agent: curl/8.x.x
Accept: */*

HTTP/1.1 200 OK                 <-- SUNUCU (mavi)
Server: nginx/1.x.x
Content-Type: application/json
Content-Length: 72

{"status":"ok","data":"hello from shark-tank","server":"web-01"}
```

> **SINAV İPUCU:** `Follow TCP Stream` ile bir HTTP oturumunun tamamını görebilirsin.
>
> Bu, sınavda bir web uygulamasının ne yaptığını anlamak için EN ÖNEMLİ araçtır.

## Alıştırma 5: Cookie İzleme (Set-Cookie → Cookie)

Web oturumları cookie'lerle yürür — ve HTTP şifresiz olduğu için saldırgan
çalınmış bir cookie ile kullanıcının kimliğine bürünebilir (session hijacking).

1. Sunucunun oturum açtığı yanıtı bul:
   ```text
   http.set_cookie
   ```
   `/session` yanıtı iki cookie gönderir: `session=st-abc123def456`
   (HttpOnly) ve `lang=tr`.
2. İstemcinin sonraki isteklerde bu cookie'leri geri taşıdığını gör:
   ```text
   http.cookie
   ```
   `/api/data` isteğinin `Cookie: session=st-abc123def456; lang=tr`
   başlığı var mı?

**Analist sorusu:** pcap'te `http.cookie` ile taşınan **session token
değeri** nedir? (Cevap: `st-abc123def456`.) Saldırgan bu değeri kendi
tarayıcısına koyarsa, sunucu onu kurban gibi karşılar.

> **SINAV İPUCU:** "Oturum token'i nasıl çalındı?" sorusunun cevabı bu
> zincirde: Set-Cookie (kurban) → cleartext HTTP → Cookie (saldırganın
> sonraki isteği). `http.cookie || http.set_cookie` tek filtreyle ikisini
> birlikte görebilirsin.

## Alıştırma 6: DNS → GET Delta Ölçümü

Tarayıcı bir siteye bağlanmadan önce DNS çözer. Bu iki adım arasındaki
süre (delta), kullanıcı deneyimi analizi ve bot tespitinde kullanılır:
İnsan DNS yanıtı gelmeden GET atamaz; otomatik araçlar bazen DNS'i
atlar veya araya milisaniyeler koyar.

pcap'te zincir şöyle: `dig web.shark-tank.local` hemen ardından
`GET / (Host: web.shark-tank.local)`.

1. DNS konuşmasını bul:
   ```text
   dns.qry.name == "web.shark-tank.local"
   ```
   Yanıt paketinin zaman damgasını not et (Time sütunu).
2. Hemen sonraki isteği bul:
   ```text
   http.request && http.host == "web.shark-tank.local"
   ```
3. Delta = GET zamanı − DNS yanıt zamanı. Örnek lab ölçümü: **~0.27 sn**
   (curl başlatma süresi; senin ölçümün ortam hızına göre değişebilir —
   önemli olan yöntemdir).

**tshark ile otomatik ölçüm:**
```sh
tshark -r shared/pcaps/module-13-http.pcap -Y \
  'dns.qry.name == "web.shark-tank.local" || (http.request && http.host == "web.shark-tank.local")' \
  -T fields -e frame.time_relative -e _ws.col.Info
```

> **SINAV İPUCU:** "DNS yanıtı ile ilk GET arasında ne kadar zaman geçti?"
> sorusunda iki paketin `frame.time_relative` değerlerini çıkart. Time
> Display Format'i (Modül 1) kullanmak işini kolaylaştırır.

## Alıştırma 7: HTTP Yönlendirme (302)

### Filtre:
```text
http.response.code == 302
```

1. 302 response paketini bul
2. **Location** header'ına bak -> yönlendirilen URL'yi gösterir
3. Ardindan gelen GET paketini bul (aynı TCP stream'de)

```text
İSTEMCİ: GET /redirect HTTP/1.1
SUNUCU:  HTTP/1.1 302 Moved Temporarily
         Location: http://172.50.2.10/
İSTEMCİ: GET / HTTP/1.1              <-- Otomatik yönlendirme
SUNUCU:  HTTP/1.1 200 OK
```

## Alıştırma 8: HTTP Nesne Export (Dosya Kurtarma)

HTTP oturumunda transfer edilen dosyaları kurtarma.

### Adımlar:

1. `shared/pcaps/module-13-http.pcap`'i aç
2. **File > Export Objects > HTTP** menüsünü aç
3. Wireshark tüm HTTP response body'lerini otomatik olarak listeler:

| Filename | Content-Type | Size | Host |
|----------|-------------|------|------|
| `/` | text/html | 737 B | 172.50.2.10 |
| `/api/data` | application/json | ... | 172.50.2.10 |
| `/api/users` | application/json | ... | 172.50.2.10 |
| `/large` | text/plain | 3655 B | 172.50.2.10 |

4. Bir nesneyi seç ve **Preview** ile içeriğine bak (tarayıcıda açılır)
5. **Save** ile tek dosyayı kaydet (örn. `/api/data` → JSON dosyası)
6. **Save All** ile tüm nesneleri bir klasöre kaydet

### Export Edilebilen Nesne Tipleri:

| Menü | İçerik | Kullanım |
|------|--------|----------|
| **HTTP** | Web sayfaları, resimler, JSON, dosyalar | Web forensics |
| **SMB** | Paylaşılan klasör dosyaları | File server analizi |
| **DICOM** | Tıbbi görüntüler | Hastane ağı analizi |
| **IMF** | Email mesajları | Email forensics |
| **TFTP** | TFTP ile transfer edilen dosyalar | Config dosyası sızıntısı |

### Forensic Senaryo:
1. `/api/data` response'unu export et
2. JSON içeriğini incele: Hangi veriler sızdı?
3. `/api/users` response'unu export et: Kullanıcı listesi mi?
4. `/large` endpoint'inden ne geldi? Boyutu ne?

> **SINAV İPUCU:** Export Objects, sınavda "bu pcap'te hangi dosyalar transfer edilmiş?" sorusunun en hızlı cevabıdır.
>
> Her dosyayı tek tek Follow TCP Stream ile bulmaya çalışma: Export Objects ile saniyeler içinde listele.

## Alıştırma 9: SQL Injection ve XSS Tespiti

Bu pcap'te saldırgan benzeri şüpheli HTTP istekleri de bulunur:

### SQL Injection:
```text
http.request.uri contains "'" || http.request.uri contains "OR"
```

Capture'da bir istek var:
```text
GET /api/data?id=1'+OR+1=1-- HTTP/1.1
```

Bu, tipik bir SQL injection denemesidir. `' OR 1=1--` ifadesi SQL sorgusunu manipüle eder:
- Normal: `SELECT * FROM users WHERE id = 1`
- Enjekte: `SELECT * FROM users WHERE id = 1' OR 1=1--`
- `'` ile sorgu kapatılır, `OR 1=1` ile tüm kayıtlar döndürülür, `--` ile kalan sorgu yorum satırı yapılır

### XSS (Cross-Site Scripting):
```text
http.request.uri contains "<script>"
```

Capture'da:
```text
GET /api/data?search=<script>alert(1)</script> HTTP/1.1
```

Bu, reflected XSS denemesidir. `<script>alert(1)</script>` tarayıcıda çalıştırılırsa JavaScript kodu çalışır.

### Tespit Filtreleri:
```text
# SQL injection
http.request.uri contains "SELECT" ||
http.request.uri contains "UNION" ||
http.request.uri contains "OR"

# XSS
http.request.uri contains "<script>" ||
http.request.uri contains "javascript:"

# Şüpheli karakterler
http.request.uri contains "'" ||
http.request.uri contains "--" ||
http.request.uri contains "%27"
```

### Ne Yapmalısın?
1. Yukarıdaki filtreleri dene
2. Şüpheli isteklerin tam URL'ini oku (Follow > TCP Stream ile)
3. Hangi endpoint hedef alınmış? (`/api/data`)
4. User-Agent nedir? Otomatize araç mı yoksa normal tarayıcı mı?

> **SINAV İPUCU:** SQL injection ve XSS, OWASP Top 10'da ilk sıralardadır.
>
> Wireshark'ta URL parametrelerini okuyarak bu saldırıları tespit edebilirsin.

## Hızlı Referans - HTTP Filtreleri

```text
# Tüm HTTP
http

# Sadece istekler
http.request

# Sadece response'lar
http.response

# Belirli bir method
http.request.method == "GET"
http.request.method == "POST"
http.request.method == "PUT"

# Belirli URL
http.request.uri contains "api"
http.request.uri == "/secret"

# Belirli status code
http.response.code == 200
http.response.code == 403
http.response.code == 404

# Header içere göre
http contains "password"
http contains "admin"
http.user_agent contains "curl"

# Content-Type
http.content_type contains "json"
http.content_type contains "html"
```

## Alıştırma 10: Follow > HTTP Stream ve Statistics > HTTP

### Follow HTTP Stream:

TCP Stream yerine HTTP Stream kullanmak daha okunabilir sonuç verir:

1. Bir HTTP paketine sağ tıkla
2. Follow > HTTP Stream
3. İstemci (kırmızı) ve sunucu (mavi) ayırarak tam HTTP konuşmasını gösterir
4. "Show data as" ile raw, UTF-8 veya ASCII seç

### Statistics > HTTP > Requests:

1. Statistics > HTTP > Requests
2. Tüm HTTP metodlarını ve URL'leri listeler
3. Hangi URL'ye kaç istek gittiğini gösterir

### Statistics > HTTP > Packet Counter:

1. Statistics > HTTP > Packet Counter
2. HTTP response code'larına göre paket sayısını gösterir
3. 200, 302, 403, 404 kaçar tane var?

> **SINAV İPUCU:** Statistics > HTTP > Requests ile hangi URL'lere erişildiğini tek seferde görebilirsin.
>
> Forensic analizde çok kullanışlıdır.

## Sınav Soruları (Çöz)

1. HTTP GET ile POST arasındaki fark Wireshark'ta nasıl görünür?
2. Bir web sitesine giriş yapıldığında kullanıcı adı ve şifre HTTP'de nasıl görünür? Bul ve yaz.
3. 302 redirect sonrası istemci nereye yönlendirildi?
4. En büyük HTTP response body kaç byte? Hangi URL?
5. Server header'ına göre web sunucu ne?
6. HTTP Basic auth ile gönderilen kullanıcı adı ve şifre nedir (base64 çözerek kanıtla)?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. GET: URL'de parametre, body yok. POST: Body'de veri (username=admin&password=secret123 gibi). Wireshark'ta POST body açıkça görünür.
2. username=admin, password=secret123 (POST /auth body'sinde cleartext)
3. Location: http://172.50.2.10/ (ana sayfaya)
4. 3655 byte, `/large` endpoint'inden (text/plain).
5. nginx/1.27.5. Server header'ında görülür.
6. `kame:hameha` — `Authorization: Basic a2FtZTpoYW1laGE=` → `echo a2FtZTpoYW1laGE= | base64 -d`. (Filtre: `http.authbasic`)

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!