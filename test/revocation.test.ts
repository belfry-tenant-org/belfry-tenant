import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticateUser, validateSessionToken, tokenBlacklist, sessionCache } from '../src/auth.js';

test('revocation-1: valid token passes validation and populates cache', () => {
  sessionCache.clear();
  tokenBlacklist.clear();
  const token = authenticateUser('alice', 'alice123');
  assert.ok(token);
  const isValid = validateSessionToken(token);
  assert.strictEqual(isValid, true, 'Valid token must return true');
  assert.strictEqual(sessionCache.has(token), true, 'Session cache must store valid session');
});

test('revocation-2: blacklisted token is rejected even if cached', () => {
  sessionCache.clear();
  tokenBlacklist.clear();
  const token = authenticateUser('bob', 'bob456');
  assert.ok(token);
  // First, authenticate and cache
  validateSessionToken(token);
  assert.strictEqual(sessionCache.has(token), true);

  // Now revoke/blacklist token
  tokenBlacklist.add(token);
  const isValidAfterRevoke = validateSessionToken(token);
  assert.strictEqual(isValidAfterRevoke, false, 'Revoked token must be rejected even if in cache');
});

test('revocation-3: unknown or malformed token fails validation without throwing', () => {
  assert.strictEqual(validateSessionToken('ggw_badtoken'), false);
});
