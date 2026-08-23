---
layout: post
title:  "shark-tank - ref5: Lab Özeti"
date:   2026-08-17 12:00:00 +0000
tags: [siber-guvenlik]
---
## Genel Bakış

Bu lab, Docker üzerinde izole bir ağ ortamı (`shark-tank`, 172.50.2.0/24) kurarak Wireshark paket analizini uygulamalı olarak öğretir. Her modül, belirli bir protokol/konuya odaklanır ve otomatik olarak üretilen pcap dosyaları üzerinde çalışılır.

## Neden Bu Lab?

- **Wireshark sınavda verilen pcap dosyasını analiz etmeni bekler** - bu lab aynı ortamı simüle eder
- **Protokolleri sadece okuyarak öğrenemezsin** - gerçek trafik görerek öğrenilir
- **Docker ile her şey tekrar edilebilir** - istediğin kadar trafik üretip yeniden analiz edebilirsin
- **Tek komutla ayağa kalkar** - `make setup` ile her şey hazır

---

## Ağ Altyapısı

### Ağ: shark-tank
- **Subnet:** 172.50.2.0/24
- **Gateway:** 172.50.2.1
- **Driver:** Bridge
- **Amaç:** İzole lab ortamı - host ağdan bağımsız

### Servis Envanteri

#### 1. Web Server (HTTP)

| Özellik | Değer |
|---------|-------|
| Container | `shark-tank-web` |
| IP | 172.50.2.10 |
| Port | 80 |
| Image | nginx:alpine |
| Endpointler | `/`, `/api/data`, `/api/users`, `/login`, `/secret` (403), `/large`, `/redirect` (302), `/headers`, `/nonexistent` (404), `/session` (Set-Cookie→Cookie zinciri), `/chunked.txt` (gzip → `Transfer-Encoding: chunked`), `/downloads/batch-report.zip` (PK imzalı ZIP, 775 bayt) |
| Amaç | HTTP request/response analizi, status codes, POST verisi, redirect, cookie oturum takibi, chunked aktarım, dosya kurtarma (magic bytes) |

#### 2. DNS Server

| Özellik | Değer |
|---------|-------|
| Container | `shark-tank-dns` |
| IP | 172.50.2.11 |
| Port | 53 (UDP+TCP) |
| Image | coredns/coredns |
| Domain | `shark-tank.local` |
| Kayıtlar | A/AAAA (web, dns, secure, target, echo, ftp, mail, smtp, udp, imap, voip, dc), CNAME (www), MX (mail), SRV (_kerberos, _ldap, _kpasswd, _gc), NS |
| Amaç | DNS query/response, kayıt tipleri, Transaction ID, NXDOMAIN |

#### 3. TCP Echo Server

| Özellik | Değer |
|---------|-------|
| Container | `shark-tank-tcp-echo` |
| IP | 172.50.2.12 |
| Port | 8080 |
| Image | alpine/socat |
| Amaç | TCP 3-way handshake, Seq/Ack takibi, port scanning |

#### 4. HTTPS Server (TLS)

| Özellik | Değer |
|---------|-------|
| Container | `shark-tank-https` |
| IP | 172.50.2.13 |
| Port | 443 |
| Image | nginx:alpine + mini-CA sertifika zinciri (fullchain) |
| Sertifika | CN=secure.shark-tank.local, Issuer=Shark-Tank Lab Root CA (serial 0x1001, AIA→OCSP 172.50.2.19:9080) |
| Amaç | TLS handshake, cipher suite, sertifika zinciri analizi, OCSP doğrulama, şifreli veri |

#### 5. OCSP Responder (mini-CA)

| Özellik | Değer |
|---------|-------|
| Container | `shark-tank-ocsp` |
| IP | 172.50.2.19 |
| Port | 9080 (HTTP POST) |
| Image | `shark-tank-ocsp:latest` (alpine + `openssl ocsp`) |
| CA | `Shark-Tank Lab Root CA` (serial 0x1000) — üretim: `shared/ca/generate-ca.sh` |
| Durum dosyası | `/ocsp/index.txt` — sunucu sertifikası (0x1001) `good` olarak kayıtlı |
| Amaç | Sertifika iptal durumu (OCSP request/response), `ocsp.certStatus == 0` doğrulaması, PKI zincirinin canlı parçası |

#### 6. ICMP Target

| Özellik | Değer |
|---------|-------|
| Container | `shark-tank-icmp-target` |
| IP | 172.50.2.14 |
| Image | alpine:3.21 |
| Amaç | Ping (Echo Request/Reply), RTT ölçüm, TTL analizi |

#### 7. FTP Server

| Özellik | Değer |
|---------|-------|
| Container | `shark-tank-ftp` |
| IP | 172.50.2.15 |
| Port | 21 |
| Credentials | ftpuser / ftppass123 |
| Amaç | FTP command/response, cleartext credentials, active/passive mode |

#### 8. Client (Trafik Üretici)

| Özellik | Değer |
|---------|-------|
| Container | `shark-tank-client` |
| IP | 172.50.2.100 |
| Araçlar | curl, dig, drill, ping, tcpdump, nmap, nc, openssl, bash |
| Amaç | Tüm servislerle iletişim kurup trafik üretir, tcpdump ile capture yapar |

#### 9. Attacker

| Özellik | Değer |
|---------|-------|
| Container | `shark-tank-attacker` |
| IP | 172.50.2.200 |
| Araçlar | nmap, curl, nc, python3, krb5, samba-client |
| Amaç | Port scan, SYN flood, Kerberoasting simülasyonu, parola spreyi |

#### 10. SMTP Server (Mailpit)

| Özellik | Değer |
|---------|-------|
| Container | `shark-tank-smtp` |
| IP | 172.50.2.16 |
| Port | 1025 |
| Image | axllent/mailpit |
| Amaç | SMTP email gönderme, cleartext email analizi |

#### 11. UDP Echo Server

| Özellik | Değer |
|---------|-------|
| Container | `shark-tank-udp-echo` |
| IP | 172.50.2.17 |
| Port | 9090/UDP |
| Image | alpine/socat |
| Amaç | UDP datagram analizi, port unreachable testi |

#### 12. IMAP Sunucusu (Dovecot)

| Özellik | Değer |
|---------|-------|
| Container | `shark-tank-imap` |
| IP | 172.50.2.18 |
| Port | 110 (POP3), 143 (IMAP), 587 (Submission) |
| Image | alpine + dovecot |
| Credentials | kullanici / secret123 |
| Mail kutusu | `1.eml` (normal rapor), `2.eml` (MIME multipart + base64 ek: `gizli-ek.bin`) |
| Amaç | Email alma (POP3/IMAP), SMTP AUTH, credential sızıntısı, attachment kurtarma (Follow Stream + `base64 -d` / Export Objects > IMF) |

#### 13. VoIP Sunucusu (Asterisk)

| Özellik | Değer |
|---------|-------|
| Container | `shark-tank-voip` |
| IP | 172.50.2.22 |
| Port | 5060/UDP (SIP), 10000-20000/UDP (RTP) |
| Image | alpine + asterisk |
| Extensions | 1000 (voip123), 1001 (voip456) |
| Amaç | SIP çağrı yönetimi, RTP ses iletimi, VoIP analizi |

#### 14. DHCP Server

| Özellik | Değer |
|---------|-------|
| Container | `shark-tank-dhcp-server` |
| IP | 172.50.9.2 |
| Port | 67/UDP |
| Ağ | shark-tank-dhcp (172.50.9.0/24) |
| Image | networkboot/dhcpd |
| Amaç | DHCP DORA süreci, IP atama, lease yönetimi |

#### 15. DHCP Client

| Özellik | Değer |
|---------|-------|
| Container | `shark-tank-dhcp-client` |
| IP | dynamic (172.50.9.x) |
| Ağ | shark-tank-dhcp (172.50.9.0/24) |
| Amaç | DHCP Discover/Request gönderir, IP alır |

#### 16. Active Directory Domain Controller (Samba)

| Özellik | Değer |
|---------|-------|
| Container | `shark-tank-ad-dc` |
| IP | 172.50.2.20 |
| Port | 88 (Kerberos), 389/636 (LDAP/LDAPS), 445 (SMB2) |
| Image | debian:bookworm-slim + samba |
| Realm | SHARK-TANK.LOCAL |
| Kullanıcılar | analyst (analyst123!), svc-backup (Kerberoasting hedefi), administrator |
| Paylaşım | `\\dc\shark-share` (rapor.txt) |
| Yapılandırma | SMB3 şifreleme kapalı (derste görülebilirlik), imzalama sürüyor; `kerberos allow weak crypto = yes`; svc-backup yalnız RC4 (msDS-SupportedEncryptionTypes=4) |
| Amaç | Kerberos bilet akışı (etype 18 AES256 + etype 23 RC4 gerçek biletler), LDAP sorguları, SMB2 dosya operasyonları (Create/Read/Write bayt ölçümü), svcctl ile uzaktan servis kontrolü (PsExec ayak izi) |

---

## Modül Detayları

### Modül 01 - Temeller
- Wireshark arayüzü (3 panel)
- Renk kodları
- Capture başlatma
- Paket katmanları (Frame > Ethernet > IP > TCP > Uygulama)
- Follow TCP Stream

### Modül 02 - Filtreleme
- Display filters (sınavda en önemli)
- Capture filters (BPF syntax)
- Protokol, IP, port, flag tabanlı filtreler
- HTTP, DNS, TLS, ICMP, ARP filtreleri
- İleri düzey: Retransmission, duplicate ACK, zero window

### Modül 03 - ARP Analizi
- ARP Request (broadcast) / Reply (unicast)
- MAC-IP eşleştirme
- Gratuitous ARP
- ARP poisoning tespiti

### Modül 04 - DHCP Analizi
- DORA süreci (Discover, Offer, Request, ACK)
- DHCP options (Subnet Mask, Router, DNS, Lease Time)
- Source IP 0.0.0.0 nedeni
- UDP port 67/68

### Modül 05 - ICMP Analizi
- Echo Request (Type 8) / Echo Reply (Type 0)
- RTT hesaplama
- TTL analizi
- Farklı boyutlarda ping
- Destination Unreachable (Type 3)
- ICMP Redirect (Type 5) tespiti: Gateway Address 172.50.2.200 (MITM denemesi)
- ICMP Tunneling: sabit identifier (0x7354) takibi, payload'da base64 veri çözümü

### Modül 06 - IP Fragmentation
- IP parçalama (fragmentation) mekanizması
- Fragment Offset, More Fragments (MF) bayrağı
- Don't Fragment (DF) bayrağı ve PMTUD
- Yeniden birleştirme (reassembly)
- Büyük ping ve UDP ile fragmentation tetikleme
- Fragment overlap tespiti (`ip.fragment.overlap`, conflict) — hostta üretilen ident 0x7771 zinciri

### Modül 07 - IPv6 Analizi
- IPv6 başlık yapısı (vs IPv4)
- Adres tipleri: Link-local, global unicast, multicast
- Extension Headers (Fragment, Hop-by-Hop)
- ICMPv6 (Neighbor Solicitation/Advertisement)
- AAAA DNS kayıtları

### Modül 08 - TCP Temel Analizi
- 3-way handshake (SYN → SYN-ACK → ACK)
- Sequence/Acknowledgment number takibi
- TCP flags (SYN, ACK, FIN, RST, PSH, URG)
- Connection teardown (FIN)
- Port scanning tespiti (SYN scan)
- RST paketleri ve kapalı port tespiti

### Modül 09 - TCP Dizi Analizi
- Sequence Number ve Acknowledgment Number derinlemesine
- TCP Window Size ve sliding window
- Retransmission ve Duplicate ACK tespiti
- TCP Zero Window ve flow control
- Ağ gecikmesi/kaybı simülasyonu (netem)
- SACK (Selective Acknowledgment)

### Modül 10 - UDP Analizi
- Connectionless protokol yapısı
- UDP başlık alanları (Source Port, Dest Port, Length, Checksum)
- UDP vs TCP karşılaştırması
- DNS over UDP
- Port Unreachable (ICMP Destination Unreachable)
- UDP ses/görüntü trafiği temelleri

### Modül 11 - İleri TCP Analizi
- TCP Keep-Alive mekanizması
- Window Scaling (WSopt)
- SACK (Selective Acknowledgment) analizi
- TCP Congestion Control (Slow Start, Congestion Avoidance)
- Nagle algoritması ve delayed ACK
- Zero Window ve TCP flow control
- Büyük veri transferinde TCP segmentasyonu

### Modül 12 - DNS Analizi
- Query/Response eşleştirme (Transaction ID)
- Kayıt tipleri: A, AAAA, CNAME, MX, NS, TXT
- NXDOMAIN hatası
- UDP (ve TCP) tabanlı DNS
- Recursive vs iterative sorgu
- DNS tunneling/exfiltration tespiti

### Modül 13 - HTTP Analizi
- GET, POST, HEAD istekleri
- Status codes: 200, 302, 403, 404
- Header analizi (User-Agent, Content-Type, Server)
- POST body'de şifre görünürlüğü
- HTTP Basic auth (`http.authbasic`, base64 çözümü)
- Cookie zinciri (Set-Cookie → Cookie), oturum token takibi
- Content-Length vs Transfer-Encoding: chunked
- DNS yanıtı → ilk GET zaman deltası ölçümü
- 74KB'lık POST'ta Content-Length + tcp.len segment toplama
- Follow TCP Stream ile tam oturum okuma
- HTTP Object Export
- SQL injection ve XSS saldırı tespiti

### Modül 14 - FTP Analizi
- FTP command/response yapısı
- Cleartext credentials (kullanıcı adı + şifre görünür)
- Active vs Passive mode (PORT vs PASV)
- Dosya transferi ve directory listing
- FTP brute force saldırı tespiti

### Modül 15 - Email (SMTP/POP3/IMAP) Analizi
- SMTP komutları (EHLO, MAIL FROM, RCPT TO, DATA)
- SMTP AUTH LOGIN (base64 ile şifre gönderimi)
- POP3 oturumu (USER, PASS, STAT, LIST, RETR)
- IMAP oturumu (LOGIN, SELECT, FETCH)
- Cleartext email içeriği ve credential analizi
- MIME multipart + base64 attachment kurtarma (Follow Stream + `base64 -d`, Export Objects > IMF)
- SPF/DKIM/DMARC kontrol teorisi (spoofing tespiti)
- Submission port (587) üzerinden auth

### Modül 16 - TLS Analizi
- TLS handshake adımları (ClientHello, ServerHello, Certificate, ServerHelloDone)
- Cipher suite seçimi
- Sertifika analizi (issuer, subject, CN, validity)
- Sertifika zinciri: server (0x1001) + Root CA (0x1000) — fullchain, self-signed'dan CA imzalısına geçiş
- OCSP iptal doğrulaması (`ocsp.certStatus == 0` → good)
- Sertifika sağlık kontrol listesi (zincir, tarih, imza algoritması, CN/SNI eşleşmesi)
- Şifrelenmiş veri (Application Data) ve tls.record.length (payload-length) analizi
- SSLKEYLOGFILE ile TLS deşifre etme
- TLS zafiyet tespiti (SSL stripping, Heartbleed)
- SNI (Server Name Indication) analizi
- HTTP vs HTTPS karşılaştırma
- TLS 1.2 vs TLS 1.3 farkları (0-RTT replay risk notu)

### Modül 17 - Kerberos Analizi
- AS/TGS bilet akışı (kinit → TGT → servis bileti)
- KRB-ERROR kodları (24 PREAUTH_FAILED, 25 PREAUTH_REQUIRED)
- CNameString/SNameString ile kullanıcı ve SPN analizi
- Bilet şifreleme türleri (etype 18/17/23)
- Kerberoasting tespiti (çoklu SPN taraması)
- Keskin imza: `kerberos.etype == 23` — RC4 bilet toplama (kvno -e rc4-hmac)
- Kerberos brute force izleri

### Modül 18 - LDAP Analizi
- Bind tipleri (anonim, simple, SASL/GSSAPI)
- rootDSE keşif sorguları
- base/scope/filter parametre okuma
- Simple bind'da düz metin parola riski
- invalidCredentials (49) ile parola denemesi tespiti
- Sunucu tarafı limitler: timeLimit (120 sn) / sizeLimit (500) okuma
- Geniş kapsamlı filter `(objectClass=*)` — dizin dump şüphesi
- StartTLS vs LDAPS karşılaştırması

### Modül 19 - SMB2 Analizi
- Oturum zinciri (Negotiate → Session Setup → Tree Connect)
- Kerberos biletli vs NTLM oturum kurma
- Dosya operasyonları (Create/Read/Write/Set Info)
- Dosya envanteri: smb2.filename + Read/Write bayt toplama (96KB veritabani.bin)
- svcctl pipe: uzaktan servis kontrolü, PsExec ayak izi (CreateService/StartService opnum zinciri)
- NULL/anonim NTLMSSP oturumu tespiti
- STATUS_LOGON_FAILURE ile parola spreyi tespiti
- SMB imzalama ve relay savunması
- Veri sızdırma (exfiltration) izleri

### Modül 20 - tshark CLI Analizi
- tshark parametreleri (-r, -Y, -T fields, -e, -z, -q, -c)
- Display filter vs capture filter (-Y vs -f)
- Belirli alanları çıkarma (-T fields -e)
- İstatistikler (-z io,phs, -z conv,tcp, -z expert)
- TCP stream takibi (tshark -z follow)
- Export objects (--export-objects)
- Otomasyon scriptleri (Bash + PowerShell)
- Yapılandırılmış çıktı: `-T json` / `-T csv`
- Canlı capture (sudo tshark -i)
- Cross-platform kurulum ve path bilgileri
- shark-tank.lua analitik motoru: üç çalıştırma yolu (betik / tshark -X lua_script / Wireshark GUI)

### Modül 21 - Gelişmiş Capture Teknikleri
- Ring buffer ile sürekli capture
- Multi-file capture (dosya boyutu/süre sınırı)
- Auto-stop koşulları
- Snap length (snaplen) ayarları
- Capture filter (BPF) ile ön filtreleme
- Mergecap ile pcap birleştirme
- Editcap ile pcap düzenleme/kırpma
- Wireshark Profilleri (Configuration Profiles)
- Global Preferences ayarları
- Mark/Ignore/Annotate ile paket işaretleme
- Print/Export ile paket çıktısı alma

### Modül 22 - TCP Grafikleri
- IO Graph (zaman bazlı throughput)
- Flow Graph (TCP akış şeması) ve saldırı zaman çizelgesi çıkarma
- Conversations tablosu (kim kime kaç bayt, asimetri analizi)
- TCP Stream Graphs (Round Trip Time, Throughput, Window Scaling, Sequence Numbers)
- IO Graph ile anomali tespiti
- Wireshark Statistics menüsü

### Modül 23 - Performans Analizi
- Throughput hesaplama (Mbps/paket-saniye)
- RTT (Round Trip Time) analizi
- Retransmission ve paket kaybı oranı
- TCP Window Size ve window scaling
- Wireshark Expert Info kullanımı
- Ağ gecikmesi/kaybı simülasyonu (netem)
- Port exhaustion ve burst trafik

### Modül 24 - WLAN (802.11) Analizi
- 802.11 yönetim çerçeveleri (Beacon, Probe Request/Response)
- Authentication ve Association süreci
- Deauthentication saldırı tespiti
- WPA/EAP (802.1X) kimlik doğrulama analizi
- 4-way handshake yapısı (teorik)
- 802.11 vs Ethernet karşılaştırması

### Modül 25 - VoIP (SIP/RTP) Analizi
- SIP mesaj yapısı (REGISTER, INVITE, ACK, BYE)
- SIP URI ve header analizi
- RTP stream ve ses iletimi
- Jitter ve latency analizi
- Codec tespiti (ulaw/alaw)
- VoIP çağrı akışı (Wireshark Telephony)

### Modül 26 - Baseline Analizi
- Trafik profili çıkarma (normal/anormal desen)
- Protocol Hierarchy istatistiği
- Conversations ve Endpoints analizi
- Throughput, paket/saniye, ortalama paket boyutu
- Normal trafik ile anomali trafiği karşılaştırma
- Port scan ve SYN flood'un baseline üzerindeki etkisi

### Modül 27 - Sınav Pratiği
- 10 farklı senaryo içeren karışık pcap (28 soru)
- HTTP, DNS, HTTPS, ICMP, TCP, FTP + saldırı
- HTTP forensics (şifre bulma, sayfa tespiti)
- DNS analizi (domain sorguları, IP çözümleme)
- Resolver → indirme zinciri: dig + ZIP download, pcap'ten kurtarma, SHA-256, magic bytes (PK)
- TLS analizi (handshake, sertifika)
- Port scan ve SYN flood tespiti
- FTP analizi (cleartext credentials)
- Kill chain oluşturma
- İstatistik araçları (Protocol Hierarchy, Conversations, Endpoints)

### Modül 28 - Ağ Forensics
- Şüpheli trafik tespiti
- Veri sızıntısı analizi
- DNS exfiltration
- Entropi analizi: exfil POST (5.98 bit/karakter) vs benign POST (4.14 bit/karakter) karşılaştırması
- HTTP User-Agent anomalileri
- C2 (Command & Control) pattern'leri ve beaconing
- Zamanlama analizi
- Kill chain adımlarının belirlenmesi

### Modül 29 - Lua ile Otomasyon
- shark-tank.lua analitik motoru: tek pcap veya dizin taraması
- Otomatik bulgu raporu: her pcap'in yanına aynı adda .md (kill-chain + IOC + hazır filtreler)
- Campaign görünümü: pcap'ler arası ortak IOC (c2_kanalı, sahte UA, NTLM hesabı...)
- JSON çıktı (SHARK_TANK_JSON=1) — SIEM'e aktarım
- Betik triaj + GUI derinleşme iş bölümü
- `make shark-tank` / `make test-sharktank` (regresyon testi)
- Not: Bu modülde pcap üretilmez; mevcut pcap'ler betikle analiz edilir

---

## Capture Yaklaşımı

macOS + Docker Desktop ortamında:

1. **Client container** üzerinde `tcpdump` çalışır
2. Client tüm servislere bağlanır (request gönderir + response alır)
3. Her iki yönün trafikleri capture edilir
4. Pcap dosyaları `shared/pcaps/` dizinine yazılır
5. Wireshark ile local dosya açılarak analiz yapılır

Bu yaklaşım:
- macOS'in Docker ağını doğrudan capture edememe sorununu çözer
- Client perspektifinden tüm konuşmaları görür
- Port mapping gerektirmez

Attacker trafiği için ek adım:

- **Attacker container** üzerinde de ikinci bir `tcpdump` çalışır (port scan, brute force, tünel paketleri)
- İki pcap, zaman damgası sırasına göre **tek dosyada birleştirilir** (`merge_attacker_pcap`) — böylece saldırı ve kurban perspektifi aynı akışta okunur

Bilinen sınır (dürüstlük notu):

- Docker'ın köprü ağı filtresi, MF bayraklı elle üretilmiş raw fragment paketlerini **düşürür**. Bu yüzden m06'nın overlap zinciri (ident 0x7771) host tarafında `shared/tools/gen-overlap-pcap.py` ile pcap olarak üretilip zaman sırasıyla ana pcap'e birleştirilir. Öğrenci pcap'i açtığında overlap gerçek görünür; üretim hattının bu detayı yalnızca lab'ı yeniden kuranları ilgilendirir.

---

## Analiz Otomasyonu

Manuel analiz (Modül 01-28) sonrası toplu kontrol için:

```sh
./scripts/shark-tank.sh shared/pcaps/module-28-forensics.pcap   # tek pcap → yanına .md rapor
./scripts/shark-tank.sh shared/pcaps                            # tüm dizin → raporlar + campaign.md
make test-sharktank                                             # regresyon testi (12 kontrol)
```

Çıktı envanteri:

| Çıktı | İçerik |
|-------|--------|
| `<pcap-adı>.md` | Kill-chain sıralı bulgu raporu: keşif, kimlik sızıntısı, sömürü, C2/beacon (jitter hesaplı), exfil + entropi, protokol envanterleri, zaman çizelgesi, IOC — her bulguyla hazır Wireshark filtresi |
| `<pcap-adı>.json` | IOC özeti (SHARK_TANK_JSON=1 ile) — SIEM'e aktarım için |
| `campaign.md` | Dizin taramasında pcap'ler arası ortak IOC: aynı olay mı, aynı kampanya mı? |

---

## DNS Zone: shark-tank.local

| Kayıt | Tip | Değer |
|-------|-----|-------|
| ns1 | A | 172.50.2.11 |
| web | A | 172.50.2.10 |
| dns | A | 172.50.2.11 |
| secure | A | 172.50.2.13 |
| target | A | 172.50.2.14 |
| echo | A | 172.50.2.12 |
| www | CNAME | web.shark-tank.local |
| ftp | A | 172.50.2.15 |
| smtp | A | 172.50.2.16 |
| udp | A | 172.50.2.17 |
| imap | A | 172.50.2.18 |
| voip | A | 172.50.2.22 |
| dc | A | 172.50.2.20 |
| _kerberos._tcp | SRV | 0 100 88 dc.shark-tank.local |
| _kerberos._udp | SRV | 0 100 88 dc.shark-tank.local |
| _ldap._tcp | SRV | 0 100 389 dc.shark-tank.local |
| _kpasswd._udp | SRV | 0 100 464 dc.shark-tank.local |
| mail | MX(10) | mail.shark-tank.local |
| mail | A | 172.50.2.16 |

---

## Sertifika Zinciri (mini-CA)

Lab, HTTPS servisini artık gerçek bir **mini-CA hiyerarşisiyle** çalıştırır. Zincir
`shared/ca/generate-ca.sh` tarafından deterministik üretilir (sabit serial'lar; her
kurulumda aynı değerler görülür):

| Sertifika | Serial | Konu | Rol |
|-----------|--------|------|-----|
| Root CA | 0x1000 | CN=Shark-Tank Lab Root CA | Kök; issuer = subject (köklerde doğaldır) |
| Sunucu | 0x1001 | CN=secure.shark-tank.local | https servisi; Root CA imzalı, SAN: secure.shark-tank.local, shark-tank.local, 172.50.2.13; AIA: OCSP → http://172.50.2.19:9080 |
| OCSP imza | 0x1002 | CN=Shark-Tank OCSP | Responder'ın yanıtları imzaladığı sertifika (EKU: OCSPSigning) |

Sunucu sertifikası detayları:

| Alan | Değer |
|------|-------|
| CN | secure.shark-tank.local |
| Issuer | CN=Shark-Tank Lab Root CA |
| Algorithm | RSA 2048 |
| Signature | sha256WithRSAEncryption |
| Validity | 730 gün |
| Zincir iletimi | nginx fullchain: Certificate mesajında 2 sertifika (server + Root CA) |

Üretim ve yaşam döngüsü:

- Üretim: `./shared/ca/generate-ca.sh` (setup.sh/start.sh otomatik çağırır)
- Çıktılar: `shared/certs/` (fullchain.crt, server.key, ca.crt) — `.gitignore`'dadır, kurulumda yeniden üretilir
- İptal durumu: OCSP responder `index.txt` üzerinden sunucu sertifikasını `good` döner
- Doğrulama: `curl --cacert shared/certs/ca.crt https://172.50.2.13/secure-data`

---

> Modül listesine erişmek için [tıkla!](/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
