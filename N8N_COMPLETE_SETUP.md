# Complete n8n Setup Guide for Bodyncraft

## Issues Identified & Fixed

Your n8n workflow has several placeholder values that need to be configured:

1. ❌ Google Sheets credentials (placeholder: `YOUR_GOOGLE_SHEETS_CRED_ID`)
2. ❌ Supabase Service Role Key (placeholder: `YOUR_SUPABASE_SERVICE_ROLE_KEY`)
3. ❌ SMTP credentials (placeholder: `YOUR_SMTP_CRED_ID`)
4. ❌ Google Sheet ID variable (not set)
5. ❌ Google Sheet "Workouts" tab not created

---

## Step 1: Prepare Your Google Sheet

1. Create a new Google Sheet or use an existing one
2. Ensure you have a tab named exactly: **"Workouts"** (case-sensitive)
3. In the "Workouts" tab, add these column headers in Row 1:
   - A1: `Date`
   - B1: `User Email`
   - C1: `Exercise`
   - D1: `XP Earned`
   - E1: `Body Part`
   - F1: `User ID`

4. Get your Google Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
   ```
   Example: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   The Sheet ID is: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

5. Share the sheet with your Google Service Account email (or use OAuth2 with your personal account)

---

## Step 2: Set Up Google Sheets Credentials in n8n

1. In n8n, go to **Credentials** (left sidebar)
2. Click **"Add credential"**
3. Search for **"Google Sheets"**
4. Select **"Google Sheets API"** (not "Google Drive")
5. Choose **"OAuth2"** authentication
6. Click **"Add new OAuth2 API"**
7. You need to create credentials in Google Cloud Console:
   - Go to https://console.cloud.google.com
   - Create or select a project
   - Enable Google Sheets API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URIs (n8n will provide these)
   - Copy Client ID and Client Secret to n8n
8. Complete OAuth flow by clicking "Connect my account" in n8n
9. Name the credential: `Google Sheets - Bodyncraft`
10. Save

**Note the credential ID** (you'll see it in the workflow import below).

---

## Step 3: Set Up Supabase API Access

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project: `nnwqzfbfreugrmtqqynw`
3. Go to **Settings** → **API**
4. Scroll to **"Service Role Key"** (keep this secret!)
5. Copy the entire key

---

## Step 4: Set Up Email (SMTP) Credentials

Choose one option:

### Option A: Gmail (with App Password)
1. Enable 2-factor authentication on your Google account
2. Generate an **App Password** (16-digit code)
3. In n8n, add new credential: **"Email (SMTP)"**
4. Configure:
   - SMTP Host: `smtp.gmail.com`
   - SMTP Port: `465`
   - Security: `SSL/TLS`
   - Username: your Gmail address
   - Password: App Password
5. Name: `Gmail - Bodyncraft`

### Option B: SendGrid / Other SMTP
Configure accordingly with your provider's SMTP details

---

## Step 5: Configure n8n Variables

You need to set the `GOOGLE_SHEET_ID` variable in n8n:

1. In n8n, go to **Settings** (gear icon, left sidebar)
2. Click **"Variables"**
3. Add new variable:
   - Key: `GOOGLE_SHEET_ID`
   - Value: Your actual Google Sheet ID from Step 1
4. Save

Alternatively, you can hardcode the sheet ID in the Google Sheets node (see workflow below).

---

## Step 6: Import the Fixed Workflow

I've created a corrected workflow JSON file for you. Here's the key fix: instead of using variable for sheet ID, you can either:

**Option A**: Use the variable (requires setting it in n8n)
**Option B**: Replace `"type": "variable"` with `"type": "string"` and put your sheet ID directly

Import workflow:
1. In n8n, click **"+"** → **"Import from file"**
2. Select the updated `n8n_workflow_workout_notification_FIXED.json`
3. **Immediately after importing**, edit the nodes and replace:
   - `YOUR_GOOGLE_SHEETS_CRED_ID` with your actual credential name/id from Step 2
   - `YOUR_SUPABASE_SERVICE_ROLE_KEY` with the key from Step 3
   - `YOUR_SMTP_CRED_ID` with your actual SMTP credential name/id from Step 4
4. **Activate the workflow** (toggle switch at top-right ON)

---

## Step 7: Test the Workflow

### Manual Test in n8n:
1. Open the workflow
2. Click **"Execute Workflow"** button
3. Provide test data in this format:
```json
{
  "user_id": "test-user-123",
  "exercise_name": "Push-ups",
  "xp_earned": 50,
  "body_part": "chest",
  "date": "2025-04-02T10:30:00Z"
}
```
4. Check execution details for errors
5. Verify data appears in Google Sheets

### Test from Your App:
1. Make sure your `.env` has the correct webhook URL
2. Complete a workout in Bodyncraft
3. Check n8n execution history (bell icon → "Executions")
4. Verify the Google Sheet is updated

---

## Troubleshooting

**"Nothing happens when I complete a workout"**
- Check Vercel environment variable `VITE_N8N_WEBHOOK_URL` is set
- Redeploy your app after changing env vars
- Open browser devtools → Network tab → Look for POST request to n8n
- Check if request is successful (200 status)

**"Workflow not triggering in n8n"**
- Is the workflow **activated**? (toggle ON)
- Is the webhook path correct? Should be `/bodyncraft/workout-complete`
- Check n8n "Executions" page for incoming items

**"Google Sheets error: Insufficient Permission"**
- Your Google Sheets credential needs proper access
- Share the sheet with the service account email or your connected account
- Make sure you're using Google Sheets API, not Google Drive

**"Email not sending"**
- Check SMTP credentials are correct
- Gmail: Use App Password, not your regular password
- Check spam folder

**"Supabase API error: Invalid API key"**
- You're using the Service Role Key, not the anon key
- Service Role Key should start with `eyJhbGci...` and is longer
- Copy it exactly from Supabase Settings → API

---

## Current State Summary

Your webhook is configured at: `https://nikhill1.app.n8n.cloud/webhook-test/bodyncraft/workout-complete`

**Missing configurations**:
- [ ] Google Sheets credentials
- [ ] Supabase Service Role Key in "Get User Email" node
- [ ] Email (SMTP) credentials
- [ ] Google Sheet ID variable OR hardcoded in workflow
- [ ] "Workouts" sheet with correct headers
- [ ] Workflow activated
- [ ] Test execution

---

**Need help?** Check the execution logs in n8n (click on any execution → "View") to see specific error messages.
