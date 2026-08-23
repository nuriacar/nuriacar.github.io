---
layout: post
title:  "shark-tank - ref4: Wireshark Filtre Cheat Sheet"
date:   2026-08-16 12:00:00 +0000
tags: [siber-guvenlik]
---
## Display Filter Syntax

```text
Karşılaştırma:  ==  !=  >  <  >=  <=
Mantik:         &&  ||  !
İçerik:         contains  matches (regex)
Varlik:         (field) != 0  veya sadece (field)
```

---

## IP Filtreleri

| Filtre | Açıklama |
|--------|----------|
| `ip.addr == 10.0.0.1` | Bu IP ile ilgili (src VEYA dst) |
| `ip.src == 10.0.0.1` | Bu IP'den gelen |
| `ip.dst == 10.0.0.1` | Bu IP'ye giden |
| `ip.addr == 10.0.0.0/24` | Bu subnet'teki |
| `!(ip.addr == 10.0.0.1)` | Bu IP hariç |
| `ip.ttl < 10` | TTL 10'dan düşük (suspicious) |
| `ip.len > 1000` | 1000 byte'tan büyük IP paketleri |
| `ip.flags.df == 1` | Don't Fragment set |

## Port Filtreleri

| Filtre | Açıklama |
|--------|----------|
| `tcp.port == 80` | TCP port 80 (src VEYA dst) |
| `tcp.srcport == 80` | Kaynak port 80 |
| `tcp.dstport == 80` | Hedef port 80 |
| `udp.port == 53` | UDP port 53 |
| `tcp.port >= 1024` | Yüksek portlar |

## TCP Filtreleri

| Filtre | Açıklama |
|--------|----------|
| `tcp.flags.syn == 1` | SYN set |
| `tcp.flags.ack == 1` | ACK set |
| `tcp.flags.fin == 1` | FIN set |
| `tcp.flags.reset == 1` | RST set |
| `tcp.flags.syn == 1 && tcp.flags.ack == 0` | Sadece SYN |
| `tcp.flags.syn == 1 && tcp.flags.ack == 1` | SYN-ACK |
| `tcp.flags == 0x002` | Raw: SYN only |
| `tcp.flags == 0x012` | Raw: SYN-ACK |
| `tcp.flags == 0x010` | Raw: ACK only |
| `tcp.flags == 0x011` | Raw: FIN-ACK |
| `tcp.analysis.retransmission` | Yeniden iletim |
| `tcp.analysis.duplicate_ack` | Duplicate ACK |
| `tcp.analysis.zero_window` | Sıfır pencere |
| `tcp.stream == 0` | İlk TCP akışı |
| `tcp.payload` | TCP payload var |
| `tcp.len > 500` | 500 byte'tan büyük TCP verisi |

## HTTP Filtreleri

| Filtre | Açıklama |
|--------|----------|
| `http` | Tüm HTTP |
| `http.request` | HTTP istekler |
| `http.response` | HTTP response'lar |
| `http.request.method == "GET"` | GET istekleri |
| `http.request.method == "POST"` | POST istekleri |
| `http.request.uri == "/"` | Ana sayfa |
| `http.request.uri contains "login"` | Login URL |
| `http.response.code == 200` | Başarılı |
| `http.response.code == 301` | Kalıcı yönlendirme |
| `http.response.code == 302` | Geçici yönlendirme |
| `http.response.code == 401` | Yetkilendirme gerekli |
| `http.response.code == 403` | Yasaklı |
| `http.response.code == 404` | Bulunamadı |
| `http.response.code == 500` | Sunucu hatası |
| `http.host contains "example"` | Host header |
| `http.user_agent contains "curl"` | User-Agent |
| `http.content_type contains "json"` | JSON içerik |
| `http.authorization` | Auth header var |
| `http.authorization` | Auth header varsa |
| `http contains "password"` | Body'de şifre |
| `http contains "admin"` | Admin geçiyor |
| `http.file_data` | File data var |
| `http.file_data contains "user"` | File data'da kullanıcı |
| `http.cookie` | Cookie var |

## DNS Filtreleri

| Filtre | Açıklama |
|--------|----------|
| `dns` | Tüm DNS |
| `dns.flags.response == 0` | Query (soru) |
| `dns.flags.response == 1` | Response (cevap) |
| `dns.qry.name == "example.com"` | Belirli domain |
| `dns.qry.name contains "example"` | Domain içeren |
| `dns.qry.type == 1` | A kaydı |
| `dns.qry.type == 28` | AAAA kaydı |
| `dns.qry.type == 5` | CNAME |
| `dns.qry.type == 15` | MX |
| `dns.qry.type == 2` | NS |
| `dns.qry.type == 6` | SOA |
| `dns.qry.type == 16` | TXT |
| `dns.flags.rcode == 0` | NoError |
| `dns.flags.rcode == 3` | NXDomain |
| `dns.a == 10.0.0.1` | Cevap IP'si |
| `dns.count.answers > 0` | Cevap var |
| `dns.id == 0x1234` | Transaction ID |
| `dns.qry.name matches "[A-Za-z0-9+/]{20,}"` | Base64 şüpheli domain (DNS exfil) |

## TLS/SSL Filtreleri

| Filtre | Açıklama |
|--------|----------|
| `tls` | Tüm TLS |
| `tls.record.content_type == 20` | ChangeCipherSpec |
| `tls.record.content_type == 21` | Alert |
| `tls.record.content_type == 22` | Handshake |
| `tls.record.content_type == 23` | Application Data |
| `tls.handshake.type == 1` | ClientHello |
| `tls.handshake.type == 2` | ServerHello |
| `tls.handshake.type == 4` | NewSessionTicket |
| `tls.handshake.type == 11` | Certificate |
| `tls.handshake.type == 12` | ServerKeyExchange |
| `tls.handshake.type == 14` | ServerHelloDone |
| `tls.handshake.type == 16` | ClientKeyExchange |
| `tls.handshake.extensions_server_name` | SNI |
| `tls.record.version == 0x0303` | TLS 1.2 |
| `tls.record.version == 0x0301` | TLS 1.0 |
| `tls.handshake.ciphersuite == 0x009D` | Belirli cipher suite |
| `tls.alert_message.level == 2` | TLS fatal alert |

## ICMP Filtreleri

| Filtre | Açıklama |
|--------|----------|
| `icmp` | Tüm ICMP |
| `icmp.type == 0` | Echo Reply |
| `icmp.type == 3` | Dest Unreachable |
| `icmp.type == 8` | Echo Request |
| `icmp.type == 11` | Time Exceeded |
| `icmp.type == 5` | Redirect |
| `icmp.code == 0` | Net unreachable |
| `icmp.code == 1` | Host unreachable |
| `icmp.code == 3` | Port unreachable |
| `icmp.ident == 0x1234` | ICMP identifier |
| `icmp.seq == 1` | Sequence number |

## ARP Filtreleri

| Filtre | Açıklama |
|--------|----------|
| `arp` | Tüm ARP |
| `arp.opcode == 1` | Request |
| `arp.opcode == 2` | Reply |
| `arp.src.proto_ipv4 == 10.0.0.1` | Kaynak IP |
| `arp.dst.proto_ipv4 == 10.0.0.1` | Hedef IP |
| `arp.src.hw_mac == aa:bb:cc:dd:ee:ff` | Kaynak MAC |
| `eth.dst == ff:ff:ff:ff:ff:ff` | Broadcast |
| `arp.duplicate-address-detected` | Duplicate IP tespiti |
| `arp.duplicate-address-frame` | Duplicate frame |

## DHCP Filtreleri

| Filtre | Açıklama |
|--------|----------|
| `dhcp` | Tüm DHCP |
| `bootp` | BOOTP/DHCP |
| `dhcp.option.dhcp == 1` | Discover |
| `dhcp.option.dhcp == 2` | Offer |
| `dhcp.option.dhcp == 3` | Request |
| `dhcp.option.dhcp == 5` | ACK |
| `dhcp.option.dhcp == 6` | NAK |
| `dhcp.option.dhcp == 7` | Release |
| `dhcp.option.dhcp == 8` | Inform |
| `dhcp.option.requested_ip_address == 10.0.0.1` | İstenen IP |
| `dhcp.ip.your == 10.0.0.1` | Atanan IP |
| `dhcp.hw.addr == aa:bb:cc:dd:ee:ff` | İstemci MAC |
| `dhcp.option.dhcp_server_id == 10.0.0.1` | DHCP sunucu |
| `bootp.id == 0x1234` | Transaction ID |
| `ip.dst == 255.255.255.255` | DHCP broadcast |

## FTP Filtreleri

| Filtre | Açıklama |
|--------|----------|
| `ftp` | Tüm FTP |
| `ftp.request.command == "USER"` | Kullanıcı adı |
| `ftp.request.command == "PASS"` | Şifre |
| `ftp.request.command == "RETR"` | Dosya indirme |
| `ftp.request.command == "STOR"` | Dosya yükleme |
| `ftp.request.command == "LIST"` | Dizin listesi |
| `ftp.request.command == "CWD"` | Dizin değiştir |
| `ftp.request.command == "PASV"` | Passive mode |
| `ftp.request.command == "PORT"` | Active mode |
| `ftp.request.command == "SYST"` | Sistem bilgisi |
| `ftp.request.command == "PWD"` | Çalışma dizini |
| `ftp.request.command == "QUIT"` | Çıkış |
| `ftp.response.code == 220` | FTP karşılama |
| `ftp.response.code == 226` | Transfer tamam |
| `ftp.response.code == 227` | PASV port bilgisi |
| `ftp.response.code == 230` | Login başarılı |
| `ftp.response.code == 331` | Şifre gerekli |
| `ftp.response.code == 530` | Login başarısız |
| `ftp.request.arg contains "..."` | Komut argümanı |
| `ftp contains "password"` | Şifre geçiyor |
| `ftp-data` | FTP veri kanalı |

## Frame/Paket Filtreleri

| Filtre | Açıklama |
|--------|----------|
| `frame.len > 1500` | Büyük paketler |
| `frame.len < 64` | Küçük paketler |
| `frame.number == 42` | Belirli paket no |
| `frame.time_relative > 10` | 10sn sonra |
| `eth.addr == aa:bb:cc:dd:ee:ff` | MAC adresi |

## Güvenlik / Anomali Filtreleri

| Filtre | Açıklama |
|--------|----------|
| `tcp.flags.syn == 1 && tcp.flags.ack == 0 && tcp.flags.reset == 0` | SYN scan |
| `tcp.analysis.flags` | TCP sorunlari |
| `tcp.flags.reset == 1` | RST (bağlantı reddi) |
| `ip.ttl < 5` | Çok düşük TTL (suspicious) |
| `dns.qry.name.len > 30` | Uzun domain (DNS exfil?) |
| `http.request.uri contains ".."` | Directory traversal |
| `http.request.uri contains "%27"` | SQL injection |
| `http.request.uri contains "UNION"` | SQL UNION injection |
| `http.request.uri contains "SELECT"` | SQL SELECT injection |
| `http.request.uri contains "<script>"` | XSS |
| `http.request.uri contains "javascript:"` | XSS (javascript URI) |
| `http.request.uri contains "../"` | Path traversal |
| `http.request.uri contains "..%2f"` | Encoded path traversal |
| `http.request.uri contains ";"` | Command injection |
| `http.request.uri contains "\|"` | Command injection (pipe) |
| `http.user_agent matches "(?i)(nikto\|sqlmap\|nmap\|dirbuster\|metasploit)"` | Attack tool |
| `http.response.code == 200 && http.content_type contains "json" && http contains "error"` | API hatası |
| `frame contains "password"` | Herhangi bir katmanda şifre |
| `frame contains "secret"` | Herhangi bir katmanda gizli |
| `frame contains "flag{"` | CTF flag |
| `tcp.dstport == 9050 \|\| tcp.dstport == 9051` | Tor bağlantısı |
| `eth.dst == ff:ff:ff:ff:ff:ff && !arp && !dhcp` | ARP/DHCP dışı broadcast |

## Capture Filter (BPF) Syntax

> **DİKKAT:** Capture filter Display filter'dan FARKLIDIR!

| Filtre | Açıklama |
|--------|----------|
| `host 10.0.0.1` | Bu IP ile ilgili |
| `src host 10.0.0.1` | Kaynak IP |
| `dst host 10.0.0.1` | Hedef IP |
| `port 80` | Port 80 |
| `tcp port 80` | TCP port 80 |
| `udp port 53` | UDP port 53 |
| `host 10.0.0.1 and tcp port 80` | Kombinasyon |
| `not port 22` | SSH hariç |
| `net 10.0.0.0/24` | Subnet |
| `icmp` | Sadece ICMP |
| `arp` | Sadece ARP |
| `tcp[tcpflags] & tcp-syn != 0` | SYN set |

## tshark CLI Komutları

### Temel Kullanım

| Komut | Açıklama |
|-------|----------|
| `tshark -r file.pcap` | Pcap dosyasını oku |
| `tshark -r file.pcap -c 10` | İlk 10 paketi göster |
| `tshark -r file.pcap -V` | Detaylı çıktı (3 panel gibi) |
| `tshark -r file.pcap -O http` | Sadece HTTP detayını göster |

### Filtreleme

| Komut | Açıklama |
|-------|----------|
| `tshark -r f.pcap -Y "http.request"` | Display filter uygula |
| `tshark -i eth0 -f "tcp port 80"` | Capture filter (BPF) ile yakala |
| `tshark -r f.pcap -Y 'http.request.method == "POST"'` | POST istekleri |

### Alan Çıkarma

| Komut | Açıklama |
|-------|----------|
| `tshark -r f.pcap -T fields -e ip.src -e ip.dst` | Kaynak ve hedef IP |
| `tshark -r f.pcap -Y "dns" -T fields -e dns.qry.name` | DNS sorgu isimleri |
| `tshark -r f.pcap -Y "tcp.flags.syn==1" -T fields -e tcp.flags` | TCP bayrakları |

### İstatistikler

| Komut | Açıklama |
|-------|----------|
| `tshark -r f.pcap -q -z io,phs` | Protocol Hierarchy Statistics |
| `tshark -r f.pcap -q -z conv,tcp` | TCP Conversations |
| `tshark -r f.pcap -q -z endpoints,ip` | IP Endpoints |
| `tshark -r f.pcap -q -z expert` | Expert Info (Chat/Note/Warn/Error) |
| `tshark -r f.pcap -q -z http,tree` | HTTP istatistikleri |
| `tshark -r f.pcap -q -z follow,tcp,ascii,0` | TCP Stream 0'ı oku |

### Export ve Yazma

| Komut | Açıklama |
|-------|----------|
| `tshark -r in.pcap -Y "http" -w http.pcap` | Filtrelenmiş pcap yaz |
| `tshark -r f.pcap --export-objects http,/tmp/out` | HTTP objelerini export et |

### Otomasyon Örnekleri

```sh
# Tüm pcap'lerde POST bul
for f in shared/pcaps/*.pcap; do
  count=$(tshark -r "$f" -Y 'http.request.method == "POST"' \
    -T fields -e frame.number 2>/dev/null | wc -l)
  [ "$count" -gt 0 ] && echo "$f: $count POST"
done

# Tekil IP listesi
tshark -r f.pcap -T fields -e ip.src -e ip.dst | tr '\t' '\n' | sort -u

# SYN flood tespiti
tshark -r f.pcap -Y "tcp.flags.syn==1 && tcp.flags.ack==0" \
  -T fields -e ip.src | sort | uniq -c | sort -rn
```

### shark-tank.lua Hızlı Kullanım

Repo'nun Lua analitik motoru — tek komutla tam bulgu raporu (bkz. Modül 29):

| Komut | Ne yapar |
|-------|----------|
| `./scripts/shark-tank.sh <pcap>` | Pcap'in yanına kill-chain sıralı `.md` bulgu raporu yazar |
| `./scripts/shark-tank.sh <dizin>` | Dizindeki her pcap için rapor + `campaign.md` (ortak IOC) |
| `SHARK_TANK_JSON=1 ./scripts/shark-tank.sh <pcap>` | Yanına `.json` IOC çıktısı (SIEM'e) |
| `tshark -q -X lua_script:shared/shark-tank.lua -r <pcap>` | Betiksiz, doğrudan tshark ile |
| `make test-sharktank` | Regresyon testi (12 kontrol) |

Wireshark GUI: script Lua eklenti dizinine kopyalanırsa **Tools > Shark-Tank > Rapor Üret** menüsü eklenir.

---

> Modül listesine erişmek için [tıkla!](/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
