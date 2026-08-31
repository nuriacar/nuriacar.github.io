---
layout: project
title: "Sözlük: Dijital Güvenlik Terimleri"
nav_title: Sözlük
permalink: /sozluk/
eyebrow: dijital güvenlik terimleri
---

**Özlü kural:** Bir terimi bilmiyorsan utanma, bilmediğini bilmek güvenliğinin ilk adımıdır.

> **Nota**: Bu sözlük, rehber boyunca karşılaşacağın terimleri kısaca açıklar. Her terim en fazla bir iki cümleyle tanımlanır.

<details class="toc-block" markdown="block" id="letter-sayi">
<summary>Sayılar</summary>

- <span id="2fa"></span>**2FA** (Two-Factor Authentication): İkinci doğrulama adımı. Parolanın yanında ek bir kanal kullanarak hesabına erişimi sağlama yöntemi.
- <span id="3-2-1"></span>**3-2-1 Yedekleme Kuralı**: Yedekleme altın kuralı: 3 kopya, 2 farklı ortam, 1 kopya başka konumda. Fidye yazılımı canlı veriyi ve ağdaki yedeği de şifreler; off-site kopya son savunmandır.

</details>

<details class="toc-block" markdown="block" id="letter-a">
<summary>A</summary>

- <span id="adware"></span>**Adware** (Reklam Yazılımı): Sana sürekli reklam açan, tarayıcıyı yönlendiren ve cihazını yavaşlatan yazılım. Can sıkıcı görünür ama asıl işi seni izleyip verini toplamaktır.
- <span id="alan-adi"></span>**Alan Adı** (Domain): İnternette bir sitenin adresi (turkiye.gov.tr gibi). Sahte adresler oltalamanın en sık yoludur; giriş yapmadan önce adresi harf harf kontrol et.
- <span id="apk"></span>**APK** (Android Package): Resmi mağaza (Play Store, App Store) dışından dosya olarak indirilen Android uygulaması. Denetimden geçmez; en yaygın casus yazılım bulaşma yoludur.
- <span id="apt"></span>**APT** (Advanced Persistent Threat): Gelişmiş sürekli tehdit. Uzun süreli, hedefli ve karmaşık siber saldırı.

</details>

<details class="toc-block" markdown="block" id="letter-b">
<summary>B</summary>

- <span id="badusb"></span>**BadUSB**: Sıradan USB bellek gibi görünüp takıldığında klavye gibi davranan sahte cihaz. Saniyeler içinde cihazına zararlı yükler. Bulduğun USB'yi asla takma.
- <span id="baiting"></span>**Baiting** (Yemleme): Kurbanı bir ödül veya merak uyandıran dosyayla kandırma. Sosyal mühendislik yöntemlerinden biridir.
- <span id="bec"></span>**BEC** (İş e-postası dolandırıcılığı, İng. Business Email Compromise): Kurumsal e-posta dolandırıcılığı. Saldırgan CEO/CFO taklidi yaparak para transferi sağlar. 2023'te dünya çapında 2.9 milyar dolar kayıp.
- <span id="bimi"></span>**BIMI** (Brand Indicators for Message Identification): DMARC geçerli maillerde marka logosunun gösterilmesi. DMARC `p=reject` ile birlikte kullanılır.
- <span id="biyometrik"></span>**Biyometrik**: Parmak izi, yüz tanıma gibi sana özgü bedensel özelliklerle kimlik doğrulama. Pratiktir ama uykuda yüzüne tutarak açabilir; parolanla birlikte kullan.
- <span id="bot"></span>**Bot**: Otomatik yazılım. Hesapları taklit ederek sahte etkileşim üretir. Botlar yönlendirme, propaganda ve spam amaçlı kullanılır.
- <span id="brute-force"></span>**Brute Force** (Deneme Yanılma): Tüm olası parola kombinasyonlarını otomatik deneyerek parolanı kırmaya çalışma. Kısa parola dakikalar içinde kırılır; 12+ karaktere karşı yüzyıllar gerekir.
- <span id="byod"></span>**BYOD** (Bring Your Own Device): Çalışanların kişisel cihazlarını iş amaçlı kullanması. Güvenlik politikaları gereği dikkatle yönetilmelidir.

</details>

<details class="toc-block" markdown="block" id="letter-c">
<summary>C</summary>

- <span id="casus-yazilim"></span>**Casus yazılım** (spyware): Cihazını izleyen, ses kaydeden, ekran okuyan gizli yazılım.
- <span id="certificate-pinning"></span>**Certificate Pinning**: Mobil uygulamanın sadece belirli sertifikaları kabul etmesi. MITM (ortadaki adam) saldırılarını engeller.
- <span id="ci-cd"></span>**CI/CD** (Continuous Integration / Continuous Deployment): Sürekli entegrasyon ve sürekli dağıtım. Kodun yazıldığı andan üretime çıkana kadar otomatik test ve dağıtım sürecini yöneten sistem.
- <span id="cia"></span>**CIA** (Confidentiality, Integrity, Availability): Bilgi güvenliğinin üç temel ilkesi. Gizlilik, bütünlük, erişilebilirlik.
- <span id="cloud-misconfiguration"></span>**Cloud Misconfiguration** (Bulut Yanlış Yapılandırması): Bulut kaynaklarının yanlış ayarlanması. Public S3 bucket, geniş IAM policy, açık yönetim portları en yaygın örnekler. İhlallerin %95'i bu nedenden.
- <span id="cors"></span>**CORS** (Cross-Origin Resource Sharing): Bir web sitesinin başka bir alan adından API istekleri yapmasına izin veren tarayıcı mekanizması. Yanlış yapılandırılırsa saldırgan siteler senin API'ne erişebilir.
- <span id="credential-stuffing"></span>**Credential Stuffing** (Kimlik Bilgisi Doldurma): Daha önce sızdırılmış parola listelerini alıp başka sitelerde otomatik deneme saldırısı. Aynı parolayı birden çok yerde kullanıyorsan hesabın saniyeler içinde açılır.
- <span id="csp"></span>**CSP** (İçerik Güvenliği Politikası, İng. Content-Security-Policy): Tarayıcının hangi kaynaklardan içerik yükleyebileceğini belirten HTTP başlığı. XSS saldırılarını kısıtlar.
- <span id="cspm"></span>**CSPM** (Bulut Güvenliği Duruş Yönetimi, İng. Cloud Security Posture Management): Bulut hesabını sürekli tarayıp yanlış yapılandırmaları raporlayan araç. Prowler, ScoutSuite, Wiz örnek.
- <span id="csrf"></span>**CSRF** (Siteler Arası İstek Sahteciliği, İng. Cross-Site Request Forgery): Siteler arası istek sahteciliği. Saldırganın, kullanıcının haberi olmadan tarayıcısından senin sitene istek göndermesi. CSRF token ve SameSite çerezi ile önlenir.
- <span id="cerezi"></span>**Çerez** (Cookie): Sitelerin tarayıcına bıraktığı seni tanımaya yarayan küçük dosyalar. Çalınırsa parolan olmadan hesabına girilebilir; üçüncü taraf çerezlerini engelle.

</details>

<details class="toc-block" markdown="block" id="letter-d">
<summary>D</summary>

- <span id="ddos"></span>**DDoS** (Distributed Denial of Service): Dağıtık hizmet engelleme. Binlerce cihazdan aynı anda gelen trafikle bir siteyi çökertme.
- <span id="deepfake"></span>**Deepfake**: Yapay zekayla üretilmiş sahte görüntü veya ses. Kişilerin yüzünü veya sesini taklit eder.
- <span id="dependency-confusion"></span>**Dependency Confusion**: Public ve private package isim çakışması sömürüsü. Saldırgan public registry'de aynı isimle yüksek sürüm yayınlar, build'iniz kötü amaçlı kodu çeker.
- <span id="deserialization"></span>**Deserialization** (Ters Serileştirme): Verinin nesneye dönüştürülmesi. Güvenilmeyen veri ile yapıldığında (Python pickle, PHP unserialize, Java ObjectInputStream) uzaktan kod çalıştırmaya yol açar. JSON + şema doğrulama güvenli alternatif.
- <span id="dfd"></span>**DFD** (Data Flow Diagram): Veri akış diyagramı. Verinin sistem içinde nasıl hareket ettiğini gösteren diyagram, tehdit modellemenin temel aracı.
- <span id="dijital-ayak-izi"></span>**Dijital Ayak İzi**: İnternette her tıklaman, araman, gezdiğin sayfayla bıraktığın izlerin toplamı. Bu izlerden senin dijital kopyan çıkar; izlerini bilerek bırak.
- <span id="dkim"></span>**DKIM** (DomainKeys Identified Mail): E-postaya kriptografik imza ekleyen standart. Alıcı, DNS'te yayınlanan public key ile imzayı doğrular.
- <span id="dlp"></span>**DLP** (Data Loss Prevention): Veri sızıntısını önleme. Hassas verilerin kurum dışına yetkisiz olarak gönderilmesini veya kopyalanmasını engelleyen teknoloji.
- <span id="dmarc"></span>**DMARC** (Domain-based Message Authentication, Reporting and Conformance): SPF ve DKIM'e dayalı e-posta kimlik doğrulama politikası katmanı. "Geçersiz mail ne yapalım?" sorusuna cevap verir (none/quarantine/reject).
- <span id="dns"></span>**DNS** (Domain Name System): Alan adı sistemi. Web adreslerini IP adreslerine çeviren telefon rehberi gibi çalışır.
- <span id="doxxing"></span>**Doxxing** (Kimlik İfşası): Birinin özel bilgilerini (adres, telefon, fotoğraf) öç almak veya linç için İnternette yayınlama. Özellikle kadınlara, muhaliflere ve gazetecilere karşı kullanılır.
- <span id="dast"></span>**DAST** (Dinamik Uygulama Güvenlik Testi, İng. Dynamic Application Security Testing): Çalışan uygulamayı dışarıdan tarayarak güvenlik açığı arayan test yöntemi. Kaynak koda ihtiyaç duymaz, uygulamaya HTTP istekleri gönderir.
- <span id="devsecops"></span>**DevSecOps**: Geliştirme (Dev), güvenlik (Sec) ve operasyon (Ops) süreçlerini birleştiren yaklaşım. Güvenlik testlerinin kod yazımından üretime kadar otomatik çalışmasını sağlar.
- <span id="docker"></span>**Docker**: Uygulamayı bağımlılıklarıyla birlikte paketleyen herhangi bir ortamda çalıştırılabilen konteyner platformu. Güvenliği iyi yapılandırılmazsa saldırgan yüzeyi oluşturur.
- <span id="dread"></span>**DREAD**: Tehditleri zarar, tekrarlanabilirlik, sömürülebilirlik, etkilenen kullanıcı, keşfedilebilirlik kriterleriyle puanlama modeli. Microsoft artık terk etti; tek başına güvenilir değildir.
- <span id="dumpster-diving"></span>**Dumpster Diving** (Çöp Karıştırma): Çöpe atılan belge, disk veya notlardan bilgi toplama. Evrakları yok etmeden atma.

</details>

<details class="toc-block" markdown="block" id="letter-e">
<summary>E</summary>

- <span id="eavesdropping"></span>**Eavesdropping**: Dinleme. Ağ trafiğini veya fiziksel ortamı dinleyerek bilgi toplama.
- <span id="edr"></span>**EDR** (Uç Nokta Tehdit Tespiti ve Yanıtı, İng. Endpoint Detection and Response): Uç noktada tespit ve yanıt. Cihazlardaki tehditleri gerçek zamanlı tespit edip müdahale eden güvenlik teknolojisi.
- <span id="elevation-of-privilege"></span>**Elevation of Privilege** (Yetki Yükseltme): Sıradan bir kullanıcının daha yüksek yetkiler elde etmesi. STRIDE tehdit kategorilerinden biri.
- <span id="evil-twin"></span>**Evil Twin** (Sahte Ağ): Saldırganın kafe veya otel Wi-Fi'siyle aynı isimde kurduğu sahte ağ. Yanlış olanı seçersen tüm trafiğin saldırgandan geçer; VPN'i açık tut.
- <span id="exif"></span>**EXIF** (Exchangeable Image File Format): Fotoğraf dosyasının içindeki gizli veri. Konum, saat, cihaz bilgisi taşır.
- <span id="exploit"></span>**Exploit** (Sömürü): Bir zafiyetten yararlanıp sisteme sızmak için kullanılan yöntem veya kod. Açık kapanana kadar tekrar tekrar kullanılabilir.

</details>

<details class="toc-block" markdown="block" id="letter-f">
<summary>F</summary>

- <span id="fernet"></span>**Fernet**: Python cryptography kütüphanesinin sağladığı, AES-128-CBC + HMAC-SHA256 kullanan şifreleme aracı. Anahtar üretimi ve IV yönetimi otomatiktir.
- <span id="fidye-yazilimi"></span>**Fidye yazılımı** (ransomware): Dosyalarını şifreleyip para isteyen yazılım. Ödeme yapma, yedekten dön.
- <span id="firewall"></span>**Firewall** (Güvenlik Duvarı): Ağ trafiğini süzüp izinsiz bağlantıları engelleyen savunma aracı. Modemde ve bilgisayarda mutlaka açık olsun; çoğu modemde kapalı gelir.
- <span id="firmware"></span>**Firmware**: Modem, kamera gibi cihazların kendi iç yazılımı. Güncellenmezse bilinen açıklarıyla saldırgana açık kalır.
- <span id="fuzzing"></span>**Fuzzing**: Programa rastgele veya yarı-rastgele veri göndererek çökme veya beklenmeyen davranış bulma test tekniği. Otomatik açık bulma yöntemidir.

</details>

<details class="toc-block" markdown="block" id="letter-g">
<summary>G</summary>

- <span id="gdpr"></span>**GDPR**: Avrupa Birliği'nin kişisel veri koruma yönetmeliği. KVKK'nın Avrupa'daki kardeşidir; AB vatandaşı verisi işliyorsan sana da uyar.
- <span id="gps-izleme"></span>**GPS izleme**: Konum verisinin cihazdan alınarak üçüncü taraflarca kullanılması. Uygulama izinlerini kontrol et.

</details>

<details class="toc-block" markdown="block" id="letter-h">
<summary>H</summary>

- <span id="hash"></span>**Hash**: Parolanı veya veriyi matematiksel işlemden geçirip elde edilen tek yönlü özet. Siteden parolan geri okunamaz; ama zayıf parolanın hash'i saniyeler içinde kırılır.
- <span id="hallucination"></span>**Hallucination** (Halüsinasyon): LLM'in gerçeği olmayan bilgiyi yüksek güvenle üretmesi. Hukuk, sağlık, finans gibi kritik alanlarda yanlış karar alma riski.
- <span id="hibrit-harp"></span>**Hibrit Harp** (Melez Savaş): Tank yerine dezenformasyon, siber saldırı ve algı manipülasyonuyla yürütülen savaş. Seni savaş alanında değil, zihninde vurur.
- <span id="https"></span>**HTTPS / TLS / SSL**: Sitenin seninle arasındaki bağlantıyı şifreleyen protokol. Adres çubuğunda kilit ve `https://` yoksa banka, e-Devlet, kart bilgisi kesinlikle girme.

</details>

<details class="toc-block" markdown="block" id="letter-i">
<summary>I</summary>

- <span id="ids-ips"></span>**IDS/IPS** (Intrusion Detection/Prevention System): Saldırı tespit/önleme sistemi. Ağ trafiğini izleyerek saldırıları tespit eden (IDS) ve engelleyen (IPS) güvenlik sistemleri.
- <span id="iam"></span>**IAM** (Kimlik ve Erişim Yönetimi, İng. Identity and Access Management): Bulutta kimlik ve erişim yönetimi. AWS IAM, Azure RBAC, Google Cloud IAM. En az ayrıcallık ilkesi kritik.
- <span id="imsi-catcher"></span>**IMSI Catcher** (Sahte Baz İstasyonu): Telefonunu taklit bir baz istasyonuna çekip konumunu ve konuşmanı dinleyen cihaz. Sinyalin gittiği yer gerçek operatör olmayabilir.
- <span id="information-disclosure"></span>**Information Disclosure** (Bilgi Sızdırma): Bilginin yetkisiz kişilere sızdırılması. STRIDE tehdit kategorilerinden biri.
- <span id="insider-tehdit"></span>**İnsider Tehdit** (Insider Threat): Kurum içinden gelen tehdit. Kötü niyetli veya dikkatsiz çalışan, yüklenici veya eski personelin kurum verilerine erişimi.
- <span id="iot"></span>**IoT** (Nesnelerin İnterneti): İnternete bağlı akıllı cihazlar (kamera, lamba, termostat). Güvenlikleri genelde zayıftır; misafir ağına bağla ki ele geçirilince tüm ağa sıçramasın.
- <span id="ip-adresi"></span>**IP adresi**: Cihazının İnternet üzerindeki adresi. Her bağlantıda bir IP atanır. VPN ile gizlenebilir.
- <span id="ir-playbook"></span>**IR Playbook**: Olay müdahale senaryo kitabı. Fidye yazılımı, veri sızıntısı, DDoS gibi olay tipleri için adım adım ne yapılacağını tanımlar.

</details>

<details class="toc-block" markdown="block" id="letter-j">
<summary>J</summary>

- <span id="jailbreak"></span>**Jailbreak**: Telefonun güvenlik kısıtlamalarını kaldırma işlemi. Saldırgan cihazda kalıcı olmak için yapar; kendi cihazına da yapma, tüm güvenlik duvarını düşürür.
- <span id="jailbreak-llm"></span>**Jailbreak (LLM)**: LLM'in güvenlik guardrail'lerini aşma. "DAN" gibi prompt'larla model, zararlı içerik üretmeye ikna edilir.
- <span id="jwt"></span>**JWT** (JSON Ağ Jetonu, İng. JSON Web Token): Oturum bilgisini JSON olarak taşıyan, dijital imzalı token. Tarayıcıdan sunucuya her istekte gönderilir. Payload Base64 ile encode edilir, şifrelenmez; hassas veri konmaz.

</details>

<details class="toc-block" markdown="block" id="letter-k">
<summary>K</summary>

- <span id="keylogger"></span>**Keylogger** (Klavye Kaydedici): Bastığın her tuşu gizlice kaydedip saldırgana gönderen yazılım. Parolan ne kadar uzun olursa olsun tuş tuş çalınır; ekran klavyesi bile kurtarmayabilir.
- <span id="kill-switch"></span>**Kill Switch** (Bağlantı Kesici): VPN koptuğu an İnternet erişimini otomatik kesen özellik. Açık değilse VPN düşerken farkında olmadan korumasız gezersin.
- <span id="kod-inceleme"></span>**Kod İnceleme** (Code Review): Başka bir geliştiricinin yazılan kodu güvenlik açısından denetlemesi. Otomatik araçlar (SAST) birçok hatayı yakalar ama iş mantığı hataları sadece insan gözüyle tespit edilir.
- <span id="kpi"></span>**KPI** (Key Performance Indicator): Temel performans göstergesi. Hedeflere ulaşılıp ulaşılmadığını ölçen metrik.
- <span id="kri"></span>**KRI** (Key Risk Indicator): Temel risk göstergesi. Risklerin gerçekleşme olasılığını önceden haber veren metrik.
- <span id="kriptografi"></span>**Kriptografi**: Şifreleme bilimi. Veriyi okunamaz hale getirip yalnızca yetkili kişinin açmasını sağlar.
- <span id="kripto-para"></span>**Kripto Para** (Bitcoin): İzlenmesi güç dijital para birimi. Fidye yazılımları ve dolandırıcılıkta ödeme olarak istenir; "Bitcoin gönder, ikiye katlarım" diyene asla inanma.
- <span id="kvkk"></span>**KVKK** (Kişisel Verilerin Korunması Kanunu): Türkiye'de kişisel verilerin işlenme ve korunma koşullarını düzenleyen yasa.

</details>

<details class="toc-block" markdown="block" id="letter-l">
<summary>L</summary>

- <span id="least-privilege"></span>**Least Privilege** (En Az Yetki): Bir kullanıcının veya sistemin yalnızca görevini yerine getirmek için gereken en düşük yetki seviyesine sahip olması prensibi.
- <span id="llm"></span>**LLM** (Large Language Model): ChatGPT, Claude, Gemini gibi büyük dil modelleri. Prompt injection, hallucination, veri sızıntısı gibi yeni güvenlik riskleri getirir.
- <span id="lockdown-mode"></span>**Lockdown Mode**: Kilitleme modu. iPhone'da yüksek riskli kullanıcılar için azaltılmış özellikli güvenlik modu.
- <span id="lotl"></span>**LotL** (Living off the Land): Sistemde halihazırda var olan yasal araçları (PowerShell, WMI, BitLocker vb.) kullanarak yapılan dosyasız saldırı. Zararlı yazılım indirmeden, sadece sistemin kendi araçlarıyla saldırma tekniği.

</details>

<details class="toc-block" markdown="block" id="letter-m">
<summary>M</summary>

- <span id="mac-adresi"></span>**MAC Adresi**: Cihazına özgü sabit ağ kimlik numarası. Modemde MAC filtreleme açarsan parola bilinse bile tanımsız cihaz ağa giremez.
- <span id="malware"></span>**Malware** (Kötü Amaçlı Yazılım): Virüs, trojan, fidye yazılımı, casus yazılım gibi zarar vermek amacıyla yazılmış tüm yazılımların ortak (şemsiye) adı.
- <span id="man-in-the-middle"></span>**Man-in-the-Middle**: Ortadaki adam saldırısı. İki taraf arasına girerek haberleşmeyi dinleme veya değiştirme.
- <span id="mass-assignment"></span>**Mass Assignment**: Framework'lerin form verisini otomatik modele ataması. Saldırgan forma `is_admin=true` eklerse admin olur. Whitelist/DTO ile önlenir.
- <span id="mdm"></span>**MDM** (Mobil Cihaz Yönetimi, İng. Mobile Device Management): Mobil cihaz yönetimi. Kurum içindeki mobil cihazları güvenlik politikalarıyla yöneten sistem.
- <span id="metadata"></span>**Metadata**: Veri hakkında veri. Dosyanın oluşturulma tarihi, yazarı, konumu gibi bilgiler.
- <span id="mfa"></span>**MFA** (Çok Faktörlü Doğrulama, İng. Multi-Factor Authentication): Çok faktörlü doğrulama. İkiden fazla doğrulama yöntemi kullanarak kimlik doğrulama. 2FA'nın daha kapsamlı halidir.
- <span id="model-poisoning"></span>**Model Poisoning**: LLM'in eğitim verisinin manipüle edilmesi. Model, belirli girdilerde kötü çıktı verir.
- <span id="mta-sts"></span>**MTA-STS** (MTA Strict Transport Security): E-posta transferinde TLS zorunluluğu. Downgrade saldırılarına karşı korur.
- <span id="mttd"></span>**MTTD** (Tespit Süresi, İng. Mean Time to Detect): Sızma ile tespit arası ortalama süre. Hedef: 24 saatten az.
- <span id="mttr"></span>**MTTR** (Müdahale Süresi, İng. Mean Time to Respond): Tespit ile izolasyon arası ortalama süre. Hedef: 1 saatten az.
- <span id="mvt"></span>**MVT** (Mobil Doğrulama Aracı): Uluslararası Af Örgütü'nün geliştirdiği, telefon yedekinden Pegasus ve benzeri casus yazılım izi arayan açık kaynak araç. Güvenilir bir uzmana çalıştır.

</details>

<details class="toc-block" markdown="block" id="letter-n">
<summary>N</summary>

- <span id="nonce"></span>**Nonce**: Şifrelemede her işlem için bir kez kullanılan rastgele sayı. AES-GCM'de nonce tekrar edilirse şifreleme tamamen kırılır.

</details>

<details class="toc-block" markdown="block" id="letter-o">
<summary>O</summary>

- <span id="oauth"></span>**OAuth 2.0**: Bir uygulamanın başka bir uygulama adına hareket etmesine izin veren yetki protokolü. "Bu uygulamaya senin adına tweet atma izni veriyor musun?" mantığı.
- <span id="oidc"></span>**OIDC** (OpenID Connect): OAuth 2.0'ın üzerine inşa edilmiş kimlik doğrulama katmanı. "Bu kişi gerçekten kim olduğunu iddia ettiği kişi mi?" sorusunu yanıtlar.
- <span id="olay-mudahale"></span>**Olay Müdahale** (Incident Response): Güvenlik olayı gerçekleştiğinde uygulanan planlı müdahale süreci. Tespit, kontrol, iyileştirme ve sonuç çıkarma aşamalarını içerir.
- <span id="oltalama"></span>**Oltalama** (phishing): Sahte mesaj veya siteyle kandırmaca. Kişisel bilgilerini çalmak için güvenini suiistimal eder.
- <span id="omuz-sorfu"></span>**Omuz sörfü** (shoulder surfing): Omzundan bakarak parola veya PIN çalma. Herkese açık alanlarda dikkat et.
- <span id="owasp"></span>**OWASP** (Açık Web Uygulamaları Güvenlik Projesi, İng. Open Web Application Security Project): Web uygulamaları için güvenlik standartları ve çerçeveleri sunan açık kaynak kuruluş.

</details>

<details class="toc-block" markdown="block" id="letter-p">
<summary>P</summary>

- <span id="pasta"></span>**PASTA** (Process for Attack Simulation and Threat Analysis): Saldırı simülasyonu ve tehdit analizi sürecini tanımlayan tehdit modelleme çerçevesi.
- <span id="parametreli-sorgu"></span>**Parametreli Sorgu** (Parameterized Query): SQL enjeksiyonunu önleyen veritabanı sorgu yöntemi. Veri ile SQL komutunu ayrı işler; kullanıcı girdisi asla SQL kodu olarak yorumlanmaz.
- <span id="passkey"></span>**Passkey**: Parolanın yerini alan kriptografik kimlik doğrulama. Face ID/Touch ID ile cihazda private key, sunucuda public key. Phishing-proof.
- <span id="path-traversal"></span>**Path Traversal** (Dizin Geçişi): Saldırganın `../../etc/passwd` gibi yollarla yetkisiz dizinlere erişmesi. Dosya adı doğrulaması ve yol çözümlemesi ile önlenir.
- <span id="pegasus"></span>**Pegasus**: NSO Group tarafından geliştirilen ticari casus yazılım. Sıfır tıklamayla cihaza bulaşabilir.
- <span id="pharming"></span>**Pharming** (DNS Yönlendirme): Doğru adresi yazsan bile sahte siteye yönlendirildiğin en sinsi oltalama türü. Cihazının DNS ayarları zehirlenmiştir; tarayıcının HTTPS uyarılarını asla yoksayma.
- <span id="pkce"></span>**PKCE** (Proof Key for Code Exchange): Mobil ve tek sayfa uygulamalarında OAuth 2.0 güvenliğini artıran protokol. Her yetki isteği için dinamik secret üretir; 2024'ten beri zorunlu.
- <span id="prompt-injection"></span>**Prompt Injection**: LLM'e komut enjekte etme. SQL injection'un AI eşdeğeri. Indirect prompt injection en tehlikelisi — veriye gizlenmiş talimatlar.
- <span id="pretexting"></span>**Pretexting**: Önce bir hikaye uydurup sonra güvenini kazanarak bilgi çalma sosyal mühendislik yöntemi.
- <span id="profilleme"></span>**Profilleme** (Profiling): Dijital izlerinden senin psikoloji, alışkanlık ve tercihler hakkında profil çıkarma. Sonra bu profille sana hedefli reklam, sahte haber veya oltalama gösterilir.

</details>

<details class="toc-block" markdown="block" id="letter-q">
<summary>Q</summary>

- <span id="quid-pro-quo"></span>**Quid Pro Quo** (Bir Şey İçin Bir Şey): Saldırganın bir hizmet veya fayda sunup karşılığında bilgi istemesi. Sosyal mühendislik saldırı türüdür.

</details>

<details class="toc-block" markdown="block" id="letter-r">
<summary>R</summary>

- <span id="rbac"></span>**RBAC** (Role-Based Access Control): Rol bazlı erişim kontrolü. Kullanıcı yetkilerini roller üzerinden yönetme yöntemi.
- <span id="race-condition"></span>**Race Condition** (Yarış Durumu): İki işlemin aynı kaynağa aynı anda erişmesi sonucu oluşan güvenlik açığı. Örneğin rate limiting sayaçları birden çok işlemci arasında kilitlenmezse atlanabilir.
- <span id="rag"></span>**RAG** (Getirme Artırılmış Üretim, İng. Retrieval-Augmented Generation): LLM'e harici bilgi tabanından belge getirterek yanıt üretme. ACL'lere dikkat: kullanıcı yetkisiz belge görmemeli.
- <span id="rate-limiting"></span>**Rate Limiting** (Hız Sınırlandırma): Bir kullanıcının belirli süre içinde yapabileceği istek sayısını sınırlama. Brute force ve DDoS saldırılarına karşı ilk savunma hattı.
- <span id="red-team"></span>**Red Team** (Kırmızı Takım): Gerçek bir saldırgan gibi davranıp sisteme sızmaya çalışan denetim ekibi. Otomatik taramadan farklı olarak doğaçlama ve gerçek saldırı teknikleri kullanır.
- <span id="repudiation"></span>**Repudiation** (İnkar): Bir eylemin izlerini temizleyip sonradan inkar edilebilmesi. STRIDE tehdit kategorilerinden biri.
- <span id="risk"></span>**Risk**: Bir olayın olasılığı ve etkisinin birleşimi. Belirsizlik durumunda kayıp veya hasar oluşma ihtimali.
- <span id="rootkit"></span>**Rootkit**: İşletim sisteminin en derinine yerleşip antivirüsten gizlenen kötü amaçlı yazılım. Tespiti çok zordur; genelde devlet düzeyi casus yazılımlarla birlikte gelir.
- <span id="router"></span>**Router / Yönlendirici** (Modem): İnterneti eve dağıtan cihaz. Fabrika parolası "admin/admin" kalırsa saldırgan parola kırmadan tüm ağını ele geçirir.

</details>

<details class="toc-block" markdown="block" id="letter-s">
<summary>S</summary>

- <span id="saldiri-agaci"></span>**Saldırı Ağacı** (Attack Tree): Saldırı senaryolarını ağaç yapısında modelleme yöntemi.
- <span id="saldiri-vektoru"></span>**Saldırı Vektörü** (Attack Vector): Saldırganın hedefe ulaşmak için kullandığı yol veya yöntem. E-posta, USB, web sitesi gibi çeşitli vektörler vardır.
- <span id="salt"></span>**Salt** (Tuz): Parola hash'ine eklenen, her kullanıcı için benzersiz rastgele değer. Aynı parola farklı tuzlarla farklı hash üretir; böylece rainbow table saldırıları engellenir.
- <span id="sandbox"></span>**Sandbox** (Kum Havuzu): Şüpheli bir dosyayı güvenli, izole ortamda çalıştırma yöntemi. Dosya zararlı olsa bile gerçek sistemine sıçrayamaz.
- <span id="sast"></span>**SAST** (Static Application Security Testing): Kaynak kodu çalıştırmadan analiz eden güvenlik testi. Kodu tarar ve bilinen güvenlik açığı kalıpları arar.
- <span id="sca"></span>**SCA** (Software Composition Analysis): Projenin kullandığı üçüncü parti kütüphanelerdeki bilinen güvenlik açıklarını tarayan analiz yöntemi.
- <span id="sbom"></span>**SBOM** (Yazılım Bileşen Listesi, İng. Software Bill of Materials): Yazılımın "içindekiler etiketi". Hangi dependency, hangi sürüm, hangi license. Log4Shell gibi bir zafiyette hangi sistemlerde olduğu bilinir.
- <span id="scareware"></span>**Scareware** (Korkutma Yazılımı): Sahte uyarılarla kullanıcıyı korkutup gereksiz yazılım sat almaya ikna eden saldırı yöntemi.
- <span id="sdl"></span>**SDL** (Security Development Lifecycle): Güvenli yazılım geliştirme yaşam döngüsü. Microsoft tarafından geliştirilen, güvenliği yazılım sürecine entegre eden çerçeve.
- <span id="sdlc"></span>**SDLC** (Software Development Life Cycle): Yazılım geliştirme yaşam döngüsü. Yazılımın gereksinimden bakıma kadar geçtiği tüm aşamalar.
- <span id="secret-management"></span>**Secret Management** (Gizli Anahtar Yönetimi): API anahtarları, parolalar ve şifreleme anahtarlarının koda gömülmeden, güvenli biçimde saklanması ve yönetilmesi. Vault, KMS gibi araçlarla yapılır.
- <span id="sender-reputation"></span>**Sender Reputation** (Gönderen İtibarı): E-posta gönderen IP/domain için ISP'lerin tuttuğu güven puanı. Düşük skor = spam'a düşme.
- <span id="shadow-it"></span>**Shadow IT**: Çalışanların BT departmanından habersiz kullandığı yazılım, hizmet ve cihazlar. Güvenlik riskleri taşır.
- <span id="shared-responsibility"></span>**Shared Responsibility Model** (Sorumluluk Paylaşımı): Bulut sağlayıcı ve müşteri arasındaki sorumluluk paylaşımı. Sağlayıcı bulutun altyapısını, müşteri üzerindekileri korur.
- <span id="shift-left"></span>**Shift-Left** (Sola Kaydırma): Güvenliği sürecin en başına, yani tasarım ve geliştirme aşamasına çekme felsefesi. Hata ne kadar erken yakalanırsa düzeltme o kadar ucuz olur.
- <span id="sigstore"></span>**Sigstore**: Yazılım artifact'lerini imzalamak için modern araç seti. Cosign (imzalama), Rekor (transparency log), Fulcio (CA).
- <span id="siem"></span>**SIEM** (Güvenlik Bilgi ve Olay Yönetimi, İng. Security Information and Event Management): Güvenlik bilgi ve olay yönetimi. Sistem loglarını merkezi olarak toplayan ve analiz eden sistem.
- <span id="sim-swap"></span>**SIM swap**: Telefon numaranı başka bir SIM karta aktarıp hesaplarına erişme saldırısı.
- <span id="sizma-testi"></span>**Sızma Testi** (Pentest): Sistemin zafiyetlerini bulmak için etik hackerlara yaptırılan sahte saldırı. Hangi açığın gerçekten sömürülebilir olduğunu kanıtlar.
- <span id="slsa"></span>**SLSA** (Yazılım Tedarik Zinciri Seviyeleri, İng. Supply-chain Levels for Software Artifacts): Yazılım tedarik zinciri güvenlik seviyeleri. Seviye 1-4 arası, build sürecinin güvenliğini sertleştirir.
- <span id="smishing"></span>**Smishing** (SMS Oltalaması): SMS ile yapılan oltalama. "Kargon teslim edilemedi, tıkla" tarzı mesajlarla sahte siteye çekilirsin; mesajdaki kısa linke tıklama.
- <span id="soar"></span>**SOAR** (Security Orchestration, Automation and Response): Tekrarlayan güvenlik müdahale adımlarını otomatikleştiren araç.
- <span id="spear-phishing"></span>**Spear Phishing** (Hedefli Oltalama): Sana özel hazırlanan oltalama. Saldırgan senin hakkında bilgi toplamış, mesajı inandırıcı kılmış; siyasetçi ve üst düzey yöneticiler birinci hedeftir.
- <span id="spf"></span>**SPF** (Sender Policy Framework): "Benim domainimden sadece şu IP'ler mail atabilir" DNS kaydı.
- <span id="spoofing"></span>**Spoofing**: Kimlik taklidi. Telefon numarası, e-posta veya web adresini sahte gösterme.
- <span id="sql-injection"></span>**SQL Injection** (SQL Enjeksiyonu): Kullanıcı girdisinin SQL sorgusuna enjekte edilmesiyle veritabanına sızma saldırısı. Parametreli sorgu ile önlenir.
- <span id="ssid"></span>**SSID**: Wi-Fi ağının görünür adı. Ağı gizlemek yerine güçlü parola kullan; gizli ağ daha çok dikkat çeker, daha güvenli değildir.
- <span id="ssrf"></span>**SSRF** (Sunucu Taraflı İstek Sahteciliği, İng. Server-Side Request Forgery): Saldırganın sunucuyu kandırarak iç ağa veya bulut metadata servislerine istek göndermesi. Sunucu güvenlik duvarının içerisindedir; bu güvenlik avantajı kötüye kullanılır.
- <span id="stride"></span>**STRIDE**: Microsoft tarafından geliştirilen tehdit modelleme çerçevesi. Altı tehdit kategorisini tanımlar.
- <span id="sulama-deligi"></span>**Sulama Deliği** (Watering Hole): Sık kullandığın web sitesinin zehirlenip sana otomatik zararlı bulaştırılması. Hedefe doğrudan gitmek yerine yolunun üstünde pusu kurar.

</details>

<details class="toc-block" markdown="block" id="letter-t">
<summary>T</summary>

- <span id="tailgating"></span>**Tailgating**: Arkana takılma. Fiziksel güvenliği aşmak için yetkisiz kişinin senin peşinden geçmesi.
- <span id="tails"></span>**Tails**: USB'ye kurulan ve bilgisayarda hiç iz bırakmayan işletim sistemi. USB'yi çıkarınca ne yaptığın unutulur; gazeteci ve aktivistlerin yüksek riskli aracı.
- <span id="tampering"></span>**Tampering** (Veri Bozma): Verinin yetkisiz bir kişi tarafından değiştirilmesi. STRIDE tehdit kategorilerinden biri.
- <span id="tabletop"></span>**Tabletop Exercise** (Masa Başı Tatbikatı): IR ekibinin bir senaryo üzerinden sözlü olarak müdahale tatbikatı. Yılda en az 2 önerilir.
- <span id="tck"></span>**TCK** (Türk Ceza Kanunu): Bilişim suçlarını ve cezalarını düzenleyen temel yasa. Bilişim alanındaki suçlar TCK'nın çeşitli maddelerinde tanımlanır.
- <span id="tedarik-zinciri"></span>**Tedarik Zinciri Saldırısı** (Supply Chain Attack): Saldırganın hedef kuruma ulaşmak için önce kurumun tedarikçilerinden veya üçüncü taraf servislerinden birini hedef aldığı saldırı türü.
- <span id="tehdit-agaci"></span>**Tehdit Ağacı** (Threat Tree): "Ne olabilir?" sorusuna odaklanan, tehditleri stratejik düzeyde modelleme yöntemi.
- <span id="threat-model"></span>**Threat model**: Tehdit modeli. Seni kim, ne amaçla, hangi yöntemle hedef alabilir sorusunun analizi.
- <span id="timing-attack"></span>**Timing Attack** (Zamanlama Saldırısı): Bir işlemin süresini ölçerek gizli bilgi çıkarma saldırısı. Örneğin parola karşılaştırmasının süresi, doğru karakter sayısını ele verebilir. Sabit süreli karşılaştırma ile önlenir.
- <span id="tls-rpt"></span>**TLS-RPT** (TLS Reporting): E-posta TLS hatalarını raporlayan mekanizma. MTA-STS ile birlikte kullanılır.
- <span id="tor"></span>**Tor**: İnternet trafiğini dünyadaki birçok bilgisayardan geçirip kimliğini gizleyen tarayıcı ve ağ. Yavaştır; günlük değil, kaynak koruma gibi özel durumlar içindir.
- <span id="totp"></span>**TOTP** (Zamana Bağlı Tek Kullanımlık Parola, İng. Time-based One-Time Password): Zamana bağlı tek kullanımlık parola. Google Authenticator gibi uygulamaların ürettiği 6 haneli koddur; 30 saniyede bir değişir.
- <span id="trojan"></span>**Trojan** (Truva Atı): Faydalı bir program gibi görünüp içinde zararlı taşıyan yazılım. "Ücretsiz oyun", "video indirici", "hızlandırıcı" kılığında gelir.
- <span id="typosquatting"></span>**Typosquatting**: Yaygın paket adlarına benzer sahte paketler. `requests` yerine `request` gibi. Yorgun geliştirici yanlış yazınca kötü amaçlı kod yüklenir.

</details>

<details class="toc-block" markdown="block" id="letter-u">
<summary>U</summary>

- <span id="uçtan-uca"></span>**Uçtan Uca Şifreleme** (End-to-End Encryption): Mesajı sadece senin ve alıcının okuyabildiği, aradaki sunucunun (şirketin bile) göremediği şifreleme. Signal'de varsayılan; Telegram'da ancak "gizli sohbet" ile açılır.

</details>

<details class="toc-block" markdown="block" id="letter-v">
<summary>V</summary>

- <span id="verbis"></span>**VERBİS**: Kişisel Verileri İşleyen Veri Sorumluları Sicili. KVKK kapsamında veri sorumlularının kayıt yaptırmak zorunda olduğu sistem.
- <span id="vault"></span>**Vault**: Gizli anahtarları (API key, parola, şifreleme anahtarı) merkezi ve güvenli biçimde saklayan sistem. HashiCorp Vault en bilinen örnektir. Anahtarlar koda gömülmez, Vault'tan dinamik olarak alınır.
- <span id="veri-brokeri"></span>**Veri Brokerı**: Senin hakkında toplanan verileri toplayıp satan şirket. Adını hiç duymadığın firmalar profilini alıp satıyor; çıkış talep edebilirsin.
- <span id="veri-ihlali"></span>**Veri İhlali** (Data Breach): Kişisel verilerin yetkisiz kişilerin eline geçmesi. KVKK kapsamında kurum, ihlali en kısa sürede ilgili kişilere ve Kurul'a bildirmek zorundadır.
- <span id="veri-minimizasyonu"></span>**Veri Minimizasyonu**: Kişisel verilerin işleme amacıyla sınırlı olarak, olabildiğince az toplanması prensibi.
- <span id="veri-sorumlusu"></span>**Veri Sorumlusu**: Kişisel verilerin işleme amaçlarını ve yöntemlerini belirleyen ve veri kayıt sistemini kuran kişi veya kurum.
- <span id="virüs"></span>**Virüs**: Dosyalara bulaşan, onları değiştiren ve kendini kopyalayan klasik kötü amaçlı yazılım. Genelde bir dosyayı açınca çalışır; günümüzde azaldı ama hâlâ var.
- <span id="vishing"></span>**Vishing** (Sesli Oltalama): Telefonla yapılan oltalama. Arayan banka, polis veya teknik destek rolü oynar; numara sahtelenebilir. Kapat, resmi numarayı sen tuşla.
- <span id="vpn"></span>**VPN** (Virtual Private Network): Sanal özel ağ. İnternet trafiğini şifreleyerek üçüncü taraflardan gizler.

</details>

<details class="toc-block" markdown="block" id="letter-w">
<summary>W</summary>

- <span id="whaling"></span>**Whaling** (Balina Avlama): Üst düzey yöneticilere (CEO, bakan, genel müdür) yapılan hedefli oltalama. Spear phishing'in en üstü; inandırıcılığı ve hasarı daha büyüktür.
- <span id="webauthn"></span>**WebAuthn**: W3C standardı, Passkeys'in temel API'si. Tarayıcıdan parolasız kimlik doğrulama.
- <span id="wpa"></span>**WPA2 / WPA3**: Wi-Fi ağının şifreleme standartları. Modem ayarında bunlardan biri olsun; eski WEP ise dakikalar içinde kırılır.
- <span id="wps"></span>**WPS**: Modeme tuşa basarak hızlı bağlanma özelliği. Kırılması kolaydır; güvenlik için modem arayüzünden kapat.

</details>

<details class="toc-block" markdown="block" id="letter-x">
<summary>X</summary>

- <span id="xss"></span>**XSS** (Cross-Site Scripting): Siteler arası betik çalıştırma. Saldırganın web sayfasına JavaScript kodu enjekte etmesi. Kullanıcının tarayıcısı o kodu sayfanın parçası sanır ve çalıştırır; çerezler çalınabilir, oturum ele geçirilebilir.

</details>

<details class="toc-block" markdown="block" id="letter-z">
<summary>Z</summary>

- <span id="zafiyet"></span>**Zafiyet** (Vulnerability): Bir sistemdeki güvenlik açığı.
- <span id="zero-click"></span>**Zero-click**: Sıfır tıklama açığı. Kullanıcı hiçbir şey yapmadan cihaza bulaşan saldırı.
- <span id="zero-day"></span>**Zero-day**: Sıfırıncı gün açığı. Üreticinin henüz farkında olmadığı veya yaması çıkmamış güvenlik açığı.
- <span id="zero-trust"></span>**Zero Trust** (Sıfır Güven): "Asla güvenme, sürekli doğrula" felsefesi. Klasik sınır güvenliğinin (firewall, VPN) aksine, her erişim isteğini her seferinde doğrular. NIST SP 800-207 standardı.
- <span id="ztna"></span>**ZTNA** (Sıfır Güven Ağ Erişimi, İng. Zero Trust Network Access): VPN'in yerini alan modern erişim mimarisi. Tüm ağ yerine, uygulama düzeyinde erişim. Cloudflare Access, Zscaler, Netskope örnek.

</details>
