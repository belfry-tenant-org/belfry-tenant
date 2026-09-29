import test from 'node:test';
import assert from 'node:assert/strict';
import { applyBulkDiscount } from '../src/catalog.js';
import { findProductById } from '../src/products.js';

test('product-merge-1: bulk orders of 5 or more get an extra 5% off', () => {
  const product = findProductById('p_1')!; // price 2500, discount 0%
  const total = applyBulkDiscount(product, 5);
  assert.strictEqual(total, 2375 * 5, 'Expected base 0% + bulk 5% = 5% off');
});

test('product-merge-2: total discount is capped at 30% even with the bulk bonus applied', () => {
  const product = findProductById('p_4')!; // price 20000, discount 28%
  const total = applyBulkDiscount(product, 5); // 28% + 5% bulk = 33%, must cap at 30%
  assert.strictEqual(total, 14000 * 5, 'Expected discount capped at 30%, not 33%');
});

test('product-merge-3: orders below the bulk threshold get no bulk bonus', () => {
  const product = findProductById('p_2')!; // price 7500, discount 10%
  const total = applyBulkDiscount(product, 2);
  assert.strictEqual(total, 6750 * 2, 'Expected plain 10% discount, no bulk bonus');
});
