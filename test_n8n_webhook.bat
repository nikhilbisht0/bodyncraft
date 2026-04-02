@echo off
REM Test script for n8n Bodyncraft Workout webhook (Windows Batch)
REM This simulates a workout completion event

setlocal enabledelayedexpansion

REM Set webhook URL (default or from argument)
if "%1"=="" (
    set WEBHOOK_URL=https://nikhill1.app.n8n.cloud/webhook-test/bodyncraft/workout-complete
) else (
    set WEBHOOK_URL=%1
)

echo ================================================
echo Bodyncraft n8n Webhook Test
echo ================================================
echo Webhook URL: %WEBHOOK_URL%
echo.

REM Create payload file
set PAYLOAD_FILE=%TEMP%\n8n_test_payload.json
echo { > "%PAYLOAD_FILE%"
echo   "user_id": "test-user-123", >> "%PAYLOAD_FILE%"
echo   "exercise_name": "Squats", >> "%PAYLOAD_FILE%"
echo   "xp_earned": 75, >> "%PAYLOAD_FILE%"
echo   "body_part": "legs", >> "%PAYLOAD_FILE%"
echo   "date": "2025-04-02T10:30:00Z" >> "%PAYLOAD_FILE%"
echo } >> "%PAYLOAD_FILE%"

echo Payload:
type "%PAYLOAD_FILE%"
echo.
echo Sending request...
echo -------------------------------------------------

REM Send POST request using curl (must be installed, e.g., Git Bash)
curl -s -w "\nHTTP_STATUS:%%{http_code}" ^
  -X POST "%WEBHOOK_URL%" ^
  -H "Content-Type: application/json" ^
  -d "@%PAYLOAD_FILE%"

echo.
echo ================================================
echo Check n8n execution history to see if workflow triggered
echo ================================================
pause
