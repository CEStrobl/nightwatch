

function Get-Drives {
	# Get volume information
	$volumes = Get-Volume | Select-Object DriveLetter, FileSystemLabel, DriveType, HealthStatus, OperationalStatus, SizeRemaining, Size

	for ($i = 0; $i -lt $volumes.Count; $i++) {

		$thisDrive = $volumes[$i];

		# make sure the drive isnt the system reserve
		if ($thisDrive.FileSystemLabel -ne "System Reserved") {

			$driveName = $thisDrive.FileSystemLabel;

			# If C has no name, change it to local disk
			if ($driveName -eq "" -and $thisDrive.DriveLetter -eq "C") {
				$driveName = "Local Disk"
			}

			# If file type is cd rom change its name
			if($driveName -eq "" -and $thisDrive.DriveType -eq "CD-ROM") {
				$driveName = "CD-ROM"
			}
			
			$driveTitle = "($($thisDrive.DriveLetter):\) - $($driveName)"
		
			Write-Host $driveTitle
		}


	}

}

Get-Drives

