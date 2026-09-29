import { findUserByUsername, type User } from './users.js';

export interface SessionClaims {
  userId: string;
  username: string;
  role: string;
  exp: number; // Expiration timestamp in seconds (JWT standard)
}

// In-memory session caches and token revocation state
export const sessionCache = new Map<string, SessionClaims>();
export const tokenBlacklist = new Set<string>();

export function hashPassword(password: string): string {
  return `hash_${password}`;
}

export function createToken(user: User, ttlSeconds: number = 3600): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const claims: SessionClaims = {
    userId: user.id,
    username: user.username,
    role: user.role,
    exp,
  };
  const encoded = Buffer.from(JSON.stringify(claims)).toString('base64');
  return `ggw_${encoded}`;
}

export function authenticateUser(username: string, password: string): string | null {
  const user = findUserByUsername(username);
  if (!user) return null;
  if (user.passwordHash !== hashPassword(password)) return null;
  return createToken(user);
}

export function verifySessionToken(headerOrToken: string): SessionClaims {
  if (!headerOrToken) {
    throw new Error('Missing token');
  }

  // Allow "Bearer <token>" or raw token string
  const token = headerOrToken.replace(/^Bearer\s+/i, '').trim();

  if (!token.startsWith('ggw_')) {
    throw new Error('Invalid token format');
  }

  const payloadRaw = Buffer.from(token.slice(4), 'base64').toString('utf-8');
  let claims: SessionClaims;
  try {
    claims = JSON.parse(payloadRaw) as SessionClaims;
  } catch {
    throw new Error('Malformed token payload');
  }

  if (claims.exp * 1000 < Date.now()) {
    throw new Error('Token has expired');
  }

  return claims;
}

export function validateSessionToken(token: string): boolean {
  // Check token revocation blacklist
  if (tokenBlacklist.has(token)) {
    return false;
  }

  // Check in-memory session cache
  if (sessionCache.has(token)) {
    return true;
  }

  try {
    const claims = verifySessionToken(token);
    sessionCache.set(token, claims);
    return true;
  } catch {
    return false;
  }
}