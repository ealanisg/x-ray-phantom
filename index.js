const debug = require('debug')('x-ray:phantom');
const normalize = require('normalizeurl');
const Nightmare = require('nightmare');


function makeDriver(opts) {
  opts = opts || {};

	return (ctx, callback) => {
		debug('going to %s', ctx.url);

    const nightmare = new Nightmare(opts);
    this.instance = nightmare;

    // Setup standard listeners
    nightmare
      .useragent(opts.useragent)
      .on('error', (msg) => debug('client-side javascript error %s', msg))
      .on('timeout', (timeout) => callback(new Error(timeout)))
      .on('resourceReceived', (resource) => {
        if (normalize(resource.url) == normalize(ctx.url)) {
          debug('got response from %s: %s', resource.url, resource.status);
          ctx.status = resource.status;
        };
      })
      .on('urlChanged', (url) => {
        debug('redirect: %s', url);
        ctx.url = url;
      });
    
    // Basic operation is to get the rendered page content
    // and return it as the "complete" document.
    //
    // X-ray will then use Cheerio on this document, so the same queries & filters
    // that work with request-based driver will work here (ie. NOT nightmare specific).
    nightmare
      .goto(ctx.url)
      .evaluate(() => {
        // Get the entire document contents
        return document.documentElement.outerHTML;
      })
      .then(body => {
        ctx.body = body;
        debug('%s - %s', ctx.url, ctx.status);
        callback(null, ctx);
      });
	};
}

module.exports = makeDriver;
