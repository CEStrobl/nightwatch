$IPAddress = "10.0.0.57"

# Install the PowerSNMP module
Install-Module -Name SNMP

# Example SNMP query (requires community string)
Get-SnmpData -IpAddress $IPAddress -Community "public" -OID "1.3.6.1.2.1.1.1.0"
