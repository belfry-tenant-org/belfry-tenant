import test from 'node:test';
import assert from 'node:assert/strict';
import { getFinalPrice, purchaseProduct } from '../src/catalog.js';
import { findProductById } from '../src/products.js';

test('1. getFinalPrice applies a percentage discount', () => {
  const product = findProductById('p_2')!; // price 7500, discount 10%
  assert.strictEqual(getFinalPrice(product), 6750);
});

test('2. getFinalPrice returns the full price when there is no discount', () => {
  const product = findProductById('p_1')!; // price 2500, discount 0%
  assert.strictEqual(getFinalPrice(product), 2500);
});

test('3. purchaseProduct succeeds for an in-stock quantity', () => {
  const result = purchaseProduct('p_2', 1);
  assert.strictEqual(result.success, true);
});

test('4. purchaseProduct fails for an unknown product', () => {
  const result = purchaseProduct('p_unknown', 1);
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.error, 'Product not found');
});

test('5. purchaseProduct fails for zero or negative quantity', () => {
  const result = purchaseProduct('p_1', 0);
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.error, 'Invalid quantity');
});

test('6. purchaseProduct can exactly exhaust remaining stock', () => {
  const product = findProductById('p_3')!;
  const startingStock = product.stock;
  const result = purchaseProduct('p_3', startingStock);
  assert.strictEqual(result.success, true, 'Buying exactly the remaining stock must succeed');
  assert.strictEqual(product.stock, 0);
});
