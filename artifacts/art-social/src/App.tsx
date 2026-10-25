import { type ReactNode, useMemo, useState } from 'react';
import { Link, Router as WouterRouter, useLocation } from 'wouter';
import {
  ArrowDownRight, ArrowUpRight, Bookmark, Check, ChevronDown, Compass, Film,
  Headphones, Image, Layers3, MoreHorizontal, Search, Sparkles, UserRound,
  X,
} from 'lucide-react';

type PostData = {
  id: string;
  artist: string;
  initials: string;
  discipline: string;
  time: string;
  title: string;
  body: string;
  art: string;
  artLabel: string;
  byline: string;
  repost?: string;
};

const posts: PostData[] = [
  {
    id: 'sunday-record',
    artist: 'Solange',
    initials: 'S',
    discipline: 'MUSIC · LISTENING ROOM',
    time: '2 hours ago',
    title: 'A record for the long way home',
    body: 'The last light on the windowsill, this on repeat. What are you listening to when the day starts to fold?',
    art: 'artwork-vinyl',
    artLabel: 'A hand-printed abstract record sleeve in rust, forest green, and cream',
    byline: 'note from a listening room',
  },
  {
    id: 'still-between',
    artist: 'Greta Lee',
    initials: 'GL',
    discipline: 'FILM · FRAME STUDY',
    time: '5 hours ago',
    title: 'The quiet between scenes',
    body: 'A little collection of frames that stay with you after the credits. Shared by someone who notices the light.',
    art: 'artwork-film',
    artLabel: 'Muted cinema still with an ochre dusk sky and green silhouettes',
    byline: 'a frame study',
    repost: 'Reposted by Mina K.',
  },
  {
    id: 'garden-notes',
    artist: 'Maya Okafor',
    initials: 'MO',
    discipline: 'PAINTING · STUDIO NOTES',
    time: 'Yesterday',
    title: 'Studies for a garden that never existed',
    body: 'A few marks from the middle of a painting. I like the part where it is still becoming something.',
    art: 'artwork-paint',
    artLabel: 'Abstract painting study in soft vermilion, ochre, green, and paper',
    byline: 'from the studio',
  },
  {
    id: 'blue-hour',
    artist: 'Arielle Bobb-Willis',
    initials: 'AB',
    discipline: 'PHOTOGRAPHY · CONTACT SHEET',
    time: 'Yesterday',
    title: 'Blue hour, block by block',
    body: 'Walking until the streetlights come on. The city has its own way of sitting still.',
    art: 'artwork-photo',
    artLabel: 'A layered, atmospheric street photograph in soft sage tones',
    byline: 'field notes',
  },
];

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
          <Link href="/profile" aria-label="Open your profile" data-testid="link-account" className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#d9c9b0] font-serif text-[12px] text-[#59493d]">E</Link>
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

function Avatar({ initials, tone = 'sage' }: { initials: string; tone?: string }) {
  const tones: Record<string, string> = { sage: 'bg-[#dbe1d6] text-[#536254]', rose: 'bg-[#ead6cb] text-[#825648]', ochre: 'bg-[#e8d8b7] text-[#76603d]', blue: 'bg-[#d9e1df] text-[#4c6764]' };
  return <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-serif text-[12px] ${tones[tone] || tones.sage}`}>{initials}</span>;
}

function Artwork({ post, tall = false }: { post: PostData; tall?: boolean }) {
  return (
    <div role="img" aria-label={post.artLabel} data-testid={`artwork-${post.id}`} className={`artwork ${post.art} ${tall ? 'h-[250px] sm:h-[310px]' : 'h-[210px] sm:h-[268px]'} w-full`}>
      <span className="absolute bottom-3 left-3 z-[1] mono bg-[#f7f4ed]/80 px-2 py-1 text-[8px] uppercase tracking-[.16em] text-[#554c41]">{post.byline}</span>
    </div>
  );
}

function PostCard({ post, saved, onSave, onRepost }: { post: PostData; saved: boolean; onSave: () => void; onRepost: () => void }) {
  const [notice, setNotice] = useState('');
  const handleRepost = () => {
    onRepost();
    setNotice('Repost noted for this preview.');
    window.setTimeout(() => setNotice(''), 2400);
  };
  return (
    <article className="border-b border-[#e2dbcf] pb-7 pt-6 first:pt-0" data-testid={`card-post-${post.id}`}>
      {post.repost && <p className="mb-3 flex items-center gap-2 pl-1 text-[11px] text-[#898173]"><ArrowUpRight size={13} />{post.repost}</p>}
      <div className="mb-4 flex items-center gap-3">
        <Avatar initials={post.initials} tone={post.id === 'garden-notes' ? 'rose' : post.id === 'blue-hour' ? 'blue' : 'sage'} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-[13px] font-semibold">{post.artist}</span>
            <span className="mono text-[8px] uppercase tracking-[.12em] text-[#9a9184]">{post.discipline}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#908779]">{post.time}</p>
        </div>
        <span aria-hidden="true" className="rounded-full p-2 text-[#827a6e]"><MoreHorizontal size={18} /></span>
      </div>
      <Artwork post={post} />
      <div className="flex items-start justify-between gap-4 pt-4">
        <div>
          <h2 className="serif text-[21px] leading-tight tracking-[-.025em] sm:text-[24px]">{post.title}</h2>
          <p className="mt-2 max-w-[540px] text-[13px] leading-[1.7] text-[#6e685e]">{post.body}</p>
        </div>
        <button
          onClick={onSave}
          aria-label={saved ? `Remove ${post.title} from shelf` : `Save ${post.title} to shelf`}
          aria-pressed={saved}
          data-testid={`button-save-${post.id}`}
          className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${saved ? 'border-[#a35443] bg-[#a35443] text-[#fffaf1]' : 'border-[#d9d1c4] text-[#756d61] hover:border-[#a35443] hover:text-[#8d4739]'}`}
        >
          {saved ? <Check size={16} /> : <Bookmark size={16} strokeWidth={1.7} />}
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button onClick={handleRepost} data-testid={`button-repost-${post.id}`} className="flex items-center gap-1.5 text-[11px] text-[#81796e] transition-colors hover:text-[#8d4739]">
          <ArrowUpRight size={14} /> Repost
        </button>
        <span aria-live="polite" className="text-[10px] text-[#718071]">{saved ? 'Saved to your shelf' : notice}</span>
      </div>
    </article>
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
        <footer className="mono text-[9px] leading-[1.9] tracking-[.11em] text-[#9a9184]">ABOUT · GUIDELINES · NOTES<br />STILLROOM, 2025</footer>
      </div>
    </aside>
  );
}

function HomePage({ saved, onSave, onRepost }: { saved: string[]; onSave: (id: string) => void; onRepost: (id: string) => void }) {
  const [tab, setTab] = useState<'For You' | 'My Artists'>('For You');
  const visiblePosts = tab === 'For You' ? posts : posts.filter((post) => ['Solange', 'Greta Lee'].includes(post.artist));
  return (
    <div className="page-enter">
      <div className="mb-8 flex flex-col justify-between gap-5 border-b border-[#d9d1c4] pb-7 sm:flex-row sm:items-end">
        <div>
          <SectionEyebrow>Tuesday, September 24 · your daily edit</SectionEyebrow>
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
          {visiblePosts.map((post) => <PostCard key={post.id} post={post} saved={saved.includes(post.id)} onSave={() => onSave(post.id)} onRepost={() => onRepost(post.id)} />)}
          <p className="py-8 text-center mono text-[9px] uppercase tracking-[.16em] text-[#9a9184]">You’re all caught up for now</p>
        </section>
        <SidebarNote />
      </div>
    </div>
  );
}

const discovery: Array<{ title: string; kind: string; description: string; art: string; icon: typeof Headphones }> = [
  { title: 'Listening rooms', kind: 'MUSIC', description: 'Albums, liner notes, and the songs that find their way back.', art: 'artwork-vinyl', icon: Headphones },
  { title: 'Frame studies', kind: 'FILM', description: 'Scenes, stills, and conversations that happen after the credits.', art: 'artwork-film', icon: Film },
  { title: 'On the wall', kind: 'PAINTING', description: 'Studio visits, unfinished canvases, and small discoveries.', art: 'artwork-paint', icon: Image },
  { title: 'Out in the world', kind: 'PHOTOGRAPHY', description: 'A view, a walk, a moment worth holding on to.', art: 'artwork-photo', icon: Image },
  { title: 'Things we wear', kind: 'FASHION', description: 'Personal style, thoughtful making, and garments with a past.', art: 'artwork-fashion', icon: Layers3 },
  { title: 'Words & sound', kind: 'CULTURE', description: 'Poetry, writing, and the spaces where disciplines meet.', art: 'artwork-type', icon: Headphones },
];

function ExplorePage() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => discovery.filter((item) => `${item.title} ${item.kind} ${item.description}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <div className="page-enter">
      <SectionEyebrow>Take the scenic route</SectionEyebrow>
      <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><h1 className="serif text-[42px] leading-tight tracking-[-.04em] sm:text-[50px]">A world of <i>work.</i></h1><p className="mt-2 text-[13px] text-[#766f64]">Follow a thread. See where it takes you.</p></div>
        <label className="flex h-10 w-full items-center gap-2 border-b border-[#cfc6b7] sm:w-[260px]">
          <Search size={15} className="text-[#948a7c]" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search disciplines" data-testid="input-explore-search" placeholder="Find a discipline…" className="w-full bg-transparent text-[12px] outline-none placeholder:text-[#a49a8c]" />
        </label>
      </div>
      <div className="mt-9 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <Link key={item.title} href="/artists" data-testid={`card-explore-${item.kind.toLowerCase()}`} className="group">
            <div className={`artwork ${item.art} h-[210px] sm:h-[225px]`} aria-hidden="true"><span className="absolute bottom-3 left-3 z-[1] mono bg-[#f7f4ed]/80 px-2 py-1 text-[8px] tracking-[.16em]">{item.kind}</span></div>
            <div className="flex items-start justify-between pt-3">
              <div><h2 className="serif text-[23px]">{item.title}</h2><p className="mt-1 max-w-[310px] text-[12px] leading-relaxed text-[#766f64]">{item.description}</p></div>
              <ArrowDownRight size={17} className="mt-2 text-[#a35443] transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && <div className="mt-12 border-y border-[#e2dbcf] py-12 text-center"><p className="serif text-[24px]">Nothing along that path just yet.</p><p className="mt-2 text-[12px] text-[#766f64]">Try another word or browse all disciplines.</p></div>}
    </div>
  );
}

const artistRows = [
  { name: 'Solange', kind: 'MUSIC · LISTENING ROOM', initials: 'S', note: 'A new listening note from the room', tone: 'sage' },
  { name: 'Greta Lee', kind: 'FILM · FRAME STUDY', initials: 'GL', note: 'A frame study was added to the board', tone: 'ochre' },
  { name: 'Maya Okafor', kind: 'PAINTING · STUDIO NOTES', initials: 'MO', note: 'From the studio, this morning', tone: 'rose' },
  { name: 'Arielle Bobb-Willis', kind: 'PHOTOGRAPHY · FIELD NOTES', initials: 'AB', note: 'A new contact sheet from the city', tone: 'blue' },
];

function ArtistsPage() {
  const [followed, setFollowed] = useState<string[]>(['Solange', 'Maya Okafor']);
  return (
    <div className="page-enter">
      <SectionEyebrow>Boards you’ve found</SectionEyebrow>
      <div className="mt-2 flex flex-col justify-between gap-3 border-b border-[#d9d1c4] pb-7 sm:flex-row sm:items-end">
        <div><h1 className="serif text-[42px] tracking-[-.04em] sm:text-[50px]">My <i>artists.</i></h1><p className="mt-2 text-[13px] text-[#766f64]">Fan-run rooms for the work we love.</p></div>
        <Link href="/explore" className="flex items-center gap-1.5 pb-1 text-[12px] text-[#8b493c] hover:text-[#633328]" data-testid="link-find-artists">Find more artists <ArrowUpRight size={14} /></Link>
      </div>
      <div className="mt-4 max-w-[790px]">
        {artistRows.map((artist, index) => (
          <article key={artist.name} className="flex flex-col gap-4 border-b border-[#e2dbcf] py-5 sm:flex-row sm:items-center" data-testid={`row-artist-${index}`}>
            <Avatar initials={artist.initials} tone={artist.tone} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3"><h2 className="serif text-[21px]">{artist.name}</h2><span className="mono text-[8px] tracking-[.13em] text-[#948a7c]">{artist.kind}</span></div>
              <p className="mt-1 text-[12px] text-[#766f64]">{artist.note}</p>
            </div>
            <button onClick={() => setFollowed((prev) => prev.includes(artist.name) ? prev.filter((name) => name !== artist.name) : [...prev, artist.name])} aria-pressed={followed.includes(artist.name)} data-testid={`button-follow-${index}`} className={`flex h-9 items-center justify-center gap-2 self-start rounded-full border px-4 text-[11px] sm:self-auto ${followed.includes(artist.name) ? 'border-[#bcb2a2] text-[#635d54] hover:border-[#a35443] hover:text-[#8d4739]' : 'border-[#a35443] bg-[#a35443] text-[#fffaf1] hover:bg-[#843d31]'}`}>
              {followed.includes(artist.name) ? <><Check size={13} /> Following</> : 'Follow board'}
            </button>
          </article>
        ))}
      </div>
      <div className="mt-9 max-w-[790px] border-l-2 border-[#c99674] bg-[#f0ece3] px-5 py-4">
        <SectionEyebrow>A note on artist boards</SectionEyebrow>
        <p className="serif mt-2 text-[18px] leading-snug">Only fans post here. Artists make the work; the community makes the room.</p>
        <p className="mt-2 text-[11px] leading-relaxed text-[#766f64]">Reposts are welcome. Keep it generous, give context, and make room for the work to speak.</p>
      </div>
    </div>
  );
}

function ShelvesPage({ saved, onSave }: { saved: string[]; onSave: (id: string) => void }) {
  const [active, setActive] = useState('All saved');
  const savedPosts = posts.filter((post) => saved.includes(post.id));
  return (
    <div className="page-enter">
      <SectionEyebrow>Collected, not catalogued</SectionEyebrow>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4 border-b border-[#d9d1c4] pb-7">
        <div><h1 className="serif text-[42px] tracking-[-.04em] sm:text-[50px]">Your <i>shelves.</i></h1><p className="mt-2 text-[13px] text-[#766f64]">A home for the things you want to find again.</p></div>
        <button onClick={() => setActive(active === 'All saved' ? 'Unsorted' : 'All saved')} data-testid="button-shelf-filter" className="flex items-center gap-2 border-b border-[#bdb3a3] pb-1 text-[11px] text-[#6f685e]">{active}<ChevronDown size={13} /></button>
      </div>
      <div className="mt-7 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9dfcc] text-[#856d4b]"><Bookmark size={19} /></div><div><h2 className="serif text-[20px]">All saved</h2><p className="text-[11px] text-[#8b8378]">{savedPosts.length} {savedPosts.length === 1 ? 'piece' : 'pieces'} tucked away</p></div></div>
      {savedPosts.length ? (
        <div className="mt-7 grid max-w-[970px] grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {savedPosts.map((post) => <article key={post.id} className="group" data-testid={`card-saved-${post.id}`}><Artwork post={post} tall /><div className="flex items-start justify-between pt-3"><div><SectionEyebrow>{post.discipline}</SectionEyebrow><h3 className="serif mt-1 text-[20px]">{post.title}</h3><p className="mt-1 text-[11px] text-[#80786d]">{post.artist}</p></div><button onClick={() => onSave(post.id)} aria-label={`Remove ${post.title} from shelf`} data-testid={`button-unsave-${post.id}`} className="rounded-full p-2 text-[#8c483b] hover:bg-[#eee8dc]"><X size={15} /></button></div></article>)}
        </div>
      ) : (
        <div className="mt-8 flex min-h-[280px] max-w-[970px] flex-col items-center justify-center border border-dashed border-[#d5ccbd] bg-[#f4f0e8] px-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#d5ccbd] text-[#8f7964]"><Bookmark size={19} /></div>
          <h2 className="serif text-[25px]">Nothing on this shelf. Yet.</h2>
          <p className="mt-2 max-w-[340px] text-[12px] leading-relaxed text-[#766f64]">When something catches your eye, save it. It’ll be waiting here when you want another look.</p>
          <Link href="/" data-testid="link-browse-feed" className="mt-5 border-b border-[#a35443] pb-1 text-[11px] text-[#8d4739]">Wander back to the feed <ArrowUpRight className="ml-1 inline" size={12} /></Link>
        </div>
      )}
    </div>
  );
}

function ProfilePage({ savedCount }: { savedCount: number }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('Elena Park');
  const [draft, setDraft] = useState(name);
  return (
    <div className="page-enter">
      <SectionEyebrow>A little about you</SectionEyebrow>
      <div className="mt-4 grid max-w-[930px] grid-cols-1 gap-10 border-t border-[#d9d1c4] pt-8 md:grid-cols-[240px_1fr] md:gap-16">
        <div>
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#d8dfd5] font-serif text-[34px] text-[#526253]">E</div>
          <p className="mono mt-5 text-[9px] uppercase tracking-[.16em] text-[#978e81]">Member since spring ’24</p>
        </div>
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>{editing ? <label className="block"><span className="sr-only">Display name</span><input value={draft} onChange={(event) => setDraft(event.target.value)} autoFocus data-testid="input-profile-name" className="w-full max-w-[320px] border-b border-[#a35443] bg-transparent pb-2 font-serif text-[34px] outline-none" /></label> : <h1 className="serif text-[42px] tracking-[-.04em]">{name}</h1>}
              <p className="mt-2 max-w-[500px] text-[13px] leading-relaxed text-[#766f64]">Collecting frames, listening too closely, and always looking for the light.</p>
            </div>
            {editing ? <div className="flex gap-2"><button onClick={() => { setName(draft.trim() || name); setEditing(false); }} data-testid="button-save-profile" className="rounded-full bg-[#a35443] px-4 py-2 text-[11px] text-[#fffaf1]">Save</button><button onClick={() => { setDraft(name); setEditing(false); }} data-testid="button-cancel-profile" className="rounded-full border border-[#d9d1c4] px-4 py-2 text-[11px]">Cancel</button></div> : <button onClick={() => setEditing(true)} data-testid="button-edit-profile" className="rounded-full border border-[#cfc6b7] px-4 py-2 text-[11px] text-[#6e685e] hover:border-[#a35443]">Edit profile</button>}
          </div>
          <div className="mt-8 grid max-w-[450px] grid-cols-2 border-y border-[#d9d1c4] py-4">
            <div><SectionEyebrow>Boards collected</SectionEyebrow><p className="serif mt-1 text-[23px]">04</p></div>
            <div><SectionEyebrow>On your shelves</SectionEyebrow><p className="serif mt-1 text-[23px]">{String(savedCount).padStart(2, '0')}</p></div>
          </div>
          <section className="mt-8">
            <SectionEyebrow>Recent keepsakes</SectionEyebrow>
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
  const [saved, setSaved] = useState<string[]>(['still-between']);
  const [reposts, setReposts] = useState<string[]>([]);
  const toggleSaved = (id: string) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const title = navItems.find((item) => item.href === path)?.label ?? 'Stillroom';
  return (
    <Shell path={path} title={title}>
      {path === '/' ? <HomePage saved={saved} onSave={toggleSaved} onRepost={(id) => setReposts((current) => current.includes(id) ? current : [...current, id])} /> :
        path === '/explore' ? <ExplorePage /> :
        path === '/artists' ? <ArtistsPage /> :
        path === '/shelves' ? <ShelvesPage saved={saved} onSave={toggleSaved} /> :
        path === '/profile' ? <ProfilePage savedCount={saved.length} /> :
        <HomePage saved={saved} onSave={toggleSaved} onRepost={(id) => setReposts((current) => current.includes(id) ? current : [...current, id])} />}
      <span className="sr-only" aria-live="polite" data-testid="status-reposts">{reposts.length ? `${reposts.length} repost${reposts.length === 1 ? '' : 's'} noted locally` : ''}</span>
    </Shell>
  );
}

function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Platform /></WouterRouter>;
}

export default App;
