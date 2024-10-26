function Get-Drives {
	param (
		[string]$Mode = "all",				# Mode parameter with default value "all"
		[int]$Index = -1,					# Index parameter for specific drive (default -1 means not used)
		[string]$Property = "DriveLetter"	# Property parameter to specify which property to return
	)

	# Get volume information
	$volumes = Get-Volume | Select-Object DriveLetter, FileSystemLabel, DriveType, HealthStatus, OperationalStatus, SizeRemaining, Size

	# Display all drives if "all" mode is specified
	if ($Mode -eq "all") {
		for ($i = 0; $i -lt $volumes.Count; $i++) {
			$thisDrive = $volumes[$i]

			# Make sure the drive isn't the system reserve
			if ($thisDrive.FileSystemLabel -ne "System Reserved") {
				$driveName = $thisDrive.FileSystemLabel

				# Set default names for specific drives
				if ($driveName -eq "" -and $thisDrive.DriveLetter -eq "C") {
					$driveName = "Local Disk"
				} elseif ($driveName -eq "" -and $thisDrive.DriveType -eq "CD-ROM") {
					$driveName = "CD-ROM"
				}

				$driveTitle = "($($thisDrive.DriveLetter):\) - $($driveName)"
				Write-Host $driveTitle
			}
		}
	}
	# Display specific drive property if mode is not "all"
	elseif ($Index -ge 0 -and $Index -lt $volumes.Count) {
		$selectedDrive = $volumes[$Index]
		
		# Validate and output requested property
		if ($selectedDrive.PSObject.Properties[$Property]) {
			return $selectedDrive.$Property
		} else {
			Write-Host "Property '$Property' not found on the drive object."
		}
	}
	else {
		Write-Host "Invalid parameters. Please check the drive index and property."
	}
}

# Get-Drives -Mode "specific" -Index 0 -Property "HealthStatus"
