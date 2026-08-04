# weekonea2p

The Week One AI A2P opt-in site: a home page, a privacy policy and terms of
service — the three pages a carrier reads during A2P 10DLC registration.

Plain HTML/CSS. No build step, no dependencies, no JavaScript of our own.
The repo **is** the deployable site — turn on GitHub Pages (Settings → Pages →
Source: `main`, root) and it serves as-is.

## Files and URLs

Directory-based routing, so no `.html` ever appears in a URL:

```
index.html                  →  /
privacy-policy/index.html   →  /privacy-policy
terms/index.html            →  /terms
assets/
├── css/styles.css
└── img/                    ←  logo, 3 icons, team photo, expertise background
```

Asset and page links are **relative** (`assets/…` at root, `../assets/…` inside
the two subdirectories) rather than root-absolute. That is deliberate: it works
unchanged whether the site is served from a domain root or from a GitHub Pages
project subpath like `/weekonea2p/`. Root-absolute `/assets/…` would break the
second case.

## ⚠️ THE LEAD FORM WAS REMOVED — do not put it back

Removed 2026-08-04. GoHighLevel's **Business Website Compliance Checklist**
(widget-first A2P path) requires:

> *"I confirm that no forms collecting phone numbers or SMS opt-in consent exist
> on any page where the chat widget is embedded. This includes contact forms, lead
> forms, landing page forms, and appointment forms."*

**The chat widget is the SMS opt-in method for this campaign.** A lead form with a
phone field and consent checkboxes on the same page breaks that rule and risks the
10DLC campaign being rejected. `index.html` carries a comment saying so at the
point where the form used to be.

Deleted with it: `assets/js/form.js`, and every form style in `styles.css`. The
hero is now a single centred column — a half-empty two-column hero just reads as
a broken layout.

If the opt-in method is ever switched back to a form, the widget has to come off
the site first. The two cannot coexist.

## The booking link and the chat widget

**"Schedule A Call Today with Me"** points at the **agency** GoHighLevel
sub-account (`ApNfHZMqAvnu2Cf6w9Ch`), calendar **Consultation**, 30 min:

```
https://api.leadconnectorhq.com/widget/booking/gsqYXKN7wnsVUCwkFNJu
```

Not the demo client's calendar. The agency sub-account's other calendar, *Strategy
Call*, is `isActive: false` in GHL, so Consultation is the only bookable one.

⚠️ That booking page is an **appointment form that collects a phone number** — but
it lives on `api.leadconnectorhq.com`, not on our site, so it is outside the scope
of the checklist item above, which is limited to pages where our widget is
embedded. Worth knowing if a reviewer follows the button.

The **GoHighLevel chat widget** (`data-widget-id="6a72374e37f916f4bc476efe"`) loads
on all three pages, immediately before `</body>`.

## Business details

| Value | Setting |
|---|---|
| Effective date | `February 27th, 2026` |
| Support email | `info@weekoneai.com` |
| Business address | H-13 First Floor, Kailash Colony · New Delhi, Delhi 110048, India |
| Business phone | `+91 8287773860` |
| Company name | `WEEK ONE AI` |

These are the details used to **verify the A2P brand**, and they appear in an
`<address class="footer-contact">` block in the footer of all three pages, plus the
privacy policy's §7 and the terms' §5 — five places that must change together if
the brand is ever re-verified. The checklist requires the verifying address, email
and phone to be present on the website.

## Running it locally

`serve` resolves directory indexes, which is what makes the clean URLs work:

```powershell
npx --yes serve -l 8901 .
```

Then `http://127.0.0.1:8901/`, `/privacy-policy`, `/terms`.

## ⚠️ Still open

- **The site is not hosted.** Nothing on the compliance checklist can be submitted
  without a live URL. GitHub Pages needs no config here — the repo is already
  static with an `index.html` at root.
- **"algorithmic trading services"** appears in the privacy policy (§2) and terms
  (§1), inherited verbatim from the reference site this was copied from. The
  privacy policy therefore describes a business this site does not sell.
- **"Avg rating 4.8"**, **"A+ Rating"** and **"Over 10+ Companies Have Grown With
  Me"** are unsubstantiated claims, also inherited. `brand/guidelines.md` bans
  testimonials and client counts that aren't real.
- **A2P 10DLC is a US carrier programme** and this brand is registered in India
  with a `+91` number. Non-US brands are vetted on a different track.

## Legal

These pages are boilerplate, not legal advice, and have not been reviewed by
counsel. Have a lawyer read them before a carrier or a real visitor does.
