import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Submit Note", to: "/submit" },
  { label: "Browse", to: "/browse" },
  { label: "Support", to: "/support" }
];

export default function NavBar() {
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
        </div>
      </div>
    </nav>
  );
}
