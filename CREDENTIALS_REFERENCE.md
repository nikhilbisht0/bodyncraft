# Credentials & Configuration Reference

## Everything You Need to Gather

Use this as a checklist when gathering all required credentials before setting up n8n.

---

## 1. Google Sheets

| Item | Where to Find | Value | Notes |
|------|--------------|-------|-------|
| **Google Sheet ID** | From sheet URL: `docs.google.com/spreadsheets/d/{ID}/edit` | `_________________` | Insert into n8n variable `GOOGLE_SHEET_ID` |
| **Sheet Name** | Your Google Sheet tab | `Workouts` | Must match exactly |
| **Column Headers** | Row 1 of Workouts tab | Date, User Email, Exercise, XP Earned, Body Part, User ID | Case-sensitive |
| **Google Cloud Project ID** | console.cloud.google.com | `_________________` | For API credentials |
| **OAuth Client ID** | Google Cloud Console | `_________________` | n8n credential |
| **OAuth Client Secret** | Google Cloud Console | `_________________` | n8n credential |

---

## 2. Supabase

| Item | Where to Find | Value | Notes |
|------|--------------|-------|-------|
| **Project URL** | Supabase dashboard → Project settings | `https://nnwqzfbfreugrmtqqynw.supabase.co` | Already known |
| **Service Role Key** | Supabase → Settings → API → "Service Role Key" | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` | Insert into `SUPABASE_SERVICE_ROLE_KEY` variable |
| **anon/public key** | Supabase → Settings → API → "anon public" | Do NOT use this | Only for frontend |

---

## 3. Email (SMTP)

Choose your email provider:

### Gmail (Recommended for testing)

| Item | Where to Find / How to Get | Value |
|------|---------------------------|-------|
| **Email address** | Your Gmail | `_________________` |
| **App Password** | Google Account → Security → App passwords | `abcd efgh ijkl mnop` (16-digit) |

**Setup**: Enable 2FA first, then generate 16-digit app password.

### SendGrid

| Item | Where to Find | Value |
|------|--------------|-------|
| **API Key** | SendGrid dashboard → Settings → API Keys | `SG.xxxxx` |
| **From Email** | Verified sender in SendGrid | `noreply@yourdomain.com` |
| **SMTP Host** | N/A | `smtp.sendgrid.net` |
| **SMTP Port** | N/A | `587` |

### Other SMTP (Outlook, Yahoo, custom domain)

Get SMTP settings from your provider:
- Host: `smtp.provider.com`
- Port: `587` or `465`
- Username: Your email
- Password: Your password or app-specific password

---

## 4. n8n Instance

| Item | Value / Notes |
|------|---------------|
| **n8n URL** | `https://nikhill1.app.n8n.cloud` or `http://localhost:5678` |
| **Webhook Path** | `/bodyncraft/workout-complete` (automatically set in workflow) |
| **Full Webhook URL** | `{n8n-url}/webhook/bodyncraft/workout-complete` (or `/webhook-test/` for n8n.cloud) |
| **Workspace ID** | From n8n.cloud dashboard | `_________________` |

---

## 5. n8n Credentials (Store in n8n UI)

After creating credentials in n8n, note these IDs or names:

| Credential Type | Name in n8n | Credential ID (JSON) | Notes |
|-----------------|-------------|---------------------|-------|
| Google Sheets OAuth2 | `Google Sheets - Bodyncraft` | `"Google Sheets - Bodyncraft"` | Use this exact name in workflow |
| Email (SMTP) | `Gmail - Bodyncraft` | `"Gmail - Bodyncraft"` | Use this exact name in workflow |
| (Optional) Supabase Token | `Supabase Service Role` | `"Supabase Service Role"` | If using header auth credential |

---

## 6. n8n Variables (Store in n8n Settings → Variables)

| Variable Name | Value | Type | Notes |
|---------------|-------|------|-------|
| `GOOGLE_SHEET_ID` | `1BxiMVs0XRA5n...` | String | Your actual Google Sheet ID |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | String | Your Supabase service role key |
| *(Optional)* `SMTP_FROM_EMAIL` | `notifications@bodyncraft.com` | String | Override sender email |

---

## 7. Bodyncraft App (Vercel Deployment)

| Environment Variable | Value | Platform |
|---------------------|-------|----------|
| `VITE_N8N_WEBHOOK_URL` | `https://nikhill1.app.n8n.cloud/webhook-test/bodyncraft/workout-complete` | Vercel |
| `VITE_SUPABASE_URL` | `https://nnwqzfbfreugrmtqqynw.supabase.co` | Vercel |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` | Vercel |

**To set in Vercel:**
```bash
vercel env add VITE_N8N_WEBHOOK_URL production
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel --prod
```

---

## 8. Quick Copy-Paste Template

When ready, fill this out and keep it secure:

```
# Google Sheets
Google Sheet ID: _________________________
Sheet Name: Workouts
OAuth Client ID: _________________________
OAuth Client Secret: ______________________

# Supabase
Service Role Key: _________________________

# Email (Gmail example)
Email: _________________________________
App Password: ___________________________

# n8n
URL: ___________________________________
Webhook URL: ___________________________

# Google Sheets Credential Name in n8n:
Google Sheets - Bodyncraft

# SMTP Credential Name in n8n:
Gmail - Bodyncraft
```

---

## Important Security Notes

1. **Never commit** these values to git
2. Store them in password manager (1Password, Bitwarden, etc.)
3. Use n8n's built-in credentials store (encrypted)
4. Use n8n variables for secrets (not hardcoded in JSON)
5. Rotate keys if exposed
6. Use separate service accounts for production
7. Limit Google Sheet sharing to only necessary accounts

---

## Order of Operations

1. **First**: Get Google Sheet ready (create sheet, get ID, create OAuth credentials)
2. **Second**: Create n8n credentials (Google Sheets + SMTP)
3. **Third**: Set n8n variables (GOOGLE_SHEET_ID, SUPABASE_SERVICE_ROLE_KEY)
4. **Fourth**: Import workflow into n8n and update credential references
5. **Fifth**: Activate workflow and test
6. **Sixth**: Configure Bodyncraft app webhook URL
7. **Seventh**: Test end-to-end

---

## Verification Checklist

After setup, verify:

- [ ] Can manually append to Google Sheet using n8n node test
- [ ] Can send test email using n8n email node test
- [ ] Supabase user lookup returns data (test HTTP request node)
- [ ] Full workflow executes successfully from n8n editor
- [ ] Webhook URL in app `.env` matches n8n workflow URL
- [ ] Test from n8n test script works
- [ ] Test from Bodyncraft app works
- [ ] All three nodes succeed (green checkmarks) in execution log

---

**Need help?** Check execution logs in n8n for specific error messages.
