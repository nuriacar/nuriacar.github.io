---
layout: post
title:  "shark-tank - ref1: Wireshark Eğitim Rehberi"
date:   2026-07-15 12:00:00 +0000
tags: [siber-guvenlik]
---

shark-tank, Docker tabanlı, tek komutla ayağa kalkan Wireshark eğitim laboratuvarı. Barış Hocam'ın yüksek lisans dersinden geçeyim diye çalışırken bu lab içeriği doğdu! Sınavdan önce tamamlayabilseydim sınıf arkadaşlarıma da yarardı lakin tamamlanması "şunu da, bunu da ekleyeyim" derken 2026 Temmuz'unu buldu. Eh, nasip! Sen oku ve uygula, sana fayda sağlasın...

Özetle şunu yapar: Gerçek ağ trafiği üreterek paket analizini sıfırdan ileri seviyeye öğretir. 29 modül, 25 pcap, 16 gerçek servis: Hepsi kendi makinende, izole bir ağda.

**macOS / Linux / Windows (WSL2)**: Her platformda çalışır.

Aşağıdaki **kehtapot**'a veya **ahtapedi**'ye (ahtapot ve kedi birleşimi bir modern zaman canavarı, GitHub maskotu: **Octocat**) tıklayarak kaynak kodlara erişebilirsin.

<div class="repo-link" markdown="1">

[![shark-tank GitHub](/assets/img/github-icon.png "shark-tank GitHub")](https://github.com/nuriacar/shark-tank)

Kaynak Kod Deposu

</div>

---

## Kim İçin?

| Rol | Neden Faydalı? | Hangi Modüller? |
|----|----------------|-----------------|
| **WCNA adayları** | Sınav syllabus'unun %90+'ı uygulamalı işlenir. Display filter, Expert Info, TCP grafikleri, tshark: Sınavın en çok puan getiren konuları | Tümü (M01-M29) |
| **SOC L1 analistleri** | Alert triage'da pcap analizi yapmayı öğrenir. Port scan, C2 beaconing, DNS exfiltration, credential sızıntısı tespiti | M01-M02, M08, M13, M17-M19, M27-M29 |
| **CompTIA Network+ adayları** | Paket analiz bölümünü gerçek trafik üzerinde uygular. TCP/UDP, DHCP, DNS, ARP, IPv6 | M01-M12 |
| **CompTIA Security+ adayları** | Trafik analizi bölümünü saldırı senaryolarıyla çalışır. SQL injection, XSS, SYN flood, TLS zafiyetleri | M13-M28 |
| **Ağ mühendisleri** | Performans analizi ve troubleshooting yapmayı öğrenir. Retransmission, zero window, RTT, throughput grafikleri | M08-M11, M22-M23 |
| **Siber güvenlik öğrencileri** | Kill chain'i pcap'te adım adım takip eder. Reconnaissance → delivery → exploitation → C2 → exfiltration | M26-M29 |
| **CEH adayları** | Ağ forensics bölümünde saldırı izlerini paket seviyesinde görür | M28 |

---

## Ne Öğreneceksin?

- **Wireshark'ı etkin kullanma**: 3 panel, renk kodları, display filter, Expert Info, Follow TCP Stream
- **Protokol analizi**: TCP/IP katmanlarını (ARP, IP, TCP, UDP, DNS, HTTP, TLS, Kerberos, LDAP, SMB2) gerçek paketlerle inceleme
- **Saldırı tespiti**: Port scan, SYN flood, SQL injection, XSS, C2 beaconing, DNS exfiltration, credential sızıntısı, Kerberoasting ve parola spreyi
- **Performans analizi**: Retransmission, zero window, RTT, throughput, TCP congestion control grafikleri
- **tshark otomasyonu**: Komut satırından pcap analizi, script yazma, toplu işleme
- **TLS analizi**: Handshake, cipher suite, sertifika inceleme, SSLKEYLOGFILE ile trafiği deşifre etme
- **VoIP analizi**: SIP sinyalleşme, RTP ses akışı, jitter/packet loss ölçümü
- **Forensics**: Kill chain oluşturma, trafik profili çıkarma, anomali tespiti

---

## Hızlı Başlangıç

### Seçenek A: Sadece Pcap Analizi (Docker Gerekmez)

Repo'yu klonla, pcap'i Wireshark'ta aç, öğrenmeye başla. Docker kurmana gerek yok. Repoyu indirmediysen [tüm pcap'leri ya da modül pcap'ini buradan indirebilirsin](https://github.com/nuriacar/shark-tank/tree/main/shared/pcaps).

```sh
git clone https://github.com/nuriacar/shark-tank.git
cd shark-tank

# macOS:
open -a Wireshark shared/pcaps/module-01-basics.pcap

# Linux:
wireshark shared/pcaps/module-01-basics.pcap &

# Windows:
start wireshark shared\pcaps\module-01-basics.pcap
```

25 pcap dosyası ve TLS keylog dosyası repo'ya dahildir. Aşağıdaki müfredat tablosundan bir modül seç, rehberi oku, pcap'i Wireshark'ta aç.

### Seçenek B: Tam Laboratuvar (Docker İle)

Gerçek servisler (web, DNS, FTP, VoIP, attacker) üzerinde kendi trafiğini üretmek ve capture almak için:

```sh
git clone https://github.com/nuriacar/shark-tank.git
cd shark-tank
make setup
```

Bu tek komut her şeyi yapar: Docker kurulumu (eksikse), sertifikaları, 16 container'ı, 25 pcap dosyasını.

Kurulum bittikten sonra herhangi bir modülü aç:

```sh
# İlk modülden başla:
make open FILE=shared/pcaps/module-01-basics.pcap

# Tüm pcap'ları yeniden üret (istersen):
make capture

# Servislerin çalıştığını doğrula:
make test
```

### Gereksinimler

`make setup` bunları otomatik kontrol eder ve eksikse kurulum sunar:

| Araç | Zorunlu | Otomatik Kurulum |
|------|---------|------------------|
| Docker (v20+) | Evet | Sorarak |
| Wireshark | Evet | Sorarak |
| openssl | Evet | Sorarak |
| python3 | Evet | Sorarak |
| make + bash + git | Evet | Zaten mevcut |

---

## Neden shark-tank?

| Özellik | Açıklama |
|---------|----------|
| **Docker gerekmez** | 25 pcap repo'ya dahil. Sadece klonla, Wireshark'ta aç, öğren |
| **16 gerçek servis** | web, dns, ftp, smtp, imap, voip, https, ocsp (mini-CA), dhcp, tcp/udp echo, ad-dc (Kerberos+LDAP+SMB2), attacker |
| **25 pcap** | 24'ü lab'da üretilen gerçek trafik + 1 örnek WLAN capture: Sentetik değil |
| **Saldırı simülasyonu** | Port scan, SYN flood, SQL injection, XSS, C2 beaconing, DNS exfiltration |
| **TLS decryption** | SSLKEYLOGFILE ile şifreli HTTPS trafiğini deşifre etme alıştırması |
| **VoIP + RTP** | 153 RTP paketi, SIP çağrı akışı, jitter analizi |
| **TCP anomaly zengini** | Retransmission, duplicate ACK, SACK, zero window, keep-alive: Hepsi gerçek |
| **C2 beaconing** | Düzenli aralıklı çağrılarla IO Graph'te periyodik desen tespiti |
| **tshark otomasyonu** | CLI tabanlı analiz, bash script'leri, toplu pcap işleme |
| **Filtre cheat sheet** | 180+ display filter + capture filter + tshark örneği |
| **Otomatik doğrulama** | `make validate`: 75 kontrol ile pcap içeriklerini doğrula |
| **Çapraz platform** | macOS (Intel + ARM), Linux, Windows WSL2 |
| **İzole lab ağı** | 172.50.2.0/24: Host ağdan tamamen bağımsız |

---

## Ağ Topolojisi

```text
         Shark-Tank Network (172.50.2.0/24)
         ==================================

  +-------------+  +-------------+  +-------------+
  | WEB SERVER  |  | DNS SERVER  |  |  TCP ECHO   |
  |  nginx      |  |  CoreDNS    |  |   socat     |
  | .10:80      |  |  .11:53     |  | .12:8080    |
  +------+------+  +------+------+  +------+------+
         |                |                |
  +------+------+  +------+------+  +------+------+
  | HTTPS SERVER|  | ICMP TARGET |  |  FTP SERVER |
  |  nginx+SSL  |  |   Alpine    |  |   vsftpd    |
  | .13:443     |  |   .14       |  | .15:21      |
  +------+------+  +------+------+  +------+------+
         |                |                |
  +-------------+  +-------------+  +-------------+
  | SMTP SERVER |  |  UDP ECHO   |  | IMAP SERVER |
  |  Mailpit    |  |   socat     |  |  Dovecot    |
  | .16:1025    |  | .17:9090    |  | .18:110/143 |
  +------+------+  +------+------+  +------+------+
         |                |                |
         +----------------+----------------+
                          |
              +-----------+-----------+
              |                       |
       +------+------+         +------+------+
       |   CLIENT    |         |  ATTACKER   |
       |   .100      |         |   .200      |
       | curl, dig,  |         | nmap, nc,   |
       | nmap, nc    |         | python3     |
       +-------------+         +-------------+

  VoIP (.22:5060)     DHCP Server (.9.2:67)     AD DC (.20:88/389/445)
  Asterisk SIP/RTP    ISC dhcpd                  Samba Krb/LDAP/SMB2
```

---

## Servisler ve Credentials

| Servis | IP | Port | Kullanıcı | Şifre |
|--------|-----|------|-----------|-------|
| Web (HTTP) | 172.50.2.10 | 80 | admin | secret123 |
| Web (HTTP) | 172.50.2.10 | 80 | employee | companySecret2024 |
| Web (HTTP) | 172.50.2.10 | 80 | guest | wrong (hatalı giriş) |
| HTTPS | 172.50.2.13 | 443 | - | mini-CA zinciri (Root CA imzalı) |
| OCSP | 172.50.2.19 | 9080 | - | mini-CA iptal durumu (good) |
| FTP | 172.50.2.15 | 21 | ftpuser | ftppass123 |
| FTP | 172.50.2.15 | 21 | ftpuser | wrongpassword (brute force) |
| SMTP | 172.50.2.16 | 1025 | kullanici | secret123 |
| IMAP/POP3 | 172.50.2.18 | 110/143 | kullanici | secret123 |
| AD DC (Kerberos/LDAP/SMB2) | 172.50.2.20 | 88/389/445 | analyst | analyst123! |
| AD DC (Kerberoasting hedefi) | 172.50.2.20 | 88 | svc-backup | KerberoastMe123! |
| VoIP (SIP) | 172.50.2.22 | 5060 | 1000 / 1001 | voip123 / voip456 |
| DNS | 172.50.2.11 | 53 | - | shark-tank.local zone |
| TCP Echo | 172.50.2.12 | 8080 | - | - |
| UDP Echo | 172.50.2.17 | 9090 | - | - |
| ICMP Target | 172.50.2.14 | - | - | - |
| DHCP Server | 172.50.9.2 | 67 | - | - |
| DHCP Client | dynamic | 68 | - | - |
| Client | 172.50.2.100 | - | - | curl, dig, nmap, nc |
| Attacker | 172.50.2.200 | - | - | nmap, nc, python3 |

Tüm bilgiler [`shared/credentials.env`](https://github.com/nuriacar/shark-tank/blob/main/shared/credentials.env) dosyasında.

---

## Önce Oku: Referans Dokümanlar

Kurs başlamadan önce bu rehber dahil üç yol gösterici doküman, kurstan sonra ise iki cep kartı seni bekliyor:

| # | Doküman | Ne zaman okunur? |
|---|---------|------------------|
| ref1 | [Wireshark Eğitim Rehberi](#modüller) | **Başlangıç noktası**: Seri tanıtımı, hızlı başlangıç, modül dizini (şu an buradasın!) |
| ref2 | [Kurs Müfredatı](/2026/07/16/shark-tank-ref2-kurs-mufredati.html) | **Kurs öncesi**: Kapsam, süreler, sertifika karşılıkları, çalışma yöntemi |
| ref3 | [Ağ Diyagramı](/2026/07/17/shark-tank-ref3-ag-diyagrami.html) | **Kurs öncesi**: Laboratuvar haritası ve trafik akışları |
| ref4 | [Filtre Cheat Sheet](/2026/08/16/shark-tank-ref4-filtre-cheat-sheet.html) | **Kurs sonrası/sınav öncesi**: 180+ display/capture filter + tshark örneği |
| ref5 | [Lab Özeti](/2026/08/17/shark-tank-ref5-lab-ozeti.html) | **Kurs sonrası**: Detaylı servis/kullanıcı/credential envanteri |

---

## Modüller

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
| 29 | [Lua ile Otomasyon](/2026/08/15/shark-tank-m29-lua-automation.html) | shark-tank.lua, otomatik bulgu raporu, angaryadan kurtulma | Sentez |

Her modülde: Teori, adım adım alıştırmalar, filtre referansı, sınav soruları + cevaplar.

Müfredat tablosundan herhangi bir modüle başla. Her modül bağımsız çalışabilir, ama sırayla takip etmek önerilir.

---

## Nasıl Çalışılır?

**Docker'sız (sadece pcap analizi):** Her modülün pcap dosyası repo'da hazır gelir. Wireshark'ta aç, modül rehberini oku, alıştırmaları yap. Docker kurmana gerek yok.

**Docker ile (tam laboratuvar):** `make setup` ile 16 gerçek servis ayağa kalkar. Kendi trafiğini üret, capture al, gerçek zamanlı analiz yap.

1. **Modül rehberini oku**: `module-XX/module-XX.md` dosyasını aç
2. **Pcap'i Wireshark'ta aç**: `make open FILE=shared/pcaps/module-XX-name.pcap`
3. **Alıştırmaları yap**: Rehberdeki adımları sırayla uygula
4. **Sınav sorularını çöz**: Cevapları `<details>` ile kontrol et
5. **Sonraki modüle geç**: Sayfanın altındaki önceki/sonraki butonlarını kullan

```sh
# İpucu: Tüm komutları görmek için
make help

# Servis durumunu kontrol et
make test

# Pcap'lerin içeriğini doğrula
make validate
```

---

## Komut Referansı

```sh
make setup          # İlk kurulum (her şey)
make start          # Container'ları başlat
make stop           # Durdur
make test           # 13 servis bağlantı testi
make capture        # Tüm pcap'ları yeniden üret
make validate       # Pcap içeriklerini doğrula (75 kontrol)
make check          # Modül + pcap dosya kontrolü
make open FILE=...  # Pcap'i Wireshark'ta aç
make status         # Container + ağ durumu
make shell          # Client container'da bash aç
make logs           # Container loglarını izle
make clean          # Her şeyi sil
```

---

## Sertifikalar

| Sertifika | Kapsam |
|-----------|--------|
| **Wireshark WCNA** | M01-M29 kapsam (%90+ syllabus, 33 WCNA başlığı; M29 otomasyon/tshark derinliği) |
| **CompTIA Network+** | Paket analiz bölümü (M01-M12) |
| **CompTIA Security+** | Trafik analizi bölümü (M13-M28) |
| **CEH** | Ağ forensics bölümü (M28) |

---

## Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| Docker başlatılamıyor | Docker Desktop'ı başlat veya `sudo systemctl start docker` |
| Container'lar hazır değil | `sleep 15 && make test` |
| Pcap dosyaları boş | `make capture` |
| DNS çözümlenmiyor | `docker exec shark-tank-client dig @172.50.2.11 web.shark-tank.local` |
| Build hatası | `docker compose build --no-cache` |

---

## Proje Yapısı

```text
shark-tank/
+-- docker-compose.yml           # 16 servis, izole ağ
+-- .env                         # Docker Compose değişkenleri
+-- Makefile                     # Tüm komutlar
+-- module-01 .. module-29/      # 29 modül rehberi
+-- shared/
|   +-- Dockerfile.*             # 8 Docker image
|   +-- credentials.env          # Login bilgileri
|   +-- coredns/                 # DNS zone (shark-tank.local)
|   +-- certs/                   # SSL sertifika + keylog (otomatik)
|   +-- pcaps/                   # 25 pcap dosyası (otomatik)
+-- scripts/
|   +-- setup.sh                 # Kurulum
|   +-- generate-traffic.sh      # Trafik üretici (24 mod)
|   +-- validate-pcaps.sh        # Pcap doğrulayıcı (75 kontrol)
|   +-- ...
+-- docs/
    +-- curriculum.md            # Müfredat (~20 saat)
    +-- quick-reference.md       # 180+ filtre cheat sheet
    +-- ...
```

---

## Lisans

Copyright © 2026 Nuri ACAR. All rights reserved. Tüm hakları saklıdır.

Detay için: [LICENSE](https://github.com/nuriacar/shark-tank/blob/main/LICENSE)
