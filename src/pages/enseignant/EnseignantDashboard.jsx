import EnseignantLayout from "../../layouts/EnseignantLayout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Users, ClipboardList, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { noteAPI, classeAPI, etudiantAPI } from "../../services/api";

const TRIMESTRE = 2; // trimestre affiche par defaut

const couleurs = [
  "from-blue-600 to-blue-400",
  "from-indigo-500 to-blue-400",
  "from-sky-500 to-sky-300",
  "from-violet-500 to-indigo-400",
];

function initiales(nom = "") {
  return nom.split(" ").map((m) => m[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export default function EnseignantDashboard() {
  const [loading, setLoading]       = useState(true);
  const [notes, setNotes]           = useState([]);
  const [classes, setClasses]       = useState([]);
  const [moyClasses, setMoyClasses] = useState([]);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; }
    catch { return {}; }
  })();
  const nomProf = user.nom || "Enseignant";

  useEffect(() => {
    (async () => {
      try {
        const [notesT2, allClasses, allEtudiants] = await Promise.all([
          noteAPI.getAll({ trimestre: TRIMESTRE }),
          classeAPI.getAll(),
          etudiantAPI.getAll(),
        ]);

        const notesArr   = Array.isArray(notesT2) ? notesT2 : [];
        const classesArr = Array.isArray(allClasses) ? allClasses : [];
        const etuArr     = Array.isArray(allEtudiants) ? allEtudiants : [];

        setNotes(notesArr);

        const effectifParClasse = {};
        etuArr.forEach((e) => {
          effectifParClasse[e.classe_id] = (effectifParClasse[e.classe_id] || 0) + 1;
        });

        const mesClasses = classesArr.slice(0, 3).map((c, i) => ({
          id: c.id,
          nom: c.nom,
          effectif: effectifParClasse[c.id] || 0,
          salle: c.salle || "—",
          couleur: couleurs[i % couleurs.length],
          initiales: initiales(c.nom),
        }));
        setClasses(mesClasses);

        const parMatiere = {};
        notesArr.forEach((n) => {
          const m = n.matiere || "Autre";
          if (!parMatiere[m]) parMatiere[m] = { somme: 0, nb: 0 };
          parMatiere[m].somme += Number(n.note);
          parMatiere[m].nb += 1;
        });
        const moyennes = Object.entries(parMatiere)
          .map(([matiere, v]) => ({ nom: matiere, moy: +(v.somme / v.nb).toFixed(1) }))
          .sort((a, b) => b.moy - a.moy)
          .slice(0, 4);
        setMoyClasses(moyennes);
      } catch (e) {
        console.error("Erreur chargement dashboard enseignant:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalNotes = notes.length;
  const moyenneGenerale = totalNotes
    ? +(notes.reduce((s, n) => s + Number(n.note), 0) / totalNotes).toFixed(1)
    : 0;
  const nbMatieres = new Set(notes.map((n) => n.matiere)).size;

  const kpis = [
    { label: "Mes classes",      value: String(classes.length), trend: classes.map(c => c.nom).join(", ") || "—", icon: Users,         bg: "bg-indigo-50", iconColor: "text-indigo-500" },
    { label: "Matieres",         value: String(nbMatieres),     trend: `Trimestre ${TRIMESTRE}`,                        icon: Clock,         bg: "bg-blue-50",   iconColor: "text-blue-500"   },
    { label: "Notes saisies",    value: String(totalNotes),     trend: `Trimestre ${TRIMESTRE}`,                        icon: ClipboardList, bg: "bg-green-50",  iconColor: "text-green-500"  },
    { label: "Moyenne generale", value: `${moyenneGenerale}`,   trend: "Toutes notes T2",                               icon: TrendingUp,    bg: "bg-amber-50",  iconColor: "text-amber-500"  },
  ];

  const notesRecentes = notes.slice(-6).reverse();

  return (
    <EnseignantLayout>
      <div className="p-8">
        <div className="mb-6">
          <h2 className="font-serif text-[26px] font-semibold text-blue-900">Mon tableau de bord</h2>
          <p className="text-[13px] text-gray-400 mt-1">Bienvenue, {nomProf}</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20 text-[14px]">Chargement des donnees…</div>
        ) : (
        <>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300 transition-all duration-200">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${k.bg}`}>
                  <Icon size={22} className={k.iconColor} />
                </div>
                <div>
                  <p className="text-[22px] font-bold text-blue-900 leading-none">{k.value}</p>
                  <p className="text-[10.5px] text-gray-400 uppercase tracking-wide mt-0.5">{k.label}</p>
                  <p className="text-[11px] text-indigo-500 font-semibold mt-0.5">{k.trend}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-5">
          <div className="flex flex-col gap-5">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="text-[15px] font-semibold text-blue-900">Mes classes</p>
                <Link to="/enseignant/mes-classes" className="text-[12.5px] text-indigo-500 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1.5 font-medium hover:bg-indigo-100 transition-all">
                  Voir details
                </Link>
              </div>
              <div className="p-5 grid grid-cols-3 gap-4">
                {classes.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.couleur} flex items-center justify-center text-white font-bold text-sm mb-3`}>
                      {c.initiales}
                    </div>
                    <p className="text-[14px] font-bold text-blue-900">{c.nom}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{c.effectif} eleves · {c.salle}</p>
                  </div>
                ))}
                {classes.length === 0 && (
                  <p className="text-[13px] text-gray-400 col-span-3">Aucune classe.</p>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="text-[15px] font-semibold text-blue-900">Dernieres notes saisies</p>
                <Link to="/enseignant/mes-notes" className="text-[12.5px] text-indigo-500 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1.5 font-medium hover:bg-indigo-100 transition-all">
                  Saisir des notes
                </Link>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Etudiant","Matiere","Note","Statut"].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {notesRecentes.map((n, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors">
                      <td className="px-5 py-3.5 text-[13.5px] font-semibold text-gray-800">{n.etudiant_nom}</td>
                      <td className="px-5 py-3.5 text-[13px] text-gray-500">{n.matiere}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[14px] font-bold ${Number(n.note) >= 16 ? "text-green-600" : Number(n.note) >= 14 ? "text-blue-700" : Number(n.note) >= 10 ? "text-yellow-600" : "text-red-500"}`}>
                          {n.note} / 20
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1 text-green-600 text-[12px] font-semibold">
                          <CheckCircle size={13} /> Enregistree
                        </span>
                      </td>
                    </tr>
                  ))}
                  {notesRecentes.length === 0 && (
                    <tr><td colSpan={4} className="px-5 py-6 text-center text-[13px] text-gray-400">Aucune note saisie.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <p className="text-[14px] font-semibold text-blue-900">Moyennes par matiere</p>
              </div>
              <div className="p-5 flex flex-col gap-3">
                {moyClasses.map((c) => (
                  <div key={c.nom}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[13px] font-medium text-gray-700">{c.nom}</span>
                      <span className="text-[12px] font-bold text-indigo-600">{c.moy} / 20</span>
                    </div>
                    <div className="h-2 bg-indigo-50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-400"
                        style={{ width: `${(c.moy / 20) * 100}%` }} />
                    </div>
                  </div>
                ))}
                {moyClasses.length === 0 && (
                  <p className="text-[13px] text-gray-400">Pas de notes pour le moment.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </EnseignantLayout>
  );
}