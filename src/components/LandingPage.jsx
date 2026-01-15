import { Link } from "react-router-dom";
import { BookOpen, Eye, PenLine } from "lucide-react";

export default function LandingPage() {
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
      </div>
    </main>
  );
}
