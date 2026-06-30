import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, BookOpen, CreditCard, Calendar } from "lucide-react";
import { LOGO } from "../assets_logo";

const navItems = [
  {
    section: "Mon espace",
    links: [
      { to: "/etudiant/dashboard",    label: "Mon tableau de bord", icon: <LayoutDashboard size={17} /> },
      { to: "/etudiant/mes-notes",    label: "Mes notes",           icon: <BookOpen size={17} />       },
      { to: "/etudiant/paiements",    label: "Mes paiements",       icon: <CreditCard size={17} />     },
      { to: "/etudiant/planning",     label: "Mon emploi du temps", icon: <Calendar size={17} />       },
    ]
  }
];

export default function EtudiantLayout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR ETUDIANT */}
      <aside className="fixed top-0 left-0 bottom-0 w-[248px] flex flex-col z-50 shadow-xl"
        style={{ background: "linear-gradient(180deg, #0c4a6e 0%, #0369a1 100%)" }}>

        {/* Logo */}
        <div className="px-6 py-7 border-b border-white/10" style={{ background: "rgba(0,0,0,0.15)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg bg-white overflow-hidden">
              <img src={LOGO} alt="DigiSchool" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-white font-serif text-xl font-bold">DigiSchool</p>
              <p className="text-sky-200 text-[10px]">Espace Etudiant</p>
            </div>
          </div>
        </div>

        {/* Profil etudiant */}
        <div className="mx-3 mt-4 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 border-2 border-white/20">
              {user.nom ? user.nom.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "KD"}
            </div>
            <div className="min-w-0">
              <p className="text-white text-[13px] font-bold truncate">{user.nom || "Khadija Diop"}</p>
              <p className="text-sky-200 text-[11px]">{user.matricule || "ETU-0042"}</p>
              <span className="inline-block bg-sky-400/30 text-sky-200 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5">
                Terminale L
              </span>
            </div>
          </div>
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
                      {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] bg-sky-300 rounded-r-full"/>}
                      <span className="opacity-85">{link.icon}</span>
                      <span className="flex-1">{link.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pt-4 pb-5 border-t border-white/10">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-red-300 hover:bg-red-500/15 hover:text-red-200 transition-all text-[13px] font-medium">
            <LogOut size={16} /> Se deconnecter
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 ml-[248px] flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 h-[66px] flex items-center gap-4 px-8 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-[17px] font-semibold text-gray-800">Espace Etudiant</h1>
            <p className="text-[12.5px] text-gray-400 mt-0.5">
              Bienvenue, <span className="text-sky-600 font-semibold">{user.nom || "Khadija Diop"}</span>
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-[12px] text-gray-400 bg-sky-50 border border-sky-100 rounded-lg px-3 py-1.5">
              📅 {new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}