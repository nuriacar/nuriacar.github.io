---
layout: post
title:  Julia Linux'e Nasıl Yüklenir [Programlama]
date:   2021-12-21 12:00:00 +0000
categories: cevizlab
---

![Julia Logo](/assets/img/julia-logo.png "Julia Logo")

<iframe width="560" height="315"
src="https://www.youtube.com/embed/8gKESMiQ-0w" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;
picture-in-picture" allowfullscreen></iframe>

> Liberal lisansa sahip, açık kaynaklı bir dil istiyoruz. Ruby'nin dinamizmi ile C'nin hızını istiyoruz. Lisp gibi gerçek makrolara, Matlab gibi bariz, tanıdık matematiksel gösterime sahip, homoikonik bir dil istiyoruz. Genel programlama için Python kadar kullanışlı, istatistik için R kadar kolay, dizi işleme için Perl kadar doğal, lineer cebir için Matlab kadar güçlü, programları birbirine bağlamada shell kadar iyi bir şey istiyoruz. Öğrenmesi basit ancak en ciddi hacker'ları mutlu eden bir şey... Etkileşimli olmasını ve derlenmesini istiyoruz. (C kadar hızlı olması gerektiğini söylemiş miydik?)

>> [Jeff Bezanson, Stefan Karpinski, Viral B. Shah, Alan Edelman](https://julialang.org/blog/2012/02/why-we-created-julia/)

<iframe width="560" height="315"
src="https://www.youtube.com/embed/m-nLPlf8Bto" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;
picture-in-picture" allowfullscreen></iframe>

"Meşazını aldım Nuuraabi, kıps. Ben de varım!" diyorsan hadi işimize bakalım:

Terminali aç ve Downloads klasörüne git:

```sh
cd ~/Downloads
```

Bu linkten güncel Linux binary'lerinden sana uyanını indirebilirsin: [Tık!](https://julialang.org/downloads/)

"Olmaz! `wget`'le indireceğim! Ne sandın?!." dediğini duyuyorum. Mükemmel atlayış!

```sh
wget https://julialang-s3.julialang.org/bin/linux/x64/1.7/julia-1.7.0-linux-x86_64.tar.gz
```

İnen dosya `.tar.gz`. Ayıkla `.tar.gz`'nin taşını:

```sh
tar -xvzf julia-1.7.0-linux-x86_64.tar.gz
```

Çıkan dosyayı `/opt` içine kopyala:

```sh
sudo cp -r julia-1.7.0 /opt/
```

`/usr/local/bin` içine [sembolik link](https://en.wikipedia.org/wiki/Symbolic_link) oluştur:

```sh
sudo ln -s /opt/julia-1.7.0/bin/julia /usr/local/bin/julia
```

Terminali kapatıp yeniden aç ve `julia` yaz. Hepsi bu!

```sh
julia
```

Ta daa!

![Julia Init](/assets/img/julia-init.jpg "Julia Init")
