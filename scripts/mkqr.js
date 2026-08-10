/* Regenerate the QR code and printable card.
   Usage: node scripts/mkqr.js [url]
   Requires: npm i qrcode playwright  */
const QR = require('qrcode');
const fs = require('fs');
const { chromium } = require('playwright');
const OUT = require('path').join(__dirname, '..', 'qr');
fs.mkdirSync(OUT, { recursive: true });

const URL_ = process.argv[2] || 'https://laqostine.github.io/anima-ruya-defteri/';
const shortLabel = URL_.replace(/^https?:\/\//, '').replace(/\/$/, '');

(async () => {
  // Standalone QR assets
  const svg = await QR.toString(URL_, { type: 'svg', errorCorrectionLevel: 'H', margin: 1, color: { dark: '#1B1813', light: '#FFFFFF' } });
  fs.writeFileSync(`${OUT}/anima-qr.svg`, svg);
  await QR.toFile(`${OUT}/anima-qr.png`, URL_, { errorCorrectionLevel: 'H', margin: 1, width: 1200, color: { dark: '#1B1813', light: '#FFFFFF' } });

  const inner = await QR.toString(URL_, { type: 'svg', errorCorrectionLevel: 'H', margin: 0, color: { dark: '#1B1813', light: '#00000000' } });
  const qrBody = inner.replace(/<\?xml[^>]*\?>/, '').replace(/<svg /, '<svg class="qr" ');

  const card = `<!doctype html><html lang="tr"><head><meta charset="utf-8">
<title>Anima — QR kartı</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap">
<style>
  @page { size: A6; margin: 0; }
  * { box-sizing: border-box; margin: 0; }
  body { width: 105mm; height: 148mm; background: #F5F1E8; color: #1B1813;
         font-family: 'Inter', sans-serif; display: flex; flex-direction: column;
         align-items: center; justify-content: space-between; padding: 11mm 9mm 8mm;
         text-align: center; -webkit-font-smoothing: antialiased; }
  .mark { width: 13mm; height: 13mm; }
  .name { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 600; letter-spacing: .01em; margin-top: 3mm; }
  .kicker { font-size: 9px; letter-spacing: .16em; text-transform: uppercase; color: #857D71; margin-top: 2mm; }
  .lede { font-family: 'Fraunces', serif; font-size: 15px; line-height: 1.45; color: #57514A; margin-top: 5mm; max-width: 78mm; }
  .qrwrap { background: #fff; padding: 5mm; border-radius: 5mm; box-shadow: 0 2px 10px rgba(60,48,30,.10); margin-top: 6mm; }
  .qr { width: 44mm; height: 44mm; display: block; }
  .cta { font-size: 12px; font-weight: 600; margin-top: 4mm; }
  .url { font-size: 9.5px; color: #857D71; margin-top: 1.5mm; word-break: break-all; }
  .foot { font-size: 8.5px; letter-spacing: .12em; text-transform: uppercase; color: #857D71;
          border-top: .3mm solid rgba(28,25,20,.14); padding-top: 3mm; width: 100%; margin-top: 6mm; }
</style></head><body>
  <div>
    <svg class="mark" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#5B3AA8" stroke-width="1.4"/><path d="M12 3a9 9 0 0 0 0 18a4.5 4.5 0 0 1 0-9a4.5 4.5 0 0 0 0-9Z" fill="#5B3AA8"/></svg>
    <div class="name">Anima</div>
    <div class="kicker">Rüya Defteri</div>
    <p class="lede">Rüyalarını kaydet, arketipleri&nbsp;tanı,<br>tekrar eden desenleri&nbsp;gör.</p>
  </div>
  <div>
    <div class="qrwrap">${qrBody}</div>
    <div class="cta">Kamerayla okut — kurulum yok</div>
    <div class="url">${shortLabel}</div>
  </div>
  <div class="foot">Jungian Studies İstanbul</div>
</body></html>`;

  fs.writeFileSync(`${OUT}/kart.html`, card);

  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + `${OUT}/kart.html`, { waitUntil: 'networkidle' });
  await p.pdf({ path: `${OUT}/anima-qr-kart-A6.pdf`, format: 'A6', printBackground: true });
  await p.setViewportSize({ width: 620, height: 874 });
  await p.screenshot({ path: `${OUT}/anima-qr-kart.png`, fullPage: true });
  await b.close();
  console.log('QR assets written for', URL_);
})();
