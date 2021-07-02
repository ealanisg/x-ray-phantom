# x-ray-nightmare

A modern [nightmare](https://github.com/segmentio/nightmare)-based driver for [x-ray](https://github.com/lapwinglabs/x-ray).

Forked from [x-ray-phantom](https://github.com/lapwinglabs/x-ray-phantom).

## Installation

```
// add to package.json
"x-ray-nightmare": "github:cayleyh/x-ray-phantom#nightmare",
```

## Usage

Basic usage should be the same as [request-x-ray](https://github.com/jspri/request-x-ray):

```js
var nightmare = require('x-ray-nightmare');
var Xray = require('x-ray');

var x = Xray()
  .driver(nightmare());

x('http://google.com', 'title')(function(err, str) {
  if (err) return done(err);
  assert.equal('Google', str);
  done();
})
```

## API

### driver([options])

Initialize the nightmare driver. Returns an X-Ray driver function with the nightmare instance saved as `fn.instance` property.

#### Options

`options` arg is passed direct to Nightmare. The following are custom options that configure the driver itself:

##### useragent

Sets a custom User Agent during instance setup via `nightmare.useragent()`.

## Test

```
npm install
npm run test
```

## License

MIT
