import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function NavBar() {
  const { language, toggleLanguage, t } = useLanguage();
  const navItems = [
    { label: t("nav_submit"), to: "/submit" },
    { label: t("nav_browse"), to: "/browse" },
    { label: t("nav_support"), to: "/support" }
  ];

  const buttonMotion = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  };

  return (
    <nav className="w-full border-b border-zinc-900/80 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="font-serif text-xl text-zinc-100">
          TheUnsaid.xyz
        </NavLink>
        <div className="flex items-center gap-6 text-sm text-zinc-400">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `tracking-[0.12em] transition ${
                  isActive ? "text-zinc-100" : "hover:text-zinc-200"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <motion.button
            type="button"
            onClick={toggleLanguage}
            {...buttonMotion}
            className="flex items-center gap-2 rounded-full border border-zinc-800 px-3 py-1 text-xs uppercase tracking-[0.3em] text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
            aria-label="Toggle language"
          >
            <span className={language === "id" ? "text-zinc-100" : ""}>
              {t("nav_lang_id")}
            </span>
            <span className="text-zinc-600">|</span>
            <span className={language === "en" ? "text-zinc-100" : ""}>
              {t("nav_lang_en")}
            </span>
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
