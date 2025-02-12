$ip = "10.0.0.53"
$hostname = "Unnamed Device"

try {
	$dnsName = Resolve-DnsName -Name $ip -ErrorAction Stop | Select-Object -ExpandProperty NameHost
	if ($dnsName) { $hostname = $dnsName }
} catch {}

try {
	$pingResult = (Test-Connection -ComputerName $ip -Count 1 -ErrorAction Stop).Address
	if ($pingResult -match "^[a-zA-Z]") { $hostname = $pingResult } # Ensures it's a valid hostname
} catch {}

try {
	$dnsEntry = [System.Net.Dns]::GetHostEntry($ip)
	if ($dnsEntry.HostName) { $hostname = $dnsEntry.HostName }
} catch {}

try {
	$nbtResult = nbtstat -A $ip | Select-String -Pattern "(\S+)\s+<00>" | ForEach-Object { $_.Matches.Groups[1].Value }
	if ($nbtResult) { $hostname = $nbtResult }
} catch {}

try {
	$nsLookupResult = nslookup $ip 2>$null | Select-String -Pattern "Name:\s+(\S+)" | ForEach-Object { $_.Matches.Groups[1].Value }
	if ($nsLookupResult) { $hostname = $nsLookupResult }
} catch {}

try {
	$adResult = Get-ADComputer -Filter {IPv4Address -eq $ip} | Select-Object -ExpandProperty DNSHostName
	if ($adResult) { $hostname = $adResult }
} catch {}

Write-Host "IP: $ip → Hostname: $hostname"
