---
layout: post
title:  "shark-tank - m29: Lua Bu Gece Başka Güzel"
date:   2026-08-15 12:00:00 +0000
tags: [siber-guvenlik]
---
# Modül 29: Lua Bu Gece Başka Güzel

```lua
function lua()
    -- Lua bu gece başka güzel, başka güzel yıldızlar
    -- Samanyolu'nun seyrine, yıldızlardan davet var
    -- Gölgesi yok bulutların, pırıl pırıl gökyüzü
    -- Bu gecenin sabahında, güneş bir başka doğar
    return "Bilge ÖZGEN - Dr.Hüsamettin OLGUN"
end
```
> **Nota**: [Üsküdar Musiki Cemiyeti Arşivi](https://www.uskudarmusikicemiyeti.com/wp-content/uploads/2024/04/aybugecebakagzelbakagzelyldzlar_bilgezgen_km59.pdf)

<iframe width="560" height="315" src="https://www.youtube.com/embed/sE_5iCVQLNM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

🔪 [Çal keke çal!](https://www.youtube.com/watch?v=yKZ2PgMjLVE) 🔪

---

**Selam 'Kaynatasızlar(!)' ve kaynatasıyla hunharca Lindy Hop yapmaktan [telezzüz](https://www.telezzuz.com/) olanlar!**

Birine yapabileceğiniz en büyük iyilik, ona **sağlık, afiyet ve dahî -bu lakırdının devamında da göreceğiniz gibi- zaman hediye etmektir**. Evet; siz kimsiniz ki veresiniz; anca sebep olursunuz, el-Hâk! Altun, zümrüd, yakut, zeberced, dürr, mercan, bilumum misk-ü anber ve dahi dünyalık huri ve gılmanlar gelür gider, ve fakat zaman!.. Tınne! Cık! Iıh!

Zaman hediye etmek de ne ola ki?! Mâlâyâni'den azad idüp vaktini israf eden şeylerden kurtarmak demektir. Bu modülün hülasası budur! Merak ve dikkat buyurunuz, istirham ederim!

Size -bu okuduklarınız gibi yazılmadığı için- AI slop gibi görünen lakin bana üç aya yayılmış 192 saate malolan (hala artmaya devam ediyor! Yeter! Bit artık!) 28 modül boyunca Wireshark'ı, Tshark'ı övdük, övdük!.. Filtre yazdık, paket açtık, entropy hesapladık, kill chain kurduk. Hepsi gerekliydi zira otomasyon yapabilmek için önce o otomasyonun ne yaptığını **manuel bir kez yapmış** olman gerek. Fakat "as you know" otomatize edilebilecek bir şeyi onlarca kez manuel yapmanın da bir manası yok!

> Manuel paket analizi yapmak sanattır. Yüzlerce paket varsa angaryadır! Ve angarya, "bir kere delmekle bir şey olmaz!" dendiği günden beridir negatif seleksiyona maruz kala kala "artık uyulmayan ve dahi saygı da duyulmayan" Anayasa'mızın 18. maddesine göre yasaktır! TCK 117'den işlem görür! Çünkü "Türkiye Cumhuriyeti bir hukuk devletidir!"
>
>> Ekmek Teknesi 62. Bölüm

---

## Havadis

Diyelim ki "tiz tiftik idüle!" deyû 9.831 paketlik bir pcap geldi. Şakk, Vaayırşark! Mission accomplished! Peki aynı ağdan **500 pcap** gelirse?!.. Her birinde 5432 paket. Ne olacak? Olacak olan şu: "Analiz" adı altında üç gün boyunca 15 farklı filtreyi her birine ayrı ayrı kopyala-yapıştır yapıp atom fiziğine de profesörlüğe de hayır dua ede ede rapor yazacaksın! Bu analiz değil, **angarya**.

Bu 500 pcap'ı `shared/shark-tank.lua` canavarına verdiğinde ise:

- Saniyeler içinde **500 ayrı bulgu raporu** olur; her pcap'in yanına, aynı isimde bir `.md` rapor üretilir.
- Her raporda keşif taramaları, sızan kimlik bilgileri, C2 adayı kanallar (jitter hesabı yapılmış), entropi ölçülmüş exfil adayları, dosya indirmeleri, kill-chain tablosu ve Wireshark'ta manuel teyit edebileceğin hazır filtreler olur.
- Bitmedi! Bir de `campaign.md` belirir! Hangi pcap'ler aynı C2 adresini, aynı sahte User-Agent'ı, aynı RC4 biletini vs. paylaşıyor görürsün! Tek seferlik mi yoksa tekrar eden bir operasyon mu farkedersin!

Günler **dakikalara** iner. İşi böyle yapmanın letafeti şu ki bu dakikaların içinde sen hiç yoksun. Sen telefona gömülüp yüzüncü kez [Bay Nalçakan](https://www.youtube.com/watch?v=boT-F_bTshM) dehledin!

---

## İş Bölümü: Script yorsun, sen tut!

Betiğe 500 pcap ver; tarasın, istatistik üretsin, şüphe noktalarını işaretlesin. Sonra sen GUI'de o işaret edilen frame'in üstüne gidip derinleş: Follow Stream aç, sertifikayı oku, payload'ı çöz, hikâyeyi kur; zira odaklanmış manuel analiz en iyi GUI'de yapılır!

Manuel analiz değersizleşmiyor; odaklanmış oluyor. Angarya yüzünden dağılmış dikkat yok!

---

## Lua ne menem bir şey ve neden var?

Kısa cevap: Scripting dili! Çünkü!

Uzun cevap: Lua, [Maria João Pires](https://www.youtube.com/watch?v=Ch2mrPm1JnM)'den öğrenemediğim kadarı ile Portekizce'de Ay demekmiş ve tam da angaryadan kurtulma gayesiyle doğmuş!

Arman gibi anlatayım! Yıl 1993, yer Brezilya. Rio de Janeiro'daki PUC-Rio üniversitesine bağlı Tecgraf enstitüsü, Petrobras için mühendislik simülasyonları yazıyor. "[Zıkkımın kökü!](https://www.youtube.com/shorts/6VBC1yv09ds)" denecek bir durum var: Her yeni ihtiyaçta, mevcut araçlara bir yenisi ekleniyor; her ekleme, bir öncekinin etrafına yeni bir duvar örmek demek. Yamalı bohça, fakir yorganı durumu! Bir de kriz ve ihtiyaç durumu hasıl olmuş: O dönemde Brezilya'nın ithal bilgisayar donanımı ve yazılımına yönelik katı ticari kısıtlamaları (pazar korumacılığı) var. Tecgraf mühendisleri de dışarıdan hazır çözümler almak yerine kendi "yapıştırıcı" (glue) dillerini yazmaya mecbur kalmışlar. Ana programlar C veya Fortran gibi eli öpülüp hayır dua alınası dillerle yazıldığı için her yeni veri girişi veya konfigürasyon için ana programı yeniden derlemek "İllallah!" ettirmiş! Geldik "No country for old men!" durumuna! Sorunu çözmek için başlangıçta DEL (Data Entry Language) (veri girişi formu yönetimi) ve SOL (Simple Object Language) (nesne tanımlamaları/konfigürasyon) diye diller inşa etmişler. Bir süre sonra kodladıkları şey Frankenstein olmuş! Sonrası rezilik! Takımın başındaki Roberto Ierusalimschy ve meslektaşları (Waldemar Celes ve Luiz Henrique de Figueiredo), DEL ve SOL'un özelliklerini birleştirerek çok daha hafif, hızlı ve C kodunun içine kolayca gömülebilen (embeddable) tek bir dil tasarlamaya karar vermişler. SOL (Simple Object Language), Portekizce'de "Güneş" anlamına geliyor; bu yüzden yeni dilin kulağına ezan okuyup üç defa "Ay" anlamına gelen Lua ünlemişler.

Yani dikkat buyrun zira burası çokomelli: Lua, angarya sevmeyen mühendislerden, angarya sevmeyen insanlara bir hediye. Kişiyi mâlâyâni'den azade kılmanın güzel bir numunesi! Ömür Hediyesi! Yani Wireshark ve Tshark'ın Lua kullanması yanında bu modülde Lua'yı tercih etmemin nedeni [cinslik ya da zevk meselesi değil!](/cevizlab/2022/04/06/malware-gelistirme.html) (bkz. [Fakat Müzeyyen Bu Derin Bir Tutku!
](https://www.kitapyurdu.com/kitap/fakat-muzeyyen-bu-derin-bir-tutku/356930.html))

## Bu Kadar Ufak Şey

Lua interpreter yüz kilobayt civarında. Bunun ne demek olduğunu siber güvenlikçinin lügatine çevirelim: birçok pcap'ten daha küçük, malwarelerle akran. C kaynak kodu taşınabilir, derleme ayarı derdi yok. Ütünün, tost makinesinin içine bile embed edebilirsiniz ([Tık!](https://en.wikipedia.org/wiki/List_of_applications_using_Lua))! Gerçi ütü, tost makinesi üreticileri henüz talep etmedi; their loss, who cares! Yani [Doom gibi](https://www.reddit.com/r/itrunsdoom/) zarif mühendislik ürünü, minik ve pamuk bir şeydir!

Siber güvenlik tarafı ise aşikar:

- **Wireshark**: Eklenti mimarisi Lua ile konuşur. Bu modüldeki `shark-tank.lua` tam olarak budur.
- **Nmap**: `-sC` ile çalıştırdığın, "nmap script" diye andığın şey Lua. [Fyodor! Anlat hacım!](https://www.youtube.com/watch?v=MMfQkAAUnvo)
- **Snort 3**: Kural ve konfigürasyon, statik text'ten (.conf) Lua'ya geçti. Daha az kaynakla, daha çok iş! Paкéтa!

---

## Erinenin oğlu kızı olmaz!

Bay Russell! Çok isterim lakin okumazlar şekerim, okumazlar! bkz. [Aylaklığa Övgü](https://www.kitapyurdu.com/kitap/aylakliga-ovgu/63701.html)

Potansiyel itirazlara bir iki kelam edeyim:

**"Manuel test çok önemli!"** - Mükkemmel atlayış! Katılıyorum zira bu modül manuel testi bitirmiyor, **kurtarıyor**: 500 pcap'ı elle taramak manuel analiz değil işkence. Gerçek manuel analiz, scriptin "burada sahte User-Agent var" dediği yere senin manuel dalarak hikâyeyi kurmandır. Av köpeği gibi düşün! Zağar gibi, pointer gibi bir şey! Elim yağa, kire, pasa değsin, merakında olanlar tabii ki olacaktır: Müjde! Onların Wireshark'a da ihtiyacı yok! Core binary oku, libpcap'le kendi analiz yazılımını geliştir.

**"Bu kadar da tembellik olmaz!"** — [Perl](https://www.youtube.com/watch?v=ju1IMxGSuNE)'ün babası, Camel Book'da ([Programming Perl](https://en.wikipedia.org/wiki/Programming_Perl)) büyük mühendisin üç erdemini saymış:

- **Tembellik (Laziness):** Genel algının aksine, işten kaçmak değil, *angaryadan* kaçmaktır. Gerçekten tembel bir mühendis, aynı ameleliği ikinci kez yapmamak için öyle bir otomasyon, öyle bir araç (tool) yazar ki; sistem kendi kendini idame ettirir. Tembellik, tekrar kullanılabilir (reusable) kodun anasıdır.
- **Sabırsızlık (Impatience):** Bilgisayarın veya programın hantallığına tahammül edememe durumudur. Seni, makinenin seni bekletmesini önleyecek, darboğazları (bottleneck) daha yaşanmadan çözecek şekilde düşünmeye iter. En optimize ve en hızlı kodu yazdıran güçtür.
- **Kibir (Hubris):** Başkalarının (veya altı ay sonra kodu okuyacak olan *senin*) koda bakıp "Bunu hangi sığır yazdı?" dememesi için şimdiden hissedilen o devasa gurur meselesidir. Kibirli mühendis; kodunu öyle temiz yazar, mimarisini öyle zarif kurar ve öyle güzel dokümante eder ki kimse o koda laf edemesin.

---

## Boğma Wireshark Script'i: 28 Modülün Damıtılması

28 modülde manuel yaparak öğrendiğimiz ne varsa hepsi tek betikte! Aşağıdaki tablo, modül modül manuel yaptığımız işin `shark-tank.lua'daki karşılığı. Bu tablo bir "feature list" değil, bir **muhasebe!**: 28 modüllük sermayenin otomasyona dönüşmüş hâli.

| Modül | Elle ne yaptık | Betikteki karşılığı |
|-------|----------------|---------------------|
| 01-02 | Paket say, protokol dağılımı çıkar, filtre yaz | Rapor başlığı: paket/protokol hierarşisi otomatik |
| 03 | ARP sweep'i hedef IP'lerden tanı | Tek MAC'in benzersiz hedef patlamasını sayar: sweep |
| 05 | ICMP identifier'ı elle takip et, redirect gateway oku | Sabit identifierlı paket patlaması = tünel; redirect sayar |
| 06 | Overlap fragment'ı Expert Info'da ara | `ip.fragment.overlap` + conflict sayacı |
| 08-09 | SYN'leri say, half-open/connect ayır, retransmission topla | Tarama tipini kendisi söyler; retrans/dupack/zerowin alanlarından okur |
| 11 | Window/pencere yorumla, keep-alive bul | Taşıma katmanı sağlığı özeti |
| 12 | Uzun subdomain'leri elle oku | 40+ karakter etiket + Shannon entropisi = DNS tüneli adayı |
| 13 | POST gövdesinde şifre ara, chunked/CL ayır, cookie takip et, base64 çöz | Kimlik sızıntısı bloğu + çözülmüş Basic auth + cookie zinciri |
| 14 | USER/PASS oku, bounce'ı PORT argümanından hesapla | Cleartext oturum + 3. taraf PORT hedefi raporu |
| 15 | Mail ekini stream'den topla, base64 -d ile çöz | Attachment adı + kurtarma tarifi raporda |
| 16 | Sertifika sağlığını 4 maddede kontrol et, OCSP oku | Sürüm/cipher/SNI envanteri + OCSP durumu + zayıf imza |
| 17 | Çok SPN = Kerberoasting de, etype 23 say | RC4 biletleri tek filtrede sayar (keskin imza) |
| 18 | Simple bind parolalarını oku, geniş filter ara | LDAP kimlik + `(objectClass=*)` dump şüphesi |
| 19 | Dosya adlarını Create'te bul, Read/Write bayt topla | Dosya envanteri tablosu (kim, ne kadar okudu/yazdı) + svcctl |
| 22 | Conversations tablosunda bytes sırala | Asimetri analizi: tek yönlü dev aktarımlar |
| 23 | ack_rtt ortalamasını awk'la hesapla | RTT özeti taşma katmanı bölümünde |
| 24 | Deauth say, RSSI oku | WLAN bloğu: deauth + RSSI istatistiği |
| 25 | SIP metodlarını say | VoIP bloğu: metodlar + RTP akış envanteri |
| 26 | Baseline'dan sapmayı gözle | Beacon düzenliliği (medyan-jitter) = baseline sapması |
| 27 | Zinciri elle kur, zamanı not et | **Timeline tablosu** otomatik kronolojide |
| 28 | Kill chain + IOC özetini elle yaz | Kill-chain tablosu + IOC bloğu + istenirse `.json` |

Bir de hiç beklemediğin yerden gelir kahramanlık: Betiğe daha önce hiç görmediği bir ağdan 9.831 paketlik bir pcap verdim. Saniyeler sonra rapor: sahte User-Agent (`MSIE 8.0` + `Windows 10` — gerçek tarayıcıda imkansız bileşim), 6 anonim (NULL) SMB oturumu, SAMR ile dizin envanteri, RC4 biletler, ve dışarıdaki makineden SMB ile indirilmiş `server.exe` adlı malware — tam **598.528 bayt**... GUI'de bu dosya adını bulana kadar hangi filtreyi kaç kere yazacaktın?

---

## Kendin Dene

Üç komut; hepsini tek tek dene, atlama:

```sh
# 1) Tek bir pcap'i analiz et — rapor yanına .md olarak düşer
./scripts/shark-tank.sh shared/pcaps/module-28-forensics.pcap

# 2) Tüm dizini tara — her pcap için rapor + campaign.md
./scripts/shark-tank.sh shared/pcaps

# 3) Betiği kendine sınav yap — beklenen bulgular otomatik doğrulanır
make test-sharktank
```

GUI'de denemek istersen: script'i Lua eklenti dizinine kopyala, Wireshark'ı yeniden başlat, bir pcap aç ve menüden **Tools > Shark-Tank > Rapor Üret** de. Rapor bir pencerede belirir. Detaylar `shared/shark-tank.lua` dosyasının başlık yorumunda ve [Modül 20'de](/2026/08/06/shark-tank-m20-tshark.html).

## Kendine Sınav (5 Soru)

1. Bir SOC ekibine günde 300 pcap düşüyor. GUI mi, betik mi, hangi iş bölümü? Gerekçesiyle açıkla.
2. Nmap'in `-sC` scriptleri hangi dilde yazılmıştır ve bu durum "Lua'ya kızanlar" itirazını nasıl güçlendirir?
3. Betiğin raporunda "C2 adayı" yazıyor. Manuel takip olarak **GUI'de** hangi üç adımı atarsın?
4. Larry Wall'un üç erdemi say ve her birinin bu modüldeki otomasyon kararına nasıl karşılık geldiğini açıkla.
5. `campaign.md` neyi ifade eder; iki pcap'in "aynı kampanya" olduğunu hangi ortak IOC'lerden çıkarırsın?

<details markdown="block">
<summary><strong>Cevapları Göster</strong></summary>

1. Betik triaj eder, insan GUI'de derinleşir: 300 pcap'ı betik tarar, şüpheli azınlığı raporlar; analist vaktini yalnızca işaretlenen vakalara harcar. GUI'de 300 pcap = günler; betik + odaklanmış GUI = saatler.
2. Lua (NSE). Nmap'i yıllardır kullanan herkes, farkında olarak Lua ekosistemini kullanmıştır; dolayısıyla "Lua'a kızan" aslında tanımadığı şeye kızmaktadır.
3. Örnek sıra: (a) raporun verdiği filtreyi uygula ve beacon kanalını izole et, (b) Follow TCP Stream ile ilk konuşmayı oku, (c) SNI/UA/sertifika ile hikâyeyi doğrula. (Farklı sıra kabul edilebilir; ölçüt: teyit üç farklı kaynaktan yapılmalı.)
4. Tembellik → işi bir kez yazıp tekrarlamamak (betik); sabırsızlık → 500 pcap'ı bekletmemek (saniyeler); kibir → yarın da çalışacağından emin olmak için `make test-sharktank` regresyon testi.
5. Dizin taramasında pcap'ler arası ortak IOC raporudur: aynı C2 kanalı, aynı sahte User-Agent, aynı NTLM hesabı, aynı RC4 bilet deseni vb. iki dosyada birden görünüyorsa olaylar bağımsız değil, aynı el/altyapıdır.

</details>

---

**Hulasa:** 28 modül Wireshark'ı, Tshark'ı öğretti; 29.'su mühendisliği hatırlattı. Unutma! Makineler insana zaman hediye etmek için var.

> **Kendini angaryadan kurtar. “Türkiye Cumhuriyeti bir hukuk devletidir!”**

---

> Modül listesine erişmek için [tıkla!](/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
