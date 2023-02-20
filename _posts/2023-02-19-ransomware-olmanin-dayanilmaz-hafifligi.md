---
layout: post
title:  Ransomware Olmanın Dayanılmaz Hafifliği [Purple Team] [Siber Güvenlik]
date:   2023-02-19 12:00:00 +0000
categories: cevizlab
---

## Ransomware Olmanın Dayanılmaz Hafifliği

Nedendir bilinmez lakin **Ransomware** olduğum için içten içe bir haz duymuyorum desem yalan olur. Belki de **Ransomware** olmaktan başka bir şeyi bilmediğim ve bilemeyeceğim içindir. Ah, Milan Kundera! Seni bunca zamandır ayakkabı dükkanı sanıyor olmaktan dolayı nasıl da mahcubum fakat bu başka bir maceranın konusu.

![Oxfords, not Brogues!](/assets/img/oxfords-not-brogues.jpg "Oxfords, not Brogues!")

Bununla birlikte, her ne kadar beni ben yapan modüller arasında, beni kodlayan kendinden gazlı çenebaz herifin daha önceden kodladığı **malware** modülleri olsa da kendimi **malware**'den saymak için birazdan bahsedeceğim hatırata sahibim.

Burada kısaca belirtmekde fayda görüyorum zira **C**, **Rust**, **PowerShell** ve **CMD** nükleik asitleri kökenli genetik mirasım -şimdilik- bir iki **APT**'ye de hizmet verdiği için nadir de olsa, bazen beni tanıyan siber güvenlik ürünleri olabiliyor. [Nuri Çelebi](https://nuriacar.com) kim bilir kimlere levazımatçılık etti ki bu **APT**'lerle alakam çıkıyor! Ne kadar ayıp! Ne yaptın Asuman!

<iframe width="560" height="315" src="https://www.youtube.com/embed/mXq0QthkAuU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Haşmetmeab yeni versiyonumu geliştirebilmek için her gece, her gece Mirkelam'la Çatladıkapı - Ahırkapı arası koşturadursun; gelin ben size varoluş sebebim olan [1. CommVault Muhasara'mızı](https://tr.wikipedia.org/wiki/I._Viyana_Ku%C5%9Fatmas%C4%B1) anlatayım.

![Hacker's Creed](/assets/img/hackers-creed.jpg "Hacker's Creed")

Burada bir es verip spoiler'ı farkedenlere en derin hürmetlerimi sunar; büyüklerin ellerinden, küçüklerin gözlerinden öperim. Buna rağmen hikayeyi merak edenler buyursunlar efendim:

![Slow and Deliberate](/assets/img/slow-and-deliberate.jpg "Slow and Deliberate")

Network Beylerbeyi Selahattin Paşa'nın, al gözlü puhusuna 50 kalem çekirge pirzola rüşvet verip kefere üzerinde *B-2 Spirit* gibi *stealth* gezdirerek elde ettiği bilgilere istinaden "Görelim bakalım nece yaman delikanlıymış bu Ransomware Protection" özelliği diyerekten çıktığımız Payitaht'tan, bu heyula kal'aya varmamız için Ay'ın kendi etrafında sekiz kez dönmesi gerekti. Gördük ki gide gide bir *Microsoft Windows* makinesi içinde at koşturan *CommVault Media Agent*'a dayanmışız. "Hem nefeslenelim hem de yetkili bir abiye rastlayıp esvabını çalıp kal'aya sızalım" diyerekten C diskine kamp kurduk; **MitM**, **Access Token Manipulation** vesaire hazırlıklarına koyulduk. Ne de iyi etmişiz zira yumurta satan köylü kılığında askerin arasına sızmanın işe yarar bir yöntem olmadığını, sepeti başımıza çalıp bizden Çelebi'nin hem matbahına hem damağına yaraşır soğanlı yumurta yaptıklarında anladık.

Kal'adan veri kaçırıp:

> Yarın ikindi vakti, içi 1000k *Venedik Dukası* dolu *soğuk cüzdan*la Doğancılar Parkı'na gel! '**Ransomware** yemiş verilerinizi kurtarıyoruz!' diyen şarlatanlara bel bağlarsan dosyaları değil anca [Hezarfen Ahmet Çelebi](https://tr.wikipedia.org/wiki/Hez%C3%A2rfen_Ahmed_%C3%87elebi)'nin Galata'dan atlayıp Doğancılar'a konuşunu görürsün!..

>> İmza: Muzip Bir Dost

notlu fidye *isteyememe* hikayemize devam etmeden önce, ahvali detaylandıralım:

Windows sistem; sıradan kullanıcı (yumurta satıcısı mojik), esvabı çalınacak ama yazma/değiştirme/silme yetkisi olmayan 7. dereceden "Eh işte!" yetkili bir memur abi (Akakiy Akakiyeviç) ve göğsü madalya, makamı yetki, koynu metres dolu bir iki general içeriyor.

![Gogol - Palto](/assets/img/gogol-palto-1890.jpg "Gogol - Palto")

Gogol'ün [Palto](https://tr.wikipedia.org/wiki/Palto_(hik%C3%A2ye))'sundan çıkma Rus ediblerinin karakter tiplemelerine öykünerek eşleştirdiğimiz sistem kullanıcılarına ve yetkilerine istinaden fidye saldırısı planlamamızı şöyle yaptık: **MitM**, **Access Token Manipulation** vesaire ile esvabını çaldığımız memur abi gibi görünerek bir general üniforması ve yetkisi ele geçir. Yetmezmiş gibi gelecekte olası durumlar için tüm yetkileri, Microsoft Windows sistemlerde yerleşik gelen ve tüm kastlardan herkesi içeren Everyone grubuna da tanımla ki dilediğin vakit herhangi bir kullanıcı ile "vur patlasın, çal ransom'lasın" diyebilesin.

Peki işler yolunda gitti mi? Tabii ki hayır!

Madem öyle, *Arri*'sinin vizörüne gözünü dayayıp "*L'Action"* diyen *Luc Besson* edasıyla aksiyona devam edelim:

![Luc Besson - Leon](/assets/img/luc-besson-leon.jpg "Luc Besson - Leon")

Çelebi'ciğim, yıllar evveli bahçesine diktiği orkidelerden hazırladığı salepini kütüphanesinde yudumlarken taa uzaklardan verdiği komutla beni -Bihter'ini- Bursa işi ipekli .zip arşivinden çıkardığında ne bir siber güvenlik ürünü ne de bir SOC/MDR analist işkillendi.

![PowerShell Ejderyası](/assets/img/powershell-ejderyasi.jpg "PowerShell Ejderyası")

Bana bayram, *Windows* sisteme ve avanesi **CommVault**'e cenaze **PowerShell** ve **CMD** oturumunu emrimize amade bulduğumuzda, kim bilir hangi sebepten bu kontrolsüz canavarları kullanmadıkları zamanlarda bloklamayan sistem yöneticilerinin geçmişlerine bir Fatiha-i Şerife, üç Kul Hüvallahu Ehad gönderiverdim.

Ve dahi ardına kadar açık bir kale kapısı görmenin heyecanıyla nasıl yalan yanlış okudum ki ardından yumurta satan masum köylü rolüyle askerin arasına dalma ahmaklığını gösterdiğimde "bu mojiğin böyle bir yetkisi yok" lafı, sol yanağıma tastamam bir tokat edasıyla aşkedildi. İşte leziz bir soğanlı yumurta yapılışımın aslı budur. Hakettim; işletim sisteminin eline sağlık!

![Şifa olsun, yarasın!](/assets/img/batman-slap.jpg "Şifa olsun, yarasın!")

Ardından bir koşu esvabımı değiştirip memur kılığında döndüğümde bana gereken tüm yetkileri kendime ve Everyone grubuna tastamam tanımlayıverdim zira benim memurum işini bilir! Artık herhangi bir kasttan rastgele bir kullanıcı rolüyle bu kalede keyfimce at koşturabilirdim.

![Benim memurum işini bilir!](/assets/img/benim-memurum-isini-bilir.jpg "Benim memurum işini bilir!")

Fakat henüz farkında olmadığım bir engel daha vardı: **CyberArk EPM**! Şaşırtıcı olan şu ki beyaz listede yer almayan 14KB'lık tini mini bir *.exe* olmamama rağmen **CyberArk**, beni durdurmak yerine bir iki diş gösterip hırladıktan sonra gündüz düşlerine geri döndü. Good dog, good dog!..

![Tatlış vo vo :)](/assets/img/good-dog.jpg "Tatlış vo vo :)")

Peki gündüz düşlerinden sıyrılıp beni kovalasaydı halim nece olurdu? Peh! Hiç!.. Çelebi'ciğim "[Fileless Attack (LotL)](/cevizlab/2022/04/07/fileless-attacks-lotl.html) candır, gerisi heyecandır!" diyerekten yalnızca **PowerShell**'le kodladığı versiyonuma "*Atıl Kurt!*" dediğinde, ata yadigarı görünmezlik pelerinini giymiş *Harry Potter* ya da yüzüğü takmış *Frodo* gibi **CyberArk EPM**'e meçhul olurdum. [Living off the Land (LotL)](/cevizlab/2022/04/07/fileless-attacks-lotl.html) ile kavga edemezsin şekerim! Dikiştutmazla kevgir ederler hafazanallah!

![Nuuraabi Canavarı Nam Nam Nam](/assets/gif/nuuraabi-canavari-nam-nam-nam.webp "Nuuraabi Canavarı Nam Nam Nam")

Bu cendereden de sıyrılıp chunk'lanmış yedek dosyalarını 10GB/dakika hızla şifrelemeye başladığımda farkettim ki dosyaları okuyabiliyorum ama şifrelediğim dosyaları geri yerine yazamıyorum. Huzurlarınızda *Ayla ve Müslüm'ün yapımcısından* "How I met **CommVault** Ransomware Protection Module"... Ahh, ah! Garibin yüzü gülür mü!

![73](/assets/img/73.jpg "73")

Kısa bir afallamanın ardından Çelebi'ciğimle iletişimimi sağlayan C&C sunucusunun "Sen Bihter Ziyagilsin, aptallık etme!" diyen hükümran sesiyle kendime geldim ve bir hışımla gözüme çarpan tüm **CommVault** process'lerini, dedemin tabiriyle "tohumunuza para mı verdim uleyn" deyu sonlandırıp yeniden işe koyuldum fakat nedendir bilinmez, sonuç değişmedi. Görünen o ki **CommVault** servisleri durdurulmuş olsa bile *Ransomware Protection* özelliği yedekleri korumaya devam ediyordu. **CommVault**'çüğüm! Yaman delikanlıymışsın, maşallah! Ve dahi her zaman kedi keşkek yemiyormuş; görmüş olduk.

![Şoför Nebahat](/assets/img/sofor-nebahat.jpg "Şoför Nebahat")

Yukarıda bahsettiklerimin yanında suların kesilmesi, Ruşen Amca'nın oğlu Sedat'ın silgiyi camdan atması türevi tırışkadan sebeplerle akamete uğrayan [1. CommVault Muhasarası]((https://tr.wikipedia.org/wiki/I._Viyana_Ku%C5%9Fatmas%C4%B1)), "Ben karşının taksisiyim!" ayağına yatmayan Şoför Nebahat ablamın taksisiyle Buda'dan Peşte'ye geçildikten sonra, akmamakta ısrar eden Tuna'nın doğu yakası takip edilerek Payitaht'a dönülmesiyle, onuncu ayında son buldu.

![Merzifonlu Kara Mustafa Paşa](/assets/img/merzifonlu-kara-mustafa-pasa.jpg "Merzifonlu Kara Mustafa Paşa")

Kellesine güvenen bir Merzifonlu daha çıkar mı bilinmez lakin menekşe gözlerim [2. CommVault Seferi](https://tr.wikipedia.org/wiki/II._Viyana_Ku%C5%9Fatmas%C4%B1) hülyasında!
