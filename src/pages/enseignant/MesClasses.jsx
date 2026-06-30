import EnseignantLayout from "../../layouts/EnseignantLayout";
import { Users, TrendingUp, BookOpen, Eye } from "lucide-react";

const classes = [
  {
    nom: "Terminale S", effectif: 45, moy: 15.8, tauxReussite: 91,
    salle: "Salle 12", prochainCours: "Lundi 08h-09h",
    couleur: "from-blue-600 to-blue-400", initiales: "TS",
    etudiants: [
      { nom: "Khadija Diop",   moy: 17.9, statut: "Actif"     },
      { nom: "Aminata Mbaye",  moy: 16.4, statut: "Actif"     },
      { nom: "Boubacar Thiaw", moy: 12.7, statut: "Actif"     },
    ]
  },
  {
    nom: "Premiere", effectif: 42, moy: 13.9, tauxReussite: 80,
    salle: "Salle 12", prochainCours: "Mardi 10h-12h",
    couleur: "from-indigo-500 to-blue-400", initiales: "P",
    etudiants: [
      { nom: "Ousmane Diallo", moy: 13.8, statut: "Actif"     },
      { nom: "Dieynaba Ly",    moy: 14.5, statut: "Actif"     },
      { nom: "Mariama Ndiaye", moy: 13.2, statut: "Actif"     },
    ]
  },
  {
    nom: "3eme A", effectif: 48, moy: 14.1, tauxReussite: 88,
    salle: "Salle 12", prochainCours: "Jeudi 08h-09h",
    couleur: "from-sky-500 to-sky-300", initiales: "3A",
    etudiants: [
      { nom: "Fatou Ba",       moy: 15.1, statut: "Actif"     },
      { nom: "Moussa Sow",     moy: 11.2, statut: "Difficulte"},
    ]
  },
];

export default function MesClasses() {
  return (
    <EnseignantLayout>
      <div className="p-8">
        <div className="mb-6">
          <h2 className="font-serif text-[26px] font-semibold text-blue-900">Mes classes</h2>
          <p className="text-[13px] text-gray-400 mt-1">3 classes — Mathematiques</p>
        </div>

        <div className="flex flex-col gap-5">
          {classes.map((c) => (
            <div key={c.nom} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Header */}
              <div className={`h-2 bg-gradient-to-r ${c.couleur}`} />
              <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.couleur} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {c.initiales}
                </div>
                <div className="flex-1">
                  <p className="text-[16px] font-bold text-blue-900">{c.nom}</p>
                  <p className="text-[12px] text-gray-400">{c.salle} · {c.prochainCours}</p>
                </div>
                <div className="flex gap-6 text-center">
                  <div><p className="text-[20px] font-bold text-blue-700">{c.effectif}</p><p className="text-[10px] text-gray-400">Eleves</p></div>
                  <div><p className="text-[20px] font-bold text-green-600">{c.moy}</p><p className="text-[10px] text-gray-400">Moyenne</p></div>
                  <div><p className="text-[20px] font-bold text-indigo-600">{c.tauxReussite}%</p><p className="text-[10px] text-gray-400">Reussite</p></div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 text-[13px] font-medium hover:bg-indigo-100 transition-all">
                  <Eye size={14} /> Detail
                </button>
              </div>

              {/* Students preview */}
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Etudiant","Moyenne","Statut"].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-6 py-2.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {c.etudiants.map((e, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-indigo-50/30 transition-colors">
                      <td className="px-6 py-3 text-[13.5px] font-semibold text-gray-800">{e.nom}</td>
                      <td className="px-6 py-3">
                        <span className={`text-[13px] font-bold ${e.moy >= 14 ? "text-blue-700" : "text-yellow-600"}`}>{e.moy} / 20</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${e.statut === "Actif" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {e.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </EnseignantLayout>
  );
}