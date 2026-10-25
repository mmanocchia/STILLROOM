import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { Link, Router as WouterRouter, useLocation } from 'wouter';
import {
  ArrowLeft, ArrowUpRight, Bookmark, Check, Compass, Layers3, LogOut, Plus, Search, Sparkles, UserRound, X,
} from 'lucide-react';

type Account = { id: string; type: 'Fan' | 'Artist'; displayName: string; username: string; email: string };
type Board = { id: string; name: string; description: string; artistId: string; artistName: string; posts: Post[] };
type Post = { id: string; text: string; authorName: string; authorUsername: string };
type Registration = { type: 'Fan' | 'Artist'; displayName: string; username: string; email: string; password: string };

const navItems = [
  { label: 'Home', href: '/', icon: Layers3 },
  { label: 'Explore', href: '/explore', icon: Compass },
  { label: 'My Artists', href: '/artists', icon: Sparkles },
  { label: 'Shelves', href: '/shelves', icon: Bookmark },
  { label: 'Profile', href: '/profile', icon: UserRound },
];

function Brand({ linked = true }: { linked?: boolean }) {
  const content = (
    <>
      <span aria-hidden="true" className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#a35443]">
        <span className="h-4 w-4 rotate-45 border border-[#a35443]" /><span className="absolute h-1.5 w-1.5 rounded-full bg-[#a35443]" />
      </span>
      <span className="serif text-[24px] leading-none tracking-[-.04em]">stillroom</span>
    </>
  );
  return linked ? <Link href="/" className="group flex items-center gap-3" data-testid="link-brand">{content}</Link> :
    <span className="flex items-center gap-3" data-testid="brand">{content}</span>;
}

function NavLink({ href, label, icon: Icon, active, mobile = false }: {
  href: string; label: string; icon: typeof Layers3; active: boolean; mobile?: boolean;
}) {
  return <Link href={href} aria-current={active ? 'page' : undefined} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}
    className={`group flex items-center ${mobile ? 'flex-col gap-1 px-2 py-2 text-[10px]' : 'gap-3 rounded-md px-3 py-2.5 text-[14px]'} transition-colors ${active ? 'bg-[#eee8dc] text-[#713e32]' : 'text-[#716b62] hover:bg-[#f0ece4] hover:text-[#2e2b27]'}`}>
    <Icon size={mobile ? 18 : 17} strokeWidth={active ? 1.8 : 1.55} /><span className={mobile ? 'font-medium' : ''}>{label}</span>
    {active && !mobile ? <span className="ml-auto h-1 w-1 rounded-full bg-[#a35443]" /> : null}
  </Link>;
}

function Sidebar({ path }: { path: string }) {
  return <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] flex-col border-r border-[#e2dbcf] bg-[#f7f4ed] px-7 py-8 lg:flex" data-testid="sidebar-navigation">
    <Brand /><div className="mt-14"><p className="mono mb-3 px-3 text-[9px] uppercase tracking-[.2em] text-[#9a9184]">Your corner</p>
      <nav aria-label="Main navigation" className="space-y-1">{navItems.map((item) => <NavLink key={item.href} {...item} active={path === item.href || (item.href !== '/' && path.startsWith(item.href))} />)}</nav></div>
    <div className="mt-auto border-t border-[#e2dbcf] pt-5"><p className="serif text-[18px] italic leading-snug text-[#5e594f]">A little less noise.<br />A little more looking.</p>
      <p className="mono mt-4 text-[9px] uppercase tracking-[.16em] text-[#9a9184]">A place to keep what moves you</p></div>
  </aside>;
}

function MobileNavigation({ path }: { path: string }) {
  return <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[#e2dbcf] bg-[#f7f4ed]/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 backdrop-blur lg:hidden" data-testid="mobile-navigation">
    {navItems.map((item) => <NavLink key={item.href} {...item} mobile active={path === item.href || (item.href !== '/' && path.startsWith(item.href))} />)}
  </nav>;
}

function Topbar({ title, onLogout }: { title: string; onLogout: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  return <header className="sticky top-0 z-20 border-b border-[#e2dbcf]/80 bg-[#f7f4ed]/90 backdrop-blur-md">
    <div className="mx-auto flex h-[66px] max-w-[1320px] items-center justify-between px-5 md:px-10 lg:px-12">
      <div className="flex items-center gap-3 lg:hidden"><Brand /></div><p className="hidden text-[12px] tracking-[.08em] text-[#81796d] lg:block">{title}</p>
      <div className="ml-auto flex items-center gap-2">
        {searchOpen ? <label className="flex h-9 w-[min(58vw,280px)] items-center gap-2 border-b border-[#a35443] px-1"><Search size={15} className="text-[#867d70}" />
          <input autoFocus placeholder="Search artists, works…" aria-label="Search artists and works" data-testid="input-global-search" className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#a49a8c]" />
          <button onClick={() => setSearchOpen(false)} aria-label="Close search" data-testid="button-close-search" className="text-[#766f64]"><X size={16} /></button></label>
          : <button onClick={() => setSearchOpen(true)} aria-label="Open search" data-testid="button-open-search" className="flex h-9 items-center gap-2 rounded-full px-3 text-[12px] text-[#766f64] hover:bg-[#eee8dc]"><Search size={16} strokeWidth={1.7} /><span className="hidden sm:block">Search</span></button>}
        <Link href="/profile" aria-label="Open your profile" data-testid="link-account" className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#d9c9b0] text-[#59493d]"><UserRound size={15} strokeWidth={1.6} /></Link>
        <button onClick={onLogout} data-testid="button-logout" aria-label="Log out" className="flex h-8 items-center gap-1.5 rounded-full px-2 text-[11px] text-[#766f64] hover:bg-[#eee8dc]"><LogOut size={14} /><span className="hidden sm:block">Log out</span></button>
      </div>
    </div>
  </header>;
}

function Shell({ children, path, title, user, onLogout }: { children: ReactNode; path: string; title: string; user: Account; onLogout: () => void }) {
  return <div className="paper-grain min-h-[100dvh] bg-[#f7f4ed] text-[#302d28]"><Sidebar path={path} /><div className="min-h-[100dvh] lg:pl-[244px]">
    <Topbar title={title} onLogout={onLogout} /><main className="mx-auto max-w-[1320px] px-5 pb-28 pt-8 md:px-10 md:pt-10 lg:px-12 lg:pb-16">{children}</main>
  </div><MobileNavigation path={path} /></div>;
}

function SectionEyebrow({ children }: { children: ReactNode }) { return <p className="mono text-[9px] uppercase tracking-[.18em] text-[#938a7d]">{children}</p>; }

function EmptyState({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[240px] max-w-[700px] flex-col items-center justify-center border-y border-[#e2dbcf] px-6 text-center" data-testid="state-empty">
    <span aria-hidden="true" className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#d5ccbd] text-[#8f7964]"><Bookmark size={17} strokeWidth={1.5} /></span>
    <p className="serif text-[23px] leading-snug text-[#514b42]">{children}</p>
  </div>;
}

function SidebarNote() {
  return <aside className="hidden xl:block"><div className="sticky top-[92px] space-y-8">
    <section className="border-t border-[#d9d1c4] pt-4"><SectionEyebrow>On the noticeboard</SectionEyebrow><h3 className="serif mt-3 text-[22px] leading-tight">The good stuff<br /><i>travels by hand.</i></h3>
      <p className="mt-3 text-[12px] leading-[1.7] text-[#766f64]">A place for fans to gather around the work, share what they find, and keep what stays with them.</p></section>
    <section className="border-t border-[#d9d1c4] pt-4"><SectionEyebrow>Little reminder</SectionEyebrow><p className="serif mt-3 text-[17px] italic leading-snug text-[#6e685e]">Artist boards are for fans. The conversation belongs to the people who love the work.</p></section>
    <footer className="mono text-[9px] leading-[1.9] tracking-[.11em] text-[#9a9184]">ABOUT · GUIDELINES · NOTES<br />STILLROOM</footer>
  </div></aside>;
}

function HomePage() {
  const [tab, setTab] = useState<'For You' | 'My Artists'>('For You');
  return <div className="page-enter"><div className="mb-8 flex flex-col justify-between gap-5 border-b border-[#d9d1c4] pb-7 sm:flex-row sm:items-end">
    <div><SectionEyebrow>Your daily edit</SectionEyebrow><h1 className="serif mt-2 text-[40px] leading-[1.05] tracking-[-.045em] sm:text-[48px]">A place to <i>linger.</i></h1><p className="mt-3 text-[13px] text-[#766f64]">Good things, gathered by the people who love them.</p></div>
    <div className="flex w-fit border-b border-[#d9d1c4]" role="tablist" aria-label="Feed selection">{(['For You', 'My Artists'] as const).map((item) => <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} data-testid={`tab-${item.toLowerCase().replace(' ', '-')}`} className={`relative px-3 pb-2.5 text-[12px] transition-colors ${tab === item ? 'text-[#713e32]' : 'text-[#8b8378] hover:text-[#302d28]'}`}>{item}{tab === item && <span className="absolute inset-x-3 bottom-[-1px] h-[2px] bg-[#a35443]" />}</button>)}</div>
  </div><div className="grid grid-cols-1 gap-x-14 xl:grid-cols-[minmax(0,660px)_220px]"><section aria-label={`${tab} feed`} className="max-w-[700px]"><EmptyState>Nothing here yet. Discover artists and start collecting.</EmptyState></section><SidebarNote /></div></div>;
}

function ExplorePage({ boards }: { boards: Board[] }) {
  const [query, setQuery] = useState('');
  const results = boards.filter((board) => `${board.name} ${board.artistName} ${board.description}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="page-enter"><SectionEyebrow>Discover at your own pace</SectionEyebrow>
    <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><h1 className="serif text-[42px] leading-tight tracking-[-.04em] sm:text-[50px]">A world of <i>work.</i></h1><p className="mt-2 text-[13px] text-[#766f64]">Follow a thread. See where it takes you.</p></div>
      <label className="flex h-10 w-full items-center gap-2 border-b border-[#cfc6b7] sm:w-[260px]"><Search size={15} className="text-[#948a7c]" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search artists and works" data-testid="input-explore-search" placeholder="Find artists or works…" className="w-full bg-transparent text-[12px] outline-none placeholder:text-[#a49a8c]" /></label></div>
    <div className="mt-9">{results.length ? <div className="max-w-[790px] divide-y divide-[#e2dbcf] border-y border-[#e2dbcf]">{results.map((board) => <Link key={board.id} href={`/board/${board.id}`} data-testid={`link-board-${board.id}`} className="flex items-center justify-between gap-4 py-5 hover:text-[#8d4739]"><div><p className="serif text-[23px]">{board.name}</p><p className="mt-1 text-[11px] text-[#81796d]">By {board.artistName} · {board.posts.length} {board.posts.length === 1 ? 'note' : 'notes'}</p></div><ArrowUpRight size={16} /></Link>)}</div> : <EmptyState>{query.trim() ? `No boards match “${query.trim()}”.` : 'No artist boards to explore yet.'}</EmptyState>}</div>
  </div>;
}

function ArtistsPage({ user, boards, onCreateBoard }: { user: Account; boards: Board[]; onCreateBoard: (name: string, description: string) => void }) {
  const [creating, setCreating] = useState(false); const [name, setName] = useState(''); const [description, setDescription] = useState(''); const [error, setError] = useState('');
  const ownBoards = boards.filter((board) => board.artistId === user.id);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!name.trim()) { setError('Give your board a name before creating it.'); return; }
    onCreateBoard(name.trim(), description.trim()); setName(''); setDescription(''); setError(''); setCreating(false);
  }
  return <div className="page-enter"><SectionEyebrow>Your artist boards</SectionEyebrow>
    <div className="mt-2 flex flex-col justify-between gap-3 border-b border-[#d9d1c4] pb-7 sm:flex-row sm:items-end"><div><h1 className="serif text-[42px] tracking-[-.04em] sm:text-[50px]">{user.type === 'Artist' ? 'Your' : 'My'} <i>artists.</i></h1><p className="mt-2 text-[13px] text-[#766f64]">{user.type === 'Artist' ? 'Make a room for the people who find your work.' : 'Fan-run rooms for the work we love.'}</p></div>
      {user.type === 'Artist' ? <button onClick={() => setCreating(!creating)} data-testid="button-create-board" className="flex items-center gap-2 self-start rounded-full bg-[#a35443] px-4 py-2.5 text-[11px] text-[#fffaf1] hover:bg-[#853f33] sm:self-auto"><Plus size={14} /> New board</button> : <Link href="/explore" className="flex items-center gap-1.5 pb-1 text-[12px] text-[#8b493c] hover:text-[#633328]" data-testid="link-find-artists">Find more artists <ArrowUpRight size={14} /></Link>}</div>
    {creating && user.type === 'Artist' ? <form onSubmit={submit} className="my-5 max-w-[560px] border border-[#e2dbcf] bg-[#f2eee6] p-5" data-testid="form-create-board"><SectionEyebrow>A new room</SectionEyebrow>
      <label className="mt-4 block text-[11px] text-[#716b62]">Board name<input value={name} onChange={(event) => setName(event.target.value)} data-testid="input-board-name" className="mt-1 block w-full border-b border-[#cfc6b7] bg-transparent py-2 text-[14px] outline-none focus:border-[#a35443]" /></label>
      <label className="mt-4 block text-[11px] text-[#716b62]">A few words about it <textarea value={description} onChange={(event) => setDescription(event.target.value)} data-testid="input-board-description" rows={2} className="mt-1 block w-full resize-y border-b border-[#cfc6b7] bg-transparent py-2 text-[13px] outline-none focus:border-[#a35443]" /></label>
      {error && <p className="mt-2 text-[11px] text-[#9a3e32]" role="alert">{error}</p>}<div className="mt-4 flex gap-2"><button type="submit" data-testid="button-save-board" className="rounded-full bg-[#a35443] px-4 py-2 text-[11px] text-[#fffaf1]">Create board</button><button type="button" onClick={() => { setCreating(false); setError(''); }} data-testid="button-cancel-board" className="rounded-full border border-[#cfc6b7] px-4 py-2 text-[11px]">Cancel</button></div>
    </form> : null}
    <div className="mt-4">{ownBoards.length ? <div className="max-w-[790px] divide-y divide-[#e2dbcf] border-y border-[#e2dbcf]">{ownBoards.map((board) => <Link key={board.id} href={`/board/${board.id}`} data-testid={`link-own-board-${board.id}`} className="flex items-center justify-between py-5 hover:text-[#8d4739]"><div><p className="serif text-[22px]">{board.name}</p><p className="mt-1 text-[11px] text-[#81796d]">{board.posts.length} {board.posts.length === 1 ? 'note' : 'notes'}</p></div><ArrowUpRight size={15} /></Link>)}</div> : <EmptyState>{user.type === 'Artist' ? 'Your boards will find their people in time.' : 'You haven’t connected with any artists yet.'}</EmptyState>}</div>
    <div className="mt-9 max-w-[790px] border-l-2 border-[#c99674] bg-[#f0ece3] px-5 py-4"><SectionEyebrow>A note on artist boards</SectionEyebrow><p className="serif mt-2 text-[18px] leading-snug">Only fans post here. Artists make the work; the community makes the room.</p><p className="mt-2 text-[11px] leading-relaxed text-[#766f64]">Reposts are welcome. Keep it generous, give context, and make room for the work to speak.</p></div>
  </div>;
}

function ShelvesPage() {
  return <div className="page-enter"><SectionEyebrow>Collected, not catalogued</SectionEyebrow><div className="mt-2 border-b border-[#d9d1c4] pb-7"><h1 className="serif text-[42px] tracking-[-.04em] sm:text-[50px]">Your <i>shelves.</i></h1><p className="mt-2 text-[13px] text-[#766f64]">A home for the things you want to find again.</p></div><div className="mt-8"><EmptyState>Your shelves are empty.</EmptyState></div></div>;
}

function ProfilePage({ user, onUpdateDisplayName }: { user: Account; onUpdateDisplayName: (name: string) => void }) {
  const [editing, setEditing] = useState(false); const [draft, setDraft] = useState(user.displayName);
  return <div className="page-enter"><SectionEyebrow>A little about you</SectionEyebrow>
    <div className="mt-4 grid max-w-[930px] grid-cols-1 gap-10 border-t border-[#d9d1c4] pt-8 md:grid-cols-[240px_1fr] md:gap-16"><div><div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#d8dfd5] text-[#526253]"><UserRound size={34} strokeWidth={1.2} /></div></div>
      <div><div className="flex flex-wrap items-start justify-between gap-4"><div>{editing ? <label className="block"><span className="sr-only">Display name</span><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Add a display name" autoFocus data-testid="input-profile-name" className="w-full max-w-[320px] border-b border-[#a35443] bg-transparent pb-2 font-serif text-[34px] outline-none placeholder:text-[#a49a8c]" /></label> : <h1 className="serif text-[42px] tracking-[-.04em]" data-testid="text-profile-name">{user.displayName}</h1>}</div>
        {editing ? <div className="flex gap-2"><button onClick={() => { if (draft.trim()) onUpdateDisplayName(draft.trim()); setEditing(false); }} data-testid="button-save-profile" className="rounded-full bg-[#a35443] px-4 py-2 text-[11px] text-[#fffaf1]">Save</button><button onClick={() => { setDraft(user.displayName); setEditing(false); }} data-testid="button-cancel-profile" className="rounded-full border border-[#d9d1c4] px-4 py-2 text-[11px]">Cancel</button></div> : <button onClick={() => { setDraft(user.displayName); setEditing(true); }} data-testid="button-edit-profile" className="rounded-full border border-[#cfc6b7] px-4 py-2 text-[11px] text-[#6e685e] hover:border-[#a35443]">Edit profile</button>}</div>
        <p className="mt-2 text-[12px] text-[#81796d]" data-testid="text-profile-username">@{user.username} <span className="mx-2">·</span>{user.type}</p>
        <section className="mt-8"><SectionEyebrow>Your space</SectionEyebrow><Link href="/shelves" data-testid="link-profile-shelves" className="mt-4 flex max-w-[550px] items-center justify-between border-b border-[#e2dbcf] py-3 text-[12px] text-[#615b52] hover:text-[#8d4739]"><span>Open your shelves</span><ArrowUpRight size={15} /></Link>
          <Link href="/artists" data-testid="link-profile-artists" className="flex max-w-[550px] items-center justify-between border-b border-[#e2dbcf] py-3 text-[12px] text-[#615b52] hover:text-[#8d4739]"><span>{user.type === 'Artist' ? 'Manage your artist boards' : 'Visit your artist boards'}</span><ArrowUpRight size={15} /></Link></section>
      </div>
    </div><div className="mt-16 max-w-[930px] border-t border-[#d9d1c4] pt-4"><SectionEyebrow>Small print</SectionEyebrow><p className="mt-2 text-[11px] leading-relaxed text-[#8b8378]">This is your quiet corner. No scores, no follower tallies — just the things you care to keep.</p></div>
  </div>;
}

function BoardPage({ board, user, onPublish }: { board: Board | undefined; user: Account; onPublish: (text: string) => void }) {
  const [text, setText] = useState(''); const [error, setError] = useState(''); const [publishing, setPublishing] = useState(false);
  const publishTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => { if (publishTimer.current !== undefined) window.clearTimeout(publishTimer.current); }, []);
  if (!board) return <div className="page-enter"><SectionEyebrow>Room not found</SectionEyebrow><h1 className="serif mt-3 text-[38px]">This board isn’t here.</h1><Link href="/explore" className="mt-5 inline-flex items-center gap-2 text-[12px] text-[#8b493c]"><ArrowLeft size={14} /> Back to explore</Link></div>;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!text.trim()) { setError('Write a few words before publishing.'); return; }
    setPublishing(true); setError(''); publishTimer.current = window.setTimeout(() => { onPublish(text.trim()); setText(''); setPublishing(false); }, 500);
  }
  return <div className="page-enter"><Link href="/explore" className="inline-flex items-center gap-2 text-[11px] text-[#8b493c] hover:text-[#633328]"><ArrowLeft size={14} /> Explore boards</Link>
    <div className="mt-7 max-w-[760px] border-b border-[#d9d1c4] pb-7"><SectionEyebrow>A board by {board.artistName}</SectionEyebrow><h1 className="serif mt-2 text-[42px] tracking-[-.04em] sm:text-[50px]">{board.name}</h1>{board.description && <p className="mt-3 max-w-[600px] text-[13px] leading-relaxed text-[#766f64]">{board.description}</p>}</div>
    {user.type === 'Fan' && <form onSubmit={submit} className="my-7 max-w-[700px] border border-[#e2dbcf] bg-[#f2eee6] p-5" data-testid="form-publish-post"><SectionEyebrow>Leave a note</SectionEyebrow><textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={1000} rows={3} placeholder="What stayed with you?" aria-label="Post text" data-testid="input-post-text" className="mt-3 w-full resize-y bg-transparent text-[13px] leading-relaxed outline-none placeholder:text-[#a49a8c]" />
      {error && <p className="mt-2 text-[11px] text-[#9a3e32]" role="alert">{error}</p>}<div className="mt-3 flex items-center justify-between"><span className="text-[10px] text-[#9a9184]">{text.length}/1000</span><button type="submit" disabled={publishing} data-testid="button-publish-post" className="rounded-full bg-[#a35443] px-4 py-2 text-[11px] text-[#fffaf1] disabled:opacity-60">{publishing ? 'Publishing…' : 'Publish note'}</button></div>
    </form>}
    {board.posts.length ? <section className="max-w-[700px] divide-y divide-[#e2dbcf] border-y border-[#e2dbcf]" aria-label="Board notes">{board.posts.map((post) => <article key={post.id} data-testid={`post-${post.id}`} className="py-5"><p className="whitespace-pre-wrap text-[13px] leading-[1.8] text-[#514b42]">{post.text}</p><p className="mt-3 text-[10px] text-[#938a7d]">{post.authorName} <span className="mx-1">·</span>@{post.authorUsername}</p></article>)}</section> : <div className="max-w-[700px]"><EmptyState>No notes here yet. The room is waiting.</EmptyState></div>}
  </div>;
}

function Welcome({ onRegister }: { onRegister: () => void }) {
  return <div className="paper-grain min-h-[100dvh] bg-[#f7f4ed] text-[#302d28]"><header className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-7 md:px-12"><Brand /><button onClick={onRegister} data-testid="button-open-registration" className="rounded-full border border-[#cfc6b7] px-4 py-2 text-[11px] text-[#6e685e] hover:border-[#a35443]">Join Stillroom</button></header>
    <main className="mx-auto grid min-h-[calc(100dvh-92px)] max-w-[1320px] items-center gap-12 px-6 pb-16 pt-8 md:grid-cols-[1.1fr_.9fr] md:px-12">
      <section className="page-enter max-w-[650px]"><SectionEyebrow>A quieter kind of gathering</SectionEyebrow><h1 className="serif mt-5 text-[54px] leading-[.98] tracking-[-.05em] sm:text-[72px]">For the work<br />that stays <i>with you.</i></h1>
        <p className="mt-7 max-w-[470px] text-[14px] leading-[1.9] text-[#716b62]">Stillroom is a home for people who care about art. Gather around artists, make room for the work, and share what moves you — without the noise of popularity.</p>
        <div className="mt-9 flex flex-wrap items-center gap-4"><button onClick={onRegister} data-testid="button-get-started" className="inline-flex items-center gap-2 rounded-full bg-[#a35443] px-6 py-3 text-[12px] text-[#fffaf1] transition-colors hover:bg-[#853f33]">Find your corner <ArrowUpRight size={15} /></button><span className="text-[11px] text-[#938a7d]">A place to linger, not perform.</span></div>
      </section>
      <aside className="relative mx-auto w-full max-w-[480px] md:justify-self-end"><div className="absolute -right-3 -top-5 h-20 w-20 rounded-full border border-[#d8c7b3]" /><div className="relative border-y border-[#d9d1c4] py-8 md:py-12">
        <SectionEyebrow>What we keep</SectionEyebrow><div className="mt-7 space-y-7"><div className="flex gap-5"><span className="serif text-[22px] italic text-[#a35443]">01</span><div><p className="serif text-[22px]">Artist-led rooms</p><p className="mt-1 text-[12px] leading-relaxed text-[#81796d]">Artists make boards. Fans make the conversation.</p></div></div><div className="flex gap-5"><span className="serif text-[22px] italic text-[#a35443]">02</span><div><p className="serif text-[22px]">A slower feed</p><p className="mt-1 text-[12px] leading-relaxed text-[#81796d]">No scores, rankings, or follower tallies to chase.</p></div></div><div className="flex gap-5"><span className="serif text-[22px] italic text-[#a35443]">03</span><div><p className="serif text-[22px]">Made for looking</p><p className="mt-1 text-[12px] leading-relaxed text-[#81796d]">Bring your attention. Everything else can wait.</p></div></div></div>
      </div><p className="mono mt-5 text-[9px] uppercase tracking-[.16em] text-[#9a9184]">No audience metrics. Just a place to gather.</p></aside>
    </main>
  </div>;
}

function RegistrationPage({ onBack, onRegister, accounts, success, onEnter }: {
  onBack: () => void; onRegister: (data: Omit<Registration, 'password'>) => void; accounts: Account[];
  success: Account | null; onEnter: (user: Account) => void;
}) {
  const [type, setType] = useState<'Fan' | 'Artist'>('Fan');
  const [displayName, setDisplayName] = useState(''); const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({}); const [loading, setLoading] = useState(false);
  const registrationTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => { if (registrationTimer.current !== undefined) window.clearTimeout(registrationTimer.current); }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const next: Record<string, string> = {};
    if (!displayName.trim()) next.displayName = 'Enter the name you’d like people to see.';
    const normalizedUsername = username.trim().replace(/^@/, '');
    if (!normalizedUsername) next.username = 'Choose a username.';
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(normalizedUsername)) next.username = 'Use 3–20 letters, numbers, or underscores.';
    else if (accounts.some((account) => account.username.toLowerCase() === normalizedUsername.toLowerCase())) next.username = 'That username is already in use this session.';
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) next.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) next.email = 'Enter a valid email address.';
    else if (accounts.some((account) => account.email.toLowerCase() === normalizedEmail)) next.email = 'That email is already in use this session.';
    if (!password) next.password = 'Create a password.';
    else if (password.length < 8) next.password = 'Use at least 8 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;
    const accountData = { type, displayName: displayName.trim(), username: normalizedUsername, email: normalizedEmail };
    setPassword(''); setLoading(true);
    registrationTimer.current = window.setTimeout(() => { onRegister(accountData); setLoading(false); }, 750);
  }
  const inputClass = 'mt-1 block w-full border-b border-[#cfc6b7] bg-transparent py-2.5 text-[13px] outline-none transition-colors placeholder:text-[#b0a698] focus:border-[#a35443]';
  if (success) return <div className="paper-grain min-h-[100dvh] bg-[#f7f4ed] text-[#302d28]"><header className="mx-auto max-w-[1320px] px-6 py-7 md:px-12"><Brand linked={false} /></header>
    <main className="mx-auto flex min-h-[75dvh] max-w-[690px] flex-col justify-center px-6 py-10"><span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#c7d0c2] bg-[#e5e9df] text-[#526253]"><Check size={20} /></span>
      <SectionEyebrow>Your room is ready</SectionEyebrow><h1 className="serif mt-3 text-[46px] leading-tight tracking-[-.04em]">Welcome, <i>{success.displayName}.</i></h1>
      <p className="mt-4 max-w-[470px] text-[13px] leading-relaxed text-[#766f64]">Your {success.type.toLowerCase()} corner is yours to shape. Nothing has been added for you — begin wherever your curiosity leads.</p>
      <button onClick={() => onEnter(success)} data-testid="button-open-new-profile" className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#a35443] px-5 py-3 text-[12px] text-[#fffaf1] hover:bg-[#853f33]">Open your profile <ArrowUpRight size={15} /></button>
    </main>
  </div>;
  return <div className="paper-grain min-h-[100dvh] bg-[#f7f4ed] text-[#302d28]"><header className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-7 md:px-12"><Brand /><button onClick={onBack} data-testid="button-back-welcome" className="inline-flex items-center gap-2 text-[11px] text-[#766f64] hover:text-[#8b493c]"><ArrowLeft size={14} /> Back</button></header>
    <main className="mx-auto grid max-w-[1320px] gap-10 px-6 pb-16 pt-5 md:grid-cols-[.8fr_1.2fr] md:px-12">
      <section className="page-enter max-w-[390px] md:sticky md:top-10 md:self-start"><SectionEyebrow>A place without applause</SectionEyebrow><h1 className="serif mt-4 text-[46px] leading-[1.02] tracking-[-.045em]">Make room<br />for what <i>moves you.</i></h1><p className="mt-5 text-[13px] leading-[1.8] text-[#766f64]">Join as a fan or an artist. There are no audiences to build here, only rooms to make and work to care about.</p></section>
      <section className="mx-auto w-full max-w-[570px] border-y border-[#d9d1c4] py-7 md:justify-self-end"><SectionEyebrow>Settle in</SectionEyebrow><h2 className="serif mt-2 text-[29px]">Create your account</h2>
        <form onSubmit={submit} noValidate className="mt-5 space-y-4" data-testid="form-registration">
          <fieldset><legend className="mb-2 text-[11px] text-[#716b62]">I’m here as a…</legend><div className="grid grid-cols-2 gap-2">
            {(['Fan', 'Artist'] as const).map((item) => <button type="button" key={item} onClick={() => setType(item)} aria-pressed={type === item} data-testid={`button-account-type-${item.toLowerCase()}`} className={`border px-4 py-3 text-left transition-colors ${type === item ? 'border-[#a35443] bg-[#eee8dc]' : 'border-[#e2dbcf] hover:border-[#cfc6b7]'}`}><span className="serif text-[17px]">{item}</span><span className="mt-1 block text-[10px] leading-relaxed text-[#81796d]">{item === 'Fan' ? 'Find artists and share your thoughts.' : 'Make boards for people to gather around your work.'}</span></button>)}
          </div></fieldset>
          <label className="block text-[11px] text-[#716b62]">Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" data-testid="input-registration-display-name" placeholder="How should we call you?" className={inputClass} />{errors.displayName && <span className="mt-1 block text-[10px] text-[#9a3e32]" role="alert">{errors.displayName}</span>}</label>
          <label className="block text-[11px] text-[#716b62]">Username<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" data-testid="input-registration-username" placeholder="Your name, without the @"
              className={inputClass} />{errors.username && <span className="mt-1 block text-[10px] text-[#9a3e32]" role="alert">{errors.username}</span>}</label>
          <label className="block text-[11px] text-[#716b62]">Email<input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" type="email" data-testid="input-registration-email" placeholder="you@example.com" className={inputClass} />{errors.email && <span className="mt-1 block text-[10px] text-[#9a3e32]" role="alert">{errors.email}</span>}</label>
          <label className="block text-[11px] text-[#716b62]">Password<input value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" type="password" data-testid="input-registration-password" placeholder="At least 8 characters" className={inputClass} />{errors.password && <span className="mt-1 block text-[10px] text-[#9a3e32]" role="alert">{errors.password}</span>}</label>
          <p className="pt-1 text-[10px] leading-relaxed text-[#938a7d]">This is a local preview. Your account lives only in this open page and disappears on refresh.</p>
          <button type="submit" disabled={loading} data-testid="button-submit-registration" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#a35443] px-5 py-3 text-[12px] text-[#fffaf1] transition-colors hover:bg-[#853f33] disabled:cursor-wait disabled:opacity-70">{loading ? <><span className="h-3 w-3 animate-pulse rounded-full bg-[#f2d8c8]" /> Making a little room…</> : <>Create your account <ArrowUpRight size={15} /></>}</button>
        </form>
      </section>
    </main>
  </div>;
}

function Platform() {
  const [path, setPath] = useLocation();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [user, setUser] = useState<Account | null>(null);
  const userRef = useRef<Account | null>(user);
  userRef.current = user;
  const [registered, setRegistered] = useState<Account | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [sequence, setSequence] = useState(0);
  const title = navItems.find((item) => item.href === path)?.label ?? 'Stillroom';
  function register(data: Omit<Registration, 'password'>) {
    const account: Account = { ...data, id: data.username.toLowerCase() };
    setAccounts((existing) => [...existing, account]); setRegistered(account);
  }
  function enter(account: Account) { setUser(account); setRegistered(null); setPath('/profile'); }
  function logout() { userRef.current = null; setUser(null); setRegistered(null); setPath('/'); }
  function createBoard(name: string, description: string) {
    if (!user || user.type !== 'Artist') return;
    const id = `${user.id}-${sequence + 1}`; setSequence((count) => count + 1);
    setBoards((existing) => [...existing, { id, name, description, artistId: user.id, artistName: user.displayName, posts: [] }]);
  }
  function publish(text: string) {
    const activeUser = userRef.current;
    if (!activeUser || activeUser.type !== 'Fan') return;
    const match = path.match(/^\/board\/(.+)$/); if (!match) return;
    const post: Post = { id: `${activeUser.id}-${sequence + 1}`, text, authorName: activeUser.displayName, authorUsername: activeUser.username };
    setSequence((count) => count + 1); setBoards((existing) => existing.map((board) => board.id === match[1] ? { ...board, posts: [...board.posts, post] } : board));
  }
  function updateDisplayName(displayName: string) {
    if (!user) return;
    const updated = { ...user, displayName };
    setUser(updated);
    setAccounts((existing) => existing.map((account) => account.id === user.id ? updated : account));
    setBoards((existing) => existing.map((board) => board.artistId === user.id ? { ...board, artistName: displayName } : board));
  }
  if (path === '/register' && !user) return <RegistrationPage onBack={() => { setRegistered(null); setPath('/'); }} accounts={accounts} success={registered} onRegister={register} onEnter={enter} />;
  if (!user) return <Welcome onRegister={() => { setRegistered(null); setPath('/register'); }} />;
  const boardMatch = path.match(/^\/board\/(.+)$/);
  const selectedBoard = boardMatch ? boards.find((board) => board.id === boardMatch[1]) : undefined;
  return <Shell path={path} title={title} user={user} onLogout={logout}>
    {path === '/' ? <HomePage /> : path === '/explore' ? <ExplorePage boards={boards} /> :
      path === '/artists' ? <ArtistsPage user={user} boards={boards} onCreateBoard={createBoard} /> :
      path === '/shelves' ? <ShelvesPage /> : path === '/profile' ? <ProfilePage user={user} onUpdateDisplayName={updateDisplayName} /> :
      boardMatch ? <BoardPage board={selectedBoard} user={user} onPublish={publish} /> : <HomePage />}
  </Shell>;
}

function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Platform /></WouterRouter>;
}

export default App;
