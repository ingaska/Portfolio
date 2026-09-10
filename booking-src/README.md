# Ride Bingo booking page (sumska.io/booking)

- `template.html` is the single source. Edit this, never `public/booking/index.html`.
- `python3 booking-src/build.py` regenerates `public/booking/index.html`; commit and push to deploy (Vercel builds `main`).
- `python3 booking-src/build.py --artifact /tmp/ride-bingo.html` makes the single-file build for the Claude artifact.
- `supabase.json` (`{"url": "...", "anonKey": "..."}`) turns on real saving; `supabase-bookings.sql` creates the table.
- Images live in `public/booking/assets/`; reference them in the template as `{{asset:name}}`.
