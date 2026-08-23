---
layout: post
title:  "shark-tank - m17: Kerberos Analizi"
date:   2026-08-03 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 17: Kerberos Analizi

**Neden?** Şirket ağında bir kullanıcının kimliğine bürünüldü ve SOC ekibi
haberi geç aldı. Windows dünyasında kimlik doğrulamanın kalbi Kerberos'tur:
Oturum açan her kullanıcı, domain denetleyicisinden bilet alır ve bu biletlerle
dosyaya, yazıcıya, veritabanına erişir. Saldırgan için Kerberos altın
madendir: Çalınan bilet parolayı gerekli kılmaz (pass-the-ticket), zayıf
şifrelemeli servis biletleri kırılabilir (Kerberoasting), yanlış saat
senkronu kovalamacaya dönüşür. Bu modülde, Kerberos akışını paket
seviyesinde okumayı ve saldırı izlerini tespit etmeyi öğreneceksin.

**Görev:** SHARK-TANK.LOCAL domaininde kimlik doğrulama trafiğini analiz et.

**Öğrenim Hedefleri:**
- Kerberos AS/TGS akışını (kinit → bilet → servis erişimi) adım adım takip
  edebilmek
- KRB-ERROR kodlarını (PREAUTH_FAILED, PREAUTH_REQUIRED) okuyabilmek
- CNameString ve SNameString alanlarından kullanıcı ve servis (SPN) çıkarabilmek
- Bilet şifreleme türlerini (etype) yorumlayabilmek
- Kerberoasting ve bilet hırsızlığı izlerini trafikte tespit edebilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **Kerberos** | MIT tarafından geliştirilen, bilet (ticket) temelli kimlik doğrulama protokolü. Kullanıcı parolası hiçbir zaman ağda düz metin taşınmaz: İstemci, paroladan türetilen anahtarla zaman damgasını şifreleyip kanıt olarak gönderir; sunucu da aynı paroladan türetilmiş anahtarla doğrular. Windows Active Directory ortamının varsayılan kimlik doğrulama protokolüdür ve TCP/UDP 88 portunda çalışır. Wireshark'ta `kerberos` filtresiyle görüntülenir. |
| **KDC (Key Distribution Center)** | Kerberos'ün merkez aktörü: Domain denetleyicisi (DC) üzerinde çalışır ve iki hizmet içerir: AS (Authentication Server, bilet verme) ve TGS (Ticket Granting Server, servis bileti verme). Tüm biletler KDC tarafından imzalanır; bu yüzden KDC'nin ele geçirilmesi tüm domain'in ele geçirilmesi demektir. |
| **TGT (Ticket Granting Ticket)** | "Bilet veren bilet": Kullanıcının AS'den ilk aldığı bilet. TGT, yalnızca TGS hizmetinin açabileceği şekilde şifrelenmiştir; istemci TGT'yi bellekte tutar ve her servis erişiminde TGS'ye sunarak servis bileti (TGS-REP) alır. Pass-the-ticket saldırısının ana hedefi budur. |
| **SPN (Service Principal Name)** | Servisin Kerberos kimliği: `servis/host` formatında yazılır (örn. `cifs/dc.shark-tank.local`, `http/web.shark-tank.local`). İstemci bir servise erişmeden önce SPN'sini TGS'ye sorar. Saldırgan, dizindeki tüm SPN'leri listeleyip her biri için bilet isteyerek servis hesabı parolalarını çevrimdışı kırabilir (Kerberoasting). |
| **etype (Encryption Type)** | Biletin şifreleme algoritması. Yaygın değerler: 18 (AES256-CTS-HMAC-SHA1-96, güçlü), 17 (AES128), 23 (RC4-HMAC, zayıf — Kerberoasting hedefi), 3 (DES, çok eski). `kerberos.etype` alanında görünür. Eski algoritmalara izin veren ortamlar down-grade saldırılarına açıktır. |
| **PA-ENC-TIMESTAMP** | İstemcinin kimlik kanıtı: Parola anahtarıyla şifrelenmiş saat damgası. KDC, saati kendi saatiyle kıyaslar (5 dakika tolerans) — saat kayması varsa KRB-ERROR 37 (clock skew) döner. Bu yüzden domain ortamlarında NTP senkronu kritiktir. |
| **realm** | Kerberos'un yönetim alanı: Kimlik doğrulamadan KDC'nin sorumlu olduğu bölge, pratikte domain adının BÜYÜK harfle yazımı (SHARK-TANK.LOCAL). Paketlerde crealm alanında taşınır; kullanıcı adı realm ile birlikte tam kimliği verir (analyst@SHARK-TANK.LOCAL). İstemci yanlış realm belirtirse KDC hata döner. |
| **AP-REQ / AP-REP** | Biletin servise sunulması: İstemci, aldığı servis biletini hedef servise (SMB2, LDAP...) Application Request içinde sunar; servis doğrulayıp yanıt verirse (AP-REP) karşılıklı kimlik tamamlanır. Kerberos'un 3. aşamasıdır ve KDC'yi içermediği için Wireshark'ta kerberos olarak değil, taşıyıcı protokolün içinde (SPNEGO/GSSAPI) görülür — modül 19 Alıştırma 1'deki Security Blob tam budur. |

## Teori

Kerberos akışı üç aşamada gerçekleşir:

```text
İstemci                   KDC (dc)                   Servis
  |                          |                         |
  |-- AS-REQ (kullanıcı) --->|   1. Kimlik kanıtı      |
  |<-- AS-REP (TGT) ---------|      (parola gerekli)   |
  |                          |                         |
  |-- TGS-REQ (TGT + SPN) -->|   2. Servis bileti      |
  |<-- TGS-REP (servis       |      (parola GEREKMEZ)  |
  |            bileti) ------|                         |
  |                          |                         |
  |-- AP-REQ (servis bileti) ------------------------->|  3. Erişim
  |<-- AP-REP -----------------------------------------|
```

Kritik nokta: TGT almak için parola kanıtı gerekir, ama TGT'yi kullanarak
servis bileti almak için parola gerekmez. Bilet çalınan bir saldırgan 2.
ve 3. aşamayı parolasız tamamlar.

### Kerberos Mesaj Tipleri (msg_type):

| msg_type | Ad | Yön | Anlamı |
|----------|-----|-----|--------|
| 10 | AS-REQ | İstemci → KDC | "Bu kullanıcıyım, TGT istiyorum" |
| 11 | AS-REP | KDC → İstemci | TGT + oturum anahtarı |
| 12 | TGS-REQ | İstemci → KDC | "TGT'm var, bu SPN için bilet istiyorum" |
| 13 | TGS-REP | KDC → İstemci | Servis bileti |
| 14 | TGS-REQ (yenileme) | İstemci → KDC | Bileti yenileme isteği |
| 30 | KRB-ERROR | KDC → İstemci | Hata kodu (bkz. tablo aşağıda) |

### Yaygın KRB-ERROR Kodları:

| Kod | Ad | Anlamı |
|-----|-----|--------|
| 24 | PREAUTH_FAILED | Parola yanlış (brute force izi!) |
| 25 | KDC_ERR_PREAUTH_REQUIRED | Ön kimlik doğrulama gerekli (normal akış) |
| 14 | KDC_ERR_ETYPE_NOSUPP | Şifreleme türü desteklenmiyor |
| 37 | CLOCK_SKEW | İstemci saati kaymış (NTP kontrolü) |
| 7 | KDC_ERR_S_PRINCIPAL_UNKNOWN | SPN yok (yanlış servis adı) |
| 10 | KDC_ERR_PRINCIPAL_UNKNOWN | Kullanıcı yok (kullanıcı keşfi izi) |

---

## Hazırlık

```sh
./scripts/generate-traffic.sh kerberos
# macOS: open -a Wireshark module-17-kerberos.pcap
# Linux: wireshark module-17-kerberos.pcap &
# Windows: start wireshark module-17-kerberos.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

Bu pcap'te analyst kullanıcısının normal girişi, yanlış parola denemesi, servis bileti alma ve saldırgan (172.50.2.200) tarafından gerçekleştirilen Kerberoasting simülasyonu bir aradadır.

---

## Alıştırma 1: AS Akışı — Yanlış ve Doğru Parola

Kullanıcı girişinin (kinit) paketlerde nasıl göründüğünü göreceksin.

### Filtre:
```text
kerberos.msg_type == 10 || kerberos.msg_type == 30
```

### Adımlar:

1. `module-17-kerberos.pcap`'i Wireshark'ta aç ve filtreyi uygula
2. Frame 4 (AS-REQ): İstemci analyst kullanıcısı için TGT istiyor
3. Frame 6 (KRB-ERROR, kod 25): KDC ön kimlik doğrulama istiyor — normal
4. Frame 14 (AS-REQ): İstemci şifreli zaman damgasıyla tekrar deniyor
5. Frame 16 (KRB-ERROR, **kod 24**): PREAUTH_FAILED — parola yanlış!
6. Frame 24-26: Yeni deneme (kod 25 normal akış)
7. Frame 34-36: Doğru parola → AS-REP (frame 36) içinde TGT verilir

### Frame 16 Paneli:

```text
v Kerberos KRB-ERROR
    pvno: 5
    msg-type: KRB-ERROR (30)
    error-code: KDC_ERR_PREAUTH_FAILED (24)
    crealm: SHARK-TANK.LOCAL
    cname: analyst                     ← Kim denedi?
```

> **SINAV İPUÇLARI:**
>
> - AS-REQ'den hemen sonra KRB-ERROR 24 = **yanlış parola** denemesi
> - Aynı cname'e art arda 24 kodları = parola tahmini (brute force)
> - KRB-ERROR 25 (PREAUTH_REQUIRED) normaldir, hata değildir
> - cname alanı kullanıcı adını, crealm domain adını verir

> **İstihbarat İşaretleri, Kerberos brute force:**
>
> - Tek kullanıcıya art arda PREAUTH_FAILED (24) hataları
> - Kaynak IP'yi `ip.src` ile tespit et, hedef her zaman KDC'dir
> - Gerçek dünyada deneme sayısı kısıtlaması yoktur: Saniyeler içinde
>   onlarca deneme paketi üretilebilir

---

## Alıştırma 2: Bileti İncele (AS-REP)

TGT'nin içeriğini ve şifreleme türünü incele.

### Filtre:
```text
kerberos.msg_type == 11
```

### Adımlar:

1. Frame 36'yı (AS-REP) aç
2. Orta panelde şu alanları bul:

```text
v Kerberos AS-REP
    crealm: SHARK-TANK.LOCAL
    cname: analyst
    v ticket
        tkt-vno: 5
        realm: SHARK-TANK.LOCAL
        sname: krbtgt/SHARK-TANK.LOCAL   ← Bu bilet TGS içindir
        etype: eTYPE-AES256-CTS-HMAC-SHA1-96 (18)
    v enc-part
        etype: eTYPE-AES256-CTS-HMAC-SHA1-96 (18)
```

3. **etype 18** = AES256: Güçlü şifreleme, modern Windows varsayılanı

### Bilet Şifreleme Türleri:

| etype | Algoritma | Güç | Not |
|-------|-----------|-----|-----|
| 18 | AES256-CTS-HMAC-SHA1-96 | Güçlü | Modern varsayılan |
| 17 | AES128-CTS-HMAC-SHA1-96 | Güçlü | Eski istemciler |
| 23 | RC4-HMAC | **Zayıf** | Kerberoasting hedefi |
| 3 | DES-CBC-MD5 | **Kırık** | Devre dışı bırakılmalı |

> **SINAV İPUÇLARI:**
>
> - TGT'nin sname'i her zaman `krbtgt/REALM` formatındadır
> - enc-part etype = biletin nasıl şifrelendiği
> - Aynı pcap'te AS-REQ içindeki etype listesi istemcinin DESTEKLEDİKLERİDİR

---

## Alıştırma 3: Servis Bileti ve SPN Analizi

TGS akışında hangi servise bilet alındığını çıkar.

### Filtre:
```text
kerberos.SNameString
```

### Adımlar:

1. Frame 44 (TGS-REQ) ve 46 (TGS-REP): cifs servisi için bilet
2. Frame 54/56: backup servisi için bilet
3. SPN formatını çöz:

```text
sname: cifs,dc.shark-tank.local
       ^    ^
       |    └─ makine (host) adı
       └─ servis adı

sname: backup,svc-backup.shark-tank.local
       ^      ^
       |      └─ servis hesabının adı
       └─ servis adı
```

4. `smb2 || ldap` filtresiyle modül 19 pcap'inde aynı SPN'lerin
   gerçek erişimde nasıl kullanıldığını karşılaştır

> **SINAV İPUÇLARI:**
>
> - SNameString'in ilk bileşeni servis, kalanı makine/hesap adıdır
> - `cifs` = dosya paylaşımı, `ldap` = dizin sorgusu, `host` = genel makine
> - Wireshark CSV çıktısında sname sütunu SPN envanteri verir

---

## Alıştırma 4: Kerberoasting Tespiti

Saldırganın SPN taramasını (Kerberoasting'in ağ tarafı) yakala.

### Filtre:
```text
kerberos.msg_type == 12 && ip.src == 172.50.2.200
```

### Adımlar:

1. Filtreyi uygula: 5 TGS-REQ görünecek (frame 88-120 arası)
2. Frame'leri sırayla aç ve SNameString değerlerini not et:

```text
Frame 88:  www,dc.shark-tank.local
Frame 98:  ldap,dc.shark-tank.local
Frame 108: cifs,dc.shark-tank.local
Frame 118: host,dc.shark-tank.local
Frame 128: backup,svc-backup.shark-tank.local
```

3. Kalıp: Tek istemci, kısa sürede TÜM SPN'lere bilet istedi
4. Önce saldırganın TGT aldığını doğrula (frame 68-80, AS akışı)

### Keskin İmza: etype 23 (RC4) Bileti

Kerberoasting'in ağda en net izi, **dönen biletin şifreleme türüdür**:
Kıran araçlar (Rubeus, GetUserSPNs.py, `kvno -e rc4-hmac`) bileti
**RC4-HMAC (etype 23)** ile ister çünkü RC4 anahtar türevi (NT hash)
kırılması kolay kriptodur. Bu pcap'te saldırgan tam bunu yaptı:

```text
# RC4 ile şifrelenmiş biletleri yakala (TGS-REP, msg_type 13):
kerberos.etype == 23
```

İki TGS-REP'te biletin `etype: 23 (RC4-HMAC)` taşıdığını görürsün
(biri istemcinin oturumunda, biri saldırganın SPN taramasında).
Karşılaştır: Diğer tüm biletler `etype 18 (AES256)` — aynı ağda iki
etype kuşağı görüyorsan RC4 tarafını hemen incele.

**Not:** İstemci TGS-REQ'te desteklediği listeyle (18...) gider; RC4
 tercihi **yanıt biletine** yansır — bu yüzden filtre msg_type 13'te
veya doğrudan `kerberos.etype == 23`'te atılır.

> **SINAV İPUCU:** "Kerberoasting'i tek filtreyle nasıl kanıtlarsın?"
> → `kerberos.msg_type == 13 && kerberos.etype == 23`: RC4 bilet +
> saldırgan kaynaklı toplu SPN taraması birlikte kesin imzadır; tek
> başına "çok TGS-REQ" sezgisel kalır.

### Kerberoasting Aşamaları:

| Aşama | Ağda görünüm | Tespit |
|-------|--------------|--------|
| 1. Keşif | Dizinden SPN listesi (LDAP, modül 18) | Anomali: geniş LDAP sorgusu |
| 2. Bilet toplama | Art arda TGS-REQ'ler (bu alıştırma) | **Kısa sürede çok SPN** |
| 3. Kırma | Ağda GÖRÜNMEZ (çevrimdışı) | Ancak bilet etype'ından anlaşılır |

> **Not:** Kerberoasting'in klasik imzası RC4 (etype 23) şifreli servis
> biletleridir; bu labın Samba KDC'si yalnızca AES verir, bu yüzden
> buradaki tespit SPN tarama kalıbına dayanır. Gerçek dünyada
> `kerberos.etype == 23 && kerberos.msg_type == 13` filtresi zayıf
> biletleri doğrudan yakalar.

> **İstihbarat İşaretleri, Kerberoasting:**
>
> - Tek kaynak IP'den kısa sürede çok sayıda farklı SPN'e TGS-REQ
> - Normal kullanıcılar yalnızca kullandıkları servislerin SPN'lerini ister
> - Saldırgan geçerli bir domain kimliğiyle gelir (frame 68: analyst TGT)
>   — bu yüzden kimlik doğrulama BAŞARILI görünür, kalıp analizi şarttır

---

## Alıştırma 5: KRB-ERROR Kodlarını Oku

Hata paketlerini sistematiğe bağla.

### Filtre:
```text
kerberos.msg_type == 30
```

### Adımlar:

1. Bu pcap'te 4 KRB-ERROR bulacaksın (frame 6, 16, 26, 70)
2. Her biri için tabloyu doldur:

| Frame | error_code | Kim (cname) | Yorumun |
|-------|-----------|-------------|---------|
| 6 | 25 | analyst | Ön kimlik isteniyor (normal) |
| 16 | ? | ? | ? |
| 26 | ? | ? | ? |
| 70 | ? | ? | ? |

3. Frame 70'nin ip.src'sine bak: Bu hata kime, kimden geliyor?

> **SINAV İPUÇLARI:**
>
> - KRB-ERROR paketlerinde cname hedef kullanıcıyı verir
> - ip.src KDC ise yanıt, istemci ise istektir (gerçekte hatalar hep
>   KDC'den döner)
> - Saat kayması (37) ve SPN hatası (7) sınav favorisidir

### Bilet Hırsızlığı Ailesi: Pass-the-Ticket, Golden ve Silver Ticket

Ağdan çalınan biletlerle oynanan saldırılar (bu pcap'te üretilmez — trafik
analiziyle sınırlıdır; **istihbarat notu** olarak bilin):

| Saldırı | Ne Çalınır | Ağdaki İmza |
|---------|-----------|-------------|
| **Pass-the-Ticket** | Çalınan TGS bileti olduğu gibi başka makinede kullanılır | Aynı biletin (aynı `ticket` alanı/hash) **farklı kaynak IP'lerden** AP-REQ içinde görülmesi |
| **Golden Ticket** | Saldırgan krbtgt hesabının anahtarını ele geçirir, **kendisi imzalar** (TGT üretir) | KDC'den hiç AS-REQ gelmeden TGS-REQ'lerin gelmesi (bilinmeyen kullanıcıya ait geçerli TGT!) |
| **Silver Ticket** | Sadece bir servis hesabı anahtarıyla TGS üretilir | Hedef servise (örn. cifs) giden AP-REQ'lerin KDC ile hiç konuşmaması |

Ortak tespit filtresi biletin yeniden kullanımıdır:
```text
kerberos.msg_type == 12 || kerberos.msg_type == 14   # AP-REQ / AP-REP
```
Aynı `sname`+`cname` bileti farklı IP'lerden geliyorsa = pass-the-ticket
adayı. Golden/Silver tespiti asıl olarak DC loglarıyla yapılır; pcap'te
"dolaysız" kanıt KDC'ye hiç danışmayan geçerli biletlerdir.

> **SINAV İPUCU:** "Kerberoasting ile pass-the-ticket farkı?" →
> Kerberoasting çevrimdışı parola kırma (bileti kırarsın);
> pass-the-ticket biletin kendisini anında yeniden kullanma (kırma yok).
> Golden ticket = krbtgt anahtarıyla sahte TGT üretme.

---

## Hızlı Referans - Kerberos Filtreleri

| Filtre | Anlamı |
|--------|--------|
| `kerberos` | Tüm Kerberos trafiği |
| `kerberos.msg_type == 10` | AS-REQ (giriş istekleri) |
| `kerberos.msg_type == 11` | AS-REP (TGT verilen) |
| `kerberos.msg_type == 12` | TGS-REQ (servis bileti istekleri) |
| `kerberos.msg_type == 13` | TGS-REP (servis bileti verilen) |
| `kerberos.msg_type == 30` | KRB-ERROR (hatalar) |
| `kerberos.error_code == 24` | PREAUTH_FAILED (yanlış parola) |
| `kerberos.CNameString` | Kullanıcı adı taşıyan paketler |
| `kerberos.SNameString` | SPN taşıyan paketler |
| `kerberos.etype == 23` | RC4 bilet (Kerberoasting hedefi) |
| `tcp.port == 88 \|\| udp.port == 88` | Kerberos portu |

---

## Sınav Soruları (Çöz)

1. Kerberos'ta TGT ile servis bileti arasındaki fark nedir? Hangisi hangi
   msg_type ile verilir?
2. KRB-ERROR kodu 24 ne anlama gelir ve hangi saldırının habercisidir?
3. Bir istemcinin `cifs/dc.shark-tank.local` SPN'i için bilet alması ne
   yapmaya çalıştığını gösterir?
4. Kerberoasting'in AĞDA GÖRÜNEN aşaması hangisidir ve nasıl tespit edilir?
5. etype 23 neden güvenlik açısından önemlidir?
6. AS-REP paketinde cname ve sname alanları sırasıyla neyi belirtir?
7. KDC_ERR_PRINCIPAL_UNKNOWN (kod 10) hatalarının art arda gelmesi neyi
   işaret edebilir?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. TGT (AS-REP, msg_type 11) TGS servisine erişim için verilir ve parola
   kanıtı gerektirir. Servis bileti (TGS-REP, msg_type 13) TGT kullanılarak
   alınır ve parola gerektirmez.

2. PREAUTH_FAILED: Parola yanlış. Art arda 24 kodları parola tahmini
   (brute force) denemesidir.

3. Dosya paylaşımına (SMB/CIFS) erişmek istediğini. SPN'ler servisin
   kimliğidir: cifs = dosya paylaşımı servisi.

4. Bilet toplama aşaması: Tek kaynak IP'den kısa sürede çok sayıda farklı
   SPN'e TGS-REQ. Kırma aşaması çevrimdışı gerçekleştiği için ağda görünmez.

5. RC4-HMAC zayıf bir algoritmadır; bu tür şifrelenmiş servis biletleri
   çevrimdışı kırılarak servis hesabı parolası ele geçirilebilir
   (Kerberoasting). Bu pcap'te kanıtı: `kerberos.etype == 23` filtresi
   2 TGS-REP yakalar (biri saldırganın `kvno -e rc4-hmac` çağrısından);
   kalan biletlerin tamamı etype 18 (AES256).

6. cname bileti alan kullanıcıyı (analyst), sname biletin hangi servis
   için olduğunu (krbtgt/REALM veya SPN) belirtir.

7. Kullanıcı adı keşfi (enumeration): Saldırgan geçerli kullanıcı
   adlarını bulmak için tahminlerle denemeler yapıyor olabilir.

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
