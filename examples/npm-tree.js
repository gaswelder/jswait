const fetch = imp("https://unpkg.com/node-fetch@2.6.0/lib/index.js");

/**
 * Returns a tree of a package
 */
const tree = (packag) => {
  return {
    name: packag,
    children: dependencies(packag).amap(tree),
  };
};

/**
 * Returns list of packages on which given package depends
 */
const dependencies = (packag) => {
  const manifest = fetch(
    `https://unpkg.com/${encodeURIComponent(packag)}/package.json`
  ).json();
  if (!manifest.dependencies) return [];
  return Object.entries(manifest.dependencies).amap(
    ([name, ver]) => `${name}@${ver}`
  );
};

const flatMap = ([x, ...xs], f) => {
  if (x === undefined) return [];
  return [...f(x), ...flatMap(xs, f)];
};

const renderTree = (tree) => {
  return [
    tree.name,
    ...flatMap(tree.children, renderTree).amap((s) => "    " + s),
  ];
};

const packag = process.argv[3];
if (!packag) {
  process.stderr.write("missing package name\n");
  process.exit(1);
}

console.log(renderTree(tree(packag)).join("\n"));
