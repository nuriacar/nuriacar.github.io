---
layout: post
title:  "shark-tank - ref3: Ağ Diyagramı"
date:   2026-07-17 12:00:00 +0000
tags: [siber-guvenlik]
---
## Genel Görünüm

```text
+==================================================================+
|                    Shark-Tank LABORATUVAR AĞI                    |
|          172.50.2.0/24 (Bridge) + 172.50.9.0/24 (DHCP)           |
|                 Gateway: 172.50.2.1 / 172.50.9.1                 |
+==================================================================+

  +------------+  +------------+  +------------+  +------------+
  | WEB SERVER |  | DNS SERVER |  |  TCP ECHO  |  |    SMTP    |
  |   nginx    |  |  CoreDNS   |  |   socat    |  |  Mailpit   |
  |172.50.2.10 |  |172.50.2.11 |  |172.50.2.12 |  |172.50.2.16 |
  |  :80 HTTP  |  |:53 UDP/TCP |  | :8080 TCP  |  | :1025 SMTP |
  +-----+------+  +-----+------+  +-----+------+  +-----+------+
        |               |               |               |
  +------------+  +------------+  +------------+  +------------+
  |   HTTPS    |  |ICMP TARGET |  | FTP SERVER |  |    IMAP    |
  | nginx+SSL  |  |   Alpine   |  |   vsftpd   |  |  Dovecot   |
  |172.50.2.13 |  |172.50.2.14 |  |172.50.2.15 |  |172.50.2.18 |
  |  :443 TLS  |  |Ping hedefi |  |  :21 FTP   |  |:110/143/587|
  +-----+------+  +-----+------+  +-----+------+  +-----+------+
        |               |               |               |
  +------------+  +------------+  +------------+  +-----+------+
  |    OCSP    |  |  UDP ECHO  |  |    VOIP    |  |DHCP SERVER |
  |mini-CA Root|  |   socat    |  |  SIP/RTP   |  |   dhcpd    |
  |172.50.2.19 |  |172.50.2.17 |  |172.50.2.22 |  | 172.50.9.2 |
  |:9080 HTTP  |  | :9090 UDP  |  | :5060 UDP  |  |  :67 UDP   |
  +-----+------+  +-----+------+  +-----+------+  +-----+------+
        |               |               |               |
        +-------+-------+--------+------+---------------+
                |                |                      |
  +-------------+-----+  +-------+-------+       +------+------+
  |      CLIENT       |  |   ATTACKER    |       | DHCP CLIENT |
  |   172.50.2.100    |  | 172.50.2.200  |       |(dynamic IP) |
  |                   |  |               |       | 172.50.9.x  |
  | curl, dig, drill, |  |   nmap, nc,   |       +-------------+
  |  ping, tcpdump,   |  | curl, python3 |
  | nmap, nc, openssl |  |  Port scan,   |
  |                   |  |  SYN flood,   |
  |   Pcap: /pcaps/   |  |  Brute force  |
  +-------------------+  +---------------+

  +------------------+
  |      AD DC       |
  |      Samba       |
  |  172.50.2.20     |
  | 88/389/636/445   |
  +------------------+
```

## Trafik Akışları

### HTTP Akışı
```text
CLIENT (.100) ---- GET / ----------> WEB (.10:80)
CLIENT (.100) <--- 200 OK HTML ----- WEB (.10:80)
```

### DNS Akışı
```text
CLIENT (.100) ---- Query: web.shark-tank.local A --> DNS (.11:53)
CLIENT (.100) <--- Response: .10 ------------------- DNS (.11:53)
```

### TLS Akışı
```text
CLIENT (.100) ---- ClientHello ------> HTTPS (.13:443)
CLIENT (.100) <--- ServerHello ------- HTTPS (.13:443)
CLIENT (.100) <--- Certificate ------- HTTPS (.13:443)
CLIENT (.100) ---- ClientKeyExchange > HTTPS (.13:443)
CLIENT (.100) <=== Encrypted Data ==== HTTPS (.13:443)
```

### OCSP Akışı
```text
CLIENT (.100) ---- OCSP Request (HTTP POST, certID hash) --> OCSP (.19:9080)
CLIENT (.100) <--- OCSP Response: certStatus: good -------- OCSP (.19:9080)
                   (responder yanıtı 0x1002 sertifikasıyla imzalı)
```

### ICMP Akışı
```text
CLIENT (.100) ---- Echo Request ----> ICMP (.14)
CLIENT (.100) <--- Echo Reply ------- ICMP (.14)
```

### FTP Akışı
```text
CLIENT (.100) ---- TCP SYN ---------> FTP (.15:21)
CLIENT (.100) <--- SYN-ACK ---------- FTP (.15:21)
CLIENT (.100) ---- ACK -------------> FTP (.15:21)
CLIENT (.100) <--- 220 Welcome ------ FTP (.15:21)
CLIENT (.100) ---- USER ftpuser ----> FTP (.15:21)
CLIENT (.100) <--- 331 Password ----- FTP (.15:21)
CLIENT (.100) ---- PASS ftppass123 -> FTP (.15:21)
CLIENT (.100) <--- 230 Login OK ----- FTP (.15:21)
```

### SMTP / Email Akışı
```text
CLIENT (.100) ---- EHLO ------------------------------------> SMTP
CLIENT (.100) ---- MAIL FROM:<kullanici@shark-tank.local> --> SMTP
CLIENT (.100) ---- RCPT TO:<destek@shark-tank.local> -------> SMTP
CLIENT (.100) ---- DATA (email body) -----------------------> SMTP
CLIENT (.100) <--- 250 OK ----------------------------------- SMTP
```

### POP3 / IMAP Akışı
```text
CLIENT (.100) ---- USER kullanici ------------> POP3 (.18:110)
CLIENT (.100) ---- PASS secret123 ------------> POP3
CLIENT (.100) ---- STAT / LIST / RETR --------> POP3
CLIENT (.100) <--- +OK messages --------------- POP3

CLIENT (.100) ---- LOGIN kullanici -----------> IMAP (.18:143)
CLIENT (.100) ---- SELECT INBOX ---------------> IMAP
CLIENT (.100) ---- FETCH 1 BODY ---------------> IMAP
```

### SIP / VoIP Akışı
```text
CLIENT (.100) ---- REGISTER 1000 -----------> VOIP (.22:5060/UDP)
CLIENT (.100) <--- 200 OK ------------------- VOIP
CLIENT (.100) ---- INVITE 1000->1001 -------> VOIP
CLIENT (.100) <--- 180 Ringing / 200 OK ----- VOIP
CLIENT (.100) ==== RTP stream (ses) ========> VOIP
CLIENT (.100) ---- BYE ---------------------> VOIP
```

### UDP Echo Akışı
```text
CLIENT (.100) ---- UDP "test" -------------> UDP ECHO (.17:9090)
CLIENT (.100) <--- UDP "test" (echo) ------- UDP ECHO (.17:9090)
CLIENT (.100) ---- UDP kapalı port --------> UDP ECHO (.17:9999)
CLIENT (.100) <--- ICMP Port Unreachable --- UDP ECHO (.17)
```

### DHCP DORA Süreci
```text
DHCP CLIENT -- Discover (broadcast) --> DHCP SRV (.9.2:67)
DHCP CLIENT <-- Offer (IP teklifi) ---- DHCP SRV
DHCP CLIENT -- Request (kabul) -------> DHCP SRV
DHCP CLIENT <-- ACK (onay) ------------ DHCP SRV
```

### Kerberos Akışı
```text
CLIENT (.100) ---- AS-REQ (kinit) --------> AD DC (.20:88)
CLIENT (.100) <--- AS-REP (TGT) ----------- AD DC
CLIENT (.100) ---- TGS-REQ (cifs SPN) ----> AD DC
CLIENT (.100) <--- TGS-REP (servis bileti)  AD DC
```

### LDAP Akışı
```text
CLIENT (.100) ---- bind (simple, şifre!) -> AD DC (.20:389)
CLIENT (.100) ---- searchRequest ---------> AD DC
CLIENT (.100) <--- searchResEntry --------- AD DC
CLIENT (.100) ---- StartTLS / LDAPS ------> AD DC (.20:389/636)
```

### SMB2 Akışı
```text
CLIENT (.100) ---- Negotiate -------------> AD DC (.20:445)
CLIENT (.100) ---- Session Setup (bilet) -> AD DC
CLIENT (.100) ---- Tree Connect (share) --> AD DC
CLIENT (.100) ==== Read / Write (dosya) ==> AD DC
ATTACKER (.200) -- PASS (yanlış) ---------> AD DC
ATTACKER (.200) <-- LOGON_FAILURE --------- AD DC
```

### Attacker Akışı (Port Scan)
```text
ATTACKER (.200) ---- SYN :80 -------> WEB (.10)
ATTACKER (.200) <--- SYN-ACK -------- WEB (.10)   [OPEN]
ATTACKER (.200) ---- SYN :22 -------> WEB (.10)
ATTACKER (.200) <--- RST ------------ WEB (.10)   [CLOSED]
ATTACKER (.200) ---- SYN :443 ------> WEB (.10)
ATTACKER (.200) <--- RST ------------ WEB (.10)   [CLOSED]
```

## Port Matrisi

| Servis | 21 | 53 | 67 | 80 | 88 | 110 | 135 | 143 | 389 | 443 | 445 | 464 | 587 | 636 | 1025 | 5060 | 8080 | 9090 |
|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|
| Web (.10) | | | | **OPEN** | | | | | | | | | | | | | | |
| DNS (.11) | | **OPEN** | | | | | | | | | | | | | | | | |
| DHCP Server (.9.2) | | | **OPEN** | | | | | | | | | | | | | | | |
| TCP Echo (.12) | | | | | | | | | | | | | | | | | **OPEN** | |
| AD DC (.20) | | | | | **OPEN** | | **OPEN** | | **OPEN** | | **OPEN** | **OPEN** | | **OPEN** | | | | |
| HTTPS (.13) | | | | | | | | | | **OPEN** | | | | | | | | |
| FTP (.15) | **OPEN** | | | | | | | | | | | | | | | | | |
| SMTP (.16) | | | | | | | | | | | | | | | **OPEN** | | | |
| UDP Echo (.17) | | | | | | | | | | | | | | | | | | **OPEN** |
| IMAP (.18) | | | | | | **OPEN** | | **OPEN** | | | | | **OPEN** | | | | | |
| VoIP (.22) | | | | | | | | | | | | | | | | **OPEN** | | |

---

> Modül listesine erişmek için [tıkla!](/2026/07/15/shark-tank-ref1-rehber.html#modüller)
>
> Ya da hemen aşağıda bir önceki veya sonraki modüle götüren buton zaten var!
