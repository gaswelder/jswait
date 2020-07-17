const xs = [1, 2, 3, 4, 5];

const evens = xs.afilter((x) => x % 2 === 0);

console.log(evens);

const inc = xs.amap((x) => x + 1);

console.log(inc);
