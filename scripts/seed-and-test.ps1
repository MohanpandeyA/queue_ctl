# ===============================================
# QueueCTL – End-to-End Test Script (Windows Safe)
# ===============================================
# Demonstrates the full job lifecycle:
# enqueue → process → DLQ → config.
# ===============================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ""
Write-Host "=== Starting QueueCTL End-to-End Test ===" -ForegroundColor Cyan

# --- Step 1: Clean old database -----------------------------
$DbPath = Join-Path $PSScriptRoot "..\queue.db"

if (Test-Path $DbPath) {
    Remove-Item $DbPath -Force
    Write-Host "Old database removed"
}
else {
    Write-Host "No previous database found, starting fresh"
}

# --- Step 2: Enqueue test jobs -------------------------------
Write-Host ""
Write-Host "Enqueuing test jobs..."
node .\scripts\enqueue-test.js

# --- Step 3: Initial queue summary ---------------------------
Write-Host ""
Write-Host "Initial Queue Status:"
node .\src\cli.js status

# --- Step 4: Start workers -----------------------------------
Write-Host ""
Write-Host "Starting 2 workers..."
$job = Start-Job { node .\src\cli.js worker start --count 2 | Out-Host }

# Allow workers time to process
Start-Sleep -Seconds 10

# --- Step 5: Queue summary after processing ------------------
Write-Host ""
Write-Host "Post-Processing Queue Status:"
node .\src\cli.js status

# --- Step 6: Dead Letter Queue -------------------------------
Write-Host ""
Write-Host "Dead Letter Queue:"
node .\src\cli.js dlq list

# --- Step 7: Current configuration ---------------------------
Write-Host ""
Write-Host "Current Config:"
node .\src\cli.js config get

Write-Host ""
Write-Host "=== Test Complete! (Press Ctrl+C to stop any active workers) ===" -ForegroundColor Green
