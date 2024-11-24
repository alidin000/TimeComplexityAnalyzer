# Directories
$frontendDir = "./frontend"
$backendDir = "."

# Backend Command (Django)
$backendCmd = "python manage.py runserver"

# Frontend Command (React or Angular)
$frontendCmd = "npm start"

# Function to Kill a Process by Port
function Kill-ProcessByPort {
    param([int]$port)
    $processInfo = netstat -ano | ForEach-Object {
        if ($_ -match ":\s*$port\s+.*LISTENING") {
            ($_ -split '\s+')[-1]
        }
    }
    if ($processInfo) {
        try {
            Stop-Process -Id $processInfo -Force
            Write-Host "Terminated process on port $port (PID: $processInfo)." -ForegroundColor Green
        } catch {
            Write-Host "Failed to terminate process on port $port (PID: $processInfo)." -ForegroundColor Red
        }
    } else {
        Write-Host "No process found on port $port." -ForegroundColor Yellow
    }
}

# Start Backend
try {
    Set-Location -Path $backendDir
    $backendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c $backendCmd" -NoNewWindow -PassThru
    Write-Host "Backend started (PID: $($backendProcess.Id))." -ForegroundColor Green
} catch {
    Write-Host "Error: Failed to start backend." -ForegroundColor Red
    exit 1
}

# Start Frontend
try {
    Set-Location -Path $frontendDir
    $frontendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c $frontendCmd" -NoNewWindow -PassThru
    Write-Host "Frontend started (PID: $($frontendProcess.Id))." -ForegroundColor Green
} catch {
    Write-Host "Error: Failed to start frontend." -ForegroundColor Red
    Stop-Process -Id $backendProcess.Id -Force
    Kill-ProcessByPort -port 8000
    exit 1
}

Write-Host "Both backend and frontend are running." -ForegroundColor Cyan

# Wait for user input to stop
Write-Host "Press any key to stop the processes." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop Backend and Frontend
Kill-ProcessByPort -port 8000
Kill-ProcessByPort -port 3000
Write-Host "Processes stopped successfully." -ForegroundColor Green
