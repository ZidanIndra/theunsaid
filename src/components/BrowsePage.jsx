import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const INITIAL_USER_BATCH = 6;
const USER_BATCH_SIZE = 4;

const normalizeNickname = (value) => (value || "").trim().toLowerCase();

const getNicknameFromId = (authorId) => {
  if (!authorId) return "Unknown";
  return authorId.split("#")[0] || authorId;
};

export default function BrowsePage({ publicEntries = [] }) {
  const [query, setQuery] = useState("");
  const [visibleUsers, setVisibleUsers] = useState(INITIAL_USER_BATCH);
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

  const userCards = useMemo(() => {
    const map = new Map();
    filteredEntries.forEach((entry) => {
      const authorId = entry.authorId || entry.author || "unknown";
      const nickname =
        entry.author || getNicknameFromId(entry.authorId || entry.author);
      const existing = map.get(authorId);
      if (!existing) {
        map.set(authorId, {
          id: authorId,
          nickname,
          latestEntry: entry,
          entries: [entry]
        });
        return;
      }
      existing.entries.push(entry);
      const existingDate =
        existing.latestEntry.publicAt || existing.latestEntry.createdAt;
      const nextDate = entry.publicAt || entry.createdAt;
      if (new Date(nextDate) > new Date(existingDate)) {
        existing.latestEntry = entry;
      }
    });

    const cards = Array.from(map.values()).map((card) => {
      const sortedEntries = [...card.entries].sort(
        (a, b) =>
          new Date(a.publicAt || a.createdAt) -
          new Date(b.publicAt || b.createdAt)
      );
      return {
        ...card,
        entriesSorted: sortedEntries
      };
    });
    return cards.sort((a, b) => {
      const aDate = a.latestEntry.publicAt || a.latestEntry.createdAt;
      const bDate = b.latestEntry.publicAt || b.latestEntry.createdAt;
      return new Date(bDate) - new Date(aDate);
    });
  }, [filteredEntries]);

  const visibleCards = useMemo(
    () => userCards.slice(0, visibleUsers),
    [userCards, visibleUsers]
  );

  const loadMore = useCallback(() => {
    setVisibleUsers((prev) => {
      if (prev >= userCards.length) return prev;
      return Math.min(prev + USER_BATCH_SIZE, userCards.length);
    });
  }, [userCards.length]);

  useEffect(() => {
    setVisibleUsers(INITIAL_USER_BATCH);
  }, [userCards.length, query]);

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

        {visibleCards.length === 0 ? (
          <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
            <p className="text-sm text-zinc-500">
              No public notes matched your search.
            </p>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleCards.map((card) => (
              <Link
                key={card.id}
                to={`/user/${encodeURIComponent(card.nickname)}`}
                state={{ authorId: card.id }}
                className="group flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-zinc-600"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-zinc-200/10 px-3 py-1 text-xs text-zinc-300">
                  From: {card.nickname}
                </span>
                <div className="flex flex-col gap-3">
                  {card.entriesSorted.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3"
                    >
                      <p className="text-sm font-serif leading-relaxed text-zinc-100">
                        {entry.text}
                      </p>
                      <p className="mt-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
                        {new Date(
                          entry.publicAt || entry.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-black/40 px-3 py-2 text-xs uppercase tracking-[0.3em] text-zinc-400">
                  Read Full Story
                </div>
              </Link>
            ))}
          </section>
        )}

        <div ref={sentinelRef} className="flex justify-center">
          {visibleUsers < userCards.length ? (
            <button
              type="button"
              onClick={loadMore}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-xs uppercase tracking-[0.3em] text-zinc-200 transition hover:border-zinc-500 hover:text-white"
            >
              Load More
            </button>
          ) : null}
        </div>
      </div>
    </main>
  );
}
