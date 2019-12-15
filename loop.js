const loop = x => {
  console.log(x);
  return loop(x + 1);
};

loop(1);
