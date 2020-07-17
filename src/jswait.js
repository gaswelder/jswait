const acorn = require("acorn");
const acornwalk = require("acorn-walk");
const escodegen = require("escodegen");
const fs = require("fs");
const { imp } = require("./import");

const convertModule = (src) => {
  const tree = acorn.parse(src);
  acornwalk.simple(tree, {
    FunctionDeclaration(node) {
      node.async = true;
    },
    FunctionExpression(node) {
      node.async = true;
    },
    ArrowFunctionExpression(node) {
      node.async = true;
    },
    MethodDefinition(node) {
      node.value.async = node.kind != "constructor";
    },
    CallExpression(node) {
      const argument = { ...node };
      node.type = "AwaitExpression";
      node.argument = argument;
    },
  });
  return `(async () => {${escodegen.generate(tree)}})();`;
};

const map = Array.prototype.map;

Array.prototype.amap = function (callback) {
  return Promise.all(map.call(this, callback));
};

Array.prototype.afilter = function (callback) {
  return this.amap(callback).then((predicates) => {
    const r = [];
    for (let i = 0; i < this.length; i++) {
      if (predicates[i]) {
        r.push(this[i]);
      }
    }
    return r;
  });
};

const main = (args) => {
  const src = fs.readFileSync(args[1]);
  const js = convertModule(src);
  global.imp = imp;
  eval(js);
};

main(process.argv.slice(1));
