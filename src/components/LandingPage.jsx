import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Eye, PenLine } from "lucide-react";

const toSnippet = (text, max = 120) => {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
};

export default function LandingPage({ publicEntries = [] }) {
  const marqueeEntries = useMemo(() => {
    if (!publicEntries.length) return [];
    const pool = [...publicEntries];
    pool.sort(() => 0.5 - Math.random());
    return pool.slice(0, Math.min(pool.length, 10));
  }, [publicEntries]);

  const marqueeLoop = useMemo(
    () => (marqueeEntries.length ? [...marqueeEntries, ...marqueeEntries] : []),
    [marqueeEntries]
  );

  return (
    <main className="min-h-screen px-6 py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-16 text-center animate-fade-in">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 text-zinc-400">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              The Unsaid
            </span>
          </div>
          <h1 className="mx-auto max-w-3xl font-serif text-4xl text-zinc-100 md:text-6xl">
            A bunch of the untold words, floating between you and the dark.
          </h1>
          <p className="mx-auto max-w-2xl text-base text-zinc-400 md:text-lg">
            Capture the notes you never sent, keep them safe, or release them to
            the public void.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/submit"
              className="flex items-center justify-center rounded-full bg-zinc-100 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white"
            >
              Tell Your Story
            </Link>
            <Link
              to="/browse"
              className="flex items-center justify-center rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:text-white"
            >
              Browse Stories
            </Link>
          </div>
        </div>

        <section className="grid w-full gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 text-left">
            <PenLine className="mb-4 h-5 w-5 text-zinc-200" />
            <h3 className="mb-2 font-serif text-xl text-zinc-100">
              Share your Messages
            </h3>
            <p className="text-sm text-zinc-400">
              Write for yourself or let the world read your most honest words.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 text-left">
            <Eye className="mb-4 h-5 w-5 text-zinc-200" />
            <h3 className="mb-2 font-serif text-xl text-zinc-100">
              Browse Messages
            </h3>
            <p className="text-sm text-zinc-400">
              Discover fragments from other journals drifting in the public
              void.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 text-left">
            <BookOpen className="mb-4 h-5 w-5 text-zinc-200" />
            <h3 className="mb-2 font-serif text-xl text-zinc-100">
              Detail Messages
            </h3>
            <p className="text-sm text-zinc-400">
              Keep timelines and snapshots to revisit when you need them.
            </p>
          </div>
        </section>

        <section className="w-full rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
          <div className="mb-4 flex items-center justify-between text-left">
            <span className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              The Public Void
            </span>
            <Link
              to="/browse"
              className="text-xs uppercase tracking-[0.25em] text-zinc-400 transition hover:text-zinc-200"
            >
              Browse
            </Link>
          </div>
          {marqueeLoop.length ? (
            <div className="overflow-hidden">
              <div className="flex w-max gap-4 animate-marquee">
                {marqueeLoop.map((entry, index) => (
                  <div
                    key={`${entry.id}-${index}`}
                    className="min-w-[240px] rounded-xl border border-zinc-800/60 bg-zinc-900/60 p-4 text-left"
                  >
                    <p className="mb-3 text-sm text-zinc-200">
                      {toSnippet(entry.text)}
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      {entry.author || entry.authorId?.split("#")[0]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-left text-sm text-zinc-500">
              The public void is quiet for now.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
