import { useState } from "react";
import EtudiantLayout from "../../layouts/EtudiantLayout";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const trimestres = {
  "1": [
    { matiere: "Mathematiques", note: 17, coeff: 5, evo: "+1" },
    { matiere: "Francais",      note: 18, coeff: 4, evo: "+2" },
    { matiere: "Sciences",      note: 15, coeff: 4, evo: "0"  },
    { matiere: "Histoire-Geo",  note: 16, coeff: 3, evo: "+1" },
    { matiere: "Anglais",       note: 17, coeff: 3, evo: "+2" },
  ],
  "2": [
    { matiere: "Mathematiques", note: 18, coeff: 5, evo: "+1" },
    { matiere: "Francais",      note: 19, coeff: 4, evo: "+1" },
    { matiere: "Sciences",      note: 16, coeff: 4, evo: "+1" },
    { matiere: "Histoire-Geo",  note: 17, coeff: 3, evo: "+1" },
    { matiere: "Anglais",       note: 18, coeff: 3, evo: "+1" },
  ],
  "3": [
    { matiere: "Mathematiques", note: 0,  coeff: 5, evo: "-" },
    { matiere: "Francais",      note: 0,  coeff: 4, evo: "-" },
    { matiere: "Sciences",      note: 0,  coeff: 4, evo: "-" },
    { matiere: "Histoire-Geo",  note: 0,  coeff: 3, evo: "-" },
    { matiere: "Anglais",       note: 0,  coeff: 3, evo: "-" },
  ],
};

const getMention = (n) => {
  if (n >= 16) return { label: "Tres Bien",  color: "bg-green-100 text-green-700"  };
  if (n >= 14) return { label: "Bien",       color: "bg-blue-100 text-blue-700"    };
  if (n >= 10) return { label: "Passable",   color: "bg-yellow-100 text-yellow-700"};
  return             { label: "Insuffisant",color: "bg-red-100 text-red-700"      };
};

export default function MesNotesEtudiant() {
  const [trim, setTrim] = useState("2");
  const notes = trimestres[trim];

  const moyenne = notes.reduce((s, n) => s + n.note * n.coeff, 0) /
    notes.reduce((s, n) => s + n.coeff, 0);

  return (
    <EtudiantLayout>
      <div className="p-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-serif text-[26px] font-semibold text-blue-900">Mes notes</h2>
            <p className="text-[13px] text-gray-400 mt-1">Terminale L — Annee 2025/2026</p>
          </div>
          <div className="flex gap-2">
            {["1","2","3"].map((t) => (
              <button key={t} onClick={() => setTrim(t)}
                className={`px-4 py-2 rounded-xl text-[13px] font-semibold border transition-all
                  ${trim === t ? "bg-sky-500 border-sky-500 text-white shadow-md" : "bg-white border-gray-200 text-gray-600 hover:border-sky-400"}`}>
                Trimestre {t}
              </button>
            ))}
          </div>
        </div>

        {/* Recap */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Moyenne",        value: moyenne.toFixed(1) + " / 20" },
            { label: "Rang",           value: "1er / 45"                   },
            { label: "Mention",        value: getMention(moyenne).label     },
            { label: "Matieres",       value: notes.length + " matieres"   },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:border-sky-300 transition-all shadow-sm">
              <p className="text-[22px] font-bold text-sky-700">{s.value}</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table des notes */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-[15px] font-semibold text-blue-900">Detail des notes — Trimestre {trim}</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Matiere","Note / 20","Coefficient","Mention","Evolution","Barre de progression"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notes.map((n) => {
                const mention = getMention(n.note);
                return (
                  <tr key={n.matiere} className="border-b border-gray-50 last:border-0 hover:bg-sky-50/30 transition-colors">
                    <td className="px-5 py-4 text-[13.5px] font-semibold text-gray-800">{n.matiere}</td>
                    <td className="px-5 py-4">
                      {n.note > 0 ? (
                        <span className="text-[18px] font-bold text-sky-700">{n.note}</span>
                      ) : (
                        <span className="text-[13px] text-gray-400 italic">En attente</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-gray-500 font-semibold">{n.coeff}</td>
                    <td className="px-5 py-4">
                      {n.note > 0 && (
                        <span className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${mention.color}`}>
                          {mention.label}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`flex items-center gap-1 text-[12px] font-semibold
                        ${n.evo.startsWith("+") ? "text-green-600" : n.evo.startsWith("-") && n.evo !== "-" ? "text-red-500" : "text-gray-400"}`}>
                        {n.evo.startsWith("+") ? <TrendingUp size={13} /> : n.evo.startsWith("-") && n.evo !== "-" ? <TrendingDown size={13} /> : <Minus size={13} />}
                        {n.evo !== "-" ? n.evo : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 w-40">
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500
                          ${n.note >= 16 ? "bg-gradient-to-r from-green-400 to-green-500"
                          : n.note >= 14 ? "bg-gradient-to-r from-sky-400 to-blue-500"
                          : n.note >= 10 ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                          : "bg-gray-200"}`}
                          style={{ width: n.note > 0 ? `${(n.note / 20) * 100}%` : "0%" }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </EtudiantLayout>
  );
}