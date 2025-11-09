<#
  QueueCTL – End-to-End Test Script (PowerShell Edition)
  ------------------------------------------------------
  Demonstrates job enqueue, worker execution,
  retry/backoff, DLQ, and status/config checks.
#>

Write-Host "`n🧪 Starting QueueCTL End-to-End Test..." -ForegroundColor Cyan

# --- Step 1: Clean old database -----------------------------
$DbPath = Join-Path $PSScriptRoot "..\queue.db"
if (Test-Path $DbPath) {
    Remove-Item $DbPath -Force
    Write-Host "🧹 Old database removed"
}

# --- Step 2: Enqueue test jobs -------------------------------
Write-Host "`n📥 Enqueuing jobs..."
queuectl enqueue "{`"command`":`"echo Success Job`"}"
queuectl enqueue "{`"command`":`"timeout 2 && echo Delayed Job`"}"
queuectl enqueue "{`"command`":`"notarealcommand`", `"max_retries`":`"2`"}"

# --- Step 3: Initial queue summary ---------------------------
Write-Host "`n📊 Initial Queue Status:"
queuectl status

# --- Step 4: Start workers (runs in background) --------------
Write-Host "`n⚙️ Starting 2 workers..."
$job = Start-Job { queuectl worker start --count 2 | Out-Host }

# Wait for jobs to process
Start-Sleep -Seconds 10

# --- Step 5: Check current queue state -----------------------
Write-Host "`n📈 Post-Processing Queue Status:"
queuectl status

# --- Step 6: Show Dead Letter Queue --------------------------
Write-Host "`n💀 Dead Letter Queue:"
queuectl dlq list

# --- Step 7: Show Configuration ------------------------------
Write-Host "`n⚙️ Current Config:"
queuectl config get

Write-Host "`n✅ Test Complete! (Press Ctrl+C to stop any active workers)" -ForegroundColor Green
