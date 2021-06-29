# x-ray-nightmare

  nightmare driver for [x-ray](https://github.com/lapwinglabs/x-ray).

## Installation

```
// add to package.json
"x-ray-nightmare": "github:cayleyh/x-ray-phantom#nightmare",
```

## Usage

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

### nightmare([options])

Initialize the nightmare driver with `options` being passed to Nightmare.

## Test

```
npm install
npm run test
```

## License

MIT
