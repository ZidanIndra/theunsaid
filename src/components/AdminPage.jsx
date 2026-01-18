import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const toSnippet = (text, max = 140) => {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
};

export default function AdminPage({
  entries = [],
  bannedWords = [],
  onAddBannedWord,
  onRemoveBannedWord,
  onDeleteEntry
}) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [bannedInput, setBannedInput] = useState("");
  const [bannedError, setBannedError] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const buttonMotion = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  };

  const filteredEntries = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return entries;
    return entries.filter((entry) => {
      const textMatch = (entry.text || "").toLowerCase().includes(trimmed);
      const authorMatch = (entry.author || "")
        .toLowerCase()
        .includes(trimmed);
      return textMatch || authorMatch;
    });
  }, [entries, query]);

  const handleAddWord = (event) => {
    event.preventDefault();
    const result = onAddBannedWord(bannedInput);
    if (!result.ok) {
      setBannedError(result.error);
      return;
    }
    setBannedError("");
    setBannedInput("");
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (password === "zidan990") {
      setIsAuthorized(true);
      setAuthError("");
      return;
    }
    setAuthError("admin_wrong_password");
  };

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <AnimatePresence mode="wait">
          {isAuthorized ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex w-full flex-col gap-8"
            >
              <header className="space-y-3 text-center">
                <h1 className="font-serif text-4xl text-zinc-100 md:text-5xl">
                  {t("admin_title")}
                </h1>
                <p className="mx-auto max-w-2xl text-base text-zinc-400 md:text-lg">
                  {t("admin_subtitle")}
                </p>
              </header>

              <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-serif text-2xl text-zinc-100">
                      {t("admin_results_title")}
                    </h3>
                    <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      {filteredEntries.length}
                    </span>
                  </div>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t("admin_search_placeholder")}
                    className="mb-4 w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                  />
                  <div className="space-y-3">
                    {filteredEntries.length === 0 ? (
                      <p className="text-sm text-zinc-500">
                        {t("admin_no_results")}
                      </p>
                    ) : (
                      filteredEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-4"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                              {entry.author}
                            </span>
                            <motion.button
                              type="button"
                              onClick={() => onDeleteEntry(entry.id)}
                              {...buttonMotion}
                              className="flex items-center gap-2 rounded-lg border border-rose-400/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-rose-200 transition hover:border-rose-300 hover:text-rose-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {t("admin_delete_btn")}
                            </motion.button>
                          </div>
                          <p className="text-sm text-zinc-200">
                            {toSnippet(entry.text)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
                  <h3 className="mb-3 font-serif text-2xl text-zinc-100">
                    {t("banned_title")}
                  </h3>
                  <p className="mb-4 text-sm text-zinc-400">
                    {t("banned_desc")}
                  </p>
                  <form className="space-y-3" onSubmit={handleAddWord}>
                    <input
                      value={bannedInput}
                      onChange={(event) => setBannedInput(event.target.value)}
                      placeholder={t("banned_placeholder")}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                    />
                    {bannedError ? (
                      <p className="text-sm text-rose-400">
                        {t(bannedError)}
                      </p>
                    ) : null}
                    <motion.button
                      type="submit"
                      {...buttonMotion}
                      className="flex w-full items-center justify-center rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:text-white"
                    >
                      {t("banned_add_btn")}
                    </motion.button>
                  </form>
                  <div className="mt-6 space-y-2">
                    {bannedWords.length === 0 ? (
                      <p className="text-sm text-zinc-500">
                        {t("banned_empty")}
                      </p>
                    ) : (
                      bannedWords.map((word) => (
                        <div
                          key={word}
                          className="flex items-center justify-between rounded-lg border border-zinc-800/70 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-200"
                        >
                          <span>{word}</span>
                          <motion.button
                            type="button"
                            onClick={() => onRemoveBannedWord(word)}
                            {...buttonMotion}
                            className="text-xs uppercase tracking-[0.2em] text-zinc-400 transition hover:text-zinc-200"
                          >
                            {t("banned_remove_btn")}
                          </motion.button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 text-center"
            >
              <h1 className="font-serif text-3xl text-zinc-100">
                {t("admin_login_title")}
              </h1>
              <p className="text-sm text-zinc-400">{t("admin_login_desc")}</p>
              <form className="space-y-4" onSubmit={handleLogin}>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t("admin_login_placeholder")}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                />
                {authError ? (
                  <p className="text-sm text-rose-400">{t(authError)}</p>
                ) : null}
                <motion.button
                  type="submit"
                  {...buttonMotion}
                  className="flex w-full items-center justify-center rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                >
                  {t("admin_login_button")}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
