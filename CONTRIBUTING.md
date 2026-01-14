# Contributing to community-digest-action

You're welcome here. Keep it practical, keep it small, and please don't turn this into a second job for maintainers.

## What this project is (and isn't)

**Is:**
- A drop-in GitHub Action that posts a weekly digest
- Opinionated about being **useful** and **non-spammy**
- Easy to configure, easy to trust

**Is not:**
- A full analytics dashboard
- A "post every event that happened" firehose
- A generic "AI summarizer for everything"

## Quick dev setup

### Requirements
- Node.js 20+
- pnpm (recommended) or npm

### Install
```bash
pnpm install
```

### Build

```bash
pnpm build
```

### Test

```bash
pnpm test
```

### Lint

```bash
pnpm lint
```

## Running locally (dry run)

You can run the core renderer without posting:

```bash
pnpm dev -- --dry-run --repo owner/name
```

If you add support for posting via the API locally, DO NOT commit tokens, and never paste them into issues.

## How to add a new digest section (v0.2+)

Keep it boring:

1. Add the data fetch (GitHub API)
2. Add a formatter that outputs Markdown
3. Add tests
4. Update README configuration table

If a section increases spam risk, it needs a toggle.

## Pull request checklist

* [ ] Tests added/updated
* [ ] README updated if behavior/config changed
* [ ] No secrets, no token logging, no "just trust me" code
* [ ] Output still looks good in markdown (GitHub Discussions)

## Reporting bugs

When filing an issue, include:

* The workflow YAML (redact secrets)
* The action inputs you used
* Logs (with any tokens removed)
* What you expected vs what happened

## Code style

Prefer:

* Small functions
* Clear names
* Guardrails > cleverness

## License

By contributing, you agree that your contributions are licensed under the MIT License.
