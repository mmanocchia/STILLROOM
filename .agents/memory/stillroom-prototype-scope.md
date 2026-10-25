---
name: Stillroom prototype scope
description: Product constraints for Stillroom's frontend prototype and future feature work.
---

Keep Stillroom as a vanilla HTML, CSS, and JavaScript single-page frontend. Accounts, artist boards, private per-Fan follows, posts, personal Shelves, saved-post associations, and uploaded media are temporary browser-memory data. Do not add backend persistence, a database, real authentication, external API calls, or fictional/demo content unless the user explicitly asks.

**Why:** The user repeatedly specified these limits while building Stillroom incrementally.

**How to apply:** Implement new product behavior in frontend state, keep Fan follows and Shelves account-scoped, show only public Shelves on profiles, keep empty states truthful, and do not seed users, artists, boards, Shelves, or posts.
