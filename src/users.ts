export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: string;
}

export const USERS: User[] = [
  { id: 'usr_1', username: 'alice', passwordHash: 'hash_alice123', role: 'admin' },
  { id: 'usr_2', username: 'bob', passwordHash: 'hash_bob456', role: 'user' },
  { id: 'usr_3', username: 'charlie', passwordHash: 'hash_charlie789', role: 'user' },
];

export function findUserByUsername(username: string): User | undefined {
  return USERS.find((u) => u.username === username);
}
