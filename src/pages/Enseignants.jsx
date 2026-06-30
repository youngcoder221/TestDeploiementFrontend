import { useState, useEffect } from "react";
import { enseignantAPI } from "../services/api";
import {
  Users, BookOpen, Clock, Star,
  Search, Download, Plus, Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight, Mail, Phone,
  BarChart2, Award
} from "lucide-react";
import Avatar from "../components/ui/Avatar";
import { exporterPDF } from "../utils/exportPdf";

const statusStyle = {
  "Actif":   "bg-green-100 text-green-700",
  "Inactif": "bg-gray-100 text-gray-600",
  "Conge":   "bg-yellow-100 text-yellow-700",
  "Absent":  "bg-red-100 text-red-700",
};

const COULEURS = [
  "from-blue-600 to-blue-400", "from-indigo-500 to-blue-400",
  "from-sky-500 to-sky-300", "from-green-500 to-green-300",
  "from-amber-500 to-yellow-400", "from-rose-500 to-pink-400",
  "from-purple-500 to-purple-300", "from-teal-500 to-teal-300",
];

const initialesDe = (nom) =>
  nom ? nom.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "??";
const couleurDe = (id) => COULEURS[(Number(id) || 0) % COULEURS.length];

function StarRating({ note }) {
  const n = Number(note) || 0;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={11}
          className={s <= Math.round(n) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
      ))}
      <span className="text-[11px] font-semibold text-gray-600 ml-1">{n ? n.toFixed(1) : "—"}</span>
    </div>
  );
}

export default function Enseignants() {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState("");
  const [matiere, setMatiere]   = useState("Toutes");
  const [selected, setSelected] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState(null);
  const emptyForm = { nom: "", email: "", phone: "", matiere: "", heures_semaine: "", statut: "Actif" };
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await enseignantAPI.getAll();
      const list = Array.isArray(data) ? data : [];
      setEnseignants(list);
      if (list.length && !selected) setSelected(list[0]);
    } catch (err) {
      setError("Impossible de charger les enseignants. Verifiez que le backend est demarre.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, []);

  const filtered = enseignants.filter((e) => {
    const s = search.toLowerCase();
    const matchSearch  = (e.nom || "").toLowerCase().includes(s) || (e.matiere || "").toLowerCase().includes(s);
    const matchMatiere = matiere === "Toutes" || e.matiere === matiere;
    return matchSearch && matchMatiere;
  });

  const matieres = ["Toutes", ...new Set(enseignants.map((e) => e.matiere).filter(Boolean))];

  // KPIs calcules a partir des vraies donnees
  const totalH = enseignants.reduce((acc, e) => acc + (Number(e.heures_semaine) || 0), 0);
  const notes  = enseignants.map((e) => Number(e.note)).filter((n) => n > 0);
  const noteMoy = notes.length ? (notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(1) : "—";
  const kpis = [
    { label: "Total enseignants", value: enseignants.length, trend: "Inscrits",          trendType: "up",   icon: Users,    bg: "bg-blue-50",   iconColor: "text-blue-500"   },
    { label: "Matieres couvertes",value: matieres.length - 1, trend: "Disciplines",       trendType: "warn", icon: BookOpen, bg: "bg-purple-50", iconColor: "text-purple-500" },
    { label: "Heures / semaine",  value: totalH,             trend: "Cumul",             trendType: "up",   icon: Clock,    bg: "bg-green-50",  iconColor: "text-green-500"  },
    { label: "Note moyenne",      value: noteMoy,            trend: "Sur 5",             trendType: "up",   icon: Star,     bg: "bg-amber-50",  iconColor: "text-amber-500"  },
  ];

  const handleExportPDF = () => {
    if (!filtered.length) { alert("Aucun enseignant a exporter."); return; }
    exporterPDF({
      titre: "Liste des enseignants",
      sousTitre: `${filtered.length} enseignant(s)` + (matiere !== "Toutes" ? ` — ${matiere}` : ""),
      colonnes: ["Nom", "Email", "Telephone", "Matiere", "H/Sem", "Note", "Statut"],
      lignes: filtered.map((e) => [
        e.nom || "", e.email || "", e.phone || "", e.matiere || "",
        e.heures_semaine ?? "", e.note ?? "", e.statut || "",
      ]),
      nomFichier: "enseignants",
    });
  };

  const handleCreate = async (ev) => {
    ev.preventDefault();
    setFormError(null);
    if (!form.nom.trim() || !form.email.trim()) {
      setFormError("Le nom et l'email sont obligatoires.");
      return;
    }
    try {
      setSaving(true);
      await enseignantAPI.create({
        ...form,
        heures_semaine: form.heures_semaine ? Number(form.heures_semaine) : 0,
      });
      setShowModal(false);
      setForm(emptyForm);
      await fetchData();
    } catch (err) {
      setFormError(err?.message || "Erreur lors de la creation. L'email existe peut-etre deja.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet enseignant ?")) return;
    try { await enseignantAPI.delete(id); await fetchData(); }
    catch { alert("Suppression impossible."); }
  };

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-serif text-[26px] font-semibold text-blue-900">Gestion des Enseignants</h2>
          <p className="text-[13px] text-gray-400 mt-1">Donnees en temps reel depuis la base de donnees</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-[1.5px] border-blue-300 bg-white text-blue-600 text-[13px] font-medium hover:bg-blue-50 transition-all">
            <Download size={14} /> Exporter PDF
          </button>
          <button onClick={() => { setForm(emptyForm); setFormError(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-[13.5px] font-semibold hover:bg-blue-600 transition-all shadow-md shadow-blue-200">
            <Plus size={14} strokeWidth={2.5} /> Nouvel enseignant
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-[13px]">{error}</div>
      )}

      {/* KPI ROW */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-1 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${k.bg}`}>
                <Icon size={22} className={k.iconColor} />
              </div>
              <div>
                <p className={`text-[22px] font-bold text-blue-900 leading-none ${loading ? "animate-pulse" : ""}`}>{k.value}</p>
                <p className="text-[10.5px] text-gray-400 uppercase tracking-wide mt-0.5">{k.label}</p>
                <span className="text-[11px] font-semibold mt-1 inline-block text-blue-500">{k.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-[1fr_300px] gap-5">

        {/* TABLE CARD */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <p className="text-[15px] font-semibold text-blue-900">Liste des enseignants</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{filtered.length} resultats</p>
            </div>
          </div>

          {/* Search */}
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="Rechercher un enseignant, matiere..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-[13px] text-gray-800 placeholder-gray-400 w-full font-sans" />
            </div>
          </div>

          {/* Matiere filters */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50 flex-wrap">
            {matieres.map((m) => (
              <button key={m} onClick={() => setMatiere(m)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all
                  ${matiere === m ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-500"}`}>
                {m}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Enseignant","Matiere","H/Semaine","Note","Statut","Actions"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400">
                    <Search size={32} className="mx-auto mb-2 opacity-30" />
                    <p>Aucun enseignant trouve</p>
                  </td></tr>
                ) : filtered.map((e) => (
                  <tr key={e.id} onClick={() => setSelected(e)}
                    className={`border-b border-gray-50 cursor-pointer transition-colors
                      ${selected?.id === e.id ? "bg-blue-50" : "hover:bg-blue-50/50"}`}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar initiales={initialesDe(e.nom)} couleur={couleurDe(e.id)} />
                        <div>
                          <p className="text-[13.5px] font-semibold text-gray-800">{e.nom}</p>
                          <p className="text-[11px] text-gray-400">{e.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[12.5px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {e.matiere || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-[13px] font-semibold text-gray-700">{e.heures_semaine ?? 0}h</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><StarRating note={e.note} /></td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${statusStyle[e.statut] || "bg-gray-100 text-gray-600"}`}>
                        {e.statut || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5">
                        <button onClick={(ev) => { ev.stopPropagation(); setSelected(e); }}
                          className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500 text-gray-400 transition-all">
                          <Eye size={13} />
                        </button>
                        <button onClick={(ev) => { ev.stopPropagation(); handleDelete(e.id); }}
                          className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:border-red-400 hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="flex flex-col gap-4">
          {/* Detail enseignant */}
          {selected && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-br from-blue-500 to-blue-400 p-5 text-white">
                <Avatar initiales={initialesDe(selected.nom)} couleur={couleurDe(selected.id)} size="lg" />
                <p className="text-[16px] font-semibold mt-3">{selected.nom}</p>
                <p className="text-[12px] text-blue-100">{selected.matiere || "—"}</p>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[12.5px] text-gray-600">
                  <Mail size={14} className="text-blue-400" /> {selected.email || "—"}
                </div>
                <div className="flex items-center gap-2 text-[12.5px] text-gray-600">
                  <Phone size={14} className="text-blue-400" /> {selected.phone || "—"}
                </div>
                <div className="flex items-center gap-2 text-[12.5px] text-gray-600">
                  <Clock size={14} className="text-blue-400" /> {selected.heures_semaine ?? 0}h / semaine
                </div>
                <div className="flex items-center gap-2 text-[12.5px] text-gray-600">
                  <Star size={14} className="text-amber-400" /> Note : {selected.note ?? "—"}
                </div>
              </div>
            </div>
          )}

          {/* TOP ENSEIGNANTS */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
              <Award size={15} className="text-amber-500" />
              <p className="text-[14px] font-semibold text-blue-900">Mieux notes</p>
            </div>
            <div>
              {[...enseignants].filter((e) => Number(e.note) > 0).sort((a, b) => b.note - a.note).slice(0, 4).map((e, i) => (
                <div key={e.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 last:border-0 hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => setSelected(e)}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0
                    ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-blue-50 text-blue-500"}`}>
                    {i + 1}
                  </span>
                  <Avatar initiales={initialesDe(e.nom)} couleur={couleurDe(e.id)} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-semibold text-gray-800 truncate">{e.nom}</p>
                    <p className="text-[11px] text-gray-400">{e.matiere}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-[12px] font-bold text-gray-700">{e.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL — Nouvel enseignant */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-serif text-[20px] font-semibold text-blue-900">Nouvel enseignant</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">Renseignez les informations ci-dessous</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 mb-4 text-[12.5px]">{formError}</div>
            )}

            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3.5">
              <div className="col-span-2">
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Nom complet *</label>
                <input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400" placeholder="Ibrahima Diallo" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400" placeholder="i.diallo@dgs.sn" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Telephone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400" placeholder="771234567" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Matiere</label>
                <input value={form.matiere} onChange={(e) => setForm({ ...form, matiere: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400" placeholder="Mathematiques" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Heures / semaine</label>
                <input type="number" value={form.heures_semaine} onChange={(e) => setForm({ ...form, heures_semaine: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400" placeholder="18" />
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Statut</label>
                <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400 bg-white">
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="Conge">Conge</option>
                </select>
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