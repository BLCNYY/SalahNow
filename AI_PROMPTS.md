# AI Fix Prompts

## Add Continuous Integration

Create a GitHub Actions workflow that runs on pull requests and pushes to `main`, installs dependencies with caching, and executes `npm run lint` followed by `npm run build` using Node.js 18. Place the workflow under `.github/workflows/ci.yml` and ensure it fails on lint or build errors.

## Strengthen Testing Coverage

Introduce an automated test suite for critical prayer-time logic. Add `vitest` and `@testing-library/react` as dev dependencies, configure a test script in `package.json`, and cover `lib/prayer-utils.ts` and `hooks/use-prayer-times.ts` with cases for pre-Fajr, post-Isha, and network error recovery paths.

## Harden the Diyanet Proxy Endpoint

Update `app/api/diyanet/route.ts` to validate `ilceId`, add request timeouts to upstream fetches, and return structured JSON errors with consistent status codes. Include unit tests or integration tests to verify success, invalid input, and upstream failure scenarios.
