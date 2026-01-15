import { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const normalizeNickname = (value) => (value || "").trim().toLowerCase();

export default function UserProfilePage({ publicEntries = [] }) {
  const { nickname } = useParams();
  const location = useLocation();
  const decodedNickname = decodeURIComponent(nickname || "");
  const authorId = location.state?.authorId;

  const entries = useMemo(() => {
    if (authorId) {
      return publicEntries.filter((entry) => entry.authorId === authorId);
    }
    const clean = normalizeNickname(decodedNickname);
    return publicEntries.filter(
      (entry) => normalizeNickname(entry.author || "") === clean
    );
  }, [authorId, decodedNickname, publicEntries]);

  const sortedEntries = useMemo(() => {
    return [...entries].sort(
      (a, b) =>
        new Date(b.publicAt || b.createdAt) -
        new Date(a.publicAt || a.createdAt)
    );
  }, [entries]);

  const displayName =
    entries[0]?.author || decodedNickname || entries[0]?.authorId;

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 animate-fade-in">
        <header className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Public Journal
          </p>
          <h1 className="font-serif text-4xl text-zinc-100 md:text-5xl">
            {displayName}
          </h1>
          <p className="text-base text-zinc-400 md:text-lg">
            {sortedEntries.length} public notes from this journal.
          </p>
          <Link
            to="/browse"
            className="text-xs uppercase tracking-[0.3em] text-zinc-400 transition hover:text-zinc-200"
          >
            Back to Browse
          </Link>
        </header>

        {sortedEntries.length === 0 ? (
          <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 text-center">
            <p className="text-sm text-zinc-500">
              No public notes available for this user.
            </p>
          </section>
        ) : (
          <section className="space-y-4">
            {sortedEntries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6"
              >
                <p className="mb-4 font-hand text-2xl text-zinc-100">
                  {entry.text}
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {new Date(entry.publicAt || entry.createdAt).toLocaleString()}
                </p>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
