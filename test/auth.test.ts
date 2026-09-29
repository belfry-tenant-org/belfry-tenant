import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticateUser, verifySessionToken, createToken } from '../src/auth.js';

test('1. authenticateUser returns valid token for known user', () => {
  const token = authenticateUser('alice', 'alice123');
  assert.ok(token, 'Token should be returned');
  assert.match(token, /^ggw_/, 'Token should start with ggw_ prefix');
});

test('2. authenticateUser returns null for incorrect password', () => {
  const token = authenticateUser('alice', 'wrongpass');
  assert.strictEqual(token, null);
});

test('3. authenticateUser returns null for unknown user', () => {
  const token = authenticateUser('nonexistent', 'pass');
  assert.strictEqual(token, null);
});

test('4. verifySessionToken accepts freshly issued valid token', () => {
  const token = authenticateUser('alice', 'alice123');
  assert.ok(token);
  const session = verifySessionToken(token);
  assert.strictEqual(session.userId, 'usr_1');
  assert.strictEqual(session.username, 'alice');
  assert.strictEqual(session.role, 'admin');
});

test('5. verifySessionToken accepts Bearer header with irregular spacing', () => {
  const token = authenticateUser('bob', 'bob456');
  assert.ok(token);
  const session = verifySessionToken(`Bearer   ${token}`);
  assert.strictEqual(session.userId, 'usr_2');
  assert.strictEqual(session.username, 'bob');
});

test('6. verifySessionToken rejects expired token', () => {
  const expiredToken = createToken(
    { id: 'usr_1', username: 'alice', passwordHash: '', role: 'admin' },
    -120
  );
  assert.throws(() => verifySessionToken(expiredToken), /expired/i);
});

test('7. verifySessionToken rejects malformed token', () => {
  assert.throws(() => verifySessionToken('ggw_invalidbase64!'), /Malformed token payload/i);
});

test('8. verifySessionToken rejects empty or missing token', () => {
  assert.throws(() => verifySessionToken(''), /Missing token/i);
});
