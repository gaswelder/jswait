# JS-wait

This is a proof of concept for a "sync" flavor of Javascript.
It simply prefixes all functions with the `async` keyword and all function calls with the `await` operator.
Obviously, this is not suitable for production.

## The problem

Originally Javascript was intended for the trivial task of reacting to user interactions in the browser.
Thus the language didn't have blocking calls, leading eventually to the proliferation of callbacks and promises.

After the `await` operator was introduced, the language became more suitable for writing nontrivial backends, but one problem remains: functions have to be annotated with the `async` keyword and the calls have to be prefixed.
This is a problem because the async property, just as any monadic property, is "viral" and has to be applied to entire function trees.
Suppose, for example, we have this code:

```js
const main = () => {
  console.log(getBalance("bob"));
};
const getBalance = username => getUser(username).balance;
const getUser = username => global.users[username];
```

and we decide to change the implementation of `getUser` like this:

```js
const getUser = async username => (await db()).getUser({ username });
```

This would not be a problem in other popular languages like Go, Java, PHP, Python,
but in Javascript the functions `getBalance` and `main` have to be "fixed" too.

## Examples

A straightworward example is the one where you don't have to worry about promises:

```js
// example.js
function get(url) {
  return new Promise((ok, fail) => {
    http
      .get(url, res => {
        let rawData = "";
        res.on("data", chunk => {
          rawData += chunk;
        });
        res.on("end", () => {
          ok(rawData);
        });
      })
      .on("error", e => {
        fail(e);
      });
  });
}

const x = get("http://nodejs.org/dist/index.json");
console.log(x);
```

When run as `node example.js`, it prints `Promise { <pending> }`.
When run as `node jswait example.js`, it prints the actual response.

Another interesting side effect is that this flavor of Javascript is capable of infinite recursion:

```js
// loop.js
const loop = x => {
  console.log(x);
  return loop(x + 1);
};
loop(1);
```

In functional languages recursion is usually not a problem, but the example above crashes with a stack overflow error if run as `node loop.js`:

```
14045
14046
14047
util.js:626
function formatPrimitive(fn, value) {
                        ^
RangeError: Maximum call stack size exceeded
```

But when run as `node jswait loop.js`, it acually runs indefinitely because the code is translated into an async function, and async functions are scheduled on the loop without wasting the stack:

```
...
891193
891194
891195
891196
^C
```
