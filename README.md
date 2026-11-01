# Bizmate Consulting Service — static website

Hand-written HTML, CSS and JavaScript. No build step, no framework, no dependencies except the Google Fonts stylesheet. Upload the folder and it runs.

## Files

```
index.html            Home
styles.css            The whole design system (colours, type, layout, responsive)
script.js             Menu, hero slideshow, form delivery, scroll reveals
pages/
  services.html       Six services in detail (#accounting #tax #payroll #reporting #advisory #systems)
  boss.html           BOSS product page — modules, packages (scope only), implementation
  about.html          Firm story, core purpose, team
  contact.html        Booking form (#booking), contact details, FAQ
assets/               Logo, hero banners, BOSS image, office and team photos
```

## Design system

The visual language is taken from the logo: **ink black** and **electric blue** on off-white, with hairline rules and square-ish corners (4px) instead of soft cards.

- `--ink: #0B0C0E` — headlines, dark sections, footer
- `--blue: #1473E6` — accents, buttons, links, hover states
- `--paper: #F4F6F9` — alternating section background

Type: **Sora** for headings and buttons, **Inter Tight** for body copy, **Instrument Serif** italic for the highlighted phrase in each headline.

To re-skin the whole site, edit the variables at the top of `styles.css`. Nothing else needs touching.

## The logo

`assets/bizmate-logo.jpg` is your uploaded file, copied unchanged. It sits on a white header, and in the dark footer it gets a white chip behind it (`.footer-brand img`) so the black lettering stays readable. Keep the same file name when you replace it with a higher-resolution version.

## Social links

LinkedIn and Facebook appear in four places: the top bar, the footer, the mobile menu, and the About and Contact pages. They are plain `<a>` tags — search for `linkedin.com/company` in the HTML files to update them all.

- LinkedIn: `https://www.linkedin.com/company/bizmate-consulting-services/home/`
- Facebook: `https://www.facebook.com/bizmateconsulting/`

They are also declared in the home page's structured data (`sameAs`), which helps search engines associate the profiles with the business.

## The booking form (important)

A static site cannot send email by itself, so the form is built to work with **no backend and no third-party account**:

- **Send request** — opens the visitor's email app with `bizmateconsulting@gmail.com` pre-filled (business name, interest, size, contact numbers, email, message).
- **Send on WhatsApp** — opens `wa.me/9779765457572` with the same text.

Links like `contact.html?service=BOSS%20Demo#booking` pre-select “BOSS Demo” and jump to the form, which is what every "Get a demo" button on the site uses.

If you later want submissions delivered silently without the visitor's email app, replace the submit handler in `script.js` with a form endpoint (Web3Forms, Formspree or a Cloudflare Worker). The field names are already set: `businessName`, `service`, `businessSize`, `contactNumbers`, `email`, `message`.

## Deploying

### GitHub Pages

1. Create a repository, upload everything in this folder (keep the `pages/` and `assets/` folders).
2. Settings → Pages → Source: _Deploy from a branch_ → `main` / root.
3. The site appears at `https://<username>.github.io/<repo>/`.

### Cloudflare Pages

1. Push the same repository to GitHub (or drag the folder into Cloudflare Pages' direct upload).
2. Framework preset: **None**. Build command: leave empty. Output directory: `/`.
3. Add your custom domain under Custom domains — Cloudflare issues the certificate automatically.

Before going live, replace `https://bizmateconsulting.com.np` in the `<link rel="canonical">`, `og:url` and JSON-LD blocks with your real domain (five files, one occurrence each aside from the home page).

## SEO checklist already done

- Unique `<title>` and meta description per page
- One `<h1>` per page containing the service + location keywords
- Canonical URLs, Open Graph tags, `AccountingService` structured data with `sameAs` social profiles
- Descriptive `alt` text on every image
- Semantic landmarks (`header`, `nav`, `main`, `footer`) and a skip link

Still to do at the repo root once the domain is set: add `robots.txt` and `sitemap.xml` with your five URLs.

## Placeholders to replace

| Where                            | What                                                                                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`, `pages/about.html` | CA Pradip Yadav's portrait — his card currently shows a “PY” initials tile. Swap the `team-photo--placeholder` div for an `<img>` like the other three cards. |
| `assets/team-*.jpg`              | Team portraits and the BOSS/hero imagery are AI-generated stand-ins. Replace with real photography at the same file names.                                    |
| All five HTML files              | “Sankhamul, Kathmandu” as the location — the proposal document does not state an address. Put your actual office address here.                                |
| `pages/boss.html`                | Package scopes only, no prices. When you are ready to publish pricing, add a `.plan-price` line per plan.                                                     |
