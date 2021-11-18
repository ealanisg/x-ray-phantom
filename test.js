const Xray = require('x-ray');
const driver = require('./');
const expect = require('chai').expect;

const x = Xray()
  .driver(driver());

describe('x-ray-puppeteer', () => {
  it('correctly crawls sites', async () => {
    const title = await x('https://www.thebodyshop.com/en-ca/sale/h/h00008', 'title');
    expect(title).to.equal('Beauty & Skincare Sale | Makeup Sale | The Body Shop®');
  });

  it('should handle browsing errors', async () => {
    const url = 'https://www.sitethatdoesntexist13246546724657465.com';
    const scope = 'title';
    try {
      await x(url, scope);
    } catch (e) {
      expect(e).to.be.instanceOf(Error);
      expect(e.message).to.eql(`net::ERR_NAME_NOT_RESOLVED at ${url}`);
    }
  });

  it('handles complex examples', async () => {
    const url = 'https://www.thebodyshop.com/en-ca/sale/h/h00008';
    const scope = '.amp-dc-card-item';
    const fields = [{
      headline: '.amp-dc-card-item__text-content h3',
      details: '.amp-dc-card-item__body-copy-1 p',
      learnMoreUrl: 'a@href',
    }];
    const output = await x(url, scope, fields);
    expect(Array.isArray(output)).to.equal(true);
  });

  it('correctly crawls sites using scrolling', async () => {
    const items = await x('https://www.canadiantire.ca/en/hot-deals.html?adlocation=HP_ASPOT_HotSummerDeals_21327', '.temporary-grid-item', [{
      product: '.product-tile-srp a@href',
      headline: 'img@alt',
      imageUrl: 'img@src',
    }]);
    expect(items.length).to.equal(36);
  });

  it('should handle sites with redirections', async () => {
    const url = 'https://www.yankeecandle.com';
    const scope = 'body';
    const fields = {
      headline: ['h3']
    };
    const output = await x(url, scope, fields);
    expect(Array.isArray(output.headline)).to.equal(true);
  });

  it('should stealth on cloudflare protected sites', async () => {
    const url = 'https://www.yankeecandle.com';
    const scope = 'title';
    const output = await x(url, scope);
    expect(output.indexOf('Cloudflare')).to.equal(-1);
  });

  it('should scrape slow sites', async () => {
    const url = 'https://www.footlocker.ca/en/';
    const scope = 'title';
    const output = await x(url, scope);
    expect(output.indexOf('Cloudflare')).to.equal(-1);
  });
});
