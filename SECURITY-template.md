<!--
SECURITY TEMPLATE — RADMEv2
Design for human maintainers and AI agents.
Instructions: Replace every [bracketed placeholder] with your project's actual values.
Keep HTML comments — invisible on GitHub but helpful for humans and AI editing this file.
-->

<!-- Placeholders: [PROJECT_NAME], [OWNER], [REPO], [SECURITY_EMAIL] -->

# Security Policy for [PROJECT_NAME]

> This is a template repository. Replace [SECURITY_EMAIL] with your own contact before
> publishing. If you forked it, replace `[OWNER]/[REPO]` / `[SECURITY_EMAIL]` with your own
> values.

## Supported Versions

We release patches for security vulnerabilities. Only the latest `main` is actively supported.

| Version | Supported          |
| ------- | ------------------ |
| `main`  | :white_check_mark: |
| `< 1.0` | :x:                |

<!--
  Adjust the table if you maintain multiple release lines (e.g. 1.x, 2.x).
  Keep the checkmarks aligned for readability.
-->

## Reporting a Vulnerability

**Do not open a public issue.** Please report privately so we can fix it before disclosure.

- **Preferred:** open a
  [draft security advisory](https://github.com/[OWNER]/[REPO]/security/advisories/new)
- **Alternative:** email **[SECURITY_EMAIL]**

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

Thank you for helping keep [PROJECT_NAME] and its users safe. We will publicly thank reporters
who wish to be credited once the issue is resolved.
