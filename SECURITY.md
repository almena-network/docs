# Security policy — Documentation site

This document describes how to report security issues for the **Almena Network documentation site**: the **Docusaurus** project in this repository (build pipeline, site configuration, custom theme code, and deployment scripts shipped here).

## Scope

In scope for coordinated disclosure:

- Source code and configuration in this tree (**`docusaurus.config.ts`**, plugins, custom React under **`src/`**, **`scripts/`**, Taskfile wrappers) when a flaw could affect readers, operators, or maintainers (e.g. XSS in generated pages, unsafe handling of user-supplied content in custom components, build-time command injection).
- **Dependency** issues in **this** project’s lockfile/stack when exploitation flows through the doc site build or runtime.
- **Published site** behavior that reflects a vulnerability **introduced or configurable** in this repository (not generic CDN/hosting incidents outside our control).

Out of scope (report through the appropriate project instead):

- Vulnerabilities limited to application code in **`almena/`**, **`wallet/`**, or **`registry/`**—use those repositories’ security policies.
- Purely **content** disagreements or typos (use issues or PRs; not secrets handling).
- Third-party hosting, DNS, or CDN misconfiguration you operate outside this codebase unless documented here as the recommended deployment path.

## How to report

**Do not** open a public issue for undisclosed vulnerabilities.

1. **Preferred:** Use **[GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories)** for this repository (private report to maintainers), if enabled.
2. **Alternative:** Contact maintainers through a **private** channel listed in [README.md](README.md) or the parent **[Almena Network SECURITY.md](../SECURITY.md)**.

Include, where possible:

- A short description of the issue and its impact.
- Steps to reproduce or a proof-of-concept.
- Affected versions, commit, or release tag.
- Suggested fix (optional).

We aim to acknowledge valid reports within a few business days.

## Supported versions

Security fixes apply to **actively maintained** branches or release tags for this documentation project. Prefer the **default** branch for the latest fixes.

## Disclosure

Please **do not** disclose details of an unresolved vulnerability publicly until maintainers have released a fix or agreed on a disclosure timeline.

## Documentation content and credentials

If a report concerns **exposed secrets**, **private URLs**, or **personal data** accidentally committed in docs, treat it as **confidential** and report through the same private channel. We will rotate or redact as appropriate.

## License reminder

See [LICENSE.md](LICENSE.md) when present in this repository. This policy does not waive any terms of the license.
