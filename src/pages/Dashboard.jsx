import { useState, useEffect } from "react";
import { etudiantAPI, paiementAPI, enseignantAPI, classeAPI } from "../services/api";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import { GraduationCap, Users, School, CreditCard, CalendarDays } from "lucide-react";

const repartition = [
  { classe: "Terminale S", pct: 87 },
  { classe: "Terminale L", pct: 79 },
  { classe: "Premiere",    pct: 72 },
  { classe: "3eme",        pct: 91 },
];

const events = [
  { label: "Conseil de classe", sub: "Terminale S", time: "09h00", color: "bg-blue-500"  },
  { label: "Remise bulletins",  sub: "Toutes classes", time: "6 Juin", color: "bg-sky-400"},
];

export default function Dashboard() {
  const [etudiants, setEtudiants]   = useState([]);
  const [stats, setStats]           = useState(null);
  const [paiStats, setPaiStats]     = useState(null);
  const [nbEnseignants, setNbEnseignants] = useState(null);
  const [nbClasses, setNbClasses]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, etudData, paiData, enseignantsData, classesData] = await Promise.all([
          etudiantAPI.getStats(),
          etudiantAPI.getAll({ limit: 5 }),
          paiementAPI.getStats(),
          enseignantAPI.getAll(),
          classeAPI.getAll(),
        ]);
        setStats(statsData);
        setEtudiants(etudData);
        setPaiStats(paiData);
        setNbEnseignants(Array.isArray(enseignantsData) ? enseignantsData.length : 0);
        setNbClasses(Array.isArray(classesData) ? classesData.length : 0);
      } catch (err) {
        setError("Impossible de charger les donnees. Verifiez que le backend est demarre.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const kpis = [
    { label: "Total Etudiants",      value: stats ? stats.total.toLocaleString("fr-FR") : "...", trend: "↑ +4.2% ce mois", trendType: "up",   Icon: GraduationCap, iconColor: "text-blue-500", iconBg: "bg-blue-50",  color: "border-t-blue-500" },
    { label: "Total Enseignants",    value: nbEnseignants !== null ? nbEnseignants.toLocaleString("fr-FR") : "...",  trend: "↑ Actifs",   trendType: "up",   Icon: Users,         iconColor: "text-sky-500",  iconBg: "bg-sky-50",   color: "border-t-sky-500"  },
    { label: "Nombre de Classes",    value: nbClasses !== null ? nbClasses.toLocaleString("fr-FR") : "...",  trend: "→ Stable",        trendType: "warn", Icon: School,        iconColor: "text-blue-700", iconBg: "bg-blue-50",  color: "border-t-blue-700" },
    { label: "Paiements en attente", value: paiStats ? paiStats.attente : "...", trend: "↓ A traiter", trendType: "down", Icon: CreditCard, iconColor: "text-blue-400", iconBg: "bg-blue-50",  color: "border-t-blue-400" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-serif text-[26px] font-semibold text-blue-900">Vue d'ensemble</h2>
          <p className="text-[13px] text-gray-400 mt-1">Bienvenue — voici vos statistiques en temps reel.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3.5 py-1.5 text-[13px] text-gray-400">
          <CalendarDays className="w-4 h-4 text-blue-400" strokeWidth={1.8} />
          {new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
        </div>
      </div>

      {/* Erreur backend */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-[13px] flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <div key={k.label} className={`bg-white border-2 border-gray-200 border-t-4 ${k.color} rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-200`}>
            <div className={`w-11 h-11 rounded-xl ${k.iconBg} flex items-center justify-center mb-3`}>
              <k.Icon className={`w-6 h-6 ${k.iconColor}`} strokeWidth={1.8} />
            </div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold mb-1">{k.label}</p>
            <p className={`text-[30px] font-bold text-blue-900 leading-none mb-3 ${loading ? "animate-pulse" : ""}`}>{k.value}</p>
            <span className={`inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-full
              ${k.trendType === "up"   ? "bg-green-100 text-green-700"
              : k.trendType === "down" ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"}`}>
              {k.trend}
            </span>
          </div>
        ))}
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-[1fr_340px] gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <p className="text-[15px] font-semibold text-blue-900">Etudiants recents</p>
              <p className="text-[12px] text-gray-400 mt-0.5">Derniers inscrits</p>
            </div>
            <button className="text-[12.5px] text-blue-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 font-medium hover:bg-blue-100 transition-all">
              Voir tout
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Etudiant","Classe","Statut","Paiement"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(4)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : etudiants.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">Aucun etudiant trouve</td></tr>
              ) : etudiants.map((e) => (
                <tr key={e.id} className="border-b border-gray-50 hover:bg-blue-50 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                        {e.nom ? e.nom.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "??"}
                      </div>
                      <span className="text-[13.5px] font-semibold text-gray-800">{e.nom}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13.5px] text-gray-500">{e.classe_nom || "—"}</td>
                  <td className="px-5 py-3.5"><Badge statut={e.statut} /></td>
                  <td className="px-5 py-3.5">
                    <span className="text-[12px] text-gray-400">—</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SIDE */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <p className="text-[14px] font-semibold text-blue-900">Juin 2026</p>
            </div>
            <div className="border-t border-gray-100">
              {events.map((ev, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-2.5 border-b border-gray-100 last:border-0 hover:bg-blue-50 cursor-pointer">
                  <div className={`w-2 h-2 rounded-full ${ev.color} flex-shrink-0`}/>
                  <div>
                    <p className="text-[13px] font-medium text-gray-800">{ev.label}</p>
                    <p className="text-[11px] text-gray-400">{ev.sub}</p>
                  </div>
                  <p className="ml-auto text-[11px] text-gray-400">{ev.time}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100">
              <p className="text-[14px] font-semibold text-blue-900">Taux de reussite</p>
            </div>
            <div className="p-5 flex flex-col gap-3.5">
              {repartition.map((r) => (
                <div key={r.classe}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[13px] font-medium text-gray-700">{r.classe}</span>
                    <span className="text-[12px] font-bold text-blue-600">{r.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-full" style={{ width: `${r.pct}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}