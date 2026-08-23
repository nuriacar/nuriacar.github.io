---
layout: post
title:  "shark-tank - ref2: Kurs Müfredatı"
date:   2026-07-16 12:00:00 +0000
tags: [siber-guvenlik]
---

## Kurs Hakkında

**shark-tank**, Docker tabanlı uygulamalı bir Wireshark eğitim laboratuvarıdır. Öğrenciler gerçek ağ trafiği üzerinde paket analizi yaparak sınav hazırlığı yaparlar.

| Özellik | Detay |
|---------|-------|
| **Format** | Self-paced, uygulamalı laboratuvar |
| **Ortam** | Docker (macOS / Linux / Windows WSL2) |
| **Kurulum** | Tek komut: `make setup` |
| **Toplam modül** | 28 |
| **Toplam alıştırma** | 133 + 20 senaryo |
| **Toplam sınav sorusu** | 217 (çözümlü) |
| **Pcap dosyaları** | 25 (24 otomatik + 1 WLAN örnek) |
| **Filtre referansı** | 180+ filtre örneği |

---

## Hedef Kitle

- Ağ analisti, güvenlik analisti veya sistem yöneticisi olmak isteyenler
- Wireshark ile paket analizini sıfırdan öğrenmek isteyenler
- WCNA (Wireshark Certified Network Analyst) sınavına hazırlananlar
- CompTIA Network+ / Security+ sınavının paket analiz bölümlerine hazırlananlar
- Temel TCP/IP bilgisi olan herkes

### Ön Koşullar

- Temel IP, TCP, UDP kavramlarına aşinalık
- Bilgisayarda Docker ve Wireshark kurulu olması
- Terminal (komut satırı) kullanabilme

---

## Öğrenme Çıktıları

Bu kursu tamamlayan öğrenci:

1. Wireshark arayüzünü etkin kullanabilir (3 panel, renk kodları, zamanlama, Coloring Rules, Expert System)
2. Display filter ve capture filter yazabilir (180+ filtre)
3. OSI katman 2-7 arası tüm temel protokolleri analiz edebilir
4. TCP handshake, dizi analizi (retransmission, dup ACK, Zero Window) ve akış yönetimini (window scaling, congestion control) kapsamlı analiz edebilir
5. HTTP, DNS, FTP (Active + Passive), TLS, Kerberos, LDAP, SMB2, ICMP, ARP, DHCP trafiğini bağımsız olarak analiz edebilir
6. Şifrelenmemiş protokollerde credential ve veri sızıntısı tespit edebilir
7. TLS handshake analizi ve sertifika doğrulama yapabilir
8. Port scan, SYN flood, SQL injection, XSS, C2 beaconing, brute force tespit edebilir
9. TCP grafikleri (IO Graph, Time-Sequence, Throughput, RTT) yorumlayabilir
10. VoIP/SIP sinyalleşme ve RTP akış analizi yapabilir
11. 802.11 WLAN frame'leri, Probe/Beacon/Deauth saldırıları ve WPA handshake analizi yapabilir
12. Baseline profiling ile anomali tespiti yapabilir
13. Gelişmiş capture teknikleri (ring buffer, profiles, Preferences) kullanabilir
14. tshark ile CLI tabanlı analiz ve otomasyon yapabilir
15. Sınav formatındaki pcap dosyalarını belirlenen sürede analiz edebilir

---

## Müfredat Akışı

Kurs, OSI katmanlarına göre alttan üste düzenlenmiştir:

```text
KATMAN         MODÜL                            SÜRE
-------------  -------------------------------  ------
Giriş          01 - Wireshark Temelleri         45 dk
Beceri         02 - Wireshark Filtreleme        60 dk
               |-- 02a - Coloring Rules
               `-- 02b - Expert System
Layer 2        03 - ARP Analizi                 30 dk
Layer 3/7      04 - DHCP Analizi                45 dk
Layer 3.5      05 - ICMP Analizi                30 dk
Layer 3        06 - IP Fragmentation            30 dk
Layer 3        07 - IPv6 Analizi                45 dk
Layer 4        08 - TCP Temel Analizi           45 dk
Layer 4        09 - TCP Dizi Analizi            45 dk
Layer 4        10 - UDP Analizi                 30 dk
Layer 4        11 - TCP Akış Analizi            45 dk
Layer 7        12 - DNS Analizi                 30 dk
Layer 7        13 - HTTP Analizi                45 dk
Layer 7        14 - FTP Analizi                 30 dk
               `-- Active Mode
Layer 7        15 - Email (SMTP/POP/IMAP)       30 dk
Layer 6        16 - TLS/SSL Analizi             45 dk
Layer 7        17 - Kerberos Analizi            45 dk
Layer 7        18 - LDAP Analizi                30 dk
Layer 7        19 - SMB2 Analizi                45 dk
Beceri         20 - tshark CLI Analizi          45 dk
Beceri         21 - Gelişmiş Capture            30 dk
               |-- Profiles
               |-- Preferences
               |-- Mark/Ignore/Annotate
               `-- Print/Export/Save
Grafik         22 - TCP Grafikleri              45 dk
               |-- IO Graph
               |-- Time-Sequence
               |-- Throughput
               `-- RTT
Performans     23 - Performans Analizi          30 dk
               |-- High RTT
               |-- Zero Window
               |-- Slow App Response
               `-- Window Scale
Kablosuz       24 - WLAN (802.11) Analizi       45 dk
               |-- Beacon/Probe
               |-- Auth/Assoc
               |-- Deauth Saldırısı
               `-- WPA Handshake
Ses            25 - VoIP (SIP/RTP) Analizi      45 dk
               |-- SIP Sinyalleşme
               |-- RTP Akış
               `-- Kalite Metrikleri
Sentez         26 - Baseline Analizi            30 dk
               |-- Protocol Hierarchy
               |-- Conversations
               `-- Anomali Tespiti
Sentez         27 - Sınav Pratiği               90 dk
İleri Düzey    28 - Ağ Forensics                90 dk
Sentez         29 - Lua ile Otomasyon            60 dk
               |-- Port Scan
               |-- SYN Flood
               |-- SQL Injection
               |-- XSS
               |-- C2 Beaconing
               `-- DNS Exfiltration
-------------  -------------------------------  ------
               TOPLAM                           ~20 saat
```

### Modül Detayları

#### Aşama 1: Temel Beceriler (Modül 01-02)

| Modül | Konu | Ne Öğrenilir? |
|-------|------|---------------|
| **01** | Wireshark Temelleri | Arayüz (3 panel), capture başlatma, paket katmanları, renk kodları, Follow TCP Stream |
| **02** | Filtreleme | Display filter syntax, IP/port/flag filtreleri, capture filter (BPF), Coloring Rules, Expert System |

#### Aşama 2: Altyapı Protokolleri (Modül 03-07)

| Modül | Konu | Ne Öğrenilir? |
|-------|------|---------------|
| **03** | ARP Analizi | MAC-IP eşleştirme, broadcast/unicast, gratuitous ARP, ARP poisoning tespiti |
| **04** | DHCP Analizi | DORA süreci, 0.0.0.0 kaynağı, UDP 67/68, lease time, opsiyonlar |
| **05** | ICMP Analizi | Echo Request/Reply, RTT hesaplama, TTL analizi, Destination Unreachable |
| **06** | IP Fragmentation | Fragment offset, MF/DF flag, reassembly, Path MTU Discovery |
| **07** | IPv6 Analizi | IPv6 header, adres tipleri, extension headers, ICMPv6, Neighbor Discovery |

#### Aşama 3: Transport Katmanı (Modül 08-11)

| Modül | Konu | Ne Öğrenilir? |
|-------|------|---------------|
| **08** | TCP Temel Analizi | 3-way handshake, Seq/Ack takibi, flags, FIN teardown, RST, port scanning |
| **09** | TCP Dizi Analizi | Retransmission, Dup ACK, Out-of-Order, Zero Window, Stream Graphs, SACK |
| **10** | UDP Analizi | Connectionless protokol, UDP header, TCP vs UDP, port unreachable, checksum |
| **11** | TCP Akış Analizi | Flow vs Congestion Control, Window Scaling, Keep-Alive, Nagle, Congestion Control |

#### Aşama 4: Uygulama Protokolleri (Modül 12-19)

| Modül | Konu | Ne Öğrenilir? |
|-------|------|---------------|
| **12** | DNS Analizi | Query/Response eşleştirme, kayıt tipleri, NXDOMAIN, Transaction ID, exfiltration |
| **13** | HTTP Analizi | GET/POST analizi, status codes, header analizi, cleartext credentials, Object Export |
| **14** | FTP Analizi | Command/response yapısı, cleartext credentials, PASV/Active mode, brute force |
| **15** | Email Analizi | SMTP/POP3/IMAP komutları, cleartext email, credential sızıntısı |
| **16** | TLS/SSL Analizi | Handshake adımları, cipher suite, sertifika analizi, self-signed tespiti, TLS decryption |
| **17** | Kerberos Analizi | AS/TGS/AP akışı, bilet (ticket) yapısı, etype şifreleme türleri, CNameString/SNameString, Kerberoasting tespiti |
| **18** | LDAP Analizi | Dizin servisi sorguları, bind tipleri (anonim/simple/GSSAPI), base/scope/filter, keşif tespiti |
| **19** | SMB2 Analizi | Negotiate/session setup/tree connect zinciri, dosya operasyonları, oturum imzalama, password spray tespiti |

#### Aşama 5: İleri Beceriler (Modül 20-21)

| Modül | Konu | Ne Öğrenilir? |
|-------|------|---------------|
| **20** | tshark CLI Analizi | tshark parametreleri, otomasyon scriptleri, export, Expert Info CLI |
| **21** | Gelişmiş Capture | Ring buffer, multi-file capture, Profiles, Preferences, Mark/Ignore/Annotate, Print/Export |

#### Aşama 6: Görsel ve Performans Analizi (Modül 22-23)

| Modül | Konu | Ne Öğrenilir? |
|-------|------|---------------|
| **22** | TCP Grafikleri | IO Graph, Time-Sequence (Stevens), Throughput, RTT, Window Scaling grafikleri |
| **23** | Performans Analizi | High RTT tespiti, Zero Window olayları, Slow App Response, Retransmission oranı, Window Scale karşılaştırması |

#### Aşama 7: Kablosuz ve Ses (Modül 24-25)

| Modül | Konu | Ne Öğrenilir? |
|-------|------|---------------|
| **24** | WLAN (802.11) Analizi | Beacon/Probe Request, Auth/Assoc, Deauth saldırısı, WPA/WPA2 4-way handshake, Data Frames |
| **25** | VoIP (SIP/RTP) Analizi | SIP REGISTER/INVITE/BYE, RTP akış yorumlama, jitter/packet loss, kalite metrikleri |

#### Aşama 8: Sentez ve İleri Düzey (Modül 26, 27, 28, 29)

| Modül | Konu | Ne Öğrenilir? |
|-------|------|---------------|
| **26** | Baseline Analizi | Protocol Hierarchy, Conversations/Endpoints, File Properties, normal/anomalı karşılaştırması |
| **27** | Sınav Pratiği | 10 senaryo, 27 soru, karışık trafik, istatistik araçları, zaman yönetimi |
| **28** | Ağ Forensics | Port scan, SYN flood, SQL injection, XSS, C2 beaconing, DNS exfiltration, FTP brute force, kill chain |
| **29** | Lua ile Otomasyon | shark-tank.lua analitik motoru, otomatik bulgu raporu, campaign/JSON çıktı, betik triaj + GUI derinleşme iş bölümü |

---

## Sertifika Sınavlarına Karşılıklar

| Sertifika | shark-tank Kapsamı |
|-----------|----------------|
| **Wireshark WCNA** | Modül 01-29 kapsam (%90+ syllabus): 29 modül (29. modül otomasyon/tshark derinliği), 33 WCNA başlığı |
| **CompTIA Network+** | Paket analiz bölümü (Modül 01-12) |
| **CompTIA Security+** | Trafik analizi bölümü (Modül 13-28) |
| **CEH** | Ağ forensics bölümü (Modül 28) |

---

## Çalışma Yöntemi

### Her Modül İçin:

1. **Modül rehberini oku**: Teori bölümünü anla
2. **Pcap'i Wireshark'ta aç**: `make open FILE=shared/pcaps/module-XX-name.pcap`
3. **Alıştırmaları yap**: Adım adım analiz uygula
4. **Filtre referansını dene**: Her filtreyi uygula ve sonucu gör
5. **Sınav sorularını çöz**: `<details>` ile cevapları kontrol et

### Tamamlama Kriterleri:

- Her modülün sınav sorularının %80'ini doğru cevaplayabilmek
- Display filter'ları hatasız yazabilmek
- 3-way handshake'i bir pcap'de 30 saniye içinde bulabilmek
- TCP grafiği yorumlamayı 2 dakika içinde yapabilmek
- Sınav pratiği modülünü 60 dakika içinde tamamlayabilmek

---

## Kaynaklar

| Dosya | Açıklama |
|-------|----------|
| `docs/quick-reference.md` | 180+ filtre cheat sheet |
| `docs/network-diagram.md` | Ağ topoloji şeması |
| `docs/shark-tank-lab-sum.md` | Detaylı teknik lab özeti |
| `module-XX/module-XX.md` | Her modülün rehberi |
| `shared/pcaps/*.pcap` | Analiz edilen pcap dosyaları |

---

## SSS

**Wireshark kurulumu gerekli mi?**
Evet. Wireshark pcap dosyalarını açmak için gereklidir. `brew install --cask wireshark` (macOS).

**Docker bilgisi gerekli mi?**
Hayır. Tüm Docker işlemleri `make` komutları ile yönetilir. Tek komut: `make setup`.

**İnternet bağlantısı gerekli mi?**
Sadece kurulum sırasında (Docker image çekme). Lab çalışırken internet gerekmez.

**Hangi işletim sistemi?**
macOS, Linux, Windows (WSL2). Apple Silicon (ARM) ve x64 desteklenir.

**Sınav süresi ne kadar olmalı?**
Sınav pratiği modülünü 60 dakikada tamamlayabiliyorsan sınava hazırsın.

---

> Modül listesine erişmek için [tıkla!](/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
