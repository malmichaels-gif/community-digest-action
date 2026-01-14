# Announcement Drafts

## GitHub Discussion (community-digest-action)

**Title:** Introducing community-digest-action v0.1

---

A drop-in GitHub Action that posts a weekly digest to Discussions. Merged PRs, new contributor shoutouts, zero config spam.

### What it does

- Posts a clean markdown digest every week (or on-demand)
- Lists merged PRs with author links
- Shouts out first-time contributors
- Skips posting when there's nothing to report (anti-spam)

### Why this exists

Newsletters are work. Release notes get stale. Discussions go quiet.

This action runs on a cron, collects the week's activity, and posts a summary. Your community stays informed without you doing anything.

### Quickstart

```yaml
- uses: malmichaels-gif/community-digest-action@v0
  with:
    discussion_category: "Announcements"
```

That's it. See the [README](https://github.com/malmichaels-gif/community-digest-action) for config options.

### Good first issues

Looking to contribute? Start here:

1. **Docs:** Improve the "How it decides to skip" section
2. **Feature:** Add optional "Issues closed" section (v0.2)
3. **UX:** Better error message when Discussion category doesn't exist

---

## GitHub Discussion (agent-instructions-kit)

**Title:** Introducing agent-instructions-kit v0.1

---

A CLI + GitHub Action for maintaining AGENTS.md and CLAUDE.md files.

### What it does

- `init` — generates template files (minimal or opinionated)
- `check` — validates required sections exist
- `safety` — lints for prompt injection patterns and sketchy instructions

### Why this exists

Agent instruction files are becoming normal. But they drift, get copy-pasted from sketchy sources, and sometimes contain "ignore previous instructions" garbage.

This kit keeps your repo's agent instructions consistent and harder to hijack.

### Quickstart

```bash
npx agent-instructions-kit init
npx agent-instructions-kit check
npx agent-instructions-kit safety
```

Or add to CI:

```yaml
- uses: malmichaels-gif/agent-instructions-kit@v0
  with:
    mode: "all"
```

See the [README](https://github.com/malmichaels-gif/agent-instructions-kit) for details.

### Good first issues

1. **Template:** Add a template section for "Forbidden actions"
2. **Safety rule:** Detect "upload to pastebin" patterns
3. **Docs:** Add examples of real-world AGENTS.md files

---

## X Post (community-digest-action)

**Option A (direct):**
```
Shipped: community-digest-action

A GitHub Action that posts weekly digests to Discussions. Merged PRs, new contributor shoutouts, skips when nothing happened.

Drop-in. No AI. No newsletter editor.

github.com/malmichaels-gif/community-digest-action
```

**Option B (slightly edgier):**
```
Your repo doesn't need a newsletter.

It needs a weekly digest that writes itself.

Shipped community-digest-action — merged PRs, new contributors, zero config spam.

github.com/malmichaels-gif/community-digest-action
```

---

## LinkedIn Post (community-digest-action)

```
Shipped a small open-source project: community-digest-action

It's a GitHub Action that posts a weekly digest to your repo's Discussions tab. Merged PRs, first-time contributor shoutouts, and it skips posting when there's nothing to report.

Why build this?

Most repos go quiet between releases. Contributors don't know what's happening. Maintainers don't have time to write newsletters.

This runs on a cron, collects the week's activity, and posts a summary. Your community stays informed without you doing anything.

Drop-in setup (one YAML file), no external services, no AI required.

Link: github.com/malmichaels-gif/community-digest-action

If you maintain an open-source project, give it a try. Feedback welcome.
```

---

## Notes

- Screenshots: Add after first real digest posts (need PR activity)
- Tone: Kept it clean and direct, no "excited to announce" or "game-changer"
- CTA: Soft ask for feedback, not "star this repo"
