---
layout: post
title:  Project Muse
date:   2020-10-13 23:23:23 +0300
categories: cevizlab
---

#### **TR [ EN ⇣ ]**

```
██████╗░██████╗░░█████╗░░░░░░██╗███████╗░█████╗░████████╗
██╔══██╗██╔══██╗██╔══██╗░░░░░██║██╔════╝██╔══██╗╚══██╔══╝
██████╔╝██████╔╝██║░░██║░░░░░██║█████╗░░██║░░╚═╝░░░██║░░░
██╔═══╝░██╔══██╗██║░░██║██╗░░██║██╔══╝░░██║░░██╗░░░██║░░░
██║░░░░░██║░░██║╚█████╔╝╚█████╔╝███████╗╚█████╔╝░░░██║░░░
╚═╝░░░░░╚═╝░░╚═╝░╚════╝░░╚════╝░╚══════╝░╚════╝░░░░╚═╝░░░

███╗░░░███╗██╗░░░██╗░██████╗███████╗
████╗░████║██║░░░██║██╔════╝██╔════╝
██╔████╔██║██║░░░██║╚█████╗░█████╗░░
██║╚██╔╝██║██║░░░██║░╚═══██╗██╔══╝░░
██║░╚═╝░██║╚██████╔╝██████╔╝███████╗
╚═╝░░░░░╚═╝░╚═════╝░╚═════╝░╚══════╝

[ Nuri ACAR ] [ nuriacar.com ]

[ Project Muse ] [ https://muse.jhu.edu/ parser, downloader, archiver. ]

[ Menu ]                                            [ v0.0.2 : 20201208134849 ]
===============================================================================
.
... 1. Download
...... [+] Program can download:
.......... [+] Access granted books
.......... [+] or open access books like in Covid-19 library. 
...... [!] Your IP can be restricted if you do not have a proxychain. :)

... 8. About & Source Code Repository & Version History
... 9. Exit
===============================================================================

Select an Option!

>>>
```

> John Hopkins Üniversitesi, Covid-19 nedeniyle,
> [https://muse.jhu.edu/](https://muse.jhu.edu/) linkinde yer alan pek çok
> kitabı çevrimiçi erişime açmış. Yetmezmiş gibi Arizona, Colorado, Cornell,
> Fordham, Georgia, MIT, Nebraska, North Carolina, Pennsylvania, Princeton,
> Temple ve Texas Tech üniversiteleri de **[Project
> Muse](https://muse.jhu.edu/)** üzerinde yer alıyor. Bu hazineden
> alabildiğimizi alalım ama manuel olarak çok zaman alıyor, bir program
> yazsan..."
>> Kardeşim

Deneyelim bakalım dedim ve bir gün içinde bu program ortaya çıktı. Harika
çalışıyor lakin NT (Windows) sistemlerde değil *nix'lerde çalışıyor zira
yalnızca Python3 değil Bash ve GNU bağımlı (curl, grep, cut, tr, mv, mkdir).
Açık olmak gerekirse işin çoğunu Bash ve GNU araçları yapıyor, Python 3 akışı
organize ediyor.

Özetle, bir GNU/Linux sistem bulun ve orada çalıştırın.

Peki ne yapar?

+ Her bir üniversiteye özel kütüphane web sayfasına gider, .html'i indirir,
  kaydeder.
+ .html içinden kitap linklerini ayıklar.
+ Ayıkladığı linklerdeki tüm kitapları tek tek ziyaret edip isimlerini,
  açıklamalarını ve kitap bölümlerini ayıklar, indirir, kaydeder.
+ Kitabın parçaları olan indirdiği dosyaları kitapla aynı isimde bir klasör
  oluşturarak içine koyar.
+ Kitabı da hangi üniversiteye aitse onun dizinine kopyalayarak arşivler.

Ayrıca proxychain'e ihtiyacınız var zira beş dakika içinde farkedip IP'nizi
yasaklıyorlar. :))

Son olarak, bahsettiğim kütüphane (Covid-19 Library) artık aktif olmayabilir.
[Kontrol etmekte fayda
var!](https://about.muse.jhu.edu/resources/freeresourcescovid19/)

Aşağıdaki **kehtapot**'a veya **ahtapedi**'ye (ahtapot ve kedi birleşimi bir
modern zaman canavarı, GitHub maskotu: **Octocat**) tıklayarak kaynak kodlara
erişebilirsiniz.

[![Project Muse GitHub](/assets/img/github-icon.png "Project Muse GitHub")](https://github.com/nuriacar/project_muse)

Kaynak Kod Deposu
{: style="color:gray; font-size: 80%; text-align: left;"}

---

#### **EN**

> Due to Covid-19, John Hopkins University has made many books available
> online at [https://muse.jhu.edu/](https://muse.jhu.edu/). As if it wasn't
> enough, universities of Arizona, Colorado, Cornell, Fordham, Georgia, MIT,
> Nebraska, North Carolina, Pennsylvania, Princeton, Temple and Texas Tech are
> also located on the **[Project Muse](https://muse.jhu.edu/)**. Let's take
> what we can get from this treasure, but it takes a lot of time manually, if
> you write a program ... "
>> My brother

I said let's try it and within a day this program came out. It works great,
but not on NT (Windows) systems, but on *nix because it is dependent on Bash
and GNU (curl, grep, cut, tr, mv, mkdir), not just Python3. To be clear, Bash
and GNU tools do most of the work, Python 3 organizes the flow.

In a nutshell, find a GNU/Linux system and run it there.

So what does it do?

+ Goes to each university library website, downloads .html, saves.
+ Extract book links from .html.
+ Visits all the books in the extracted links one by one; extracts, downloads
  and saves their names, descriptions and book chapters.
+ Puts the downloaded files, which are parts of the book, into a folder with
  the same name as the book.
+ Archives the book by copying it to the directory of the university it
  belongs to.

You also need a proxychain because they will notice it within five minutes and
ban your IP. :))

Finally, the library that I mentioned (Covid-19 Library) may not be active
anymore. [Check it
out!](https://about.muse.jhu.edu/resources/freeresourcescovid19/)

You can access the source code by clicking **Octocat** below.

[![Project Muse GitHub](/assets/img/github-icon.png "Project Muse GitHub")](https://github.com/nuriacar/project_muse)

Source Code Repository
{: style="color:gray; font-size: 80%; text-align: left;"}
