# AGENTS.md

## Mission
Ship a small, trustworthy GitHub Action that posts a weekly digest to GitHub Discussions.
Default behavior must be useful and non-spammy.

## Local dev commands
- Install: `npm install`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Test: `npm test`
- Build: `npm run build`

## Output rules
- Markdown must render cleanly in GitHub Discussions.
- Never post a digest if activity is below `min_activity`.
- Prefer links + titles over dumping full bodies.

## Safety rules
- Never log tokens, auth headers, or raw API responses.
- Keep GitHub permissions least-privilege in examples.
- Avoid adding new dependencies unless necessary.

## Change rules
- If you change inputs/behavior, update README config table + example workflow.
- Keep new sections/config behind toggles to avoid noise.
