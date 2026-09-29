# Session Rescue: Authentication & Catalog Defects

GGW's backend had a rough on-call night. A panicked hotfix shipped subtle logic
bugs, two pairs of teammates pushed conflicting hotfixes to the same lines, and
an intern's cleanup attempt left a tangled commit history. You're the engineer
on call — rescue the repo.

## Architecture
- `src/users.ts`: In-memory credential database.
- `src/auth.ts`: Session creation, JWT/token parsing, validation, and caching.
- `src/products.ts`: In-memory product catalog.
- `src/catalog.ts`: Pricing, stock, and bulk-discount logic.
- `test/auth.test.ts`, `test/catalog.test.ts`: Public unit test suites.
- `test/revocation.test.ts`, `test/product-merge.test.ts`: Public integration
  suites used to verify the two merge-conflict tasks.

## Running Tests
Run tests locally with:
```bash
npm test              # auth.test.ts
npm run test:catalog
npm run test:revocation
npm run test:product-merge
npm run test:products
```
