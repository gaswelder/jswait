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

const x = get("https://nodejs.org/dist/index.json");
console.log(x);
