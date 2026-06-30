import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, BookOpen, ClipboardList, Calendar } from "lucide-react";
import { LOGO } from "../assets_logo";

const navItems = [
  {
    section: "Mon espace",
    links: [
      { to: "/enseignant/dashboard", label: "Tableau de bord", icon: <LayoutDashboard size={17} /> },
      { to: "/enseignant/mes-classes", label: "Mes classes",   icon: <BookOpen size={17} />       },
      { to: "/enseignant/mes-notes",   label: "Saisir notes",  icon: <ClipboardList size={17} />  },
      { to: "/enseignant/planning",    label: "Mon planning",  icon: <Calendar size={17} />       },
    ]
  }
];

export default function EnseignantLayout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR ENSEIGNANT */}
      <aside className="fixed top-0 left-0 bottom-0 w-[248px] flex flex-col z-50 shadow-xl"
        style={{ background: "linear-gradient(180deg, #312e81 0%, #3730a3 100%)" }}>

        {/* Logo */}
        <div className="px-6 py-7 border-b border-white/10" style={{ background: "rgba(0,0,0,0.12)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg bg-white overflow-hidden">
              <img src={LOGO} alt="DigiSchool" className="w-full h-full object-contain" />
            </div>
            <span className="text-white font-serif text-2xl font-bold">DigiSchool</span>
          </div>
          <p className="text-white/40 text-[10px] uppercase tracking-[2px] mt-1 pl-12">Espace Enseignant</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navItems.map((section) => (
            <div key={section.section} className="px-3 mt-5">
              <p className="text-white/35 text-[10px] uppercase tracking-[2px] px-2.5 mb-1.5">{section.section}</p>
              {section.links.map((link) => (
                <NavLink key={link.to} to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-2.5 py-2.5 rounded-xl mb-0.5 text-[13.5px] font-medium transition-all relative
                    ${isActive ? "bg-white/15 text-white ring-1 ring-white/10" : "text-white/60 hover:bg-white/8 hover:text-white"}`
                  }>
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] bg-indigo-300 rounded-r-full"/>}
                      <span className="opacity-85">{link.icon}</span>
                      <span className="flex-1">{link.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 pt-4 pb-5 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 border-white/20 bg-indigo-500">
              {user.nom ? user.nom.substring(0,2).toUpperCase() : "EN"}
            </div>
            <div>
              <p className="text-white text-[13px] font-semibold">{user.nom || "Enseignant"}</p>
              <p className="text-white/45 text-[11px]">{user.matiere || "Enseignant"}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-red-300 hover:bg-red-500/15 hover:text-red-200 transition-all text-[13px] font-medium">
            <LogOut size={16} /> Se deconnecter
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 ml-[248px] flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-40 h-[66px] flex items-center gap-4 px-8 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-[17px] font-semibold text-gray-800">Espace Enseignant</h1>
            <p className="text-[12.5px] text-gray-400 mt-0.5">
              Bienvenue, <span className="text-indigo-500 font-medium">{user.nom || "Enseignant"}</span>
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-[12px] text-gray-400 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1.5">
              📅 {new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}