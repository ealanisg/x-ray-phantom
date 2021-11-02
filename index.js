const debug = require('debug')('x-ray:puppeteer');
const puppeteer = require('puppeteer');


function makeDriver(opts) {
  opts = opts || {};
  // add default user agent
  if (!opts.useragent) opts.useragent = 'x-ray/puppeteer';

  return (ctx, callback) => {
    debug('going to %s', ctx.url);
    this.instance = puppeteer;

    const autoScroll = async (page) => {
      await page.waitFor(1000);
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          let totalHeight = 0;
          const distance = 100;
          let timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
    };

    puppeteer
      .launch({
        ignoreHTTPSErrors: true,
        headless: true
      })
      .then(async (browser) => {
        const page = await browser.newPage();
        await page.setUserAgent(opts.useragent);
        await page.goto(ctx.url, {
          timeout: 60000,
          waitUntil: 'load'
        });
        await page.setViewport({
          width: 1200,
          height: 800
        });
        await autoScroll(page);
        const html = await page.evaluate(() => document.documentElement.outerHTML);
        await browser.close();
        return html;
      })
      .then((body) => {
        ctx.body = body;
        debug('%s - %s', ctx.url, ctx.status);
        callback(null, ctx);
      })
      .catch((e) => {
        console.log('error:', e)
        return callback;
      })
  };
}

module.exports = makeDriver;
