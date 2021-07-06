const Xray = require('x-ray');
const driver = require('./');
const expect = require('chai').expect;

const x = Xray()
  .driver(driver());

describe('x-ray-puppeteer', () => {
  it('correctly crawls sites', async () => {
    const title = await x('https://www.thebodyshop.com/en-ca/sale/h/h00008', 'title');
    expect(title).to.equal('The Body Shop');
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
    expect(output).to.deep.equal([]); // No results
  });

  it('correctly crawls sites using scrolling', async () => {
    const items = await x('https://www.canadiantire.ca/en/hot-deals.html?adlocation=HP_ASPOT_HotSummerDeals_21327', '.temporary-grid-item', [{
      product: '.product-tile-srp a@href',
      headline: 'img@alt',
      imageUrl: 'img@src',
    }]);
    expect(items.length).to.equal(36);
  });
});
