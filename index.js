const parser = require("accept-language-parser");
const defaultProps = {
  default: "en"
};

module.exports = function(props) {
  const options = Object.assign({}, defaultProps, props);

  return function(req, res, next) {
    if (req.headers && req.headers["accept-language"] != null) {
      const parseResult = parser.parse(req.headers["accept-language"]);

      if (parseResult[0] != null) {
        req.language = parseResult[0].code;
      }
    }

    if (
      req.language == null ||
      (options.supported && !options.supported.includes(req.language))
    ) {
      req.language = options.default;
    }
    next();
  };
};
