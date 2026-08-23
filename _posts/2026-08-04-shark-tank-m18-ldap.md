---
layout: post
title:  "shark-tank - m18: LDAP Analizi"
date:   2026-08-04 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 18: LDAP Analizi

**Neden?** SOC ekibi dizin servisine yapılan şüpheli sorguları inceliyor:
Bazı sorgular dakikalarca askıda kalıyor, biri koca kullanıcı tablosunu
tek seferde çekmeye çalışmış. Active Directory'nin kalbi LDAP'dır:
Kullanıcılar, gruplar, bilgisayarlar, servis hesapları — hepsi LDAP
dizininde saklanır ve sorgulanır. Saldırgan için LDAP bir harita gibidir:
Anonim bağlantıyla neler sızdığına, kim hangi filtreyle neyi taradığına
bakılır; düz metin parolayla yapılan simple bind'lar ise hazır kimlik
hediyesidir. Bu modülde, LDAP sorgularını okumayı, bind tiplerini ayırt
etmeyi, sunucu tarafı limitleri (timeLimit/sizeLimit) tanımayı ve dizin
keşfi izlerini tespit etmeyi öğreneceksin.

**Görev:** SHARK-TANK.LOCAL dizin servisinin trafiğini analiz et.

**Öğrenim Hedefleri:**
- LDAP bind tiplerini (anonim, simple, GSSAPI) paketlerden ayırt edebilmek
- Arama sorgularını (base, scope, filter) okuyup ne sorulduğunu çıkarabilmek
- Simple bind'daki düz metin parolayı görebilmek ve riskini açıklamak
- StartTLS ile LDAPS farkını trafikte tespit edebilmek
- Dizin keşfi (enumeration) ve parola denemesi izlerini bulabilmek

## Terimler

| Terim | Açıklama |
|-------|----------|
| **LDAP** | Lightweight Directory Access Protocol: Ağ kaynaklarını (kullanıcı, grup, bilgisayar) hiyerarşik ağaçta saklayan dizin servisinin sorgulama protokolü. TCP 389 (düz metin veya StartTLS) ve TCP 636 (LDAPS, doğuştan TLS) portlarında çalışır. Active Directory'nin sorgu arayüzüdür; Wireshark'ta `ldap` filtresiyle görüntülenir. |
| **DN (Distinguished Name)** | Dizindeki bir kaydın tam adresi: `CN=analyst,CN=Users,DC=shark-tank,DC=local` gibi. Soldaki bileşen kaydın kendisi (CN = Common Name), sağdakiler üst kapsayıcılardır (DC = Domain Component). Sorgunun nereden başladığını (base) DN belirtir. |
| **Bind** | LDAP bağlantısının kimlik doğrulama adımı. Üç temel tip vardır: Anonim (kimlik kanıtı yok), Simple (DN + düz metin parola — ağda GÖRÜNÜR!), SASL/GSSAPI (Kerberos biletiyle, güvenli). Bind tipi, trafiğin güvenlik seviyesini belirler. |
| **base / scope / filter** | Aramanın üç parametresi: base (nereden başlanacağı, bir DN), scope (base = yalnız o kayıt, one = bir alt seviye, sub = tüm alt ağaç), filter (hangi kayıtların istendiği, `(objectClass=group)` gibi). Saldırı analizinde filter, neyin hedeflendiğini söyler. |
| **rootDSE** | Dizinin "kimlik kartı": Boş DN ile yapılan base-scope sorgu. Dizin yeteneklerini, adlandırma bağlamlarını (namingContexts) ve şema bilgilerini anonim olarak döndürür. Keşif (reconnaissance) aşamasının ilk adımıdır. |
| **StartTLS vs LDAPS** | İkisi de LDAP'ı TLS ile şifreler ama yöntemleri farklıdır: StartTLS, 389 portunda düz bağlantı kurulup `extendedOp` ile TLS'e yükseltilir (önce düz, sonra şifreli paketler aynı bağlantıda). LDAPS ise 636 portunda bağlantı en baştan TLS ile kurulur. StartTLS trafiğinde yükseltme paketi görünür; LDAPS'ta ilk paketten itibaren TLS görülür. |
| **SASL / GSSAPI** | Simple Authentication and Security Layer: LDAP bind'ının parola yerine mekanizma temelli yapılmasını sağlayan çerçeve. En yaygın mekanizma GSSAPI'dir ve Kerberos biletini (modül 17) kullanır: Pakette `mechanism: GSSAPI` görünür, kimlik çok adımlı pazarlıkla (14/saslBindInProgress ara yanıtları) doğrulanır. Simple bind'dan farkı: Ağda parola hiç iletilmez. |
| **OID** | Object Identifier: Protokol ve mekanizmaların standart numaraları — noktayla ayrılan numara ağaçları (örn. LDAP StartTLS: 1.3.6.1.4.1.4203.1.11.3, Kerberos: 1.2.840.113554.1.2.2). Paket analizinde "bu OID neydi?" sorusu sık çıkar; Wireshark çoğunu isimle çözümler ama çözmüyorsa OID veritabanından bakılır. |

## Teori

LDAP oturumu hep aynı düzeni izler: Bağlan → Bind → Ara/Uygula → Unbind.

```text
İstemci                        LDAP Sunucusu (dc)
  |                                |
  |-- TCP 389 bağlantısı --------->|
  |-- bindRequest (anonim) ------->|   1. Kimlik belirle
  |<-- bindResponse (success) -----|
  |                                |
  |-- searchRequest -------------->|   2. Sorgu
  |   base: CN=Users,DC=...        |
  |   scope: sub                   |
  |   filter: (objectClass=group)  |
  |<-- searchResEntry (sonuçlar) --|
  |<-- searchResDone (bitti) ------|
  |                                |
  |-- unbindRequest -------------->|   3. Kop
```

### Bind Tipi Karşılaştırması:

| Bind tipi | Ağda görünen | Güvenlik |
|-----------|--------------|----------|
| Anonim | parolasız bindRequest | Sadece herkese açık veriler |
| Simple | DN + **düz metin parola** | Çok zayıf — dinleyen herkes görür |
| SASL/GSSAPI | mekanizma: GSSAPI, bilet | Güçlü (Kerberos, modül 17) |

### Sık Görülen resultCode Değerleri:

| Kod | Ad | Anlamı |
|-----|-----|--------|
| 0 | success | İşlem başarılı |
| 14 | saslBindInProgress | GSSAPI çok adımlı bind'un aracı adımı |
| 49 | invalidCredentials | Parola/DN yanlış — deneme izi! |

---

## Hazırlık

```sh
./scripts/generate-traffic.sh ldap
# macOS: open -a Wireshark module-18-ldap.pcap
# Linux: wireshark module-18-ldap.pcap &
# Windows: start wireshark module-18-ldap.pcap
```

Repoyu indirmediysen bu modülün pcap dosyasını [buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

Bu pcap'te anonim rootDSE sorgusu, düz metin parolalı simple bind (başarılı ve başarısız), Kerberos biletli GSSAPI bind ve StartTLS/LDAPS karşılaştırması bir aradadır.

---

## Alıştırma 1: Anonim Keşif (rootDSE)

Dizine parolasız neler sızdığına bak.

### Filtre:
```text
ldap.protocolOp == 0
```

### Adımlar:

1. `module-18-ldap.pcap`'i Wireshark'ta aç ve filtreyi uygula
2. Frame 4 (bindRequest): Orta panelde authentication alanını incele:

```text
v LDAPMessage bindRequest(1)
    messageID: 1
    v protocolOp: bindRequest (0)
        version: 3
        name:                              ← BOŞ = anonim
        v authentication
            simple: <görünmez>
```

3. Frame 8 (searchRequest): base boş, scope base — rootDSE sorgusu
4. Frame 9 (searchResEntry): Dizin hangi bilgileri verdi?

> **SINAV İPUÇLARI:**
>
> - Boş name alanı = anonim bind
> - rootDSE sorgusu = boş base + scope: base
> - namingContexts yanıtı domain adını (DC=...) ele verir
> - Anonim sorgu dizin ağacını TARAMAZ, sadece kök bilgisi verir

> **İstihbarat İşaretleri, Dizin keşfi:**
>
> - Anonim rootDSE ardından geniş kapsamlı (scope: sub) sorgular
> - filter alanında (objectClass=*) gibi her şeyi süzen kalıplar
> - Keşif, saldırı zincirinin ilk halkasıdır — erken uyarı fırsatıdır

---

## Alıştırma 2: Simple Bind — Parola Ağda!

Düz metin kimlik doğrulamanın bedelini gör.

### Filtre:
```text
ldap.protocolOp == 0 && ldap.authentication.simple
```

### Adımlar:

1. Frame 18'i (bindRequest) aç ve orta panelde şu satırları bul:

```text
v LDAPMessage bindRequest(1) "analyst@shark-tank.local" simple
    v protocolOp: bindRequest (0)
        name: analyst@shark-tank.local
        v authentication: simple (0)
            simple: analyst123!               ← PAROLA BURADA!
```

2. Frame 20 (bindResponse): resultCode success (0) — giriş başarılı
3. Frame 22 (searchRequest): Hangi base ve filter sorgulandı?

### Simple Bind Riski:

| Gözlem | Sonuç |
|--------|-------|
| Parola pakette düz metin | Dinleyen herkes okuyabilir |
| Başarılı bind (kod 0) | Saldırgan GEÇERLİ kimliğe sahip |
| Aktarımda şifreleme yok | 389 portu, TLS yok |

> **SINAV İPUÇLARI:**
>
> - Wireshark'ta bindRequest satırının kendinde bile parola görünür
> - Simple bind + TLS yok = kritik bulgu (raporla!)
> - Çözüm: LDAPS/StartTLS zorunlu kıl + simple bind kapatılmalı

---

## Alıştırma 3: Başarısız Deneme — invalidCredentials

Parola tahmini izini yakala.

### Filtre:
```text
ldap.bindResponse_resultCode == 49
```

### Adımlar:

1. Frame 31 (bindRequest): Yine simple bind, yine analyst
2. Frame 33 (bindResponse): Aşağıdaki paneli incele:

```text
v LDAPMessage bindResponse(1)
    v protocolOp: bindResponse (1)
        resultCode: invalidCredentials (49)
        errorMessage: 80090308: LdapErr: ...
            comment: AcceptSecurityContext error, data 52e
```

3. Frame 31'in parola alanındaki değeri Alıştırma 2 ile karşılaştır
4. errorMessage içindeki `data 52e` = Active Directory'de "yanlış parola"
   kodudur

> **İstihbarat İşaretleri, LDAP parola tahmini:**
>
> - Art arda 49 kodlu bindResponse'lar = deneme yanılma
> - Aynı name, farklı parolalar = tek hesaba hedefli saldırı
> - Farklı name'ler, tek parola = parola spreyi (password spray)

---

## Alıştırma 4: Sunucu Tarafı Limitler — timeLimit ve sizeLimit

Sorgunun kendisi de istemci istekleri taşıyabilir: İstemci, sunucuya
"bu sorguyu en fazla X saniyede, en fazla Y kayıtla sınırla" diyebilir.
Bunlar searchRequest içindeki **timeLimit** (saniye) ve **sizeLimit**
(kayıt sayısı) alanlarıdır — `ldapsearch`'ün `-l` ve `-z` parametreleri
bunları doldurur.

### Filtre:
```text
ldap.timeLimit == 120
```

### Adımlar:

1. searchRequest paketini aç, `Search Request` düğümünü genişlet:

```text
v LDAPMessage searchRequest(4)
    v protocolOp: searchRequest (3)
        baseObject: CN=Users,DC=shark-tank,DC=local
        scope: wholeSubtree (2)
        filter: (objectClass=*)
        v limits
            sizeLimit: 500      <-- istemci "500 kayıttan fazlasını istemem"
            timeLimit: 120      <-- istemci "120 saniyeden uzun sürerse bırak"
```

2. `ldap.timeLimit == 120 && ldap.sizeLimit == 500` birlikte filtreleyip
   paketin ikisini birden taşıdığını doğrula
3. Karşılaştır: Diğer (normal) searchRequest'lerde timeLimit genelde
   0'dır = "süre sınırı yok"

### Neden Analist İçin Önemli?

- **DoS göstergesi:** timeLimit=0 (ya da çok büyük) + geniş kapsamlı
  filter (`objectClass=*`) = istemci dizini torrent gibi çekmeye
  çalışıyor olabilir
- **Kural avı:** "Bütün kullanıcıları döken sorgu hangisi?" sorusunun
  cevabı çoğu kez `sizeLimit`'i yüksek/geniş tek bir searchRequest'tir
- **Sınav kalıbı:** "X sorgusu en fazla kaç kayıt istemiş?" →
  `ldap.sizeLimit` alanını oku; "kaç saniyelik sınır koymuş?" →
  `ldap.timeLimit`

> **SINAV İPUCU:** timeLimit/sizeLimit, searchRequest'in parçasıdır ve
> cleartext görünür. `ldap.timeLimit > 0` filtresi, limit KULLANAN
> sorguları anında bulur.

---

## Alıştırma 5: GSSAPI Bind — Kerberos ile Güvenli Bağlantı

Bilet tabanlı kimlik doğrulamanın çok adımlı sürecini izle.

### Filtre:
```text
ldap.mechanism == "GSSAPI"
```

### Adımlar:

1. Frame 82 (bindRequest): SASL mekanizması GSSAPI seçilmiş
2. Frame 82-89 arasını sırayla izle — bind ÜÇ adımda tamamlanır:

```text
Frame 82: bindRequest  (mechanism: GSSAPI, negTokenInit)   → istemci
Frame 84: bindResponse (resultCode: saslBindInProgress 14)
Frame 86: bindRequest  (SPNEGO devamı, bilet)              → KDC'den
Frame 88: bindRequest  (imza kanıtı — bütünlük)
Frame 89: bindResponse (resultCode: success 0)             → tamam!
```

3. Bu trafiğin ÖNCESİNDE Kerberos TGS alındığını doğrula:
   `kerberos.SNameString contains "ldap"` filtresiyle modül 17'ye dön
4. Parola görünür mü? GSSAPI'da parola hiç iletilmez; bilet şifreli
   kanıttır ve düz metin olarak okunamaz

> **SINAV İPUÇLARI:**
>
> - SASL bind'lar 14 (saslBindInProgress) ara yanıtlarıyla çok adımlıdır
> - GSSAPI = Kerberos bileti; modül 17'deki akışın burada kullanımı
> - simple ile GSSAPI'yı ayıran: mekanizma alanı ve düz metin yokluğu

---

## Alıştırma 6: StartTLS ve LDAPS Karşılaştırması

İki şifreleme yönteminin paket farklarını bul.

### Filtre:
```text
ldap.protocolOp == 23 || tls.handshake.type == 1
```

### Adımlar:

1. Frame 100: extendedReq — LDAP_START_TLS OID'si ile TLS yükseltme isteği
2. Frame 104: Aynı bağlantıda (389) TLS ClientHello — şifreli kısım başlar
3. Frame 121: 636 portuna doğrudan ClientHello — LDAPS (doğuştan TLS)
4. StartTLS sonrası içerik okunabilir mi? base/filter alanları neden
   görünmüyor?

### StartTLS vs LDAPS:

| Özellik | StartTLS | LDAPS |
|---------|----------|-------|
| Port | 389 | 636 |
| İlk paketler | Düz LDAP (yükseltme OID'i görünür) | Doğrudan TLS |
| Yükseltme paketi | Var (extendedOp) | Yok |
| İçerik | TLS başladıktan sonra şifreli | Baştan şifreli |

> **SINAV İPUÇLARI:**
>
> - StartTLS imzası: extendedReq (protocolOp 23) + hemen ardından TLS
> - LDAPS imzası: 636 portunda TLS, hiç düz LDAP paketi yok
> - Sınavda "hangisi doğuştan şifreli?" sorusunun cevabı LDAPS'tir

> **LDAP injection notu:** Web formlarından gelen girdi LDAP filtresine
> kaçmadan yerleştirilirse (`(uid=$kullanici)`), saldırgan `*` ya da
> `)(objectClass=*` gibi girdilerle filtreyi bozabilir — SQL injection'ın
> LDAP kuzeni. Ağda imzası: searchRequest'in `filter` alanında
> beklenmedik joker/parantez kalıpları: `ldap.filter contains "(|(uid=*))"`
> gibi. Savunması girdi kaçışlama (escaping) ve parametreli sorgudur.

---

## Hızlı Referans - LDAP Filtreleri

| Filtre | Anlamı |
|--------|--------|
| `ldap` | Tüm LDAP trafiği |
| `ldap.protocolOp == 0` | bindRequest'ler |
| `ldap.protocolOp == 1` | bindResponse'lar |
| `ldap.protocolOp == 3` | searchRequest'ler |
| `ldap.protocolOp == 23` | StartTLS yükseltme istekleri |
| `ldap.authentication.simple` | Düz metin parolalı bind'lar |
| `ldap.mechanism == "GSSAPI"` | Kerberos biletli bind'lar |
| `ldap.bindResponse_resultCode == 49` | Başarısız kimlik doğrulama |
| `ldap.filter` | Filtre taşıyan sorgular |
| `tcp.port == 389 \|\| tcp.port == 636` | LDAP portları |

---

## Sınav Soruları (Çöz)

1. Anonim bind ile simple bind arasındaki fark nedir? Pakette nasıl
   ayırt edilirler?
2. `(objectClass=group)` filtresi ve `sub` scope'u taşıyan bir sorgu ne
   istiyor olabilir?
3. Simple bind neden güvenli değildir ve hangi iki çözümle ikame edilir?
4. StartTLS ile LDAPS'nin paket seviyesindeki farkı nedir?
5. resultCode 14 (saslBindInProgress) neyi gösterir?
6. rootDSE sorgusu nedir ve hangi saldırı aşamasının parçasıdır?
7. Aşağıdaki gözlemlerden hangisi parola spreyi, hangisi hedefli brute
   force işaretidir: (a) aynı kullanıcıya 50 farklı parola, (b) 50 farklı
   kullanıcıya aynı parola?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. Anonim bind'da name alanı boştur ve parola yoktur; simple bind'da name
   bir DN taşır ve authentication.simple alanında düz metin parola vardır.

2. Base kapsayıcısı altındaki (sub = tüm alt ağaç) tüm grup kayıtlarını
   listeliyor olabilir: Grup keşfi (enumeration) sorgusudur.

3. Parola ağda düz metin görünür; dinleyen herkes okuyabilir. Çözüm:
   LDAPS veya StartTLS ile taşıma şifrelemek, simple bind yerine
   SASL/GSSAPI (Kerberos) kullanmak.

4. StartTLS 389'da düz başlar ve extendedOp paketiyle TLS'e yükselir
   (yükseltme paketi görünür); LDAPS 636'da bağlantı en baştan TLS'dir.

5. SASL bind'ın çok adımlı sürecinin ara adımıdır: Sunucu istemciden
   sonraki adımı bekliyor, hata değildir.

6. Boş DN + base scope ile yapılan dizin kök bilgisi sorgusudur;
   keşif (reconnaissance) aşamasının ilk adımı olarak kullanılır.

7. (a) hedefli brute force (tek hesap, çok parola), (b) parola spreyi
   (çok hesap, tek yaygın parola).

</details>

---

> Modül listesine erişmek için [tıkla!](https://nuriacar.com/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
