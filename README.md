# x-ray-puppeteer

A modern [puppeteer](https://github.com/puppeteer/puppeteer)-based driver for [x-ray](https://github.com/lapwinglabs/x-ray).

Forked from [x-ray-phantom](https://github.com/lapwinglabs/x-ray-phantom).

## Installation

```
// add to package.json
"x-ray-puppeteer": "git+https://git@github.com/ealanisg/x-ray-puppeteer.git#main",
```

## Usage

Basic usage should be the same as [request-x-ray](https://github.com/jspri/request-x-ray):

```js
var puppeteer = require('x-ray-puppeteer');
var Xray = require('x-ray');

var x = Xray()
  .driver(puppeteer());

x('http://google.com', 'title')(function(err, str) {
  if (err) return done(err);
  assert.equal('Google', str);
  done();
})
```

## API

### driver([options])

Initialize the puppeteer driver. Returns an X-Ray driver function with the puppeteer instance saved as `fn.instance` property.

#### Options

`options` arg is passed direct to puppeteer. The following are custom options that configure the driver itself:

##### useragent

Sets a custom User Agent during instance setup via `page.setUserAgent()` or a default one will be used.

## Test

```
yarn install
yarn test
```

## License

MIT
