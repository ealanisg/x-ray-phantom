const Xray = require('x-ray');
const driver = require('./');
const expect = require('chai').expect;

const x = Xray()
  .driver(driver());

// Wrapper to help writing async tests
const awaitCrawl = async (inst) => new Promise((res, err) => inst.then(res).catch(err));

describe('x-ray-phantom', () => {
  it('correctly crawls sites', async () => {
    const title = await awaitCrawl(x('https://www.thebodyshop.com/en-ca/sale/h/h00008', 'title'));
    expect(title).to.equal('Beauty & Skincare Sale | Makeup Sale | The Body Shop®');
  });

  it('handles complex examples', async () => {
    const url = 'https://www.thebodyshop.com/en-ca/';
    const scope = '.amp-dc-card-item';
    const fields = [{
      subHeadline: '.amp-dc-card-item__body-copy-1 h2:nth-child(1)',
      headline: '.amp-dc-card-item__body-copy-1 h2:nth-child(2)',
      details: '.amp-dc-card-item__body-copy-1 p:nth-child(3)',
      legal: '.amp-dc-card-item__body-copy-1 p:nth-child(4)',
      learnMoreUrl: 'a@href',
      imageUrl: 'img@src',
    }];

    const output = await awaitCrawl(x(url, scope, fields));
    console.log(output);
  });
});
