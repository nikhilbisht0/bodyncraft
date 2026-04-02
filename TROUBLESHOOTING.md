# n8n Workflow Troubleshooting Guide

Common errors and solutions.

---

## Execution Errors

### "Error: Cannot read property 'json' of undefined"

**Cause**: Code node expects data from previous nodes but didn't receive it.

**Fix**:
- Check webhook payload structure matches expected fields
- Add debugging: in "Prepare Email" code node, add `console.log('Webhook data:', $input.all())`
- Ensure "Get User Email" node returns data (check if user exists)

---

### "Error: Request failed with status code 404" (Google Sheets)

**Cause**: Sheet not found or wrong ID.

**Fix**:
- Verify `GOOGLE_SHEET_ID` variable is correct
- Check variable is enabled and spelled correctly
- Or hardcode sheet ID in node: change `"type": "variable"` to `"type": "string"` and paste ID
- Ensure sheet exists and is accessible

---

### "Error: Insufficient Permission" (Google Sheets)

**Cause**: Credential doesn't have access to the sheet.

**Fix**:
- Share the Google Sheet with the Google account used for OAuth
- Check OAuth consent screen permissions include Google Sheets API
- Re-authenticate credential in n8n (edit → reconnect)

---

### "Error: Invalid Credentials" (Supabase)

**Cause**: Wrong or missing API key.

**Fix**:
- Use **Service Role Key**, not anon key
- Service Role Key format: `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (very long, starts with eyJ)
- Add quotes: `Bearer eyJhbGci...` (Bearer token)
- In "Get User Email" node, ensure header key = "Authorization", value = `Bearer {{ $vars.SUPABASE_SERVICE_ROLE_KEY }}`

---

### "Error: Invalid login" (Email/SMTP)

**Cause**: Bad credentials.

**Fix**:
- **Gmail**: Use App Password, not your regular password. Enable 2FA first.
- **SendGrid**: Use API Key as password
- Check SMTP host/port settings
- Verify username is full email address

---

### "Webhook returned 404 Not Found"

**Cause**: n8n not receiving the webhook request.

**Fix**:
1. Workflow must be **activated** (top-right toggle ON)
2. Webhook path must be exactly `/bodyncraft/workout-complete`
   - In n8n.cloud, the full URL usually includes `/webhook-test/` prefix
3. n8n instance must be running and accessible
4. Check Bodyncraft app `.env`: `VITE_N8N_WEBHOOK_URL` is correct
5. In browser devtools → Network tab, check the POST request to n8n:
   - Status should be 200 or 204
   - Response should not be 404
6. If running n8n locally, use ngrok to expose it to internet: `ngrok http 5678`

---

### "Workflow execution stuck / no response"

**Cause**: Node is stuck waiting for response.

**Fix**:
- Check if Supabase URL is correct and reachable
- Increase timeout in HTTP Request node (Settings → Options → Timeout)
- Check n8n workflow "Test" tab for detailed error logs

---

### "No data in Google Sheet"

**Cause**: Append failed silently or wrong column mapping.

**Fix**:
1. Check execution log for Google Sheets node:
   - Success: "Appended 1 row(s)"
   - Error: "Column headers don't match"
2. Verify sheet has correct headers in **Row 1**:
   ```
   Date | User Email | Exercise | XP Earned | Body Part | User ID
   ```
3. Ensure no extra spaces in headers
4. Google Sheets node → Preview mapping → See what data is being sent
5. Google Sheets node → "Append" operation should add to bottom, not overwrite

---

### "Email not received"

**Cause**: Email blocked, spam, or SMTP failure.

**Fix**:
1. Check n8n execution log: Did "Send Email" node succeed?
   - Success: "Email sent successfully"
   - Error: Check SMTP credentials
2. Check spam/junk folder
3. Verify recipient email address (`{{ $json.email }}`) is correct
4. Check sender email (SMTP account) hasn't exceeded sending limits
5. For Gmail: Check "Sent" folder to see if email was sent from your account

---

### "Webhook not seen in n8n"

**Cause**: n8n not reachable or workflow not active.

**Fix**:
1. Open your n8n URL (e.g., https://nikhill1.app.n8n.cloud)
2. Check if workflow shows as "Active" (green dot)
3. Click workflow → Click "Executions" (bell icon) → See if any executions recorded
4. If no executions: webhook never reached n8n
5. Test webhook directly with curl or test script:
   ```bash
   curl -X POST https://your-n8n/webhook/bodyncraft/workout-complete \
     -H "Content-Type: application/json" \
     -d '{"user_id":"test","exercise_name":"test","xp_earned":10}'
   ```
6. If curl returns 404: path mismatch or workflow inactive
7. If curl hangs: n8n instance down

---

## Data Issues

### "User Email is blank"

**Cause**: Supabase lookup failed or user doesn't exist.

**Fix**:
- Verify `user_id` sent from Bodyncraft matches a user in your `users` table
- In n8n, test "Get User Email" node manually with a valid `user_id`
- Check Supabase table structure: should have columns `id` (UUID) and `email`
- The HTTP request uses: `?select=email,id&eq=user_id,={{ $json.user_id }}`
  - This means looking for a row where `user_id` equals the sent `user_id`
  - If your column is named differently (e.g., `id` instead of `user_id`), adjust the query

---

### "Date format is wrong in Google Sheet"

**Cause**: Google Sheets doesn't recognize ISO string as date.

**Fix** (optional):
- Change date format in "Append to Google Sheets" node:
  ```
  Date: "={{ $now.toLocaleDateString('en-US') }} {{ $now.toLocaleTimeString('en-US') }}"
  ```
- Or format date in Code node before appending
- Google Sheets will auto-format ISO strings if cell format is set to "Automatic" or "Date"

---

### "All columns shifted / misaligned"

**Cause**: Column headers in sheet don't match mapping exactly.

**Fix**:
1. Ensure Row 1 of "Workouts" sheet has EXACT headers (case-sensitive):
   - Date
   - User Email
   - Exercise
   - XP Earned
   - Body Part
   - User ID
2. No extra spaces before/after header names
3. Check Google Sheets node mapping matches these names exactly

---

## n8n Cloud Issues

### "Execution limit exceeded"

**Cause**: n8n.cloud free tier has limited executions per month.

**Fix**:
- Upgrade to paid plan
- Deploy n8n self-hosted (Docker, Railway, Render)
- Optimize workflow to reduce executions

---

### "Workflow deactivated after some time"

**Cause**: n8n.cloud free tier auto-deactivates inactive workflows.

**Fix**:
- Keep workflow active by ensuring regular triggers
- Upgrade to paid plan
- Deploy self-hosted

---

## Debugging Tips

1. **Check each node individually**:
   - Click on a node → Click "Execute node" (play button)
   - See output/error immediately

2. **Add a Code node for debugging**:
   ```javascript
   console.log('Input data:', JSON.stringify($input.all(), null, 2));
   return $input.all();
   ```

3. **View full execution**:
   - After workflow runs, click execution in "Executions" panel
   - Click "View" → See data at each step

4. **Check n8n logs**:
   - Docker: `docker logs n8n`
   - Self-hosted: Check PM2/systemd logs
   - n8n.cloud: View in web UI

5. **Test webhook externally**:
   - Use the test scripts provided: `test_n8n_webhook.bat` or `.ps1`
   - Use Postman to send manual POST

---

## Quick Diagnostics

Run this in n8n "Code" node to dump everything:

```javascript
// Debug node - dump all incoming data
console.log('=== DEBUG START ===');
console.log('Input items:', JSON.stringify($input.all(), null, 2));
console.log('Number of items:', $input.all().length);
console.log('First item JSON:', JSON.stringify($input.first()?.json, null, 2));
console.log('Last item JSON:', JSON.stringify($input.last()?.json, null, 2));
console.log('Environment variables:', JSON.stringify($vars, null, 2));
console.log('=== DEBUG END ===');

// Return data to see what flows to next node
return $input.all();
```

---

## Still Stuck?

1. **Share the exact error message** from n8n execution log
2. **Screenshot** of your workflow node configurations
3. **Show execution data**: Click execution → View → Copy raw JSON
4. **Check n8n community**: https://community.n8n.io/

---

## Common Error Messages Reference

| Error Message | Likely Cause | Quick Fix |
|---------------|--------------|-----------|
| `Cannot read property` | Missing data from previous node | Check webhook payload |
| `404 Not Found` | Wrong sheet ID or sheet doesn't exist | Verify Google Sheet ID |
| `Insufficient Permission` | Credential lacks access | Share sheet with service account |
| `Invalid Credentials` | Bad API key or OAuth token | Reconnect credential in n8n |
| `EAI_AGAIN` | DNS/network issue | Check n8n instance is running |
| `ECONNREFUSED` | n8n not running or wrong URL | Start n8n or check URL |
| `timeout` | Request too slow | Increase timeout in node settings |
| `Column not found` | Header mismatch | Check sheet headers exactly |
| `401 Unauthorized` | Bad auth header | Check Bearer token format |

---

## Performance Tips

- Keep workflow simple: avoid unnecessary nodes
- Use "Split In Branches" instead of sequential execution for parallel paths
- Set reasonable timeouts (30s default)
- Monitor execution times in n8n dashboard
- Self-host if hitting rate limits

---

## Security Checklist

- [ ] Google Sheets credential uses OAuth2 (not service account with full access)
- [ ] Supabase Service Role Key stored in n8n variables (not hardcoded)
- [ ] Google Sheet shared only with necessary accounts
- [ ] n8n instance uses HTTPS (never expose without SSL)
- [ ] Webhook URL not publicly documented (use obscure path)
- [ ] n8n instance behind authentication (password or SSO)
- [ ] Regularly rotate credentials

---

**Last updated**: 2025-04-02
