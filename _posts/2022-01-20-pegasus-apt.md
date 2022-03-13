---
layout: post
title:  Telefonunuzu Pegasus ve Diğer APT'lerden Nasıl Korursunuz? [Siber Güvenlik]
date:   2022-01-20 12:00:00 +0000
categories: cevizlab
---

**Kaspersky** **GReAT** Global Direktörü **Costin** **Raiu**'nun darkreading.com'da yazdığı [şu](https://www.darkreading.com/dr-tech/how-to-protect-your-phone-from-pegasus-and-other-apts) ve [şu](https://www.darkreading.com/edge-articles/fighting-back-against-pegasus-other-advanced-mobile-malware) yazıyı özet olarak tercüme ettim. 

![NSO Group Logo](/assets/img/nso-group-logo.png "NSO Group Logo")

İyi haber: Yapabileceğimiz birkaç şey var. Kötü haber: **iMessage** ve **FaceTime** kullanamayabiliriz.

**Pegasus** devletlere satılan pahalı bir araç. Tam özellikli bir versiyonunun fiyatı kolaylıkla yedi-sekiz haneli rakamlara erişebiliyor. Diğer **APT** (**Gelişmiş Kalıcı Tehdit**) yazılımları da var: Benzer şekilde, yani sıfırıncı gün açıkları (**zeroday**) aracılığıyla ve tıklama olmaksızın (**zero-click**) yayılabiliyorlar.

Bir tehdit aktörü, saldırı yazılımlarına yedi-sekiz haneli rakamlarda ödeme yapma isteği duyuyorsa, hedefe o virüsün bulaşmaması gibi bir durum söz konusu değil. Sizde istedikleri bir şey varsa hacklenmeniz yalnızca ve yalnızca zaman ve kaynak meselesi.

İyi haber: **İstismar** **aracı** (**exploit**) geliştirme ve **saldırı** **amaçlı** **siber** **savaş** (**offensive** **cyberwarfare**), genellikle kesin bir bilimden ziyade **sanattır**! İstismar araçlarının işletim sistemleri ve donanımlara özel olarak geliştirilmeleri gerekir. Bu sebeple saldırılar; yeni işletim sistemleri, hafifletme teknikleri ve minik rastgele olaylarla engellenebilir. Bu, bize erişmeyi, saldırgan için daha da pahalı hale getirir. Tamamen engelleyebilir miyiz? Tabii ki hayır lakin olabildiğince zor hale getiririz. İşte size hem **iOS** hem **Android** için pratik birkaç kontrol listesi:

+ **Her gün veya daha da kısa sürelerde yeniden başlatın.** Pagasus enfeksiyon zinciri, kalıcılık olmaksızın sıfır tıklama (zero-click) sıfırıncı gün açıklarına (zeroday) dayanır (zero-click zero days with no persistence). Bunu yaparsanız, saldırganın size tekraren saldırı yapması gerekecektir. Saldırı etkisi ile zaman içinde çökmeler veya olaylar, tespit şansını artırır. Sürekli yeniden başlatırsanız, belki de pes edip bırakırlar. Sizin için bu kadar para harcamayı göze almışlarsa, illaki istediklerine ulaşmadan durmamaları da mümkün.
+ **Apple iMessage'ı devre dışı bırakın.** iMessage Apple cihazlara yerleşik geliyor ve varsayılan olarak açık. Bu da onu kullanılabilir kılıyor.
+ **Apple FaceTime'ı devre dışı bırakın.**
+ **Telefonunuzu güncel tutun.** iOS özeline bakacak olursak, pek çok iOS istismar kiti yamalanmış güvenlik açıklarını kullanıyor. Bu demek oluyor ki yama sebebiyle güncelleme geldi ve yamayı uygulamazsanız hacklenmeniz kaçınılmaz. Telefonunuz eski olsa da güncellemekten geri durmayın.
+ **SMS'le gelen bağlantılara asla tıklamayın.** Basit ama etkili bir tavsiye. Sıfır tıklama (zero-click) saldırılarının maliyeti pahalı olduğu için çoğu saldırgan tek tıklama (**one-click**) saldırılarını kullanır. Bunlar yalnızca **SMS**'le değil, herhangi bir **eposta**, **mail** vs. dijital ileti ile gelebilir. **Tails** gibi bir **işletim** **sistemi** kullanarak izole alanda (**sandbox**) linki açabilirsiniz.
+ **Firefox Focus gibi alternatif tarayıcıları kullanın.** iOS tarayıcıları hemen hemen aynı **WebKit**'i kullanmasına rağmen bazı zafiyeetler **Firefox** **Focus** gibi alternatif tarayıcılarda iyi çalışmaz.
+ **Ayda bir Apple iTunes yedekleri alın.** Böylece Af Örgütü'nün MVT (Mobile Verification Toolkit) paketini kullanarak saldırıyı teşhis etmenizi sağlar.
+ **Cihazınızın JailBrake olup olmadığını kontrol eden ve uyarı veren bir uygulama kullanın.** **JailBrake** olmamış bir cihazdan defaaten atılmaktan bıkan saldırganlar bir süre sonra kalıcılık oluşturmak isteyecek, bunun için de JailBrake yapacaklardır. Bu en yüksek saldırı yakalama olasılığı barındıran durum.
+ **Sık sık sistem tanılamayı (sysdiag) çalıştırın ve harici bir diske yedek alın.** Saldırı şüphesi bulunduğunda adli bilişim (**forensics**) uygulanırsa içinden kanıtlar çıkabilir. Sistem tanılama cihaz modeline göre değişiklik gösterebilir. İnternete bakın: **Apple** **SysDiagnose**
+ **Her zaman trafiğinizi maskeleyen bir VPN kullanın.** İstismar araçları (exploit) **GSM** **aradaki** **adam** **saldırısı** (**MitM**), **DNS** ele geçirme (**hijack**) ile veya **HTTP** sitelerde gezerken bulaştırılır. **VPN** sizi bunlardan korur ama VPN'lerin hepsi korumaz. Şunlara dikkat edilmeli:

  - Ücretsiz VPN olmaz! Olur ama güvenli olmaz!
  - Kripto varlıklarla ödeme kabul eden ve kayıt bilgisi vermenizin gerekmeyeceği VPN'lere bakın.
  - VPN uygulamalarından kaçınmaya çalışın. Bunun yerine **WireGuard** ve **OpenVPN** gibi açık kaynaklı araçları ve VPN profillerini kullanın.
  - Yeni VPN'lere değil geçmişi olan VPN'lere bakın.

Genel olarak ise şunları düşünmekte ve uygulamakta fayda var:

+ **Sizi kim, neden hedef aldı?** Sizde ağababaların dikkatini çeken şey ne olabilir? Bu, gelecekte daha sinsi davranarak da yapabileceğiniz bir şey mi?
+ **Bulunduğunuz durum ve sizi bu hale koyan şey hakkında konuşabilir misiniz?** Birçok gözetim şirketini çökerten şeyin kötü tanıtım olduğunu hatırlayın! Eğer hedef alındıysanız, gerçek bir gazeteci bulmaya çalışın ve ona hikayenizi anlatın.
+ **Cihazınızı değiştirin.** iOS kullanıyorsanız, bir süre Android'e geçmeyi deneyin. Android kullanıyorsanız, iOS'a geçin. Bu, saldırganların kafasını bir süre karıştırabilir zira bazı tehdit aktörlerinin yalnızca belirli bir telefon ve işletim sistemi markası üzerinde çalışan istismar sistemleri satın aldığı biliniyor.
+ **Güvenli iletişim için tercihen [GrapheneOS](https://grapheneos.org/) çalıştıran ikincil bir cihaz edinin.** İçinde ön ödemeli bir kart kullanın veya yalnızca uçak modundayken **Wi-Fi** ve **TOR** ile bağlanın. Mesajlaşma uygulamalarından kaçının! Saldırgan telefon numaranızı ele geçirdiğinde, sizi bu yolla birçok farklı mesajlaşma uygulaması üzerinden kolayca hedefleyebilir zira **iMessage**, **WhatsApp**, **Signal**, **Telegram** vs. hepsi telefon numaranıza bağlıdır. Burada ilginç bir yeni seçenekten bahsetmek iyi olur: [**Session**](https://getsession.org/), mesajlarınızı **Onion** tarzı bir ağ üzerinden otomatik olarak yönlendiren ve telefon numaralarına dayanmayan bir çözüm.
+ **Bir güvenlik araştırmacısıyla iletişime geçin ve güvenilir pratikler hakkında destek alın.** Enteresan şeler yaşıyorsanız iletileri ve logları paylaşın. Güvenlik hiçbir zaman %100 olamaz. Bu akan bir nehirdir ve hıza, akıntıya ve engellere göre yelkeninizi ayarlamanız gerekir.
