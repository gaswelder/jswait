const http = require("https");

function get(url) {
  return new Promise((ok, fail) => {
    http
      .get(url, (res) => {
        const { statusCode } = res;
        if (statusCode !== 200) {
          // Consume response data to free up memory
          res.resume();
          fail(new Error("Request Failed.\n" + `Status Code: ${statusCode}`));
          return;
        }
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          ok(rawData);
        });
      })
      .on("error", (e) => {
        fail(e);
      });
  });
}

/**
 * Parses module source code and returns its exports.
 */
const parseModule = (src) => {
  const backup = module.exports;

  module.exports = {};
  exports = module.exports;
  eval(src);

  const m = exports;
  module.exports = backup;
  exports = module.exports;
  return m;
};

const imp = (url) => get(url).then(parseModule);

module.exports = {
  imp,
};
