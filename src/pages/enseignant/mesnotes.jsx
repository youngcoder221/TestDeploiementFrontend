import { useState } from "react";
import EnseignantLayout from "../../layouts/EnseignantLayout";
import { Save, Search, CheckCircle, Plus } from "lucide-react";

const classes = ["Terminale S", "Premiere", "3eme A"];
const matieres = ["Mathematiques", "Physique", "SVT"];

const etudiants = [
  { id: 1, nom: "Khadija Diop",   matricule: "ETU-0042", note: 18 },
  { id: 2, nom: "Aminata Mbaye",  matricule: "ETU-0017", note: 17 },
  { id: 3, nom: "Fatou Ba",       matricule: "ETU-0031", note: 14 },
  { id: 4, nom: "Ousmane Diallo", matricule: "ETU-0008", note: 13 },
  { id: 5, nom: "Boubacar Thiaw", matricule: "ETU-0055", note: 12 },
];

export default function MesNotes() {
  const [classeActive, setClasseActive] = useState("Terminale S");
  const [matiereActive, setMatiereActive] = useState("Mathematiques");
  const [trimestre, setTrimestre] = useState("2");
  const [notes, setNotes] = useState(
    Object.fromEntries(etudiants.map((e) => [e.id, e.note]))
  );
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = etudiants.filter((e) =>
    e.nom.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getMention = (n) => {
    if (n >= 16) return { label: "Tres Bien", color: "text-green-600 bg-green-100" };
    if (n >= 14) return { label: "Bien",      color: "text-blue-600 bg-blue-100"   };
    if (n >= 10) return { label: "Passable",  color: "text-yellow-600 bg-yellow-100"};
    return              { label: "Insuffisant",color: "text-red-600 bg-red-100"    };
  };

  const moyenne = filtered.length
    ? (filtered.reduce((s, e) => s + (Number(notes[e.id]) || 0), 0) / filtered.length).toFixed(1)
    : 0;

  return (
    <EnseignantLayout>
      <div className="p-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-serif text-[26px] font-semibold text-blue-900">Saisie des notes</h2>
            <p className="text-[13px] text-gray-400 mt-1">Trimestre {trimestre} — {matiereActive}</p>
          </div>
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[13.5px] font-semibold transition-all shadow-md
              ${saved ? "bg-green-500 shadow-green-200" : "bg-indigo-500 hover:bg-indigo-600 shadow-indigo-200"}`}>
            {saved ? <><CheckCircle size={16} /> Enregistre !</> : <><Save size={16} /> Enregistrer</>}
          </button>
        </div>

        {/* Filtres */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 shadow-sm">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Classe</label>
              <select value={classeActive} onChange={(e) => setClasseActive(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-[13px] text-gray-700 outline-none font-sans focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                {classes.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Matiere</label>
              <select value={matiereActive} onChange={(e) => setMatiereActive(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-[13px] text-gray-700 outline-none font-sans focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                {matieres.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Trimestre</label>
              <select value={trimestre} onChange={(e) => setTrimestre(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-[13px] text-gray-700 outline-none font-sans focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                <option value="1">Trimestre 1</option>
                <option value="2">Trimestre 2</option>
                <option value="3">Trimestre 3</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          {[
            { label: "Etudiants",  value: filtered.length },
            { label: "Moyenne",    value: moyenne + " / 20" },
            { label: "Plus haute", value: Math.max(...filtered.map(e => notes[e.id] || 0)) + " / 20" },
            { label: "Plus basse", value: Math.min(...filtered.map(e => notes[e.id] || 0)) + " / 20" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
              <p className="text-[22px] font-bold text-indigo-700">{s.value}</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* TABLE SAISIE */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <p className="text-[15px] font-semibold text-blue-900">{classeActive} — {matiereActive}</p>
            <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 w-52 focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Search size={13} className="text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="Rechercher..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-[13px] text-gray-700 placeholder-gray-400 w-full font-sans" />
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["#","Etudiant","Matricule","Note / 20","Mention","Barre"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const n = Number(notes[e.id]) || 0;
                const mention = getMention(n);
                return (
                  <tr key={e.id} className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors">
                    <td className="px-5 py-3.5 text-[13px] text-gray-400 font-semibold">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center text-white text-[11px] font-bold">
                          {e.nom.split(" ").map(n => n[0]).join("").slice(0,2)}
                        </div>
                        <span className="text-[13.5px] font-semibold text-gray-800">{e.nom}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-gray-400 font-semibold">{e.matricule}</td>
                    <td className="px-5 py-3.5">
                      <input
                        type="number" min="0" max="20" step="0.5"
                        value={notes[e.id] ?? ""}
                        onChange={(ev) => setNotes({ ...notes, [e.id]: ev.target.value })}
                        className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-[13.5px] font-bold text-center text-indigo-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${mention.color}`}>
                        {mention.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 w-36">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300
                          ${n >= 16 ? "bg-green-400" : n >= 14 ? "bg-blue-400" : n >= 10 ? "bg-yellow-400" : "bg-red-400"}`}
                          style={{ width: `${(n / 20) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </EnseignantLayout>
  );
}