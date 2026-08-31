---
layout: project
title: "Siber Güvenlik Sözlüğü"
nav_title: Sözlük
permalink: /sozluk/
---

<details class="toc-block" markdown="block" id="letter-sayi">
<summary>Sayılar</summary>

- <span id="2fa"></span>**2FA** (Two-Factor Authentication): İkinci doğrulama adımı. Parolanın yanında ek bir kanal kullanarak hesabına erişimi sağlama yöntemi.
- <span id="3-2-1"></span>**3-2-1 Yedekleme Kuralı**: Yedekleme altın kuralı: 3 kopya, 2 farklı ortam, 1 kopya başka konumda. Fidye yazılımı canlı veriyi ve ağdaki yedeği de şifreler; off-site kopya son savunmandır.
- <span id="3-way-handshake"></span>**3-Way Handshake** (Üç Yönlü El Sıkışma): TCP bağlantısının SYN → SYN/ACK → ACK üçlüsüyle kurulması. Half-open tarama üçüncü paketi göndermez: kapıyı çalar, içeri girmez.
- <span id="802-11"></span>**802.11**: Kablosuz yerel ağların (Wi-Fi) IEEE standardı; Ethernet'in (802.3) kablosuz karşılığı. Çerçeveleri üç sınıftır: Management (keşif/bağlantı), Control (onay), Data (kullanıcı verisi); Beacon ve deauth bu ailenin üyeleridir.

</details>

<details class="toc-block" markdown="block" id="letter-a">
<summary>A</summary>

- <span id="token-manipulasyonu"></span>**Access Token Manipulation**: Çalınan ya da başkasına ait erişim token'ıyla işlem yapma; çalınan anahtarla kilit açma oyunu. ATT&CK'in klasik yetki yükseltme tekniğidir.
- <span id="active-directory"></span>**Active Directory** (AD): Windows ortamının dizin ve kimlik servisi; kullanıcı, grup ve bilgisayar hesaplarını LDAP ile saklar, Kerberos ile kimlik doğrular. Saldırganın birincil hedefidir: AD'yi ele geçiren, alanı ele geçirir.
- <span id="active-passive-mode"></span>**Active / Passive Mode** (FTP): FTP veri kanalının yönü: active mode'da sunucu istemciye bağlanır (PORT), passive mode'da istemci sunucunun bildirdiği rastgele porta bağlanır (PASV). Firewall ve NAT arkasında passive mode sorunsuz çalışır.
- <span id="adversary-emulation"></span>**Adversary Emulation** (Düşman Taklidi): Gerçek bir tehdit aktörünün taktik ve tekniklerini, MITRE ATT&CK eşlemesiyle adım adım canlı olarak yeniden oynatma. Amaç, savunmanın gerçek bir saldırgana karşı ne kadar görünürlüğü olduğunu kanıtlamaktır.
- <span id="adware"></span>**Adware** (Reklam Yazılımı): Sana sürekli reklam açan, tarayıcıyı yönlendiren ve cihazını yavaşlatan yazılım. Can sıkıcı görünür ama asıl işi seni izleyip verini toplamaktır.
- <span id="aes"></span>**AES** (Advanced Encryption Standard): Simetrik şifrelemenin günümüz standardı; 128/192/256 bit anahtarla blok blok şifreler. TLS'in gözde şifresi AES-256-GCM'dir; kırıldığı için değil, anahtarı çalındığı için düşer.
- <span id="air-gap"></span>**Air Gap** (Fiziksel İzolasyon): Hedef ağı internet'ten ve diğer ağlardan tamamen koparma. En sıkı izolasyon bile USB belleğe ve insider'a dayanamaz — Stuxnet'in dersi.
- <span id="alan-adi"></span>**Alan Adı** (Domain): İnternette bir sitenin adresi (turkiye.gov.tr gibi). Sahte adresler oltalamanın en sık yoludur; giriş yapmadan önce adresi harf harf kontrol et.
- <span id="amplification"></span>**Amplification** (Yükseltme Saldırısı): Sahte kaynak IP ile küçük bir UDP sorgusu gönderip, kurbanın adresine çok daha büyük yanıt döndürtme. DNS, NTP ve SNMP en yaygın vektörlerdir; az çabayla büyük DDoS üretir.
- <span id="anonimilestirme"></span>**Anonimleştirme** (Anonymization): Kişisel verinin, ek bilgilerle birleştirilse bile artık kişiye bağlanamayacak hale getirilmesi. KVKK ve GDPR bunu teknik gereklilik sayar; sadece ismi silmek (pseudonimleştirme) yetmez.
- <span id="antivirus"></span>**Antivirüs** (AV): İmza ve buluşmacı (heuristik) taramayla bilinen zararlıları yakalayan klasik uç nokta savunması. Fileless ve LotL tekniklerinde devre dışı kalır; yerine EDR geçer.
- <span id="api"></span>**API** (Application Programming Interface): Bir yazılımın başka yazılıma açtığı sözleşmeli kapı. Token'la korunur; kimlik doğrulaması doğru da olsa yetki kontrolü yanlışsa her kapı açık demektir.
- <span id="apk"></span>**APK** (Android Package): Resmi mağaza (Play Store, App Store) dışından dosya olarak indirilen Android uygulaması. Denetimden geçmez; en yaygın casus yazılım bulaşma yoludur.
- <span id="apt"></span>**APT** (Advanced Persistent Threat): Gelişmiş sürekli tehdit. Uzun süreli, hedefli ve karmaşık siber saldırı.
- <span id="arp"></span>**ARP** (Address Resolution Protocol): Ağda IP adresini MAC adresine çeviren protokol; yerel ağda "bu IP kimin?" sorusunun cevabıdır. Yerel ağ saldırılarının çoğu buradan başlar.
- <span id="arp-cache"></span>**ARP Cache** (ARP Önbelleği): Cihazın öğrendiği IP-MAC eşleşmelerini sakladığı geçici tablo. `arp -a` ile görüntülenir; zehirlenmiş cache, MITM saldırısının ayak izidir.
- <span id="authoritative-dns"></span>**Authoritative DNS** (Yetkili DNS Sunucusu): Bir alan adının nihai cevabını veren sunucu; kayıtların asıl sahibi. Recursive sunucu bilmiyorsa en son ona sorar — verdiği cevap bağlayıcıdır.
- <span id="arp-spoofing"></span>**ARP Spoofing** (ARP Zehirlenmesi): Saldırganın kendisini ağ geçidiymiş gibi tanıtıp trafiği üzerinden geçirdiği yerel ağ saldırısı. Aynı L2 ağda olmak yeterlidir; HTTPS ve statik ARP kayıtları korur.

</details>

<details class="toc-block" markdown="block" id="letter-b">
<summary>B</summary>

- <span id="backdoor"></span>**Backdoor** (Arka Kapı): Saldırganın sisteme sonradan kolayca dönmesini sağlayan gizli giriş. Öncü indiricisi (downloader) C2'den çeker ve ikinci aşamayı (implant/RAT) yerleştirir.
- <span id="badusb"></span>**BadUSB**: Sıradan USB bellek gibi görünüp takıldığında klavye gibi davranan sahte cihaz. Saniyeler içinde cihazına zararlı yükler. Bulduğun USB'yi asla takma.
- <span id="baiting"></span>**Baiting** (Yemleme): Kurbanı bir ödül veya merak uyandıran dosyayla kandırma. Sosyal mühendislik yöntemlerinden biridir.
- <span id="base64"></span>**base64**: İkili veriyi ASCII metne çeviren kodlama; şifreleme DEĞİL. SMTP AUTH LOGIN kimlikleri ve e-posta ekleri bu formatta taşınır; `base64 -d` ile anında geri çözülür.
- <span id="baseline"></span>**Baseline** (Referans Profil): Bir ağın veya sistemin "normal" halinin ölçülmüş profili. Anomali tespiti normali bilmekle başlar; saldırı, baseline'dan sapma olarak görünür.
- <span id="beacon"></span>**Beacon** (Fener): Ele geçirilmiş cihazın C2 sunucusuna düzenli aralıklarla gönderdiği haberleşme sinyali. Düşük jitter'lı (zamanlama sapması az) düzenli trafik, tipik imzasıdır.
- <span id="bec"></span>**BEC** (İş e-postası dolandırıcılığı, İng. Business Email Compromise): Kurumsal e-posta dolandırıcılığı. Saldırgan CEO/CFO taklidi yaparak para transferi sağlar. 2023'te dünya çapında 2.9 milyar dolar kayıp.
- <span id="bilgi-savasi"></span>**Bilgi Savaşı** (Information Warfare): Bilgiyi silah gibi kullanma sanatı: dezenformasyon, siber saldırı ve algı operasyonlarının toplamı. Hibrit harbin en görünür cephesidir; hedef makine değil zihindir.
- <span id="bimi"></span>**BIMI** (Brand Indicators for Message Identification): DMARC geçerli maillerde marka logosunun gösterilmesi. DMARC `p=reject` ile birlikte kullanılır.
- <span id="biyometrik"></span>**Biyometrik**: Parmak izi, yüz tanıma gibi sana özgü bedensel özelliklerle kimlik doğrulama. Pratiktir ama uykuda yüzüne tutarak açabilir; parolanla birlikte kullan.
- <span id="blue-team"></span>**Blue Team** (Mavi Takım): Savunma tarafı; SOC, izleme ve olay müdahalesini yürüten ekip. Red Team saldırır, Blue Team korur, Purple Team ikisini aynı masaya oturtur.
- <span id="bot"></span>**Bot**: Otomatik yazılım. Hesapları taklit ederek sahte etkileşim üretir. Botlar yönlendirme, propaganda ve spam amaçlı kullanılır.
- <span id="botnet"></span>**Botnet**: Ele geçirilmiş ve tek komutaya (C2) bağlı binlerce cihazdan oluşan ordu. Spam, DDoS ve kimlik bilgisi çalmada kiralık güçtür; C2 kapatılınca ölür.
- <span id="bpf"></span>**BPF** (Berkeley Packet Filter): tcpdump ve Wireshark yakalama filtrelerinin kullandığı dil; protokol alanlarına değil ham bayt ofsetlerine dayanır ve çekirdek seviyesinde çalıştığı için çok hızlıdır.
- <span id="broadcast-unicast-multicast"></span>**Broadcast / Unicast / Multicast**: Mesajlaşma tipleri: unicast tek cihaza, broadcast ağdaki herkese (ff:ff:ff:ff:ff:ff), multicast yalnız üye gruba. ARP request broadcast, reply unicast'tir; IPv6'da broadcast yoktur, multicast vardır.
- <span id="brute-force"></span>**Brute Force** (Deneme Yanılma): Tüm olası parola kombinasyonlarını otomatik deneyerek parolanı kırmaya çalışma. Kısa parola dakikalar içinde kırılır; 12+ karaktere karşı yüzyıllar gerekir.
- <span id="byod"></span>**BYOD** (Bring Your Own Device): Çalışanların kişisel cihazlarını iş amaçlı kullanması. Güvenlik politikaları gereği dikkatle yönetilmelidir.

</details>

<details class="toc-block" markdown="block" id="letter-c">
<summary>C</summary>

- <span id="c2"></span>**C2** (Command and Control): Ele geçirilen cihazları yöneten saldırgan komuta altyapısı. Komutlar HTTP(S), DNS ve IRC (eski sohbet protokolü) içinde gizlenebilir; kill chain'in kalbi burada atar.
- <span id="certificate-authority"></span>**CA** (Sertifika Otoritesi): Dijital sertifikaları veren ve imzalayan güven kökü. Tarayıcının kök CA listesi olmadan HTTPS güveni olmaz; yanlış CA'ya güven tüm zinciri zehirler.
- <span id="casus-yazilim"></span>**Casus yazılım** (spyware): Cihazını izleyen, ses kaydeden, ekran okuyan gizli yazılım.
- <span id="certificate-pinning"></span>**Certificate Pinning** (Sertifika Sabitleme): Mobil uygulamanın sadece belirli sertifikaları kabul etmesi. MITM (ortadaki adam) saldırılarını engeller.
- <span id="checksum"></span>**Checksum** (Sağlama Toplamı): Paket içeriğinin bütünlüğünü doğrulayan matematiksel kontrol değeri. IP, TCP ve UDP'nin kendi checksum'ları vardır; ağ kartının hesaplamayı devralması (offloading) yüzünden yakalama anında "bad checksum" görünmesi her zaman gerçek hata değildir.
- <span id="cia"></span>**CIA** (Confidentiality, Integrity, Availability): Bilgi güvenliğinin üç temel ilkesi. Gizlilik, bütünlük, erişilebilirlik.
- <span id="ci-cd"></span>**CI/CD** (Continuous Integration / Continuous Deployment): Sürekli entegrasyon ve sürekli dağıtım. Kodun yazıldığı andan üretime çıkana kadar otomatik test ve dağıtım sürecini yöneten sistem.
- <span id="cipher-suite"></span>**Cipher Suite** (Şifre Takımı): TLS bağlantısında kullanılacak algoritma takımı: anahtar değişimi (ECDHE), kimlik doğrulama (RSA), toplu şifre (AES-GCM) ve hash (SHA384). İstemci listeler, sunucu seçer; RC4, DES ve 3DES (eski blok şifreler) içerenler zayıftır.
- <span id="cleartext-protocol"></span>**Cleartext Protocol** (Şifresiz Protokol): FTP, HTTP, SMTP gibi içeriği şifrelemeden taşıyan protokoller. Kimlik bilgileri kablodan düz metin geçer; dinleyen herkes okuyabilir.
- <span id="cloud-misconfiguration"></span>**Cloud Misconfiguration** (Bulut Yanlış Yapılandırması): Bulut kaynaklarının yanlış ayarlanması. Public S3 bucket, geniş IAM policy, açık yönetim portları en yaygın örnekler. İhlallerin %95'i bu nedenden.
- <span id="codec"></span>**Codec** (Kodlayıcı/Çözücü): Sesin/görüntünün sıkıştırılmış paketlere kodlanma biçimi. G.711 (PCMU/PCMA, 64 kbps) kaliteli, G.729 düşük bant genişliklidir; çağrının codec'i SIP INVITE içindeki SDP (oturum tanımı) bölümünde bildirilir.
- <span id="coloring-rules"></span>**Coloring Rules** (Renklendirme Kuralları): Wireshark'ın paketleri display filter'lara göre otomatik renklendirdiği kural sistemi. Kurallar yukarıdan aşağı değerlendirilir, ilk eşleşen kazanır; "Bad TCP" kırmızısı retransmission'ları hemen ele verir.
- <span id="command-injection"></span>**Command Injection** (Komut Enjeksiyonu): Web uygulamasının kullanıcı girdisini sistem komutuna eklemesi sonucu saldırganın `;` ve `|` gibi karakterlerle kendi komutunu çalıştırması. SQL injection'ın kabuk (shell) kardeşi; parametreli çağrı ve girdi doğrulamasıyla önlenir.
- <span id="community-string"></span>**Community String**: SNMP'nin parola yerine geçen eski kimliği; v1/v2'de düz metindir ve çoğu cihazda hâlâ "public" durur. Değiştirilmeyen string, açık kapı demektir.
- <span id="conversations-endpoints"></span>**Conversations / Endpoints** (Konuşmalar / Uç Noktalar): Wireshark istatistikleri: Conversations iki cihaz arasındaki trafiği (kim kime kaç bayt), Endpoints tek cihazın toplamını listeler. Baseline ve veri sızdırma analizinin ilk durağıdır (tshark: `-z conv,tcp`).
- <span id="cors"></span>**CORS** (Cross-Origin Resource Sharing): Bir web sitesinin başka bir alan adından API istekleri yapmasına izin veren tarayıcı mekanizması. Yanlış yapılandırılırsa saldırgan siteler senin API'ne erişebilir.
- <span id="covert-channel"></span>**Covert Channel** (Örtülü Kanal): Bir protokolün tasarım amacı dışında kullanılmasıyla kurulan gizli haberleşme kanalı: ICMP payload'ına, DNS subdomain'ine gömülü veri gibi. Firewall kuralına uyar ama içerik kaçak taşır.
- <span id="credential-dumping"></span>**Credential Dumping** (Kimlik Bilgisi Dökümü): Sistemden parola ve hash'leri toplama: SAM veritabanı, Windows kimlik süreci (LSASS) belleği, /etc/shadow. Mimikatz'ın doğduğu iştir; dump alınca pass-the-hash kapısı açılır.
- <span id="credential-stuffing"></span>**Credential Stuffing** (Kimlik Bilgisi Doldurma): Daha önce sızdırılmış parola listelerini alıp başka sitelerde otomatik deneme saldırısı. Aynı parolayı birden çok yerde kullanıyorsan hesabın saniyeler içinde açılır.
- <span id="cron"></span>**cron / crontab**: Unix'in zamanlanmış görev servisi. Meşru bir kalıcılık noktasıdır: `crontab -l` ile anomali avlanır, bilinmeyen satır şüphedir.
- <span id="csp"></span>**CSP** (İçerik Güvenliği Politikası, İng. Content-Security-Policy): Tarayıcının hangi kaynaklardan içerik yükleyebileceğini belirten HTTP başlığı. XSS saldırılarını kısıtlar.
- <span id="cspm"></span>**CSPM** (Bulut Güvenliği Duruş Yönetimi, İng. Cloud Security Posture Management): Bulut hesabını sürekli tarayıp yanlış yapılandırmaları raporlayan araç. Prowler, ScoutSuite, Wiz örnek.
- <span id="csrf"></span>**CSRF** (Siteler Arası İstek Sahteciliği, İng. Cross-Site Request Forgery): Siteler arası istek sahteciliği. Saldırganın, kullanıcının haberi olmadan tarayıcısından senin sitene istek göndermesi. CSRF token ve SameSite (çerezin site dışına gönderimini engelleyen öznitelik) ile önlenir.
- <span id="ctf"></span>**CTF** (Capture the Flag): Gizlenmiş bayrağı (flag) bulmayı hedefleyen güvenlik yarışması. Jeopardy ve attack-defense formatları vardır; öğrenmenin en oyunbaz hali.
- <span id="cti"></span>**CTI** (Cyber Threat Intelligence): Siber tehdit istihbaratı; saldırganların kim, ne yapar, nasıl yapar sorularına kanıtla dayalı cevap üreten disiplin. Çıktıları IOC, TTP ve aktör profilleridir.
- <span id="cyber-range"></span>**Cyber Range** (Siber Eğitim Sahası): Gerçek saldırı-savunma senaryolarının izole ortamda canlı olarak oynandığı eğitim ve tatbikat sahası. Askeri tatbikatın siber karşılığıdır; "canlı ateş" (live-fire) antrenmanı burada yapılır.
- <span id="cerezi"></span>**Çerez** (Cookie): Sitelerin tarayıcına bıraktığı seni tanımaya yarayan küçük dosyalar. Çalınırsa parolan olmadan hesabına girilebilir; üçüncü taraf çerezlerini engelle.

</details>

<details class="toc-block" markdown="block" id="letter-d">
<summary>D</summary>

- <span id="dast"></span>**DAST** (Dinamik Uygulama Güvenlik Testi, İng. Dynamic Application Security Testing): Çalışan uygulamayı dışarıdan tarayarak güvenlik açığı arayan test yöntemi. Kaynak koda ihtiyaç duymaz, uygulamaya HTTP istekleri gönderir.
- <span id="ddos"></span>**DDoS** (Distributed Denial of Service): Dağıtık hizmet engelleme. Binlerce cihazdan aynı anda gelen trafikle bir siteyi çökertme.
- <span id="deauthentication"></span>**Deauthentication** (Deauth): Wi-Fi cihazını ağdan zorla koparan 802.11 yönetim çerçevesi. Saldırgan sahte deauth yağdırıp kurbanı yeniden bağlanmaya zorlar; amaç, WPA 4-way handshake'i yakalayıp şifreyi çevrimdışı kırmaktır.
- <span id="deepfake"></span>**Deepfake** (Derin Sahte): Yapay zekayla üretilmiş sahte görüntü veya ses. Kişilerin yüzünü veya sesini taklit eder.
- <span id="dependency-confusion"></span>**Dependency Confusion** (Bağımlılık Karışıklığı): Public ve private package isim çakışması sömürüsü. Saldırgan public registry'de aynı isimle yüksek sürüm yayınlar, build'iniz kötü amaçlı kodu çeker.
- <span id="des"></span>**DES** (Data Encryption Standard): 1970'lerin ABD standart blok şifresi; 56 bitlik anahtarı bugün saatler içinde kırılır. 3DES onu üç kez çevirerek ömrünü uzattı; ikisi de terk edildi.
- <span id="deserialization"></span>**Deserialization** (Ters Serileştirme): Verinin nesneye dönüştürülmesi. Güvenilmeyen veri ile yapıldığında (Python pickle, PHP unserialize, Java ObjectInputStream) uzaktan kod çalıştırmaya yol açar. JSON + şema doğrulama güvenli alternatif.
- <span id="destination-unreachable"></span>**Destination Unreachable** (Hedefe Ulaşılamıyor): ICMP Type 3 hata mesajı: "hedefe ulaşılamadı". Kodları nedeni söyler: ağ yok (0), cihaz yok (1), port kapalı (3). Firewall'lar genelde sessizce düşürür; dönüyorsa ya gerçek sorun ya da ICMP döndüren güvenlik duvarıdır.
- <span id="devsecops"></span>**DevSecOps**: Geliştirme (Dev), güvenlik (Sec) ve operasyon (Ops) süreçlerini birleştiren yaklaşım. Güvenlik testlerinin kod yazımından üretime kadar otomatik çalışmasını sağlar.
- <span id="dezenformasyon"></span>**Dezenformasyon**: Bilerek üretilip yayılan yanlış bilgi; yanlışlıkla yayılanına misinformation denir. Bot hesaplarla çoğaltılır, hedef algıdır; panzehiri medya okuryazarlığıdır.
- <span id="dfd"></span>**DFD** (Data Flow Diagram): Veri akış diyagramı. Verinin sistem içinde nasıl hareket ettiğini gösteren diyagram, tehdit modellemenin temel aracı.
- <span id="dfir"></span>**DFIR** (Digital Forensics & Incident Response): Dijital adli bilişim + olay müdahalesi ikilisi. Delil toplayan ve aynı anda saldırıyı durduran disiplindir; şüphe ile kanıt arasındaki köprü.
- <span id="dhcp"></span>**DHCP** (Dynamic Host Configuration Protocol): Ağa katılan cihaza IP adresi, ağ geçidi ve DNS atayan protokol. DORA (Discover, Offer, Request, Acknowledge) döngüsüyle çalışır; sahte DHCP sunucusu trafiği kendine çeker.
- <span id="differential-privacy"></span>**Differential Privacy** (Diferansiyel Gizlilik): Veri setinden istatistik üretirken bireysel gizliliği matematiksel garantide koruyan yöntem. Eklenen gürültüyle tek bir kişinin verisi sonucu belirgin biçimde değiştiremez.
- <span id="diffie-hellman"></span>**Diffie-Hellman** (Anahtar Değişim Protokolü): İki tarafın dinlenebilir bir kanalda, gizliyi hiç paylaşmadan ortak anahtar türetmesini sağlayan anahtar değişim protokolü. Eliptik eğri varyantı ECDHE'dir; TLS ve PFS'in bel kemiğidir.
- <span id="dijital-adli-bilisim"></span>**Dijital Adli Bilişim** (Computer Forensics): Delil bütünlüğünü bozmadan cihaz ve disklerden kanıt toplama, analiz ve raporlama disiplini. Hash ile mühürleme ve delil zinciri (chain of custody) olmazsa olmazdır.
- <span id="dijital-ayak-izi"></span>**Dijital Ayak İzi**: İnternette her tıklaman, araman, gezdiğin sayfayla bıraktığın izlerin toplamı. Bu izlerden senin dijital kopyan çıkar; izlerini bilerek bırak.
- <span id="dijital-miras"></span>**Dijital Miras** (Digital Legacy): Birinin vefatından sonra hesapları, fotoğrafları, alan adları ve dijital varlıklarının akıbeti. Parolalar kimseyle paylaşılmadıysa miras kaybolur; bir emanet planı gerekir.
- <span id="disassembly"></span>**Disassembly** (Makine Kodu Sökümü): Derlenmiş binary'yi komut komut okunabilir hale getirme; tersine mühendisliğin ilk adımı. IDA, Ghidra ve radare2 bu işin marangozlarıdır.
- <span id="display-capture-filter"></span>**Display / Capture Filter** (Görüntüleme / Yakalama Filtresi): Wireshark'ın iki filtre dili: capture filter yakalama anında (BPF sözdizimiyle) süzer, display filter yakalananlar arasında (protokol alanlarıyla) süzer. Expert Info ise Wireshark'ın trafik hakkındaki otomatik yorumudur.
- <span id="dkim"></span>**DKIM** (DomainKeys Identified Mail): E-postaya kriptografik imza ekleyen standart. Alıcı, DNS'te yayınlanan public key ile imzayı doğrular.
- <span id="dlp"></span>**DLP** (Data Loss Prevention): Veri sızıntısını önleme. Hassas verilerin kurum dışına yetkisiz olarak gönderilmesini veya kopyalanmasını engelleyen teknoloji.
- <span id="dmarc"></span>**DMARC** (Domain-based Message Authentication, Reporting and Conformance): SPF ve DKIM'e dayalı e-posta kimlik doğrulama politikası katmanı. "Geçersiz mail ne yapalım?" sorusuna cevap verir (none/quarantine/reject).
- <span id="dmz"></span>**DMZ** (Tampon Bölge): İç ağ ile internet arasına yerleştirilen bölge; dışa açık sunucular (web, mail) burada çalışır. İç ağa sızmak için önce DMZ geçilir — derinlikli savunmanın ilk hendeği.
- <span id="dns"></span>**DNS** (Domain Name System): Alan adı sistemi. Web adreslerini IP adreslerine çeviren telefon rehberi gibi çalışır.
- <span id="dns-kayit-tipleri"></span>**DNS Kayıt Tipleri**: A (IPv4 adresi), AAAA (IPv6), CNAME (takma ad), MX (mail sunucusu), NS (name server), TXT (metin; SPF/DKIM kayıtları burada yaşar). Sorgu tipine göre yanıtın anlamı değişir.
- <span id="dns-poisoning"></span>**DNS Poisoning** (DNS Zehirlenmesi): DNS önbelleğine sahte kayıt yerleştirip kullanıcıları sahte siteye yönlendirme (pharming). Kaminsky saldırısı Transaction ID tahminine dayanır; panzehiri DNSSEC ve rastgele kaynak portlarıdır.
- <span id="dnssec"></span>**DNSSEC** (DNS Security Extensions): Yanıtları dijital imza ile doğrulayan DNS uzantısı; sahte yanıt kanıtla reddedilir. Zehirlenmeye çare olur ama gizlilik sağlamaz — sorgular hâlâ düz metindir.
- <span id="dns-tunneling"></span>**DNS Tunneling** (DNS Tüneli): Veriyi DNS sorgularının içine gizleyerek dışarı kaçırmak veya içeri komut taşımak. Uzun, yüksek entropili alt-alan-adı (subdomain) etiketleri imzasıdır; çoğu firewall DNS trafiğine eli açık davranır.
- <span id="docker"></span>**Docker**: Uygulamayı bağımlılıklarıyla birlikte paketleyen herhangi bir ortamda çalıştırılabilen konteyner platformu. Güvenliği iyi yapılandırılmazsa saldırgan yüzeyi oluşturur.
- <span id="domain-controller"></span>**Domain Controller** (Alan Denetleyicisi): Active Directory'nin beyin sunucusu; KDC ve dizin burada yaşar. Düşerse alan düşer — kurtaran yedek değil, sık yedeklemedir.
- <span id="doh-dot"></span>**DoH / DoT** (DNS over HTTPS / DNS over TLS): DNS sorgularını şifreleyen yöntemler: DoT ayrı portta (853/TCP) TLS tüneli, DoH mevcut HTTPS akışının içinde (443). Kurumsal görünürlüğü azaltırlar: hangi istemci neyi sordu, artık pcap'te görünmez.
- <span id="dora"></span>**DORA**: DHCP'nin dört adımlı süreci: Discover, Offer, Request, ACK. Sıra her zaman aynıdır; döngüde eksik adım ya sunucu yokluğunu ya da sahte (rogue) DHCP şüphesini işaret eder.
- <span id="downloader"></span>**Downloader** (İndirici): Sisteme sızmış küçük ön parça; asıl görevi C2'den ikinci aşamayı (RAT, implant) çekmek. Kendi küçüktür, getirdiği büyüktür.
- <span id="doxxing"></span>**Doxxing** (Kimlik İfşası): Birinin özel bilgilerini (adres, telefon, fotoğraf) öç almak veya linç için İnternette yayınlama. Özellikle kadınlara, muhaliflere ve gazetecilere karşı kullanılır.
- <span id="dread"></span>**DREAD**: Tehditleri zarar, tekrarlanabilirlik, sömürülebilirlik, etkilenen kullanıcı, keşfedilebilirlik kriterleriyle puanlama modeli. Microsoft artık terk etti; tek başına güvenilir değildir.
- <span id="drive-by"></span>**Drive-by Download** (Sürpriz İndirme): Kullanıcı farkında olmadan tarayıcı açığı üzerinden cihazına zararlı inmesi; tıklamak bile gerekmez, ziyaret yeter. One-click'in bile altındaki katmandır.
- <span id="dto"></span>**DTO** (Data Transfer Object — Veri Taşıma Nesnesi): Katmanlar arasında yalnız belirli alanları taşıyan dar nesne. Form verisi doğrudan modele değil DTO'ya bağlanırsa saldırgan `is_admin` gibi fazladan alan enjekte edemez.
- <span id="dual-stack"></span>**Dual-Stack** (Çift Yığın): Bir cihazın/ağın aynı anda IPv4 ve IPv6 çalıştırması. Modern işletim sistemlerinin tamamı dual-stack'tir; bu yüzden analizde iki aileyi birden bilmek zorunludur.
- <span id="dumpster-diving"></span>**Dumpster Diving** (Çöp Karıştırma): Çöpe atılan belge, disk veya notlardan bilgi toplama. Evrakları yok etmeden atma.
- <span id="durumsal-farkindalik"></span>**Durumsal Farkındalık** (Situational Awareness): Sistemin o anki halini bilmek: hangi süreç, hangi bağlantı, hangi kullanıcı normal? İhlalde sorulacak ilk soru "normal neydi?" sorusudur.
- <span id="dwell-time"></span>**Dwell Time** (Konaklama Süresi): Saldırganın ağda ilk girişten yakalanana kadar geçirdiği süre. APT'lerde ayları bulur; MTTD'nin saldırgan bakışıyla okunan hali.

</details>

<details class="toc-block" markdown="block" id="letter-e">
<summary>E</summary>

- <span id="eavesdropping"></span>**Eavesdropping** (Gizlice Dinleme): Dinleme. Ağ trafiğini veya fiziksel ortamı dinleyerek bilgi toplama.
- <span id="echo-request-reply"></span>**Echo Request / Echo Reply** (Yankı İsteği / Yankı Yanıtı): ICMP'nin "orada mısın?" (Type 8) ve "evet, buradayım" (Type 0) çifti; ping'in kalbi. Identifier ve Sequence alanlarından eşleştirilir; gidiş-dönüş süresi (RTT) buradan ölçülür.
- <span id="edr"></span>**EDR** (Uç Nokta Tehdit Tespiti ve Yanıtı, İng. Endpoint Detection and Response): Uç noktada tespit ve yanıt. Cihazlardaki tehditleri gerçek zamanlı tespit edip müdahale eden güvenlik teknolojisi.
- <span id="elevation-of-privilege"></span>**Elevation of Privilege** (Yetki Yükseltme): Sıradan bir kullanıcının daha yüksek yetkiler elde etmesi. STRIDE tehdit kategorilerinden biri.
- <span id="entropi"></span>**Entropi** (Shannon): Bir verinin ne kadar rastgele ve öngörülemez olduğunu ölçen metrik; düz metin düşük, şifreli/sıkıştırılmış veri yüksek entropilidir. Analizde tam bir dedektiftir: 40+ karakterlik yüksek entropili DNS etiketi tünel adayı, yüksek entropili POST gövdesi exfil adayıdır.
- <span id="enumeration"></span>**Enumeration** (Keşif Sayımı): Hedefte kullanıcı, paylaşım, servis ve DNS kaydı listeleme. Keşif (reconnaissance) aşamasının elle tutulur çıktısıdır: kim var, ne açık, ne kullanılabilir.
- <span id="esp-ah"></span>**ESP / AH** (IPsec Başlıkları): IPsec'in iki modu: ESP veriyi şifreler, AH bütünlüğü imzalar. IPv6'da extension header olarak taşınır; VPN tünellerinin eski omurgasıdır.
- <span id="etc-shadow"></span>**/etc/passwd ve /etc/shadow**: Unix'in kullanıcı listesi ve salt'lı parola hash deposu. passwd herkesçe okunur, shadow yalnız root'un; ikisini birden isteyen, kimlik dökümü peşindedir.
- <span id="eternalblue"></span>**EternalBlue**: NSA'dan sızıp siber suç dünyasına geçen, SMBv1 açığını sömüren efsane exploit. WannaCry ve NotPetya bu kapıdan dünya turu yaptı; yamasız 445 hâlâ davetiye çıkarır.
- <span id="evil-twin"></span>**Evil Twin** (Sahte Ağ): Saldırganın kafe veya otel Wi-Fi'siyle aynı isimde kurduğu sahte ağ. Yanlış olanı seçersen tüm trafiğin saldırgandan geçer; VPN'i açık tut.
- <span id="exfiltration"></span>**Exfiltration** (Veri Sızdırma): Ele geçirilen verinin ağ dışına çıkarılması; kill chain'in son halkası. DNS tüneli, HTTPS gövdesi ve bulut depolama yaygın yoldur; tek yönlü dev asimetrik transfer fark edilir.
- <span id="exif"></span>**EXIF** (Exchangeable Image File Format): Fotoğraf dosyasının içindeki gizli veri. Konum, saat, cihaz bilgisi taşır.
- <span id="expert-information"></span>**Expert Information**: Wireshark'ın pcap'teki anormallikleri dört ciddiyette (Error/Warn/Note/Chat) özetlediği panel. Analistin pcap'i açınca bakacağı ilk yerdir: retransmission, duplicate ACK, zero window tek listede.
- <span id="exploit"></span>**Exploit** (Sömürü): Bir zafiyetten yararlanıp sisteme sızmak için kullanılan yöntem veya kod. Açık kapanana kadar tekrar tekrar kullanılabilir.
- <span id="exploit-kit"></span>**Exploit Kit** (İstismar Seti): Tarayıcı/plugin açıklarını paketleyip "kurban gel, açığını seç" diye satan hazır istismar seti. Payload'ı RAM'e enjekte eder; exploitler bir araya gelince kit olur.
- <span id="export-objects"></span>**Export Objects** (Nesneleri Dışa Aktar): Wireshark'ın pcap içinden transfer edilen dosyaları (HTTP gövdeleri, SMB dosyaları) diske çıkaran özelliği. Ağ forensiklerinde kritik: indirilen zararlıyı veya sızdırılan belgeyi orijinal haliyle kurtarır.
- <span id="extension-header"></span>**Extension Header** (Genişletilmiş Başlık): IPv6'da ek protokol bilgisini taşıyan zincirleme başlık yapısı (Fragment, Hop-by-Hop, Routing, ESP/AH — IPsec şifreleme başlıkları). Ana başlık 40 byte sabit kalır; her halka bir sonrakini "Next Header" alanıyla işaret eder.

</details>

<details class="toc-block" markdown="block" id="letter-f">
<summary>F</summary>

- <span id="fernet"></span>**Fernet**: Python cryptography kütüphanesinin sağladığı, AES-128-CBC + HMAC-SHA256 kullanan şifreleme aracı. Anahtar üretimi ve IV yönetimi otomatiktir.
- <span id="fidye-yazilimi"></span>**Fidye yazılımı** (ransomware): Dosyalarını şifreleyip para isteyen yazılım. Ödeme yapma, yedekten dön.
- <span id="fileless-attack"></span>**Fileless Attack** (Dosyasız Saldırı): Diske yazılmadan, yalnız bellekte (RAM) yaşayan saldırı; PowerShell/WMI gibi sistem araçlarıyla yürütülür. AV imzası diskte arar — dosya yoksa imza da yok.
- <span id="firewall"></span>**Firewall** (Güvenlik Duvarı): Ağ trafiğini süzüp izinsiz bağlantıları engelleyen savunma aracı. Modemde ve bilgisayarda mutlaka açık olsun; çoğu modemde kapalı gelir.
- <span id="firmware"></span>**Firmware** (Aygıt Yazılımı): Modem, kamera gibi cihazların kendi iç yazılımı. Güncellenmezse bilinen açıklarıyla saldırgana açık kalır.
- <span id="flow-graph"></span>**Flow Graph** (Akış Diyagramı): Wireshark'ın iletişimi ok diyagramıyla özetlediği görünüm: her satır bir cihaz, her ok bir paket. 3-way handshake, port scan deseni ve saldırı zaman çizelgesi tek ekranda okunur.
- <span id="follow-tcp-stream"></span>**Follow TCP Stream** (TCP Akışını Takip Et): Wireshark'ın bir TCP bağlantısındaki tüm veriyi tek pencerede, istemci/sunucu farklı renklerle gösteren özelliği. Şifre sızıntısı, SQL injection payload'ı veya e-posta içeriğini okumanın en hızlı yolu.
- <span id="fragment-offset"></span>**Fragment Offset** (Parça Konumu): Parçanın orijinal paketteki konumu (8 byte birimiyle). Aynı Identification değerine sahip parçalar bu değere göre birleştirilir; çakışan offset'ler (overlap) saldırı göstergesidir.
- <span id="frame"></span>**Frame** (Çerçeve): Paketin fiziksel katman (Ethernet) temsili; Wireshark'ta her paketin en üstündeki "Frame N" satırıdır. Günlük dilde "paket" ile karışır; teknik olarak frame L2, paket L3'tür.
- <span id="ftp"></span>**FTP** (File Transfer Protocol): Dosya transfer protokolü; komut (21) ve veri (ayrı bağlantı) kanallarını ayırır. USER/PASS dahil her şey düz metindir; modern karşılıkları SFTP (SSH) ve FTPS (TLS)'dir.
- <span id="fuzzing"></span>**Fuzzing**: Programa rastgele veya yarı-rastgele veri göndererek çökme veya beklenmeyen davranış bulma test tekniği. Otomatik açık bulma yöntemidir.

</details>

<details class="toc-block" markdown="block" id="letter-g">
<summary>G</summary>

- <span id="gateway"></span>**Gateway** (Ağ Geçidi): Yerel ağdan dışarıya çıkışın yapıldığı router'ın IP'si (DHCP Option 3). Farklı ağa giden her trafik buraya emanet edilir; ARP spoofing'in birincil hedefi de budur.
- <span id="gdpr"></span>**GDPR**: Avrupa Birliği'nin kişisel veri koruma yönetmeliği. KVKK'nın Avrupa'daki kardeşidir; AB vatandaşı verisi işliyorsan sana da uyar.
- <span id="golden-silver-ticket"></span>**Golden / Silver Ticket** (Altın / Gümüş Bilet): Kerberos sahteciliğinin iki kralı: Golden Ticket, krbtgt (KDC'nin ana hesabı) anahtarıyla sahte TGT üretir (alan tamamen teslim); Silver Ticket yalnız bir servisin anahtarıyla sahte servis bileti üretir. Panzehiri KRBTGT parola sıfırlama ve PAC (bilet içindeki yetki listesi) doğrulamasıdır.
- <span id="gps-izleme"></span>**GPS izleme**: Konum verisinin cihazdan alınarak üçüncü taraflarca kullanılması. Uygulama izinlerini kontrol et.
- <span id="gratuitous-arp"></span>**Gratuitous ARP** (Karşılıksız ARP): Bir cihazın kimse sormadan kendi IP-MAC eşlemesini duyurduğu ARP paketi. Yük devretme ve IP çakışması tespiti için meşrudur; ARP zehirlenmesinde silaha dönüşür.
- <span id="grayware"></span>**Grayware** (Gri Yazılım): Ne tam zararlı ne tam meşru: adware, spyware benzeri, sınırda gezen yazılım. "Kurulumda kabul ettim" denerek hayatına izinli başlar.
- <span id="guvenli-silme"></span>**Güvenli Silme** (Secure Wipe): Veriyi geri kurtarılamayacak şekilde silme; diskin baştan yazılması veya crypto-erase. Cihaz satışı ve devri öncesi zorunludur; "Shift+Delete" ve hızlı format yetmez.

</details>

<details class="toc-block" markdown="block" id="letter-h">
<summary>H</summary>

- <span id="hacker-sapkalar"></span>**Hacker** (Şapka Türleri): Niyete göre adlanan yetkinlik türleri: beyaz şapka izinli ve etik sızma testi yapar, siyah şapka kötü niyetlidir, gri şapka arada gezer. Hacker kültürü, merak ve mühendislik zanaatının devamıdır.
- <span id="hacktivist"></span>**Hacktivist**: İdeolojik amaçla hack yapan aktivist. Motivasyonu para değil mesajdır; sızar, duyurur — bazen de yıkıp geçer.
- <span id="hallucination"></span>**Hallucination** (Halüsinasyon): LLM'in gerçeği olmayan bilgiyi yüksek güvenle üretmesi. Hukuk, sağlık, finans gibi kritik alanlarda yanlış karar alma riski.
- <span id="handler"></span>**Handler** (Dinleyici): Saldırganın kendi tarafında bağlantıyı beklediği dinleyici; reverse shell ve meterpreter buraya bağlanır. "Dinle, işlet, oturumu al" üçlüsünün ilkidir.
- <span id="hash"></span>**Hash**: Parolanı veya veriyi matematiksel işlemden geçirip elde edilen tek yönlü özet. Siteden parolan geri okunamaz; ama zayıf parolanın hash'i saniyeler içinde kırılır.
- <span id="hibrit-harp"></span>**Hibrit Harp** (Melez Savaş): Tank yerine dezenformasyon, siber saldırı ve algı manipülasyonuyla yürütülen savaş. Seni savaş alanında değil, zihninde vurur.
- <span id="hid"></span>**HID** (Human Interface Device): Klavye ve fare gibi insan arayüzü aygıt sınıfı. BadUSB'nin rolüdür: takılır, kendini klavye tanıtır ve yazmaya başlar — bilgisayar "dur" diyemez.
- <span id="hsts"></span>**HSTS** (HTTP Strict Transport Security): Tarayıcıya "bu siteyle asla HTTP konuşma" diyen yanıt başlığı. SSL stripping'in panzehiridir; bir kez öğrenen tarayıcı geri dönmez.
- <span id="http"></span>**HTTP** (HyperText Transfer Protocol): Web'in taşıma protokolü; istek (GET/POST) ve yanıt (status code + header + body) düz metin akar. Port 80; dinleyen herkes çerez ve form verisini okur — şifreli hali HTTPS'tir (443).
- <span id="http2-http3"></span>**HTTP/2 ve HTTP/3** (QUIC): Web protokolünün yeni nesilleri: HTTP/2 TCP üzerinde ikili çerçeveleme ve HPACK sıkıştırma, HTTP/3 ise UDP/443 üzerinde QUIC ile çalışır. Wireshark'ta klasik `http` filtresi yerine http2/quic dissector'ları gerekir.
- <span id="http-header"></span>**HTTP Header** (HTTP Başlığı): İstek ve yanıtların gövdeden önce gelen metadata satırları (Ad: Değer). Host, User-Agent, Cookie istek tarafında; Server, Content-Length, Location yanıt tarafında yaşar. Sahte User-Agent, otomatize araç ifşasıdır.
- <span id="httponly"></span>**HttpOnly**: Çerezin JavaScript'ten okunmasını yasaklayan bayrak. XSS çerezi çalmak ister; HttpOnly ile tarayıcı ona "yok öyle" der.
- <span id="http-request-method"></span>**HTTP Request Method** (HTTP İstek Metodu): İsteğin amacını belirten komut: GET okur (parametre URL'de), POST gönderir (veri gövdede), PUT oluşturur, DELETE siler, HEAD yalnız başlık ister. Şifreler POST gövdesinde düz metin gezer.
- <span id="http-status-code"></span>**HTTP Status Code** (HTTP Durum Kodu): Sunucunun üç haneli kararı: 2xx başarı, 3xx yönlendirme, 4xx istemci hatası, 5xx sunucu hatası. Art arda 401/403 brute force, 404 yağmuru dizin taraması (directory scanning) demektir.
- <span id="https"></span>**HTTPS / TLS / SSL**: Sitenin seninle arasındaki bağlantıyı şifreleyen protokol. Adres çubuğunda kilit ve `https://` yoksa banka, e-Devlet, kart bilgisi kesinlikle girme.

</details>

<details class="toc-block" markdown="block" id="letter-i">
<summary>I</summary>

- <span id="iam"></span>**IAM** (Kimlik ve Erişim Yönetimi, İng. Identity and Access Management): Bulutta kimlik ve erişim yönetimi. AWS IAM, Azure RBAC, Google Cloud IAM. En az ayrıcallık ilkesi kritik.
- <span id="icmp"></span>**ICMP** (Internet Control Message Protocol): Ağ durumu ve hata mesajları protokolü; ping ve traceroute bununla çalışır. Veri taşımaz sanılır; ICMP tüneliyle veri kaçırılır.
- <span id="icmp-tunneling"></span>**ICMP Tunneling** (ICMP Tüneli): Veriyi ICMP Echo paketlerinin payload'ına gömüp firewall'u aşma. ICMP her yerde serbesttir; anlamsız karakterli, normalden büyük payload'lar ihaneti ele verir.
- <span id="icmpv6"></span>**ICMPv6**: IPv6'nın ICMP karşılığı; ping/hata bildiriminin ötesinde protokolün omurgasıdır: NDP komşu keşfi, RA ile adres yapılandırma, Packet Too Big ile MTU bildirimi hep bunun üzerinden yürür.
- <span id="ids-ips"></span>**IDS/IPS** (Intrusion Detection/Prevention System): Saldırı tespit/önleme sistemi. Ağ trafiğini izleyerek saldırıları tespit eden (IDS) ve engelleyen (IPS) güvenlik sistemleri.
- <span id="iha-destekli-saldiri"></span>**İHA-Destekli Saldırı** (UAV-Assisted Attack): İnsansız hava aracıyla hedefe yaklaşıp sahte baz istasyonu kurma, Wi-Fi/Bluetooth dinleme veya yakın-menzil saldırı düzenleme. Menzil ve başarı oranı klasik yöntemlerden yüksektir.
- <span id="imap"></span>**IMAP** (Internet Message Access Protocol): E-postayı sunucuda tutup çok cihazla senkronize eden protokol (143/993). POP3 indirip siler, IMAP saklar; LOGIN'de kimlik bilgileri düz metindir.
- <span id="implant"></span>**Implant**: Hedef ortama özel hazırlanan, kalıcı yaşamak üzere yerleştirilen saldırgan bileşeni. Her kurban için ayrı derlenir; genel imzayla yakalanmaz.
- <span id="imsi-catcher"></span>**IMSI Catcher** (Sahte Baz İstasyonu): Telefonunu taklit bir baz istasyonuna çekip konumunu ve konuşmanı dinleyen cihaz. Sinyalin gittiği yer gerçek operatör olmayabilir.
- <span id="information-disclosure"></span>**Information Disclosure** (Bilgi Sızdırma): Bilginin yetkisiz kişilere sızdırılması. STRIDE tehdit kategorilerinden biri.
- <span id="insider-tehdit"></span>**İnsider Tehdit** (Insider Threat): Kurum içinden gelen tehdit. Kötü niyetli veya dikkatsiz çalışan, yüklenici veya eski personelin kurum verilerine erişimi.
- <span id="ioa"></span>**IoA** (Indicator of Attack): Saldırının izinden çok nişine bakan gösterge: "neden bu LDAP sorgusu?" IoC makineyi arar, IoA davranışı. Tespitin geleceği IoA'dadır.
- <span id="ioc"></span>**IOC** (Indicator of Compromise): İhlal göstergesi; saldırının izini taşıyan kanıt: zararlının SHA-256 özeti, C2 IP'si, sahte User-Agent. Otomatik taramanın birimi budur; VirusTotal/MalwareBazaar ile doğrulanır.
- <span id="io-graph"></span>**IO Graph** (Giriş/Çıkış Grafiği): Trafik miktarını zaman ekseninde çizen Wireshark grafiği; her satıra display filter bağlanabilir. Ani spike DDoS/veri sızdırma, düzenli küçük tepeler C2 beacon'ı işaret eder.
- <span id="iot"></span>**IoT** (Nesnelerin İnterneti): İnternete bağlı akıllı cihazlar (kamera, lamba, termostat). Güvenlikleri genelde zayıftır; misafir ağına bağla ki ele geçirilince tüm ağa sıçramasın.
- <span id="ip-adresi"></span>**IP adresi**: Cihazının İnternet üzerindeki adresi. Her bağlantıda bir IP atanır. VPN ile gizlenebilir.
- <span id="ip-fragmentation"></span>**IP Fragmentation** (IP Parçalanması): Büyük paketlerin yolun MTU sınırına göre parçalanması. Çakışan (overlap) parçalar IDS atlatma tekniğidir; PMTUD, yolun MTU'sunu keşfeden mekanizmadır.
- <span id="iptables"></span>**iptables**: Linux'un kural tabanlı paket filtresi ve güvenlik duvarı; kural zincirleri (chain) ve tablolardan oluşur. Host savunmasının ve Linux NAT'ın klasiğidir.
- <span id="ipv6"></span>**IPv6** (Internet Protocol version 6): 128 bitlik adres uzayına sahip IP'nin halefi; broadcast yok, header 40 byte sabit, checksum yoktur. Dual-stack cihazlarda sessizce çalıştığı için "IPv6'yı kapattım" diyen ağda bile görünebilir.
- <span id="irc"></span>**IRC** (Internet Relay Chat): Eski nesil sohbet protokolü. Botnet komutlarının tarihsel evidir: C2 trafiği meşru sohbet gürültüsü gibi görünür.
- <span id="ir-playbook"></span>**IR Playbook** (Olay Müdahale Kitabı): Olay müdahale senaryo kitabı. Fidye yazılımı, veri sızıntısı, DDoS gibi olay tipleri için adım adım ne yapılacağını tanımlar.
- <span id="isn"></span>**ISN** (Initial Sequence Number): TCP bağlantısının rastgele başlangıç sıra numarası. Tahmin edilebilirse bağlantı ele geçirilir; rastgeleliği güvenliğin kendisidir.
- <span id="iso-27001"></span>**ISO 27001**: Bilgi güvenliği yönetim sistemi (BGYS) için uluslararası standart. Risk değerlendirmeye dayalı, belgelenebilir süreç ister; sertifikasyon yıllık gözetim denetimleriyle yaşar.

</details>

<details class="toc-block" markdown="block" id="letter-j">
<summary>J</summary>

- <span id="jailbreak"></span>**Jailbreak**: Telefonun güvenlik kısıtlamalarını kaldırma işlemi. Saldırgan cihazda kalıcı olmak için yapar; kendi cihazına da yapma, tüm güvenlik duvarını düşürür.
- <span id="jailbreak-llm"></span>**Jailbreak** (LLM): LLM'in güvenlik guardrail'lerini aşma. "DAN" gibi prompt'larla model, zararlı içerik üretmeye ikna edilir.
- <span id="jitter"></span>**Jitter** (Gecikme Dalgalanması): Paketler arası gecikmenin dalgalanması. VoIP'nin baş düşmanıdır: ses takılır, kesilir; alıcı taraf jitter buffer ile dengeler. RTP Stream Analysis grafiğinde ölçülür.
- <span id="jwt"></span>**JWT** (JSON Ağ Jetonu, İng. JSON Web Token): Oturum bilgisini JSON olarak taşıyan, dijital imzalı token. Tarayıcıdan sunucuya her istekte gönderilir. Payload Base64 ile encode edilir, şifrelenmez; hassas veri konmaz.

</details>

<details class="toc-block" markdown="block" id="letter-k">
<summary>K</summary>

- <span id="kalicilik"></span>**Kalıcılık** (Persistence): Saldırganın yeniden başlatmalara rağmen sistemde kalması: Registry Run Keys, cron, servis, başlangıç klasörü. "Girdi ama kalamadı" ile "yerleşti" arasındaki farktır.
- <span id="katman"></span>**Katman** (Layer): Ağ protokollerinin iç içe hiyerarşisi: Ethernet (L2, MAC) → IP (L3, adres) → TCP/UDP (L4, taşıma) → HTTP/DNS (L7, uygulama). Wireshark paket detayını katman katman açar; her katman bir sonrakini sarar (encapsulation).
- <span id="kdc"></span>**KDC** (Key Distribution Center): Kerberos'un kalbi; alan denetleyicisinde (domain controller) yaşar ve iki hizmet barındırır: AS (kullanıcıyı doğrulayıp TGT verir) ve TGS (servis bileti verir). KDC'yi ele geçiren, realm'i (alanı) ele geçirir.
- <span id="keep-alive"></span>**Keep-Alive** (Canlı Tutma): Boşta kalan TCP bağlantısında karşı tarafın canlı olup olmadığını yoklayan küçük paket. NAT ve firewall'ların boş bağlantıyı unutmasını önler; düzenli aralıklı keep-alive trafiği stealth C2'ün de maskesi olabilir.
- <span id="kendinden-imzali-sertifika"></span>**Kendinden İmzalı Sertifika** (Self-Signed): Veren ile sahibin aynı olduğu sertifika; CA doğrulaması yoktur. Test ortamında normal, üretimde MITM göstergesidir; Wireshark'ta issuer = subject olarak görülür.
- <span id="kerberoasting"></span>**Kerberoasting**: Dizindeki SPN'ler için istenen servis biletlerini (tercihen RC4/etype 23) kapıp parolayı çevrimdışı kırmak. Ağda şifre taşınmaz; kırılabilir bilet taşınır. Panzehiri uzun servis parolaları ve AES'a geçiştir.
- <span id="kerberos"></span>**Kerberos**: Active Directory'nin bilet tabanlı kimlik doğrulama protokolü. AS ve TGS biletleriyle çalışır; RC4 (etype 23) bilet bolluğu, Kerberoasting saldırısının keskin imzasıdır.
- <span id="keylogger"></span>**Keylogger** (Klavye Kaydedici): Bastığın her tuşu gizlice kaydedip saldırgana gönderen yazılım. Parolan ne kadar uzun olursa olsun tuş tuş çalınır; ekran klavyesi bile kurtarmayabilir.
- <span id="kill-chain"></span>**Kill Chain** (Öldürme Zinciri): Saldırıyı aşamalara ayıran model: keşif, silahlanma, teslim, istismar, kurulum, C2, hedefe erişim. Savunma zincirin tek bir halkasını kırmayı hedefler; Lockheed Martin modelidir.
- <span id="kill-switch"></span>**Kill Switch** (Bağlantı Kesici): VPN koptuğu an İnternet erişimini otomatik kesen özellik. Açık değilse VPN düşerken farkında olmadan korumasız gezersin.
- <span id="kod-inceleme"></span>**Kod İnceleme** (Code Review): Başka bir geliştiricinin yazılan kodu güvenlik açısından denetlemesi. Otomatik araçlar (SAST) birçok hatayı yakalar ama iş mantığı hataları sadece insan gözüyle tespit edilir.
- <span id="kpi"></span>**KPI** (Key Performance Indicator): Temel performans göstergesi. Hedeflere ulaşılıp ulaşılmadığını ölçen metrik.
- <span id="krbtgt"></span>**krbtgt**: KDC'nin imza anahtarını taşıyan hesap; TGT'leri o imzalar. Hash'i sızarsa Golden Ticket kapısı açılır — parolasını iki kez sıfırlamak eski anahtarı öldürür.
- <span id="kri"></span>**KRI** (Key Risk Indicator): Temel risk göstergesi. Risklerin gerçekleşme olasılığını önceden haber veren metrik.
- <span id="kriptografi"></span>**Kriptografi**: Şifreleme bilimi. Veriyi okunamaz hale getirip yalnızca yetkili kişinin açmasını sağlar. Simetrik yöntem tek anahtarla, asimetrik yöntem (public/private anahtar çifti) çalışır.
- <span id="kripto-para"></span>**Kripto Para** (Bitcoin): İzlenmesi güç dijital para birimi. Fidye yazılımları ve dolandırıcılıkta ödeme olarak istenir; "Bitcoin gönder, ikiye katlarım" diyene asla inanma.
- <span id="kok-dns"></span>**Kök DNS** (Root DNS): DNS hiyerarşisinin tepesi; TLD'lere yol soran 13 kök sunucu kümesi. Tehdit değil ama hedeftir: DDoS'una düşse internetin isimleri çözülmez.
- <span id="kvkk"></span>**KVKK** (Kişisel Verilerin Korunması Kanunu): Türkiye'de kişisel verilerin işlenme ve korunma koşullarını düzenleyen yasa.

</details>

<details class="toc-block" markdown="block" id="letter-l">
<summary>L</summary>

- <span id="larry-wall"></span>**Larry Wall'un Üç Erdemi**: Büyük mühendisin üç erdemi (Perl'in babasından): Tembellik — aynı angaryayı iki kez yapmamak için otomasyon yazar; Sabırsızlık — darboğazı yaşanmadan önce çözer; Kibir — "bunu hangi sığır yazdı?" dedirtmeyecek kadar temiz kod üretir.
- <span id="ldap"></span>**LDAP**: Dizin servisinin (kullanıcı, grup, bilgisayar) sorgulama protokolü; Active Directory'nin arayüzü. 389 düz/StartTLS, 636 LDAPS; rootDSE boş sorgusu dizinin "kimlik kartını" anonim verir — keşfin ilk adımıdır.
- <span id="ldap-injection"></span>**LDAP Injection** (LDAP Enjeksiyonu): LDAP filtresine kullanıcı girdisiyle müdahale: sorgu genişletilip tüm kayıtlar dökülür. SQL injection'ın LDAP kardeşi; filtre kaçışıyla önlenir.
- <span id="lease-time"></span>**Lease Time** (Kiralama Süresi): DHCP'nin verdiği IP adresinin geçerlilik süresi (Option 51, tipik 24 saat). Süre dolmadan yenilenir (renew); istemci dönmezse adres havuza geri döner.
- <span id="least-privilege"></span>**Least Privilege** (En Az Yetki): Bir kullanıcının veya sistemin yalnızca görevini yerine getirmek için gereken en düşük yetki seviyesine sahip olması prensibi.
- <span id="link-local"></span>**Link-Local** (Bağlantı-Yerel): Yalnız aynı segmentte geçerli IPv6 adresi (fe80::/10); router asla taşımaz. Her arayüz otomatik alır; NDP ve router keşfi bununla çalışır: `fe80::1%eth0` gibi kullanılır.
- <span id="llm"></span>**LLM** (Large Language Model): ChatGPT, Claude, Gemini gibi büyük dil modelleri. Prompt injection, hallucination, veri sızıntısı gibi yeni güvenlik riskleri getirir.
- <span id="lockdown-mode"></span>**Lockdown Mode** (Kilit Modu): Kilitleme modu. iPhone'da yüksek riskli kullanıcılar için azaltılmış özellikli güvenlik modu.
- <span id="lotl"></span>**LotL** (Living off the Land): Sistemde halihazırda var olan yasal araçları (PowerShell, WMI, BitLocker vb.) kullanarak yapılan dosyasız saldırı. Zararlı yazılım indirmeden, sadece sistemin kendi araçlarıyla saldırma tekniği.
- <span id="lsass"></span>**LSASS** (Local Security Authority Subsystem): Windows'un kimlik ve oturum süreci; belleğinde parola hash'i, bilet ve bazen düz metin yaşar. Mimikatz'ın birinci numaralı hedefidir.
- <span id="lua"></span>**Lua**: Yüz kilobayt civarında, C kodunun içine gömülebilen hafif script dili. Wireshark eklentileri, Nmap NSE scriptleri ve Snort 3 kuralları Lua'dır; Nmap kullanan herkes farkında olarak Lua kullanmıştır.

</details>

<details class="toc-block" markdown="block" id="letter-m">
<summary>M</summary>

- <span id="mac-adresi"></span>**MAC Adresi**: Cihazına özgü sabit ağ kimlik numarası. Modemde MAC filtreleme açarsan parola bilinse bile tanımsız cihaz ağa giremez.
- <span id="magic-bytes"></span>**Magic Bytes** (İmza Baytları): Dosya türünü ele veren imza baytları: `PK` ZIP, `PNG` PNG gibisi. Uzantı yalan söyler, magic bytes söylemez; forensikte indirilen dosyanın gerçek kimliği buradan kanıtlanır.
- <span id="malware"></span>**Malware** (Kötü Amaçlı Yazılım): Virüs, trojan, fidye yazılımı, casus yazılım gibi zarar vermek amacıyla yazılmış tüm yazılımların ortak (şemsiye) adı.
- <span id="man-in-the-middle"></span>**Man-in-the-Middle** (Ortadaki Adam / MITM): Ortadaki adam saldırısı. İki taraf arasına girerek haberleşmeyi dinleme veya değiştirme.
- <span id="mass-assignment"></span>**Mass Assignment** (Toplu Alan Ataması): Framework'lerin form verisini otomatik modele ataması. Saldırgan forma `is_admin=true` eklerse admin olur. Beyaz liste ve DTO (veri taşıma nesnesi) ile önlenir.
- <span id="mdm"></span>**MDM** (Mobil Cihaz Yönetimi, İng. Mobile Device Management): Mobil cihaz yönetimi. Kurum içindeki mobil cihazları güvenlik politikalarıyla yöneten sistem.
- <span id="mdr"></span>**MDR** (Managed Detection and Response): Yönetilen tespit ve yanıt; MSSP'in aktif müdahaleli kardeşi. Uzaktan SOC analistleri alarmı kapatmaz, olayı kapatır.
- <span id="metadata"></span>**Metadata** (Üst Veri): Veri hakkında veri. Dosyanın oluşturulma tarihi, yazarı, konumu gibi bilgiler.
- <span id="metasploit"></span>**Metasploit / Meterpreter**: Sızma testinin efsane çerçevesi ve oturum yöneticisi payload'u. Dinleyiciyi (handler) başlat, exploiti gönder, meterpreter oturumuyla yaşa — kırmızı takımın dil kalıbıdır.
- <span id="mfa"></span>**MFA** (Çok Faktörlü Doğrulama, İng. Multi-Factor Authentication): Çok faktörlü doğrulama. İkiden fazla doğrulama yöntemi kullanarak kimlik doğrulama. 2FA'nın daha kapsamlı halidir.
- <span id="mf-df"></span>**MF / DF Bayrakları**: IP parçalama bayrakları: MF=1 "devamı var", DF=1 "parçalama". DF'li paket MTU'yu aşarsa düşer ve ICMP Fragmentation Needed döner — PMTUD'un temel mekanizması budur.
- <span id="mime"></span>**MIME** (Multipurpose Internet Mail Extensions): E-postada metin dışı içeriği (ek, resim, html) tanımlayan standart; Content-Type ve ayraç (boundary) ile gövde bölünür. Ekler base64 ile MIME zarfına sarılır — zarf açılınca malware çıkabilir.
- <span id="mimikatz"></span>**mimikatz**: Windows kimlik bilgisi hasadının efsanesi: Windows'un kimlik sürecinden (LSASS) parola hash'i, bilet ve düz metin çıkarır. Pass-the-hash dünyası onunla yayıldı.
- <span id="mitre-attack"></span>**MITRE ATT&CK**: Gerçek tehdit aktörlerinin taktik ve tekniklerini (TTP) matris halinde kataloglayan bilgi tabanı. Tehdit modelleme, red team planlama ve savunma kapsaması doğrulamada ortak dildir.
- <span id="model-poisoning"></span>**Model Poisoning** (Model Zehirlenme): LLM'in eğitim verisinin manipüle edilmesi. Model, belirli girdilerde kötü çıktı verir.
- <span id="monitor-mode"></span>**Monitor Mode** (İzleme Modu): Wi-Fi kartının tüm kanallardaki çerçeveleri yakaladığı mod; 802.11 analizi (Beacon, deauth, handshake) ancak bu modda yapılır. Kablolu dünyadaki promiscuous mode'un radyo karşılığıdır.
- <span id="mss"></span>**MSS** (Maximum Segment Size): TCP'nin tek pakette taşıyabileceği azami uygulama verisi; Ethernet'te tipik 1460 byte (1500 − 20 IP − 20 TCP). SYN'de opsiyon olarak bildirilir; iki tarafın küçüğü kazanır.
- <span id="mssp"></span>**MSSP** (Managed Security Service Provider): İzleme, olay müdahale ve güvenlik yönetimini abonelik modeliyle üstlenen sağlayıcı. SOC'un dışarıdan kiralanmış halidir; 7/24 çalışır.
- <span id="mta"></span>**MTA** (Mail Transfer Agent): E-postayı sunucudan sunucuya taşıyan aktarıcı; 25 numaralı portun sahibi. Spam filtreleri ve SPF/DKIM/DMARC zinciri burada denetler.
- <span id="mta-sts"></span>**MTA-STS** (MTA Strict Transport Security): E-posta transferinde TLS zorunluluğu. Downgrade saldırılarına karşı korur.
- <span id="mttd"></span>**MTTD** (Tespit Süresi, İng. Mean Time to Detect): Sızma ile tespit arası ortalama süre. Hedef: 24 saatten az.
- <span id="mttr"></span>**MTTR** (Müdahale Süresi, İng. Mean Time to Respond): Tespit ile izolasyon arası ortalama süre. Hedef: 1 saatten az.
- <span id="mtu"></span>**MTU** (Maximum Transmission Unit): Arayüzün tek çerçevede taşıyabileceği azami boyut; standart Ethernet'te 1500. Aşan paket ya parçalanır ya (DF varsa) düşürülür; VPN ve PPPoE (DSL bağlantı tekniği) hatlarında MTU sorunları klasiktir.
- <span id="mvt"></span>**MVT** (Mobil Doğrulama Aracı): Uluslararası Af Örgütü'nün geliştirdiği, telefon yedekinden Pegasus ve benzeri casus yazılım izi arayan açık kaynak araç. Güvenilir bir uzmana çalıştır.

</details>

<details class="toc-block" markdown="block" id="letter-n">
<summary>N</summary>

- <span id="nat"></span>**NAT** (Network Address Translation): Özel IP'lerin tek kamu IP'si arkasına saklanması. Gelen bağlantıyı engeller ama giden trafiği gizlemez; idle bağlantı tablolarını unutur — keep-alive'ın varlık sebebi budur.
- <span id="ndp-slaac"></span>**NDP / SLAAC** (Neighbor Discovery Protocol / Stateless Address Autoconfiguration): IPv6'nın ARP ve DHCP karşılıkları: NDP komşu keşfi yapar, SLAAC cihaza adresini otomatik atar. IPv6'da DHCP olmasa da adres alınır; filtreleme yaparken unutulmamalıdır.
- <span id="netcat"></span>**netcat** (nc): TCP/UDP bağlantısı açan-dinleyen "İsviçre çakısı" socket aracı. Reverse shell'in hamalıdır: dinler, hedefe kopyalanır, eve bağlanır.
- <span id="netstat"></span>**netstat / ss**: Aktif bağlantı, dinleyen port ve sahibi süreci listeleyen komutlar. "Bu makine neden dışarı konuşuyor?" sorusunun ilk cevabıdır.
- <span id="nist"></span>**NIST** (National Institute of Standards and Technology): ABD ulusal standart ve teknoloji kurumu; SP 800 serisi (Zero Trust: 800-207) ve Cybersecurity Framework (CSF) ile siber güvenliğin künye sahibi. ISO'nun Amerikalı muadili.
- <span id="nmap"></span>**nmap**: Keşif ve port taramanın de facto aracı: `-sS` SYN (half-open), `-sT` connect, `-sU` UDP, `-sn` ping sweep, `-f` parçalı tarama. Script motoru NSE (Nmap Scripting Engine) Lua ile yazılır.
- <span id="nse"></span>**NSE** (Nmap Scripting Engine): Nmap'in Lua tabanlı script motoru; yüzlerce scriptle versiyon tespiti, zafiyet kontrolü ve hatta exploit denemesi yapar.
- <span id="nonce"></span>**Nonce** (Tek Kullanımlık Değer): Şifrelemede her işlem için bir kez kullanılan rastgele sayı. AES-GCM'de nonce tekrar edilirse şifreleme tamamen kırılır.
- <span id="ntlm"></span>**NTLM** (NT LAN Manager): Windows'un Kerberos öncesi, sorgu-yanıt tabanlı kimlik doğrulaması. Parola ağda taşınmaz ama parola türevli zayıf hash yakalanıp çevrimdışı kırılır ve relay edilir; modern ortam Kerberos ister.
- <span id="ntp"></span>**NTP** (Network Time Protocol): Zaman senkronizasyon protokolü (UDP 123). Kerberos'un 5 dakikalık toleransı yüzünden alan ortamında hayati; açık NTP sunucuları amplification saldırısına da alet edilir.
- <span id="null-session"></span>**NULL Session** (Anonim Oturum): Kimlik kanıtı verilmeden kurulan SMB oturumu; eski Windows'larda dizinden bilgi sızmaya (SAMR ile kullanıcı/envanter dökümü) izin verirdi. Trafikte birden çok NULL oturum, kimsesiz ama meraklı bir misafirdir.
- <span id="nxdomain"></span>**NXDOMAIN** (Non-Existent Domain): DNS'in "böyle alan adı yok" cevabı. Normalde nadir görülür; ani patlamaları subdomain keşfi veya DNS tünelinin imzasıdır.

</details>

<details class="toc-block" markdown="block" id="letter-o">
<summary>O</summary>

- <span id="oauth"></span>**OAuth 2.0** (Open Authorization): Bir uygulamanın başka bir uygulama adına hareket etmesine izin veren yetki protokolü. "Bu uygulamaya senin adına tweet atma izni veriyor musun?" mantığı.
- <span id="obfuscation"></span>**Obfuscation** (Kod Karıştırma): Kodu okunmazlaştırarak analisti zorlandırma: isimleri anlamsızlaştırma, akışı şişirme, string gizleme. Packer'ın kardeşi, tersine mühendisliğin başbelasıdır.
- <span id="ocsp"></span>**OCSP** (Online Certificate Status Protocol): Sertifikanın iptal edilip edilmediğini CA'ya soran protokol; yanıt good/revoked/unknown'dır. Sunucunun yanıtı kendisi taşıdığı OCSP zımbalama (stapling) modu yaygındır.
- <span id="offloading"></span>**Offloading**: Ağ kartının checksum ve TCP hesaplarını CPU'dan devralması. Yakalanan pakette "bad checksum" görürsen suçlu genelde odur — hesap henüz yapılmamıştır.
- <span id="oid"></span>**OID** (Nesne Tanımlayıcı): Standartların ve mekanizmaların numaralandırıldığı noktalı sayı ağacı (örn. Kerberos: 1.2.840.113554.1.2.2). SPNEGO pazarlığında hangi mekanizmanın seçildiğini OID söyler.
- <span id="oidc"></span>**OIDC** (OpenID Connect): OAuth 2.0'ın üzerine inşa edilmiş kimlik doğrulama katmanı. "Bu kişi gerçekten kim olduğunu iddia ettiği kişi mi?" sorusunu yanıtlar.
- <span id="olay-mudahale"></span>**Olay Müdahale** (Incident Response): Güvenlik olayı gerçekleştiğinde uygulanan planlı müdahale süreci. Tespit, kontrol, iyileştirme ve sonuç çıkarma aşamalarını içerir.
- <span id="oltalama"></span>**Oltalama** (phishing): Sahte mesaj veya siteyle kandırmaca. Kişisel bilgilerini çalmak için güvenini suiistimal eder.
- <span id="omuz-sorfu"></span>**Omuz sörfü** (shoulder surfing): Omzundan bakarak parola veya PIN çalma. Herkese açık alanlarda dikkat et.
- <span id="one-click"></span>**One-Click Saldırı** (One-Click Attack): Kullanıcının tek bir tıklamasıyla tetiklenen bulaşma; sahte belge, drive-by indirme. Zero-click'ın bir tık gerisinde duran (daha kolay, daha yaygın) kardeşi.
- <span id="open-relay"></span>**Open Relay** (Açık Aktarıcı): Kimlik doğrulamasız herkese e-posta gönderdiren SMTP sunucusu. Spammer'ların cennetidir; IP karalistelerine düşmenin bir numaralı sebebi.
- <span id="osint"></span>**OSINT** (Open Source Intelligence): Açık kaynak istihbaratı; web, sosyal medya ve kamuya açık kayıtlardan bilgi toplama. Saldırgan ile analist aynı veriyle çalışır; dijital ayak izin bir başkasının OSINT malzemesidir.
- <span id="ot"></span>**OT** (Operational Technology): Endüstriyel kontrol sistemlerinin (SCADA, PLC) dünyası. IT veri işler, OT fiziksel süreci yönetir; ele geçirilince tehlikede olan veri değil, tesisin kendisidir.
- <span id="oui"></span>**OUI** (Organizationally Unique Identifier): MAC adresinin ilk üç byte'ı; kartın üreticisini verir (Wireshark otomatik çözer). Cihaz parmak izleme ve sahte MAC tespitinde ilk ipucudur.
- <span id="owasp"></span>**OWASP** (Açık Web Uygulamaları Güvenlik Projesi, İng. Open Web Application Security Project): Web uygulamaları için güvenlik standartları ve çerçeveleri sunan açık kaynak kuruluş.

</details>

<details class="toc-block" markdown="block" id="letter-p">
<summary>P</summary>

- <span id="pac"></span>**PAC** (Privilege Attribute Certificate): Kerberos biletinin içindeki yetki ve grup listesi. Sahte biletlerde doğrulanmazsa Silver Ticket sessizce geçer.
- <span id="packer"></span>**Packer** (Paketleyici): Zararlıyı sıkıştırıp saran, imzadan kaçıran ambalaj (UPX en bilineni). Analisti yavaşlatır ama durdurmaz: imza değişir, davranış değişmez.
- <span id="paket"></span>**Paket** (Packet): Ağ üzerinden gönderilen temel veri birimi; zarf gibi hem adres (IP, port) hem içerik (payload) taşır. Katmanlı yapı sayesinde paket içinde paket yaşar: Ethernet → IP → TCP → HTTP.
- <span id="parametreli-sorgu"></span>**Parametreli Sorgu** (Parameterized Query): SQL enjeksiyonunu önleyen veritabanı sorgu yöntemi. Veri ile SQL komutunu ayrı işler; kullanıcı girdisi asla SQL kodu olarak yorumlanmaz.
- <span id="parola"></span>**Parola** (Password): En yaygın kimlik doğrulama gizlizi. Uzunluk karmaşıklıktan önemlidir: 12+ karakter, her hesapta farklı ve parola yöneticisinde saklanmış olmalıdır.
- <span id="parola-yoneticisi"></span>**Parola Yöneticisi** (Password Manager): Tüm parolaları tek ana parolanın arkasında şifreli tutan yazılım. Her hesap için uzun, benzersiz parola üretir; ezber yükünü sıfırlar, tekrar kullanımı bitirir.
- <span id="passkey"></span>**Passkey** (Parolasız Anahtar): Parolanın yerini alan kriptografik kimlik doğrulama. Face ID/Touch ID ile cihazda private key, sunucuda public key. Phishing-proof.
- <span id="pass-the-hash"></span>**Pass-the-Hash**: Parolayı değil, paroladan türetilmiş hash'i yakalayıp kimliğe bürünme. Parola hiç sorulmaz; ele geçen hash anahtar yerine geçer. Pass-the-ticket'in NTLM kardeşidir.
- <span id="pass-the-ticket"></span>**Pass-the-Ticket**: Çalınan Kerberos biletinin parolasız yeniden kullanımı. Kimlik kanıtı biletin kendisidir; hash'i ele geçiren saldırgan kopyayı sunar ve içeri girer.
- <span id="password-spraying"></span>**Password Spraying** (Parola Püskürtme): Çok kullanıcıya tek tanıdık parola denemek. Brute force'un tersi: hesap kilidi tetiklemez, denemeleri kullanıcılara yayar; SMB'de STATUS_LOGON_FAILURE yağmuru olarak görülür.
- <span id="pasta"></span>**PASTA** (Process for Attack Simulation and Threat Analysis): Saldırı simülasyonu ve tehdit analizi sürecini tanımlayan tehdit modelleme çerçevesi.
- <span id="path-traversal"></span>**Path Traversal** (Dizin Geçişi): Saldırganın `../../etc/passwd` gibi yollarla yetkisiz dizinlere erişmesi. Dosya adı doğrulaması ve yol çözümlemesi ile önlenir.
- <span id="payload"></span>**Payload** (Yük): Saldırının asıl işi yapan bileşeni: exploit kapıyı aralar, payload içeri girer — reverse shell, implant, ransomware. Zarf-mektup ilişkisinin siber hali.
- <span id="pcap"></span>**pcap**: Ağ trafiğinin ham yakalanmış hali; paket analizin ham maddesi. Wireshark'ın doğal formatı, libpcap'ın çıktısıdır; adını dosya uzantısından alır.
- <span id="pegasus"></span>**Pegasus**: NSO Group tarafından geliştirilen ticari casus yazılım. Sıfır tıklamayla cihaza bulaşabilir.
- <span id="pfs"></span>**PFS** (Perfect Forward Secrecy): Oturum anahtarlarının uzun ömürlü private key'den türememesi; ECDHE ile her oturuma özel anahtar doğar. Sunucu anahtarı çalınsa bile geçmiş trafiğin şifresi çözülemez.
- <span id="pgp"></span>**PGP** (Pretty Good Privacy): Philip Zimmermann'ın halka mal olmuş uçtan uca şifreleme standardı; imza + şifreleme. GnuPG açık kaynak uygulamasıdır; mail ve dosya gizliliğinin klasiği.
- <span id="pharming"></span>**Pharming** (DNS Yönlendirme): Doğru adresi yazsan bile sahte siteye yönlendirildiğin en sinsi oltalama türü. Cihazının DNS ayarları zehirlenmiştir; tarayıcının HTTPS uyarılarını asla yoksayma.
- <span id="ping"></span>**ping**: ICMP Echo ile erişilebilirlik testi: "orada mısın?" sorusu, RTT ölçümü ve paket kayıp oranı döner. Filtrelenmiş olabilir; sessizlik "kapalı" demek değildir.
- <span id="pkce"></span>**PKCE** (Proof Key for Code Exchange): Mobil ve tek sayfa uygulamalarında OAuth 2.0 güvenliğini artıran protokol. Her yetki isteği için dinamik secret üretir; 2024'ten beri zorunlu.
- <span id="pmtud"></span>**PMTUD** (Path MTU Discovery): Yol üzerindeki en küçük MTU'yu bulma mekanizması: DF işaretli paket gönderilir, daralan router ICMP "Fragmentation Needed" ile MTU'yu bildirir. ICMP filtrelenirse bağlantı kara deliğe düşer.
- <span id="polymorphic-metamorphic"></span>**Polymorphic / Metamorphic Code** (Çok Biçimli / Kendini Yeniden Yazan Kod): İmzadan kaçan şekil değiştiren kodlar: polymorphic her kopyada şifreleyici anahtarını değiştirir; metamorphic kendini baştan yazar. AV imzası sabit kalır, kod kalmaz.
- <span id="pop3"></span>**POP3** (Post Office Protocol v3): E-postayı indirip (genelde) sunucudan silen basit protokol (110/995). USER/PASS düz metindir; tek cihaz döneminin mirasıdır, çok cihaz senkronu IMAP ister.
- <span id="port"></span>**Port**: Uygulamanın 16 bitlik kapı numarası (0-65535); 0-1023 "well-known" (HTTP 80, DNS 53), istemci tarafı ephemeral (yüksek) portlardan konuşur. Paket hangi kapıya gelirse o uygulamaya teslim edilir.
- <span id="port-mirroring"></span>**Port Mirroring** (SPAN): Anahtarın bir portundaki trafiğin kopyasını izleme portuna yansıtması. Switch ortamında analiz makinesi her şeyi ancak SPAN ile görür; kartın promiscuous olması yetmez.
- <span id="port-scan"></span>**Port Scan** (Port Taraması): Hedefteki açık kapıların (portların) keşfi. SYN taraması yarı bağlantıyla sessiz kalır, connect taraması tam bağlantı açar; kapı zili çalmak gibidir ama log bir yere düşer.
- <span id="powershell"></span>**PowerShell**: Windows'un görev otomasyon motoru; .NET'e erişir ve sistemden doğar. LotL saldırılarının birinci sanatçısıdır: diskte dosya bırakmadan bellekte iş bitirir.
- <span id="pppoe"></span>**PPPoE** (Point-to-Point Protocol over Ethernet): DSL hatlarında bağlantı kuran tünel protokolü. MTU'su 1492'dir; 1500'le konuşan TCP bağlantıları sessizce ölür.
- <span id="prefix"></span>**Prefix** (Adres Öneği): IP adresinin ağ kısmı (/24, /64 gibi). Yanlış prefix duyuran, trafiği kendine çeker — RA ve DHCP saldırılarının özü budur.
- <span id="pretexting"></span>**Pretexting** (Bahane Kurma): Önce bir hikaye uydurup sonra güvenini kazanarak bilgi çalma sosyal mühendislik yöntemi.
- <span id="profilleme"></span>**Profilleme** (Profiling): Dijital izlerinden senin psikoloji, alışkanlık ve tercihler hakkında profil çıkarma. Sonra bu profille sana hedefli reklam, sahte haber veya oltalama gösterilir.
- <span id="promiscuous-mode"></span>**Promiscuous Mode** (Karışık Dinleme Modu): Ağ kartının yalnız kendisine gelenleri değil, medyada dolaşan tüm paketleri yakaladığı mod. Anahtarlı (switch) ağda tek port yalnız kendi trafiğini görür; her şey için port mirroring (SPAN) gerekir.
- <span id="prompt-injection"></span>**Prompt Injection** (İstem Enjeksiyonu): LLM'e komut enjekte etme. SQL injection'un AI eşdeğeri. Indirect prompt injection en tehlikelisi — veriye gizlenmiş talimatlar.
- <span id="protocol-hierarchy"></span>**Protocol Hierarchy**: pcap'teki protokolleri yüzdesiyle özetleyen istatistik (%85 TCP, %60 HTTP gibi). "Bu pcap'te ne var?" sorusunun ilk cevabıdır; tshark karşılığı `-z io,phs`'dir.
- <span id="psexec-winrm"></span>**PsExec / WinRM**: Windows'un uzaktan yürütme ikilisi: PsExec servisle, WinRM WS-Management'la komut koşturur. Yöneticinin gecesidir; saldırganın yanal hareket aracıdır.
- <span id="purple-team"></span>**Purple Team** (Mor Takım): Kırmızı (saldıran) ve mavi (savunan) takımların buluşup öğrendiklerini ortak senaryolara döktüğü çalışma biçimi. Saldırı bilgisinin savunmaya akıtılmasıdır; renk değil, işbirliği modelidir.

</details>

<details class="toc-block" markdown="block" id="letter-q">
<summary>Q</summary>

- <span id="quid-pro-quo"></span>**Quid Pro Quo** (Bir Şey İçin Bir Şey): Saldırganın bir hizmet veya fayda sunup karşılığında bilgi istemesi. Sosyal mühendislik saldırı türüdür.

</details>

<details class="toc-block" markdown="block" id="letter-r">
<summary>R</summary>

- <span id="ra"></span>**RA** (Router Advertisement): IPv6 router'ının "ben buradayım, şu adres önekini (prefix) kullanın" duyurusu (ICMPv6 Type 134). SLAAC bu duyurudan beslenir; sahte RA gönderen saldırgan kendini gateway yapar (RA spoofing).
- <span id="race-condition"></span>**Race Condition** (Yarış Durumu): İki işlemin aynı kaynağa aynı anda erişmesi sonucu oluşan güvenlik açığı. Örneğin rate limiting sayaçları birden çok işlemci arasında kilitlenmezse atlanabilir.
- <span id="rag"></span>**RAG** (Getirme Artırılmış Üretim, İng. Retrieval-Augmented Generation): LLM'e harici bilgi tabanından belge getirterek yanıt üretme. ACL'lere dikkat: kullanıcı yetkisiz belge görmemeli.
- <span id="rat"></span>**RAT** (Remote Access Trojan): Uzaktan komuta truva atı: ekran, klavye, dosya, mikrofon — hepsi saldırganın panelinde. Arka kapının konsollu lüks versiyonudur.
- <span id="rate-limiting"></span>**Rate Limiting** (Hız Sınırlandırma): Bir kullanıcının belirli süre içinde yapabileceği istek sayısını sınırlama. Brute force ve DDoS saldırılarına karşı ilk savunma hattı.
- <span id="rbac"></span>**RBAC** (Role-Based Access Control): Rol bazlı erişim kontrolü. Kullanıcı yetkilerini roller üzerinden yönetme yöntemi.
- <span id="rc4"></span>**RC4** (Rivest Cipher 4): Kırılması kolay, çağdışı akış şifreleyici; TLS'den çoktan kaldırıldı ama Kerberos'ta etype 23 olarak hâlâ görülür. Ağda RC4 bilet bolluğu, Kerberoasting için gönderilmiş davetiyedir.
- <span id="reassembly"></span>**Reassembly** (Yeniden Birleştirme): Parçaların hedefte orijinal pakete geri birleştirilmesi; router taşır, yalnız hedef birleştirir. Zaman aşımında (Linux 30s, Windows 60s) eksik set çöpe gider; Wireshark "Reassembled" başlığıyla sonucu gösterir.
- <span id="recursive-query"></span>**Recursive Query** (Özyinelemeli Sorgu): İstemcinin tek sorup nihai cevap beklediği DNS sorgusu; sunucu gerekirse kök (root) → üst seviye alan adı (TLD) → yetkili sunucu (authoritative) zincirini kendisi dolaşır. Wireshark genelde yalnız ilk soruyu ve son cevabı görür.
- <span id="red-team"></span>**Red Team** (Kırmızı Takım): Gerçek bir saldırgan gibi davranıp sisteme sızmaya çalışan denetim ekibi. Otomatik taramadan farklı olarak doğaçlama ve gerçek saldırı teknikleri kullanır.
- <span id="registry"></span>**Registry** (Windows Kayıt Defteri): Windows'un yapılandırma veritabanı. Kalıcılığın klasik adresidir (Run Keys); Poweliks gibi fileless zararlılar kodu bile burada saklar.
- <span id="repudiation"></span>**Repudiation** (İnkar): Bir eylemin izlerini temizleyip sonradan inkar edilebilmesi. STRIDE tehdit kategorilerinden biri.
- <span id="retransmission"></span>**Retransmission** (Yeniden İletim): ACK gelmeyen TCP segmentinin yeniden gönderilmesi. Wireshark "Bad TCP" kırmızısında boy gösterir; tıkanıklık, kablosuz sorun ya da saldırı olabilir. Spurious olanı, gecikmiş ACK'in yarattığı yanılsamadır.
- <span id="reverse-shell"></span>**Reverse Shell** (Ters Kabuk): Hedef makinenin saldırganın dinleyicisine geri bağlanıp kabuk vermesi. Firewall'lar dışarıyı kapatır ama kurbanın dışarıya çıkmasına karışamaz — kendisi gelir.
- <span id="ring-buffer"></span>**Ring Buffer** (Halka Tampon): Yakalamanın N dosya arasında döngüsel yazılıp en eskinin otomatik silinmesi. Disk sınırlıyken "son X saat her zaman elimde" sağlar; uzun süreli olay müdahalesi ve APT avının standardıdır.
- <span id="risk"></span>**Risk**: Bir olayın olasılığı ve etkisinin birleşimi. Belirsizlik durumunda kayıp veya hasar oluşma ihtimali.
- <span id="rogue-dhcp"></span>**Rogue DHCP** (Sahte DHCP): Ağa izinsiz giren DHCP sunucusu; kurbanlara kendi gateway ve DNS'ini dağıtır. Adam ortada (MITM) olur; tek paket bile şifreli olmak zorunda değildir.
- <span id="rootkit"></span>**Rootkit**: İşletim sisteminin en derinine yerleşip antivirüsten gizlenen kötü amaçlı yazılım. Tespiti çok zordur; genelde devlet düzeyi casus yazılımlarla birlikte gelir.
- <span id="rpc"></span>**RPC** (Remote Procedure Call — Uzaktan Yordam Çağrısı): Başka makinedeki fonksiyonu çağırma mekanizması; SAMR ve svcctl bunun üstünde koşar. Gerekli ama açıktır: saldırgan da çağırır.
- <span id="router"></span>**Router / Yönlendirici** (Modem): İnterneti eve dağıtan cihaz. Fabrika parolası "admin/admin" kalırsa saldırgan parola kırmadan tüm ağını ele geçirir.
- <span id="rtt"></span>**RTT** (Round-Trip Time): Paketin gidip cevabın dönmesi için geçen süre. Ağ sağlığının nabzıdır; C2 beacon analizi ve performans ölçümünün temel metriğidir.

</details>

<details class="toc-block" markdown="block" id="letter-s">
<summary>S</summary>

- <span id="sack"></span>**SACK** (Selective Acknowledgment): TCP'nin "sadece şu aralıklar elime ulaştı" diyebilmesi. Paket kaybında yalnız eksik parça yeniden gönderilir; gereksiz retransmission azalır.
- <span id="saldiri-agaci"></span>**Saldırı Ağacı** (Attack Tree): Saldırı senaryolarını ağaç yapısında modelleme yöntemi.
- <span id="saldiri-vektoru"></span>**Saldırı Vektörü** (Attack Vector): Saldırganın hedefe ulaşmak için kullandığı yol veya yöntem. E-posta, USB, web sitesi gibi çeşitli vektörler vardır.
- <span id="salt"></span>**Salt** (Tuz): Parola hash'ine eklenen, her kullanıcı için benzersiz rastgele değer. Aynı parola farklı tuzlarla farklı hash üretir; böylece rainbow table saldırıları engellenir.
- <span id="sam"></span>**SAM** (Security Account Manager): Windows'un yerel hesap ve parola hash deposu. Credential dumping'in birincil hedefidir; /etc/shadow'nun Windows karşılığıdır.
- <span id="samesite"></span>**SameSite**: Çerezin yalnız kendi sitesiyle gitmesini sağlayan öznitelik. CSRF'in panzehiridir: başka siteden gelen istek çerezi taşıyamaz.
- <span id="samr"></span>**SAMR** (SAM Remote Protocol): Windows'un uzaktan hesap veritabanı (SAM) sorgulama arayüzü; kullanıcı ve grup envanteri RPC (uzaktan yordam çağrısı) üzerinden dökülür. Anonim NULL oturumla birleşince saldırganın dizini sayfalama aracı olur.
- <span id="san"></span>**SAN** (Subject Alternative Name): Sertifikanın geçerli olduğu alan adları listesi. CN tek isim taşır, SAN ise siteyi ve tüm alt alan adlarını kapsar; modern sertifika doğrulaması SAN'e bakar.
- <span id="sandbox"></span>**Sandbox** (Kum Havuzu): Şüpheli bir dosyayı güvenli, izole ortamda çalıştırma yöntemi. Dosya zararlı olsa bile gerçek sistemine sıçrayamaz.
- <span id="sast"></span>**SAST** (Static Application Security Testing): Kaynak kodu çalıştırmadan analiz eden güvenlik testi. Kodu tarar ve bilinen güvenlik açığı kalıpları arar.
- <span id="sbom"></span>**SBOM** (Yazılım Bileşen Listesi, İng. Software Bill of Materials): Yazılımın "içindekiler etiketi". Hangi dependency, hangi sürüm, hangi license. Log4Shell gibi bir zafiyette hangi sistemlerde olduğu bilinir.
- <span id="sca"></span>**SCA** (Software Composition Analysis): Projenin kullandığı üçüncü parti kütüphanelerdeki bilinen güvenlik açıklarını tarayan analiz yöntemi.
- <span id="scada-plc"></span>**SCADA / PLC** (Endüstriyel Kontrol): Fabrikanın sinir sistemi: SCADA izler ve yönetir, PLC sahada fiziksel süreci yönetir. Ele geçirilince monitör değil pompa patlar; IT güvenliğinin OT kardeşidir.
- <span id="scareware"></span>**Scareware** (Korkutma Yazılımı): Sahte uyarılarla kullanıcıyı korkutup gereksiz yazılım sat almaya ikna eden saldırı yöntemi.
- <span id="screenlogger"></span>**Screenlogger** (Ekran Kaydedici): Tuşları değil ekranı kaydeden keylogger kardeşi; fare tıklamasında anlık görüntü alır. Sanal klavye panzehir sanılır — o da görüntülenir.
- <span id="script-kiddie"></span>**Script Kiddie**: Aracı çalıştıran ama ne yaptığını bilmeyen amatör saldırgan; imzası sqlmap/nikto User-Agent'ı ve hazır exploit'tir. Tehdidi az, gürültüsü çoktur — ve en çok yakalanan odur.
- <span id="sdl"></span>**SDL** (Security Development Lifecycle): Güvenli yazılım geliştirme yaşam döngüsü. Microsoft tarafından geliştirilen, güvenliği yazılım sürecine entegre eden çerçeve.
- <span id="sdlc"></span>**SDLC** (Software Development Life Cycle): Yazılım geliştirme yaşam döngüsü. Yazılımın gereksinimden bakıma kadar geçtiği tüm aşamalar.
- <span id="sdp"></span>**SDP** (Session Description Protocol): SIP INVITE'ın içindeki oturum tarifnamesi: medya portları, codec, yön. SDP'yi okuyan analist sesin nereden akacağını bilir.
- <span id="secret-management"></span>**Secret Management** (Gizli Anahtar Yönetimi): API anahtarları, parolalar ve şifreleme anahtarlarının koda gömülmeden, güvenli biçimde saklanması ve yönetilmesi. Vault, KMS gibi araçlarla yapılır.
- <span id="sender-reputation"></span>**Sender Reputation** (Gönderen İtibarı): E-posta gönderen IP/domain için ISP'lerin tuttuğu güven puanı. Düşük skor = spam'a düşme.
- <span id="sequence-number"></span>**Sequence Number** (Sıra Numarası): TCP'nin bayt sırasını takip eden 32 bitlik sayacı; bağlantıda her taraf rastgele bir başlangıç numarası (ISN) seçer, Wireshark göreceli (relative) gösterir. "Previous segment lost" ve duplicate ACK hikâyeleri bu sayının kopmalarından okunur.
- <span id="sertifika"></span>**Sertifika** (Certificate): Bir sunucunun kimliğini ve açık anahtarını taşıyan, bir CA tarafından imzalanmış dijital belge (X.509). Veren (issuer), konu (CN/SAN) ve geçerlilik tarihleri Wireshark'ta TLS el sıkışmasında açıkça görülür.
- <span id="session-hijacking"></span>**Session Hijacking** (Oturum Çalma): Ele geçirilen oturum çerezi/token ile parolasız kimliğe bürünme. Düz HTTP'de cookie görünür; HttpOnly (çerezi betikten gizleyen bayrak) ve TLS panzehirin parçasıdır.
- <span id="sha-256"></span>**SHA-256** (Secure Hash Algorithm): Dosya ve veriden üretilen 64 haneli parmak izi (hash). Aynı içerik aynı özeti verir; tek bit değişse özet tamamen değişir. IOC'lerin ve bütünlük kontrolünün standardıdır.
- <span id="shadow-it"></span>**Shadow IT** (Gölge BT): Çalışanların BT departmanından habersiz kullandığı yazılım, hizmet ve cihazlar. Güvenlik riskleri taşır.
- <span id="shared-responsibility"></span>**Shared Responsibility Model** (Sorumluluk Paylaşımı): Bulut sağlayıcı ve müşteri arasındaki sorumluluk paylaşımı. Sağlayıcı bulutun altyapısını, müşteri üzerindekileri korur.
- <span id="shift-left"></span>**Shift-Left** (Sola Kaydırma): Güvenliği sürecin en başına, yani tasarım ve geliştirme aşamasına çekme felsefesi. Hata ne kadar erken yakalanırsa düzeltme o kadar ucuz olur.
- <span id="sizma-testi"></span>**Sızma Testi** (Pentest): Sistemin zafiyetlerini bulmak için etik hackerlara yaptırılan sahte saldırı. Hangi açığın gerçekten sömürülebilir olduğunu kanıtlar.
- <span id="siber-casusluk"></span>**Siber Casusluk** (Cyber Espionage): Devlet veya devlet destekli aktörlerin bilgi çalma kampanyası. APT28/APT29 gibi ekipler yıllarca içeride yaşar; hedef veridir, şov değil.
- <span id="siber-dayaniklilik"></span>**Siber Dayanıklılık** (Cyber Resilience): Saldırıyı önlemenin ötesi: vurulunca da çalışmaya devam edebilme. Yedek, tekrarlama ve tatbikat üçlüsüyle inşa edilir.
- <span id="siber-zorbalik"></span>**Siber Zorbalık** (Cyberbullying): Dijital araçlarla tekrarlanan taciz, tehdit, iftira ve dışlama. Kurban çoğu zaman çocuktur; ekran görüntüsüyle kanıt topla, engelle, yetişkine ve platforma bildir.
- <span id="siem"></span>**SIEM** (Güvenlik Bilgi ve Olay Yönetimi, İng. Security Information and Event Management): Güvenlik bilgi ve olay yönetimi. Sistem loglarını merkezi olarak toplayan ve analiz eden sistem.
- <span id="sigstore"></span>**Sigstore**: Yazılım artifact'lerini imzalamak için modern araç seti. Cosign (imzalama), Rekor (transparency log), Fulcio (CA).
- <span id="sim-swap"></span>**SIM swap** (SIM Değişimi): Telefon numaranı başka bir SIM karta aktarıp hesaplarına erişme saldırısı.
- <span id="sip-rtp"></span>**SIP / RTP** (Session Initiation Protocol / Real-time Transport Protocol): VoIP'nin iki yakası: SIP çağrıyı kurar (sinyalleme), RTP sesi ve görüntüyü taşır (medya). Şifrelenmezse dinleme ve vishing altyapısı olur; SRTP ile korunur.
- <span id="slsa"></span>**SLSA** (Yazılım Tedarik Zinciri Seviyeleri, İng. Supply-chain Levels for Software Artifacts): Yazılım tedarik zinciri güvenlik seviyeleri. Seviye 1-4 arası, build sürecinin güvenliğini sertleştirir.
- <span id="smb"></span>**SMB** (Server Message Block): Windows dünyasının dosya ve yazıcı paylaşım protokolü. İmzasız oturumlar ağdan dosya çalmaya açıktır; SMBv1 (EternalBlue) fidye yazılımlarının tarihi kapısıydı.
- <span id="smishing"></span>**Smishing** (SMS Oltalaması): SMS ile yapılan oltalama. "Kargon teslim edilemedi, tıkla" tarzı mesajlarla sahte siteye çekilirsin; mesajdaki kısa linke tıklama.
- <span id="smtp"></span>**SMTP** (Simple Mail Transfer Protocol): E-posta gönderme protokolü; 25 sunucular arası aktarım (MTA), 587 istemci gönderimi, 465 TLS. EHLO → MAIL FROM → RCPT TO → DATA diyalogu STARTTLS yoksa düz metindir; açık relay spam fabrikasıdır.
- <span id="sni"></span>**SNI** (Server Name Indication): ClientHello'da taşınan hedef alan adı; aynı IP'te çok sertifika barındıran sunucuya doğru sertifikayı seçtirir. TLS kurulmadan ÖNCE gönderildiği için şifreli trafikte "kim nereye gitti" bilgisini yalnız SNI verir.
- <span id="snmp"></span>**SNMP** (Simple Network Management Protocol): Ağ cihazlarının yönetim ve izleme protokolü (UDP 161/162); parola görevi gören community string'leri v1/v2'de düz metindir. Amplification saldırısının sevilen vektörlerinden biridir.
- <span id="snort"></span>**Snort**: Açık kaynak IDS/IPS duayeni; imza tabanlı kurallarla trafiği eşleştirir. Snort 3'te kural ve konfigürasyon statik .conf dosyalarından Lua'ya taşındı — daha az kaynakla daha çok iş.
- <span id="soar"></span>**SOAR** (Security Orchestration, Automation and Response): Tekrarlayan güvenlik müdahale adımlarını otomatikleştiren araç.
- <span id="soc"></span>**SOC** (Security Operations Center): Güvenlik operasyon merkezi; alarmın insana ulaştığı ve kararın verildiği oda. SIEM görür, EDR tutar, SOC analisti karar verir ve olayı yönetir.
- <span id="soc-2"></span>**SOC 2** (Service Organization Control 2): Hizmet kuruluşlarının güvenlik, kullanılabilirlik ve gizlilik kontrollerini denetleyen rapor standardı. ISO 27001 süreç ister, SOC 2 kontrol işler; bulut tedarikçilerinin ortak dilidir.
- <span id="soguk-cuzdan"></span>**Soğuk Cüzdan** (Cold Wallet): Anahtarları internetle hiç temas etmeyen kripto cüzdan. Sıcak cüzdan onlinedir, soğuk cüzdan kasadır; fidye ödemeleri dahi izlenebilir.
- <span id="sosyal-muhendislik"></span>**Sosyal Mühendislik** (Social Engineering): Teknik açığı değil insanı hedefleyerek bilgi çalma sanatı. Oltalama, pretexting, baiting, vishing ve quid pro quo bu ailenin üyeleridir; panzehiri teknoloji değil, farkındalıktır.
- <span id="sozluk-saldirisi"></span>**Sözlük Saldırısı** (Dictionary Attack): Parolayı olasılıklardan değil kelimelerden deneme; wordlist (crunch ile üretilir) sırayla gezilir. "123456" ve sızıntı listeleri saniyeler içinde düşer.
- <span id="spear-phishing"></span>**Spear Phishing** (Hedefli Oltalama): Sana özel hazırlanan oltalama. Saldırgan senin hakkında bilgi toplamış, mesajı inandırıcı kılmış; siyasetçi ve üst düzey yöneticiler birinci hedeftir.
- <span id="spf"></span>**SPF** (Sender Policy Framework): "Benim domainimden sadece şu IP'ler mail atabilir" DNS kaydı.
- <span id="spn"></span>**SPN** (Service Principal Name): Servisin Kerberos kimliği: `cifs/dc.shark-tank.local` gibi servis/host biçimi. Dizindeki her SPN için bilet istenebilir — Kerberoasting'in hedef listesi budur.
- <span id="spnego"></span>**SPNEGO** (Simple and Protected GSSAPI Negotiation): "Hangi kimlik doğrulama mekanizmasını kullanalım?" pazarlığını yapan katman; Kerberos ile NTLM arasını seçer ve SMB Oturum Kurulumu'nun Güvenlik Blob'unda taşınır.
- <span id="spoofing"></span>**Spoofing** (Kimlik Taklidi): Kimlik taklidi. Telefon numarası, e-posta veya web adresini sahte gösterme.
- <span id="sql-injection"></span>**SQL Injection** (SQL Enjeksiyonu): Kullanıcı girdisinin SQL sorgusuna enjekte edilmesiyle veritabanına sızma saldırısı. Parametreli sorgu ile önlenir.
- <span id="ssh"></span>**SSH** (Secure Shell): Uzaktan erişimin şifreli standardı (22); Telnet'in yerine geçti, SFTP ve port tünellemenin de taşıyıcısıdır. Interaktif her tuş PSH ile gider.
- <span id="ssid"></span>**SSID** (Service Set Identifier): Bir kablosuz ağın adı. Kullanıcıların telefonunda veya bilgisayarında gördüğü Wi-Fi ağ adıdır (örn. "Shark-Tank-Corp"). SSID, Beacon frame'leri içinde yayınlanır. 1-32 karakter uzunluğunda olabilir ve gizlenebilir (hidden SSID); gizli ağlarda Beacon'da SSID alanı boş bırakılır. BSSID (Basic Service Set Identifier) ise AP'nin MAC adresidir ve aynı SSID'ye sahip birden fazla AP'yi birbirinden ayırmak için kullanılır.
- <span id="ssl-stripping"></span>**SSL Stripping** (SSL Soyma): HTTPS'e gitmesi gereken bağlantının MITM tarafından HTTP'de tutulması; kimlik bilgileri düz metin akar. Panzehiri HSTS başlığıdır: tarayıcı o siteyi hiç HTTP ile açmaz.
- <span id="ssrf"></span>**SSRF** (Sunucu Taraflı İstek Sahteciliği, İng. Server-Side Request Forgery): Saldırganın sunucuyu kandırarak iç ağa veya bulut metadata servislerine istek göndermesi. Sunucu güvenlik duvarının içerisindedir; bu güvenlik avantajı kötüye kullanılır.
- <span id="starttls"></span>**STARTTLS** (TLS Başlatma): Düz bağlantının (SMTP 587, LDAP 389) komutla TLS'e yükseltilmesi. Aynı portta iki dünya; yükseltme paketi Wireshark'ta görülür — "önce düz sonra şifreli" trafik bunun imzasıdır.
- <span id="steganografi"></span>**Steganografi** (Steganography): Bilgiyi başka bir verinin içine gizleme — resmin piksel bitlerine gömülü script gibi. Şifreleme içeriği saklar; steganografi içeriğin VAR OLDUĞUNU saklar.
- <span id="stride"></span>**STRIDE** (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege): Microsoft tarafından geliştirilen tehdit modelleme çerçevesi. Altı tehdit kategorisini tanımlar.
- <span id="stuxnet"></span>**Stuxnet**: İran'ın nükleer santrifüjlerini yok eden, air gap'i USB ile aşan tarihi zararlı. Birden çok zero-day kullandı ve yıllarca yakalanmadı; modern APT'lerin babası sayılır.
- <span id="subdomain"></span>**Subdomain** (Alt Alan Adı): Ana alanın altındaki etiket (mail.example.com'daki "mail"). Keşif hedefi ve sızdırma kanalıdır: uzun, rastgele subdomain'ler tünel imzasıdır.
- <span id="subnet-mask"></span>**Subnet Mask** (Alt Ağ Maskesi): IP'nin ağ kısmı ile cihaz kısmını ayıran maske (/24 = 255.255.255.0). Cihaz hedefi maskeyle karşılaştırır: aynı ağsa doğrudan gönderir, değilse gateway'e emanet eder.
- <span id="sulama-deligi"></span>**Sulama Deliği** (Watering Hole): Sık kullandığın web sitesinin zehirlenip sana otomatik zararlı bulaştırılması. Hedefe doğrudan gitmek yerine yolunun üstünde pusu kurar.
- <span id="surec-agaci"></span>**Süreç Ağacı** (Process Tree): Süreçlerin ebeveyn-çocuk zinciri. "Zararlı süreci kim çağırdı?" sorusunun cevabıdır; word.exe'nin powershell doğurması klasik skandaldır.
- <span id="syn-cookie"></span>**SYN Cookie** (SYN Çerezi): SYN flood'a karşı savunma: sunucu bağlantı tablosu tutmadan yanıta şifreli bilgi gömer; meşru istemci ACK ile dönerse bağlantı o an kurulur. Sahte SYN'ler tablo yemek yerine boşa düşer.
- <span id="syn-flood"></span>**SYN Flood** (SYN Seli): Hedefe yarıda bırakılan binlerce SYN gönderip bağlantı tablosunu doldurma; half-open birikir, meşru istemciye yer kalmaz. Hafifletme: SYN cookie ve rate limiting.
- <span id="systemd"></span>**systemd**: Modern Linux dağıtımlarının açılış ve servis yöneticisi (eski init sistemi SysVinit'in halefi). Otomatik başlayan her servis bir kalıcılık adayıdır; `systemctl` analistin ikinci doğasıdır.

</details>

<details class="toc-block" markdown="block" id="letter-t">
<summary>T</summary>

- <span id="tabletop"></span>**Tabletop Exercise** (Masa Başı Tatbikatı): IR ekibinin bir senaryo üzerinden sözlü olarak müdahale tatbikatı. Yılda en az 2 önerilir.
- <span id="tailgating"></span>**Tailgating** (Arkaya Takılma): Arkana takılma. Fiziksel güvenliği aşmak için yetkisiz kişinin senin peşinden geçmesi.
- <span id="tails"></span>**Tails**: USB'ye kurulan ve bilgisayarda hiç iz bırakmayan işletim sistemi. USB'yi çıkarınca ne yaptığın unutulur; gazeteci ve aktivistlerin yüksek riskli aracı.
- <span id="tampering"></span>**Tampering** (Veri Bozma): Verinin yetkisiz bir kişi tarafından değiştirilmesi. STRIDE tehdit kategorilerinden biri.
- <span id="tck"></span>**TCK** (Türk Ceza Kanunu): Bilişim suçlarını ve cezalarını düzenleyen temel yasa. Bilişim alanındaki suçlar TCK'nın çeşitli maddelerinde tanımlanır.
- <span id="tcp"></span>**TCP** (Transmission Control Protocol): Bağlantı kuran, sıralayan, onaylayan güvenilir taşıma protokolü: 3-way handshake, sequence/ACK, retransmission. Web, e-posta ve dosya transferinin tamamı TCP üzerindedir; hız gerekince UDP.
- <span id="tcp-bayraklari"></span>**TCP Bayrakları** (SYN, ACK, FIN, RST, PSH, URG): Bağlantının kontrol sinyalleri: SYN açar, ACK onaylar, FIN kapatır, RST zorla keser, PSH veriyi anında iletir, URG acil işaretler. SYN=1 & ACK=0 bir taramanın başlangıcı, yalnız RST ise kapalı kapıdır.
- <span id="tcpdump"></span>**tcpdump**: Terminalin klasik paket yakalayıcısı; BPF dilinin atası, tshark'ın sade amcası. Sunucuda GUI yokken ilk başvurulan araçtır; çıktısı pcap olarak Wireshark'ta açılır.
- <span id="tcp-stream-graph"></span>**TCP Stream Graph**: Wireshark'ın tek bir TCP bağlantısını dört grafikle inceleyen araç seti: Time-Sequence, Throughput, RTT ve Window Scaling. IO Graph tüm trafiğe bakar, bu dörtlü tek akışa bakar.
- <span id="tedarik-zinciri"></span>**Tedarik Zinciri Saldırısı** (Supply Chain Attack): Saldırganın hedef kuruma ulaşmak için önce kurumun tedarikçilerinden veya üçüncü taraf servislerinden birini hedef aldığı saldırı türü.
- <span id="tehdit-agaci"></span>**Tehdit Ağacı** (Threat Tree): "Ne olabilir?" sorusuna odaklanan, tehditleri stratejik düzeyde modelleme yöntemi.
- <span id="tehdit-aktoru"></span>**Tehdit Aktörü** (Threat Actor): Saldırıyı planlayan ve yürüten kişi/grup: devlet, siber suçlu, hacktivist, insider. CTI'nin cevapladığı "kim?" sorusunun öznesi.
- <span id="tehdit-avciligi"></span>**Tehdit Avcılığı** (Threat Hunting): Alarm beklemeden, hipotezle ağda saldırgan arama. Proaktif savunmanın ta kendisi; SOC'un av modu.
- <span id="telnet"></span>**Telnet**: Şifresiz uzaktan erişim protokolü (23); kimlik dahil her şey düz metin. Tarihi değeri dışında kullanılmamalı; işi SSH'ye bırakmıştır.
- <span id="tersine-muhendislik"></span>**Tersine Mühendislik** (Reverse Engineering): Derlenmiş koddan geriye doğru anlam çıkarma: makine kodu sökümü (disassembly), string avı, davranış analizi. Zararlı analistinin ana mesleğidir; packer ve obfuscation tam da bunun için vardır.
- <span id="tgt"></span>**TGT** (Ticket Granting Ticket): "Bilet veren bilet"; KDC'nin AS hizmetinden alınır ve her servis erişiminde TGS'ye sunulur. Bellekte yaşamak zorundadır — çalınırsa pass-the-ticket kapısı açılır.
- <span id="threat-model"></span>**Threat model** (Tehdit Modeli): Tehdit modeli. Seni kim, ne amaçla, hangi yöntemle hedef alabilir sorusunun analizi.
- <span id="throughput"></span>**Throughput** (Fiili Aktarım Hızı): Bağlantıda saniyede fiilen taşınan veri; bandwidth kapasite, throughput gerçekleşen paydır. TCP Stream Graph'ta çizilir; düşüşler kayıp ve retransmission hikâyesi anlatır.
- <span id="timing-attack"></span>**Timing Attack** (Zamanlama Saldırısı): Bir işlemin süresini ölçerek gizli bilgi çıkarma saldırısı. Örneğin parola karşılaştırmasının süresi, doğru karakter sayısını ele verebilir. Sabit süreli karşılaştırma ile önlenir.
- <span id="tld"></span>**TLD** (Top-Level Domain — Üst Seviye Alan Adı): Alan adının son halkası (.com, .org, .tr). DNS çözümlemesinde kökten sonra ilk duraktır; sahte TLD'ler oltalama davetiyeleridir.
- <span id="tls-handshake"></span>**TLS El Sıkışması** (Handshake): Şifreli bağlantının kurulum diyalogu: istemci ClientHello ile desteklenen algoritmaları yollar, sunucu ServerHello ile seçer ve sertifikasını verir. TLS 1.3'te adımlar kısaldı; bitince her şey Application Data olur.
- <span id="tls-rpt"></span>**TLS-RPT** (TLS Reporting): E-posta TLS hatalarını raporlayan mekanizma. MTA-STS ile birlikte kullanılır.
- <span id="tor"></span>**Tor**: İnternet trafiğini dünyadaki birçok bilgisayardan geçirip kimliğini gizleyen tarayıcı ve ağ. Yavaştır; günlük değil, kaynak koruma gibi özel durumlar içindir.
- <span id="totp"></span>**TOTP** (Zamana Bağlı Tek Kullanımlık Parola, İng. Time-based One-Time Password): Zamana bağlı tek kullanımlık parola. Google Authenticator gibi uygulamaların ürettiği 6 haneli koddur; 30 saniyede bir değişir.
- <span id="traceroute"></span>**traceroute**: Paketin yoldaki router'ları adım adım listeyen araç; TTL'i kasten 1, 2, 3... gönderip dönen ICMP Time Exceeded'lerden yol haritası çıkarır. `tracert` ve `traceroute -I` ICMP sorgu paketi (probe) kullanır.
- <span id="transaction-id"></span>**Transaction ID** (İşlem Kimliği): Sorgu-yanıt eşleştirmesini yapan kimlik (DNS'de 16 bit, DHCP'de XID). Yanıt beklenmedik bir ID taşıyorsa spoofing ihtimali doğar.
- <span id="trojan"></span>**Trojan** (Truva Atı): Faydalı bir program gibi görünüp içinde zararlı taşıyan yazılım. "Ücretsiz oyun", "video indirici", "hızlandırıcı" kılığında gelir.
- <span id="tshark"></span>**tshark**: Wireshark'ın komut satırı kardeşi; pcap'ı filtrelerle, alan bazında ve betiklerle işler. GUI'de manuel öğrenilenin otomasyona çevrildiği kapıdır.
- <span id="ttl"></span>**TTL** (Time to Live): Paketin kaç yönlendirici atlayabileceğini sayan sayaç. Her hop'ta bir azalır, sıfırda paket ölür; traceroute bu ölüm bildirimlerinden yol haritası çıkarır.
- <span id="ttp"></span>**TTP** (Taktik, Teknik ve Prosedür): Tehdit aktörünün çalışma tarifi: taktik niyet, teknik yöntem, prosedür adım adım uygulama. MITRE ATT&CK'in katalogladığı şey tam olarak budur.
- <span id="typosquatting"></span>**Typosquatting** (Yazım Yanlışı Tuzağı): Yaygın paket adlarına benzer sahte paketler. `requests` yerine `request` gibi. Yorgun geliştirici yanlış yazınca kötü amaçlı kod yüklenir.

</details>

<details class="toc-block" markdown="block" id="letter-u">
<summary>U</summary>

- <span id="uac"></span>**UAC** (User Account Control): Windows'un ayrıcalık artışını onaya tabi tutan mekanizması. Bypass'ı ayrı bir sanattır (sdclt.exe gibi); panzehir "Evet" refleksini kırmaktır.
- <span id="uçtan-uca"></span>**Uçtan Uca Şifreleme** (End-to-End Encryption): Mesajı sadece senin ve alıcının okuyabildiği, aradaki sunucunun (şirketin bile) göremediği şifreleme. Signal'de varsayılan; Telegram'da ancak "gizli sohbet" ile açılır.
- <span id="udp"></span>**UDP** (User Datagram Protocol): Bağlantı kurmadan, onay beklemeden direkt gönderen taşıma protokolü; 8 byte'lık başlık. DNS, VoIP, oyun ve video UDP'dedir; handshake olmadığı için spoofing ve amplification'a açıktır.
- <span id="uyumluluk"></span>**Uyumluluk** (Compliance): Yasa ve standartların istediği güvenlik kontrollerini belgeli biçimde karşılamak: KVKK, GDPR, ISO 27001, SOC 2, PCI DSS, DORA. Tek seferlik denetim değil, sürekli denetlenebilirlik ister.

</details>

<details class="toc-block" markdown="block" id="letter-v">
<summary>V</summary>

- <span id="vault"></span>**Vault**: Gizli anahtarları (API key, parola, şifreleme anahtarı) merkezi ve güvenli biçimde saklayan sistem. HashiCorp Vault en bilinen örnektir. Anahtarlar koda gömülmez, Vault'tan dinamik olarak alınır.
- <span id="verbis"></span>**VERBİS** (Veri Sorumluları Sicili): Kişisel Verileri İşleyen Veri Sorumluları Sicili. KVKK kapsamında veri sorumlularının kayıt yaptırmak zorunda olduğu sistem.
- <span id="veri-brokeri"></span>**Veri Brokerı** (Data Broker): Senin hakkında toplanan verileri toplayıp satan şirket. Adını hiç duymadığın firmalar profilini alıp satıyor; çıkış talep edebilirsin.
- <span id="veri-ihlali"></span>**Veri İhlali** (Data Breach): Kişisel verilerin yetkisiz kişilerin eline geçmesi. KVKK kapsamında kurum, ihlali en kısa sürede ilgili kişilere ve Kurul'a bildirmek zorundadır.
- <span id="veri-minimizasyonu"></span>**Veri Minimizasyonu** (Data Minimization): Kişisel verilerin işleme amacıyla sınırlı olarak, olabildiğince az toplanması prensibi.
- <span id="veri-sorumlusu"></span>**Veri Sorumlusu** (Data Controller): Kişisel verilerin işleme amaçlarını ve yöntemlerini belirleyen ve veri kayıt sistemini kuran kişi veya kurum.
- <span id="virüs"></span>**Virüs** (Virus): Dosyalara bulaşan, onları değiştiren ve kendini kopyalayan klasik kötü amaçlı yazılım. Genelde bir dosyayı açınca çalışır; günümüzde azaldı ama hâlâ var.
- <span id="vishing"></span>**Vishing** (Sesli Oltalama): Telefonla yapılan oltalama. Arayan banka, polis veya teknik destek rolü oynar; numara sahtelenebilir. Kapat, resmi numarayı sen tuşla.
- <span id="vlan"></span>**VLAN** (Virtual LAN — Sanal Ağ): Tek fiziksel anahtarı mantıksal ağlara bölen etiketleme (802.1Q); her çerçeveye 4 byte'lık etiket ekler. Yayın alanlarını daraltır ama trunk yanlış yapılandırılırsa VLAN hopping (VLAN'lar arası kaçak geçiş) kapısı açılır.
- <span id="vlan-hopping"></span>**VLAN Hopping** (VLAN Atlama): Saldırganın kendisini başka VLAN'da göstererek ağ ayrımını delmesi; double tagging ve kötü yapılandırılmış yerel VLAN klasik yollardır. VLAN sınırı güvenlik sınırı değildir.
- <span id="voip"></span>**VoIP** (Voice over IP — İnternet Telefonu): Sesli görüşmeyi IP ağı üzerinden taşıyan teknoloji. Sinyalleme SIP, ses RTP ile taşınır; jitter ses kalitesinin baş düşmanıdır.
- <span id="vpn"></span>**VPN** (Virtual Private Network): Sanal özel ağ. İnternet trafiğini şifreleyerek üçüncü taraflardan gizler.

</details>

<details class="toc-block" markdown="block" id="letter-w">
<summary>W</summary>

- <span id="wcna"></span>**WCNA** (Wireshark Certified Network Analyst): Wireshark üzerinde ağ analizi sertifikası; display filter, expert bilgi ve grafik okuma becerisini ölçer. Bu serinin müfredat hedeflerinden biridir.
- <span id="webauthn"></span>**WebAuthn** (Web Authentication): W3C standardı, Passkeys'in temel API'si. Tarayıcıdan parolasız kimlik doğrulama.
- <span id="whaling"></span>**Whaling** (Balina Avlama): Üst düzey yöneticilere (CEO, bakan, genel müdür) yapılan hedefli oltalama. Spear phishing'in en üstü; inandırıcılığı ve hasarı daha büyüktür.
- <span id="white-team"></span>**White Team** (Beyaz Takım): Tatbikatın hakem ve kontrol kulesi: kuralları koyar, skorları tutar, kurguyu yönetir. Red saldırır, Blue savunur, Purple öğretir, White izler.
- <span id="whois"></span>**whois**: Alan adının kayıt bilgilerini sorgulayan protokol ve araç: kime kayıtlı, ne zaman, hangi DNS sunucuları. OSINT'in ilk kapısıdır.
- <span id="wireshark"></span>**Wireshark**: Ağ trafiğini paket paket görselleştiren sektör standardı analiz aracı. Display/capture filter ile trafiğin hikâyesini okur; eklentileri Lua ile yazılır.
- <span id="wmi"></span>**WMI** (Windows Management Instrumentation): Windows'un yönetim ve otomasyon altyapısı; PowerShell ile birlikte LotL saldırılarının iki kolundan biridir. Süreç başlatma ve bilgi toplama "meşru yönetim" kılığında yapılır.
- <span id="worm"></span>**Worm** (Solucan): Kendi kendine ağda yayılan zararlı; tıklamaya ihtiyaç duymaz. Morris Worm'dan beri internetin bağımsız gezginidir.
- <span id="wpa"></span>**WPA2 / WPA3** (Wi-Fi Protected Access): Wi-Fi ağının şifreleme standartları. Modem ayarında bunlardan biri olsun; eski WEP ise dakikalar içinde kırılır.
- <span id="wps"></span>**WPS** (Wi-Fi Protected Setup): Modeme tuşa basarak hızlı bağlanma özelliği. Kırılması kolaydır; güvenlik için modem arayüzünden kapat.

</details>

<details class="toc-block" markdown="block" id="letter-x">
<summary>X</summary>

- <span id="xss"></span>**XSS** (Cross-Site Scripting): Siteler arası betik çalıştırma. Saldırganın web sayfasına JavaScript kodu enjekte etmesi. Kullanıcının tarayıcısı o kodu sayfanın parçası sanır ve çalıştırır; çerezler çalınabilir, oturum ele geçirilebilir.

</details>

<details class="toc-block" markdown="block" id="letter-y">
<summary>Y</summary>

- <span id="yama"></span>**Yama** (Patch): Üreticinin zafiyeti kapatan güncellemesi. Yamasız kalmak kapıyı açık bırakmaktır; exploit kitler yamalanmış açıkların bile gerisinde koşar.
- <span id="yanal-hareket"></span>**Yanal Hareket** (Lateral Movement): İlk kurbandan diğerlerine sıçrama: uzaktan yürütme araçlarıyla (PsExec, WinRM) ve çalınan kimlik bilgileriyle. Tek makine ihlali, yanal harekette bir ağ ihlaline dönüşür.
- <span id="yeniden-kimliklendirme"></span>**Yeniden Kimliklendirme** (Re-identification): Anonimleştirilmiş verinin yan bilgilerle (posta kodu, zaman damgası, alışkanlık) yeniden kişiye bağlanması. Anonimleştirmenin düşmanıdır; birleşik veri setleri bu riski katlar.

</details>

<details class="toc-block" markdown="block" id="letter-z">
<summary>Z</summary>

- <span id="zafiyet"></span>**Zafiyet** (Vulnerability): Bir sistemdeki güvenlik açığı.
- <span id="zero-click"></span>**Zero-click** (Sıfır Tıklama): Sıfır tıklama açığı. Kullanıcı hiçbir şey yapmadan cihaza bulaşan saldırı.
- <span id="zero-day"></span>**Zero-day** (Sıfırıncı Gün Açığı): Sıfırıncı gün açığı. Üreticinin henüz farkında olmadığı veya yaması çıkmamış güvenlik açığı.
- <span id="zero-trust"></span>**Zero Trust** (Sıfır Güven): "Asla güvenme, sürekli doğrula" felsefesi. Klasik sınır güvenliğinin (firewall, VPN) aksine, her erişim isteğini her seferinde doğrular. NIST SP 800-207 standardı.
- <span id="zero-window"></span>**Zero Window** (Sıfır Pencere): TCP alıcısının "tamponum dolu, gönderme" demesi (pencere = 0). Kısa süreli normaldir; uzun sürmesi alıcının tıkandığının işaretidir ve performans analizinde ilk şüphelidir.
- <span id="ztna"></span>**ZTNA** (Sıfır Güven Ağ Erişimi, İng. Zero Trust Network Access): VPN'in yerini alan modern erişim mimarisi. Tüm ağ yerine, uygulama düzeyinde erişim. Cloudflare Access, Zscaler, Netskope örnek.

</details>
