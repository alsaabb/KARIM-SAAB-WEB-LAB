#!/usr/bin/env python3
"""Check official identity and release configuration without changing files."""
from pathlib import Path
r=Path(__file__).resolve().parents[1]
app=(r/'dist/app.js').read_text(encoding='utf-8')
extra=(r/'dist/enhancements.js').read_text(encoding='utf-8')
html=(r/'dist/index.html').read_text(encoding='utf-8')
css=(r/'dist/identity-2026.css').read_text(encoding='utf-8')
root=(r/'index.html').read_text(encoding='utf-8')
workflow=(r/'.github/workflows/deploy.yml').read_text(encoding='utf-8')
expected={
 'identity':('عبدالكريم بن إبراهيم الصعب',app+html+root),
 'tagline':('من قلب الصحراء إلى العالم | أترك أثراً قبل أن تغادر / Around the World by Bicycle',app),
 'English switch':("'English'",app),
 'numbered navigation':("padStart(2,'0')",app+extra),
 'mobile navigation':('mobile-nav',app+extra),
 'third-level navigation':('NAV_TREE',extra),
 'mail':('mailto:alsaabb@gmail.com',app),
 'WhatsApp':('https://wa.me/966127502211',app),
 'TikTok':('https://www.tiktok.com/@alsaabb',app),
 'charcoal':('#141414',css+html),
 'vintage gold':('#D4AF37',css),
 'ivory':('#f7f5ef',css),
 'brand stylesheet':('identity-2026.css',html),
 'root redirect':('/KARIM-SAAB-WEB-LAB/dist/index.html',root),
 'automatic deployment':('actions/deploy-pages@v4',workflow),
}
failed=[name for name,(token,source) in expected.items() if token not in source]
if failed:raise SystemExit('Identity checks failed: '+', '.join(failed))
print('PASS:',len(expected),'identity, navigation, route, and deployment checks')
