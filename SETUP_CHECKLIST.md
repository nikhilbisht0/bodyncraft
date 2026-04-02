# n8n Setup Checklist ✅

Complete all steps in order. Check each item when done.

---

## 📋 Pre-Setup

- [ ] I have admin access to my n8n instance (localhost:5678 or n8n.cloud)
- [ ] I have a Google Sheet ready to receive data
- [ ] I have access to my Supabase project: `nnwqzfbfreugrmtqqynw`
- [ ] I have an email account (Gmail/SendGrid/etc.) for sending notifications

---

## Step 1: Google Sheet Setup

- [ ] Created a Google Sheet (or identified existing one)
- [ ] Added a tab named exactly: **Workouts**
- [ ] Added headers in Row 1: Date | User Email | Exercise | XP Earned | Body Part | User ID
- [ ] Copied the Google Sheet ID from the URL
- [ ] Shared the sheet (if using service account, shared with service account email)

---

## Step 2: n8n Variables

**In n8n Settings → Variables:**

- [ ] Added variable: `GOOGLE_SHEET_ID` = (your sheet ID)
- [ ] Added variable: `SUPABASE_SERVICE_ROLE_KEY` = (your Supabase service role key)

**OR** you will hardcode these values in the workflow nodes (not recommended for secrets)

---

## Step 3: Google Sheets Credentials

- [ ] Created Google Cloud Console project
- [ ] Enabled Google Sheets API
- [ ] Created OAuth 2.0 credentials (Web application)
- [ ] Added authorized redirect URIs from n8n
- [ ] Copied Client ID and Client Secret
- [ ] In n8n → Credentials → Added "Google Sheets" credential
- [ ] Connected Google account via OAuth
- [ ] Named credential: **"Google Sheets - Bodyncraft"** (or whatever)
- [ ] **Remember the credential ID** (will need to update workflow)

---

## Step 4: Import & Configure Workflow

- [ ] Opened n8n (http://localhost:5678 or cloud URL)
- [ ] Clicked **"+"** → **"Import from file"**
- [ ] Selected: `n8n_workflow_workout_notification_FIXED.json`
- [ ] Workflow appears in editor

### Edit Node Credentials:

**1. Webhook Node**
- [ ] Path is: `/bodyncraft/workout-complete` ✅

**2. Get User Email Node (HTTP Request)**
- [ ] Opened node settings
- [ ] Under "Authentication" → Header Auth
- [ ] Value contains: `Bearer {{ $vars.SUPABASE_SERVICE_ROLE_KEY }}` (or your hardcoded key)
- [ ] Test: Click "Test step" - should return user data (200 OK)

**3. Append to Google Sheets Node**
- [ ] Under "Credentials" → googleSheetsOAuth2Api
- [ ] Changed ID from `YOUR_GOOGLE_SHEETS_CRED_ID` to your actual credential name
- [ ] Example: `"Google Sheets - Bodyncraft"` (exact name)
- [ ] Sheet Name is: `Workouts` ✅
- [ ] Document ID shows: `{{ $vars.GOOGLE_SHEET_ID }}` (or your sheet ID)
- [ ] Test: Click "Test step" - should append a row (or return error about sheet structure)

**4. Send Email Node**
- [ ] Under "Credentials" → smtp
- [ ] Changed ID from `YOUR_SMTP_CRED_ID` to your SMTP credential name
- [ ] Example: `"Gmail - Bodyncraft"` (exact name)
- [ ] To field: `={{ $json.email }}` ✅

- [ ] Click **"Save"** (top right) after all changes

---

## Step 5: Activate Workflow

- [ ] Toggle switch at top-right is **ON** (green/activated)
- [ ] Workflow shows as "Active" in workflow list
- [ ] Webhook URL is generated (check Webhook node → copy URL)

---

## Step 6: Configure Bodyncraft App

**If running locally:**
- [ ] `.env` file has `VITE_N8N_WEBHOOK_URL=` with correct URL
  - Local: `http://localhost:5678/webhook/bodyncraft/workout-complete`
  - Cloud: Your n8n.cloud webhook URL (e.g., `https://your-workspace.n8n.cloud/webhook/bodyncraft/workout-complete`)

**If deployed to Vercel:**
- [ ] Ran: `vercel env add VITE_N8N_WEBHOOK_URL production`
- [ ] Value: Your webhook URL
- [ ] Redeployed the app

---

## Step 7: Test Execution

### Test 1: Execute from n8n (No app needed)
1. Open the workflow in n8n
2. Click **"Execute Workflow"** (play button)
3. Enter test JSON:
```json
{
  "user_id": "test-user-123",
  "exercise_name": "Push-ups",
  "xp_earned": 50,
  "body_part": "chest",
  "date": "2025-04-02T10:30:00Z"
}
```
4. Click **"Execute"**
5. **Expected**: All nodes should succeed (green checkmarks)
6. **Verify**:
   - [ ] "Send Email" succeeded
   - [ ] "Append to Google Sheets" succeeded
   - [ ] Check your Google Sheet → new row added
   - [ ] Check email inbox → notification received

### Test 2: Trigger from App
1. Open Bodyncraft app (local or deployed)
2. Complete a workout (defeat an enemy)
3. **Verify**:
   - [ ] Workout completes successfully in app
   - [ ] n8n shows new execution (check executions list)
   - [ ] Google Sheet has new entry
   - [ ] Email received

---

## Troubleshooting

If any test fails:

**Google Sheets Error:**
- [ ] Sheet name exactly: "Workouts" (no spaces, case-sensitive)
- [ ] Column headers exactly match: Date, User Email, Exercise, XP Earned, Body Part, User ID
- [ ] Google Sheets credentials are correct and authorized
- [ ] Sheet is shared with the Google account used in OAuth

**Email Error:**
- [ ] SMTP credentials are correct
- [ ] For Gmail: Using App Password (16-digit), not regular password
- [ ] Inbox not full, account not locked

**Supabase API Error:**
- [ ] Service Role Key copied correctly (full string)
- [ ] Not using "anon" or "public" key
- [ ] Supabase project URL is correct: `https://nnwqzfbfreugrmtqqynw.supabase.co`

**Webhook Not Triggering:**
- [ ] Workflow is **activated** (toggle ON)
- [ ] Webhook URL in app `.env` is correct
- [ ] n8n instance is running (check n8n.cloud or localhost:5678)
- [ ] No CORS errors in browser console
- [ ] Check n8n "Executions" page for dead letter queue

---

## Final Check ✅

- [ ] Manual test from n8n succeeded
- [ ] Test from Bodyncraft app succeeded
- [ ] Google Sheet is getting data
- [ ] Emails are sending
- [ ] No errors in n8n execution logs
- [ ] All credentials are secure (not in code, in n8n credentials store)

---

## Notes

- n8n free tier has execution limits
- Consider adding error handling (like falling back to logging if email fails)
- Monitor n8n executions to ensure webhook isn't overwhelmed
- For production, deploy n8n to a cloud service (Railway, Render) and update webhook URL

---

## Done! 🎉

Your n8n workflow is now fully operational.

**Quick Reference:**
- Workflow name: `Bodyncraft - Workout Completed Notification (FIXED)`
- Webhook path: `/bodyncraft/workout-complete`
- Variables needed: `GOOGLE_SHEET_ID`, `SUPABASE_SERVICE_ROLE_KEY`
- Credentials needed: Google Sheets OAuth2, SMTP (Gmail/etc.)
