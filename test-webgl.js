const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  const hasCanvas = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return 'No canvas found';
    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
    return gl ? 'WebGL context is active!' : 'Canvas found but WebGL failed to initialize';
  });
  console.log(hasCanvas);
  await browser.close();
})();
