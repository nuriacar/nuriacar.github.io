---
layout: project
title: "shark-tank: Wireshark Eğitim Rehberi"
nav_title: shark-tank
permalink: /shark-tank/
eyebrow: ağ paket analizi
---

shark-tank, Docker tabanlı, tek komutla ayağa kalkan Wireshark eğitim laboratuvarı.

Gerçek ağ trafiği üreterek paket analizini sıfırdan ileri seviyeye öğretir. 29 modül, 25 pcap, 16 gerçek servis: Hepsi kendi makinende, izole bir ağda.

**macOS / Linux / Windows (WSL2)**: Her platformda çalışır.

Aşağıdaki **kehtapot**'a veya **ahtapedi**'ye (ahtapot ve kedi birleşimi bir modern zaman canavarı, GitHub maskotu: **Octocat**) tıklayarak kaynak kodlara erişebilirsin.

<div class="repo-link" markdown="1">

[![shark-tank GitHub](/assets/img/github-icon.png "shark-tank GitHub")](https://github.com/nuriacar/shark-tank)

Kaynak Kod Deposu

</div>

```sh
git clone https://github.com/nuriacar/shark-tank.git
cd shark-tank && make setup
```

Docker'ın yoksa da dert değil: 25 pcap repoda gömülü; klonla, Wireshark'ta aç. Pcap'ler repoda `shared/pcaps/` dizininde.

---

<details class="toc-block" markdown="block">
<summary>Önce Oku: Referans Dokümanlar</summary>

| # | Doküman | Ne zaman okunur? |
|---|---------|------------------|
| ref1 | [Wireshark Eğitim Rehberi](/2026/07/15/shark-tank-ref1-rehber.html) | **Başlangıç noktası**: Seri tanıtımı, hızlı başlangıç, modül dizini |
| ref2 | [Kurs Müfredatı](/2026/07/16/shark-tank-ref2-kurs-mufredati.html) | **Kurs öncesi**: Kapsam, süreler, sertifika karşılıkları, çalışma yöntemi |
| ref3 | [Ağ Diyagramı](/2026/07/17/shark-tank-ref3-ag-diyagrami.html) | **Kurs öncesi**: Laboratuvar haritası ve trafik akışları |
| ref4 | [Filtre Cheat Sheet](/2026/08/16/shark-tank-ref4-filtre-cheat-sheet.html) | **Kurs sonrası/sınav öncesi**: 180+ display/capture filter + tshark örneği |
| ref5 | [Lab Özeti](/2026/08/17/shark-tank-ref5-lab-ozeti.html) | **Kurs sonrası**: Detaylı servis/kullanıcı/credential envanteri |

</details>

---

<details class="toc-block" markdown="block">
<summary>Modüller</summary>

| # | Modül | Konu | Seviye |
|---|-------|------|--------|
| 01 | [Temeller](/2026/07/18/shark-tank-m01-basics.html) | Wireshark arayüzü, paket yapısı | Başlangıç |
| 02 | [Filtreleme](/2026/07/19/shark-tank-m02-filters.html) | Display/capture filter, Coloring Rules, Expert Info | Başlangıç |
| 03 | [ARP](/2026/07/20/shark-tank-m03-arp.html) | MAC-IP eşleştirme, gratuitous ARP, spoofing | Başlangıç |
| 04 | [DHCP](/2026/07/21/shark-tank-m04-dhcp.html) | DORA süreci, lease time, options | Başlangıç |
| 05 | [ICMP](/2026/07/22/shark-tank-m05-icmp.html) | Ping, RTT, TTL, tunneling tespiti | Başlangıç |
| 06 | [Fragmentation](/2026/07/23/shark-tank-m06-fragmentation.html) | IP fragmentation, reassembly, PMTUD | Başlangıç |
| 07 | [IPv6](/2026/07/24/shark-tank-m07-ipv6.html) | IPv6 header, NDP, SLAAC, AAAA | Orta |
| 08 | [TCP](/2026/07/25/shark-tank-m08-tcp.html) | 3-way handshake, flags, port scan | Orta |
| 09 | [TCP Dizi](/2026/07/26/shark-tank-m09-tcp-sequence.html) | Retransmission, duplicate ACK, SACK | Orta |
| 10 | [UDP](/2026/07/27/shark-tank-m10-udp.html) | Connectionless, port unreachable | Orta |
| 11 | [İleri TCP](/2026/07/28/shark-tank-m11-advanced-tcp.html) | Window scaling, keep-alive, zero window | Orta |
| 12 | [DNS](/2026/07/29/shark-tank-m12-dns.html) | Kayıt tipleri, NXDOMAIN, exfiltration | Orta |
| 13 | [HTTP](/2026/07/30/shark-tank-m13-http.html) | GET/POST, status codes, Export Objects, SQLi/XSS | Orta |
| 14 | [FTP](/2026/07/31/shark-tank-m14-ftp.html) | Cleartext credentials, PASV, brute force | Orta |
| 15 | [Email](/2026/08/01/shark-tank-m15-email.html) | SMTP/POP3/IMAP, AUTH LOGIN | Orta |
| 16 | [TLS](/2026/08/02/shark-tank-m16-tls.html) | Handshake, cipher, sertifika, SSLKEYLOGFILE decryption | İleri |
| 17 | [Kerberos](/2026/08/03/shark-tank-m17-kerberos.html) | AD kimlik doğrulama, AS/TGS bilet analizi | İleri |
| 18 | [LDAP](/2026/08/04/shark-tank-m18-ldap.html) | Dizin servisi, bind, filtreler | İleri |
| 19 | [SMB2](/2026/08/05/shark-tank-m19-smb2.html) | Dosya paylaşımı, session setup, imza | İleri |
| 20 | [tshark CLI](/2026/08/06/shark-tank-m20-tshark.html) | Komut satırı analizi, otomasyon | İleri |
| 21 | [Gelişmiş Capture](/2026/08/07/shark-tank-m21-advanced-capture.html) | Ring buffer, profiles, mergecap | İleri |
| 22 | [TCP Grafikleri](/2026/08/08/shark-tank-m22-tcp-graph.html) | IO/Throughput/RTT graphs | İleri |
| 23 | [Performans](/2026/08/09/shark-tank-m23-performance.html) | Zero window, retransmission oranı | İleri |
| 24 | [WLAN](/2026/08/10/shark-tank-m24-wlan.html) | 802.11 frame'leri, WPA handshake | İleri |
| 25 | [VoIP](/2026/08/11/shark-tank-m25-voip.html) | SIP/RTP, Telephony menüsü, jitter | İleri |
| 26 | [Baseline](/2026/08/12/shark-tank-m26-baseline.html) | Trafik profili, anomali tespiti | Sentez |
| 27 | [Sınav Pratiği](/2026/08/13/shark-tank-m27-exam-practice.html) | 10 senaryo, 27 soru, kill chain | Sentez |
| 28 | [Forensics](/2026/08/14/shark-tank-m28-forensics.html) | Port scan, C2, SQLi, XSS, exfiltration | Sentez |
| 29 | [Lua ile Otomasyon](/2026/08/15/shark-tank-m29-lua-automation.html) | [shark-tank.lua](https://github.com/nuriacar/shark-tank/blob/main/shared/shark-tank.lua){: target="_blank" rel="noopener"}, otomatik bulgu raporu, angaryadan kurtulma | Sentez |

</details>
