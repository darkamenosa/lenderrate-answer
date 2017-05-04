const nj = require('numjs');

const createMatrix = require('./lib').createMatrix;
const rot90        = require('./lib').rot90;
const mergeChild   = require('./lib').mergeChild;
const findIndexes  = require('./lib').findIndexes;
const run          = require('./lib').run;
const validN       = require('./lib').validN;
const validS       = require('./lib').validS;
const validSInputs = require('./lib').validSInputs;
const validL       = require('./lib').validL;
const validLInputs = require('./lib').validLInputs;

test('Test create maxtrix', () => {
	expect(createMatrix(3)).toEqual(nj.array([
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
	]));
});

test('Test rot90', () => {
  // Square maxtrix test
  const arr_1 = nj.array([
    [9 , 10, 11, 12],
    [16, 17, 18, 19],
    [23, 24, 25, 26],
    [30, 31, 32, 33],
  ]);

  const expected_1 = nj.array([
    [30, 23, 16, 9 ],
    [31, 24, 17, 10],
    [32, 25, 18, 11],
    [33, 26, 19, 12],
  ]);

  expect(rot90(arr_1)).toEqual(expected_1);

  // Not square maxtrix test
  const arr_2 = nj.array([
    [9 , 10],
    [16, 17],
    [23, 24],
    [30, 31],
  ]);

  const expected_2 = nj.array([
    [30, 23, 16, 9 ],
    [31, 24, 17, 10],
  ]);

  expect(rot90(arr_2)).toEqual(expected_2);
});

test('Test merge child', () => {
  const parent = nj.array([
    [0 , 1 , 2 , 3 , 4 , 5 , 6 ],
    [7 , 8 , 9 , 10, 11, 12, 13],
    [14, 15, 16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25, 26, 27],
    [28, 29, 30, 31, 32, 33, 34],
    [35, 36, 37, 38, 39, 40, 41],
    [42, 43, 44, 45, 46, 47, 48],
  ]);

  const child = nj.array([
    [30, 23, 16, 9 ],
    [31, 24, 17, 10],
    [32, 25, 18, 11],
    [33, 26, 19, 12],
  ]);

  const expected = nj.array([
    [0 , 1 , 2 , 3 , 4 , 5 , 6 ],
    [7 , 8 , 30, 23, 16, 9 , 13],
    [14, 15, 31, 24, 17, 10, 20],
    [21, 22, 32, 25, 18, 11, 27],
    [28, 29, 33, 26, 19, 12, 34],
    [35, 36, 37, 38, 39, 40, 41],
    [42, 43, 44, 45, 46, 47, 48],
  ]);

  expect(mergeChild(parent, child, 1, 2)).toEqual(expected);
});


test('Test find indexes', () => {
  const mat = nj.array([
    [0 , 1 , 2 , 3 , 4 , 5 , 6 ],
    [7 , 8 , 30, 23, 16, 9 , 13],
    [14, 15, 31, 24, 17, 10, 20],
    [21, 22, 32, 25, 18, 11, 27],
    [28, 29, 33, 26, 19, 12, 34],
    [35, 36, 37, 38, 39, 40, 41],
    [42, 43, 44, 45, 46, 47, 48],
  ]);

  expect(findIndexes(mat, 24)).toEqual([3, 4]);
});

test('Test run excersice', () => {
  const n = 7;
  const s = 2;
  const inputs = [[1, 2, 4], [2, 3, 3]];

  const l_inputs = [11, 24];

  const expected = [[4, 5], [3, 4]];
  expect(run(n, s, inputs, l_inputs/*, true*/)).toEqual(expected);
});

test('Test validate N', () => {
  // false case
  expect(validN(10**7 + 1)).toEqual(false);
  expect(validN(null)).toEqual(false);
  expect(validN(undefined)).toEqual(false);
  expect(validN('123.xxx')).toEqual(false);

  // true case
  expect(validN(10**7)).toEqual(true);
  expect(validN(1)).toEqual(true);
});

test('Test validate S', () => {
  // false case
  expect(validS(10**5 + 1)).toEqual(false);
  expect(validS(null)).toEqual(false);
  expect(validS(undefined)).toEqual(false);
  expect(validS('123.xxx')).toEqual(false);

  // true case
  expect(validS(10**5)).toEqual(true);
  expect(validS(1)).toEqual(true);
});

test('Test validate S inputs', () => {
  const N = 7;
  // false case
  expect(validSInputs([[2, 3, 3], [1, 2, 4]], N)).toEqual(false);

  // Negative values
  expect(validSInputs([[-1, 1, 2], [2, 1, 1]], N)).toEqual(false);
  expect(validSInputs([[1, -1, 2], [2, 1, 1]], N)).toEqual(false);

  expect(validSInputs([[1, 2, 4], [2, -3, 3]], N)).toEqual(false);
  expect(validSInputs([[2, 3, 4], [2, 4, -3]], N)).toEqual(false);

  // true case
  expect(validSInputs([[1, 2, 4], [2, 3, 3]], N)).toEqual(true);
  expect(validSInputs([[2, 3, 4], [2, 4, 3]], N)).toEqual(true);
});

test('Test validate L', () => {
  // false case
  expect(validL(10**5 + 1)).toEqual(false);
  expect(validL(null)).toEqual(false);
  expect(validL(undefined)).toEqual(false);
  expect(validL('123.xxx')).toEqual(false);

  // true case
  expect(validL(10**5)).toEqual(true);
  expect(validL(1)).toEqual(true);
});

test('Test validate L inputs', () => {
  const N = 7;
  // false case
  expect(validLInputs([0, 10, 49], 7)).toEqual(false);
  expect(validLInputs([-1, 10, 14], 7)).toEqual(false);

  // true case
  expect(validLInputs([0, 2, 48], 7)).toEqual(true);
  expect(validLInputs([1, 3, 28], 7)).toEqual(true);
});