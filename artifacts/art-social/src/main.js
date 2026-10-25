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

function activeAccount() {
  return state.accounts.find((account) => account.id === state.activeAccountId) || null;
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
  const active = item.path === currentRoute || (item.path === '/home' && currentRoute === '/');
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

function renderExplore() {
  return `<section><p class="eyebrow">Find your next room</p><h1 class="page-title">Explore</h1><p class="page-subtitle">A home for artists and the work they make.</p><hr class="section-rule">${renderEmpty('No artist boards to explore yet.', 'There are no artist boards in this preview yet.')}</section>`;
}

function renderArtists() {
  return `<section><p class="eyebrow">The rooms you return to</p><h1 class="page-title">My Artists</h1><p class="page-subtitle">The artists you choose to keep close.</p><hr class="section-rule">${renderEmpty("You haven't connected with any artists yet.")}</section>`;
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

  if (!navItems.some((item) => item.path === state.route) && state.route !== '/') state.route = '/home';
  let content;
  let title;
  if (state.route === '/explore') { content = renderExplore(); title = 'Explore'; }
  else if (state.route === '/artists') { content = renderArtists(); title = 'My Artists'; }
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

app?.addEventListener('input', (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement && ['name', 'username', 'email'].includes(target.name)) {
    state.draft[target.name] = target.value;
  }
  if (target instanceof HTMLInputElement && target.name === 'profile-name') {
    state.profileDraft = target.value;
  }
});

app?.addEventListener('submit', (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || form.dataset.form !== 'registration') return;
  event.preventDefault();
  if (!state.loading) submitRegistration(form);
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
  }
});

window.addEventListener('popstate', () => {
  if (state.loading) cancelRegistration();
  state.route = getRoute();
  render();
});

if (!navItems.some((item) => item.path === state.route) && state.route !== '/' && state.route !== '/register' && state.route !== '/confirmation') {
  state.route = '/';
  history.replaceState({}, '', hrefFor('/'));
}
render();
