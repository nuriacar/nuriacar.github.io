---
layout: post
title:  Fileless Saldırılar (LotL) [Siber Güvenlik]
date:   2022-04-07 12:00:00 +0000
categories: cevizlab
---

Fileless saldırı ([living of the land (LotL)](https://encyclopedia.kaspersky.com/glossary/lotl-living-off-the-land/)), hedef sistemde default var olan legal araçlar kullanılarak gerçekleştirilen saldırı demek. Hedef sisteme extra malware göndermediğiniz için yakalanmanız daha zor.

Çoğu LotL saldırısı PowerShell ve WMI kullanıyor:

+ PowerShell. Malware'i başlatmak, ayrıcalık yükseltmek, arka kapı yüklemek vb. için...

+ WMI (Windows Management Instrumentation), çeşitli Windows bileşenlerine erişim için bir arabirim. Saldırgan açısından WMI; kimlik bilgilerine erişmek, [kullanıcı hesabı denetimi (UAC)](https://encyclopedia.kaspersky.com/glossary/user-account-control-uac/) ve virüsten koruma araçları gibi güvenlik araçlarını atlamak, dosya çalmak ve ağ üzerinde yanal hareket sağlamak için...

![Fileless Kill Chain](/assets/img/fileless-kill-chain.jpg "Fileless Kill Chain")

Fileless malware saldırısı başlatmak için kod yüklemek gerekmese de lokaldeki araçları amaca hizmet edecek şekilde değiştirebilmek için yine de ortama erişmek gerek. Erişim ve saldırı, aşağıdakilerin kullanımı gibi çeşitli yollarla gerçekleştirilebilir:

+ **Exploit kitleri:** Exploitler; kod parçaları, komut sekansları vb. şeylerdir. Tüm bunlar bir saldırıda kullanılmak üzere bir araya gelince kit oluyorlar. İyi çalışılmış bir oltalama maili  ile diske yazılmadan doğrudan RAM'e enjekte edildikleri için ilk erişim veya LotL başlatmak için harika oluyorlar.
+ **Ele geçirilen lokal araçlar:** PowerShell, WMI vs.
+ **Kayıt defterinde yerleşik malware:** İlk erişimin ardından indirilerek diske değil doğruca Registry'e yazılıyorlar. Sistem her boot olduğunda doğrudan çalışıyorlar. Poweliks, Kovter ve GootKit böyle çalışıyor.
+ **Yalnızca RAM'de çalışan malware:** [Unit 8200](https://tr.wikipedia.org/wiki/Birim_8200) bağlantılı [Duqu](https://tr.wikipedia.org/wiki/Duqu) böyle bir silah.
+ **Fileless Ransomware:** PowerShell'le ve Windows'da varsayılan gelen BitLocker'la Ransom yiyen müşterilerim oldu. Şaşırtıcı bir tecrübeydi.
+ **Çalıntı kimlik bilgileri:** Legal kullanıcı bilgileri çalındığında exploit etmeye gerek kalmaksızın o kullanıcıymış gibi PowerShell ve WMI üzerinden saldırı başlatılabilir.

### Örnek Bir Saldırı

**Safha 1:** Erişim Kazanma

İlk erişim için bir zafiyeti web scripting ile uzaktan istismar et ya da oltalama ile mekana çök.

**Safha 2:** Kimlik Bilgileri Çalma

Diğer sistemlere erişebilmek için kimlik bilgileri çal. Mimikatz işine yarayabilir.

**Safha 3:** Kalıcılık Kurma

Registry içine sistem her boot olduğunda seni içeri alacak bir arka kapı yerleştir.

**Safha 4:** Veri Çıkarma

Almak istediğin veriyi bir yere toplayıp [compact](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/compact) kullanarak sıkıştır ve FTP ile dışarı çıkar.

### Patron Çıldırdı

**Bitmedi!** Bir değil, iki değil, üç değil... [Tam beş kavanoz faydalı içerik...](https://docs.broadcom.com/doc/istr-living-off-the-land-and-fileless-attack-techniques-en)

### LotL'den Nasıl Korunulur?

![Külyutmaz Necmi](/assets/img/hababam-kulyutmaz-necmi.jpg "Külyutmaz Necmi")

IoC (Indicators of Compromise) yerine IoA'ya (Indicators of Attack) odaklanmak gerekiyor. Yani saldırının nasıl başlatıldığına veya yürütüldüğüne değil gerçekleştirilen eylemlere ve diğer eylemlerle bağlantısına bakmalı. Bırakın AV ya da EDR'ı, Yapay Zekalı sistemler bile bu saldırıyı yakalayamayabilir. Ancak işin tekniğini bilen, hayal gücü gelişmiş, buluttan nem kapmaya meraklı ve stalk yeteneği olan sağlam bir analist bu işi hakkıyla yapacaktır. Naçizane Külyutmaz Necmi Bey'i öneriyorum.

### Nasıl Gizli Kalırsınız?

Madem bu saldırı, nasıl başlatıldığına veya yürütüldüğüne değil (IoC) gerçekleştirilen eylemlere ve diğer eylemlerle bağlantısına (IoA) bakılarak açığa çıkarılıyor; safhalar arası zaman boşlukları bırakarak, bu aralıklarda alakasız işlemler gerçekleştirerek farkedilmenizi zorlaştırabilirsiniz. Örneğin [APT29'un alametifarikalarından Slow and Deliberate](/cevizlab/2022/04/04/apt29-adversary-emulation.html) tam da böyle bir şey. Bilinçli bir şekilde sakin, yavaş ve derinden...

![Slow and Deliberate](/assets/img/slow-and-deliberate.jpg "Slow and Deliberate")
