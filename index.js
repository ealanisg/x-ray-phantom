const debug = require('debug')('x-ray:puppeteer');
// const normalize = require('normalizeurl');
const puppeteer = require('puppeteer');


function makeDriver(opts) {
  opts = opts || {};
  // add default user agent
  if (!opts.useragent) opts.useragent = 'xray/puppeteer';

  return (ctx, callback) => {
    debug('going to %s', ctx.url);
    this.instance = puppeteer;

    // Setup standard listeners
    // nightmare
    //   .useragent(opts.useragent)
    //   .on('error', (msg) => debug('client-side javascript error %s', msg))
    //   .on('timeout', (timeout) => callback(new Error(timeout)))
    //   .on('resourceReceived', (resource) => {
    //     if (normalize(resource.url) == normalize(ctx.url)) {
    //       debug('got response from %s: %s', resource.url, resource.status);
    //       ctx.status = resource.status;
    //     }
    //   })
    //   .on('urlChanged', (url) => {
    //     debug('redirect: %s', url);
    //     ctx.url = url;
    //   });

    const autoScroll = async (page) => {
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
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
      .launch()
      .then(async (browser) => {
        const page = await browser.newPage();
        await page.setUserAgent(opts.useragent);
        await page.goto(ctx.url, { 'timeout': 10000, 'waitUntil': 'domcontentloaded' });
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
