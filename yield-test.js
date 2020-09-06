function* foo(index) {
  while (index < 2) {
    console.log("yield return:", yield index);
    index++;
  }
}

const iterator = foo(0);

console.log(iterator.next("hha").value);
// expected output: 0

console.log(iterator.next().value);
// expected output: 1
