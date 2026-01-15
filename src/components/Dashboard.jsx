import { useState } from "react";
import { LogOut, Save } from "lucide-react";

const formatTimestamp = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleString();
};

export default function Dashboard({ user, entries, onAddEntry, onLogout }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSave = (event) => {
    event.preventDefault();
    const result = onAddEntry(text);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");
    setText("");
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 animate-fade-in">
        <header className="flex flex-col gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              The Journal
            </p>
            <h2 className="font-serif text-3xl text-zinc-100">
              Welcome back, {user.id}
            </h2>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 self-start rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
            <h3 className="mb-4 font-serif text-2xl text-zinc-100">
              Write to the vault
            </h3>
            <form className="space-y-4" onSubmit={handleSave}>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                rows={6}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-base text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                placeholder="Let the unsaid spill here..."
              />
              {error ? <p className="text-sm text-rose-400">{error}</p> : null}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white"
              >
                <Save className="h-4 w-4" />
                Save to Vault
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-2xl text-zinc-100">Timeline</h3>
              <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                {entries.length} entries
              </span>
            </div>
            <div className="space-y-4">
              {entries.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  The vault is empty. Write the first line.
                </p>
              ) : (
                entries.map((entry) => (
                  <article
                    key={entry.id}
                    className="animate-fade-in rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4"
                  >
                    <p className="mb-3 whitespace-pre-wrap text-sm text-zinc-200">
                      {entry.text}
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      {formatTimestamp(entry.createdAt)}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
