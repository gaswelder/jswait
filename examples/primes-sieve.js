const sieve = (list, prime) => {
  const list1 = list.afilter((x) => x <= prime);
  const list2 = list.afilter((x) => x > prime).afilter((x) => x % prime !== 0);
  if (list2.length === 0) {
    return list1.concat(list2);
  }
  return sieve(list1.concat(list2), list2[0]);
};

const range = (from, to, step) => {
  if (from > to) return [];
  return [from, ...range(from + step, to, step)];
};

console.log(sieve(range(2, 1000, 1), 2));
