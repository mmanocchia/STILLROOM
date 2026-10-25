---
name: Stillroom prototype scope
description: Product constraints for Stillroom's frontend prototype and future feature work.
---

Keep Stillroom as a vanilla HTML, CSS, and JavaScript single-page frontend. Accounts, artist boards, private per-Fan artist follows, posts, and uploaded media are temporary browser-memory data. Do not add backend persistence, a database, real authentication, external API calls, or fictional/demo content unless the user explicitly asks.

**Why:** The user repeatedly specified these limits while building Stillroom incrementally.

**How to apply:** Implement new product behavior in frontend state, keep Fan follow lists private to each account, keep empty states truthful, and do not seed users, artists, boards, or posts.
