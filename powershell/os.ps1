$IPAddress = "10.0.0.63"

$PingResult = Test-Connection -ComputerName $IPAddress -Count 1
$TTL = $PingResult | Select-Object -ExpandProperty ResponseTimeToLive
Write-Output "TTL: $TTL (Potential OS)"