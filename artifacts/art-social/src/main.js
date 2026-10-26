import './index.css';

const app = document.querySelector('#app');
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const navItems = [
  { path: '/home', label: 'Home', icon: 'home' },
  { path: '/explore', label: 'Explore', icon: 'explore' },
  { path: '/artists', label: 'My Artists', icon: 'artists' },
  { path: '/shelves', label: 'Shelves', icon: 'shelves' },
  { path: '/profile', label: 'Profile', icon: 'profile' },
];

const state = {
  accounts: [],
  boards: [],
  posts: [],
  reposts: [],
  comments: [],
  followedArtistsByFan: {},
  shelves: [],
  nextShelfId: 1,
  postDrafts: {},
  activeAccountId: null,
  route: getRoute(),
  pendingRole: null,
  draft: { role: null, name: '', username: '', email: '' },
  errors: {},
  loading: false,
  pendingAccount: null,
  registrationTimer: null,
  successAccountId: null,
  homeTab: 'for-you',
  searchOpen: false,
  editingProfile: false,
  profileDraft: null,
  profileError: '',
  profileFieldErrors: {},
  profileImageLoading: false,
  profileImageError: '',
  profileImageToken: 0,
  profileLoading: false,
  profilePending: null,
  profileTimer: null,
  profileStatus: null,
  profileActivityTabs: {},
  usernameEditorOpen: false,
  usernameDraft: '',
  usernameError: '',
  usernameLoading: false,
  usernamePending: null,
  usernameTimer: null,
  usernameStatus: null,
  exploreQuery: '',
  exploreDiscipline: 'all',
  exploreLoading: false,
  exploreError: '',
  exploreTimer: null,
  boardDraft: null,
  boardErrors: {},
  boardLoading: false,
  boardTimer: null,
  pendingBoard: null,
  boardImageLoading: false,
  boardImageError: '',
  boardImageReadToken: 0,
  boardSuccess: '',
  boardSuccessId: null,
  postEditor: null,
  postErrors: {},
  postPublishing: false,
  pendingPost: null,
  postTimer: null,
  nextPostId: 1,
  nextRepostId: 1,
  nextCommentId: 1,
  postStatus: null,
  deleteConfirmPostId: null,
  followStatus: null,
  repostConfirm: null,
  repostPending: null,
  repostTimer: null,
  repostStatus: null,
  expandedCommentPostIds: [],
  commentDrafts: {},
  commentErrors: {},
  commentEditor: null,
  commentDeleteConfirmId: null,
  commentPending: null,
  commentTimer: null,
  commentStatus: null,
  shelfDraft: null,
  shelfErrors: {},
  shelfLoading: false,
  shelfTimer: null,
  pendingShelf: null,
  shelfPickerPostId: null,
  shelfPickerSelection: [],
  shelfPickerError: '',
  shelfReturnPostId: null,
  shelfReturnRoute: null,
  shelfDeleteConfirmId: null,
  shelfStatus: null,
};

const iconPaths = {
  home: '<path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9M9 21v-7h6v7"/>',
  explore: '<circle cx="11" cy="11" r="7.5"/><path d="m16.5 16.5 4 4M13.8 8.2l-1.7 4-4 1.7 1.7-4z"/>',
  artists: '<path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="8.5"/>',
  shelves: '<path d="M4 5.5h16M4 12h16M4 18.5h16"/><path d="M7 3v5M17 9.5v5M10 16v5"/>',
  profile: '<circle cx="12" cy="8" r="3.5"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
  search: '<circle cx="11" cy="11" r="7.5"/><path d="m16.5 16.5 4 4"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  logout: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  back: '<path d="m15 18-6-6 6-6M9 12h12"/>',
  bookmark: '<path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  sparkle: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>',
  edit: '<path d="m14 5 5 5M4 20l4.2-.9L19 8.3 15.7 5 4.9 15.8 4 20Z"/><path d="M12 20h8"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"/>',
  repost: '<path d="m17 3 4 4-4 4"/><path d="M3 11V9a2 2 0 0 1 2-2h16"/><path d="m7 21-4-4 4-4"/><path d="M21 13v2a2 2 0 0 1-2 2H3"/>',
};

function icon(name, size = 17) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || ''}</svg>`;
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function getRoute() {
  let path = window.location.pathname;
  if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length) || '/';
  return path || '/';
}

function hrefFor(path) {
  return `${basePath}${path === '/' ? '/' : path}`;
}

function navigate(path, { replace = false } = {}) {
  if (state.loading && path !== state.route) cancelRegistration();
  if (state.boardLoading && path !== state.route) cancelBoardOperation();
  if (state.shelfLoading && path !== state.route) cancelShelfOperation();
  if (state.exploreTimer && !path.startsWith('/explore')) {
    window.clearTimeout(state.exploreTimer);
    state.exploreTimer = null;
    state.exploreLoading = false;
  }
  if (replace) history.replaceState({}, '', hrefFor(path));
  else if (getRoute() !== path) history.pushState({}, '', hrefFor(path));
  state.route = path;
  render();
}

function cancelRegistration() {
  if (state.registrationTimer) window.clearTimeout(state.registrationTimer);
  state.registrationTimer = null;
  state.loading = false;
  state.pendingAccount = null;
}

function cancelBoardOperation() {
  if (state.boardTimer) window.clearTimeout(state.boardTimer);
  state.boardTimer = null;
  state.boardLoading = false;
  state.pendingBoard = null;
}

function cancelShelfOperation() {
  if (state.shelfTimer) window.clearTimeout(state.shelfTimer);
  state.shelfTimer = null;
  state.shelfLoading = false;
  state.pendingShelf = null;
  state.shelfReturnPostId = null;
  state.shelfReturnRoute = null;
}

function activeAccount() {
  return state.accounts.find((account) => account.id === state.activeAccountId) || null;
}

function boardForOwner(ownerId) {
  return state.boards.find((board) => board.ownerId === ownerId) || null;
}

function followedArtistIds(fanId) {
  return state.followedArtistsByFan[fanId] || [];
}

function isFollowingArtist(fanId, artistId) {
  return followedArtistIds(fanId).includes(artistId);
}

function chronologicalPosts(posts) {
  return posts.slice().sort((left, right) => left.publishedAt - right.publishedAt);
}

function commentDraftKey(userId, postId) {
  return `${userId}::${postId}`;
}

function homeFeedItems(followedIds = null) {
  const items = state.posts
    .filter(isVisibleFanPost)
    .map((post) => ({ type: 'post', key: `post:${post.id}`, post, createdAt: post.publishedAt }));
  for (const repost of state.reposts) {
    const post = state.posts.find((entry) => entry.id === repost.postId);
    const reposter = state.accounts.find((entry) => entry.id === repost.userId);
    if (!post || reposter?.role !== 'Fan' || !isVisibleFanPost(post)) continue;
    items.push({ type: 'repost', key: `repost:${repost.id}`, post, repost, createdAt: repost.repostedAt });
  }
  return items
    .filter((item) => {
      if (!followedIds) return true;
      const board = state.boards.find((entry) => entry.id === item.post.boardId);
      return board && followedIds.has(board.ownerId);
    })
    .sort((left, right) => left.createdAt - right.createdAt);
}

function accountActivityItems(accountId) {
  const account = state.accounts.find((entry) => entry.id === accountId);
  if (!account) return [];
  const items = state.posts
    .filter((post) => post.authorId === accountId && isVisibleFanPost(post))
    .map((post) => ({ type: 'post', key: `post:${post.id}`, post, createdAt: post.publishedAt }));
  for (const repost of state.reposts.filter((entry) => entry.userId === accountId)) {
    const post = state.posts.find((entry) => entry.id === repost.postId);
    if (post && isVisibleFanPost(post)) items.push({ type: 'repost', key: `repost:${repost.id}`, post, repost, createdAt: repost.repostedAt });
  }
  return items.sort((left, right) => left.createdAt - right.createdAt);
}

function isVisibleFanPost(post) {
  const author = state.accounts.find((account) => account.id === post.authorId);
  return author?.role === 'Fan' && state.boards.some((board) => board.id === post.boardId);
}

const exploreDisciplines = ['Music', 'Film', 'Photography', 'Painting', 'Fashion'];

function disciplineMatchesFilter(discipline, filter) {
  if (filter === 'all') return true;
  const value = String(discipline || '').trim().toLocaleLowerCase();
  const aliases = {
    Music: ['music', 'musician', 'singer', 'songwriter', 'composer', 'sound'],
    Film: ['film', 'filmmaker', 'cinema', 'cinematographer', 'director'],
    Photography: ['photography', 'photographer', 'photo'],
    Painting: ['painting', 'painter'],
    Fashion: ['fashion', 'clothing', 'textile'],
  };
  const containsDisciplineTerm = (category) => aliases[category].some((term) => new RegExp(`(^|[^a-z])${term}([^a-z]|$)`, 'i').test(value));
  if (filter === 'Other') return !exploreDisciplines.some(containsDisciplineTerm);
  return containsDisciplineTerm(filter) || value === filter.toLocaleLowerCase();
}

function exploreTextMatches(query, values) {
  const terms = query.trim().toLocaleLowerCase().replaceAll('@', '').split(/\s+/).filter(Boolean);
  const searchable = values.flat(Infinity)
    .filter((value) => value !== null && value !== undefined)
    .map((value) => String(value).toLocaleLowerCase())
    .join(' ');
  return terms.every((term) => searchable.includes(term));
}

function exploreResults() {
  const query = state.exploreQuery;
  const discipline = state.exploreDiscipline;
  const boards = state.boards
    .filter((board) => {
      const owner = state.accounts.find((account) => account.id === board.ownerId);
      return disciplineMatchesFilter(board.discipline, discipline)
        && exploreTextMatches(query, [board.artistName, board.discipline, board.biography, owner?.name, owner?.username]);
    })
    .sort((left, right) => (right.createdAt || 0) - (left.createdAt || 0));

  const artists = state.accounts
    .filter((account) => account.role === 'Artist')
    .filter((account) => {
      const board = boardForOwner(account.id);
      return (discipline === 'all' || (board && disciplineMatchesFilter(board.discipline, discipline)))
        && exploreTextMatches(query, [account.name, account.username, board?.artistName, board?.discipline, board?.biography]);
    })
    .sort((left, right) => {
      const leftBoard = boardForOwner(left.id);
      const rightBoard = boardForOwner(right.id);
      return (rightBoard?.createdAt || right.createdAt || 0) - (leftBoard?.createdAt || left.createdAt || 0);
    });

  const posts = state.posts
    .filter((post) => {
      if (!isVisibleFanPost(post)) return false;
      const board = state.boards.find((entry) => entry.id === post.boardId);
      const author = state.accounts.find((entry) => entry.id === post.authorId);
      const artist = state.accounts.find((entry) => entry.id === board?.ownerId);
      const keywords = Array.isArray(post.keywords) ? post.keywords : [post.keywords];
      return board
        && disciplineMatchesFilter(board.discipline, discipline)
        && exploreTextMatches(query, [
          board.artistName, board.discipline, artist?.name, artist?.username,
          author?.name, author?.username, post.title, post.artworkTitle, post.content,
          keywords, post.media?.name,
        ]);
    })
    .sort((left, right) => right.publishedAt - left.publishedAt);

  return { artists, boards, posts };
}

function postDraftKey(authorId, boardId, postId = null) {
  return `${authorId}::${boardId}::${postId || 'new'}`;
}

function releaseDraftMedia(draft) {
  if (draft?.media?.isNew && draft.media.url?.startsWith('blob:')) {
    URL.revokeObjectURL(draft.media.url);
  }
}

function formatPostDate(timestamp) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(timestamp));
}

function brand(linked = true) {
  const contents = `<span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="M20 3.8 36.2 13.2v13.6L20 36.2 3.8 26.8V13.2L20 3.8Z" stroke="currentColor" stroke-width="1.5"/><path d="M12.1 12.2h15.8v15.6H12.1z" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.4"/><path d="m12.2 27.8 15.6-15.6M20 12.2v15.6" stroke="currentColor" stroke-width="1.4"/></svg></span><span class="brand-name">stillroom</span>`;
  return linked
    ? `<a class="brand" href="${hrefFor('/')}" data-route="/" data-testid="link-brand" aria-label="Stillroom home">${contents}</a>`
    : `<span class="brand" aria-label="Stillroom">${contents}</span>`;
}

function header({ right = '' } = {}) {
  return `<header class="landing-header">${brand()}${right}</header>`;
}

function renderAccountChoice(account, current = false, profileLink = false) {
  const profileRoute = `/profile/${encodeURIComponent(account.id)}`;
  const usernameLink = `<a class="account-choice-profile-link" href="${hrefFor(profileRoute)}" data-route="${profileRoute}">@${escapeHTML(account.username)}</a>`;
  const details = profileLink
    ? `<span class="account-choice-name">${escapeHTML(account.name)}</span><span class="account-choice-role">${current ? 'Current · ' : ''}${escapeHTML(account.role)}</span>`
    : `<span><span class="account-choice-name">${escapeHTML(account.name)}</span><span class="account-choice-meta">@${escapeHTML(account.username)}</span></span><span class="account-choice-role">${current ? 'Current · ' : ''}${escapeHTML(account.role)}</span>`;
  if (profileLink) {
    const choice = current
      ? `<div class="account-choice switcher-current" aria-current="true">${details}</div>`
      : `<button class="account-choice" type="button" data-action="switch-account" data-account-id="${escapeHTML(account.id)}">${details}${icon('arrow', 14)}</button>`;
    return `<div class="account-choice-row">${choice}${usernameLink}</div>`;
  }
  return current
    ? `<div class="account-choice switcher-current" aria-current="true">${details}</div>`
    : `<button class="account-choice" type="button" data-action="switch-account" data-account-id="${escapeHTML(account.id)}">${details}${icon('arrow', 14)}</button>`;
}

function renderWelcome() {
  const accountPicker = state.accounts.length
    ? `<section class="account-picker" aria-labelledby="account-picker-title"><p class="eyebrow">Already joined in this tab</p><h2 class="account-picker-title" id="account-picker-title">Switch to a demo account</h2><div class="account-list">${state.accounts.map((account) => renderAccountChoice(account)).join('')}</div><p class="form-note">Demo accounts are temporary and disappear when this page is refreshed.</p></section>`
    : '';
  return `<div class="paper-grain landing-page page-enter">
    ${header()}
    <main class="welcome-layout">
      <section class="welcome-copy">
        <p class="eyebrow">A quieter kind of gathering</p>
        <h1 class="welcome-title">For the work<br>that stays <em>with you.</em></h1>
        <p class="welcome-description">Stillroom is a home for people who care about art. Gather around artists, make room for the work, and share what moves you — without the noise of popularity.</p>
        <div class="welcome-actions">
          <button class="primary-button" type="button" data-action="join" data-role="Fan" data-testid="button-join-fan">Join as Fan ${icon('arrow', 15)}</button>
          <button class="outline-button" type="button" data-action="join" data-role="Artist" data-testid="button-join-artist">Join as Artist ${icon('arrow', 15)}</button>
        </div>
        <p class="welcome-note">A place to linger, not perform.</p>
        ${accountPicker}
      </section>
      <aside class="welcome-side" aria-label="Stillroom principles">
        <p class="eyebrow">What we keep</p>
        <div class="manifesto">
          <div class="manifesto-row"><span class="manifesto-number">01</span><div><h2 class="manifesto-title">Artist-led rooms</h2><p class="manifesto-copy">Artists make boards. Fans make the conversation.</p></div></div>
          <div class="manifesto-row"><span class="manifesto-number">02</span><div><h2 class="manifesto-title">A slower feed</h2><p class="manifesto-copy">No scores, rankings, or follower tallies to chase.</p></div></div>
          <div class="manifesto-row"><span class="manifesto-number">03</span><div><h2 class="manifesto-title">Made for looking</h2><p class="manifesto-copy">Bring your attention. Everything else can wait.</p></div></div>
        </div>
        <p class="manifesto-footer">No audience metrics. Just a place to gather.</p>
      </aside>
    </main>
  </div>`;
}

function errorFor(field) {
  return state.errors[field]
    ? `<span class="field-error" id="error-${field}" role="alert">${escapeHTML(state.errors[field])}</span>`
    : '';
}

function renderRoleOption(role, title, copy) {
  const selected = state.draft.role === role;
  return `<button class="role-option" type="button" data-action="choose-role" data-role="${role}" aria-pressed="${selected}">
    <span class="role-option-title">${title}</span><span class="role-option-copy">${copy}</span>
  </button>`;
}

function renderRegistration() {
  if (state.loading) {
    return `<div class="paper-grain landing-page page-enter">${header({ right: '<span class="eyebrow">Just a moment</span>' })}<main class="confirmation-layout"><section class="confirmation-card" aria-live="polite" aria-busy="true"><span class="eyebrow">Making a little room</span><h1 class="confirmation-title">Creating your account</h1><p class="confirmation-copy">Your Stillroom profile is almost ready.</p><div class="registration-loading"><span class="loading-dot"></span><span class="eyebrow">Please wait</span></div></section></main></div>`;
  }

  const draft = state.draft;
  const roleError = errorFor('role');
  const submitLabel = 'Create your account';
  return `<div class="paper-grain landing-page page-enter">
    ${header({ right: `<button class="text-button" type="button" data-action="back-from-register">${icon('back', 14)} Back</button>` })}
    <main class="registration-layout">
      <section class="registration-intro">
        <p class="eyebrow">A place without applause</p>
        <h1 class="registration-title">Make room<br>for what <em>moves you.</em></h1>
        <p class="registration-copy">Join as a fan or an artist. There are no audiences to build here, only rooms to make and work to care about.</p>
      </section>
      <section class="registration-card" aria-labelledby="registration-title">
        <p class="eyebrow">Settle in</p><h2 id="registration-title">Create your account</h2>
        <form data-form="registration" novalidate>
          <fieldset class="role-fieldset" style="border:0;padding:0;margin:0">
            <legend class="role-legend">I’m here as…</legend>
            <div class="role-options">
              ${renderRoleOption('Fan', 'Fan', 'Find artists and share your thoughts.')}
              ${renderRoleOption('Artist', 'Artist', 'Make boards for people to gather around your work.')}
            </div>
            ${roleError}
          </fieldset>
          <label class="field-label">Name<input class="field-input" name="name" value="${escapeHTML(draft.name)}" autocomplete="name" placeholder="How should we call you?" aria-invalid="${Boolean(state.errors.name)}" ${state.errors.name ? 'aria-describedby="error-name"' : ''} required>${errorFor('name')}</label>
          <label class="field-label">Username<input class="field-input" name="username" value="${escapeHTML(draft.username)}" autocomplete="username" placeholder="Your name, without the @" aria-invalid="${Boolean(state.errors.username)}" ${state.errors.username ? 'aria-describedby="error-username"' : ''} required>${errorFor('username')}</label>
          <label class="field-label">Email<input class="field-input" name="email" value="${escapeHTML(draft.email)}" type="email" autocomplete="email" placeholder="you@example.com" aria-invalid="${Boolean(state.errors.email)}" ${state.errors.email ? 'aria-describedby="error-email"' : ''} required>${errorFor('email')}</label>
          <label class="field-label">Password<input class="field-input" name="password" type="password" autocomplete="new-password" placeholder="At least 8 characters" aria-invalid="${Boolean(state.errors.password)}" ${state.errors.password ? 'aria-describedby="error-password"' : ''} required>${errorFor('password')}</label>
          <p class="form-note">This is a local preview. Your account lives only in this open page and disappears on refresh.</p>
          <button class="primary-button registration-submit" type="submit" data-testid="button-submit-registration">${submitLabel} ${icon('arrow', 15)}</button>
        </form>
      </section>
    </main>
  </div>`;
}

function renderConfirmation() {
  const account = state.accounts.find((entry) => entry.id === state.successAccountId);
  if (!account) return renderWelcome();
  return `<div class="paper-grain landing-page page-enter">
    <header class="landing-header">${brand(false)}<span class="eyebrow">Welcome to Stillroom</span></header>
    <main class="confirmation-layout"><section class="confirmation-card">
      <span class="confirmation-mark">${icon('check', 19)}</span>
      <p class="eyebrow" style="margin-top:23px">You’re in</p>
      <h1 class="confirmation-title">Welcome, ${escapeHTML(account.name)}.</h1>
      <p class="confirmation-copy">Your ${escapeHTML(account.role.toLowerCase())} profile is ready. It’s yours to shape, one thoughtful step at a time.</p>
      <button class="primary-button" type="button" data-action="open-profile" data-testid="button-open-profile">Open your profile ${icon('arrow', 15)}</button>
    </section></main>
  </div>`;
}

function navLink(item, currentRoute) {
  const active = item.path === currentRoute
    || (item.path === '/home' && currentRoute === '/')
    || (item.path === '/artists' && currentRoute.startsWith('/artists/'))
    || (item.path === '/explore' && (currentRoute.startsWith('/board/') || currentRoute.startsWith('/post/')))
    || (item.path === '/shelves' && currentRoute.startsWith('/shelves/'))
    || (item.path === '/profile' && currentRoute.startsWith('/profile/'));
  return `<a class="nav-link" href="${hrefFor(item.path)}" data-route="${item.path}" ${active ? 'aria-current="page"' : ''}>${icon(item.icon)}<span>${item.label}</span></a>`;
}

function renderShell(content, pageTitle) {
  const nav = navItems.map((item) => navLink(item, state.route)).join('');
  const searchControl = `<button class="icon-button" type="button" data-action="open-search" aria-label="Search artists, boards, and posts">${icon('search', 17)}<span class="search-label">Search</span></button>`;
  return `<div class="paper-grain app-shell">
    <header class="app-topnav">
      <div class="app-topnav-brand">${brand()}</div>
      <nav class="main-nav" aria-label="Main navigation">${nav}</nav>
      <div class="app-nav-actions">${searchControl}<a class="icon-button profile-shortcut" href="${hrefFor('/profile')}" data-route="/profile" aria-label="Open profile">${icon('profile', 17)}</a><button class="logout-button" type="button" data-action="logout" aria-label="Log out">${icon('logout', 15)}<span>Log out</span></button></div>
    </header>
    <div class="app-main">
      <header class="topbar"><span class="topbar-title">${escapeHTML(pageTitle)}</span></header>
      <main class="page-content page-enter">${content}</main>
    </div>
    ${renderShelfPicker()}
  </div>`;
}

function renderEmpty(title, copy = '') {
  return `<div class="empty-state"><div class="empty-state-inner"><span class="empty-icon">${icon('bookmark', 17)}</span><p class="empty-title">${title}</p>${copy ? `<p class="empty-copy">${copy}</p>` : ''}</div></div>`;
}

function renderShelfPicker() {
  const postId = state.shelfPickerPostId;
  if (!postId) return '';
  const account = activeAccount();
  const post = state.posts.find((entry) => entry.id === postId && isVisibleFanPost(entry));
  const shelves = state.shelves.filter((shelf) => shelf.ownerId === account?.id);
  const preview = post
    ? escapeHTML(post.content?.trim().slice(0, 130) || (post.media?.type === 'video' ? 'Video post' : post.media?.type === 'image' ? 'Image post' : 'Fan post'))
    : 'This post is no longer available.';
  const disabled = state.shelfLoading ? 'disabled' : '';
  const checkboxes = shelves.map((shelf) => `<label class="shelf-picker-option"><input type="checkbox" name="shelfIds" value="${escapeHTML(shelf.id)}" ${state.shelfPickerSelection.includes(shelf.id) ? 'checked' : ''} ${disabled}><span><span class="shelf-picker-title">${escapeHTML(shelf.title)}</span><span class="shelf-picker-visibility">${shelf.visibility === 'public' ? 'Public' : 'Private'}</span></span></label>`).join('');
  return `<div class="shelf-modal-backdrop">
    <section class="shelf-picker" role="dialog" aria-modal="true" aria-labelledby="shelf-picker-title">
      <div class="shelf-picker-head"><div><p class="eyebrow">Keep close</p><h2 class="shelf-picker-heading" id="shelf-picker-title">Add to Shelf</h2></div><button class="icon-button" type="button" data-action="close-shelf-picker" aria-label="Close Shelf picker" ${disabled}>${icon('close', 17)}</button></div>
      <p class="shelf-picker-post">${preview}</p>
      ${state.shelfPickerError ? `<p class="inline-error" role="alert">${escapeHTML(state.shelfPickerError)}</p>` : ''}
      ${!post ? renderEmpty('Post unavailable.') : shelves.length ? `<form data-form="shelf-picker" data-post-id="${escapeHTML(post.id)}" novalidate ${state.shelfLoading ? 'aria-busy="true"' : ''}>
        <fieldset class="shelf-picker-list"><legend class="shelf-picker-legend">Choose one or more Shelves</legend>${checkboxes}</fieldset>
        <div class="shelf-picker-actions"><button class="primary-button" type="submit" ${disabled}>${state.shelfLoading ? `<span class="registration-loading"><span class="loading-dot"></span>Saving…</span>` : `Save to Shelves ${icon('arrow', 14)}`}</button><button class="quiet-button" type="button" data-action="close-shelf-picker" ${disabled}>Cancel</button></div>
      </form>` : `<div class="shelf-picker-empty">${renderEmpty('You haven’t created a Shelf yet.', 'Create one to save this post for later.') }<button class="primary-button" type="button" data-action="create-shelf-from-picker">Create a Shelf ${icon('arrow', 14)}</button></div>`}
    </section>
  </div>`;
}

function renderHome() {
  const selected = state.homeTab === 'for-you';
  const account = activeAccount();
  const followedIds = new Set(followedArtistIds(account?.id || ''));
  const items = homeFeedItems(selected ? null : followedIds);
  const hasFollowedArtists = followedIds.size > 0;
  const tabDescription = selected
    ? 'Fan posts from every Artist Board, newest first.'
    : account?.role === 'Fan'
      ? 'Only posts from Artists you have added to My Artists.'
      : 'A private feed available to Fan accounts.';
  const status = state.postStatus?.userId === account?.id
    ? `<p class="success-banner" role="status">${icon('check', 15)}${escapeHTML(state.postStatus.message)}</p>`
    : '';
  const pendingStatus = state.postPublishing && state.pendingPost?.authorId === account?.id
    ? `<p class="post-saving" role="status">Publishing your post…</p>`
    : '';
  let content;
  if (items.length) {
    content = `<div class="post-list home-feed">${items.map(renderFeedItem).join('')}</div>`;
  } else if (selected) {
    content = `${renderEmpty('Nothing here yet. Discover artists and start collecting.')}<div class="home-empty-explore"><a class="quiet-button" href="${hrefFor('/explore')}" data-route="/explore">Explore artists ${icon('arrow', 14)}</a></div>`;
  } else if (!hasFollowedArtists) {
    const title = account?.role === 'Fan' ? "You haven't connected with any artists yet." : 'No artists in My Artists yet.';
    const copy = account?.role === 'Fan' ? 'Follow an artist from their board to see posts here.' : 'My Artists is a private list available to Fan accounts.';
    content = `${renderEmpty(title, copy)}${account?.role === 'Fan' ? `<div class="empty-action"><a class="quiet-button" href="${hrefFor('/explore')}" data-route="/explore">Explore artist boards ${icon('arrow', 14)}</a></div>` : ''}`;
  } else {
    content = `${renderEmpty('No posts from your artists yet.', 'When they share something, it will appear here.')}<div class="empty-action"><a class="quiet-button" href="${hrefFor('/explore')}" data-route="/explore">Explore more artists ${icon('arrow', 14)}</a></div>`;
  }
  return `<section class="home-page"><header class="home-intro"><p class="eyebrow">A quieter kind of feed</p><h1 class="page-title">Home</h1><p class="page-subtitle">A place for work that stays with you.</p></header>
    <div class="home-tab-row"><div class="home-tabs" role="tablist" aria-label="Home feed"><button class="home-tab" type="button" data-action="home-tab" data-tab="for-you" role="tab" aria-selected="${selected}">For You</button><button class="home-tab" type="button" data-action="home-tab" data-tab="my-artists" role="tab" aria-selected="${!selected}">My Artists</button></div><p class="home-tab-context" aria-live="polite">${tabDescription}</p></div>
    ${status}${pendingStatus}${content}
  </section>`;
}

function boardPortrait(board, large = false) {
  const className = large ? 'board-portrait board-portrait-large' : 'board-portrait';
  if (board.profileImage) {
    return `<img class="${className}" src="${escapeHTML(board.profileImage)}" alt="${escapeHTML(board.artistName)}">`;
  }
  return `<span class="${className} board-portrait-initial" aria-hidden="true">${escapeHTML((board.artistName.trim()[0] || 'A').toUpperCase())}</span>`;
}

function renderBoardCard(board) {
  const route = `/board/${encodeURIComponent(board.id)}`;
  return `<a class="board-card" href="${hrefFor(route)}" data-route="${route}">
    ${boardPortrait(board)}
    <span class="board-card-copy"><span class="board-card-name">${escapeHTML(board.artistName)}</span><span class="board-card-discipline">${escapeHTML(board.discipline)}</span><span class="board-card-bio">${escapeHTML(board.biography)}</span></span>
    ${icon('arrow', 15)}
  </a>`;
}

function renderPostMedia(media, username) {
  if (!media) return '';
  const url = escapeHTML(media.url);
  if (media.type === 'image') {
    return `<div class="post-media"><img src="${url}" alt="Image shared by @${escapeHTML(username)}"></div>`;
  }
  return `<div class="post-media"><video controls preload="metadata" src="${url}" aria-label="Video shared by @${escapeHTML(username)}"></video></div>`;
}

function renderCommentForm(post, comment = null) {
  const account = activeAccount();
  if (account?.role !== 'Fan') return '';
  const editing = Boolean(comment);
  const key = editing ? comment.id : commentDraftKey(account.id, post.id);
  const value = editing ? state.commentEditor?.content || '' : state.commentDrafts[key] || '';
  const error = state.commentErrors[key] || '';
  const pending = state.commentPending;
  const disabled = pending ? 'disabled' : '';
  const isPending = pending?.postId === post.id && pending?.userId === account.id
    && (editing ? pending.commentId === comment.id : pending.action === 'create');
  return `<form class="comment-form" data-form="comment" data-post-id="${escapeHTML(post.id)}" data-comment-id="${escapeHTML(comment?.id || '')}" novalidate ${isPending ? 'aria-busy="true"' : ''}>
    <label class="comment-field-label">${editing ? 'Edit your comment' : 'Add a comment'}<textarea class="field-input field-textarea comment-textarea" name="commentContent" rows="3" maxlength="1000" placeholder="${editing ? 'Edit your comment…' : 'Add to the conversation…'}" aria-invalid="${Boolean(error)}" ${disabled}>${escapeHTML(value)}</textarea></label>
    ${error ? `<p class="inline-error" role="alert">${escapeHTML(error)}</p>` : ''}
    <div class="comment-form-actions"><button class="primary-button" type="submit" ${disabled}>${isPending ? `<span class="registration-loading"><span class="loading-dot"></span>${pending.action === 'edit' ? 'Saving…' : 'Posting…'}</span>` : `${editing ? 'Save comment' : 'Post comment'} ${icon('arrow', 13)}`}</button>${editing ? `<button class="quiet-button" type="button" data-action="cancel-comment-edit" ${disabled}>Cancel</button>` : ''}</div>
  </form>`;
}

function renderCommentItem(comment) {
  const account = activeAccount();
  const isOwner = account?.role === 'Fan' && account.id === comment.authorId;
  const isEditing = isOwner && state.commentEditor?.commentId === comment.id;
  const isDeleting = isOwner && state.commentDeleteConfirmId === comment.id;
  const pending = state.commentPending?.commentId === comment.id;
  const disabled = state.commentPending ? 'disabled' : '';
  const profileRoute = `/profile/${encodeURIComponent(comment.authorId)}`;
  return `<li class="comment-item">
    <div class="comment-head"><a class="comment-author" href="${hrefFor(profileRoute)}" data-route="${profileRoute}">@${escapeHTML(comment.authorUsername)}</a><span class="comment-date">${escapeHTML(formatPostDate(comment.createdAt))}${comment.updatedAt ? ' · edited' : ''}</span></div>
    ${isEditing ? renderCommentForm(state.posts.find((post) => post.id === comment.postId), comment) : `<p class="comment-content">${escapeHTML(comment.content)}</p>`}
    ${isOwner && !isEditing ? `<div class="comment-actions">${pending ? `<span class="post-saving" role="status">Updating comment…</span>` : isDeleting ? `<div class="comment-delete-confirm" role="alert"><span>Delete this comment?</span><button class="text-button text-danger" type="button" data-action="confirm-delete-comment" data-comment-id="${escapeHTML(comment.id)}" ${disabled}>Delete</button><button class="text-button" type="button" data-action="cancel-delete-comment" ${disabled}>Cancel</button></div>` : `<button class="text-button" type="button" data-action="edit-comment" data-comment-id="${escapeHTML(comment.id)}" ${disabled}>${icon('edit', 12)} Edit</button><button class="text-button text-danger" type="button" data-action="request-delete-comment" data-comment-id="${escapeHTML(comment.id)}" ${disabled}>${icon('trash', 12)} Delete</button>`}</div>` : ''}
  </li>`;
}

function renderCommentThread(post) {
  const account = activeAccount();
  const expanded = state.expandedCommentPostIds.includes(post.id);
  const comments = state.comments.filter((comment) => comment.postId === post.id)
    .sort((left, right) => left.createdAt - right.createdAt || left.id.localeCompare(right.id));
  const status = state.commentStatus?.postId === post.id && state.commentStatus?.userId === account?.id
    ? `<p class="${state.commentStatus.kind === 'error' ? 'error-banner' : 'success-banner'} comment-status" role="${state.commentStatus.kind === 'error' ? 'alert' : 'status'}">${state.commentStatus.kind === 'success' ? icon('check', 14) : ''}${escapeHTML(state.commentStatus.message)}</p>`
    : '';
  const pending = state.commentPending?.postId === post.id && state.commentPending?.userId === account?.id
    ? `<p class="post-saving" role="status">${state.commentPending.action === 'delete' ? 'Deleting comment…' : state.commentPending.action === 'edit' ? 'Saving comment…' : 'Posting comment…'}</p>`
    : '';
  return `<section class="post-comments">
    <button class="text-button comments-toggle" type="button" data-action="toggle-comments" data-post-id="${escapeHTML(post.id)}" aria-expanded="${expanded}">${expanded ? 'Hide comments' : 'Comments'}</button>
    ${expanded ? `<div class="comment-thread">${status}${pending}
      ${comments.length ? `<ol class="comment-list">${comments.map(renderCommentItem).join('')}</ol>` : `<div class="comment-empty">${renderEmpty('No comments yet.', account?.role === 'Fan' ? 'Be the first to add a note.' : 'There is nothing to read here yet.')}</div>`}
      ${account?.role === 'Fan' ? renderCommentForm(post) : `<p class="comment-read-only">Fan accounts can add comments.</p>`}
    </div>` : ''}
  </section>`;
}

function renderPostCard(post) {
  const board = state.boards.find((entry) => entry.id === post.boardId);
  if (!board) return '';
  const account = activeAccount();
  const ownsPost = account?.role === 'Fan' && account.id === post.authorId;
  const boardRoute = `/board/${encodeURIComponent(board.id)}`;
  const profileRoute = `/profile/${encodeURIComponent(post.authorId)}`;
  const editDraft = ownsPost ? state.postDrafts[postDraftKey(account.id, board.id, post.id)] : null;
  const deleteConfirmation = ownsPost && state.deleteConfirmPostId === post.id;
  const ownRepost = account?.role === 'Fan' ? state.reposts.find((entry) => entry.userId === account.id && entry.postId === post.id) : null;
  const repostConfirmation = state.repostConfirm?.postId === post.id && state.repostConfirm?.userId === account?.id;
  const repostPending = state.repostPending?.postId === post.id && state.repostPending?.userId === account?.id;
  const postMutationPending = state.commentPending?.postId === post.id || state.repostPending?.postId === post.id;
  const repostStatus = state.repostStatus?.postId === post.id && state.repostStatus?.userId === account?.id
    ? `<p class="${state.repostStatus.kind === 'error' ? 'error-banner' : 'success-banner'} repost-status" role="${state.repostStatus.kind === 'error' ? 'alert' : 'status'}">${state.repostStatus.kind === 'success' ? icon('check', 14) : ''}${escapeHTML(state.repostStatus.message)}</p>`
    : '';
  const shelfStatus = state.shelfStatus?.ownerId === account?.id && state.shelfStatus?.postId === post.id
    ? `<p class="shelf-post-status" role="status">${icon('check', 13)}${escapeHTML(state.shelfStatus.message)}</p>`
    : '';
  return `<article class="post-card" id="post-card-${escapeHTML(post.id)}">
    <div class="post-card-heading">
      <div class="post-author"><span class="post-avatar" aria-hidden="true">${escapeHTML((post.authorUsername[0] || 'F').toUpperCase())}</span><span><a class="post-author-name" href="${hrefFor(profileRoute)}" data-route="${profileRoute}">@${escapeHTML(post.authorUsername)}</a><span class="post-date">Published ${escapeHTML(formatPostDate(post.publishedAt))}</span></span></div>
      <span class="post-board-context">On <a class="post-board-link" href="${hrefFor(boardRoute)}" data-route="${boardRoute}">${escapeHTML(board.artistName)}</a>’s board ${icon('arrow', 12)}</span>
    </div>
    ${post.content ? `<p class="post-content">${escapeHTML(post.content)}</p>` : ''}
    ${renderPostMedia(post.media, post.authorUsername)}
    ${shelfStatus}
    ${ownsPost && editDraft ? `<div class="post-draft-inline"><span>Unpublished edits saved in this tab.</span><div><button class="text-button" type="button" data-action="resume-post-draft" data-board-id="${escapeHTML(board.id)}" data-post-id="${escapeHTML(post.id)}">Resume editing</button><button class="text-button text-danger" type="button" data-action="discard-saved-post-draft" data-board-id="${escapeHTML(board.id)}" data-post-id="${escapeHTML(post.id)}">Discard draft</button></div></div>` : ''}
    <div class="post-actions">
      <button class="text-button shelf-save-button" type="button" data-action="open-shelf-picker" data-post-id="${escapeHTML(post.id)}" ${state.shelfLoading ? 'disabled' : ''}>${icon('bookmark', 13)} Add to Shelf</button>
      ${account?.role === 'Fan' ? `<button class="text-button repost-button" type="button" data-action="toggle-repost" data-post-id="${escapeHTML(post.id)}" ${state.repostPending ? 'disabled' : ''}>${icon('repost', 13)} ${ownRepost ? 'Undo repost' : 'Repost'}</button>` : ''}
      ${ownsPost ? (state.postPublishing
        ? `<span class="post-saving" role="status">${state.pendingPost?.postId === post.id ? 'Saving changes…' : 'Please wait for the post to finish publishing…'}</span>`
        : deleteConfirmation
        ? `<div class="post-delete-confirm" role="alert"><span>Delete this post?</span><button class="text-button text-danger" type="button" data-action="confirm-delete-post" data-post-id="${escapeHTML(post.id)}" ${postMutationPending ? 'disabled' : ''}>Delete</button><button class="text-button" type="button" data-action="cancel-delete-post" ${postMutationPending ? 'disabled' : ''}>Cancel</button></div>`
        : `<button class="text-button" type="button" data-action="edit-post" data-board-id="${escapeHTML(board.id)}" data-post-id="${escapeHTML(post.id)}" ${postMutationPending ? 'disabled' : ''}>${icon('edit', 13)} Edit</button><button class="text-button text-danger" type="button" data-action="request-delete-post" data-post-id="${escapeHTML(post.id)}" ${postMutationPending ? 'disabled' : ''}>${icon('trash', 13)} Delete</button>`) : ''}
    </div>
    ${repostConfirmation ? `<div class="repost-confirm" role="alert"><span>${state.repostConfirm.action === 'undo' ? 'Undo your repost?' : 'Repost this to your profile?'}</span><button class="text-button text-danger" type="button" data-action="confirm-repost" data-post-id="${escapeHTML(post.id)}">Confirm</button><button class="text-button" type="button" data-action="cancel-repost">Cancel</button></div>` : ''}
    ${repostPending ? `<p class="post-saving repost-pending" role="status">${state.repostPending.action === 'undo' ? 'Undoing your repost…' : 'Reposting…'}</p>` : ''}
    ${repostStatus}
    ${renderCommentThread(post)}
  </article>`;
}

function renderFeedItem(item) {
  if (item.type !== 'repost') return renderPostCard(item.post);
  const reposter = state.accounts.find((account) => account.id === item.repost.userId);
  if (!reposter) return '';
  const profileRoute = `/profile/${encodeURIComponent(reposter.id)}`;
  return `<div class="repost-feed-item"><p class="repost-credit">${icon('repost', 13)} <a href="${hrefFor(profileRoute)}" data-route="${profileRoute}">@${escapeHTML(reposter.username)}</a> reposted</p>${renderPostCard(item.post)}</div>`;
}

function renderPostForm(board, editor, draft) {
  const editing = Boolean(editor.postId);
  const error = state.postErrors[editor.key] || '';
  const disabled = state.postPublishing ? 'disabled' : '';
  const mediaPreview = draft.media
    ? `<div class="post-draft-media">${renderPostMedia(draft.media, activeAccount()?.username || '')}<div class="post-draft-media-info"><span>${draft.media.type === 'image' ? 'Image' : 'Video'} attached${draft.media.name ? ` · ${escapeHTML(draft.media.name)}` : ''}</span><button class="text-button text-danger" type="button" data-action="remove-post-media" ${disabled}>Remove media</button></div></div>`
    : '';
  return `<div class="post-composer">
    <p class="eyebrow">${editing ? 'Edit your post' : 'Add to the conversation'}</p>
    <form data-form="post" data-board-id="${escapeHTML(board.id)}" data-post-id="${escapeHTML(editor.postId || '')}" novalidate ${state.postPublishing ? 'aria-busy="true"' : ''}>
      <label class="field-label">Your post<textarea class="field-input field-textarea post-textarea" name="postContent" rows="5" maxlength="2000" placeholder="Share something with this artist’s community" aria-invalid="${Boolean(error)}" data-post-content ${disabled}>${escapeHTML(draft.content)}</textarea></label>
      ${error ? `<p class="inline-error" data-post-error role="alert">${escapeHTML(error)}</p>` : ''}
      <label class="field-label post-upload-label">Add an image or video <span class="optional-label">(optional)</span><input class="file-input" type="file" data-post-media accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm" ${disabled}><span class="field-hint">Images up to 10 MB; MP4 or WebM videos up to 25 MB.</span></label>
      ${mediaPreview}
      <div class="post-form-actions">
        <button class="primary-button" type="submit" ${disabled}>${state.postPublishing ? `<span class="registration-loading"><span class="loading-dot"></span>${editing ? 'Saving…' : 'Publishing…'}</span>` : `${editing ? 'Save changes' : 'Publish post'} ${icon('arrow', 14)}`}</button>
        <button class="quiet-button" type="button" data-action="save-post-draft" ${disabled}>Save draft</button>
        <button class="text-button" type="button" data-action="discard-current-post-draft" ${disabled}>${editing ? 'Discard changes' : 'Discard draft'}</button>
      </div>
    </form>
  </div>`;
}

function renderBoardComposer(board) {
  const account = activeAccount();
  if (account?.role !== 'Fan') return '';
  const editor = state.postEditor;
  if (editor?.boardId === board.id && editor.authorId === account.id) {
    return renderPostForm(board, editor, state.postDrafts[editor.key]);
  }
  if (state.postPublishing) {
    return `<p class="post-saving" role="status">Publishing your post…</p>`;
  }
  const draft = state.postDrafts[postDraftKey(account.id, board.id)];
  if (draft) {
    return `<div class="saved-post-draft"><div><p class="draft-label">Draft</p><p class="draft-copy">${draft.content ? escapeHTML(draft.content.slice(0, 140)) : draft.media ? `${draft.media.type === 'image' ? 'Image' : 'Video'} attached` : 'An empty draft saved in this tab'}</p></div><button class="quiet-button" type="button" data-action="resume-post-draft" data-board-id="${escapeHTML(board.id)}">Continue draft ${icon('arrow', 14)}</button><button class="text-button text-danger" type="button" data-action="discard-saved-post-draft" data-board-id="${escapeHTML(board.id)}">Discard</button></div>`;
  }
  return `<div class="post-create-trigger"><button class="primary-button" type="button" data-action="start-post" data-board-id="${escapeHTML(board.id)}">${icon('plus', 15)} Write a post</button></div>`;
}

function renderExploreArtist(account) {
  const board = boardForOwner(account.id);
  const route = `/profile/${encodeURIComponent(account.id)}`;
  const discipline = board?.discipline || 'Artist';
  return `<a class="explore-artist-result" href="${hrefFor(route)}" data-route="${route}">
    <span class="explore-artist-mark" aria-hidden="true">${escapeHTML((account.name.trim()[0] || account.username[0] || 'A').toUpperCase())}</span>
    <span class="explore-artist-copy"><span class="explore-artist-name">${escapeHTML(board?.artistName || account.name)}</span><span class="explore-artist-meta">@${escapeHTML(account.username)} · ${escapeHTML(discipline)}</span></span>
    ${icon('arrow', 15)}
  </a>`;
}

function renderExplorePost(post) {
  const board = state.boards.find((entry) => entry.id === post.boardId);
  const author = state.accounts.find((entry) => entry.id === post.authorId);
  if (!board || !author) return '';
  const route = `/post/${encodeURIComponent(post.id)}`;
  const title = post.title || post.artworkTitle || (post.media?.name ? post.media.name.replace(/\.[^.]+$/, '') : '');
  const excerpt = post.content?.trim() || (post.media?.type === 'video' ? 'Video post' : post.media?.type === 'image' ? 'Image post' : 'Fan post');
  return `<a class="explore-post-result" href="${hrefFor(route)}" data-route="${route}">
    <span class="explore-post-kicker">${escapeHTML(board.discipline)} · ${escapeHTML(formatPostDate(post.publishedAt))}</span>
    <span class="explore-post-title">${escapeHTML(title || excerpt.slice(0, 92))}</span>
    ${title && post.content ? `<span class="explore-post-excerpt">${escapeHTML(excerpt.slice(0, 150))}</span>` : ''}
    <span class="explore-post-credit">By @${escapeHTML(author.username)} · On ${escapeHTML(board.artistName)}’s board</span>
    ${icon('arrow', 15)}
  </a>`;
}

function renderExploreError() {
  return `<div class="explore-feedback explore-error" role="alert"><p class="explore-feedback-title">Explore couldn’t load these results.</p><p class="explore-feedback-copy">Your in-memory content is still here. Try again or reset your search.</p><button class="quiet-button" type="button" data-action="retry-explore">Try again</button><button class="text-button" type="button" data-action="reset-explore">Reset search and filters</button></div>`;
}

function renderExploreResults() {
  if (state.exploreError) return renderExploreError();
  if (state.exploreLoading) {
    return `<div class="explore-feedback explore-loading" role="status" aria-live="polite"><span class="loading-dot"></span>Searching your Stillroom…</div>`;
  }
  const { artists, boards, posts } = exploreResults();
  const total = artists.length + boards.length + posts.length;
  if (!total) {
    const hasCriteria = state.exploreQuery.trim() || state.exploreDiscipline !== 'all';
    if (!hasCriteria) return renderEmpty('Nothing to discover yet.', 'Artist profiles, boards, and Fan posts will appear here when they’re created.');
    return `<div class="explore-no-results">${renderEmpty('No results found.', 'Try another search or clear the selected discipline.')}<div class="empty-action"><button class="quiet-button" type="button" data-action="reset-explore">Reset search and filters</button></div></div>`;
  }

  const countLine = `${artists.length} ${artists.length === 1 ? 'artist' : 'artists'} · ${boards.length} ${boards.length === 1 ? 'board' : 'boards'} · ${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`;
  return `<p class="explore-result-count" role="status">${countLine}</p>
    ${artists.length ? `<section class="explore-result-section"><h2 class="section-heading">Artists</h2><div class="explore-artist-list">${artists.map(renderExploreArtist).join('')}</div></section>` : ''}
    ${boards.length ? `<section class="explore-result-section"><h2 class="section-heading">${state.exploreQuery.trim() || state.exploreDiscipline !== 'all' ? 'Artist Boards' : 'Recently created boards'}</h2><div class="board-grid">${boards.map(renderBoardCard).join('')}</div></section>` : ''}
    ${posts.length ? `<section class="explore-result-section"><h2 class="section-heading">${state.exploreQuery.trim() || state.exploreDiscipline !== 'all' ? 'Fan Posts' : 'Recent posts'}</h2><div class="explore-post-list">${posts.map(renderExplorePost).join('')}</div></section>` : ''}`;
}

function queueExploreSearch() {
  if (state.exploreTimer) window.clearTimeout(state.exploreTimer);
  state.exploreError = '';
  state.exploreLoading = true;
  const results = app.querySelector('#explore-results');
  if (results) {
    results.setAttribute('aria-busy', 'true');
    results.innerHTML = renderExploreResults();
  }
  state.exploreTimer = window.setTimeout(() => {
    state.exploreTimer = null;
    state.exploreLoading = false;
    try {
      const latestResults = app.querySelector('#explore-results');
      if (latestResults) {
        latestResults.removeAttribute('aria-busy');
        latestResults.innerHTML = renderExploreResults();
      }
    } catch {
      state.exploreError = 'search-failed';
      const latestResults = app.querySelector('#explore-results');
      if (latestResults) {
        latestResults.removeAttribute('aria-busy');
        latestResults.innerHTML = renderExploreResults();
      }
    }
  }, 140);
}

function resetExplore() {
  if (state.exploreTimer) window.clearTimeout(state.exploreTimer);
  state.exploreTimer = null;
  state.exploreQuery = '';
  state.exploreDiscipline = 'all';
  state.exploreLoading = false;
  state.exploreError = '';
  render();
}

function renderExplore() {
  const disciplines = ['all', ...exploreDisciplines, 'Other'];
  return `<section><p class="eyebrow">Find your next room</p><h1 class="page-title">Explore</h1><p class="page-subtitle">Search artists, boards, and Fan posts by name, username, title, or keywords.</p>
    <div class="explore-controls">
      <label class="explore-search">${icon('search', 16)}<input type="search" data-explore-search aria-label="Search artists, boards, and posts" placeholder="Search names, titles, or keywords" value="${escapeHTML(state.exploreQuery)}"><button class="icon-button" type="button" data-action="clear-explore-search" aria-label="Clear search" ${state.exploreQuery ? '' : 'hidden'}>${icon('close', 15)}</button></label>
      <label class="explore-discipline-label"><span class="eyebrow">Discipline</span><select class="explore-discipline" data-explore-discipline aria-label="Filter by discipline">${disciplines.map((discipline) => `<option value="${discipline === 'all' ? 'all' : escapeHTML(discipline)}" ${state.exploreDiscipline === (discipline === 'all' ? 'all' : discipline) ? 'selected' : ''}>${discipline === 'all' ? 'All disciplines' : escapeHTML(discipline)}</option>`).join('')}</select></label>
    </div>
    <div id="explore-results" aria-live="polite">${renderExploreResults()}</div>
  </section>`;
}

function renderFollowedBoard(board) {
  return `<div class="followed-board-row">${renderBoardCard(board)}<button class="text-button text-danger" type="button" data-action="toggle-artist-follow" data-board-id="${escapeHTML(board.id)}" aria-pressed="true">Remove from My Artists</button></div>`;
}

function renderArtists() {
  const account = activeAccount();
  if (account?.role === 'Fan') {
    const followed = new Set(followedArtistIds(account.id));
    const boards = state.boards.filter((board) => followed.has(board.ownerId));
    const status = state.followStatus?.userId === account.id
      ? `<p class="success-banner" role="status">${icon('check', 15)}${escapeHTML(state.followStatus.message)}</p>`
      : '';
    if (!boards.length) {
      return `<section><p class="eyebrow">The rooms you return to</p><h1 class="page-title">My Artists</h1><p class="page-subtitle">A private list of artists you choose to follow.</p>${status}${renderEmpty("You haven't connected with any artists yet.", 'Visit an artist board to add them here.')}<div class="empty-action"><a class="quiet-button" href="${hrefFor('/explore')}" data-route="/explore">Explore artist boards ${icon('arrow', 14)}</a></div></section>`;
    }
    return `<section><p class="eyebrow">The rooms you return to</p><h1 class="page-title">My Artists</h1><p class="page-subtitle">A private list of artists you choose to follow.</p>${status}<div class="followed-board-list">${boards.map(renderFollowedBoard).join('')}</div></section>`;
  }
  if (account?.role !== 'Artist') {
    return `<section><p class="eyebrow">The rooms you return to</p><h1 class="page-title">My Artists</h1><p class="page-subtitle">The artists you choose to keep close.</p>${renderEmpty("You haven't added any artists to My Artists yet.")}<div class="empty-action"><a class="quiet-button" href="${hrefFor('/explore')}" data-route="/explore">Explore artist boards ${icon('arrow', 14)}</a></div></section>`;
  }

  const board = boardForOwner(account.id);
  if (!board) {
    return `<section><p class="eyebrow">Your artist space</p><h1 class="page-title">My Artists</h1><p class="page-subtitle">Create your personal board so fans can find your work.</p>
      <div class="empty-state"><div class="empty-state-inner"><span class="empty-icon">${icon('image', 17)}</span><p class="empty-title">You don’t have a board yet.</p><p class="empty-copy">Create one personal board for your name, discipline, and biography.</p><button class="primary-button empty-cta" type="button" data-action="create-board">Create your board ${icon('arrow', 14)}</button></div></div>
    </section>`;
  }

  return `<section><p class="eyebrow">Your artist space</p><div class="page-heading-row"><div><h1 class="page-title">My Artists</h1><p class="page-subtitle">Your personal artist board.</p></div><button class="quiet-button" type="button" data-action="edit-own-board">${icon('edit', 15)} Edit board</button></div>
    ${state.boardSuccessId === board.id ? `<p class="success-banner" role="status">${icon('check', 15)}${escapeHTML(state.boardSuccess)}</p>` : ''}
    <div class="owned-board-card">${renderBoardCard(board)}<span class="owned-board-empty">Your board is empty until fans discover it.</span></div>
  </section>`;
}

function boardFieldError(field) {
  return state.boardErrors[field] ? `<span class="field-error" id="board-error-${field}" role="alert">${escapeHTML(state.boardErrors[field])}</span>` : '';
}

function renderBoardForm(mode) {
  const account = activeAccount();
  const existing = account?.role === 'Artist' ? boardForOwner(account.id) : null;
  if (!account || account.role !== 'Artist') {
    return `<section><p class="eyebrow">Artist board</p><h1 class="page-title">Artists only</h1><p class="page-subtitle">Only Artist accounts can create or edit artist boards.</p>${renderEmpty('This action isn’t available for your account type.')}<div class="empty-action"><a class="quiet-button" href="${hrefFor('/artists')}" data-route="/artists">Back to My Artists</a></div></section>`;
  }
  if (mode === 'create' && existing) {
    return `<section><p class="eyebrow">One personal board</p><h1 class="page-title">Your board already exists.</h1><p class="page-subtitle">Each Artist account can have one personal board.</p><div class="empty-action"><a class="primary-button" href="${hrefFor(`/board/${encodeURIComponent(existing.id)}`)}" data-route="/board/${encodeURIComponent(existing.id)}">View your board ${icon('arrow', 14)}</a></div></section>`;
  }
  if (mode === 'edit' && !existing) {
    return `<section><p class="eyebrow">Artist board</p><h1 class="page-title">No board to edit yet.</h1><p class="page-subtitle">Create your personal board first.</p><div class="empty-action"><button class="primary-button" type="button" data-action="create-board">Create your board ${icon('arrow', 14)}</button></div></section>`;
  }

  if (!state.boardDraft) {
    state.boardDraft = existing
      ? { artistName: existing.artistName, discipline: existing.discipline, biography: existing.biography, profileImage: existing.profileImage || '' }
      : { artistName: account.name, discipline: '', biography: '', profileImage: '' };
  }
  const draft = state.boardDraft;
  const editing = mode === 'edit';
  const disabled = state.boardLoading || state.usernameLoading ? 'disabled' : '';
  const saveDisabled = state.boardLoading || state.boardImageLoading || state.usernameLoading ? 'disabled' : '';
  const imagePreview = draft.profileImage
    ? `<div class="board-image-preview"><img src="${escapeHTML(draft.profileImage)}" alt="Selected profile image"><div><p class="preview-title">Profile image selected</p><button class="text-button" type="button" data-action="remove-board-image">Remove image</button></div></div>`
    : '';
  return `<section><p class="eyebrow">${editing ? 'Your artist space' : 'Make it yours'}</p><h1 class="page-title">${editing ? 'Edit your board' : 'Create your board'}</h1><p class="page-subtitle">Your board is a quiet introduction. It starts empty, with no posts.</p>
    <div class="board-form-card">
      ${state.boardErrors.form ? `<p class="inline-error" role="alert">${escapeHTML(state.boardErrors.form)}</p>` : ''}
      <form data-form="board" data-mode="${mode}" novalidate ${state.boardLoading || state.boardImageLoading || state.usernameLoading ? 'aria-busy="true"' : ''}>
        <label class="field-label">Artist name<input class="field-input" name="artistName" value="${escapeHTML(draft.artistName)}" placeholder="The name fans will see" aria-invalid="${Boolean(state.boardErrors.artistName)}" ${state.boardErrors.artistName ? 'aria-describedby="board-error-artistName"' : ''} ${disabled} required>${boardFieldError('artistName')}</label>
        <label class="field-label">Artistic discipline<input class="field-input" name="discipline" value="${escapeHTML(draft.discipline)}" placeholder="Music, film, photography…" aria-invalid="${Boolean(state.boardErrors.discipline)}" ${state.boardErrors.discipline ? 'aria-describedby="board-error-discipline"' : ''} ${disabled} required>${boardFieldError('discipline')}</label>
        <label class="field-label">Biography<textarea class="field-input field-textarea" name="biography" rows="5" maxlength="800" placeholder="A few words about your practice and work" aria-invalid="${Boolean(state.boardErrors.biography)}" ${state.boardErrors.biography ? 'aria-describedby="board-error-biography"' : ''} ${disabled} required>${escapeHTML(draft.biography)}</textarea>${boardFieldError('biography')}</label>
        <label class="field-label">Profile image <span class="optional-label">(optional)</span><input class="file-input" name="profileImage" type="file" accept="image/png,image/jpeg,image/webp" data-board-image ${disabled}><span class="field-hint">PNG, JPG, or WebP. Maximum 4 MB.</span></label>
        ${state.boardImageLoading ? `<p class="field-hint" role="status">Preparing image…</p>` : ''}
        ${state.boardImageError ? `<p class="inline-error" role="alert">${escapeHTML(state.boardImageError)}</p>` : ''}
        ${imagePreview}
        <div class="board-form-footer"><button class="primary-button" type="submit" ${saveDisabled} data-testid="button-save-board">${state.boardLoading ? `<span class="registration-loading"><span class="loading-dot"></span>${editing ? 'Saving…' : 'Creating…'}</span>` : state.boardImageLoading ? 'Preparing image…' : `${editing ? 'Save changes' : 'Create board'} ${icon('arrow', 14)}`}</button><button class="quiet-button" type="button" data-action="cancel-board-form" ${disabled}>Cancel</button></div>
      </form>
    </div>
    ${editing ? renderUsernameChange(account) : ''}
  </section>`;
}

function renderBoardDetail(boardId) {
  const board = state.boards.find((entry) => entry.id === boardId);
  if (!board) {
    return `<section><p class="eyebrow">Artist board</p><h1 class="page-title">Board not found.</h1><p class="page-subtitle">This board isn’t available in this session.</p>${renderEmpty('No board found.') }<div class="empty-action"><a class="quiet-button" href="${hrefFor('/explore')}" data-route="/explore">Back to Explore ${icon('arrow', 14)}</a></div></section>`;
  }
  const owner = activeAccount()?.role === 'Artist' && activeAccount()?.id === board.ownerId;
  const account = activeAccount();
  const ownerAccount = state.accounts.find((account) => account.id === board.ownerId);
  const ownerProfileRoute = `/profile/${encodeURIComponent(board.ownerId)}`;
  const username = ownerAccount ? `<a href="${hrefFor(ownerProfileRoute)}" data-route="${ownerProfileRoute}">@${escapeHTML(ownerAccount.username)}</a>` : '';
  const following = account?.role === 'Fan' && isFollowingArtist(account.id, board.ownerId);
  const posts = chronologicalPosts(state.posts.filter((post) => post.boardId === board.id));
  const postStatus = state.postStatus?.boardId === board.id && state.postStatus?.userId === account?.id
    ? `<p class="success-banner" role="status">${icon('check', 15)}${escapeHTML(state.postStatus.message)}</p>`
    : '';
  const followStatus = state.followStatus?.boardId === board.id && state.followStatus?.userId === account?.id
    ? `<p class="success-banner" role="status">${icon('check', 15)}${escapeHTML(state.followStatus.message)}</p>`
    : '';
  return `<section><p class="eyebrow">Artist board</p>
    ${owner && state.boardSuccessId === board.id ? `<p class="success-banner" role="status">${icon('check', 15)}${escapeHTML(state.boardSuccess)}</p>` : ''}
    <div class="board-detail">
      ${boardPortrait(board, true)}
      <div class="board-detail-copy"><span class="board-card-discipline">${escapeHTML(board.discipline)}</span><h1 class="page-title">${escapeHTML(board.artistName)}</h1><p class="board-owner-handle">${username}</p><p class="board-biography">${escapeHTML(board.biography)}</p>
        ${owner ? `<button class="quiet-button board-edit-button" type="button" data-action="edit-own-board">${icon('edit', 15)} Edit board information</button>` : ''}
        ${account?.role === 'Fan' ? `<button class="quiet-button board-follow-button" type="button" data-action="toggle-artist-follow" data-board-id="${escapeHTML(board.id)}" aria-pressed="${following}">${following ? 'Remove from My Artists' : 'Add to My Artists'}</button>` : ''}
      </div>
    </div>
    ${followStatus}${postStatus}
    ${renderBoardComposer(board)}
    ${posts.length ? `<div class="post-list board-post-list">${posts.map((post) => renderPostCard(post)).join('')}</div>` : `<div class="board-content-empty">${renderEmpty('This board is empty.', 'There are no posts here yet.')}</div>`}
  </section>`;
}

function renderShelfCard(shelf) {
  const route = `/shelves/${encodeURIComponent(shelf.id)}`;
  return `<a class="shelf-card" href="${hrefFor(route)}" data-route="${route}">
    <span class="shelf-card-mark">${icon('bookmark', 17)}</span>
    <span class="shelf-card-copy"><span class="shelf-card-title">${escapeHTML(shelf.title)}</span>${shelf.description ? `<span class="shelf-card-description">${escapeHTML(shelf.description)}</span>` : ''}</span>
    <span class="shelf-visibility shelf-visibility-${shelf.visibility}">${shelf.visibility === 'public' ? 'Public' : 'Private'}</span>
    ${icon('arrow', 14)}
  </a>`;
}

function renderPublicShelves(ownerId, heading = 'Public Shelves') {
  const shelves = state.shelves.filter((shelf) => shelf.ownerId === ownerId && shelf.visibility === 'public');
  return `<section class="profile-shelves"><div class="section-heading-row"><h2 class="section-heading">${heading}</h2>${activeAccount()?.id === ownerId ? `<a class="text-link" href="${hrefFor('/shelves')}" data-route="/shelves">Manage Shelves ${icon('arrow', 13)}</a>` : ''}</div>
    ${shelves.length ? `<div class="shelf-grid">${shelves.map(renderShelfCard).join('')}</div>` : renderEmpty('No public Shelves yet.')}
  </section>`;
}

function renderShelves() {
  const account = activeAccount();
  const shelves = state.shelves.filter((shelf) => shelf.ownerId === account?.id);
  const status = state.shelfStatus?.ownerId === account?.id && !state.shelfStatus?.shelfId && !state.shelfStatus?.postId
    ? `<p class="success-banner ${state.shelfStatus.kind === 'error' ? 'shelf-error-banner' : ''}" role="${state.shelfStatus.kind === 'error' ? 'alert' : 'status'}">${state.shelfStatus.kind === 'error' ? icon('close', 15) : icon('check', 15)}${escapeHTML(state.shelfStatus.message)}</p>`
    : '';
  const loading = state.shelfLoading ? `<p class="shelf-loading" role="status">Updating your Shelves…</p>` : '';
  return `<section><div class="page-heading-row shelf-page-heading"><div><p class="eyebrow">Collected by you</p><h1 class="page-title">Shelves</h1><p class="page-subtitle">A place for the posts you want to revisit, private or public.</p></div><button class="primary-button" type="button" data-action="create-shelf" ${state.shelfLoading ? 'disabled' : ''}>${icon('plus', 15)} Create a Shelf</button></div>
    ${status}${loading}
    ${shelves.length ? `<div class="shelf-grid">${shelves.map(renderShelfCard).join('')}</div>` : `${renderEmpty('Your shelves are empty.', 'Create a Shelf to keep fan posts you want to revisit.')}<div class="empty-action"><button class="quiet-button" type="button" data-action="create-shelf" ${state.shelfLoading ? 'disabled' : ''}>Create your first Shelf ${icon('arrow', 14)}</button></div>`}
  </section>`;
}

function renderShelfDetail(shelfId) {
  const account = activeAccount();
  const shelf = state.shelves.find((entry) => entry.id === shelfId);
  const owner = Boolean(shelf && account?.id === shelf.ownerId);
  if (!shelf || (!owner && shelf.visibility !== 'public')) {
    return `<section><p class="eyebrow">Personal Shelf</p><h1 class="page-title">Shelf not available.</h1><p class="page-subtitle">This Shelf may be private or no longer available.</p>${renderEmpty('Shelf not found.')}<div class="empty-action"><a class="quiet-button" href="${hrefFor('/shelves')}" data-route="/shelves">Back to Shelves ${icon('arrow', 14)}</a></div></section>`;
  }

  const shelfOwner = state.accounts.find((entry) => entry.id === shelf.ownerId);
  const posts = shelf.postIds.map((postId) => state.posts.find((post) => post.id === postId)).filter((post) => post && isVisibleFanPost(post));
  const status = owner && state.shelfStatus?.ownerId === account.id && state.shelfStatus?.shelfId === shelf.id
    ? `<p class="success-banner ${state.shelfStatus.kind === 'error' ? 'shelf-error-banner' : ''}" role="${state.shelfStatus.kind === 'error' ? 'alert' : 'status'}">${state.shelfStatus.kind === 'error' ? icon('close', 15) : icon('check', 15)}${escapeHTML(state.shelfStatus.message)}</p>`
    : '';
  const ownerRoute = `/profile/${encodeURIComponent(shelf.ownerId)}`;
  const confirmDelete = owner && state.shelfDeleteConfirmId === shelf.id;
  const actions = owner
    ? `<div class="shelf-manage-actions"><button class="quiet-button" type="button" data-action="edit-shelf" data-shelf-id="${escapeHTML(shelf.id)}" ${state.shelfLoading ? 'disabled' : ''}>${icon('edit', 14)} Edit Shelf</button><button class="text-button text-danger" type="button" data-action="delete-shelf" data-shelf-id="${escapeHTML(shelf.id)}" ${state.shelfLoading ? 'disabled' : ''}>${icon('trash', 14)} Delete Shelf</button></div>`
    : '';
  const deletePrompt = confirmDelete
    ? `<div class="shelf-delete-confirm" role="alert"><span>Delete this Shelf? Saved posts will remain on their original boards.</span><button class="text-button text-danger" type="button" data-action="confirm-delete-shelf" data-shelf-id="${escapeHTML(shelf.id)}" ${state.shelfLoading ? 'disabled' : ''}>${state.shelfLoading ? 'Deleting…' : 'Delete Shelf'}</button><button class="text-button" type="button" data-action="cancel-delete-shelf" ${state.shelfLoading ? 'disabled' : ''}>Cancel</button></div>`
    : '';
  return `<section><p class="eyebrow">Personal Shelf</p><a class="shelf-back-link" href="${hrefFor('/shelves')}" data-route="/shelves">${icon('back', 14)} All Shelves</a>
    <div class="shelf-detail-heading"><div><span class="shelf-visibility shelf-visibility-${shelf.visibility}">${shelf.visibility === 'public' ? 'Public' : 'Private'}</span><h1 class="page-title">${escapeHTML(shelf.title)}</h1>${shelf.description ? `<p class="page-subtitle shelf-detail-description">${escapeHTML(shelf.description)}</p>` : ''}<p class="shelf-owner-line">By <a href="${hrefFor(ownerRoute)}" data-route="${ownerRoute}">${escapeHTML(shelfOwner?.name || 'Stillroom member')}</a></p></div>${actions}</div>
    ${status}${deletePrompt}
    ${posts.length ? `<div class="shelf-post-list">${posts.map((post) => {
      const board = state.boards.find((entry) => entry.id === post.boardId);
      const route = board ? `/board/${encodeURIComponent(board.id)}` : '/explore';
      return `<article class="shelf-post-item"><div class="shelf-post-toolbar"><a class="text-link" href="${hrefFor(route)}" data-route="${route}">Open original Artist Board ${icon('arrow', 13)}</a>${owner ? `<button class="text-button text-danger" type="button" data-action="remove-post-from-shelf" data-shelf-id="${escapeHTML(shelf.id)}" data-post-id="${escapeHTML(post.id)}">${icon('trash', 13)} Remove from Shelf</button>` : ''}</div>${renderPostCard(post)}</article>`;
    }).join('')}</div>` : renderEmpty('This Shelf is empty.', owner ? 'Add fan posts from any Artist Board to collect them here.' : 'There are no saved posts in this Shelf yet.')}
  </section>`;
}

function shelfFieldError(field) {
  return state.shelfErrors[field] ? `<span class="field-error" id="shelf-error-${field}" role="alert">${escapeHTML(state.shelfErrors[field])}</span>` : '';
}

function renderShelfForm(mode, shelfId = null) {
  const account = activeAccount();
  const existing = shelfId ? state.shelves.find((shelf) => shelf.id === shelfId && shelf.ownerId === account?.id) : null;
  if (!account || (mode === 'edit' && !existing)) {
    return `<section><p class="eyebrow">Personal Shelf</p><h1 class="page-title">Shelf unavailable.</h1>${renderEmpty('You can only edit your own Shelves.')}<div class="empty-action"><a class="quiet-button" href="${hrefFor('/shelves')}" data-route="/shelves">Back to Shelves</a></div></section>`;
  }
  if (!state.shelfDraft || state.shelfDraft.shelfId !== (existing?.id || null)) {
    state.shelfDraft = existing
      ? { shelfId: existing.id, title: existing.title, description: existing.description, visibility: existing.visibility }
      : { shelfId: null, title: '', description: '', visibility: 'private' };
  }
  const draft = state.shelfDraft;
  const disabled = state.shelfLoading ? 'disabled' : '';
  const formError = state.shelfErrors.form ? `<p class="inline-error" role="alert">${escapeHTML(state.shelfErrors.form)}</p>` : '';
  const cancelRoute = existing ? `/shelves/${encodeURIComponent(existing.id)}` : (state.shelfReturnRoute || '/shelves');
  return `<section><p class="eyebrow">${existing ? 'Make a change' : 'A place to return to'}</p><h1 class="page-title">${existing ? 'Edit Shelf' : 'Create a Shelf'}</h1><p class="page-subtitle">Choose what to keep close. You can change visibility at any time.</p>
    <div class="shelf-form-card">${formError}
      <form data-form="shelf" data-mode="${mode}" data-shelf-id="${escapeHTML(existing?.id || '')}" novalidate ${state.shelfLoading ? 'aria-busy="true"' : ''}>
        <label class="field-label">Shelf title<input class="field-input" name="title" maxlength="80" value="${escapeHTML(draft.title)}" placeholder="A title for this collection" aria-invalid="${Boolean(state.shelfErrors.title)}" ${state.shelfErrors.title ? 'aria-describedby="shelf-error-title"' : ''} ${disabled} required>${shelfFieldError('title')}</label>
        <label class="field-label">Description <span class="optional-label">(optional)</span><textarea class="field-input field-textarea" name="description" rows="4" maxlength="500" placeholder="What brings these posts together?" aria-invalid="${Boolean(state.shelfErrors.description)}" ${state.shelfErrors.description ? 'aria-describedby="shelf-error-description"' : ''} ${disabled}>${escapeHTML(draft.description)}</textarea>${shelfFieldError('description')}</label>
        <label class="field-label">Visibility<select class="field-input shelf-visibility-select" name="visibility" ${disabled}><option value="private" ${draft.visibility === 'private' ? 'selected' : ''}>Private — only you can view this Shelf</option><option value="public" ${draft.visibility === 'public' ? 'selected' : ''}>Public — visible from your profile</option></select></label>
        <div class="shelf-form-footer"><button class="primary-button" type="submit" ${disabled}>${state.shelfLoading ? `<span class="registration-loading"><span class="loading-dot"></span>Saving…</span>` : `${existing ? 'Save changes' : 'Create Shelf'} ${icon('arrow', 14)}`}</button><button class="quiet-button" type="button" data-action="cancel-shelf-form" data-cancel-route="${cancelRoute}" ${disabled}>Cancel</button></div>
      </form>
    </div>
  </section>`;
}

function beginShelfForm(mode, shelfId = null) {
  const account = activeAccount();
  const shelf = shelfId ? state.shelves.find((entry) => entry.id === shelfId && entry.ownerId === account?.id) : null;
  if (!account || (mode === 'edit' && !shelf)) return;
  state.shelfDraft = shelf
    ? { shelfId: shelf.id, title: shelf.title, description: shelf.description, visibility: shelf.visibility }
    : { shelfId: null, title: '', description: '', visibility: 'private' };
  state.shelfErrors = {};
  state.shelfStatus = null;
  state.shelfDeleteConfirmId = null;
  if (state.shelfPickerPostId) {
    state.shelfPickerPostId = null;
    state.shelfPickerSelection = [];
    state.shelfPickerError = '';
  }
  navigate(shelf ? `/shelves/${encodeURIComponent(shelf.id)}/edit` : '/shelves/new');
}

function submitShelfForm(form) {
  const account = activeAccount();
  if (!account || state.shelfLoading) return;
  const mode = form.dataset.mode === 'edit' ? 'edit' : 'create';
  const shelfId = form.dataset.shelfId || null;
  const formData = new FormData(form);
  const values = {
    title: String(formData.get('title') || '').trim(),
    description: String(formData.get('description') || '').trim(),
    visibility: String(formData.get('visibility') || 'private'),
  };
  const errors = {};
  if (!values.title) errors.title = 'Add a title for your Shelf.';
  else if (values.title.length > 80) errors.title = 'Shelf titles must be 80 characters or fewer.';
  if (values.description.length > 500) errors.description = 'Descriptions must be 500 characters or fewer.';
  if (!['private', 'public'].includes(values.visibility)) errors.form = 'Choose whether this Shelf is private or public.';
  const existing = mode === 'edit'
    ? state.shelves.find((shelf) => shelf.id === shelfId && shelf.ownerId === account.id)
    : null;
  if (mode === 'edit' && !existing) errors.form = 'This Shelf is no longer available to edit.';
  state.shelfDraft = { shelfId, ...values };
  state.shelfErrors = errors;
  if (Object.keys(errors).length) {
    render();
    app.querySelector('[name="title"]')?.focus();
    return;
  }

  state.shelfLoading = true;
  state.pendingShelf = { action: mode, shelfId, ownerId: account.id, values };
  render();
  state.shelfTimer = window.setTimeout(() => {
    const pending = state.pendingShelf;
    if (!pending || activeAccount()?.id !== pending.ownerId) {
      cancelShelfOperation();
      render();
      return;
    }
    let shelf;
    if (pending.action === 'create') {
      shelf = {
        id: `shelf-${state.nextShelfId++}`,
        ownerId: pending.ownerId,
        ...pending.values,
        postIds: [],
      };
      state.shelves.unshift(shelf);
    } else {
      shelf = state.shelves.find((entry) => entry.id === pending.shelfId && entry.ownerId === pending.ownerId);
      if (!shelf) {
        state.shelfErrors = { form: 'This Shelf could not be updated. Please try again.' };
        state.shelfLoading = false;
        state.shelfTimer = null;
        state.pendingShelf = null;
        render();
        return;
      }
      Object.assign(shelf, pending.values);
    }
    const returnPostId = pending.action === 'create' ? state.shelfReturnPostId : null;
    state.shelfStatus = {
      ownerId: pending.ownerId,
      shelfId: shelf.id,
      message: pending.action === 'create' ? 'Shelf created.' : 'Shelf updated.',
    };
    state.shelfDraft = null;
    state.shelfErrors = {};
    state.shelfLoading = false;
    state.shelfTimer = null;
    state.pendingShelf = null;
    state.shelfReturnPostId = null;
    state.shelfReturnRoute = null;
    navigate(`/shelves/${encodeURIComponent(shelf.id)}`);
    if (returnPostId && state.posts.some((entry) => entry.id === returnPostId)) openShelfPicker(returnPostId, shelf.id);
  }, 180);
}

function openShelfPicker(postId, preselectedShelfId = null) {
  const account = activeAccount();
  const post = state.posts.find((entry) => entry.id === postId && isVisibleFanPost(entry));
  if (!account || !post || state.shelfLoading) return;
  const ownedShelves = state.shelves.filter((shelf) => shelf.ownerId === account.id);
  state.shelfPickerPostId = post.id;
  state.shelfPickerSelection = ownedShelves
    .filter((shelf) => shelf.postIds.includes(post.id) || shelf.id === preselectedShelfId)
    .map((shelf) => shelf.id);
  state.shelfPickerError = '';
  render();
}

function submitShelfPicker(form) {
  const account = activeAccount();
  const postId = form.dataset.postId;
  const post = state.posts.find((entry) => entry.id === postId && isVisibleFanPost(entry));
  if (!account || !post || state.shelfLoading) {
    state.shelfPickerError = 'This post is no longer available to save.';
    render();
    return;
  }
  const ownedShelves = state.shelves.filter((shelf) => shelf.ownerId === account.id);
  const selectedIds = [...new Set(new FormData(form).getAll('shelfIds').map(String))];
  if (selectedIds.some((id) => !ownedShelves.some((shelf) => shelf.id === id))) {
    state.shelfPickerError = 'Choose only Shelves in your collection.';
    render();
    return;
  }
  const alreadySaved = ownedShelves.some((shelf) => shelf.postIds.includes(postId));
  if (!selectedIds.length && !alreadySaved) {
    state.shelfPickerError = 'Choose at least one Shelf to save this post, or cancel.';
    render();
    return;
  }
  state.shelfPickerSelection = selectedIds;
  state.shelfPickerError = '';
  state.shelfLoading = true;
  state.pendingShelf = { action: 'save-post', postId, ownerId: account.id, selectedIds };
  render();
  state.shelfTimer = window.setTimeout(() => {
    const pending = state.pendingShelf;
    if (!pending || activeAccount()?.id !== pending.ownerId || !state.posts.some((entry) => entry.id === pending.postId)) {
      cancelShelfOperation();
      state.shelfPickerError = 'This post could not be saved. Please try again.';
      render();
      return;
    }
    const selected = new Set(pending.selectedIds);
    state.shelves = state.shelves.map((shelf) => {
      if (shelf.ownerId !== pending.ownerId) return shelf;
      const alreadySaved = shelf.postIds.includes(pending.postId);
      const shouldSave = selected.has(shelf.id);
      if (shouldSave && !alreadySaved) return { ...shelf, postIds: [...shelf.postIds, pending.postId] };
      if (!shouldSave && alreadySaved) return { ...shelf, postIds: shelf.postIds.filter((id) => id !== pending.postId) };
      return shelf;
    });
    const count = selected.size;
    state.shelfStatus = {
      ownerId: pending.ownerId,
      postId: pending.postId,
      message: count ? `Saved to ${count} ${count === 1 ? 'Shelf' : 'Shelves'}.` : 'Removed from your Shelves.',
    };
    state.shelfPickerPostId = null;
    state.shelfPickerSelection = [];
    state.shelfPickerError = '';
    state.shelfLoading = false;
    state.shelfTimer = null;
    state.pendingShelf = null;
    render();
  }, 180);
}

function removePostFromShelf(shelfId, postId) {
  const account = activeAccount();
  const shelf = state.shelves.find((entry) => entry.id === shelfId && entry.ownerId === account?.id);
  if (!account || !shelf || !shelf.postIds.includes(postId)) return;
  shelf.postIds = shelf.postIds.filter((entry) => entry !== postId);
  state.shelfStatus = { ownerId: account.id, shelfId, message: 'Post removed from this Shelf.' };
  render();
}

function confirmDeleteShelf(shelfId) {
  const account = activeAccount();
  const shelf = state.shelves.find((entry) => entry.id === shelfId && entry.ownerId === account?.id);
  if (!account || !shelf || state.shelfLoading) return;
  state.shelfLoading = true;
  state.pendingShelf = { action: 'delete', shelfId, ownerId: account.id };
  render();
  state.shelfTimer = window.setTimeout(() => {
    const pending = state.pendingShelf;
    const targetShelf = pending && state.shelves.find((entry) => entry.id === pending.shelfId && entry.ownerId === pending.ownerId);
    if (!pending || !targetShelf || activeAccount()?.id !== pending.ownerId) {
      cancelShelfOperation();
      state.shelfStatus = { ownerId: account.id, shelfId, kind: 'error', message: 'This Shelf could not be deleted. Please try again.' };
      render();
      return;
    }
    state.shelves = state.shelves.filter((entry) => entry.id !== targetShelf.id);
    state.shelfDeleteConfirmId = null;
    state.shelfStatus = { ownerId: account.id, message: 'Shelf deleted. Its original posts remain on their Artist Boards.' };
    state.shelfLoading = false;
    state.shelfTimer = null;
    state.pendingShelf = null;
    navigate('/shelves');
  }, 180);
}

function renderProfileAvatar(image, name, username, large = false) {
  const className = `profile-avatar${large ? ' profile-avatar-large' : ''}`;
  if (image) return `<img class="${className} profile-avatar-image" src="${escapeHTML(image)}" alt="${escapeHTML(name)} profile image">`;
  return `<span class="${className}" aria-hidden="true">${escapeHTML((name.trim()[0] || username[0] || 'S').toUpperCase())}</span>`;
}

function renderProfileHandle(profile) {
  const route = `/profile/${encodeURIComponent(profile.id)}`;
  return `<a class="profile-meta profile-handle-link" href="${hrefFor(route)}" data-route="${route}">@${escapeHTML(profile.username)}</a>`;
}

function renderProfileStatus(profileId) {
  return state.profileStatus?.userId === profileId
    ? `<p class="success-banner profile-success" role="status">${icon('check', 15)}${escapeHTML(state.profileStatus.message)}</p>`
    : '';
}

function renderFanProfileForm(profile) {
  const draft = state.profileDraft || {
    name: profile.name,
    biography: profile.biography || '',
    profileImage: profile.profileImage || '',
  };
  const disabled = state.profileLoading || state.profileImageLoading || state.usernameLoading ? 'disabled' : '';
  const nameError = state.profileFieldErrors.name || '';
  const biographyError = state.profileFieldErrors.biography || '';
  const preview = draft.profileImage
    ? `<div class="profile-image-preview"><img src="${escapeHTML(draft.profileImage)}" alt="Profile image preview"><div><p class="preview-title">Profile image selected</p><button class="text-button text-danger" type="button" data-action="remove-profile-image" ${disabled}>Remove image</button></div></div>`
    : '';
  return `<form class="profile-form" data-form="profile" novalidate ${state.profileLoading || state.profileImageLoading || state.usernameLoading ? 'aria-busy="true"' : ''}>
    ${state.profileError ? `<p class="inline-error" role="alert">${escapeHTML(state.profileError)}</p>` : ''}
    <label class="field-label">Display name<input class="field-input" name="profileName" value="${escapeHTML(draft.name)}" maxlength="80" placeholder="Your name" aria-invalid="${Boolean(nameError)}" ${nameError ? 'aria-describedby="profile-name-error"' : ''} ${disabled} required></label>
    ${nameError ? `<p class="inline-error" id="profile-name-error" role="alert">${escapeHTML(nameError)}</p>` : ''}
    <label class="field-label">Biography <span class="optional-label">(optional)</span><textarea class="field-input field-textarea" name="profileBiography" rows="4" maxlength="500" placeholder="A few words about you" aria-invalid="${Boolean(biographyError)}" ${biographyError ? 'aria-describedby="profile-biography-error"' : ''} ${disabled}>${escapeHTML(draft.biography)}</textarea></label>
    ${biographyError ? `<p class="inline-error" id="profile-biography-error" role="alert">${escapeHTML(biographyError)}</p>` : ''}
    <label class="field-label">Profile image <span class="optional-label">(optional)</span><input class="file-input" type="file" accept="image/png,image/jpeg,image/webp" data-profile-image ${disabled}><span class="field-hint">PNG, JPG, or WebP. Maximum 4 MB.</span></label>
    ${state.profileImageLoading ? `<p class="field-hint" role="status">Preparing profile image…</p>` : ''}
    ${state.profileImageError ? `<p class="inline-error" role="alert">${escapeHTML(state.profileImageError)}</p>` : ''}
    ${preview}
    <div class="profile-form-actions"><button class="primary-button" type="submit" ${disabled}>${state.profileLoading ? `<span class="registration-loading"><span class="loading-dot"></span>Saving…</span>` : 'Save profile'}</button><button class="quiet-button" type="button" data-action="cancel-profile-edit" ${disabled}>Cancel</button></div>
  </form>`;
}

function renderUsernameChange(profile) {
  const success = state.usernameStatus?.userId === profile.id
    ? `<p class="success-banner username-success" role="status">${icon('check', 14)}${escapeHTML(state.usernameStatus.message)}</p>`
    : '';
  if (!state.usernameEditorOpen) {
    return `<section class="username-change-section">
      <div><p class="eyebrow">Username</p><p class="username-current">@${escapeHTML(profile.username)}</p></div>
      <button class="quiet-button" type="button" data-action="open-username-editor">Change Username</button>
      ${success}
    </section>`;
  }
  const error = state.usernameError;
  const disabled = state.usernameLoading ? 'disabled' : '';
  return `<section class="username-change-section username-change-open">
    <h2 class="section-heading">Change Username</h2>
    ${success}
    <form class="username-change-form" data-form="username" data-user-id="${escapeHTML(profile.id)}" novalidate ${state.usernameLoading ? 'aria-busy="true"' : ''}>
      <label class="field-label">New username<input class="field-input" name="newUsername" value="${escapeHTML(state.usernameDraft)}" autocomplete="username" placeholder="Choose a username" aria-invalid="${Boolean(error)}" ${error ? 'aria-describedby="username-change-error"' : ''} ${disabled} required></label>
      ${error ? `<p class="inline-error" id="username-change-error" role="alert">${escapeHTML(error)}</p>` : ''}
      <p class="field-hint">Usernames must be unique. Your existing posts and comments will display your new username.</p>
      <div class="profile-form-actions"><button class="primary-button" type="submit" ${disabled}>${state.usernameLoading ? `<span class="registration-loading"><span class="loading-dot"></span>Saving…</span>` : 'Save Changes'}</button><button class="quiet-button" type="button" data-action="cancel-username-editor" ${disabled}>Cancel</button></div>
    </form>
  </section>`;
}

function renderFanActivity(profile) {
  const tab = state.profileActivityTabs[profile.id] || 'posts';
  const activity = accountActivityItems(profile.id);
  const items = activity.filter((item) => item.type === tab.replace(/s$/, ''));
  const emptyTitle = tab === 'posts' ? 'No posts yet.' : 'No reposts yet.';
  const emptyCopy = tab === 'posts' ? 'Posts you publish will appear here.' : 'Reposts you share will appear here.';
  return `<section class="profile-activity">
    <div class="profile-activity-heading"><h2 class="section-heading">Activity</h2><div class="profile-tabs" role="tablist" aria-label="${escapeHTML(profile.username)} profile activity">
      <button class="profile-tab" type="button" data-action="profile-activity-tab" data-profile-id="${escapeHTML(profile.id)}" data-tab="posts" role="tab" aria-selected="${tab === 'posts'}">Posts</button>
      <button class="profile-tab" type="button" data-action="profile-activity-tab" data-profile-id="${escapeHTML(profile.id)}" data-tab="reposts" role="tab" aria-selected="${tab === 'reposts'}">Reposts</button>
    </div></div>
    ${items.length ? `<div class="post-list">${items.map(renderFeedItem).join('')}</div>` : renderEmpty(emptyTitle, emptyCopy)}
  </section>`;
}

function renderFanProfileContent(profile, isOwner) {
  const editing = isOwner && state.editingProfile;
  return `<div class="profile-card public-profile-card">
    <div class="profile-card-head">${renderProfileAvatar(profile.profileImage || '', profile.name, profile.username, true)}<div><h2 class="profile-name">${escapeHTML(profile.name)}</h2>${renderProfileHandle(profile)}</div></div>
    <span class="role-pill">Fan</span>
    ${renderProfileStatus(profile.id)}
    ${editing ? `${renderFanProfileForm(profile)}${renderUsernameChange(profile)}` : `<div class="profile-bio">${profile.biography ? escapeHTML(profile.biography) : `<span class="profile-bio-empty">${isOwner ? 'Add a short biography to introduce yourself.' : 'No biography yet.'}</span>`}</div>${isOwner ? `<button class="quiet-button profile-edit" type="button" data-action="edit-profile">Edit Profile</button>` : ''}`}
  </div>
  ${renderPublicShelves(profile.id)}
  ${renderFanActivity(profile)}`;
}

function renderArtistProfileContent(profile, isOwner) {
  const board = boardForOwner(profile.id);
  const name = board?.artistName || profile.name;
  const image = board?.profileImage || '';
  const boardRoute = board ? `/board/${encodeURIComponent(board.id)}` : '';
  const posts = board
    ? chronologicalPosts(state.posts.filter((post) => post.boardId === board.id && isVisibleFanPost(post)))
    : [];
  return `<div class="profile-card public-profile-card artist-profile-card">
    <div class="profile-card-head">${renderProfileAvatar(image, name, profile.username, true)}<div><span class="board-card-discipline">${board ? escapeHTML(board.discipline) : 'Artist'}</span><h2 class="profile-name">${escapeHTML(name)}</h2>${renderProfileHandle(profile)}</div></div>
    ${board?.biography ? `<p class="profile-bio">${escapeHTML(board.biography)}</p>` : ''}
    ${renderProfileStatus(profile.id)}
    <div class="artist-profile-actions">${board ? `<a class="quiet-button" href="${hrefFor(boardRoute)}" data-route="${boardRoute}">View Artist Board ${icon('arrow', 14)}</a>` : isOwner ? `<p class="profile-bio-empty">Your Artist profile is empty until you create a board.</p><button class="primary-button" type="button" data-action="create-board" ${state.usernameLoading ? 'disabled' : ''}>Create your Artist Board ${icon('arrow', 14)}</button>` : `<p class="profile-bio-empty">This Artist hasn’t created a board yet.</p>`}
      ${isOwner && board ? `<button class="quiet-button" type="button" data-action="edit-profile">${icon('edit', 14)} Edit Profile</button>` : ''}
    </div>
    ${isOwner && !board ? renderUsernameChange(profile) : ''}
  </div>
  ${renderPublicShelves(profile.id)}
  <section class="profile-board-section"><h2 class="section-heading">Fan Posts</h2>${posts.length ? `<div class="post-list">${posts.map((post) => renderPostCard(post)).join('')}</div>` : renderEmpty('No Fan posts yet.', board ? 'Fan posts on this Artist Board will appear here.' : 'Create an Artist Board to give Fans a place to share.')}</section>`;
}

function renderProfileSwitcher(account) {
  const switcher = state.accounts.map((entry) => renderAccountChoice(entry, entry.id === account.id, true)).join('');
  return `<section class="switcher-section" aria-labelledby="switcher-title">
    <div class="switcher-heading"><h2 class="switcher-title" id="switcher-title">Accounts in this tab</h2><span class="switcher-caption">Switch between registered accounts</span></div>
    <div class="switcher-list">${switcher}</div>
    <div class="switcher-footer"><button class="outline-button" type="button" data-action="add-account" ${state.usernameLoading ? 'disabled' : ''}>${icon('plus', 15)} Register another account</button></div>
    <p class="form-note">Accounts are held in page memory only. They disappear when you refresh.</p>
  </section>`;
}

function renderProfile() {
  const account = activeAccount();
  if (!account) return '';
  const content = account.role === 'Artist'
    ? renderArtistProfileContent(account, true)
    : renderFanProfileContent(account, true);
  return `<section><p class="eyebrow">Your corner</p><h1 class="page-title">Profile</h1><p class="page-subtitle">A profile without a popularity score.</p>
    ${content}
    ${renderProfileSwitcher(account)}
  </section>`;
}

function renderPublicProfile(accountId) {
  const profile = state.accounts.find((entry) => entry.id === accountId);
  if (!profile) {
    return `<section><p class="eyebrow">Member profile</p><h1 class="page-title">Profile not found.</h1><p class="page-subtitle">This profile isn’t available in this session.</p>${renderEmpty('No profile found.')}</section>`;
  }
  const isOwner = activeAccount()?.id === profile.id;
  const title = profile.role === 'Artist' ? (boardForOwner(profile.id)?.artistName || profile.name) : profile.name;
  const content = profile.role === 'Artist'
    ? renderArtistProfileContent(profile, isOwner)
    : renderFanProfileContent(profile, isOwner);
  return `<section><p class="eyebrow">${isOwner ? 'Your profile' : 'A member of Stillroom'}</p><h1 class="page-title">${escapeHTML(title)}</h1>${content}${isOwner ? `<div class="profile-owner-settings"><a class="text-link" href="${hrefFor('/profile')}" data-route="/profile">Account settings ${icon('arrow', 14)}</a></div>` : ''}</section>`;
}

function beginProfileEdit() {
  const account = activeAccount();
  if (!account) return;
  if (account.role === 'Artist') {
    beginBoardForm(boardForOwner(account.id) ? 'edit' : 'create');
    return;
  }
  state.usernameEditorOpen = false;
  state.usernameDraft = '';
  state.usernameError = '';
  state.usernameStatus = null;
  state.profileDraft = {
    name: account.name || '',
    biography: account.biography || '',
    profileImage: account.profileImage || '',
  };
  state.profileError = '';
  state.profileFieldErrors = {};
  state.profileImageError = '';
  state.profileImageLoading = false;
  state.profileImageToken += 1;
  state.profileStatus = null;
  state.editingProfile = true;
  render();
  app.querySelector('[name="profileName"]')?.focus();
}

function cancelProfileEdit() {
  if (state.profileLoading || state.usernameLoading) return;
  state.profileDraft = null;
  state.profileError = '';
  state.profileFieldErrors = {};
  state.profileImageError = '';
  state.profileImageLoading = false;
  state.profileImageToken += 1;
  state.editingProfile = false;
  state.usernameEditorOpen = false;
  state.usernameDraft = '';
  state.usernameError = '';
  render();
}

function cancelProfileOperation() {
  if (state.profileTimer) window.clearTimeout(state.profileTimer);
  state.profileTimer = null;
  state.profilePending = null;
  state.profileLoading = false;
}

function resetUsernameEditor() {
  if (state.usernameTimer) window.clearTimeout(state.usernameTimer);
  state.usernameTimer = null;
  state.usernamePending = null;
  state.usernameLoading = false;
  state.usernameEditorOpen = false;
  state.usernameDraft = '';
  state.usernameError = '';
  state.usernameStatus = null;
}

function beginUsernameEdit() {
  const account = activeAccount();
  if (!account || state.usernameLoading) return;
  state.usernameEditorOpen = true;
  state.usernameDraft = account.username;
  state.usernameError = '';
  state.usernameStatus = null;
  render();
  app.querySelector('[name="newUsername"]')?.focus();
}

function cancelUsernameEdit() {
  if (state.usernameLoading) return;
  state.usernameEditorOpen = false;
  state.usernameDraft = '';
  state.usernameError = '';
  state.usernameStatus = null;
  render();
}

function submitUsernameChange(form) {
  const account = activeAccount();
  if (!account || !['Fan', 'Artist'].includes(account.role)
    || form.dataset.userId !== account.id || !state.usernameEditorOpen || state.usernameLoading) return;

  const username = String(new FormData(form).get('newUsername') || '').trim().replace(/^@/, '');
  let error = '';
  if (!username) error = 'Choose a username.';
  else if (state.accounts.some((entry) => entry.id !== account.id && entry.username.toLocaleLowerCase() === username.toLocaleLowerCase())) {
    error = 'That username is already in use.';
  }
  state.usernameDraft = username;
  state.usernameError = error;
  state.usernameStatus = null;
  if (error) {
    render();
    app.querySelector('[name="newUsername"]')?.focus();
    return;
  }

  state.usernamePending = { userId: account.id, username };
  state.usernameLoading = true;
  render();
  state.usernameTimer = window.setTimeout(() => {
    const pending = state.usernamePending;
    const profile = pending && state.accounts.find((entry) => entry.id === pending.userId);
    if (!pending || !profile || activeAccount()?.id !== pending.userId) {
      resetUsernameEditor();
      render();
      return;
    }
    const duplicate = state.accounts.some((entry) => entry.id !== profile.id
      && entry.username.toLocaleLowerCase() === pending.username.toLocaleLowerCase());
    if (duplicate) {
      state.usernameError = 'That username is already in use.';
      state.usernameLoading = false;
      state.usernamePending = null;
      state.usernameTimer = null;
      render();
      return;
    }

    profile.username = pending.username;
    if (state.pendingPost?.authorId === profile.id && state.pendingPost.post) {
      state.pendingPost.post.authorUsername = pending.username;
    }
    for (const post of state.posts) {
      if (post.authorId === profile.id) post.authorUsername = pending.username;
    }
    for (const comment of state.comments) {
      if (comment.authorId === profile.id) comment.authorUsername = pending.username;
    }
    state.usernameEditorOpen = false;
    state.usernameDraft = '';
    state.usernameError = '';
    state.usernameStatus = { userId: profile.id, message: 'Your username has been updated.' };
    state.usernamePending = null;
    state.usernameTimer = null;
    state.usernameLoading = false;
    render();
  }, 240);
}

function submitProfile(form) {
  const account = activeAccount();
  if (!account || account.role !== 'Fan' || !state.editingProfile || state.profileLoading || state.usernameLoading) return;
  const formData = new FormData(form);
  const name = String(formData.get('profileName') || '').trim();
  const biography = String(formData.get('profileBiography') || '').trim();
  const errors = {};
  if (!name) errors.name = 'Enter a display name.';
  else if (name.length > 80) errors.name = 'Display names must be 80 characters or fewer.';
  if (biography.length > 500) errors.biography = 'Biographies must be 500 characters or fewer.';
  if (state.profileImageLoading) state.profileError = 'Wait for the profile image to finish loading.';
  else state.profileError = '';
  state.profileDraft = { ...(state.profileDraft || {}), name, biography };
  state.profileFieldErrors = errors;
  if (Object.keys(errors).length || state.profileError) {
    render();
    app.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const values = {
    name,
    biography,
    profileImage: state.profileDraft.profileImage || '',
  };
  state.profilePending = { userId: account.id, values };
  state.profileLoading = true;
  state.profileError = '';
  render();
  state.profileTimer = window.setTimeout(() => {
    const pending = state.profilePending;
    const profile = pending && state.accounts.find((entry) => entry.id === pending.userId && entry.role === 'Fan');
    if (!pending || !profile) {
      cancelProfileOperation();
      state.profileError = 'Your profile could not be saved. Please try again.';
      render();
      return;
    }
    Object.assign(profile, pending.values);
    state.profileStatus = { userId: pending.userId, message: 'Your profile has been updated.' };
    state.profileDraft = null;
    state.profileFieldErrors = {};
    state.profileImageError = '';
    state.editingProfile = false;
    state.profilePending = null;
    state.profileTimer = null;
    state.profileLoading = false;
    render();
  }, 240);
}

function selectProfileImage(input) {
  const account = activeAccount();
  const file = input.files?.[0];
  if (!account || account.role !== 'Fan' || !state.editingProfile || state.profileLoading || !file) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    state.profileImageError = 'Choose a PNG, JPG, or WebP image.';
    render();
    return;
  }
  if (file.size > 4 * 1024 * 1024) {
    state.profileImageError = 'Choose an image smaller than 4 MB.';
    render();
    return;
  }
  state.profileImageError = '';
  state.profileImageLoading = true;
  const token = ++state.profileImageToken;
  render();
  const reader = new FileReader();
  reader.onload = () => {
    if (token !== state.profileImageToken || !state.profileDraft) return;
    if (typeof reader.result !== 'string') {
      state.profileImageError = 'The selected image could not be read.';
    } else {
      state.profileDraft = { ...state.profileDraft, profileImage: reader.result };
    }
    state.profileImageLoading = false;
    render();
  };
  reader.onerror = () => {
    if (token !== state.profileImageToken || !state.profileDraft) return;
    state.profileImageError = 'The selected image could not be read.';
    state.profileImageLoading = false;
    render();
  };
  reader.readAsDataURL(file);
}

function render() {
  if (!app) return;
  const account = activeAccount();
  if (state.route === '/register') {
    app.innerHTML = renderRegistration();
    return;
  }
  if (state.route === '/confirmation' && state.successAccountId) {
    app.innerHTML = renderConfirmation();
    return;
  }
  if (!account) {
    state.route = '/';
    app.innerHTML = renderWelcome();
    if (getRoute() !== '/') history.replaceState({}, '', hrefFor('/'));
    return;
  }

  const boardRoute = state.route.match(/^\/board\/([^/]+)$/);
  const postRoute = state.route.match(/^\/post\/([^/]+)$/);
  const publicProfileRoute = state.route.match(/^\/profile\/([^/]+)$/);
  const shelfEditRoute = state.route.match(/^\/shelves\/([^/]+)\/edit$/);
  const shelfDetailRoute = state.route.match(/^\/shelves\/([^/]+)$/);
  const specialRoute = ['/artists/new', '/artists/edit', '/shelves/new'].includes(state.route)
    || Boolean(boardRoute) || Boolean(postRoute) || Boolean(publicProfileRoute) || Boolean(shelfEditRoute) || Boolean(shelfDetailRoute);
  if (!navItems.some((item) => item.path === state.route) && state.route !== '/' && !specialRoute) state.route = '/home';
  let content;
  let title;
  if (state.route === '/explore') { content = renderExplore(); title = 'Explore'; }
  else if (state.route === '/artists') { content = renderArtists(); title = 'My Artists'; }
  else if (state.route === '/artists/new') { content = renderBoardForm('create'); title = 'Create your board'; }
  else if (state.route === '/artists/edit') { content = renderBoardForm('edit'); title = 'Edit your board'; }
  else if (boardRoute) {
    let boardId = boardRoute[1];
    try { boardId = decodeURIComponent(boardId); } catch { /* Keep the unmatched route in the not-found state. */ }
    const board = state.boards.find((entry) => entry.id === boardId);
    content = renderBoardDetail(boardId);
    title = board?.artistName || 'Artist board';
  }
  else if (postRoute) {
    let postId = postRoute[1];
    try { postId = decodeURIComponent(postId); } catch { /* Keep the unmatched route in the not-found state. */ }
    const post = state.posts.find((entry) => entry.id === postId);
    const board = post && state.boards.find((entry) => entry.id === post.boardId);
    content = board
      ? renderBoardDetail(board.id)
      : `<section><p class="eyebrow">Fan post</p><h1 class="page-title">Post not found.</h1><p class="page-subtitle">This post isn’t available in this session.</p>${renderEmpty('No post found.')}<div class="empty-action"><a class="quiet-button" href="${hrefFor('/explore')}" data-route="/explore">Back to Explore ${icon('arrow', 14)}</a></div></section>`;
    title = board?.artistName || 'Fan post';
  }
  else if (publicProfileRoute) {
    let profileId = publicProfileRoute[1];
    try { profileId = decodeURIComponent(profileId); } catch { /* Keep the unmatched route in the not-found state. */ }
    const profile = state.accounts.find((entry) => entry.id === profileId);
    content = renderPublicProfile(profileId);
    title = profile?.name || 'Member profile';
  }
  else if (state.route === '/shelves/new') { content = renderShelfForm('create'); title = 'Create a Shelf'; }
  else if (shelfEditRoute) {
    let shelfId = shelfEditRoute[1];
    try { shelfId = decodeURIComponent(shelfId); } catch { /* Keep the unmatched route in the not-found state. */ }
    content = renderShelfForm('edit', shelfId);
    title = 'Edit Shelf';
  }
  else if (shelfDetailRoute && shelfDetailRoute[1] !== 'new') {
    let shelfId = shelfDetailRoute[1];
    try { shelfId = decodeURIComponent(shelfId); } catch { /* Keep the unmatched route in the not-found state. */ }
    const shelf = state.shelves.find((entry) => entry.id === shelfId);
    content = renderShelfDetail(shelfId);
    title = shelf?.title || 'Personal Shelf';
  }
  else if (state.route === '/shelves') { content = renderShelves(); title = 'Shelves'; }
  else if (state.route === '/profile') { content = renderProfile(); title = 'Profile'; }
  else { content = renderHome(); title = 'Stillroom'; }
  app.innerHTML = renderShell(content, title);
  if (postRoute) {
    let postId = postRoute[1];
    try { postId = decodeURIComponent(postId); } catch { /* Leave the board at its normal scroll position. */ }
    requestAnimationFrame(() => {
      const target = document.getElementById(`post-card-${postId}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('post-open-highlight');
        window.setTimeout(() => target.classList.remove('post-open-highlight'), 1600);
      }
    });
  }
}

function beginRegistration(role = null) {
  state.pendingRole = role;
  state.draft = { role, name: '', username: '', email: '' };
  state.errors = {};
  state.successAccountId = null;
  navigate('/register');
}

function submitRegistration(form) {
  const formData = new FormData(form);
  const name = String(formData.get('name') || '').trim();
  const usernameInput = String(formData.get('username') || '').trim();
  const username = usernameInput.replace(/^@/, '');
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const duplicate = state.accounts.some((account) => account.username.toLowerCase() === username.toLowerCase());
  const errors = {};

  if (!state.draft.role) errors.role = 'Choose whether you’re joining as a Fan or Artist.';
  if (!name) errors.name = 'Enter your name.';
  if (!username) errors.username = 'Choose a username.';
  else if (duplicate) errors.username = 'That username is already in use.';
  if (!email) errors.email = 'Enter your email.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Create a password.';
  else if (password.length < 8) errors.password = 'Use at least 8 characters.';

  state.draft = { ...state.draft, name, username: usernameInput, email };
  state.errors = errors;
  if (Object.keys(errors).length) {
    render();
    const firstInvalid = app.querySelector('[aria-invalid="true"]');
    firstInvalid?.focus();
    return;
  }

  const account = {
    id: `demo-${state.accounts.length + 1}`,
    role: state.draft.role,
    name,
    username,
    email,
    biography: '',
    profileImage: '',
    createdAt: Date.now(),
  };
  state.pendingAccount = account;
  state.loading = true;
  state.errors = {};
  render();
  state.registrationTimer = window.setTimeout(() => {
    if (!state.pendingAccount) return;
    state.accounts.push(state.pendingAccount);
    state.activeAccountId = state.pendingAccount.id;
    state.successAccountId = state.pendingAccount.id;
    state.pendingAccount = null;
    state.registrationTimer = null;
    state.loading = false;
    state.draft = { role: null, name: '', username: '', email: '' };
    navigate('/confirmation', { replace: true });
  }, 650);
}

function beginBoardForm(mode) {
  const account = activeAccount();
  if (!account || account.role !== 'Artist') {
    navigate(mode === 'edit' ? '/artists/edit' : '/artists/new');
    return;
  }
  const existing = boardForOwner(account.id);
  state.boardDraft = mode === 'edit' && existing
    ? { artistName: existing.artistName, discipline: existing.discipline, biography: existing.biography, profileImage: existing.profileImage || '' }
    : { artistName: account.name, discipline: '', biography: '', profileImage: '' };
  state.boardErrors = {};
  state.boardImageError = '';
  state.boardImageLoading = false;
  state.boardImageReadToken += 1;
  state.boardSuccess = '';
  state.boardSuccessId = null;
  navigate(mode === 'edit' ? '/artists/edit' : '/artists/new');
}

function submitBoard(form) {
  const account = activeAccount();
  const mode = form.dataset.mode;
  const existing = account?.role === 'Artist' ? boardForOwner(account.id) : null;
  const formData = new FormData(form);
  const artistName = String(formData.get('artistName') || '').trim();
  const discipline = String(formData.get('discipline') || '').trim();
  const biography = String(formData.get('biography') || '').trim();
  const errors = {};

  if (!account || account.role !== 'Artist') errors.form = 'Only Artist accounts can create or edit boards.';
  if (mode === 'create' && existing) errors.form = 'Each Artist account can create only one personal board.';
  if (mode === 'edit' && (!existing || existing.ownerId !== account?.id)) errors.form = 'You can only edit a board you own.';
  if (!artistName) errors.artistName = 'Enter the artist name for this board.';
  if (!discipline) errors.discipline = 'Add an artistic discipline.';
  if (!biography) errors.biography = 'Add a short biography.';

  state.boardDraft = { ...(state.boardDraft || {}), artistName, discipline, biography };
  state.boardErrors = errors;
  if (Object.keys(errors).length) {
    render();
    app.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const board = {
    id: existing?.id || `board-${account.id}`,
    ownerId: account.id,
    artistName,
    discipline,
    biography,
    profileImage: state.boardDraft.profileImage || '',
    createdAt: existing?.createdAt || Date.now(),
  };
  state.pendingBoard = { mode, board };
  state.boardLoading = true;
  render();
  state.boardTimer = window.setTimeout(() => {
    if (!state.pendingBoard) return;
    const pending = state.pendingBoard;
    if (pending.mode === 'edit') {
      state.boards = state.boards.map((entry) => entry.id === pending.board.id && entry.ownerId === account.id ? pending.board : entry);
      state.boardSuccess = 'Board information saved.';
    } else {
      state.boards.push(pending.board);
      state.boardSuccess = 'Your artist board is ready.';
    }
    state.boardSuccessId = pending.board.id;
    state.pendingBoard = null;
    state.boardTimer = null;
    state.boardLoading = false;
    state.boardDraft = null;
    state.boardErrors = {};
    navigate(`/board/${encodeURIComponent(pending.board.id)}`, { replace: true });
  }, 550);
}

function startPostComposer(boardId, postId = null) {
  const account = activeAccount();
  const board = state.boards.find((entry) => entry.id === boardId);
  if (!account || account.role !== 'Fan' || !board || state.postPublishing) return;
  const existing = postId ? state.posts.find((post) => post.id === postId && post.boardId === board.id) : null;
  if (postId && (!existing || existing.authorId !== account.id)) return;
  const key = postDraftKey(account.id, board.id, existing?.id || null);
  if (!state.postDrafts[key]) {
    state.postDrafts[key] = existing
      ? { authorId: account.id, boardId: board.id, postId: existing.id, content: existing.content, media: existing.media }
      : { authorId: account.id, boardId: board.id, postId: null, content: '', media: null };
  }
  state.postEditor = { boardId: board.id, postId: existing?.id || null, authorId: account.id, key };
  state.postErrors[key] = '';
  state.postStatus = null;
  state.deleteConfirmPostId = null;
  navigate(`/board/${encodeURIComponent(board.id)}`);
}

function toggleArtistFollow(boardId) {
  const account = activeAccount();
  const board = state.boards.find((entry) => entry.id === boardId);
  if (account?.role !== 'Fan' || !board) return;

  const current = followedArtistIds(account.id);
  const following = current.includes(board.ownerId);
  state.followedArtistsByFan[account.id] = following
    ? current.filter((artistId) => artistId !== board.ownerId)
    : [...current, board.ownerId];
  state.followStatus = {
    boardId: board.id,
    userId: account.id,
    message: following ? `${board.artistName} removed from My Artists.` : `${board.artistName} added to My Artists.`,
  };
  render();
}

function toggleComments(postId) {
  const post = state.posts.find((entry) => entry.id === postId);
  if (!post) return;
  state.expandedCommentPostIds = state.expandedCommentPostIds.includes(postId)
    ? state.expandedCommentPostIds.filter((entry) => entry !== postId)
    : [...state.expandedCommentPostIds, postId];
  render();
}

function submitComment(form) {
  const account = activeAccount();
  const post = state.posts.find((entry) => entry.id === form.dataset.postId && isVisibleFanPost(entry));
  const commentId = form.dataset.commentId || null;
  if (account?.role !== 'Fan' || !post || state.commentPending) return;

  const existing = commentId
    ? state.comments.find((entry) => entry.id === commentId && entry.postId === post.id && entry.authorId === account.id)
    : null;
  const key = commentId || commentDraftKey(account.id, post.id);
  const content = String(new FormData(form).get('commentContent') || '').trim();
  const error = !content
    ? 'Write a comment before posting.'
    : content.length > 1000
      ? 'Comments must be 1,000 characters or fewer.'
      : commentId && !existing
        ? 'You can only edit your own comments.'
        : '';

  if (commentId && state.commentEditor?.commentId === commentId) state.commentEditor.content = content;
  else if (!commentId) state.commentDrafts[commentDraftKey(account.id, post.id)] = content;
  state.commentErrors[key] = error;
  if (error) {
    render();
    app.querySelector('[name="commentContent"]')?.focus();
    return;
  }

  state.commentErrors[key] = '';
  state.commentPending = {
    action: commentId ? 'edit' : 'create',
    userId: account.id,
    postId: post.id,
    commentId,
    content,
    draftKey: commentDraftKey(account.id, post.id),
  };
  state.commentStatus = null;
  render();
  state.commentTimer = window.setTimeout(() => {
    const pending = state.commentPending;
    if (!pending) return;
    const targetPost = state.posts.find((entry) => entry.id === pending.postId);
    const author = state.accounts.find((entry) => entry.id === pending.userId);
    let message = '';
    let kind = 'success';
    if (!targetPost || author?.role !== 'Fan') {
      kind = 'error';
      message = 'This comment could not be saved. Please try again.';
    } else if (pending.action === 'create') {
      state.comments.push({
        id: `comment-${state.nextCommentId++}`,
        postId: pending.postId,
        authorId: pending.userId,
        authorUsername: author.username,
        content: pending.content,
        createdAt: Date.now(),
      });
      delete state.commentDrafts[pending.draftKey];
      delete state.commentErrors[pending.draftKey];
      message = 'Comment posted.';
    } else {
      const targetComment = state.comments.find((entry) => entry.id === pending.commentId && entry.postId === pending.postId && entry.authorId === pending.userId);
      if (!targetComment) {
        kind = 'error';
        message = 'This comment is no longer available to edit.';
      } else {
        targetComment.content = pending.content;
        targetComment.updatedAt = Date.now();
        delete state.commentErrors[pending.commentId];
        message = 'Comment updated.';
      }
    }
    state.commentPending = null;
    state.commentTimer = null;
    state.commentEditor = null;
    state.commentStatus = { userId: pending.userId, postId: pending.postId, kind, message };
    if (!state.expandedCommentPostIds.includes(pending.postId)) state.expandedCommentPostIds.push(pending.postId);
    render();
  }, 180);
}

function beginCommentEdit(commentId) {
  const account = activeAccount();
  const comment = state.comments.find((entry) => entry.id === commentId);
  if (account?.role !== 'Fan' || comment?.authorId !== account.id || state.commentPending) return;
  state.commentEditor = { commentId, postId: comment.postId, userId: account.id, content: comment.content };
  state.expandedCommentPostIds = [...new Set([...state.expandedCommentPostIds, comment.postId])];
  delete state.commentErrors[commentId];
  render();
}

function cancelCommentEdit() {
  if (state.commentPending) return;
  if (state.commentEditor) delete state.commentErrors[state.commentEditor.commentId];
  state.commentEditor = null;
  render();
}

function requestDeleteComment(commentId) {
  const account = activeAccount();
  const comment = state.comments.find((entry) => entry.id === commentId);
  if (account?.role !== 'Fan' || comment?.authorId !== account.id || state.commentPending) return;
  state.commentDeleteConfirmId = comment.id;
  state.expandedCommentPostIds = [...new Set([...state.expandedCommentPostIds, comment.postId])];
  render();
}

function confirmDeleteComment(commentId) {
  const account = activeAccount();
  const comment = state.comments.find((entry) => entry.id === commentId);
  if (account?.role !== 'Fan' || comment?.authorId !== account.id || state.commentPending || state.commentDeleteConfirmId !== commentId) return;
  state.commentPending = { action: 'delete', userId: account.id, postId: comment.postId, commentId };
  state.commentDeleteConfirmId = null;
  state.commentStatus = null;
  render();
  state.commentTimer = window.setTimeout(() => {
    const pending = state.commentPending;
    if (!pending) return;
    const exists = state.comments.some((entry) => entry.id === pending.commentId && entry.authorId === pending.userId);
    let kind = 'success';
    let message = 'Comment deleted.';
    if (exists) {
      state.comments = state.comments.filter((entry) => entry.id !== pending.commentId);
      delete state.commentErrors[pending.commentId];
      if (state.commentEditor?.commentId === pending.commentId) state.commentEditor = null;
    } else {
      kind = 'error';
      message = 'This comment could not be deleted. Please try again.';
    }
    state.commentPending = null;
    state.commentTimer = null;
    state.commentStatus = { userId: pending.userId, postId: pending.postId, kind, message };
    render();
  }, 180);
}

function toggleRepost(postId) {
  const account = activeAccount();
  const post = state.posts.find((entry) => entry.id === postId && isVisibleFanPost(entry));
  if (account?.role !== 'Fan' || !post || state.repostPending) return;
  const existing = state.reposts.find((entry) => entry.userId === account.id && entry.postId === post.id);
  state.repostConfirm = { action: existing ? 'undo' : 'create', userId: account.id, postId: post.id };
  state.repostStatus = null;
  render();
}

function cancelRepost() {
  if (state.repostPending) return;
  state.repostConfirm = null;
  render();
}

function confirmRepost(postId) {
  const account = activeAccount();
  const confirmation = state.repostConfirm;
  const post = state.posts.find((entry) => entry.id === postId && isVisibleFanPost(entry));
  if (account?.role !== 'Fan' || !post || state.repostPending || confirmation?.postId !== postId || confirmation?.userId !== account.id) return;
  const existing = state.reposts.find((entry) => entry.userId === account.id && entry.postId === postId);
  if (confirmation.action === 'create' && existing) {
    state.repostConfirm = null;
    state.repostStatus = { userId: account.id, postId, kind: 'error', message: 'You have already reposted this post.' };
    render();
    return;
  }
  if (confirmation.action === 'undo' && !existing) {
    state.repostConfirm = null;
    state.repostStatus = { userId: account.id, postId, kind: 'error', message: 'Your repost is no longer available.' };
    render();
    return;
  }
  state.repostPending = { action: confirmation.action, userId: account.id, postId, repostId: existing?.id || null };
  state.repostConfirm = null;
  state.repostStatus = null;
  render();
  state.repostTimer = window.setTimeout(() => {
    const pending = state.repostPending;
    if (!pending) return;
    const targetPost = state.posts.find((entry) => entry.id === pending.postId && isVisibleFanPost(entry));
    const reposter = state.accounts.find((entry) => entry.id === pending.userId && entry.role === 'Fan');
    let kind = 'success';
    let message = '';
    if (!targetPost || !reposter) {
      kind = 'error';
      message = 'This repost could not be completed. Please try again.';
    } else if (pending.action === 'create') {
      const duplicate = state.reposts.some((entry) => entry.userId === pending.userId && entry.postId === pending.postId);
      if (duplicate) {
        kind = 'error';
        message = 'You have already reposted this post.';
      } else {
        state.reposts.push({ id: `repost-${state.nextRepostId++}`, userId: pending.userId, postId: pending.postId, repostedAt: Date.now() });
        message = 'Repost added to your profile.';
      }
    } else {
      const ownedRepost = state.reposts.find((entry) => entry.id === pending.repostId && entry.userId === pending.userId && entry.postId === pending.postId);
      if (!ownedRepost) {
        kind = 'error';
        message = 'Your repost is no longer available.';
      } else {
        state.reposts = state.reposts.filter((entry) => entry.id !== ownedRepost.id);
        message = 'Your repost was removed.';
      }
    }
    state.repostPending = null;
    state.repostTimer = null;
    state.repostStatus = { userId: pending.userId, postId: pending.postId, kind, message };
    render();
  }, 180);
}

function discardPostDraft(authorId, boardId, postId = null) {
  const key = postDraftKey(authorId, boardId, postId);
  const draft = state.postDrafts[key];
  releaseDraftMedia(draft);
  delete state.postDrafts[key];
  delete state.postErrors[key];
  if (state.postEditor?.key === key) state.postEditor = null;
}

function deletePost(postId) {
  const account = activeAccount();
  const post = state.posts.find((entry) => entry.id === postId);
  if (!account || account.role !== 'Fan' || !post || post.authorId !== account.id
    || (state.postPublishing && state.pendingPost?.postId === post.id)
    || state.commentPending?.postId === post.id || state.repostPending?.postId === post.id) return;

  for (const [key, draft] of Object.entries(state.postDrafts)) {
    if (draft.postId === post.id) {
      releaseDraftMedia(draft);
      delete state.postDrafts[key];
      delete state.postErrors[key];
    }
  }
  if (post.media?.url?.startsWith('blob:')) URL.revokeObjectURL(post.media.url);
  const deletedCommentIds = new Set(state.comments.filter((entry) => entry.postId === post.id).map((entry) => entry.id));
  state.posts = state.posts.filter((entry) => entry.id !== post.id);
  state.reposts = state.reposts.filter((entry) => entry.postId !== post.id);
  state.comments = state.comments.filter((entry) => entry.postId !== post.id);
  for (const commentId of deletedCommentIds) delete state.commentErrors[commentId];
  for (const key of Object.keys(state.commentDrafts)) {
    if (key.endsWith(`::${post.id}`)) {
      delete state.commentDrafts[key];
      delete state.commentErrors[key];
    }
  }
  state.expandedCommentPostIds = state.expandedCommentPostIds.filter((entry) => entry !== post.id);
  if (state.commentEditor?.postId === post.id) state.commentEditor = null;
  if (deletedCommentIds.has(state.commentDeleteConfirmId)) state.commentDeleteConfirmId = null;
  if (state.commentStatus?.postId === post.id) state.commentStatus = null;
  if (state.repostConfirm?.postId === post.id) state.repostConfirm = null;
  if (state.repostStatus?.postId === post.id) state.repostStatus = null;
  state.shelves = state.shelves.map((shelf) => shelf.postIds.includes(post.id)
    ? { ...shelf, postIds: shelf.postIds.filter((savedId) => savedId !== post.id) }
    : shelf);
  if (state.postEditor?.postId === post.id) state.postEditor = null;
  state.deleteConfirmPostId = null;
  state.postStatus = { boardId: post.boardId, userId: account.id, message: 'Post deleted.' };
  render();
}

function submitPost(form) {
  const account = activeAccount();
  const board = state.boards.find((entry) => entry.id === form.dataset.boardId);
  const postId = form.dataset.postId || null;
  const existing = postId ? state.posts.find((post) => post.id === postId && post.boardId === board?.id) : null;
  if (!account || account.role !== 'Fan' || !board) return;

  const key = postDraftKey(account.id, board.id, postId);
  const draft = state.postDrafts[key] || { authorId: account.id, boardId: board.id, postId, content: '', media: null };
  const formData = new FormData(form);
  const content = String(formData.get('postContent') || '');
  const errors = {};

  if (postId && (!existing || existing.authorId !== account.id)) errors.form = 'You can only edit your own posts.';
  if (state.postErrors[key]) errors.form = state.postErrors[key];
  if (!errors.form && content.length > 2000) errors.form = 'Posts must be 2,000 characters or fewer.';
  if (!errors.form && !content.trim() && !draft.media) errors.form = 'Add text or attach an image or video before publishing.';

  state.postDrafts[key] = { ...draft, content };
  state.postErrors[key] = errors.form || '';
  if (Object.keys(errors).length) {
    render();
    app.querySelector('[data-post-content]')?.focus();
    return;
  }

  const post = {
    id: existing?.id || `post-${state.nextPostId++}`,
    boardId: board.id,
    authorId: account.id,
    authorUsername: account.username,
    content: content.trim(),
    media: draft.media ? { ...draft.media, isNew: false } : null,
    publishedAt: existing?.publishedAt || Date.now(),
  };
  state.pendingPost = { key, postId: existing?.id || null, boardId: board.id, authorId: account.id, post };
  state.postPublishing = true;
  render();
  state.postTimer = window.setTimeout(() => {
    const pending = state.pendingPost;
    if (!pending) return;
    const oldPost = pending.postId ? state.posts.find((entry) => entry.id === pending.postId) : null;
    if (pending.postId && oldPost?.media?.url && oldPost.media.url !== pending.post.media?.url && oldPost.media.url.startsWith('blob:')) {
      URL.revokeObjectURL(oldPost.media.url);
    }
    state.posts = pending.postId
      ? state.posts.map((entry) => entry.id === pending.postId && entry.authorId === pending.authorId ? pending.post : entry)
      : [pending.post, ...state.posts];
    delete state.postDrafts[pending.key];
    delete state.postErrors[pending.key];
    if (state.postEditor?.key === pending.key) state.postEditor = null;
    state.postStatus = {
      boardId: pending.boardId,
      userId: pending.authorId,
      message: pending.postId ? 'Your changes have been published.' : 'Your post is live.',
    };
    state.postPublishing = false;
    state.pendingPost = null;
    state.postTimer = null;
    state.deleteConfirmPostId = null;
    state.homeTab = 'for-you';
    render();
  }, 500);
}

function selectPostMedia(input) {
  const account = activeAccount();
  const editor = state.postEditor;
  const file = input.files?.[0];
  if (!account || account.role !== 'Fan' || !editor || editor.authorId !== account.id || !file) return;
  const key = editor.key;
  const draft = state.postDrafts[key];
  const imageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
  const videoTypes = ['video/mp4', 'video/webm'];
  const type = imageTypes.includes(file.type) ? 'image' : videoTypes.includes(file.type) ? 'video' : null;
  const errors = type
    ? ''
    : 'Choose a PNG, JPG, WebP, GIF, MP4, or WebM file.';
  if (errors) {
    state.postErrors[key] = errors;
    render();
    return;
  }
  const maxBytes = type === 'image' ? 10 * 1024 * 1024 : 25 * 1024 * 1024;
  if (file.size === 0) {
    state.postErrors[key] = 'The selected file is empty.';
    render();
    return;
  }
  if (file.size > maxBytes) {
    state.postErrors[key] = type === 'image' ? 'Images must be 10 MB or smaller.' : 'Videos must be 25 MB or smaller.';
    render();
    return;
  }

  try {
    const url = URL.createObjectURL(file);
    releaseDraftMedia(draft);
    state.postDrafts[key] = {
      ...draft,
      media: { file, url, type, name: file.name, isNew: true },
    };
    state.postErrors[key] = '';
    render();
  } catch {
    state.postErrors[key] = 'This file could not be prepared. Try another file.';
    render();
  }
}

app?.addEventListener('input', (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement && ['name', 'username', 'email'].includes(target.name)) {
    state.draft[target.name] = target.value;
  }
  const profileField = target.name === 'profileName' ? 'name' : target.name === 'profileBiography' ? 'biography' : '';
  if (profileField && state.editingProfile && state.profileDraft) {
    state.profileDraft = { ...state.profileDraft, [profileField]: target.value };
    if (state.profileFieldErrors[profileField]) {
      delete state.profileFieldErrors[profileField];
      target.removeAttribute('aria-invalid');
      target.removeAttribute('aria-describedby');
      app.querySelector(`#profile-${profileField}-error`)?.remove();
    }
    state.profileError = '';
  }
  if (target instanceof HTMLInputElement && target.name === 'newUsername' && state.usernameEditorOpen) {
    state.usernameDraft = target.value;
    if (state.usernameError) {
      state.usernameError = '';
      target.removeAttribute('aria-invalid');
      target.removeAttribute('aria-describedby');
      app.querySelector('#username-change-error')?.remove();
    }
  }
  if ((target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)
    && target.closest('form[data-form="shelf"]')
    && ['title', 'description', 'visibility'].includes(target.name)) {
    state.shelfDraft = { ...(state.shelfDraft || {}), [target.name]: target.value };
    if (state.shelfErrors[target.name]) {
      delete state.shelfErrors[target.name];
      target.removeAttribute('aria-invalid');
      target.removeAttribute('aria-describedby');
      app.querySelector(`#shelf-error-${target.name}`)?.remove();
    }
    if (state.shelfErrors.form) {
      delete state.shelfErrors.form;
      app.querySelector('.shelf-form-card > .inline-error')?.remove();
    }
  }
  if ((target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) && ['artistName', 'discipline', 'biography'].includes(target.name)) {
    state.boardDraft = { ...(state.boardDraft || {}), [target.name]: target.value };
    if (state.boardErrors[target.name]) {
      delete state.boardErrors[target.name];
      target.removeAttribute('aria-invalid');
      target.removeAttribute('aria-describedby');
      app.querySelector(`#board-error-${target.name}`)?.remove();
    }
    if (state.boardErrors.form) delete state.boardErrors.form;
  }
  if (target instanceof HTMLTextAreaElement && target.matches('[data-post-content]')) {
    const account = activeAccount();
    const form = target.closest('form[data-form="post"]');
    if (account?.role === 'Fan' && form) {
      const key = postDraftKey(account.id, form.dataset.boardId, form.dataset.postId || null);
      const draft = state.postDrafts[key];
      if (draft) state.postDrafts[key] = { ...draft, content: target.value };
      if (state.postErrors[key]) {
        state.postErrors[key] = '';
        target.removeAttribute('aria-invalid');
        app.querySelector('[data-post-error]')?.remove();
      }
    }
  }
  if (target instanceof HTMLTextAreaElement && target.name === 'commentContent') {
    const account = activeAccount();
    const form = target.closest('form[data-form="comment"]');
    if (account?.role === 'Fan' && form) {
      const commentId = form.dataset.commentId || null;
      const key = commentId || commentDraftKey(account.id, form.dataset.postId);
      if (commentId && state.commentEditor?.commentId === commentId) state.commentEditor.content = target.value;
      else if (!commentId) state.commentDrafts[key] = target.value;
      if (state.commentErrors[key]) {
        delete state.commentErrors[key];
        target.removeAttribute('aria-invalid');
        form.querySelector('.inline-error')?.remove();
      }
    }
  }
  if (target instanceof HTMLInputElement && target.matches('[data-explore-search]')) {
    state.exploreQuery = target.value;
    const clearButton = app.querySelector('[data-action="clear-explore-search"]');
    if (clearButton) clearButton.hidden = !state.exploreQuery;
    queueExploreSearch();
  }
});

app?.addEventListener('change', (event) => {
  const target = event.target;
  if (target instanceof HTMLSelectElement && target.matches('[data-explore-discipline]')) {
    state.exploreDiscipline = target.value;
    queueExploreSearch();
    return;
  }
  if (!(target instanceof HTMLInputElement)) return;
  if (target.matches('input[name="shelfIds"]')) {
    state.shelfPickerSelection = [...app.querySelectorAll('input[name="shelfIds"]:checked')].map((input) => input.value);
    return;
  }
  if (target.matches('[data-post-media]')) {
    selectPostMedia(target);
    return;
  }
  if (target.matches('[data-profile-image]')) {
    selectProfileImage(target);
    return;
  }
  if (!target.matches('[data-board-image]')) return;
  const file = target.files?.[0];
  if (!file) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    state.boardImageError = 'Choose a PNG, JPG, or WebP image.';
    render();
    return;
  }
  if (file.size > 4 * 1024 * 1024) {
    state.boardImageError = 'Choose an image smaller than 4 MB.';
    render();
    return;
  }

  state.boardImageError = '';
  state.boardImageLoading = true;
  const readToken = ++state.boardImageReadToken;
  render();
  const reader = new FileReader();
  reader.onload = () => {
    if (readToken !== state.boardImageReadToken || !state.boardDraft) return;
    if (typeof reader.result !== 'string' || !state.boardDraft) {
      state.boardImageError = 'The selected image could not be read.';
    } else {
      state.boardDraft.profileImage = reader.result;
    }
    state.boardImageLoading = false;
    render();
  };
  reader.onerror = () => {
    if (readToken !== state.boardImageReadToken || !state.boardDraft) return;
    state.boardImageError = 'The selected image could not be read.';
    state.boardImageLoading = false;
    render();
  };
  reader.readAsDataURL(file);
});

app?.addEventListener('submit', (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  event.preventDefault();
  if (form.dataset.form === 'registration' && !state.loading) submitRegistration(form);
  else if (form.dataset.form === 'board' && !state.boardLoading && !state.usernameLoading) submitBoard(form);
  else if (form.dataset.form === 'post' && !state.postPublishing) submitPost(form);
  else if (form.dataset.form === 'shelf' && !state.shelfLoading) submitShelfForm(form);
  else if (form.dataset.form === 'shelf-picker' && !state.shelfLoading) submitShelfPicker(form);
  else if (form.dataset.form === 'comment' && !state.commentPending) submitComment(form);
  else if (form.dataset.form === 'profile' && !state.profileLoading && !state.profileImageLoading) submitProfile(form);
  else if (form.dataset.form === 'username' && !state.usernameLoading) submitUsernameChange(form);
});

app?.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target.closest('[data-action], [data-route]') : null;
  if (!target) return;
  if (target.matches('[data-route]')) {
    event.preventDefault();
    navigate(target.dataset.route);
    return;
  }

  const action = target.dataset.action;
  if (action === 'join') beginRegistration(target.dataset.role || null);
  else if (action === 'choose-role') {
    state.draft.role = target.dataset.role;
    state.errors.role = '';
    render();
  } else if (action === 'back-from-register') {
    state.errors = {};
    state.draft = { role: null, name: '', username: '', email: '' };
    navigate(activeAccount() ? '/profile' : '/');
  } else if (action === 'open-profile') navigate('/profile', { replace: true });
  else if (action === 'switch-account') {
    cancelProfileOperation();
    resetUsernameEditor();
    state.profileDraft = null;
    state.profileError = '';
    state.profileFieldErrors = {};
    state.profileImageToken += 1;
    state.profileImageLoading = false;
    state.profileImageError = '';
    state.shelfPickerPostId = null;
    state.shelfPickerSelection = [];
    state.shelfPickerError = '';
    state.shelfReturnPostId = null;
    state.shelfReturnRoute = null;
    state.shelfDraft = null;
    state.shelfErrors = {};
    state.shelfStatus = null;
    state.shelfDeleteConfirmId = null;
    state.repostConfirm = null;
    state.repostStatus = null;
    state.commentEditor = null;
    state.commentDeleteConfirmId = null;
    state.commentStatus = null;
    state.activeAccountId = target.dataset.accountId;
    state.successAccountId = null;
    state.editingProfile = false;
    state.route = '/profile';
    navigate('/profile');
  } else if (action === 'logout') {
    cancelProfileOperation();
    resetUsernameEditor();
    state.profileDraft = null;
    state.profileError = '';
    state.profileFieldErrors = {};
    state.profileImageToken += 1;
    state.profileImageLoading = false;
    state.profileImageError = '';
    state.shelfPickerPostId = null;
    state.shelfPickerSelection = [];
    state.shelfPickerError = '';
    state.shelfReturnPostId = null;
    state.shelfReturnRoute = null;
    state.shelfDraft = null;
    state.shelfErrors = {};
    state.shelfStatus = null;
    state.shelfDeleteConfirmId = null;
    state.repostConfirm = null;
    state.repostStatus = null;
    state.commentEditor = null;
    state.commentDeleteConfirmId = null;
    state.commentStatus = null;
    state.activeAccountId = null;
    state.successAccountId = null;
    state.editingProfile = false;
    navigate('/');
  } else if (action === 'home-tab') {
    state.homeTab = target.dataset.tab;
    render();
  } else if (action === 'toggle-comments') {
    toggleComments(target.dataset.postId);
  } else if (action === 'edit-comment') {
    beginCommentEdit(target.dataset.commentId);
  } else if (action === 'cancel-comment-edit') {
    cancelCommentEdit();
  } else if (action === 'request-delete-comment') {
    requestDeleteComment(target.dataset.commentId);
  } else if (action === 'confirm-delete-comment') {
    confirmDeleteComment(target.dataset.commentId);
  } else if (action === 'cancel-delete-comment') {
    if (!state.commentPending) {
      state.commentDeleteConfirmId = null;
      render();
    }
  } else if (action === 'toggle-repost') {
    toggleRepost(target.dataset.postId);
  } else if (action === 'confirm-repost') {
    confirmRepost(target.dataset.postId);
  } else if (action === 'cancel-repost') {
    cancelRepost();
  } else if (action === 'open-search') {
    state.searchOpen = false;
    navigate('/explore');
    requestAnimationFrame(() => app.querySelector('[data-explore-search]')?.focus());
  } else if (action === 'edit-profile') {
    beginProfileEdit();
  } else if (action === 'open-username-editor') {
    beginUsernameEdit();
  } else if (action === 'cancel-username-editor') {
    cancelUsernameEdit();
  } else if (action === 'remove-profile-image') {
    if (state.editingProfile && !state.profileLoading && state.profileDraft) {
      state.profileDraft = { ...state.profileDraft, profileImage: '' };
      state.profileImageError = '';
      state.profileImageToken += 1;
      state.profileImageLoading = false;
      render();
    }
  } else if (action === 'cancel-profile-edit') {
    cancelProfileEdit();
  } else if (action === 'profile-activity-tab') {
    const profile = state.accounts.find((entry) => entry.id === target.dataset.profileId && entry.role === 'Fan');
    if (profile && ['posts', 'reposts'].includes(target.dataset.tab)) {
      state.profileActivityTabs[profile.id] = target.dataset.tab;
      render();
    }
  } else if (action === 'add-account') {
    state.editingProfile = false;
    beginRegistration(null);
  } else if (action === 'create-shelf') {
    beginShelfForm('create');
  } else if (action === 'create-shelf-from-picker') {
    state.shelfReturnPostId = state.shelfPickerPostId;
    state.shelfReturnRoute = state.route;
    beginShelfForm('create');
  } else if (action === 'open-shelf-picker') {
    openShelfPicker(target.dataset.postId);
  } else if (action === 'close-shelf-picker') {
    if (!state.shelfLoading) {
      state.shelfPickerPostId = null;
      state.shelfPickerSelection = [];
      state.shelfPickerError = '';
      render();
    }
  } else if (action === 'edit-shelf') {
    beginShelfForm('edit', target.dataset.shelfId);
  } else if (action === 'cancel-shelf-form') {
    if (!state.shelfLoading) {
      state.shelfReturnPostId = null;
      state.shelfReturnRoute = null;
      state.shelfDraft = null;
      state.shelfErrors = {};
      navigate(target.dataset.cancelRoute || '/shelves');
    }
  } else if (action === 'delete-shelf') {
    const shelf = state.shelves.find((entry) => entry.id === target.dataset.shelfId && entry.ownerId === activeAccount()?.id);
    if (shelf && !state.shelfLoading) {
      state.shelfDeleteConfirmId = shelf.id;
      render();
    }
  } else if (action === 'confirm-delete-shelf') {
    confirmDeleteShelf(target.dataset.shelfId);
  } else if (action === 'cancel-delete-shelf') {
    if (!state.shelfLoading) {
      state.shelfDeleteConfirmId = null;
      render();
    }
  } else if (action === 'remove-post-from-shelf') {
    removePostFromShelf(target.dataset.shelfId, target.dataset.postId);
  } else if (action === 'create-board') {
    beginBoardForm('create');
  } else if (action === 'edit-own-board') {
    beginBoardForm('edit');
  } else if (action === 'toggle-artist-follow') {
    toggleArtistFollow(target.dataset.boardId);
  } else if (action === 'cancel-board-form') {
    if (!state.usernameLoading) {
      state.boardDraft = null;
      state.boardErrors = {};
      state.boardImageError = '';
      state.boardImageLoading = false;
      state.boardImageReadToken += 1;
      navigate('/artists');
    }
  } else if (action === 'remove-board-image') {
    state.boardDraft = { ...(state.boardDraft || {}), profileImage: '' };
    state.boardImageError = '';
    state.boardImageReadToken += 1;
    state.boardImageLoading = false;
    render();
  } else if (action === 'start-post' || action === 'edit-post' || action === 'resume-post-draft') {
    startPostComposer(target.dataset.boardId, target.dataset.postId || null);
  } else if (action === 'save-post-draft') {
    const editor = state.postEditor;
    const account = activeAccount();
    if (editor && account?.role === 'Fan' && editor.authorId === account.id) {
      state.postErrors[editor.key] = '';
      state.postEditor = null;
      state.postStatus = { boardId: editor.boardId, userId: account.id, message: 'Draft saved in this tab.' };
      render();
    }
  } else if (action === 'discard-current-post-draft') {
    const editor = state.postEditor;
    const account = activeAccount();
    if (editor && account?.role === 'Fan' && editor.authorId === account.id) {
      discardPostDraft(account.id, editor.boardId, editor.postId);
      state.postStatus = { boardId: editor.boardId, userId: account.id, message: 'Draft discarded.' };
      render();
    }
  } else if (action === 'discard-saved-post-draft') {
    const account = activeAccount();
    const board = state.boards.find((entry) => entry.id === target.dataset.boardId);
    const postId = target.dataset.postId || null;
    const key = account?.role === 'Fan' && board ? postDraftKey(account.id, board.id, postId) : '';
    if (account?.role === 'Fan' && board && state.postDrafts[key]) {
      discardPostDraft(account.id, board.id, postId);
      state.postStatus = { boardId: board.id, userId: account.id, message: 'Draft discarded.' };
      render();
    }
  } else if (action === 'remove-post-media') {
    const editor = state.postEditor;
    const draft = editor && state.postDrafts[editor.key];
    if (editor && draft && activeAccount()?.id === editor.authorId) {
      releaseDraftMedia(draft);
      state.postDrafts[editor.key] = { ...draft, media: null };
      state.postErrors[editor.key] = '';
      render();
    }
  } else if (action === 'request-delete-post') {
    const account = activeAccount();
    const post = state.posts.find((entry) => entry.id === target.dataset.postId);
    if (!state.postPublishing && state.commentPending?.postId !== post?.id && state.repostPending?.postId !== post?.id
      && account?.role === 'Fan' && post?.authorId === account.id) {
      state.deleteConfirmPostId = post.id;
      render();
    }
  } else if (action === 'cancel-delete-post') {
    state.deleteConfirmPostId = null;
    render();
  } else if (action === 'confirm-delete-post') {
    deletePost(target.dataset.postId);
  } else if (action === 'clear-explore-search') {
    state.exploreQuery = '';
    state.exploreError = '';
    const searchInput = app.querySelector('[data-explore-search]');
    if (searchInput) searchInput.value = '';
    const clearButton = app.querySelector('[data-action="clear-explore-search"]');
    if (clearButton) clearButton.hidden = true;
    queueExploreSearch();
  } else if (action === 'reset-explore') {
    resetExplore();
  } else if (action === 'retry-explore') {
    queueExploreSearch();
  }
});

window.addEventListener('popstate', () => {
  if (state.loading) cancelRegistration();
  if (state.boardLoading) cancelBoardOperation();
  if (state.shelfLoading) cancelShelfOperation();
  state.route = getRoute();
  render();
});

const initialSpecialRoute = /^\/(?:board\/[^/]+|post\/[^/]+|profile\/[^/]+|artists\/(?:new|edit)|shelves\/(?:new|[^/]+(?:\/edit)?))$/.test(state.route);
if (!navItems.some((item) => item.path === state.route) && state.route !== '/' && state.route !== '/register' && state.route !== '/confirmation' && !initialSpecialRoute) {
  state.route = '/';
  history.replaceState({}, '', hrefFor('/'));
}
render();
