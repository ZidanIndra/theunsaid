export default function SupportPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center animate-fade-in">
        <h1 className="font-serif text-4xl text-zinc-100 md:text-5xl">
          Support the developer.
        </h1>
        <p className="text-base text-zinc-400 md:text-lg">
          Your support keeps TheUnsaid.xyz alive and growing.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#"
            className="flex items-center justify-center rounded-full bg-zinc-100 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white"
          >
            Saweria
          </a>
          <a
            href="#"
            className="flex items-center justify-center rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:text-white"
          >
            GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
