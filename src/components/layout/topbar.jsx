import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, MessageSquare, User, LogOut, CheckCircle, Clock } from "lucide-react";
import { paiementAPI } from "../../services/api";

const pageTitles = {
  "/":                 { title: "Tableau de bord",    sub: "Vue d'ensemble" },
  "/etudiants":        { title: "Étudiants",           sub: "Gestion des étudiants" },
  "/enseignants":      { title: "Enseignants",         sub: "Gestion des enseignants" },
  "/classes":          { title: "Classes",             sub: "Gestion des classes" },
  "/notes":            { title: "Notes",               sub: "Notes & Évaluations" },
  "/emploi-du-temps":  { title: "Emploi du temps",    sub: "Planning hebdomadaire" },
  "/paiements":        { title: "Paiements",           sub: "Gestion des paiements" },
};

const initialesDe = (nom) =>
  nom ? nom.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "AD";

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const page = pageTitles[location.pathname] || { title: "DigiSchool", sub: "" };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [openNotif, setOpenNotif]     = useState(false);
  const [openProfil, setOpenProfil]   = useState(false);
  const [notifs, setNotifs]           = useState([]);
  const notifRef  = useRef(null);
  const profilRef = useRef(null);

  // Notifications dynamiques basees sur les paiements en attente
  useEffect(() => {
    paiementAPI.getStats()
      .then((s) => {
        const liste = [];
        if (s && s.attente > 0) {
          liste.push({ id: "p", type: "warn", texte: `${s.attente} paiement(s) en attente de traitement` });
        }
        if (s && s.payes != null) {
          liste.push({ id: "ok", type: "ok", texte: `${s.payes} paiement(s) regle(s) cette annee` });
        }
        liste.push({ id: "w", type: "ok", texte: "Bienvenue sur DigiSchool" });
        setNotifs(liste);
      })
      .catch(() => setNotifs([{ id: "w", type: "ok", texte: "Bienvenue sur DigiSchool" }]));
  }, []);

  // Fermeture au clic exterieur
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setOpenNotif(false);
      if (profilRef.current && !profilRef.current.contains(e.target)) setOpenProfil(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 h-[66px] flex items-center gap-4 px-8 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      {/* PAGE INFO */}
      <div>
        <h1 className="text-[17px] font-semibold text-gray-800">{page.title}</h1>
        <p className="text-[12.5px] text-gray-400 mt-0.5">
          DigiSchool / <span className="text-blue-500">{page.sub}</span>
        </p>
      </div>

      {/* SEARCH */}
      <div className="ml-auto flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2 min-w-[230px] focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Rechercher..."
          className="bg-transparent border-none outline-none text-[13px] text-gray-800 placeholder-gray-400 w-full font-sans"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2">

        {/* NOTIFICATIONS */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setOpenNotif((v) => !v); setOpenProfil(false); }}
            className="relative w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
            <Bell className="w-4 h-4" strokeWidth={1.8} />
            {notifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>

          {openNotif && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <p className="text-[14px] font-semibold text-blue-900">Notifications</p>
                <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">{notifs.length}</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifs.length === 0 ? (
                  <p className="px-4 py-6 text-center text-[12.5px] text-gray-400">Aucune notification</p>
                ) : notifs.map((n) => (
                  <div key={n.id} className="flex items-start gap-2.5 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-blue-50/50 transition-colors">
                    {n.type === "warn"
                      ? <Clock className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      : <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />}
                    <p className="text-[12.5px] text-gray-700 leading-snug">{n.texte}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MESSAGE (decoratif pour l'instant) */}
        <button className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
          <MessageSquare className="w-4 h-4" strokeWidth={1.8} />
        </button>

        {/* PROFIL */}
        <div className="relative" ref={profilRef}>
          <button
            onClick={() => { setOpenProfil((v) => !v); setOpenNotif(false); }}
            className="w-9 h-9 rounded-xl border-0 bg-blue-500 flex items-center justify-center text-white text-[12px] font-bold hover:bg-blue-600 transition-all shadow-md shadow-blue-200">
            {user.nom ? initialesDe(user.nom) : <User className="w-4 h-4" strokeWidth={2} />}
          </button>

          {openProfil && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center text-white text-[15px] font-bold">
                  {initialesDe(user.nom)}
                </div>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-gray-800 truncate">{user.nom || "Administrateur"}</p>
                  <p className="text-[11.5px] text-gray-400 capitalize">{user.role || "admin"}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors">
                <LogOut size={15} /> Se deconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}