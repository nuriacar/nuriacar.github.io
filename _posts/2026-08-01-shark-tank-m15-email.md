---
layout: post
title:  "shark-tank - m15: Email Protokol Analizi (SMTP/POP/IMAP)"
date:   2026-08-01 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 15: Email Protokol Analizi (SMTP/POP/IMAP)

**Neden?** Şirket çalışanlarına şüpheli emailler geliyor. Kaynak doğrulanamıyor: Email spoofing olabilir. Email protokolleri (SMTP, POP3, IMAP) şifresiz çalışır. Saldırgan SMTP trafiğini izleyerek email içeriğini, ekleri, kullanıcı adlarını ve şifreleri okuyabilir. SMTP relay (spam gönderme), email spoofing (sahte gönderici), open relay abuse, spear phishing kampanyaları SMTP analiziyle tespit edilir. Bu modülde, email trafiğini analiz ederek phishing kampanyasını tespit etmeyi öğreneceksin.

**Görev:** Email protokollerini analiz et. SMTP, POP3 ve IMAP trafiğini Wireshark'ta incele.

**Öğrenim Hedefleri:**
- SMTP komutlarını (EHLO, MAIL FROM, RCPT TO, DATA) ve email gönderme sürecini anlamak
- POP3 (USER/PASS, STAT, LIST, RETR) ve IMAP (LOGIN, SELECT, FETCH) oturumlarını analiz edebilmek
- Cleartext email içeriğini ve credential'ları Wireshark'ta okuyabilmek
- SMTP relay ve email spoofing tespiti yapabilmek
- STARTTLS öncesi şifresiz authentication'ı tanımak

## Terimler

| Terim | Açıklama |
|-------|----------|
| **SMTP** | Simple Mail Transfer Protocol: Email göndermek için kullanılan protokol. Port 25 (sunucular arası), 587 (submission/istemci gönderimi) veya 465 (TLS şifreli) kullanır. Bir SMTP oturumu şu adımları izler: İstemci EHLO ile tanıtım yapar, sunucu desteklediği özellikleri listeler (AUTH, PIPELINING vb.), istemci MAIL FROM ile göndereni ve RCPT TO ile alıcıyı belirtir, DATA komutundan sonra email gövdesini gönderir ve nokta (.) ile bitirir. Tüm bu komutlar ve email içeriği cleartext olarak iletilir; STARTTLS kullanılmazsa Wireshark ile her şey açıkça görülebilir. |
| **POP3** | Post Office Protocol version 3: Email indirmek için kullanılan protokol. Port 110 (cleartext) veya 995 (TLS şifreli) kullanır. İstemci sunucuya bağlanır, USER ve PASS komutlarıyla giriş yapar (her ikisi de cleartext), STAT ile kaç mesaj olduğunu kontrol eder, LIST ile mesaj listesini alır ve RETR ile mesajları indirir. POP3'ün varsayılan davranışı, mesajları istemciye indirdikten sonra sunucudan silmektir: Bu yüzden tek cihazdan email okunan senaryolar için uygundur. Birden fazla cihazdan (telefon, bilgisayar, tablet) aynı mailbox'a erişmek için IMAP tercih edilir. |
| **IMAP** | Internet Message Access Protocol: Email'leri sunucuda tutarak birden fazla cihazla senkronize eden protokol. Port 143 (cleartext) veya 993 (TLS şifreli) kullanır. POP3'ten farkı, mesajları istemciye indirip silmek yerine sunucuda saklamasıdır. İstemci LOGIN ile giriş yapar (kullanıcı adı ve şifre cleartext), SELECT ile bir mailbox (örn. INBOX) seçer, FETCH ile mesajları çeker. IMAP stateful bir protokoldür: Oturum boyunca durum bilgisi (hangi mailbox açık, hangi mesajlar okundu) tutulur. Birden fazla cihazdan aynı email hesabına erişildiğinde IMAP, tüm cihazlarda senkronize görünüm sağlar. |
| **TCP** | Transmission Control Protocol: İnternetin güvenilir ve sıralı veri iletimini sağlayan protokol. Veriyi göndermeden önce alıcıyla bağlantı kurar (3-way handshake), gönderdiği her paket için onay (ACK) bekler ve onay gelmeyen paketleri yeniden gönderir (retransmission). Bu mekanizmalar sayesinde veri kaybı olmadan ve gönderim sırasında bozulmadan teslim edilir. Web (HTTP), email (SMTP), dosya transferi (FTP) gibi kritik işlemlerin tamamı TCP üzerinden çalışır. Bağlantı kurma ve onay bekleme yükü nedeniyle UDP'den yavaştır, ama güvenilirlik gerektiğinde tek seçenektir. |
| **cleartext** | Verinin hiçbir şifreleme uygulanmadan, olduğu gibi (düz metin) iletilmesi. HTTP, FTP, Telnet, SMTP cleartext protokollerdir: Ağ trafiğini dinleyen biri (Wireshark, tcpdump) şifreler, mesaj içerikleri ve kişisel verileri açıkça görebilir. HTTPS (HTTP + TLS), veriyi şifreleyerek bu sorunu çözer. Cleartext trafiğin güvenlik riski, Wireshark gibi araçlarla analiz yapmayı da kolaylaştırır: Bu yüzden bu laboratuvarda HTTP kullanılarak tüm trafiğin paket seviyesinde görülebilmesi sağlanmıştır. |
| **base64** | İkili (binary) veriyi ASCII metin formatına çeviren kodlama yöntemi. Email protokollerinde özellikle SMTP AUTH LOGIN'de kullanıcı adı ve şifreleri taşımak için kullanılır. Base64 şifreleme DEĞİL, sadece kodlamadır: Herhangi bir gizlilik sağlamaz. `echo "YmFzZTY0" \| base64 -d` komutuyla anında geri çözülebilir. Bu yüzden Wireshark'ta base64 kodlu bir alan gördüğünde, içindeki veriyi tek komutla decode edebilirsin. Email ekleri (attachment) da base64 formatında gönderilir çünkü SMTP sadece metin iletebilir. |
| **Follow TCP Stream** | Wireshark'ın bir TCP bağlantısındaki tüm veriyi baştan sona tek pencerede gösteren özelliği. Bir HTTP oturumunu, bir FTP transferini veya bir email gönderimini tam olarak görmek için kullanılır. Paket listesindeki herhangi bir pakete sağ tıklayıp "Follow > TCP Stream" seçilerek açılır. İstemcinin gönderdiği veri (request) ve sunucunun yanıtı (response) farklı renklerle ayrılarak görüntülenir. Sınavda credential sızıntısı, SQL injection payload'ı veya email içeriği gibi verileri hızlıca okumak için en kullanışlı araçtır. |

## Teori

Email iletişimi üç ana protokol üzerinden yürür:

- **SMTP (Simple Mail Transfer Protocol):** Port 25/587/465, email gönderme protokolü. Mail client'tan mail server'a veya server'dan server'a iletimi sağlar.
- **POP3 (Post Office Protocol v3):** Port 110/995, email indirme protokolü. Server'dan client'a email çeker ve varsayılan olarak server'dan siler.
- **IMAP (Internet Message Access Protocol):** Port 143/993, email senkronizasyon protokolü. Email server'da tutulur, client ile senkronize edilir. Silinmez.
- **Auth:** SMTP AUTH (LOGIN/PLAIN), POP3 USER/PASS, IMAP LOGIN. Hepsi cleartext (STARTTLS olmadan).
- **SMTP komutları:** EHLO, MAIL FROM, RCPT TO, DATA, QUIT
- **POP3 komutları:** USER, PASS, STAT, LIST, RETR, DELE, QUIT
- **IMAP komutları:** LOGIN, SELECT, FETCH, LOGOUT
- **Hepsi cleartext!** (STARTTLS veya SSL/TLS olmadan tüm içerik açık)

### Email Protokol Karşılaştırma Tablosu

| Özellik | SMTP | POP3 | IMAP |
|---------|------|------|------|
| **Port (cleartext)** | 25, 587 | 110 | 143 |
| **Port (şifreli)** | 465 (SMTPS), 587 (STARTTLS) | 995 (POP3S) | 993 (IMAPS) |
| **Yön** | Client → Server, Server → Server | Server → Client | Server ↔ Client |
| **İşlev** | Email gönderme | Email indirme | Email senkronizasyonu |
| **Davranış** | Email'i iletir | Email'i indirir ve siler | Email'i server'da tutar |
| **Auth** | SMTP AUTH (LOGIN/PLAIN) | USER/PASS | LOGIN |
| **Durum** | Stateless (her bağlantı bağımsız) | Stateful (oturum) | Stateful (oturum) |
| **Şifreleme** | STARTTLS veya SSL | STARTTLS veya SSL | STARTTLS veya SSL |
| **Wireshark filtresi** | `smtp` | `pop` | `imap` |

### SMTP Komut/Response Tablosu

| Komut | Açıklama | Örnek |
|-------|----------|-------|
| **EHLO** | Genişletilmiş tanıtım (hostname ile) | `EHLO shark-tank-client` |
| **MAIL FROM** | Gönderen adresini belirtir | `MAIL FROM:<kullanici@shark-tank.local>` |
| **RCPT TO** | Alıcı adresini belirtir | `RCPT TO:<destek@shark-tank.local>` |
| **DATA** | Email gövdesini başlatır (sonu: `.`) | `DATA` |
| **AUTH LOGIN** | Kimlik doğrulama (base64) | `AUTH LOGIN` |
| **AUTH PLAIN** | Kimlik doğrulama (base64) | `AUTH PLAIN AGVtYWlsAHBhc3N3b3Jk` |
| **QUIT** | Bağlantıyı kapatır | `QUIT` |
| **RSET** | Mevcut işlemi sıfırlar | `RSET` |
| **NOOP** | Hiçbir şey yapmaz (keepalive) | `NOOP` |

### SMTP Response Kodları

| Kod | Anlamı |
|-----|--------|
| **220** | Sunucu hazır (Service Ready) |
| **221** | Kapatılıyor (Closing transmission) |
| **235** | Kimlik doğrulama başarılı |
| **250** | Tamam (OK) |
| **334** | Auth challenge (base64) |
| **354** | Data başla (Start mail input) |
| **421** | Servis kullanılamıyor |
| **452** | Yetersiz alan |
| **500** | Sözdizimi hatası |
| **530** | Kimlik doğrulama gerekli |
| **535** | Kimlik doğrulama başarısız |
| **550** | İstenen eylem reddedildi |
| **552** | Depolama alanı aşıldı |
| **553** | Geçersiz mailbox adı |

### SMTP Oturum Akışı

Bu pcap'te iki ayrı SMTP oturumu vardır:

**Oturum 1 — Mailpit (172.50.2.16:1025), kimliksiz gönderim:**

```text
CLIENT                    MAILPIT SMTP (172.50.2.16:1025)
  |<-- 220 smtp Mailpit ESMTP Service ready ---|  Sunucu hazır
  |--- EHLO shark-tank-client ---------------->|  Client tanıtımı
  |<-- 250-smtp greets shark-tank-client ------|  Sunucu yanıtı
  |    250-SIZE 0 -----------------------------|  Yetenekler
  |    250 ENHANCEDSTATUSCODES ----------------|
  |--- MAIL FROM:<kullanici@shark-tank.local>->|  Gönderen
  |<-- 250 2.1.0 Ok -------------------------->|  Tamam
  |--- RCPT TO:<destek@shark-tank.local> ----->|  Alıcı
  |<-- 250 2.1.5 Ok -------------------------->|  Tamam
  |--- DATA ---------------------------------->|  Gövde başla
  |<-- 354 Start mail input -------------------|  Gövdeyi bekliyorum
  |--- From: kullanici@shark-tank.local ------>|  Email header
  |--- To: destek@shark-tank.local ---------->-|
  |--- Subject: Aylık Değerlendirme Raporu --->|
  |--- Email body content -------------------->|  Email gövde
  |--- . ------------------------------------>-|  Gövde sonu (nokta)
  |<-- 250 Ok: queued ------------------------>|  Kuyruğa alındı
  |--- QUIT --------------------------------->-|  Çıkış
  |<-- 221 Bye --------------------------------|  Hoşça kal
```

**Oturum 2 — Dovecot submission (172.50.2.18:587), AUTH LOGIN'li:**

```text
CLIENT                    DOVECOT SUBMISSION (172.50.2.18:587)
  |<-- 220 Dovecot ready ---------|    Sunucu hazır
  |--- EHLO shark-tank-client --->|    Client tanıtımı
  |<-- 250-imap ------------------|    Sunucu yetenekleri
  |    (AUTH PLAIN LOGIN, SIZE...)|
  |--- AUTH LOGIN --------------->|    Auth başlat
  |<-- 334 VXNlcm5hbWU6 ----------|    "Username:" (base64)
  |--- a3VsbGFuaWNp ------------->|    Username: kullanici (base64)
  |<-- 334 UGFzc3dvcmQ6 ----------|    "Password:" (base64)
  |--- c2VjcmV0MTIz ------------->|    Password: secret123 (base64)
  |<-- 235 OK --------------------|    Auth başarılı
  (ardından MAIL FROM / RCPT TO / DATA ile aynı gönderim akışı)
```

> **Not:** Mailpit oturumu AUTH istemez (test sunucusudur); Dovecot submission oturumu AUTH LOGIN zorunludur. İkisini karşılaştırmak, "hangi sunucuda kimlik doğrulama gerekiyor?" sorusu için iyi alıştırmadır.

### POP3 Komut/Response Tablosu

| Komut | Açıklama | Response |
|-------|----------|----------|
| **USER** | Kullanıcı adını gönderir | `+OK` veya `-ERR` |
| **PASS** | Şifreyi gönderir (cleartext!) | `+OK` veya `-ERR` |
| **STAT** | Mailbox istatistikleri | `+OK mesaj_sayısı toplam_byte` |
| **LIST** | Mesaj listesi | `+OK` + mesaj numaraları ve boyutları |
| **RETR** | Mesajı indirir | `+OK` + mesaj içeriği |
| **DELE** | Mesajı siler | `+OK` |
| **RSET** | Silme işlemlerini geri alır | `+OK` |
| **QUIT** | Oturumu kapatır | `+OK` |

### IMAP Komut/Response Tablosu

| Komut | Açıklama | Response |
|-------|----------|----------|
| **LOGIN** | Kullanıcı adı ve şifre (cleartext!) | `OK LOGIN completed` |
| **SELECT** | Mailbox seçer (INBOX vb.) | `OK [EXISTS] N` |
| **FETCH** | Mesajı veya mesaj parçasını çeker | `OK FETCH completed` |
| **LIST** | Mailbox listesini gösterir | `* LIST ...` |
| **SEARCH** | Mesaj arar | `* SEARCH 1 2 3` |
| **LOGOUT** | Oturumu kapatır | `OK LOGOUT completed` |

> **İstihbarat İşaretleri, Email güvenlik açısından kritik:**
>
> - SMTP cleartext = credential sızıntısı. MAIL FROM ve RCPT TO Wireshark'ta görünür
> - Email spoofing: MAIL FROM manipüle edilebilir. Gönderen adresi sahte olabilir
> - Phishing tespiti: URL'ler email body'de açık. Zararlı bağlantılar tespit edilebilir
> - SMTP relay abuse: Spam gönderimi için açık relay kullanımı
> - Attachment analizi: Wireshark'ta base64 attachment decode edilebilir
> - POP3 USER/PASS ve IMAP LOGIN tamamen cleartext. Şifreler paketlerde açık

## Hazırlık

```sh
# Ortam çalışıyor olmalı. Değilse:
./scripts/start.sh

# Email trafiği üret:
./scripts/generate-traffic.sh email

# Pcap dosyasını aç:
# macOS: open -a Wireshark module-15-email.pcap
# Linux: wireshark module-15-email.pcap &
# Windows: start wireshark module-15-email.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

## Alıştırmalar

### Alıştırma 1: SMTP Handshake

### Filtre:
```text
smtp
```

### Ne Yapmalısın?
1. Filtreyi yazıp Enter'a bas
2. İlk SMTP paketini bul (sunucudan gelen 220 response)
3. **Simple Mail Transfer Protocol** katmanını genişlet:

```text
 v Simple Mail Transfer Protocol
     Response code: 220                     <-- Sunucu hazır
     Response parameter: smtp Mailpit ESMTP Service ready
```

4. EHLO paketini bul:

```text
 v Simple Mail Transfer Protocol
     Request command: EHLO                      <-- Client tanıtımı
     Request parameter: shark-tank-client       <-- Client hostname
```

5. Sunucunun EHLO response'unu bul (250):

```text
 v Simple Mail Transfer Protocol
     Response code: 250                     <-- Tamam
     Response parameter: smtp greets shark-tank-client
     250-SIZE 0                             <-- Yetenekler
     250 ENHANCEDSTATUSCODES ----------------
```

### Tespit Et:
- Client hostname nedir? (shark-tank-client)
- Mailpit oturumunda 250 yetenek listesi ne? (SIZE 0, ENHANCEDSTATUSCODES — AUTH yok!)
- Sunucu yazılımı ne? (Mailpit, 220 banner'ında; AUTH istemeyen test sunucusu)

> **SINAV İPUCU:** EHLO (Extended HELO), HELO'nun genişletilmiş versiyonudur.
>
> EHLO sunucunun yeteneklerini (AUTH, PIPELINING, SIZE vb.) listelemesini sağlar. HELO'da bu liste yoktur.

### Alıştırma 2: Email Gönderme Analizi

### Filtre:
```text
smtp.req.command == "MAIL" || smtp.req.command == "RCPT"
```

### MAIL FROM Paketi:
```text
 v Simple Mail Transfer Protocol
     Request command: MAIL                  <-- Gönderen belirt
      Request parameter: FROM:<kullanici@shark-tank.local>
```

### RCPT TO Paketi:
```text
 v Simple Mail Transfer Protocol
     Request command: RCPT                  <-- Alıcı belirt
      Request parameter: TO:<destek@shark-tank.local>
```

> **Not:** İkinci email'de MAIL FROM `<destek@shark-tank.local>` ve RCPT TO `<kullanici@shark-tank.local>` olacak.

### DATA Bölümü:
### Filtre:
```text
smtp.req.command == "DATA"
```

1. DATA komutunu ve ardından gelen paketleri incele
2. Email header'larını ve body'yi bul:

```text
From: kullanici@shark-tank.local
To: destek@shark-tank.local
Subject: Aylık Değerlendirme Raporu
Date: ...

Aylik network degerlendirme raporu ektedir.
Detaylar icin guvenli kanal kullanin.
```

### Tespit Et:
- İlk email'de gönderen (MAIL FROM) ve alıcı (RCPT TO) kim?
- İkinci email'de gönderen (MAIL FROM) ve alıcı (RCPT TO) kim?
- Subject (Konu) ne?
- Email body'de ne yazıyor?

> **SINAV İPUCU:** SMTP'de email içeriği TAMAMEN cleartext gider. MAIL FROM, RCPT TO, Subject, Body hepsi Wireshark'ta okunabilir.
>
> Bu, güvenlik açısından çok kritik bir zafiyettir.

### Alıştırma 3: SMTP Auth

### Filtre:
```text
smtp.req.command == "AUTH"
```

### AUTH LOGIN Akışı:
1. Client: `AUTH LOGIN`
2. Server: `334 VXNlcm5hbWU6` (base64: "Username:")
3. Client: `a3VsbGFuaWNp` (base64 encoded username)
4. Server: `334 UGFzc3dvcmQ6` (base64: "Password:")
5. Client: `c2VjcmV0MTIz` (base64 encoded password)
6. Server: `235 Authentication successful`

### Base64 Decode:

```sh
# Username decode:
echo "a3VsbGFuaWNp" | base64 -d
# Sonuç: kullanici

# Password decode:
echo "c2VjcmV0MTIz" | base64 -d
# Sonuç: secret123

# Sunucunun challenge'ını decode et:
echo "VXNlcm5hbWU6" | base64 -d
# Sonuç: Username:

echo "UGFzc3dvcmQ6" | base64 -d
# Sonuç: Password:
```

> **SINAV İPUCU:** SMTP AUTH LOGIN, credentials'ı base64 ile kodlar. Ama base64 şifreleme DEĞİLDİR! Sadece kodlamadır. `echo "BASE64" \| base64 -d` ile anında decode edilir.
>
> Sınavda "SMTP AUTH güvenli mi?" sorusuna HAYIR, base64 şifreleme değil kodlamadır.

### Alıştırma 4: POP3 Analizi

### Filtre:
```text
pop
```

### POP3 Oturumu:
1. Sunucu hazır:
```text
 v Post Office Protocol
     +OK Dovecot ready.
```

2. USER komutu:
```text
 v Post Office Protocol
     Request command: USER
      Request parameter: kullanici      <-- KULLANICI ADI (açık metin)
```

3. PASS komutu:
```text
 v Post Office Protocol
     Request command: PASS
     Request parameter: secret123              <-- ŞİFRE (cleartext!)
```

4. STAT komutu:
```text
 v Post Office Protocol
     +OK 2 379                                 <-- 2 mesaj, 379 byte
```

5. LIST komutu:
```text
 v Post Office Protocol
     +OK 2 messages:
     1 227
     2 152
     .
```

6. RETR komutu:
```text
 v Post Office Protocol
     Request command: RETR
     Request parameter: 1              <-- 1 numaralı mesajı indir
```

7. QUIT:
```text
 v Post Office Protocol
     Request command: QUIT
     +OK Bye
```

### Tespit Et:
- POP3 kullanıcı adı ve şifre nedir?
- Mailbox'ta kaç mesaj var?
- RETR ile hangi mesaj indirildi?

> **SINAV İPUCU:** POP3'te USER ve PASS komutları tamamen cleartext gider. SMTP AUTH gibi base64 bile yoktur.
>
> Doğrudan açık metin olarak görünür.

### Alıştırma 5: IMAP Analizi

### Filtre:
```text
imap
```

### IMAP Oturumu:
1. Sunucu hazır:
```text
 v Internet Message Access Protocol
     * OK [CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID
       ENABLE IDLE LITERAL+ AUTH=PLAIN AUTH=LOGIN] Dovecot ready.
```

2. LOGIN komutu:
```text
 v Internet Message Access Protocol
     Request tag: a1
       Request: LOGIN kullanici secret123     <-- CLEARTEXT!
     Response: a1 OK [CAPABILITY IMAP4rev1 ...] Logged in
```

3. SELECT INBOX:
```text
 v Internet Message Access Protocol
     Request tag: a2
     Request: SELECT INBOX
     Response: a2 OK [READ-WRITE] Select completed
```

4. FETCH:
```text
 v Internet Message Access Protocol
     Request tag: a3
     Request: FETCH 1 (BODY[])
     (yanıtta 1 numaralı mesajın tamamı gelir: From/To/Subject + gövde)
     Response: a3 OK ... FETCH completed
```

5. LOGOUT:
```text
 v Internet Message Access Protocol
     Request tag: a4
     Request: LOGOUT
     Response: * BYE Bye
     Response: a4 OK LOGOUT completed
```

### Tespit Et:
- IMAP LOGIN'de kullanıcı adı ve şifre nedir?
- INBOX'ta kaç mesaj var?
- FETCH ile hangi mesaj çekildi?

> **SINAV İPUCU:** IMAP LOGIN komutu credentials'ı cleartext olarak gönderir. SMTP AUTH gibi base64 bile yoktur.
>
> Ayrıca IMAP, POP3'ten farklı olarak email'leri server'da tutar ve senkronize eder. POP3 indirir ve siler.

### Alıştırma 6: Follow TCP Stream ile Email Okuma

1. Herhangi bir SMTP paketine **sağ tıkla**
2. Follow > TCP Stream
3. Yeni pencerede TÜM SMTP konuşmasını göreceksin:

```text
220 Dovecot ready                       <-- SUNUCU (Dovecot submission)
EHLO shark-tank-client                  <-- CLIENT
250-imap                                <-- SUNUCU
250-AUTH PLAIN LOGIN
250 PIPELINING
AUTH LOGIN                              <-- CLIENT
334 VXNlcm5hbWU6                        <-- SUNUCU
a3VsbGFuaWNp                            <-- CLIENT (base64 username)
334 UGFzc3dvcmQ6                        <-- SUNUCU
c2VjcmV0MTIz                            <-- CLIENT (base64 password)
235 2.7.0 Logged in.                    <-- SUNUCU
MAIL FROM:<kullanici@shark-tank.local>  <-- CLIENT
250 2.1.0 Ok                            <-- SUNUCU
RCPT TO:<destek@shark-tank.local>       <-- CLIENT
250 2.1.5 Ok                            <-- SUNUCU
DATA                                    <-- CLIENT
354 OK                                  <-- SUNUCU
From: kullanici@shark-tank.local        <-- CLIENT (email başlıyor)
To: destek@shark-tank.local
Subject: Auth Test
Date: ...

Bu email AUTH LOGIN ile gonderildi.
.                                       <-- CLIENT (email sonu)
250 2.0.0 Ok: queued as ...             <-- SUNUCU
QUIT                                    <-- CLIENT
221 2.0.0 Bye                           <-- SUNUCU
```

4. "Show data as" ile ASCII veya raw seçebilirsin
5. Tüm email içeriğini tek seferde oku

### Follow TCP Stream ile POP3 Okuma:

Aynı yöntemi POP3 trafiğine uygula:

```text
+OK Dovecot ready                                   <-- SUNUCU
USER kullanici                                      <-- CLIENT
+OK                                                 <-- SUNUCU
PASS secret123                                      <-- CLIENT
+OK Logged in.                                      <-- SUNUCU
STAT                                                <-- CLIENT
+OK 2 379                                           <-- SUNUCU
LIST                                                <-- CLIENT
+OK 2 messages:
1 227
2 152
.
RETR 1                                              <-- CLIENT
+OK 227 octets
From: kullanici@shark-tank.local
To: destek@shark-tank.local
Subject: Aylık Değerlendirme Raporu
...
.
QUIT                                                <-- CLIENT
+OK Bye                                             <-- SUNUCU
```

> **SINAV İPUCU:** Follow TCP Stream ile bir email oturumunun tamamını görebilirsin. Bu, sınavda hangi email'in gönderildiğini, hangi credentials'ın kullanıldığını bulmak için EN ÖNEMLİ araçtır.
>
> SMTP, POP3 ve IMAP için ayrı ayrı uygulayabilirsin.

### Alıştırma 7: Email Attachment'ını Kurtarma (MIME + base64)

Phishing mail'leri ikinci bir "silah" taşır: Ek dosya. pcap'te ekli bir
mail var — göndereni `phantom@shark-tank.local`, konusu "Fatura ve rapor
ektedir (acil)". Hem SMTP tarafında (gönderim) hem IMAP tarafında
(`FETCH 2 (BODY[])`) yakalanabilir.

1. MIME yapısını bul:
   ```text
   tcp contains "multipart/mixed"
   ```
   Mail, `--ST-BOUNDARY-42` ile ayrılmış iki parçadan oluşur: metin ve
   `gizli-ek.bin` adlı, `Content-Transfer-Encoding: base64` ile kodlanmış
   binary ek.
2. Ekli mailin stream'ini aç: Bulduğun pakete sağ tık → **Follow > TCP
   Stream**. Base64 bloğunu kopyala.
3. Terminalde çöz:
   ```sh
   echo "<base64-bloğu>" | base64 -d > ek.bin
   shasum -a 256 ek.bin   # bütünlük kontrolü
   xxd ek.bin | head      # içerik incelemesi
   ```
4. Alternatif — Wireshark'ın otomatik yolu: **File > Export Objects >
   IMF**. Liste, pcap'teki mail gövdelerini (eml) dosya olarak verir;
   eml'yi bir mail istemcisiyle açınca ek görünür.

**Analist soruları:**
- Ekin gerçek dosya adı ne? (`Content-Disposition: attachment; filename=...`)
- Ek 0-127 arası döngüsel byte'lar içeriyor — muhtemelen şifreli/sıkıştırılmış payload. Binary ek + "acil" konulu cleartext mail = phishing göstergesi.

> **SINAV İPUCU:** "Attachment'ı pcap'ten nasıl çıkarırsın?" → Follow TCP
> Stream + base64 -d, ya da Export Objects > IMF. Dosya adı ve MIME tipi
> header satırlarında cleartext durur.

### Sender Sahteciliği Kontrolü: SPF, DKIM, DMARC

Email spoofing'in cevabı üç başlıkta gizlidir (pcap'te bunlar yoktur —
lab maili bunları taşımıyor; gerçeğe uygun olarak header'larda ARARLAR):

| Mekanizma | Ne Yapar | Wireshark'ta Nerede |
|-----------|----------|---------------------|
| **SPF** | Gönderen IP'si, alan adının yetkili sunucularından mı? (DNS TXT kaydı) | Alıcının `Received-SPF:` başlığı: `pass`/`fail`/`softfail` |
| **DKIM** | Mail gövdesi, gönderen alan adının anahtarıyla imzalı mı? | `DKIM-Signature:` başlığı; doğrulama sonucu `Authentication-Results:` içinde |
| **DMARC** | SPF/DKIM başarısızsa ne yapılsın? (quarantine/reject) | `DMARC` sonuç satırı `Authentication-Results:` içinde |

`MAIL FROM:<phantom@...>` ile `From:` başlığı uyuşmuyorsa ve
`Authentication-Results: spf=fail` varsa → sahte gönderen. Spoofing
tespiti Modül 28'deki forensics akışında tekrar karşına çıkacak.

> **SINAV İPUCU:** "Bu email sahte mi?" sorusunda önce Received-SPF ve
> Authentication-Results başlıklarını ara; ikisi de yoksa güvenli sayma.

### STARTTLS: Fırsat Anındaki Şifreleme

SMTP (587), IMAP (143) ve POP3 (110) cleartext başlar; istemci `STARTTLS`
komutuyla bağlantıyı TLS'e yükseltebilir. Yükseltme anından sonra trafik
şifrelidir — Wireshark artık sadece TLS kayıtları görür. Bu lab'ta
dovecot `ssl = no` ile çalıştığı için tüm oturum cleartext'tir (eğitim
amacıyla). Gerçek hayatta `imap` filtresinde aniden `tls` görmek,
STARTTLS geçişini işaret eder: `ssl.handshake.type == 1` ile ClientHello'
yu yakalayınca geçiş paketini bulabilirsin.

> **SINAV İPUCU:** "POP3/IMAP şifreli mi?" → 993/995 portuna bak
> (IMAPS/POP3S her zaman TLS); 143/110 + STARTTLS = opsiyonel;
> 143/110 + cleartext credential = açık sızıntı (bu lab'ın durumu).

## Filtre Referansı

| Filtre | Açıklama |
|--------|----------|
| `smtp` | Tüm SMTP trafiği |
| `smtp.req.command == "EHLO"` | EHLO komutu (client tanıtımı) |
| `smtp.req.command == "MAIL"` | MAIL FROM (gönderen) |
| `smtp.req.command == "RCPT"` | RCPT TO (alıcı) |
| `smtp.req.command == "DATA"` | DATA (email gövdesi başlangıcı) |
| `smtp.req.command == "AUTH"` | Authentication başlatma |
| `smtp.req.command == "QUIT"` | Bağlantı kapatma |
| `smtp.response.code == 250` | OK response |
| `smtp.response.code == 235` | Auth başarılı |
| `smtp.response.code == 354` | Data başla |
| `smtp.response.code == 220` | Sunucu hazır |
| `pop` | POP3 trafiği |
| `pop.request.command == "USER"` | POP3 kullanıcı adı |
| `pop.request.command == "PASS"` | POP3 şifre |
| `pop.request.command == "RETR"` | POP3 mesaj indirme |
| `imap` | IMAP trafiği |
| `imap.request == "LOGIN"` | IMAP login komutu |
| `imap.request == "SELECT"` | IMAP mailbox seçme |
| `imap.request == "FETCH"` | IMAP mesaj çekme |
| `tcp.port == 25 \|\| tcp.port == 587` | SMTP portları |
| `tcp.port == 110` | POP3 portu |
| `tcp.port == 143` | IMAP portu |
| `tcp.port == 1025` | Mailpit SMTP portu (submission) |
| `tcp contains "password"` | Paket içinde "password" arama |
| `tcp contains "PASS"` | PASS komutu arama |

### Bileşik Filtreler:

```text
# Tüm email protokolleri:
smtp || pop || imap

# Sadece authentication:
smtp.req.command == "AUTH" ||
pop.request.command == "PASS" ||
imap.request == "LOGIN"

# Sadece email gönderme:
smtp.req.command == "MAIL" || smtp.req.command == "RCPT"

# POP3 credential sızıntısı:
pop.request.command == "USER" || pop.request.command == "PASS"

# IMAP login:
imap.request contains "LOGIN"

# Belirli bir sunucuya giden SMTP:
smtp && ip.dst == 172.50.2.16
```

> **SINAV İPUCU:** SMTP cleartext! MAIL FROM ve RCPT TO Wireshark'ta görünür. AUTH LOGIN base64 ile kodlanır ama decode etmek kolay.
>
> Sınavda "hangi protokolde şifre görünür?" sorusuna SMTP/POP3/IMAP da dahil.

> **İstihbarat İşaretleri, Email güvenlik açısından kritik:**
>
> - SMTP cleartext = credential sızıntısı. AUTH LOGIN base64, POP3 USER/PASS ve IMAP LOGIN tamamen açık
> - Email spoofing: MAIL FROM manipüle edilebilir. Gönderen adresi doğrulanmazsa sahte email mümkün
> - Phishing tespiti: URL'ler email body'de açık. Zararlı bağlantılar Wireshark'ta görülebilir
> - SMTP relay abuse: Açık relay sunucusu spam gönderimi için kullanılabilir
> - Attachment analizi: Wireshark'ta base64 attachment decode edilebilir. Zararlı dosya tespiti mümkün

## Sınav Soruları (Çöz)

1. SMTP hangi port'u kullanır? Ne için kullanılır?
2. MAIL FROM ne işe yarar? Wireshark'ta görünür mü?
3. Email protokolleri şifreli mi? Hangi koşulda şifrelenir?
4. POP3 ile IMAP arasındaki fark nedir?
5. Wireshark'ta email içeriği görülür mü? Hangi araçla tam email okunabilir?
6. SMTP AUTH LOGIN'de base64 kodlama güvenlik sağlar mı? Neden?
7. POP3'te şifre nasıl gönderilir? SMTP AUTH ile arasındaki fark nedir?
8. Follow TCP Stream ile bir SMTP oturumunu oku. Gönderen, alıcı ve subject nedir?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. Port 25 (MTA), port 587 (submission), port 465 (SMTPS). Email gönderme protokolüdür. Client'tan server'a veya server'dan server'a email iletir.
2. Gönderen email adresini belirtir. Evet, Wireshark'ta tamamen cleartext olarak görünür. `smtp.req.command == "MAIL"` filtresi ile bulunur.
3. Hayır, STARTTLS veya SSL/TLS olmadan tümü cleartext. SMTP, POP3, IMAP üçü de şifresiz çalışır. STARTTLS ile TLS upgrade yapılabilir veya SSL portu (465, 995, 993) kullanılabilir.
4. POP3 email'i indirir ve server'dan siler (varsayılan). IMAP email'i server'da tutar ve senkronize eder. POP3 offline okuma için, IMAP birden fazla cihazdan erişim için uygundur.
5. Evet, cleartext protokollerde tüm email içeriği görünür. Follow TCP Stream (sağ tıkla > Follow > TCP Stream) ile tam SMTP/POP3/IMAP oturumu okunabilir.
6. Hayır. Base64 şifreleme değil, kodlamadır. `echo "BASE64" \| base64 -d` ile anında decode edilir. Güvenlik amacı yoktur, sadece binary veriyi text formatında taşımak için kullanılır.
7. POP3'te PASS komutu ile şifre doğrudan cleartext gönderilir. SMTP AUTH LOGIN'de ise base64 kodlanmış gönderilir. İkisi de güvensizdir ama POP3 daha da açık çünkü hiçbir kodlama bile yoktur.
8. Follow TCP Stream açıldığında: MAIL FROM'dan gönderen adresi, RCPT TO'dan alıcı adresi, DATA bölümünden Subject ve email body'si okunabilir. Tüm içerik cleartext olarak tek pencerede görünür.

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
