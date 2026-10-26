---
name: Stillroom prototype scope
description: Product constraints for Stillroom's frontend prototype and future feature work.
---

Keep Stillroom as a vanilla HTML, CSS, and JavaScript single-page frontend. Accounts, artist boards, private per-Fan follows, posts, reference-only reposts, comments, personal Shelves, saved-post associations, and uploaded media are temporary browser-memory data. Do not add backend persistence, a database, real authentication, external API calls, or fictional/demo content unless the user explicitly asks.

Explore must search existing Artist accounts, boards, and original Fan posts together, apply discipline filters to every result type, and use recency rather than popularity for ordering.

**Why:** The user repeatedly specified these limits while building Stillroom incrementally.

**Why:** The user explicitly requested searchable, combined Explore filters and recent-first results without likes, follower counts, or popularity ranking.

**Why:** Fan posts and comments retain username snapshots. The user wants renames without changing ownership, so account IDs must remain stable and snapshots must not go stale.

**How to apply:** Implement new product behavior in frontend state, store reposts as links to original posts, keep Fan follows and Shelves account-scoped, show only public Shelves on profiles, keep empty states truthful, and do not seed users, artists, boards, Shelves, posts, reposts, or comments. Keep Explore ordering based on creation/publication time, never popularity. Treat account IDs as the identity reference; when a username changes, update every username snapshot and keep links resolved by account ID in the same mutation.
