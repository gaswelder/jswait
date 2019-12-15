const acorn = require("acorn");
const acornwalk = require("acorn-walk");
const escodegen = require("escodegen");
const fs = require("fs");

const convertModule = src => {
  const tree = acorn.parse(src);
  acornwalk.simple(tree, {
    FunctionDeclaration(node) {
      node.async = true;
    },
    ArrowFunctionExpression(node) {
      node.async = true;
    },
    CallExpression(node) {
      const argument = { ...node };
      node.type = "AwaitExpression";
      node.argument = argument;
    }
  });
  return `(async () => {${escodegen.generate(tree)}})();`;
};

const main = args => {
  const src = fs.readFileSync(args[1]);
  const js = convertModule(src);
  eval(js);
};

main(process.argv.slice(1));
