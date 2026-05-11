## GA4 + Search Console Setup

1. Open `public/index.html`.
2. Replace `G-XXXXXXXXXX` with your GA4 Measurement ID (format: `G-...`).
3. Replace `PASTE_GOOGLE_SITE_VERIFICATION_TOKEN` with the token from Google Search Console.
4. Deploy to production.
5. In Search Console, submit sitemap:
   - `https://hunanyans-films.netlify.app/sitemap.xml`

Verification tips:
- GA4: Realtime report should show your own page view.
- Search Console: URL inspection for `/`, `/tv`, `/anime` should become indexed after processing.
