const parser = require("accept-language-parser");
const defaultProps = {
  default: "en"
};

module.exports = function(props) {
  const options = Object.assign({}, defaultProps, props);

  return function(req, res, next) {
    if (req.headers && req.headers["accept-language"] != null) {
      let languages = parser.parse(req.headers["accept-language"]);

      if (options.supported) {
        languages = languages.filter(function(language) {
          return options.supported.includes(language.code);
        });
      }

      if (languages[0] != null) {
        req.language = languages[0].code;

        req.locale = `${languages[0].code}${
          languages[0].region ? "-" + languages[0].region : ""
        }`;
      }
    }

    if (
      req.language == null ||
      (options.supported && !options.supported.includes(req.language))
    ) {
      req.language = options.default;
      req.locale = options.default;
    }
    next();
  };
};
