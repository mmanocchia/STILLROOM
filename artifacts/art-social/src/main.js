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
  profileDraft: '',
  profileError: '',
  exploreQuery: '',
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

function activeAccount() {
  return state.accounts.find((account) => account.id === state.activeAccountId) || null;
}

function boardForOwner(ownerId) {
  return state.boards.find((board) => board.ownerId === ownerId) || null;
}

function brand(linked = true) {
  const contents = `<span class="brand-mark" aria-hidden="true"></span><span class="brand-name">stillroom</span>`;
  return linked
    ? `<a class="brand" href="${hrefFor('/')}" data-route="/" data-testid="link-brand" aria-label="Stillroom home">${contents}</a>`
    : `<span class="brand" aria-label="Stillroom">${contents}</span>`;
}

function header({ right = '' } = {}) {
  return `<header class="landing-header">${brand()}${right}</header>`;
}

function renderAccountChoice(account, current = false) {
  const details = `<span><span class="account-choice-name">${escapeHTML(account.name)}</span><span class="account-choice-meta">@${escapeHTML(account.username)}</span></span>
    <span class="account-choice-role">${current ? 'Current · ' : ''}${escapeHTML(account.role)}</span>`;
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
    || (item.path === '/explore' && currentRoute.startsWith('/board/'));
  return `<a class="nav-link" href="${hrefFor(item.path)}" data-route="${item.path}" ${active ? 'aria-current="page"' : ''}>${icon(item.icon)}<span>${item.label}</span></a>`;
}

function renderShell(content, pageTitle) {
  const account = activeAccount();
  const initials = escapeHTML((account?.name?.trim()[0] || account?.username?.[0] || 'S').toUpperCase());
  const nav = navItems.map((item) => navLink(item, state.route)).join('');
  const currentName = escapeHTML(account?.name || '');
  const currentUser = escapeHTML(account?.username || '');
  const searchControl = state.searchOpen
    ? `<label class="search-wrap">${icon('search', 15)}<input aria-label="Search artist boards" placeholder="Search" autocomplete="off"><button class="icon-button" type="button" data-action="close-search" aria-label="Close search">${icon('close', 15)}</button></label>`
    : `<button class="icon-button" type="button" data-action="open-search" aria-label="Open search">${icon('search', 17)}<span class="search-label">Search</span></button>`;
  return `<div class="paper-grain app-shell">
    <aside class="sidebar">
      <div class="sidebar-brand">${brand()}</div>
      <nav class="sidebar-nav" aria-label="Main navigation">${nav}</nav>
      <div class="sidebar-bottom">
        <div class="sidebar-note"><p class="eyebrow">A note to keep</p><h2 class="sidebar-note-title">Look a little longer.</h2><p class="sidebar-note-copy">There is no score to keep here. Just work worth returning to.</p></div>
        <div class="sidebar-user"><span class="avatar-mark">${initials}</span><span><span class="sidebar-user-name">${currentName}</span><span class="sidebar-user-handle">@${currentUser} · ${escapeHTML(account?.role || '')}</span></span></div>
      </div>
    </aside>
    <div class="app-main">
      <header class="topbar"><span class="topbar-title">${escapeHTML(pageTitle)}</span><div class="topbar-actions">${searchControl}<a class="icon-button" href="${hrefFor('/profile')}" data-route="/profile" aria-label="Open profile">${icon('profile', 17)}</a><button class="logout-button" type="button" data-action="logout" aria-label="Log out">${icon('logout', 15)}<span>Log out</span></button></div></header>
      <main class="page-content page-enter">${content}</main>
    </div>
    <nav class="mobile-nav" aria-label="Main navigation">${nav}</nav>
  </div>`;
}

function renderEmpty(title, copy = '') {
  return `<div class="empty-state"><div class="empty-state-inner"><span class="empty-icon">${icon('bookmark', 17)}</span><p class="empty-title">${title}</p>${copy ? `<p class="empty-copy">${copy}</p>` : ''}</div></div>`;
}

function renderHome() {
  const selected = state.homeTab === 'for-you';
  const heading = selected ? 'Nothing here yet. Discover artists and start collecting.' : 'You haven’t connected with any artists yet.';
  return `<section><p class="eyebrow">A quieter kind of feed</p><h1 class="page-title">Home</h1><p class="page-subtitle">A place for work that stays with you.</p>
    <div class="home-tabs" role="tablist" aria-label="Home feed"><button class="home-tab" type="button" data-action="home-tab" data-tab="for-you" role="tab" aria-selected="${selected}">For You</button><button class="home-tab" type="button" data-action="home-tab" data-tab="my-artists" role="tab" aria-selected="${!selected}">My Artists</button></div>
    ${renderEmpty(heading)}
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

function renderExploreResults() {
  const query = state.exploreQuery.trim().toLocaleLowerCase();
  const matches = state.boards.filter((board) => {
    const owner = state.accounts.find((account) => account.id === board.ownerId);
    return [board.artistName, board.discipline, board.biography, owner?.username]
      .filter(Boolean)
      .some((value) => value.toLocaleLowerCase().includes(query));
  });

  if (!state.boards.length) {
    return renderEmpty('No artist boards yet.', 'When artists create their boards, you’ll find them here.');
  }
  if (!matches.length) {
    return `<div id="explore-results-empty">${renderEmpty('No boards match your search.', 'Try a different artist name or discipline.')}<div class="empty-action"><button class="quiet-button" type="button" data-action="clear-explore-search">Clear search</button></div></div>`;
  }
  return `<div class="board-results-heading"><span class="eyebrow">${matches.length} ${matches.length === 1 ? 'board' : 'boards'}</span></div><div class="board-grid">${matches.map(renderBoardCard).join('')}</div>`;
}

function renderExplore() {
  return `<section><p class="eyebrow">Find your next room</p><h1 class="page-title">Explore</h1><p class="page-subtitle">Discover artist boards by name, discipline, or description.</p>
    <label class="explore-search">${icon('search', 16)}<input type="search" data-explore-search aria-label="Search artist boards" placeholder="Search artists or disciplines" value="${escapeHTML(state.exploreQuery)}"><button class="icon-button" type="button" data-action="clear-explore-search" aria-label="Clear search" ${state.exploreQuery ? '' : 'hidden'}>${icon('close', 15)}</button></label>
    <div id="explore-results" aria-live="polite">${renderExploreResults()}</div>
  </section>`;
}

function renderArtists() {
  const account = activeAccount();
  if (account?.role !== 'Artist') {
    return `<section><p class="eyebrow">The rooms you return to</p><h1 class="page-title">My Artists</h1><p class="page-subtitle">The artists you choose to keep close.</p>${renderEmpty("You haven't connected with any artists yet.")}<div class="empty-action"><a class="quiet-button" href="${hrefFor('/explore')}" data-route="/explore">Explore artist boards ${icon('arrow', 14)}</a></div></section>`;
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
  const disabled = state.boardLoading ? 'disabled' : '';
  const saveDisabled = state.boardLoading || state.boardImageLoading ? 'disabled' : '';
  const imagePreview = draft.profileImage
    ? `<div class="board-image-preview"><img src="${escapeHTML(draft.profileImage)}" alt="Selected profile image"><div><p class="preview-title">Profile image selected</p><button class="text-button" type="button" data-action="remove-board-image">Remove image</button></div></div>`
    : '';
  return `<section><p class="eyebrow">${editing ? 'Your artist space' : 'Make it yours'}</p><h1 class="page-title">${editing ? 'Edit your board' : 'Create your board'}</h1><p class="page-subtitle">Your board is a quiet introduction. It starts empty, with no posts.</p>
    <div class="board-form-card">
      ${state.boardErrors.form ? `<p class="inline-error" role="alert">${escapeHTML(state.boardErrors.form)}</p>` : ''}
      <form data-form="board" data-mode="${mode}" novalidate ${state.boardLoading || state.boardImageLoading ? 'aria-busy="true"' : ''}>
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
  </section>`;
}

function renderBoardDetail(boardId) {
  const board = state.boards.find((entry) => entry.id === boardId);
  if (!board) {
    return `<section><p class="eyebrow">Artist board</p><h1 class="page-title">Board not found.</h1><p class="page-subtitle">This board isn’t available in this session.</p>${renderEmpty('No board found.') }<div class="empty-action"><a class="quiet-button" href="${hrefFor('/explore')}" data-route="/explore">Back to Explore ${icon('arrow', 14)}</a></div></section>`;
  }
  const owner = activeAccount()?.role === 'Artist' && activeAccount()?.id === board.ownerId;
  const ownerAccount = state.accounts.find((account) => account.id === board.ownerId);
  const username = ownerAccount ? `@${escapeHTML(ownerAccount.username)}` : '';
  return `<section><p class="eyebrow">Artist board</p>
    ${owner && state.boardSuccessId === board.id ? `<p class="success-banner" role="status">${icon('check', 15)}${escapeHTML(state.boardSuccess)}</p>` : ''}
    <div class="board-detail">
      ${boardPortrait(board, true)}
      <div class="board-detail-copy"><span class="board-card-discipline">${escapeHTML(board.discipline)}</span><h1 class="page-title">${escapeHTML(board.artistName)}</h1><p class="board-owner-handle">${username}</p><p class="board-biography">${escapeHTML(board.biography)}</p>
        ${owner ? `<button class="quiet-button board-edit-button" type="button" data-action="edit-own-board">${icon('edit', 15)} Edit board information</button>` : ''}
      </div>
    </div>
    <div class="board-content-empty">${renderEmpty('This board is empty.', 'There are no posts here yet.')}</div>
  </section>`;
}

function renderShelves() {
  return `<section><p class="eyebrow">Collected by you</p><h1 class="page-title">Shelves</h1><p class="page-subtitle">A private place for the work you want to keep.</p><hr class="section-rule">${renderEmpty('Your shelves are empty.')}</section>`;
}

function renderProfile() {
  const account = activeAccount();
  if (!account) return '';
  const name = escapeHTML(account.name);
  const username = escapeHTML(account.username);
  const accounts = state.accounts;
  const editing = state.editingProfile;
  const profilePanel = editing
    ? `<div class="profile-edit"><label class="field-label">Display name<input class="field-input" name="profile-name" value="${escapeHTML(state.profileDraft)}" placeholder="Your name"></label>${state.profileError ? `<p class="inline-error" role="alert">${escapeHTML(state.profileError)}</p>` : ''}<div class="switcher-footer"><button class="primary-button" type="button" data-action="save-profile">Save</button><button class="quiet-button" type="button" data-action="cancel-profile-edit">Cancel</button></div></div>`
    : `<button class="quiet-button profile-edit" type="button" data-action="edit-profile">Edit profile</button>`;
  const switcher = accounts.map((entry) => renderAccountChoice(entry, entry.id === account.id)).join('');
  return `<section><p class="eyebrow">Your corner</p><h1 class="page-title">Profile</h1><p class="page-subtitle">A profile without a popularity score.</p>
    <div class="profile-card">
      <div class="profile-card-head"><span class="profile-avatar">${escapeHTML((account.name.trim()[0] || account.username[0] || 'S').toUpperCase())}</span><div><h2 class="profile-name">${name}</h2><p class="profile-meta">@${username}</p></div></div>
      <span class="role-pill">${escapeHTML(account.role)}</span>${profilePanel}
    </div>
    <section class="switcher-section" aria-labelledby="switcher-title">
      <div class="switcher-heading"><h2 class="switcher-title" id="switcher-title">Demo accounts</h2><span class="switcher-caption">Switch accounts in this tab</span></div>
      <div class="switcher-list">${switcher}</div>
      <div class="switcher-footer"><button class="outline-button" type="button" data-action="add-account">${icon('plus', 15)} Register another account</button></div>
      <p class="form-note">Accounts are held in page memory only. They disappear when you refresh.</p>
    </section>
    <hr class="section-rule"><section class="profile-empty">${renderEmpty('Your profile is empty.', 'There is no content here yet.')}</section>
  </section>`;
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
  const specialRoute = ['/artists/new', '/artists/edit'].includes(state.route) || Boolean(boardRoute);
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
  else if (state.route === '/shelves') { content = renderShelves(); title = 'Shelves'; }
  else if (state.route === '/profile') { content = renderProfile(); title = 'Profile'; }
  else { content = renderHome(); title = 'Stillroom'; }
  app.innerHTML = renderShell(content, title);
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

app?.addEventListener('input', (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement && ['name', 'username', 'email'].includes(target.name)) {
    state.draft[target.name] = target.value;
  }
  if (target instanceof HTMLInputElement && target.name === 'profile-name') {
    state.profileDraft = target.value;
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
  if (target instanceof HTMLInputElement && target.matches('[data-explore-search]')) {
    state.exploreQuery = target.value;
    const results = app.querySelector('#explore-results');
    if (results) results.innerHTML = renderExploreResults();
    const clearButton = app.querySelector('[data-action="clear-explore-search"]');
    if (clearButton) clearButton.hidden = !state.exploreQuery;
  }
});

app?.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || !target.matches('[data-board-image]')) return;
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
  else if (form.dataset.form === 'board' && !state.boardLoading) submitBoard(form);
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
    state.activeAccountId = target.dataset.accountId;
    state.successAccountId = null;
    state.editingProfile = false;
    state.route = '/profile';
    navigate('/profile');
  } else if (action === 'logout') {
    state.activeAccountId = null;
    state.successAccountId = null;
    state.editingProfile = false;
    navigate('/');
  } else if (action === 'home-tab') {
    state.homeTab = target.dataset.tab;
    render();
  } else if (action === 'open-search') {
    state.searchOpen = true;
    render();
    app.querySelector('.search-wrap input')?.focus();
  } else if (action === 'close-search') {
    state.searchOpen = false;
    render();
  } else if (action === 'edit-profile') {
    state.profileDraft = activeAccount()?.name || '';
    state.profileError = '';
    state.editingProfile = true;
    render();
    app.querySelector('[name="profile-name"]')?.focus();
  } else if (action === 'save-profile') {
    const name = state.profileDraft.trim();
    if (!name) {
      state.profileError = 'Your name can’t be empty.';
      render();
      app.querySelector('[name="profile-name"]')?.focus();
      return;
    }
    const account = activeAccount();
    if (account) account.name = name;
    state.profileError = '';
    state.editingProfile = false;
    render();
  } else if (action === 'cancel-profile-edit') {
    state.profileError = '';
    state.editingProfile = false;
    render();
  } else if (action === 'add-account') {
    state.editingProfile = false;
    beginRegistration(null);
  } else if (action === 'create-board') {
    beginBoardForm('create');
  } else if (action === 'edit-own-board') {
    beginBoardForm('edit');
  } else if (action === 'cancel-board-form') {
    state.boardDraft = null;
    state.boardErrors = {};
    state.boardImageError = '';
    state.boardImageLoading = false;
    state.boardImageReadToken += 1;
    navigate('/artists');
  } else if (action === 'remove-board-image') {
    state.boardDraft = { ...(state.boardDraft || {}), profileImage: '' };
    state.boardImageError = '';
    state.boardImageReadToken += 1;
    state.boardImageLoading = false;
    render();
  } else if (action === 'clear-explore-search') {
    state.exploreQuery = '';
    render();
  }
});

window.addEventListener('popstate', () => {
  if (state.loading) cancelRegistration();
  if (state.boardLoading) cancelBoardOperation();
  state.route = getRoute();
  render();
});

if (!navItems.some((item) => item.path === state.route) && state.route !== '/' && state.route !== '/register' && state.route !== '/confirmation') {
  state.route = '/';
  history.replaceState({}, '', hrefFor('/'));
}
render();
