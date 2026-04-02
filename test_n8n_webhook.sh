#!/bin/bash

# Test script for n8n Bodyncraft Workout webhook
# This simulates a workout completion event

# Configuration - UPDATE THESE
WEBHOOK_URL="${1:-https://nikhill1.app.n8n.cloud/webhook-test/bodyncraft/workout-complete}"

# Sample payload (matches what Bodyncraft sends)
PAYLOAD='{
  "user_id": "test-user-123",
  "exercise_name": "Squats",
  "xp_earned": 75,
  "body_part": "legs",
  "date": "2025-04-02T10:30:00Z"
}'

echo "================================================"
echo "Bodyncraft n8n Webhook Test"
echo "================================================"
echo "Webhook URL: $WEBHOOK_URL"
echo ""
echo "Payload:"
echo "$PAYLOAD | python -m json.tool 2>/dev/null || echo "$PAYLOAD""
echo ""
echo "Sending request..."
echo "------------------------------------------------"

# Send the POST request
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

# Parse response
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
RESPONSE_BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS:/d')

echo ""
echo "================================================"
echo "Response Status: $HTTP_STATUS"
echo "Response Body:"
echo "$RESPONSE_BODY" | python -m json.tool 2>/dev/null || echo "$RESPONSE_BODY"
echo "================================================"

# Interpret result
if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "201" ]; then
  echo "✅ SUCCESS: Webhook accepted (HTTP $HTTP_STATUS)"
  echo ""
  echo "Next steps:"
  echo "1. Check n8n execution history"
  echo "2. Verify Google Sheet has new entry"
  echo "3. Check email inbox (if email node configured)"
else
  echo "❌ FAILED: Webhook returned HTTP $HTTP_STATUS"
  echo ""
  echo "Troubleshooting:"
  echo "1. Check webhook URL is correct"
  echo "2. Verify n8n workflow is ACTIVE"
  echo "3. Check n8n instance is running"
  echo "4. Ensure webhook path is /bodyncraft/workout-complete"
fi

echo ""
echo "To test with custom data:"
echo "  ./test_n8n_webhook.sh <your-webhook-url>"
echo "Or set WEBHOOK_URL env var:"
echo "  WEBHOOK_URL=https://your.n8n.cloud/webhook/bodyncraft/workout-complete ./test_n8n_webhook.sh"
