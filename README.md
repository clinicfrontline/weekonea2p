# weekonea2p

The Week One AI lead-capture site: a home page with a working form, plus the
privacy policy and terms of service pages a carrier reads during A2P 10DLC
registration.

Plain HTML/CSS/JS. No build step, no dependencies, no framework — the repo is the
deployable site.

## Files

```
index.html            ← home page + the lead form
privacy-policy.html
terms.html
assets/
├── css/styles.css
├── js/form.js        ← validation + submit
└── img/              ← logo, 3 icons, team photo, expertise background
```

## Running it locally

Open `index.html` in a browser directly, or serve the folder:

```powershell
npx --yes serve -l 8899 .
```

Then visit `http://127.0.0.1:8899/`.

## Where the leads go

`assets/js/form.js` starts with:

```js
var ENDPOINT = null;
```

Set that to a URL that accepts a JSON `POST` — a GHL inbound webhook, a Supabase
edge function, anything — and every submission is sent there.

**Left as `null`, the form still works end to end.** It validates, builds the
payload, prints it to the browser console and shows the thank-you panel — and the
panel says out loud that no endpoint is configured, so a lead can never look
delivered when it wasn't.

The payload:

```json
{
  "first_name": "Talha",
  "last_name": "Test",
  "phone": "(208) 555-0134",
  "email": "talha@example.com",
  "consent_marketing_sms": true,
  "consent_transactional_sms": true,
  "consent_text_shown": {
    "marketing": "I consent to receive marketing text messages from company at …",
    "transactional": "I consent to receive non-marketing text messages from company …"
  },
  "submitted_at": "2026-08-04T16:34:40.696Z",
  "page_url": "http://127.0.0.1:8899/"
}
```

`consent_text_shown` stores the exact wording that was on screen when the box was
ticked. That is the record a carrier or a TCPA claim actually asks for — a boolean
alone does not prove what the person agreed to.

## ⚠️ Two values are still missing — do not submit this URL to a carrier yet

Both legal pages carry a yellow banner and yellow-highlighted placeholders, and
**they are visible to anyone who opens the page**. Find and replace in
`privacy-policy.html` and `terms.html`:

| Placeholder | What it needs |
|---|---|
| `[EFFECTIVE DATE]` | The date these terms take effect. |
| `[SUPPORT EMAIL]` | The address that answers HELP replies and privacy requests. |

They are placeholders rather than guesses on purpose: an effective date and a
support address on a legal page are business facts, and a plausible-looking wrong
one is worse than a visible gap.

The company name is set to **WEEK ONE AI**. If the entity that signs the A2P
registration is a different registered name, change it in both files.

## ⚠️ Two things in the copy to decide on

1. **"algorithmic trading services" / "algorithmic trading accounts"** appear in
   the privacy policy (§2) and terms (§1). The privacy policy therefore describes
   a business this site does not sell — the home page sells advertising. It should
   almost certainly say advertising services.
2. **"Avg rating 4.8"**, **"A+ Rating"** and **"Over 10+ Companies Have Grown
   With Me"** are unsubstantiated claims. Week One AI's own brand rules ban
   testimonials and client counts that aren't real.

Neither is a code problem — both are decisions.

## Legal

These pages are boilerplate, not legal advice, and have not been reviewed by
counsel. Have a lawyer read them before a carrier or a real visitor does.
