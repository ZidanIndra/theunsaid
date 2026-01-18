import { useState } from "react";
import html2canvas from "html2canvas";
import { Camera, Globe, LogOut, Save, Settings } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const formatTimestamp = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleString();
};

export default function Dashboard({
  user,
  entries,
  onAddEntry,
  onUpdateEntryVisibility,
  onPublishAll,
  onLogout
}) {
  const { t } = useLanguage();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [sharingId, setSharingId] = useState(null);
  const [shareError, setShareError] = useState("");
  const [bulkStatus, setBulkStatus] = useState("");

  const handleSave = (event) => {
    event.preventDefault();
    const result = onAddEntry(text, isPublic);
    if (!result.ok) {
      setError(result.error);
      if (result.error === "error_restricted_words") {
        alert(t("restricted_words_alert"));
      }
      return;
    }
    setError("");
    setText("");
    setIsPublic(false);
  };

  const handleToggleVisibility = (entryId, nextValue) => {
    const result = onUpdateEntryVisibility(entryId, nextValue);
    if (!result.ok) {
      setShareError(result.error);
      return;
    }
    setShareError("");
  };

  const handlePublishAll = () => {
    const result = onPublishAll();
    if (!result.ok) {
      setBulkStatus(result.error);
      return;
    }
    setBulkStatus("publish_all_success");
  };

  const handleShare = async (entry) => {
    const snapshot = document.getElementById(`snapshot-${entry.id}`);
    if (!snapshot) {
      setShareError("share_error_template");
      return;
    }

    try {
      setShareError("");
      setSharingId(entry.id);
      const canvas = await html2canvas(snapshot, {
        scale: 2,
        backgroundColor: null,
        useCORS: true
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `theunsaid-${entry.id}.png`;
      link.click();
    } catch (captureError) {
      setShareError("share_error_generate");
    } finally {
      setSharingId(null);
    }
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 animate-fade-in">
        <header className="flex flex-col gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              {t("journal_kicker")}
            </p>
            <h2 className="font-serif text-3xl text-zinc-100">
              {t("journal_welcome", { id: user.id })}
            </h2>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 self-start rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            {t("journal_logout")}
          </button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
              <h3 className="mb-4 font-serif text-2xl text-zinc-100">
                {t("journal_write_title")}
              </h3>
              <form className="space-y-4" onSubmit={handleSave}>
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-base text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
                  placeholder={t("journal_textarea_placeholder")}
                />
                <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <Globe className="h-4 w-4 text-zinc-400" />
                    {t("journal_release_label")}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPublic((value) => !value)}
                    className={`relative h-6 w-11 rounded-full border transition ${
                      isPublic
                        ? "border-emerald-400/60 bg-emerald-400/20"
                        : "border-zinc-700 bg-zinc-900"
                    }`}
                    aria-pressed={isPublic}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-zinc-100 transition ${
                        isPublic ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
                {error ? (
                  <p className="text-sm text-rose-400">{t(error)}</p>
                ) : null}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white"
                >
                  <Save className="h-4 w-4" />
                  {t("journal_save_btn")}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
              <div className="mb-4 flex items-center gap-3 text-zinc-200">
                <Settings className="h-5 w-5" />
                <h3 className="font-serif text-2xl text-zinc-100">
                  {t("settings_title")}
                </h3>
              </div>
              <p className="mb-4 text-sm text-zinc-400">
                {t("settings_desc")}
              </p>
              {bulkStatus ? (
                <p className="mb-4 text-sm text-emerald-300">
                  {t(bulkStatus)}
                </p>
              ) : null}
              <button
                type="button"
                onClick={handlePublishAll}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:text-white"
              >
                {t("settings_publish_all")}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-2xl text-zinc-100">
                {t("timeline_title")}
              </h3>
              <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                {t("timeline_entries", { count: entries.length })}
              </span>
            </div>
            {shareError ? (
              <p className="mb-4 text-sm text-rose-400">{t(shareError)}</p>
            ) : null}
            <div className="space-y-4">
              {entries.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  {t("timeline_empty")}
                </p>
              ) : (
                entries.map((entry) => {
                  const entryIsPublic = entry.isPublic ?? entry.public;
                  return (
                    <div key={entry.id} className="space-y-3">
                      <article className="animate-fade-in rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs tracking-[0.2em] text-zinc-500">
                          {t("public_label")}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleVisibility(entry.id, !entryIsPublic)
                          }
                          className={`relative h-5 w-9 rounded-full border transition ${
                            entryIsPublic
                              ? "border-emerald-400/60 bg-emerald-400/20"
                              : "border-zinc-700 bg-zinc-900"
                          }`}
                          aria-pressed={entryIsPublic}
                        >
                          <span
                            className={`absolute top-0.5 h-4 w-4 rounded-full bg-zinc-100 transition ${
                              entryIsPublic ? "left-[18px]" : "left-0.5"
                            }`}
                          />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleShare(entry)}
                        disabled={sharingId === entry.id}
                        className="flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-200 transition hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Camera className="h-3.5 w-3.5" />
                        {sharingId === entry.id
                          ? t("share_rendering")
                          : t("share_button")}
                      </button>
                    </div>
                        <p className="mb-3 whitespace-pre-wrap text-sm text-zinc-200">
                          {entry.text}
                        </p>
                        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                          {formatTimestamp(entry.createdAt)}
                        </p>
                      </article>

                      <div
                        id={`snapshot-${entry.id}`}
                        className="fixed -left-[9999px] top-0 h-[820px] w-[820px]"
                        aria-hidden="true"
                      >
                        <div className="flex h-full flex-col rounded-[32px] border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-12 text-zinc-100 shadow-2xl">
                          <div className="flex flex-1 items-center justify-center">
                            <p className="max-w-[560px] whitespace-pre-wrap text-center font-serif text-3xl leading-relaxed text-zinc-100">
                              {entry.text}
                            </p>
                          </div>
                          <div className="mt-8 flex w-full items-center justify-between text-xs uppercase tracking-[0.35em] text-zinc-400">
                            <span>{user.id}</span>
                            <span>TheUnsaid.xyz</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
