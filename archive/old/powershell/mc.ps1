$ARPTable = arp -a | ForEach-Object {
    if ($_ -match "(\d+\.\d+\.\d+\.\d+)\s+([\w-]+)") {
        $IPAddress = $matches[1]
        $MACAddress = $matches[2]
        $Vendor = $MACAddress.Substring(0, 8).Replace("-", ":") # OUI Lookup Required
        [PSCustomObject]@{
            IPAddress  = $IPAddress
            MACAddress = $MACAddress
            Vendor     = $Vendor # Perform OUI lookup externally
        }
    }
}
$ARPTable

