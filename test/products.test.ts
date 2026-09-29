import test from 'node:test';
import assert from 'node:assert/strict';

import {
  findProductById,
  deleteProduct,
  searchProducts,
} from '../src/products.js';

test('1. findProductById returns an existing product', () => {
  const product = findProductById('p_1');

  assert.ok(product);
  assert.strictEqual(product!.name, 'Wireless Mouse');
  assert.strictEqual(product!.price, 2500);
});

test('2. findProductById returns undefined for an unknown product', () => {
  const product = findProductById('p_unknown');

  assert.strictEqual(product, undefined);
});

test('3. searchProducts finds products by partial name', () => {
  const results = searchProducts('Mouse');

  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0]!.id, 'p_1');
});

test('4. searchProducts is case-insensitive', () => {
  const results = searchProducts('mouse');

  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].id, 'p_1');
});

test('5. searchProducts supports uppercase queries', () => {
  const results = searchProducts('KEYBOARD');

  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0]!.id, 'p_2');
});

test('6. searchProducts returns multiple matching products', () => {
  const results = searchProducts('m');

  assert.deepStrictEqual(
    results.map((product) => product.id),
    ['p_1', 'p_2', 'p_4']
  );
});

test('7. searchProducts returns an empty array for an unknown query', () => {
  const results = searchProducts('laptop');

  assert.deepStrictEqual(results, []);
});

test('8. searchProducts returns an empty array for an empty query', () => {
  const results = searchProducts('');

  assert.deepStrictEqual(results, []);
});

test('9. searchProducts ignores surrounding whitespace', () => {
  const results = searchProducts('  mouse  ');

  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].id, 'p_1');
});

test('10. searchProducts does not modify the product catalog', () => {
  const before = findProductById('p_1');

  searchProducts('mouse');

  const after = findProductById('p_1');

  assert.deepStrictEqual(after, before);
});

test('11. deleteProduct removes an existing product', () => {
  const result = deleteProduct('p_2');

  assert.strictEqual(result, true);
  assert.strictEqual(findProductById('p_2'), undefined);
});

test('12. deleteProduct returns false for an unknown product', () => {
  const result = deleteProduct('p_unknown');

  assert.strictEqual(result, false);
});

test('13. deleteProduct returns false when deleting the same product twice', () => {
  deleteProduct('p_3');

  const secondAttempt = deleteProduct('p_3');

  assert.strictEqual(secondAttempt, false);
});

test('14. deleteProduct does not affect other products', () => {
  deleteProduct('p_4');

  // p_2 and p_3 were already deleted by tests 11 and 13 above (shared module-level
  // PRODUCTS array, no reset between tests) - p_1 is the only product no prior test
  // has touched, so it's the only valid "unaffected" check.
  assert.ok(findProductById('p_1'));
});
