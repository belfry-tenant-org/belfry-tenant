import { findProductById, type Product } from './products.js';

export function getFinalPrice(product: Product): number {
  return Math.round(product.price - product.price * (product.discountPercent / 100));
}

export function purchaseProduct(
  id: string,
  quantity: number
): { success: boolean; totalPrice?: number; error?: string } {
  const product = findProductById(id);
  if (!product) return { success: false, error: 'Product not found' };
  if (quantity <= 0) return { success: false, error: 'Invalid quantity' };
  if (product.stock < quantity) return { success: false, error: 'Insufficient stock' };

  product.stock -= quantity;
  const totalPrice = getFinalPrice(product) * quantity;
  return { success: true, totalPrice };
}

export function applyBulkDiscount(product: Product, quantity: number): number {
  let discountPercent = product.discountPercent;
  if (discountPercent > 30) {
    discountPercent = 30;
  }
  const discount = product.price * (discountPercent / 100);
  return Math.round(product.price - discount) * quantity;
}
