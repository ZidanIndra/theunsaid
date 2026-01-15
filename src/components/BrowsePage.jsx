import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

const toSnippet = (text, max = 140) => {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
};

const formatTimestamp = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleString();
};

const normalizeNickname = (value) => value.trim().toLowerCase();

export default function BrowsePage({ publicEntries = [] }) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const sentinelRef = useRef(null);

  const filteredEntries = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return publicEntries;

    if (trimmed.includes("#")) {
      const [namePart, hashPart] = trimmed.split("#");
      const cleanName = normalizeNickname(namePart || "");
      const cleanHash = (hashPart || "").replace(/[^0-9]/g, "");
      if (!cleanName || cleanHash.length !== 4) return [];
      const targetId = `${cleanName}#${cleanHash}`;
      return publicEntries.filter(
        (entry) => entry.authorId?.toLowerCase() === targetId
      );
    }

    const cleanNickname = normalizeNickname(trimmed);
    return publicEntries.filter(
      (entry) => normalizeNickname(entry.author || "") === cleanNickname
    );
  }, [publicEntries, query]);

  const visibleEntries = useMemo(
    () => filteredEntries.slice(0, visibleCount),
    [filteredEntries, visibleCount]
  );

  const marqueeEntries = useMemo(() => {
    if (!filteredEntries.length) return [];
    const pool = [...filteredEntries];
    pool.sort(() => 0.5 - Math.random());
    return pool.slice(0, Math.min(pool.length, 10));
  }, [filteredEntries]);

  const marqueeLoop = useMemo(
    () => (marqueeEntries.length ? [...marqueeEntries, ...marqueeEntries] : []),
    [marqueeEntries]
  );

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => {
      if (prev >= filteredEntries.length) return prev;
      return Math.min(prev + 10, filteredEntries.length);
    });
  }, [filteredEntries.length]);

  useEffect(() => {
    setVisibleCount(10);
  }, [filteredEntries.length, query]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "240px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  const headerLabel = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return "The Public Void";
    if (trimmed.includes("#")) return `Public notes for ${trimmed}`;
    return `Public notes by ${trimmed}`;
  }, [query]);

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 animate-fade-in">
        <header className="space-y-3 text-center">
          <h1 className="font-serif text-4xl text-zinc-100 md:text-5xl">
            {headerLabel}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-zinc-400 md:text-lg">
            Search by nickname or a full nickname#hash to reveal their public
            notes.
          </p>
          <div className="mx-auto flex w-full max-w-xl items-center gap-3 rounded-full border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-300">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by nickname or nickname#hash"
              className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
            />
          </div>
        </header>

        <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5">
          <p className="mb-4 text-sm text-zinc-400">
            Released fragments from other journals. Read softly.
          </p>
          {marqueeLoop.length ? (
            <div className="overflow-hidden">
              <div className="flex w-max gap-4 animate-marquee">
                {marqueeLoop.map((entry, index) => (
                  <div
                    key={`${entry.id}-${index}`}
                    className="min-w-[260px] rounded-xl border border-zinc-800/60 bg-zinc-900/60 p-4"
                  >
                    <p className="mb-3 text-sm text-zinc-200">
                      {toSnippet(entry.text, 120)}
                    </p>
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-zinc-500">
                      <span>{entry.authorId}</span>
                      <span>Public</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              The public void is quiet for now.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-2xl text-zinc-100">
              Public Notes
            </h3>
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              {filteredEntries.length} found
            </span>
          </div>
          {visibleEntries.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No public notes matched your search.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleEntries.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4"
                >
                  <p className="mb-4 text-sm text-zinc-200">
                    {toSnippet(entry.text)}
                  </p>
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-zinc-500">
                    <span>{entry.authorId}</span>
                    <span>{formatTimestamp(entry.publicAt || entry.createdAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div ref={sentinelRef} className="mt-6 flex justify-center">
            {visibleCount < filteredEntries.length ? (
              <button
                type="button"
                onClick={loadMore}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-xs uppercase tracking-[0.3em] text-zinc-200 transition hover:border-zinc-500 hover:text-white"
              >
                Load More
              </button>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
