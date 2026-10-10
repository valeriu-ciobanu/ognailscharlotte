# O.G. Nails by Olga — website

Static site (plain HTML/CSS/JS, no build step). Ready for GitHub Pages.

## Deploy to GitHub Pages
1. Create a new GitHub repository (e.g. `ognails`).
2. Upload **the contents of this folder** (index.html, assets/, images/, etc.) to the repository root.
3. In the repo: Settings → Pages → Source: "Deploy from a branch" → Branch `main`, folder `/ (root)` → Save.
4. The site will be live at `https://<username>.github.io/<repo>/` within a minute or two.
5. Custom domain **ognailscharlotte.com** (the `CNAME` file is already included):
   - At your domain registrar, add these DNS records:
     - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     - `AAAA` records for `@` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
     - `CNAME` record for `www` → `<your-github-username>.github.io`
   - In the repo: Settings → Pages → Custom domain → `ognailscharlotte.com` → Save. Once the DNS check passes, tick **Enforce HTTPS**.
   - DNS can take up to 24–48 hours to take effect.
6. After launch: add the site to Google Search Console and submit `https://ognailscharlotte.com/sitemap.xml`. Put the URL in your Google Business Profile, Vagaro listing and Instagram bio.

Page links are relative. Canonical URLs, the share image, sitemap and business info point at https://ognailscharlotte.com — if the domain ever changes, update `CNAME`, `sitemap.xml`, `robots.txt` and the `ognailscharlotte.com` references in the HTML.

## Editing
- Pages: `index.html`, `services.html`, `gallery.html`, `about.html`, `contact.html`, `404.html`
- Styles: `assets/css/styles.css` · Scripts: `assets/js/main.js`
- Prices live in `services.html` (keep in sync with Vagaro).
- Gallery: copy a `<button class="tile" ...>` block in `gallery.html`. `data-tags` controls filters:
  `manicure`, `pedicure`, `gel`, `art`, `men` (space-separated). Filter buttons for
  Pedicure and Men's appear automatically once at least one photo has that tag.
- Fonts: Newsreader (headings) and Satoshi Medium (body), both self-hosted in `assets/fonts`. Medium (body) and Bold (buttons, labels) weights are included.
- Hero backgrounds: `images/hero/`.
- Images are WebP: `-sm` (grid, 720px) and `-lg` (lightbox, 1800px).

## Still to confirm (from the plan)
Hours, phone/email, parking notes, cancellation/deposit policy, service durations,
hygiene & sanitation practices, privacy policy, analytics (Book Now clicks already fire a
`book_now_click` event when Google Analytics/gtag is added).
