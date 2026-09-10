#!/usr/bin/env python3
"""Build the Ride Bingo booking page from booking-src/template.html.

  python3 booking-src/build.py                 -> public/booking/index.html  (site: /booking/assets/... paths)
  python3 booking-src/build.py --artifact X.html -> single-file build with images inlined as data URIs (Claude artifact)

Supabase keys: put {"url": "...", "anonKey": "..."} in booking-src/supabase.json (anon/publishable key only).
Without that file the page runs in demo mode (Send shows "Sent" without saving).
"""
import re, json, base64, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC, OUT = ROOT / 'booking-src', ROOT / 'public' / 'booking'
tpl = (SRC / 'template.html').read_text()
cfg = json.loads((SRC / 'supabase.json').read_text()) if (SRC / 'supabase.json').exists() else {}
tpl = tpl.replace('{{supabase-url}}', cfg.get('url', '')).replace('{{supabase-anon-key}}', cfg.get('anonKey', ''))

def asset_file(name):
    return next((OUT / 'assets').glob(name + '.*'))

if '--artifact' in sys.argv:
    dest = pathlib.Path(sys.argv[sys.argv.index('--artifact') + 1])
    def uri(m):
        f = asset_file(m.group(1)); mime = 'image/png' if f.suffix == '.png' else 'image/jpeg'
        return 'data:%s;base64,%s' % (mime, base64.b64encode(f.read_bytes()).decode())
    html = re.sub(r'\{\{asset:([\w-]+)\}\}', uri, tpl)
    # the artifact host wraps the file in its own document, so drop ours
    for tag in ('<!doctype html>\n', '<html lang="en">\n', '<head>\n', '</head>\n', '<body>\n', '</body>\n', '</html>\n'):
        html = html.replace(tag, '', 1)
    dest.write_text(html); print('artifact build ->', dest, len(html) // 1024, 'KB')
else:
    html = re.sub(r'\{\{asset:([\w-]+)\}\}', lambda m: '/booking/assets/' + asset_file(m.group(1)).name, tpl)
    (OUT / 'index.html').write_text(html); print('site build ->', OUT / 'index.html', len(html) // 1024, 'KB')
assert '{{' not in html, 'unresolved placeholder'
