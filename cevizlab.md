---
layout: project
title: cevizlab
description: "cevizlab®! Siber Sanatlar Reaktörü."
nav_title: cevizlab
permalink: /cevizlab/
eyebrow: siber sanatlar
---

<figure>
  <img src="/assets/img/cevizlab-logo.png" alt="cevizlab Logo" title="cevizlab Logo">
</figure>

<figure>
  <img src="/assets/img/poi-whoami-admin.jpg" alt="whoami admin" title="whoami admin">
</figure>

<figure>
  <a href="https://www.youtube.com/channel/UCdr-_dvdG8W1piZWRUUMWrw"><img src="/assets/img/youtube-icon.png" alt="Youtube" title="Youtube"></a>
  <a href="/store/"><img src="/assets/img/cart-icon.png" alt="Shopier" title="Shopier"></a>
</figure>

<article class="card" markdown="1">
<div class="card__meta">nedir? what is?</div>

cevizlab® bir siber sanatlar reaktörü. milion!

cevizlab® is a cyber arts reactor. milion!
</article>

<div class="section-header">
  <span class="section-marker"></span>
  <span class="section-title">cevizlab blog</span>
</div>

{% assign cposts = site.posts | where: 'categories', 'cevizlab' %}
{% include post-table.html posts=cposts show_topic=true %}
