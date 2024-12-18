# Function to retrieve the MAC address of a given IP
function Get-MACAddress {
    param (
        [string]$IPAddress
    )

    $ARPEntry = arp -a | Where-Object { $_ -match $IPAddress }
    if ($ARPEntry -match '(\d+\.\d+\.\d+\.\d+)\s+([a-fA-F0-9-]+)') {
        $MACAddress = $matches[2]
        Write-Output $MACAddress
    } else {
        Write-Output "MAC Address not found for $IPAddress."
    }
}

# Function to resolve the hostname of a given IP
function Get-Hostname {
    param (
        [string]$IPAddress
    )

    try {
        [System.Net.Dns]::GetHostEntry($IPAddress).HostName
    } catch {
        "Hostname not found for $IPAddress."
    }
}

# Function to test connectivity to an IP
function Test-Connectivity {
    param (
        [string]$IPAddress
    )

    Test-Connection -ComputerName $IPAddress -Count 4 | Select-Object Address, ResponseTime
}

# Function to scan open ports on a given IP
function Get-OpenPorts {
    param (
        [string]$IPAddress,
        [int[]]$Ports = @(22, 80, 443, 3389) # Default ports to scan
    )

    foreach ($Port in $Ports) {
        $Socket = New-Object Net.Sockets.TcpClient
        try {
            $Socket.Connect($IPAddress, $Port)
            [PSCustomObject]@{ Port = $Port; Status = "Open" }
        } catch {
            [PSCustomObject]@{ Port = $Port; Status = "Closed" }
        } finally {
            $Socket.Dispose()
        }
    }
}

# Function to determine OS based on TTL
function Get-OSFromTTL {
    param (
        [string]$IPAddress
    )

    $PingResult = Test-Connection -ComputerName $IPAddress -Count 1
    $TTL = $PingResult | Select-Object -ExpandProperty ResponseTimeToLive
    switch ($TTL) {
        { $_ -eq 64 } { "Linux/Unix-based OS" }
        { $_ -eq 128 } { "Windows-based OS" }
        { $_ -eq 255 } { "Network Device or Router" }
        default { "Unknown OS (TTL=$TTL)" }
    }
}

# Function to query SNMP for device information
function Get-SNMPInfo {
    param (
        [string]$IPAddress,
        [string]$Community = "public"
    )

    try {
        Import-Module PowerSNMP
        Get-SnmpData -IpAddress $IPAddress -Community $Community -OID "1.3.6.1.2.1.1.1.0"
    } catch {
        "SNMP query failed for $IPAddress."
    }
}

function Get-ARPEntry {
    param (
        [string]$IPAddress
    )

    # Locate the ARP entry for the given IP
    $ARPEntry = arp -a | Where-Object { $_ -match "^\s*$IPAddress\s+" }

    if ($ARPEntry) {
        # Extract Interface and Dynamic/Static Information
        if ($ARPEntry -match "(\d+\.\d+\.\d+\.\d+)\s+([\w-]+)\s+(dynamic|static)") {
            $Interface = $matches[2]
            $Type = $matches[3]
            Write-Output "$Type"
        } else {
            Write-Output "Entry found but details could not be parsed for $IPAddress."
        }
    } else {
        Write-Output "No ARP entry found for $IPAddress. Attempting to ping to populate ARP table..."
        Test-Connection -ComputerName $IPAddress -Count 1 | Out-Null
        # Re-check ARP table after pinging
        $ARPEntry = arp -a | Where-Object { $_ -match "^\s*$IPAddress\s+" }
        if ($ARPEntry -match "(\d+\.\d+\.\d+\.\d+)\s+([\w-]+)\s+(dynamic|static)") {
            $Interface = $matches[2]
            $Type = $matches[3]
           Write-Output "$Type"
        } else {
            Write-Output "Still no ARP entry found for $IPAddress."
        }
    }
}




function Master-Retrieve {
	param (
        [string]$IPAddress
    )

	$MAC = Get-MACAddress -IPAddress $IPAddress
	Write-Output "MAC Address: $MAC"

	$HostName = Get-Hostname -IPAddress $IPAddress
	Write-Output "Hostname: $HostName"

	Get-OpenPorts -IPAddress $IPAddress -Ports @(22, 80, 443)

	$OS = Get-OSFromTTL -IPAddress $IPAddress
	Write-Output "Detected OS: $OS"

	$ARPEntry = Get-ARPEntry -IPAddress $IPAddress
	Write-Output "ARP type: $ARPEntry"

}

Master-Retrieve 10.0.0.48