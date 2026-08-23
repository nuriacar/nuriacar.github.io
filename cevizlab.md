---
layout: project
title: cevizlab
permalink: /cevizlab/
eyebrow: siber sanatlar
---

<div class="box">
  <img src="/assets/img/cevizlab-logo.png" alt="cevizlab Logo" title="cevizlab Logo">
</div>

<div class="box">
  <img src="/assets/img/poi-whoami-admin.jpg" alt="whoami admin" title="whoami admin">
</div>

<div class="box">
  <a href="https://www.youtube.com/channel/UCdr-_dvdG8W1piZWRUUMWrw"><img src="/assets/img/youtube-icon.png" alt="Youtube" title="Youtube"></a>
  <a href="/store/"><img src="/assets/img/cart-icon.png" alt="Shopier" title="Shopier"></a>
</div>

<article class="card card--solo" markdown="1">
<div class="card__meta">nedir? what is?</div>

cevizlab® bir siber sanatlar reaktörü. milion!

cevizlab® is a cyber arts reactor. milion!
</article>

<div class="section-header section-header--block">
  <span class="section-marker"></span>
  <span class="section-title">cevizlab blog</span>
</div>

<div class="cards">
{% assign cposts = site.posts | where: 'categories', 'cevizlab' %}
{% for post in cposts %}
{% include post-card.html post=post %}
{% endfor %}
</div>
