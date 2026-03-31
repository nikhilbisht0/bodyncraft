# n8n Setup Guide for Bodyncraft

## What This Does

When a user completes a workout in Bodyncraft:
1. Your app sends data to n8n webhook
2. n8n can trigger automations:
   - Send email notification
   - Post to Discord/Slack
   - Log to Google Sheets
   - Update calendar
   - and more!

---

## Step 1: Deploy n8n

### Option A: Docker (Local)
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```
Open: http://localhost:5678

### Option B: n8n.cloud (Free tier)
1. Sign up at https://n8n.cloud
2. Create new workspace
3. Get your webhook URL (like: `https://your-workspace.n8n.cloud/webhook/...`)

---

## Step 2: Create Workflow in n8n

1. Open n8n (http://localhost:5678 or cloud)
2. Click **"Create from template"** or **"+ New workflow"**
3. Add a **Webhook** node:
   - Method: `POST`
   - Path: `/bodyncraft/workout-complete`
   - Save → Copy the webhook URL (e.g., `http://localhost:5678/webhook/bodyncraft/workout-complete`)

4. Add a **Webhook node** example workflows below

5. Click **"Execute Workflow"** to test

---

## Step 3: Set Environment Variable in Vercel

In your Bodyncraft Vercel project:

```bash
vercel env add VITE_N8N_WEBHOOK_URL production
```

Value: `http://localhost:5678/webhook/bodyncraft/workout-complete` (or your cloud URL)

Or in Vercel Dashboard:
1. Go to Project → Settings → Environment Variables
2. Add `VITE_N8N_WEBHOOK_URL` with your webhook URL
3. Redeploy

---

## Simple Test Workflow (Log to Console)

Import this into n8n:

```json
{
  "name": "Bodyncraft Test",
  "nodes": [
    {
      "parameters": {
        "path": "bodyncraft/workout-complete",
        "options": {}
      },
      "id": "webhook",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "jsCode": "console.log('Workout completed:', $input.all()[0].json);\nreturn [{ json: { message: 'Received', data: $input.all()[0].json } }];"
      },
      "id": "code",
      "name": "Log & Return",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [450, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{ "node": "Log & Return", "type": "main", "index": 0 }]]
    }
  }
}
```

---

## Discord Notification Workflow (Easiest)

1. Add **Webhook** node (as above)
2. Add **Discord** node:
   - Credentials: Your Discord webhook URL
   - Channel: (auto-selected)
   - Text:
   ```
   💪 **Workout Completed!**
   User: {{ $json.user_id }}
   Exercise: {{ $json.exercise_name }}
   XP: {{ $json.xp_earned }}
   ```
3. Connect Webhook → Discord

---

## Email Notification Workflow

**Need**: SMTP credentials (Gmail, SendGrid, etc.)

1. n8n → **Credentials** → **Add credential** → **Email (SMTP)**
2. Add **SMTP** node after Webhook:
   - To: `={{ $json.user_email }}` (you'll need to fetch email from Supabase)
   - Subject: `Bodyncraft: Workout Complete!`
   - Body: HTML with stats
3. (Optional) Add **HTTP Request** node before email to fetch user email from Supabase

---

## Google Sheets Logging

1. n8n → **Credentials** → **Google Sheets**
2. Add **Google Sheets** node:
   - Operation: Append
   - Spreadsheet ID: your sheet ID
   - Sheet Name: `Workouts`
   - Columns: `date, user_id, exercise_name, xp_earned`
   - Values: `={{ $json.date }}, {{ $json.user_id }}, {{ $json.exercise_name }}, {{ $json.xp_earned }}`

---

## Full Workflow Example (Discord + Sheets)

```
Webhook (POST /bodyncraft/workout-complete)
  ↓
Code (format message)
  ↓
Split in 2:
  ├→ Discord (post notification)
  └→ Google Sheets (log data)
```

---

## Test It

1. Start n8n workflow (activate)
2. In your Bodyncraft app, complete a workout (defeat an enemy)
3. Check n8n execution history → should show incoming data
4. Check Discord/Sheets → data received

---

## Environment Variables

| Variable | Purpose | Required? |
|----------|---------|-----------|
| `VITE_N8N_WEBHOOK_URL` | Your n8n webhook endpoint | Yes (if using webhooks) |
| `VITE_SUPABASE_URL` | Already set in supabaseClient.js | Yes |
| `VITE_SUPABASE_ANON_KEY` | Already set in supabaseClient.js | Yes |

---

## Troubleshooting

**n8n not receiving webhook?**
- Check Vercel env var is set and redeployed
- Open network tab in browser → check POST request to n8n
- n8n must be publicly accessible (use ngrok for local)

**Webhook 404?**
- Path must match exactly: `/bodyncraft/workout-complete`
- n8n workflow must be **active** (toggle ON)

**CORS errors?**
- n8n doesn't enforce CORS by default. If you get errors, add CORS middleware or use proxy.

---

## Deploy n8n to Cloud (Production)

For production, deploy n8n to:

1. **Railway** (free tier): `railway up`
2. **Render** (free tier): Create Web Service from n8n Docker
3. **DigitalOcean** App Platform
4. **Fly.io**

Then update `VITE_N8N_WEBHOOK_URL` with your cloud n8n URL.

---

**Need help with a specific automation?** Ask!
