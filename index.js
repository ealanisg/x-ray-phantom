const debug = require('debug')('x-ray:phantom');
const normalize = require('normalizeurl');
const Nightmare = require('nightmare');


function makeDriver(opts) {
  opts = opts || {};

	return function driver(ctx, callback) {
		debug('going to %s', ctx.url);

    const nightmare = new Nightmare(opts);

    // Setup standard listeners
    nightmare
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
    
    // Get all page content
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
	}
}

module.exports = makeDriver;
