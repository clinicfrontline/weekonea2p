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

## The booking link and the chat widget

**"Schedule A Call Today with Me"** points at the **agency** GoHighLevel
sub-account (`ApNfHZMqAvnu2Cf6w9Ch`), calendar **Consultation**, 30 min:

```
https://api.leadconnectorhq.com/widget/booking/gsqYXKN7wnsVUCwkFNJu
```

Not the demo client's calendar. The agency sub-account's other calendar, *Strategy
Call*, is `isActive: false` in GHL, so Consultation is the only bookable one — if
Strategy Call is the one you want, activate it in GHL first and swap the id.

The **GoHighLevel chat widget** (`data-widget-id="6a721a0437f916f4bc3f600c"`) loads
on all three pages, immediately before `</body>`.

## ⚠️ Where the leads go — nowhere yet

`assets/js/form.js` starts with:

```js
var ENDPOINT = null;
```

Set that to a URL that accepts a JSON `POST` — a GHL inbound webhook, a Supabase
edge function, anything — and every submission is sent there.

**Left as `null` the form still works end to end** — it validates, builds the
payload and shows the thank-you panel — **but the lead goes nowhere and the
visitor is not told.** The warning lives in the browser console instead: open
DevTools and a submission prints `[lead-form] NO ENDPOINT SET — this lead was NOT
sent anywhere` with the full payload. **Set `ENDPOINT` before this page takes real
traffic.**

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

## Legal page values

| Value | Setting |
|---|---|
| Effective date | `February 27th, 2026` |
| Support email | `info@weekoneai.com` |
| Business address | H-13 First Floor, Kailash Colony · New Delhi, Delhi 110048, India |
| Business phone | `+91 8287773860` |
| Company name | `WEEK ONE AI` — change if the entity signing the A2P registration differs |

The address, phone and email are the ones used to **verify the A2P brand**, and
they appear in an `<address class="footer-contact">` block in the footer of **all
three pages**, plus the privacy policy's §7 and the terms' §5. That placement is
deliberate: GoHighLevel's Business Website Compliance Checklist requires the
verifying address, email and phone to be present on the website. If the brand is
ever re-verified with different details, those five places must change together.

## ⚠️ Both consent boxes are mandatory — and that is worth a second look

Set 2026-08-04: the form will not submit unless **both** consent checkboxes are
ticked.

The transactional box is uncontroversial. **Requiring the *marketing* box is the
part to reconsider.** Under the TCPA, consent to receive marketing messages may not
be a condition of getting something else, and carriers reviewing a 10DLC campaign
look specifically for consent that was freely given. A required marketing checkbox
is the pattern they are looking *for* — it makes every consent record this page
produces arguably coerced, which weakens the exact evidence the page exists to
create.

The safer shape, if it ever needs changing: keep the transactional box required,
make the marketing box optional, and record whichever way it was left. The code
already stores both flags independently, so this is a one-line change in
`index.html` plus the matching check in `assets/js/form.js`.

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
