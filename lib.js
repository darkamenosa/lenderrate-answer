const nj = require('numjs');
const _ = require('lodash');

/**
 * Initial maxtrix
 * 
 * @param n: matrix size (n x n)
 * @return matrix[n x n]
 */
function createMatrix(n) {
  return nj.arange(n * n).reshape(n, n);
}

/**
 * Rotate matrix 90 degree
 * @param  numjs matrix[m x n]
 * @return rotated matrix
 */
function rot90(arr) {
  // Transpose and reverse
  let rotated = arr.T.slice(null, [null, null, -1]);

  // Fix bug strides of numjs
  rotated = nj.flatten(rotated).reshape(rotated.shape);

  return rotated;
}


/**
 * Merge child matrix to parent matrix.
 * We have to write this function due to the limitation of numjs API.
 *
 * Numpy numer one =)))
 *
 * @deprecated: Remove this function out of run function.
 * 
 * @param  { array } parentMat [Parent matrix]
 * @param  { array } childMat  [Child matrix]
 * @param  { int } startRow [child start row index]
 * @param  { int } startCol [child start col index]
 * @return Merged matrix
 */
function mergeChild(parentMat, childMat, startRow, startCol) {

  const [rows, cols] = childMat.shape;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let ip = i + startRow;
      let jp = j + startCol;
      parentMat.set(ip, jp, childMat.get(i, j));
    } 
  }

  return parentMat;
}


/**
 * Find indexes of a number in a matrix.
 * 
 * @param  { array } mat [ Input matrix ]
 * @param  { int } num [ Input number ]
 * 
 * @return array[row, rol] 1-based indexes or undefined if not found.
 */
function findIndexes(mat, num) {
  const [rows, cols] = mat.shape;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (mat.get(i, j) == num) {
        return [i + 1, j + 1];
      }
    } 
  }
}

/**
 * Check if an index is in rotate range or not.
 * @param  { array }  indexes [index array [x, y], 1-based index]
 * @param  { int }  start_x [start index to compare] 1-based index]
 * @param  { int }  start_y [end index to compare] 1-based index]
 * @param  { int }  d       [width of range]
 * @return {Boolean} true if indexes is in rotate range, false if not.
 */
function isInRotatedRange(indexes, start_x, start_y, d) {
  // Check null or undefined indexes
  if (!indexes) {
    return false;
  };

  let [x, y] = indexes;

  const compare_x = (x >= start_x) && (x <= start_x + d);
  const compare_y = (y >= start_y) && (y <= start_y + d);

  // console.log(`x:${x}, y: ${y}, start_x:${start_x}, start_y:${start_y}, d:${d}`);

  return compare_x && compare_y;
}

/**
 * Run and resolve the exercise.
 * @param  { int } n  [ Matrix size ]
 * @param  { int } s  [ Size of input ]
 * @param  { array } sInputs [ array[s x 3] of inputs by s]
 * @param  { array } lInputs [ array[L x 1] of inputs by L]
 */
function run(n, s, sInputs, lInputs, debug) {
  const mat = createMatrix(n);
  const res = [];

  // const reverse_lInputs = nj.array(lInputs).slice([null,null,-1]).tolist();
  
  for (let i = 0; i < s; i++) {
    [a, b, d] = sInputs[i];
    
    // Prevent out of index exception
    if (i >= lInputs.length) {
      break; 
    }

    const lInput = lInputs[i];
    const res_indexes = findIndexes(mat, lInput);

    // Check if indexes is in rorated range or not
    // If not in rotated range:
    //    Return indexes
    // If in rorated range:
    //    Compute rotated indexes.
    if (isInRotatedRange(res_indexes, a, b, d)) {
      // I refer python style variable name
      // easier to read

      // Slice matrix based on S input
      let small_mat = mat.slice([a - 1, a + d], [b - 1, b + d]);

      // Rotate sliced matrix
      let small_mat_rot90 = rot90(small_mat);
      const rot_indexes = findIndexes(small_mat_rot90, lInput);
    
      // Only put found indexes to result.
      if (rot_indexes) {
        const [x_rot, y_rot] = rot_indexes;

        // Compute rotated indexs and current indexes
        res.push([a - 1 + x_rot, b - 1 + y_rot]);
      }

    } else {
      if (res_indexes) {
        res.push(res_indexes);  
      }
    }
  }

  return res;
}


// Validate functions
function validN(n) {
  return (_.isNumber(n) && n <= 10**7)
}

function validS(s) {
  return (_.isNumber(s) && s <= 10**5)
}

function validL(l) {
 return (_.isNumber(l) && l <= 10**5) 
}

function validSInputs(inputs, N, debug) {
  let result = true;

  for (let i = 1; i < inputs.length; i++) {
    // minus i -> mi
    const [ami, bmi, dmi] = inputs[i - 1];
    const [ai, bi, di] = inputs[i];

    if (debug) {
      console.log(`ami:${ami}, bmi: ${bmi}, dmi: ${dmi}`);
      console.log(`ai:${ai}, bi: ${bi}, di: ${di}`);
    }

    // 1 <= a[i], b[i] and 0 <= d[i] < N
    // a[i-1] <= a[i] and a[i] + d[i] <= a[i - 1] + d[i - 1]
    // b[i-1] <= b[i] and b[i] + d[i] <= b[i - 1] + d[i - 1]
    
    const step1 = (1 <= ami) && (1 <= bmi) && (dmi >= 0) && (dmi < N);
    const step2 = (1 <= ai) && (1 <= bi) && (di >= 0) && (di < N);
    const step3 = (ami <= ai) && ((ai + di) <= (ami + dmi));
    const step4 = (bmi <= bi) && ((bi + di) <= (bmi + dmi));

    result = result && step1 && step2 && step3 && step4;

    if (debug) {
      console.log('(1 <= ami) && (1 <= bmi) && (dmi >= 0) && (dmi < N): ', step1);
      console.log('(1 <= ai) && (1 <= bi) && (di >= 0) && (di < N): ', step2);
      console.log('(ami <= ai) && ((ai + di) <= (ami + dmi)): ', step3);
      console.log('(bmi <= bi) && ((bi + di) <= (bmi + dmi)): ', step4);
    }
  }

  return result;
}

function validLInputs(inputs, N) {
  let result = true;
  const NSquare = N**2;
  for (let i = 0; i < inputs.length; i++) {
    wi = inputs[i];

    // w[i] (0 <= w[i] < N^2)
    result = result && (wi >= 0) && (wi < NSquare);
  }
  return result;
}

module.exports = {
  // Validate functions,
  validN,
  validS,
  validSInputs,
  validL,
  validLInputs,

  // Core functions,
  createMatrix,
  rot90,
  isInRotatedRange,
  mergeChild,
  findIndexes,
  run,
};
