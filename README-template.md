# <!--

README TEMPLATE — RADMEv2
Designed for human maintainers and AI agents.

Instructions: - Replace every [bracketed placeholder] with your project's actual values. - Remove or comment out optional sections that don't apply to your project. - Keep the HTML comments — they are invisible on GitHub/GitLab but serve as
guidance for anyone (human or AI) editing this file.
================================================================================

-->

<!-- Placeholders: [PROJECT_NAME], [PACKAGE_NAME], [OWNER], [REPO], [WORKFLOW_FILE], [BRANCH], [COVERAGE], [NODE_VERSION], [LICENSE_NAME], [LICENSE_LINK], [CODE_OF_CONDUCT_EMAIL], [TECH_TYPE_LAYER], [TECH_NAME], [TECH_VERSION], [FEATURE_NAME], [FEATURE_DESCRIPTION] — replace all before publishing -->

<div align="center">

<!-- [PROJECT_NAME] → your project's display name (e.g. "Eri Auth System") -->
<img src=".github/assets/logo.png" alt="[PROJECT_NAME] Logo" width="200" />

# [PROJECT_NAME]

<!-- One-liner with bold keywords describing what this project does -->

_[short description with important keywords in bold]_

---

<!--
  Badge placeholders — replace each with your project's actual values:
  - [PACKAGE_NAME]     npm / PyPI / crate name
  - [OWNER]            GitHub username or org
  - [REPO]             GitHub repository name
  - [WORKFLOW_FILE]    CI workflow YAML filename (e.g. quality.yml)
  - [BRANCH]           default branch name (e.g. main)
  - [COVERAGE]         coverage percentage (e.g. 80)
  - [NODE_VERSION]     minimum Node version (e.g. >=18)
-->

[![npm version](https://img.shields.io/npm/v/[PACKAGE_NAME])](https://www.npmjs.com/package/[PACKAGE_NAME])
[![build](https://img.shields.io/github/actions/workflow/status/[OWNER]/[REPO]/[WORKFLOW_FILE]?branch=[BRANCH])](https://github.com/[OWNER]/[REPO]/actions)
[![coverage](https://img.shields.io/badge/coverage-[COVERAGE]%25-brightgreen)](https://github.com/[OWNER]/[REPO])
[![node](https://img.shields.io/badge/node-%3E%3D[NODE_VERSION]-brightgreen)](https://nodejs.org)
[![license](https://img.shields.io/github/license/[OWNER]/[REPO])](./LICENSE)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/[OWNER]/[REPO]/badge)](https://scorecard.dev/viewer/?uri=github.com/[OWNER]/[REPO])
[![downloads](https://img.shields.io/npm/dm/[PACKAGE_NAME])](https://www.npmjs.com/package/[PACKAGE_NAME])
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

<!-- Navigation bar — section anchors; update if you rename any heading below -->

[Install](#installation) • [Documentation](#documentation) • [FAQ](#faq) • [Contributing](#contributing) • [Community](#community) • [Contact](#contact)

<!--
  Demo media — uncomment this block if you have a demo GIF / screenshot.
  Replace "demo.gif" with your actual file path and update the legend text.
-->
<!--
<img src=".github/assets/demo.gif" alt="[SHORT_LEGEND_DESCRIBING_THE_DEMO]" width="700" />
_[legend]_
-->

</div>

---

## Table of Contents

- [\[PROJECT_NAME\]](#project-name)
  - [Table of Contents](#table-of-contents)
  - [Why \[PROJECT_NAME\]?](#why-project-name)
  - [Tech Stack](#tech-stack)
  - [Architecture](#architecture)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Quickstart](#quickstart)
  - [File Structure \& Naming](#file-structure--naming)
  - [Documentation](#documentation)
  - [FAQ](#faq)
  - [Troubleshooting](#troubleshooting)
  - [Resources](#resources)
  - [Community](#community)
  - [Contact](#contact)
  - [Contributing](#contributing)
    - [Contributors](#contributors)
  - [Thanks \& Acknowledgments](#thanks--acknowledgments)
  - [License](#license)

---

<!--
  Optional section — include if you want to explain why this project exists
  vs alternatives. Delete or comment out the entire block if not needed.
  Consider adding a comparison table to highlight differences from similar tools.
-->

[OPTIONAL

## Why [PROJECT_NAME]?

[Description]

[Arguments]

[Best features]

[Features comparison table]
[↑ Back to top](#table-of-contents)

---]

<!--
  Tech Stack — list each technology used. Repeat the table row for each entry.
  Example:
  | Runtime     | Node.js     | >=20        |
  | Framework   | Fastify     | ^5          |
-->

## Tech Stack

| Layer             | Technology  | Version        |
| ----------------- | ----------- | -------------- |
| [TECH_TYPE_LAYER] | [TECH_NAME] | [TECH_VERSION] |

[... Repeat for each tech]

[↑ Back to top](#table-of-contents)

---

<!-- External tools that are NOT in package.json and must be installed user-side (local dev / CI). Keep this section if the template uses any such tools. -->

## External Tools (Manual User-Side Installation)

> The following tools are **not** in `package.json` and must be installed separately. CI installs them automatically where needed, but locally you need them for certain commands.

| Tool                 | Role in this template                                                                                     | Install                                                                                                                   | When needed?                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Go** `>=1.21`      | Required to install `osv-scanner` via `go install` (`audit` job of `quality.yml` + `npm run osv` locally) | https://go.dev/dl/ or `brew install go` / `apt install golang`                                                            | `npm run osv`, `npm run osv:html`                      |
| **osv-scanner**      | Vulnerability scanning (`npm run osv`) — Go binary `github.com/google/osv-scanner/v2`                     | `go install github.com/google/osv-scanner/v2/cmd/osv-scanner@latest` then `export PATH=$PATH:$(go env GOPATH)/bin`        | any `npm run osv*` locally; in CI via `setup-go`       |
| **zizmor** `>=1.30`  | GitHub Actions security audit (`zizmor .`) — not in CI by default                                         | `cargo install zizmor` · `pipx install zizmor` · `brew install zizmor` · binary at `github.com/woodruffw/zizmor/releases` | local audit `zizmor .` / `zizmor --persona pedantic .` |
| **Graphviz** (`dot`) | Generates `dependency-graph.svg` (`npm run depcruise:graph`)                                              | `brew install graphviz` / `apt install graphviz` / https://graphviz.org/download/                                         | `npm run depcruise:graph` only                         |
| **Git** `>=2.40`     | Husky hooks, `git-auto-commit-action` (`docs` job), `semantic-release`                                    | https://git-scm.com/downloads                                                                                             | always                                                 |

> **Tip:** verify locally with `go version && osv-scanner --version && zizmor --version && dot -V`

[↑ Back to top](#table-of-contents)

---

<!--
  Architecture — describe the project's architecture in a paragraph,
  then link or embed a diagram (Mermaid, Excalidraw, draw.io, etc.).
  If this is a library, explain how it fits into a consumer's project.
-->

## Architecture

[graph description]

[a graph of the project's architecture or how it should be integrated into another project]

### Dependency Graph

Rules defined in [`.dependency-cruiser.cjs`](./.dependency-cruiser.cjs) (`no-circular`, `no-orphans`, `no-non-package-json`, `not-to-dev-dep`, …) — check with:

```bash
npm run depcruise
```

Graph generated with `dependency-cruiser` + Graphviz (`dot`):

```bash
npm run depcruise:graph
# or: npx depcruise src --include-only '^src' --output-type dot | dot -T svg > dependency-graph.svg
```

![Dependency graph](./dependency-graph.svg)

> The SVG is committed — regenerate it after any structural change in `src/`.

[↑ Back to top](#table-of-contents)

---

<!--
  Features — list key features as bullet points. Keep descriptions short
  (one sentence each). Lead with the most important or differentiating feature.
-->

## Features

- **[FEATURE_NAME]** — [FEATURE_DESCRIPTION]

[... Repeat for each feature]
[↑ Back to top](#table-of-contents)

---

<!--
  Prerequisites — list what the consumer must have installed to use this project.
  Replace versions with your stack. Keep the table if you rely on external binaries.
-->

## Prerequisites

- **Node.js** `>= [NODE_VERSION]` (see `.nvmrc`)
- **Package manager:** `[PACKAGE_MANAGER]` `>= [VERSION]`
- **Git** `>= 2.40` — Husky hooks, `semantic-release`, docs auto-commit

[↑ Back to top](#table-of-contents)

---

## Getting Started

### Installation

<!--
  Installation commands — repeat the code block for each supported
  package manager / environment (npm, yarn, pnpm, pip, cargo, brew, etc.).
-->

```bash
[environment]
[command to install]
[... Repeat for each environment or installation tool]
```

<!-- Peer dependencies — list any packages the consumer must install separately. Omit this block if there are none. -->

**Peer dependencies:**

```bash
[dependency]
[... Repeat for each peer dependency]
```

### Quick Start

<!--
  Step-by-step instructions from zero to a working setup. Each step: a one-line description
  followed by a code block. Repeat until the user has a fully working configuration.
-->

[step description]

```[language]
[step code]
```

[... Repeat for each step until usable]

### Basic Usage

<!--
  Show a minimal, copyable example of your public API. Replace with a real snippet once the
  API is defined.
-->

```ts
import { hello } from '[PACKAGE_NAME]';

console.log(hello()); // "hello world!"
```

> See also [Tech Stack](#tech-stack) for technologies used.

#### Publishing & Provenance (fork setup)

| Mode           | `package.json:private` | `.releaserc.json:npmPublish` | npm Trusted Publisher                                                                            | Result                                                            |
| -------------- | ---------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Default (safe) | `true`                 | `false`                      | —                                                                                                | GitHub attestations only (SLSA L2): `dist/**` + SBOM via Sigstore |
| Full-security  | `false`                | `true`                       | Add on npmjs.com → package Settings → Trusted Publishers → `owner/repo` + workflow `release.yml` | npm provenance (SLSA L3) via OIDC, no `NPM_TOKEN` needed          |

[↑ Back to top](#table-of-contents)

---

<!--
  Optional section — File Structure & Naming conventions.
  Include if the project has many files or naming conventions worth documenting.
  Show a text-based tree of the project directory.
-->
<!-- Optional: include if the project has or may have other maintainers

## File Structure & Naming

```
[text-based tree graph of the project]
```

**Naming conventions:**

- [Scope]: `[format]`
  [... Repeat for each convention]

[↑ Back to top](#table-of-contents)

---

-->

## Documentation

Full documentation, usage guides, and reference materials are available in the [`docs/`](./docs) directory.

[↑ Back to top](#table-of-contents)

---

<!--
  FAQ — repeat the <details> block for each frequently asked question.
  Keep answers concise. Link to full docs for longer explanations.
-->

## FAQ

<details>
<summary><strong>[Question]</strong></summary>

[Answer]

</details>
[... Repeat for each question]

[![Ask a question](https://img.shields.io/badge/Ask%20a%20question-8A2BE2)](https://github.com/[OWNER]/[REPO]/discussions/new/choose)

[↑ Back to top](#table-of-contents)

---

<!--
  Troubleshooting — repeat the <details> block for each known issue
  and its workaround or solution. Include error messages if applicable.
-->

## Troubleshooting

<details>
<summary><strong>[Issue]</strong></summary>

[Solution]

</details>
[... Repeat for each issue]

[![Report an issue](https://img.shields.io/badge/Report%20an%20issue-A42E2B)](https://github.com/[OWNER]/[REPO]/issues/new/choose)

[↑ Back to top](#table-of-contents)

---

<!--
  Resources — useful external links: official docs of dependencies,
  related tools, tutorials, blog posts, or videos.
-->

## Resources

- [Link to resource]

[... Repeat for the docs of the used techs and the project's docs]

[↑ Back to top](#table-of-contents)

---

<!--
  Community — links to your community spaces. Fill in actual handles / URLs.
  Examples: GitHub Discussions, Discord server, Twitter/X, Reddit, etc.
-->

## Community

- [GitHub Discussions](https://github.com/[OWNER]/[REPO]/discussions)
- [Twitter / X](https://twitter.com/[HANDLE])

[↑ Back to top](#table-of-contents)

---

<!--
  Contact — direct ways to reach the maintainer(s).
  Fill in your Discord ID, GitHub profile URL, email, etc.
-->

## Contact

- Discord: [YOUR_DISCORD_ID]
- [GitHub](https://github.com/[YOUR_USERNAME])

[↑ Back to top](#table-of-contents)

---

## Contributing

Contributions are very welcome! See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for setup,
conventions, and pull-request flow, and our
[Community Code of Conduct](./CODE_OF_CONDUCT.md) (inspired by Contributor Covenant 3.0).

### Contributors

<!-- Auto-generated contributor list via contrib.rocks — replace [OWNER]/[REPO] -->

![Contributors](https://contrib.rocks/image?repo=[OWNER]/[REPO])

[↑ Back to top](#table-of-contents)

---

<!--
  Acknowledgments — credit libraries, tools, articles, or people that
  inspired or directly helped this project. Be specific when possible.
-->

## Thanks & Acknowledgments

- [Entity and link]

[... Repeat for each technology used, most important docs used during development]

- Everyone who contributed, opened an issue, PR, or star

[↑ Back to top](#table-of-contents)

---

<!-- License — replace with your actual license type and link to the license file -->

## License

Distributed under the [LICENSE_LINK].
