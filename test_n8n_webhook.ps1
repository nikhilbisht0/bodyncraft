# Test script for n8n Bodyncraft Workout webhook (PowerShell)
# This simulates a workout completion event

param(
    [string]$WebhookUrl = "https://nikhill1.app.n8n.cloud/webhook-test/bodyncraft/workout-complete"
)

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Bodyncraft n8n Webhook Test" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Webhook URL: $WebhookUrl"
Write-Host ""

$Payload = @{
    user_id = "test-user-123"
    exercise_name = "Squats"
    xp_earned = 75
    body_part = "legs"
    date = "2025-04-02T10:30:00Z"
} | ConvertTo-Json

Write-Host "Payload:"
Write-Host $Payload
Write-Host ""
Write-Host "Sending request..."
Write-Host "------------------------------------------------"

try {
    $Response = Invoke-RestMethod -Uri $WebhookUrl -Method Post -Body $Payload -ContentType "application/json" -ErrorAction Stop
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "✅ SUCCESS: Request sent successfully" -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "Response:" $Response
} catch {
    $StatusCode = $_.Exception.Response.StatusCode.value__
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Red
    Write-Host "❌ FAILED: HTTP $StatusCode" -ForegroundColor Red
    Write-Host "==================================================" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Check n8n execution history"
Write-Host "2. Verify Google Sheet has new entry"
Write-Host "3. Check email inbox (if email node configured)"
Write-Host ""
Write-Host "To test with custom data, run:"
Write-Host "  .\test_n8n_webhook.ps1 -WebhookUrl 'your-webhook-url'"
pause
