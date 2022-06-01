---
layout: post
title:  GNU/Linux Internals [Purple Teaming] [Siber Güvenlik]
date:   2022-05-31 12:00:00 +0000
categories: cevizlab
---

## Analist'in GNU/Linux Apartmanı Sakinleriyle Tanışması

Pek kıymetli dostlarım! Afiyettesinizdir inşallah...

Bu notlar; süreçler (process), hizmetler (service) ve önemli dosya konumları
dahil olmak üzere, GNU/Linux cihazlardaki temel yapılandırma verilerinin manuel
olarak toplanmasıyla hedef sistem üzerinde durumsal farkındalık kazanılmasını
anlatıyor.

Bir yandan keyfinizce GNU/Linux Apartmanı'nı gezerken diğer bir yandan da
sakinleriyle hasbihal ederek "Vay anam vay! Neler dönmüş Serhat ya!.."
diyebilirsiniz.

Aynı zamanda bu notlar, aldığım diğer notlar gibi hatırlatma amaçlıdır. Ayrıntı
merak eden;

+ çeşme başına (GNU/Linux Terminali) kamp kurarak (ki insanlık su yollarında
  yeşerdi),
+ sazını eline alıp `--help` yazarak,
+ yetmezse "Gölgelerin gücü adına! He`man`!" diye kükreyerek

mevzuyu; incir uyutması gibi kod yazmanın yanında üzerine fındık, fıstık,
ceviz, tarçın vs. babında yorum satırı ve domüman yazan gerçek hacker'lardan
doğrudan öğrenebilir.

Ah mirim, nerede o eski hacker'lar!

![İncir Uyutması, Richard M. Stallman](/assets/img/incir-uyutmasi-richard-matthew-stallman.jpg "İncir Uyutması, Richard M. Stallman")

---
---

## Uzaktan GNU/Linux Yönetimi

### ssh

Güvensiz ağ üzerinden uzak sisteme güvenli erişim.

`ssh kullanici-adi@hedef`

`ssh -i /ozel/anahtar/yolu kullanici-adi@hedef`

-i: Parola yerine özel anahtar kullanımı.

### scp

SSH üzerinden güvenli dosya kopyalama.

`scp kullanici-adi@ip:/kaynak/path kullanici-adi@ip:/hedef/path`

-r: Rekürsif işlem.

`scp -i /ozel/anahtar/yolu kullanici-adi@ip:/kaynak/path kullanici-adi@ip:/hedef/path`

-i: Parola yerine özel anahtar kullanımı.

---

## Aktif Bağlantılar, Portlar ve bunlara bağlı Process'ler

### netstat

GNU/Linux'ün yeni versiyonları `netstat` yerine `ss` komutunu bulunduruyor.
Argümanlar gene aynı işi yapıyorlar.

`netstat -anp`

`ss -anp`

-a: Yalnızca aktif (ESTABLISHED) olanları değil tüm soketleri görüntüler. Bu,
dinleme (LISTEN) durumunda olan portların da görümntülenmesini sağlar.

-n: IP veya portun hizmet isminin çözümlenmemesi isteği. Aksi durumda ağ
topolojisine bağlı olarak cevap dönme süresi uzar.

-p: Soketin PID'ini veya program ismini döndürür. Böylece soketle ilintili
process hızlıca görülebilir.

## Çalışan/Koşan Process'ler

`ps aux`

a: Diğer kullanıcılar tarafından başlatılmış process'leri görüntüler.

u: Kullanıcı dostu temiz görünüm.

x: TTY gerektirmeyen process'leri görüntüler.
Bkz. [TTY](https://itsfoss.com/what-is-tty-in-linux/)

Argümanları "-" kullanmadan "ps" e gönderince, bu komut BSD opsiyonlarını
kullanır.

`ps -ef`

-e: Tüm process'leri seçer.

-f: Tam format listeleme. Process'e dair tüm sütunlar görüntülenir. Örneğin;
zararlı bir process'i hangi hangi process'in çağırdığını (PPID) görebiliriz.

---

## Log Toplama
 
Log lokasyonları analistin ne aradığına ve hangi GNU/Linux dağıtımında
aradığına göre değişir. `/var/log/` sıklıkla kullanılan genel bir log dizini ve
içinde milyonlarca log bulunduran dosyaları içeriyor. Burada önemli olan ise ne
aradığımızı bilmek ve yalnızca bize gereken logları süzüp görüntülemek. `tail,
less, grep` işe yarar.

### Debian

`/var/log/syslog` : Kritik veya sıradan sistem mesajları.

`/var/log/messages` : Sıradan sistem mesajları.

`/var/log/auth.log` : Burada da sisteme giriş yapma denemeleri, başarılı veya
başarısız olma durumu, hangi yöntemle (ssh, terminal vs.) bağlantı kurulduğu ye
alır.

### Fedora

`journalctl` : Sistem günlüğünden bilgi getiren komut. Kritik veya sıradan
sistem mesajları getirir.

`/var/log/messages` : Sıradan sistem mesajları.

`/var/log/secure` : Burada da sisteme giriş yapma denemeleri, başarılı veya
başarısız olma durumu, hangi yöntemle (ssh, terminal vs.) bağlantı kurulduğu ye
alır.

---

## Otomatik Başlayan Process'ler Bölüm 1

Öncesinde System V, Upstart ve systemd'ye dair şu linki bir inceleyiverin,
ardından devam edelim:
[Tık!](https://www.computernetworkingnotes.com/linux-tutorials/differences-between-sysvinit-upstart-and-systemd.html)

Durumu olanlar(!) okuyup gelene kadar herkese benden çay! Şakir'e yok!...

![İncir Uyutması, Richard M.
Stallman](/assets/img/herkese-benden-cay-sakire-yok.jpg "İncir Uyutması,
Richard M. Stallman")

GNU/Linux cihazlarda process'ler, hem kullanıcı etkileşimi hem de otomatik
çalışan script'ler aracılığıyla başlayabilir. Bir process'in nasıl başladığını
bilmek, analistin hangi komutun çalıştırıldığına yakından bakmasını sağlayarak
bir binary programın dost mu yoksa düşman mı olduğunu belirlemeye yardımcı
olur.

### Boot/Logout Process'leri

Saldırgan kalıcılık sağlamak için boot sırasında çalışacak bir şeyler yapmış
olabilir. Güzel yanı şu ki boot process'lerinin PID'leri küçük sayılardır ve
küçük PID'lere sahip ilginç binary'ler olabilir.

Boot sırasında çağrılan genel lokasyonlar şunlar:

`/etc/rc.local` : Bu konum, kullanıcının boot'ta herhangi bir komutu
çalıştırmasını sağlar. Çalışması için bir init script'i tarafından çağrılması
ve rc.local'in execution bit'inin açık olması (bkz. chmod, rwx) gerekir.

`/usr/lib/systemd/user/*` : Bu konum, paketler tarafından yüklenen sistemd unit
dosyaları için default konum. systemd ise, hizmet yöneticisinin modern bir
uygulaması.

`/etc/systemd/system/*` : Bu dizin, systemd için gerekli unit dosyalarını
içerir. Bu dizindeki unit dosyaları diğerlerinden daha önceliklidir.

`/etc/init.d/*` : Bu dizin, 2006'dan önce kullanılan SysVinit script'lerini
içerir. Kademeli olarak kullanımdan kaldırılıyor ancak yine de birçok cihazda
görmek mümkün. Modern dağıtımlarda dosyalar, genellikle Upstart syntax'ını
kullanma talimatlarına sahip.

`/etc/init/*` : Bu dizin Upstart init konfigürasyonlarını içerir. Eski System V
init deamon'u yerine Upstart, Upstart yerine de systemd geldi.

`~/.bash_profile and ~/.profile` : Bu iki konum, process başlatılabilecek diğer
bir yer. Genellikle umask gibi çevre değişkenlerini (environment variables)
ayarlamak için kullanılsa da bir kullanıcı oturum açtığında process başlatmak
için de kullanılabilir. Not: `~/.bash_profile` ve `~/.bash_login`,
`~/.profile`'den önceliklidir.

`~/.bash_logout` : Bu konum, `~/.bash_profile` ve `~/.bash_login`'e benzer
ancak kullanıcı oturumunu kapatırken çalışır. Kullanıcı muhtemelen bu
komutların yürütüldüğünü asla görmeyecektir. İki PTY veya TTY kullanılarak ve
birinden çıkış yapılarak nelerin çalıştırıldığı görülebilir.

---

## Otomatik Başlayan Process'ler Bölüm 2

GNU/Linux cihazlarda zamanlanmış görevler cronjobs'ler aracılığıyla yapılır.
Bunlar, kullanıcı veya device crontab'lerinde bulunur. Bu crontab'ler da
`locate crontab` yazarak bulunur. Tipik olarak bu process'lerin PID'leri, boot
process PID'lerinden belirgin şekilde daha yüksektir. Aşağıdaki komutlar, bir
cihazdaki tüm zamanlanmış görevleri görüntüler:

`crontab -al`

Login olan user kimse onun crontab'ını gösterir. Kimisinin crontab'ı, kalbi
kadar temiz bir sayfa olabilir.

`crontab -u herhangi-bir-user -l`

Başkalarının crontab'ini görüntülemek için makamınıza (root) tahsis edilmiş
koyu camlı, sirenli, çakarlı aracınız olması gerek. Bu yoksa böyle bir konumda
yakınınız, defterinde (/etc/sudoers) adınız olması gerek. Bu sadece başkasına
ait bir crontab'i görüntülemeye has bir durum değil. Güzel ve yalnız ülkemde
insanların geneli, teknik birey olsun olmasın bu durumu bilir ve bir çeşit hak
yeme olduğu için değil yalnızca kendi isimleri de "/etc/sudoers" içinde
olmadığı için sinirlenir. Çok da şaapmamak(!) lazım zira "Nasılsanız, öyle
yönetilirsiniz!". Tüm zamanlardan mahlukat adedince selam olsun.

`cat /etc/crontab`

Sistem geneli crontab içeriğini görüntüler.

---

## Koşan/Çalışan Servisler

Çalışan servisleri, Debian ve Fedora sistemlerde şu komutlar görüntüler:

### Debian

`service --status-all 2>/dev/null | grep +`

"service --status-all" çıktısını alır ve yalnızca yazdırılan satırda + geçen,
yani çalışan hizmetleri ekrana yazar. Upstart hizmetleri mevzuya dahil değil.

Ayrıca, yukarıdaki komut çalışıyorsa bu demek oluyor ki Upstart'tan değil
System V dededen hizmet alıyorsunuz. Yormayın, hürmet edin, çayını verip eski
zaman hikayelerini dinleyin.

`initctl list | grep running`

"initctl" listesinin çıktısını alır ve gene yalnızca çalışmakta olan servisleri
gösterir. 

Upstart servislerinden çalışanları görüntüler.

### Fedora

`systemctl list-unit-files`

systemd servislerinden çalışanları görüntüler.

`chkconfig --list`

System V servislerinden çalışanları görüntüler.

---

## Sistem İsmi

Sistem ismini öğrenebilmek için analistin kullanabileceği iki ana metod var:

`cat /etc/hostname`

Sadece host ismini gösterir.

`uname -a`

Bu, sisteme dair daha ayrıntılı bilgi verir.

---

## Kullanıcı Listesi

Analist açısından, kullanıcı listesini kontrol etmek önemli. Davetsiz misafir
cihaza başka bir kullanıcı ekleyebilir, yüm işlemleri onun üzerinden
gerçekleştirebilir. Kullanıcıların giriş yapıp yapamayacağını ve izinlerinin ne
olacağını aşağıdaki dosyalara bakarak belirleyebiliriz:

`/etc/passwd`

Her satırda farklı bir kullanıcıya dair temel bilgiler yer alır. Eğer bir
kullanıcıya shell tanımlanmışsa, o kullanıcı login olabilir.

Örnek bir satır: root:x:0:0:root:/root:/bin/bash : kullanıcı adı, uid, gui, ev
dizi, kabuk vs.

`/etc/shadow`

Her satırda farklı bir kullanıcıya dair salt'lanarak hash'lenmiş parolayı ve
diğer üç beş şeyi içerir. Parola kısmı bazen şunları içerebilir:

! veya !!: Hesap kilitli veya parola ayarlanmayı bekleme durumu. Yeni kullanıcı
oluşturulması ardından olur.

\* (asterisk): Parola hiç ayarlanmadı demektir.

boşluk: Kullanıcının parolası yok, haliyle doğruca giriş yapabiliyor demektir.

---

## Yüklü Paketler

GNU/Linux paketleri, belirli bir program için gerekli tüm dosyaları içeren
sıkıştırılmış dosyalardır. Debian ve Fedora dağıtımları farklı paket
yöneticileri kullanır, bu nedenle komutlar ve sözdizimi farklıdır. Kurulu
paketlerin tam listesini görmek için aşağıdaki komutlar kullanılabilir:

### Debian

`apt list --installed`

Advanced Packaging Tool yani apt ile yüklü tüm paketleri görüntüler.

### Fedora

`rpm -qa`

RedHat Package Manager yani rpm ile cihazda kurulu tüm paketleri sorgular.

`yum list installed`

Yellowdog Updater Modified yani yum ile yüklü tüm paketleri görüntüler.

---

## Host Tabanlı Güvenlik Konfigürasyonları

GNU/Linux cihazlar pek çok güvenlik ürünü içerebilir ama aralarında en genel
olanı iptables'dır. iptables'ın nasıl yapılandırıldığı hakkında bilgi almak
için aşağıdaki komutları çalıştırabiliriz:

`iptables -L -n -v`

`iptables -t nat -L -n -v`

-L: Belirtilen zincirdeki tüm kuralları listeler. Zincir belirtilmezse tüm
kurallar listelenir.

-n: Numerik çıktı. Host ve port ismi çözümlemesini engeller. Hızlı sonuç
için...

-v: Verbose yani ayrıntılı görünüm.

-t nat: NAT tablosuna tanımlı kuralları gösterir.

---

## Paylaşım Klasörleri

Ağda paylaşım yapmak genel bir durum lakin saldırgan bu yolla veri
sızdırabilir. Paylaşılmış klasörleri şu komutla görüntüleriz:

`smbclient -L localhost -U%`

Kullanıcı adı ve parola olmaksızın erişilebilen ağ paylaşımlarını görüntüler.

Windows, 13 karakterden uzun paylaşım isimlerini görüntüleyemeyebilir!
Örneğin; paylaşım isminiz 123456789012345 olsun. Bunu 1234567890123 olarak
görmeniz olası. Sonrası, Windows için hayalet.

`showmount -e 127.0.0.1`

localhost üzerinde erişilebilen NFS paylaşımlarını görüntüler.

---

## Güncel Yama Seviyesi

Buna bakarak sistemi etkileyen bilinen zafiyetleri belirleyebiliriz. GNU/Linux
versiyonunu şu komutlarla alabiliriz:

### Debian

`lsb_release -a`

### Debian ve Fedora:

`hostnamectl`

![That's all folks!](/assets/webp/thats-all-folks.webp "That's all folks!")

