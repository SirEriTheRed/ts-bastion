# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Only the latest `main` is actively supported.

| Version | Supported          |
| ------- | ------------------ |
| `main`  | :white_check_mark: |
| `< 1.0` | :x:                |

## Reporting a Vulnerability

**Do not open a public issue.** Please report privately so we can fix it before disclosure.

- **Preferred:** open a
  [draft security advisory](https://github.com/SirEriTheRed/ts-bastion/security/advisories/new)
- **Alternative:** email **<azelann.borde@gmail.com>**

Please include:

- Affected version / commit and how to reproduce
- Impact and whether it is exploitable
- Any suggested mitigation

We will acknowledge receipt within 2 business days and share a plan and timeline for a fix.
We ask for a 90-day coordinated disclosure window while we prepare a patch. We will credit you
if you wish.

## What to Expect

- Acknowledgment within 2 business days
- Regular updates at least every 7 days until resolved
- A fix or mitigation and a follow-up advisory or release note

We follow responsible disclosure and ask reporters to do the same. Please avoid accessing or
altering data that is not yours and do not perform denial-of-service testing.

## Security Tooling

This template ships with automated checks. See [`CONTRIBUTING.md`](./CONTRIBUTING.md#security)
for details:

- `npm audit --audit-level=high` (blocking in CI `audit` job)
- `osv-scanner` — locally `npm run osv` / `npm run osv:html` → `reports/osv-report.html`; in CI
  via `google/osv-scanner-action@v2` → `reports/osv.sarif` → GitHub Code Scanning
- `secretlint` — `npm run secretlint` / `npm run secretlint:mask` plus lint-staged on every commit
- `lockfile-lint` — `npm run lockfile-lint` validates `package-lock.json`
- `zizmor` — optional `zizmor .` for GitHub Actions hardening (`pipx` / `cargo` / `brew`)

## Acknowledgments

Thank you for helping keep this project and its users safe. We will publicly thank reporters
who wish to be credited once the issue is resolved.
