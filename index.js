const readlineSync = require('readline-sync');
const invariant = require('invariant');
const lib = require('./lib');

/**
 * 1. Get inputs and validate inputs.
 *    Throw exception when validate fail, stop the app.
 *    
 * 2. Compute and print output.
 */
function main() {
  let n = readlineSync.question('Enter N:').trim();
  n = parseInt(n);
  invariant(lib.validN(n), 'N must be int and N <= 10^7');
  

  let s = readlineSync.question('Enter S:').trim();
  s = parseInt(s);
  invariant(lib.validS(s), 'S must be int and S <= 10^5');
  

  const inputs = [];
  for (let i = 0; i < s; i++) {
    const input = readlineSync.question('> ').trim();
    // TODO: Validate input
    const arr = input.split(' ');
    // inputs length must be > 3
    invariant(arr.length >= 3,
      'Cannot split S input, S input must be [number number number] (ignore [])');
    let [a, b, d] = arr;
    
    // Convert from string to int
    a = parseInt(a.trim());
    b = parseInt(b.trim());
    d = parseInt(d.trim());

    inputs.push([a, b, d]);
  }

  
  invariant(lib.validSInputs(inputs, n), `
    S inputs must satify: 

    1 <= a[i], b[i] and 0 <= d[i] < N
    a[i-1] <= a[i] and a[i] + d[i] <= a[i - 1] + d[i - 1]
    b[i-1] <= b[i] and b[i] + d[i] <= b[i - 1] + d[i - 1]
  `);

  let l = readlineSync.question('Enter L:').trim();
  l = parseInt(l);
  invariant(lib.validL(l), 'L must be int and L <= 10^5');
  

  const lInputs = [];
  for (let i = 0; i < l; i++) {
    const lIn = readlineSync.question('> ').trim();
    // TODO: vaidate lIn
    lInputs.push(parseInt(lIn));
  }

  invariant(lib.validLInputs(lInputs, n), `
    L inputs must satify:
    w[i] (0 <= w[i] < N^2)
  `);

  console.log('Computing output ... ');

  // Compute results
  const results = lib.run(n, s, inputs, lInputs);

  console.log('Output:');
  // Print output
  results.forEach((res) => {
    [resRow, resCol] = res;
    console.log(`${resRow} ${resCol}`);
  });
}

// Run the application
main();
