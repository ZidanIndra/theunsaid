import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, PenLine } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function SubmitPage({
  onRegister,
  onLogin,
  registerError,
  loginError,
  keyCardUser,
  onProceed
}) {
  const { t } = useLanguage();
  const buttonMotion = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  };
  const [newNickname, setNewNickname] = useState("");
  const [loginNickname, setLoginNickname] = useState("");
  const [loginHash, setLoginHash] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();
    onRegister(newNickname);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    onLogin(loginNickname, loginHash);
  };

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 animate-fade-in">
        <header className="space-y-3 text-center">
          <h1 className="font-serif text-4xl text-zinc-100 md:text-5xl">
            {t("submit_title")}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-zinc-400 md:text-lg">
            {t("submit_subtitle")}
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-2xl shadow-black/30">
            <div className="mb-4 flex items-center gap-3 text-zinc-200">
              <PenLine className="h-5 w-5" />
              <h2 className="font-serif text-2xl">{t("submit_new_title")}</h2>
            </div>
            <p className="mb-6 text-sm text-zinc-400">
              {t("submit_new_desc")}
            </p>
            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {t("label_nickname")}
                </label>
                <input
                  value={newNickname}
                  onChange={(event) => setNewNickname(event.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                  placeholder={t("placeholder_nickname")}
                />
              </div>
              {registerError ? (
                <p className="text-sm text-rose-400">
                  {t(registerError)}
                </p>
              ) : null}
              <motion.button
                type="submit"
                {...buttonMotion}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white"
              >
                {t("submit_create_btn")}
              </motion.button>
            </form>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-2xl shadow-black/30">
            <div className="mb-4 flex items-center gap-3 text-zinc-200">
              <KeyRound className="h-5 w-5" />
              <h2 className="font-serif text-2xl">{t("submit_open_title")}</h2>
            </div>
            <p className="mb-6 text-sm text-zinc-400">
              {t("submit_open_desc")}
            </p>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {t("label_nickname")}
                </label>
                <input
                  value={loginNickname}
                  onChange={(event) => setLoginNickname(event.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                  placeholder={t("placeholder_nickname")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {t("label_hash")}
                </label>
                <input
                  value={loginHash}
                  onChange={(event) => setLoginHash(event.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-base text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                  placeholder={t("placeholder_hash")}
                />
              </div>
              {loginError ? (
                <p className="text-sm text-rose-400">{t(loginError)}</p>
              ) : null}
              <motion.button
                type="submit"
                {...buttonMotion}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-transparent px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:text-white"
              >
                {t("submit_login_btn")}
              </motion.button>
            </form>
          </div>
        </section>
      </div>

      {keyCardUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-md animate-fade-in rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/40">
            <div className="mb-4 flex items-center gap-3 text-zinc-200">
              <KeyRound className="h-5 w-5" />
              <h3 className="font-serif text-2xl">{t("keycard_title")}</h3>
            </div>
            <p className="text-sm text-zinc-400">{t("keycard_desc")}</p>
            <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-center font-mono text-lg text-zinc-100">
              {keyCardUser.id}
            </div>
            <motion.button
              type="button"
              onClick={onProceed}
              {...buttonMotion}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white"
            >
              {t("keycard_proceed")}
            </motion.button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
