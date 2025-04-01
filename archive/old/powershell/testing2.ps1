# Gather ARP table entries
$ARPTable = arp -a | ForEach-Object {
    if ($_ -match '(\d+\.\d+\.\d+\.\d+)') {
        $matches[1]
    }
}

$Results = @()

# Record the start time before execution
$startTime = Get-Date

foreach ($IP in $ARPTable) {
    $thisTime = Get-Date
    $elapsed = ($thisTime - $startTime).ToString("hh\:mm\:ss")
    
    if (Test-Connection -ComputerName $IP -Count 1 -Quiet) {
        try {
            $HostName = [System.Net.Dns]::GetHostEntry($IP).HostName
        } catch {
            try {
                $HostName = (Resolve-DnsName -Name $IP -ErrorAction Stop).NameHost
            } catch {
                $HostName = "Unavailable"
            }
        }
        $Results += [PSCustomObject]@{ IPAddress = $IP; Status = "Online"; Host = $HostName }
        Write-Host "$elapsed [ + ] $IP is online; Host: $HostName"
    } else {
        $Results += [PSCustomObject]@{ IPAddress = $IP; Status = "Offline"; Host = "" }
        Write-Host "$elapsed   -   $IP is offline"
    }
}

# Record the end time after execution
$endTime = Get-Date

# Calculate the elapsed time
$executionDuration = $endTime - $startTime

# Output the execution time in seconds
Write-Output "Execution Time: $($executionDuration.TotalSeconds) seconds"

# Export to CSV
$Results | Export-Csv -Path "PingSweepResults.csv" -NoTypeInformation
