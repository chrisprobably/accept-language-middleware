# accept-language-middleware

Express middleware for parsing the Accept-Language header.

## Quick Start

Install using:

`npm i accept-language-middleware`

or:

`yarn add accept-language-middleware`

Usage:

```
var express = require('express');
var app = express();
var acceptLanguageMiddleware = require("accept-language-middleware");

app.use(acceptLanguageMiddleware());
app.get('/', function(req, res, next) {
  console.log(req.language); // 'en'
  console.log(req.locale); // 'en-US'
});
```

## Options

### default (the default is en)

Specify a default language to fallback on if none is passed:

```
app.use(acceptLanguageMiddleware({ default: "es" }));
```

### supported (by default all languages are supported)

Specify a set of supported languages, if the incoming Accept-Language header does not contain a language in the supported list, then the default language will be used.

```
app.use(acceptLanguageMiddleware({ supported: ["en", "es", "zh"] }));
```

## Thanks

Based on the awesome: https://github.com/opentable/accept-language-parser

## License

MIT
