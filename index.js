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

    puppeteer
      .launch()
      .then(async (browser) => {
        const page = await browser.newPage();
        await page.setUserAgent(opts.useragent);
        await page.goto(ctx.url);
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
