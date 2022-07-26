function loopyLighthouse(range, multiples, words) {
  for (let i = range[0]; i <= range[1]; i++) {
    let output = "";
    if (i % multiples[0] === 0) {
      output += words[0];
    }
    if (i % multiples[1] === 0) {
      output += words[1];
    }
    if (!output) {
      output += i;
    }
    console.log(output);
  }
}

loopyLighthouse([15, 90], [2, 5], ["Batty", "Beacon"]);
