import { type ReactNode, useState } from 'react';
import { Link, Router as WouterRouter, useLocation } from 'wouter';
import {
  ArrowUpRight, Bookmark, Compass, Layers3, Search, Sparkles, UserRound, X,
} from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/', icon: Layers3 },
  { label: 'Explore', href: '/explore', icon: Compass },
  { label: 'My Artists', href: '/artists', icon: Sparkles },
  { label: 'Shelves', href: '/shelves', icon: Bookmark },
  { label: 'Profile', href: '/profile', icon: UserRound },
];

function Brand() {
  return (
    <Link href="/" className="group flex items-center gap-3" data-testid="link-brand">
      <span aria-hidden="true" className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#a35443]">
        <span className="h-4 w-4 rotate-45 border border-[#a35443]" />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-[#a35443]" />
      </span>
      <span className="serif text-[24px] leading-none tracking-[-.04em]">stillroom</span>
    </Link>
  );
}

function NavLink({ href, label, icon: Icon, active, mobile = false }: {
  href: string; label: string; icon: typeof Layers3; active: boolean; mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}
      className={`group flex items-center ${mobile ? 'flex-col gap-1 px-2 py-2 text-[10px]' : 'gap-3 rounded-md px-3 py-2.5 text-[14px]'} transition-colors ${active ? 'bg-[#eee8dc] text-[#713e32]' : 'text-[#716b62] hover:bg-[#f0ece4] hover:text-[#2e2b27]'}`}
    >
      <Icon size={mobile ? 18 : 17} strokeWidth={active ? 1.8 : 1.55} />
      <span className={mobile ? 'font-medium' : ''}>{label}</span>
      {active && !mobile ? <span className="ml-auto h-1 w-1 rounded-full bg-[#a35443]" /> : null}
    </Link>
  );
}

function Sidebar({ path }: { path: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] flex-col border-r border-[#e2dbcf] bg-[#f7f4ed] px-7 py-8 lg:flex" data-testid="sidebar-navigation">
      <Brand />
      <div className="mt-14">
        <p className="mono mb-3 px-3 text-[9px] uppercase tracking-[.2em] text-[#9a9184]">Your corner</p>
        <nav aria-label="Main navigation" className="space-y-1">
          {navItems.map((item) => <NavLink key={item.href} {...item} active={path === item.href || (item.href !== '/' && path.startsWith(item.href))} />)}
        </nav>
      </div>
      <div className="mt-auto border-t border-[#e2dbcf] pt-5">
        <p className="serif text-[18px] italic leading-snug text-[#5e594f]">A little less noise.<br />A little more looking.</p>
        <p className="mono mt-4 text-[9px] uppercase tracking-[.16em] text-[#9a9184]">A place to keep what moves you</p>
      </div>
    </aside>
  );
}

function MobileNavigation({ path }: { path: string }) {
  return (
    <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[#e2dbcf] bg-[#f7f4ed]/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 backdrop-blur lg:hidden" data-testid="mobile-navigation">
      {navItems.map((item) => <NavLink key={item.href} {...item} mobile active={path === item.href || (item.href !== '/' && path.startsWith(item.href))} />)}
    </nav>
  );
}

function Topbar({ title }: { title: string }) {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <header className="sticky top-0 z-20 border-b border-[#e2dbcf]/80 bg-[#f7f4ed]/90 backdrop-blur-md">
      <div className="mx-auto flex h-[66px] max-w-[1320px] items-center justify-between px-5 md:px-10 lg:px-12">
        <div className="flex items-center gap-3 lg:hidden"><Brand /></div>
        <p className="hidden text-[12px] tracking-[.08em] text-[#81796d] lg:block">{title}</p>
        <div className="ml-auto flex items-center gap-2">
          {searchOpen ? (
            <label className="flex h-9 w-[min(58vw,280px)] items-center gap-2 border-b border-[#a35443] px-1">
              <Search size={15} className="text-[#867d70]" />
              <input autoFocus placeholder="Search artists, works…" aria-label="Search artists and works" data-testid="input-global-search" className="w-full bg-transparent text-[13px] outline-none placeholder:text-[#a49a8c]" />
              <button onClick={() => setSearchOpen(false)} aria-label="Close search" data-testid="button-close-search" className="text-[#766f64]"><X size={16} /></button>
            </label>
          ) : (
            <button onClick={() => setSearchOpen(true)} aria-label="Open search" data-testid="button-open-search" className="flex h-9 items-center gap-2 rounded-full px-3 text-[12px] text-[#766f64] hover:bg-[#eee8dc]">
              <Search size={16} strokeWidth={1.7} /><span className="hidden sm:block">Search</span>
            </button>
          )}
          <Link href="/profile" aria-label="Open your profile" data-testid="link-account" className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#d9c9b0] text-[#59493d]"><UserRound size={15} strokeWidth={1.6} /></Link>
        </div>
      </div>
    </header>
  );
}

function Shell({ children, path, title }: { children: ReactNode; path: string; title: string }) {
  return (
    <div className="paper-grain min-h-[100dvh] bg-[#f7f4ed] text-[#302d28]">
      <Sidebar path={path} />
      <div className="min-h-[100dvh] lg:pl-[244px]">
        <Topbar title={title} />
        <main className="mx-auto max-w-[1320px] px-5 pb-28 pt-8 md:px-10 md:pt-10 lg:px-12 lg:pb-16">
          {children}
        </main>
      </div>
      <MobileNavigation path={path} />
    </div>
  );
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return <p className="mono text-[9px] uppercase tracking-[.18em] text-[#938a7d]">{children}</p>;
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[240px] max-w-[700px] flex-col items-center justify-center border-y border-[#e2dbcf] px-6 text-center" data-testid="state-empty">
      <span aria-hidden="true" className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#d5ccbd] text-[#8f7964]">
        <Bookmark size={17} strokeWidth={1.5} />
      </span>
      <p className="serif text-[23px] leading-snug text-[#514b42]">{children}</p>
    </div>
  );
}

function SidebarNote() {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-[92px] space-y-8">
        <section className="border-t border-[#d9d1c4] pt-4">
          <SectionEyebrow>On the noticeboard</SectionEyebrow>
          <h3 className="serif mt-3 text-[22px] leading-tight">The good stuff<br /><i>travels by hand.</i></h3>
          <p className="mt-3 text-[12px] leading-[1.7] text-[#766f64]">A place for fans to gather around the work, share what they find, and keep what stays with them.</p>
        </section>
        <section className="border-t border-[#d9d1c4] pt-4">
          <SectionEyebrow>Little reminder</SectionEyebrow>
          <p className="serif mt-3 text-[17px] italic leading-snug text-[#6e685e]">Artist boards are for fans. The conversation belongs to the people who love the work.</p>
        </section>
        <footer className="mono text-[9px] leading-[1.9] tracking-[.11em] text-[#9a9184]">ABOUT · GUIDELINES · NOTES<br />STILLROOM</footer>
      </div>
    </aside>
  );
}

function HomePage() {
  const [tab, setTab] = useState<'For You' | 'My Artists'>('For You');
  return (
    <div className="page-enter">
      <div className="mb-8 flex flex-col justify-between gap-5 border-b border-[#d9d1c4] pb-7 sm:flex-row sm:items-end">
        <div>
          <SectionEyebrow>Your daily edit</SectionEyebrow>
          <h1 className="serif mt-2 text-[40px] leading-[1.05] tracking-[-.045em] sm:text-[48px]">A place to <i>linger.</i></h1>
          <p className="mt-3 text-[13px] text-[#766f64]">Good things, gathered by the people who love them.</p>
        </div>
        <div className="flex w-fit border-b border-[#d9d1c4]" role="tablist" aria-label="Feed selection">
          {(['For You', 'My Artists'] as const).map((item) => (
            <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} data-testid={`tab-${item.toLowerCase().replace(' ', '-')}`} className={`relative px-3 pb-2.5 text-[12px] transition-colors ${tab === item ? 'text-[#713e32]' : 'text-[#8b8378] hover:text-[#302d28]'}`}>
              {item}{tab === item && <span className="absolute inset-x-3 bottom-[-1px] h-[2px] bg-[#a35443]" />}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-14 xl:grid-cols-[minmax(0,660px)_220px]">
        <section aria-label={`${tab} feed`} className="max-w-[700px]">
          <EmptyState>Nothing here yet. Discover artists and start collecting.</EmptyState>
        </section>
        <SidebarNote />
      </div>
    </div>
  );
}

function ExplorePage() {
  const [query, setQuery] = useState('');
  return (
    <div className="page-enter">
      <SectionEyebrow>Discover at your own pace</SectionEyebrow>
      <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><h1 className="serif text-[42px] leading-tight tracking-[-.04em] sm:text-[50px]">A world of <i>work.</i></h1><p className="mt-2 text-[13px] text-[#766f64]">Follow a thread. See where it takes you.</p></div>
        <label className="flex h-10 w-full items-center gap-2 border-b border-[#cfc6b7] sm:w-[260px]">
          <Search size={15} className="text-[#948a7c]" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search artists and works" data-testid="input-explore-search" placeholder="Find artists or works…" className="w-full bg-transparent text-[12px] outline-none placeholder:text-[#a49a8c]" />
        </label>
      </div>
      <div className="mt-9">
        <EmptyState>{query.trim() ? `No artists or artworks match “${query.trim()}”.` : 'No artists or artworks to explore yet.'}</EmptyState>
      </div>
    </div>
  );
}

function ArtistsPage() {
  return (
    <div className="page-enter">
      <SectionEyebrow>Your artist boards</SectionEyebrow>
      <div className="mt-2 flex flex-col justify-between gap-3 border-b border-[#d9d1c4] pb-7 sm:flex-row sm:items-end">
        <div><h1 className="serif text-[42px] tracking-[-.04em] sm:text-[50px]">My <i>artists.</i></h1><p className="mt-2 text-[13px] text-[#766f64]">Fan-run rooms for the work we love.</p></div>
        <Link href="/explore" className="flex items-center gap-1.5 pb-1 text-[12px] text-[#8b493c] hover:text-[#633328]" data-testid="link-find-artists">Find more artists <ArrowUpRight size={14} /></Link>
      </div>
      <div className="mt-4"><EmptyState>You haven&apos;t connected with any artists yet.</EmptyState></div>
      <div className="mt-9 max-w-[790px] border-l-2 border-[#c99674] bg-[#f0ece3] px-5 py-4">
        <SectionEyebrow>A note on artist boards</SectionEyebrow>
        <p className="serif mt-2 text-[18px] leading-snug">Only fans post here. Artists make the work; the community makes the room.</p>
        <p className="mt-2 text-[11px] leading-relaxed text-[#766f64]">Reposts are welcome. Keep it generous, give context, and make room for the work to speak.</p>
      </div>
    </div>
  );
}

function ShelvesPage() {
  return (
    <div className="page-enter">
      <SectionEyebrow>Collected, not catalogued</SectionEyebrow>
      <div className="mt-2 border-b border-[#d9d1c4] pb-7">
        <div><h1 className="serif text-[42px] tracking-[-.04em] sm:text-[50px]">Your <i>shelves.</i></h1><p className="mt-2 text-[13px] text-[#766f64]">A home for the things you want to find again.</p></div>
      </div>
      <div className="mt-8"><EmptyState>Your shelves are empty.</EmptyState></div>
    </div>
  );
}

function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [draft, setDraft] = useState(name);
  return (
    <div className="page-enter">
      <SectionEyebrow>A little about you</SectionEyebrow>
      <div className="mt-4 grid max-w-[930px] grid-cols-1 gap-10 border-t border-[#d9d1c4] pt-8 md:grid-cols-[240px_1fr] md:gap-16">
        <div>
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#d8dfd5] text-[#526253]"><UserRound size={34} strokeWidth={1.2} /></div>
        </div>
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>{editing ? <label className="block"><span className="sr-only">Display name</span><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Add a display name" autoFocus data-testid="input-profile-name" className="w-full max-w-[320px] border-b border-[#a35443] bg-transparent pb-2 font-serif text-[34px] outline-none placeholder:text-[#a49a8c]" /></label> : <h1 className="serif text-[42px] tracking-[-.04em]">{name || 'Your profile'}</h1>}
            </div>
            {editing ? <div className="flex gap-2"><button onClick={() => { setName(draft.trim()); setEditing(false); }} data-testid="button-save-profile" className="rounded-full bg-[#a35443] px-4 py-2 text-[11px] text-[#fffaf1]">Save</button><button onClick={() => { setDraft(name); setEditing(false); }} data-testid="button-cancel-profile" className="rounded-full border border-[#d9d1c4] px-4 py-2 text-[11px]">Cancel</button></div> : <button onClick={() => setEditing(true)} data-testid="button-edit-profile" className="rounded-full border border-[#cfc6b7] px-4 py-2 text-[11px] text-[#6e685e] hover:border-[#a35443]">Edit profile</button>}
          </div>
          <section className="mt-8">
            <SectionEyebrow>Your space</SectionEyebrow>
            <Link href="/shelves" data-testid="link-profile-shelves" className="mt-4 flex max-w-[550px] items-center justify-between border-b border-[#e2dbcf] py-3 text-[12px] text-[#615b52] hover:text-[#8d4739]"><span>Open your shelves</span><ArrowUpRight size={15} /></Link>
            <Link href="/artists" data-testid="link-profile-artists" className="flex max-w-[550px] items-center justify-between border-b border-[#e2dbcf] py-3 text-[12px] text-[#615b52] hover:text-[#8d4739]"><span>Visit your artist boards</span><ArrowUpRight size={15} /></Link>
          </section>
        </div>
      </div>
      <div className="mt-16 max-w-[930px] border-t border-[#d9d1c4] pt-4"><SectionEyebrow>Small print</SectionEyebrow><p className="mt-2 text-[11px] leading-relaxed text-[#8b8378]">This is your quiet corner. No scores, no follower tallies — just the things you care to keep.</p></div>
    </div>
  );
}

function Platform() {
  const [path] = useLocation();
  const title = navItems.find((item) => item.href === path)?.label ?? 'Stillroom';
  return (
    <Shell path={path} title={title}>
      {path === '/' ? <HomePage /> :
        path === '/explore' ? <ExplorePage /> :
        path === '/artists' ? <ArtistsPage /> :
        path === '/shelves' ? <ShelvesPage /> :
        path === '/profile' ? <ProfilePage /> :
        <HomePage />}
    </Shell>
  );
}

function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Platform /></WouterRouter>;
}

export default App;
