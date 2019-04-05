const t = require("tap");
const sinon = require("sinon");
const acceptLanguageMiddleware = require("../index");
const MockExpressRequest = require("mock-express-request");

const mockRequest = acceptLanguageHeader =>
  new MockExpressRequest({
    headers: {
      "Accept-Language": acceptLanguageHeader
    }
  });

t.test("Calls next", function(t) {
  const mockNext = sinon.fake();
  const middleware = acceptLanguageMiddleware();
  middleware({}, {}, mockNext);
  t.ok(mockNext.called);
  t.end();
});

t.test("Adds language to the req", function(t) {
  const middleware = acceptLanguageMiddleware();
  const req = mockRequest("es");
  middleware(req, {}, sinon.fake());
  t.equal(req.language, "es");
  t.end();
});

t.test(
  "Adds language to the req if header contains language + region",
  function(t) {
    const middleware = acceptLanguageMiddleware();
    const req = mockRequest("en-GB");
    middleware(req, {}, sinon.fake());
    t.equal(req.language, "en");
    t.end();
  }
);

t.test("Should respect the quality attributes", function(t) {
  const middleware = acceptLanguageMiddleware();
  const req = mockRequest("zh-CN;q=0.8,en-US;q=1");
  middleware(req, {}, sinon.fake());
  t.equal(req.language, "en");
  t.end();
});

t.test("Should get a language without region but with quality", function(t) {
  const middleware = acceptLanguageMiddleware();
  const req = mockRequest("es;q=0.8");
  middleware(req, {}, sinon.fake());
  t.equal(req.language, "es");
  t.end();
});

t.test("Should get a language from a set", function(t) {
  const middleware = acceptLanguageMiddleware();
  const req = mockRequest("fr-CA,fr;q=0.8");
  middleware(req, {}, sinon.fake());
  t.equal(req.language, "fr");
  t.end();
});

t.test("Should parse a wildcard", function(t) {
  const middleware = acceptLanguageMiddleware();
  const req = mockRequest("fr-CA,*;q=0.8");
  middleware(req, {}, sinon.fake());
  t.equal(req.language, "fr");
  t.end();
});

t.test("Should parse a complex set", function(t) {
  const middleware = acceptLanguageMiddleware();
  const req = mockRequest("fr-CA,fr;q=0.8,en-US;q=0.6,en;q=0.4,*;q=0.1");
  middleware(req, {}, sinon.fake());
  t.equal(req.language, "fr");
  t.end();
});

t.test("Should cope with whitespace", function(t) {
  const middleware = acceptLanguageMiddleware();
  const req = mockRequest("fr-CA, fr;q=0.8,  en-US;q=0.6,en;q=0.4,    *;q=0.1");
  middleware(req, {}, sinon.fake());
  t.equal(req.language, "fr");
  t.end();
});

t.test("Should cope with scripts", function(t) {
  const middleware = acceptLanguageMiddleware();
  const req = mockRequest("zh-Hant-cn");
  middleware(req, {}, sinon.fake());
  t.equal(req.language, "zh");
  t.end();
});

t.test("If no header is present, uses the default language of en", function(t) {
  const middleware = acceptLanguageMiddleware();
  const req = mockRequest();
  delete req.headers["accept-language"];
  middleware(req, {}, sinon.fake());
  t.equal(req.language, "en");
  t.end();
});

t.test("If no header is present, uses the passed default", function(t) {
  const middleware = acceptLanguageMiddleware({ default: "el" });
  const req = mockRequest();
  delete req.headers["accept-language"];
  middleware(req, {}, sinon.fake());
  t.equal(req.language, "el");
  t.end();
});

t.test("Sets the language if it is first in the supported list", function(t) {
  const middleware = acceptLanguageMiddleware({ supported: ["zh", "en"] });
  const req = mockRequest("zh-Hant-cn");
  middleware(req, {}, sinon.fake());
  t.equal(req.language, "zh");
  t.end();
});

t.test("Sets the language if it is last in the supported list", function(t) {
  const middleware = acceptLanguageMiddleware({ supported: ["zh", "en"] });
  const req = mockRequest("en-GB");
  middleware(req, {}, sinon.fake());
  t.equal(req.language, "en");
  t.end();
});

t.test(
  "Sets the language to the default en if it is not in the supported list",
  function(t) {
    const middleware = acceptLanguageMiddleware({ supported: ["zh", "en"] });
    const req = mockRequest("fr");
    middleware(req, {}, sinon.fake());
    t.equal(req.language, "en");
    t.end();
  }
);

t.test(
  "Sets the language to the passed default if it is not in the supported list",
  function(t) {
    const middleware = acceptLanguageMiddleware({
      supported: ["zh", "en"],
      default: "zh"
    });
    const req = mockRequest("fr");
    middleware(req, {}, sinon.fake());
    t.equal(req.language, "zh");
    t.end();
  }
);

t.test("Sets the language to the default en if the header is garbage", function(
  t
) {
  const middleware = acceptLanguageMiddleware();
  const req = mockRequest("1231241");
  middleware(req, {}, sinon.fake());
  t.equal(req.language, "en");
  t.end();
});

t.test(
  "Sets the language to the passed default if the header is garbage",
  function(t) {
    const middleware = acceptLanguageMiddleware({ default: "zh" });
    const req = mockRequest("1231241");
    middleware(req, {}, sinon.fake());
    t.equal(req.language, "zh");
    t.end();
  }
);

t.test(
  "Sets the language to the passed default if the header is blank string",
  function(t) {
    const middleware = acceptLanguageMiddleware({ default: "zh" });
    const req = mockRequest("");
    middleware(req, {}, sinon.fake());
    t.equal(req.language, "zh");
    t.end();
  }
);
