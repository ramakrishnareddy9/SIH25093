# Stop any running Node.js processes
Write-Host "Stopping any running Node.js processes..."
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# Kill process on port 5000 if it exists
$portProcess = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($portProcess) {
    Write-Host "Stopping process on port 5000 (PID: $($portProcess.OwningProcess))..."
    Stop-Process -Id $portProcess.OwningProcess -Force -ErrorAction SilentlyContinue
}

# Start the server on port 5005
Write-Host "Starting server on port 5005..."
$env:PORT="5005"
node src/index.js
