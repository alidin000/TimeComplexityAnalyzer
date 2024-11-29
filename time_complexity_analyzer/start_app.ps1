# Directories
$frontendDir = "./frontend"
$backendDir = "."

# Backend Commands (Django)
$backendMigrateCmd = "python manage.py migrate"
$backendRunserverCmd = "python manage.py runserver"

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

# Run Django Migrations
try {
    Set-Location -Path $backendDir
    Write-Host "Running Django migrations..." -ForegroundColor Cyan
    & cmd.exe /c $backendMigrateCmd
    if ($LASTEXITCODE -ne 0) {
        throw "Migration failed."
    }
    Write-Host "Django migrations completed successfully." -ForegroundColor Green
} catch {
    Write-Host "Error: Failed to run Django migrations." -ForegroundColor Red
    exit 1
}

# Start Backend
try {
    Write-Host "Starting backend server..." -ForegroundColor Cyan
    $backendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c $backendRunserverCmd" -NoNewWindow -PassThru
    Write-Host "Backend started (PID: $($backendProcess.Id))." -ForegroundColor Green
} catch {
    Write-Host "Error: Failed to start backend." -ForegroundColor Red
    exit 1
}

# Start Frontend
try {
    Set-Location -Path $frontendDir
    Write-Host "Starting frontend server..." -ForegroundColor Cyan
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
