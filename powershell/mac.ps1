$IPAddress = "10.0.0.57"
$MACAddress = arp -a | ForEach-Object {
    if ($_ -match "$IPAddress\s+([a-fA-F0-9-]+)") {
        $matches[1]
    }
}

if ($MACAddress) {
    Write-Output "MAC Address for $IPAddress is $MACAddress"
} else {
    Write-Output "No MAC Address found for $IPAddress in the ARP table."
}