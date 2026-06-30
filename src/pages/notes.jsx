import { useState, useEffect } from "react";
import { noteAPI, classeAPI, etudiantAPI } from "../services/api";
import {
  TrendingUp, TrendingDown, Minus,
  Award, BookOpen, BarChart2, CheckSquare,
  Download, Plus, Eye, Pencil,
  ChevronLeft, ChevronRight, Search
} from "lucide-react";
import Avatar from "../components/ui/Avatar";
import { exporterPDF } from "../utils/exportPdf";

const distribution = [
  { label: "Tres Bien (16-20)",   pct: 28, color: "from-green-500 to-green-300"   },
  { label: "Bien (14-16)",        pct: 38, color: "from-blue-500 to-blue-300"     },
  { label: "Passable (10-14)",    pct: 19, color: "from-yellow-500 to-yellow-300" },
  { label: "Insuffisant (<10)",   pct: 10, color: "from-red-500 to-red-300"       },
];

const mentionStyles = {
  "Tres Bien":  "bg-green-100 text-green-700",
  "Bien":       "bg-blue-100 text-blue-700",
  "Assez Bien": "bg-blue-50 text-blue-600",
  "Passable":   "bg-yellow-100 text-yellow-700",
  "Insuffisant":"bg-red-100 text-red-700",
};

const getMention = (moy) => {
  if (moy >= 16) return "Tres Bien";
  if (moy >= 14) return "Bien";
  if (moy >= 12) return "Assez Bien";
  if (moy >= 10) return "Passable";
  return "Insuffisant";
};

const rangStyles = {
  1: "bg-yellow-100 text-yellow-700 font-bold",
  2: "bg-gray-100 text-gray-600 font-bold",
  3: "bg-orange-100 text-orange-600 font-bold",
};

const classes = ["Toutes les classes", "Terminale S", "Terminale L", "Premiere", "3eme", "2nde"];

export default function Notes() {
  const [moyennes, setMoyennes]     = useState([]);
  const [notes, setNotes]           = useState([]);
  const [classes2, setClasses2]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState("");
  const [trimestre, setTrimestre]   = useState("2");
  const [matiere, setMatiere]       = useState("");
  const [classeActive, setClasse]   = useState("");
  const [etudiantsListe, setEtudiantsListe] = useState([]);
  const [showModal, setShowModal]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState(null);
  const emptyForm = { etudiant_id: "", matiere: "", note: "", trimestre: "2", annee_scolaire: "2025-2026" };
  const [form, setForm]             = useState(emptyForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { trimestre };
      if (matiere)      params.matiere    = matiere;
      if (classeActive) params.classe_id  = classeActive;

      const [moyData, notesData, classesData] = await Promise.all([
        noteAPI.getMoyennes({ trimestre }),
        noteAPI.getAll(params),
        classeAPI.getAll(),
      ]);

      setMoyennes(moyData);
      setNotes(notesData);
      setClasses2(classesData);
    } catch (err) {
      setError("Erreur de connexion au serveur.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [trimestre, matiere, classeActive]);

  // Charger la liste des etudiants une seule fois (pour le menu deroulant)
  useEffect(() => {
    etudiantAPI.getAll()
      .then((d) => setEtudiantsListe(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const handleExportPDF = () => {
    if (!filtered.length) { alert("Aucune donnee a exporter."); return; }
    exporterPDF({
      titre: "Releve des moyennes",
      sousTitre: `Trimestre ${trimestre} — ${filtered.length} eleve(s)`,
      colonnes: ["Matricule", "Etudiant", "Moyenne / 20", "Mention"],
      lignes: filtered.map((e) => {
        const moy = parseFloat(e.moyenne) || 0;
        return [e.matricule || "", e.nom || "", moy.toFixed(2), getMention(moy)];
      }),
      nomFichier: `notes_trimestre${trimestre}`,
    });
  };

  const handleCreate = async (ev) => {
    ev.preventDefault();
    setFormError(null);
    if (!form.etudiant_id || !form.matiere.trim() || form.note === "") {
      setFormError("Etudiant, matiere et note sont obligatoires.");
      return;
    }
    const noteNum = Number(form.note);
    if (isNaN(noteNum) || noteNum < 0 || noteNum > 20) {
      setFormError("La note doit etre comprise entre 0 et 20.");
      return;
    }
    try {
      setSaving(true);
      await noteAPI.create({
        etudiant_id: Number(form.etudiant_id),
        matiere: form.matiere,
        note: noteNum,
        trimestre: Number(form.trimestre),
        annee_scolaire: form.annee_scolaire,
      });
      setShowModal(false);
      setForm(emptyForm);
      await fetchData();
    } catch (err) {
      setFormError(err?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  // Stats calculees
  const moyenneGen = moyennes.length
    ? (moyennes.reduce((s, e) => s + (parseFloat(e.moyenne) || 0), 0) / moyennes.length).toFixed(1)
    : "—";

  const taux = moyennes.length
    ? Math.round((moyennes.filter(e => parseFloat(e.moyenne) >= 10).length / moyennes.length) * 100)
    : 0;

  const meilleure = moyennes.length
    ? Math.max(...moyennes.map(e => parseFloat(e.moyenne) || 0)).toFixed(1)
    : "—";

  // Filtrer par recherche
  const filtered = moyennes.filter(e =>
    e.nom?.toLowerCase().includes(search.toLowerCase()) ||
    e.matricule?.toLowerCase().includes(search.toLowerCase())
  );

  const kpis = [
    { label: "Moyenne generale", value: loading ? "..." : moyenneGen + " / 20", icon: BarChart2,   bg: "bg-blue-50",   iconColor: "text-blue-500"   },
    { label: "Taux de reussite", value: loading ? "..." : taux + "%",           icon: CheckSquare, bg: "bg-green-50",  iconColor: "text-green-500"  },
    { label: "Notes saisies",    value: loading ? "..." : notes.length,         icon: BookOpen,    bg: "bg-purple-50", iconColor: "text-purple-500" },
    { label: "Meilleure note",   value: loading ? "..." : meilleure,            icon: Award,       bg: "bg-amber-50",  iconColor: "text-amber-500"  },
  ];

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-serif text-[26px] font-semibold text-blue-900">Notes et Evaluations</h2>
          <p className="text-[13px] text-gray-400 mt-1">Donnees en temps reel — Trimestre {trimestre}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-[1.5px] border-blue-300 bg-white text-blue-600 text-[13px] font-medium hover:bg-blue-50 transition-all">
            <Download size={14} /> Exporter PDF
          </button>
          <button onClick={() => { setForm(emptyForm); setFormError(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-[13.5px] font-semibold hover:bg-blue-600 transition-all shadow-md shadow-blue-200">
            <Plus size={14} strokeWidth={2.5} /> Saisir des notes
          </button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-[13px]">
          ⚠️ {error}
        </div>
      )}

      {/* KPI */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white border border-gray-200 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${k.bg}`}>
                <Icon size={22} className={k.iconColor} />
              </div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold mb-1">{k.label}</p>
              <p className={`text-[26px] font-bold text-blue-900 leading-none mb-2 ${loading ? "animate-pulse" : ""}`}>{k.value}</p>
            </div>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-[1fr_290px] gap-5">

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <p className="text-[15px] font-semibold text-blue-900">Releve de notes</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{filtered.length} etudiants</p>
            </div>
          </div>

          {/* Search */}
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2 focus-within:border-blue-400 transition-all">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="Rechercher un etudiant..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-[13px] text-gray-800 placeholder-gray-400 w-full font-sans" />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50 flex-wrap">
            {/* Trimestre */}
            {["1","2","3"].map((t) => (
              <button key={t} onClick={() => setTrimestre(t)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all
                  ${trimestre === t ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-blue-400"}`}>
                T{t}
              </button>
            ))}
            <div className="w-px h-5 bg-gray-200 mx-1" />
            {/* Classes */}
            <select value={classeActive} onChange={(e) => setClasse(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-[12px] text-gray-600 outline-none font-sans">
              <option value="">Toutes classes</option>
              {classes2.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
            {/* Matiere */}
            <select value={matiere} onChange={(e) => setMatiere(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-[12px] text-gray-600 outline-none font-sans">
              <option value="">Toutes matieres</option>
              <option value="Mathematiques">Mathematiques</option>
              <option value="Francais">Francais</option>
              <option value="Sciences">Sciences</option>
              <option value="Histoire-Geo">Histoire-Geo</option>
              <option value="Anglais">Anglais</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Rang","Etudiant","Classe","Moyenne","Mention","Evolution","Actions"].map(h => (
                    <th key={h} className="text-left text-[10.5px] font-semibold uppercase tracking-wide text-gray-400 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">
                    <Search size={32} className="mx-auto mb-2 opacity-30" />
                    <p>Aucun resultat</p>
                  </td></tr>
                ) : filtered.map((e, idx) => {
                  const moy = parseFloat(e.moyenne) || 0;
                  const mention = getMention(moy);
                  const rang = e.rang || idx + 1;
                  return (
                    <tr key={e.id} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px]
                          ${rangStyles[rang] || "bg-blue-50 text-blue-500 font-semibold"}`}>
                          {rang}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                            {e.nom ? e.nom.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "??"}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-gray-800">{e.nom}</p>
                            <p className="text-[11px] text-gray-400">{e.matricule}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-gray-500">{e.classe || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[15px] font-bold
                          ${moy >= 16 ? "text-green-600" : moy >= 14 ? "text-blue-700" : moy >= 10 ? "text-yellow-600" : "text-red-600"}`}>
                          {moy > 0 ? moy.toFixed(1) : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {moy > 0 && (
                          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${mentionStyles[mention]}`}>
                            {mention}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-[12px] font-semibold text-gray-400">
                          <Minus size={12} /> —
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500 text-gray-400 transition-all">
                            <Eye size={12} />
                          </button>
                          <button className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500 text-gray-400 transition-all">
                            <Pencil size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-gray-50 border-t border-gray-100">
            <p className="text-[12.5px] text-gray-400">{filtered.length} etudiants charges</p>
            <div className="flex gap-1">
              <button className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-400 flex items-center justify-center hover:border-blue-400 hover:text-blue-500 transition-all">
                <ChevronLeft size={14} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-blue-500 border-blue-500 text-white text-[13px] font-bold">1</button>
              <button className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-400 flex items-center justify-center hover:border-blue-400 hover:text-blue-500 transition-all">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* SIDE */}
        <div className="flex flex-col gap-4">

          {/* TOP 5 */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
              <Award size={15} className="text-amber-500" />
              <p className="text-[14px] font-semibold text-blue-900">Top 5 Etudiants</p>
            </div>
            <div>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                  </div>
                ))
              ) : filtered.slice(0, 5).map((e, i) => {
                const moy = parseFloat(e.moyenne) || 0;
                return (
                  <div key={e.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 last:border-0 hover:bg-blue-50 transition-colors cursor-pointer">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0
                      ${rangStyles[i+1] || "bg-blue-50 text-blue-500 font-semibold"}`}>{i+1}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                      {e.nom ? e.nom.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "??"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-800 truncate">{e.nom}</p>
                      <p className="text-[11px] text-gray-400">{e.classe}</p>
                    </div>
                    <span className="text-[14px] font-bold text-blue-700">{moy > 0 ? moy.toFixed(1) : "—"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DISTRIBUTION */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
              <BarChart2 size={15} className="text-blue-500" />
              <p className="text-[14px] font-semibold text-blue-900">Distribution</p>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {distribution.map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[12px] font-medium text-gray-700">{d.label}</span>
                    <span className="text-[12px] font-bold text-blue-600">{d.pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${d.color}`} style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOUTON ACTUALISER */}
          <button onClick={fetchData}
            className="w-full py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 text-[13px] font-semibold hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
            🔄 Actualiser les donnees
          </button>

        </div>
      </div>

      {/* MODAL — Saisir une note */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-serif text-[20px] font-semibold text-blue-900">Saisir une note</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">Ajoutez une note pour un eleve</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 mb-4 text-[12.5px]">{formError}</div>
            )}

            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3.5">
              <div className="col-span-2">
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Etudiant *</label>
                <select value={form.etudiant_id} onChange={(e) => setForm({ ...form, etudiant_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400 bg-white">
                  <option value="">— Choisir un eleve —</option>
                  {etudiantsListe.map((e) => (
                    <option key={e.id} value={e.id}>{e.matricule} — {e.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Matiere *</label>
                <input value={form.matiere} onChange={(e) => setForm({ ...form, matiere: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400" placeholder="Mathematiques" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Note / 20 *</label>
                <input type="number" step="0.25" min="0" max="20" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400" placeholder="15.5" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Trimestre</label>
                <select value={form.trimestre} onChange={(e) => setForm({ ...form, trimestre: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400 bg-white">
                  <option value="1">Trimestre 1</option>
                  <option value="2">Trimestre 2</option>
                  <option value="3">Trimestre 3</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Annee scolaire</label>
                <input value={form.annee_scolaire} onChange={(e) => setForm({ ...form, annee_scolaire: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400" placeholder="2025-2026" />
              </div>

              <div className="col-span-2 flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-[13px] font-medium hover:bg-gray-50 transition-all">Annuler</button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-[13.5px] font-semibold hover:bg-blue-600 transition-all shadow-md shadow-blue-200 disabled:opacity-60">
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}