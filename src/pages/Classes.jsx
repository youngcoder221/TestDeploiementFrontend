import { useState, useEffect } from "react";
import { classeAPI, etudiantAPI } from "../services/api";
import {
  BookOpen, Users, Award, Search, Download, Plus,
  Eye, Trash2, User, BarChart2, GraduationCap
} from "lucide-react";
import { exporterPDF } from "../utils/exportPdf";

const COULEURS = [
  "from-blue-600 to-blue-400", "from-indigo-500 to-blue-400",
  "from-sky-500 to-sky-300", "from-green-500 to-green-300",
  "from-amber-500 to-yellow-400", "from-rose-500 to-pink-400",
  "from-purple-500 to-purple-300", "from-teal-500 to-teal-300",
];
const couleurDe = (id) => COULEURS[(Number(id) || 0) % COULEURS.length];
const initialesDe = (nom) =>
  nom ? nom.split(" ").map((m) => m[0]).join("").slice(0, 2).toUpperCase() : "??";

export default function Classes() {
  const [classes, setClasses]   = useState([]);
  const [effectifs, setEffectifs] = useState({}); // { classe_id: nb }
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState("");
  const [niveauActive, setNiveau] = useState("Tous");
  const [selected, setSelected] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState(null);
  const emptyForm = { nom: "", niveau: "", serie: "", max_effectif: "", titulaire: "", salle: "" };
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesData, etudData] = await Promise.all([
        classeAPI.getAll(),
        etudiantAPI.getAll(),
      ]);
      const list = Array.isArray(classesData) ? classesData : [];
      setClasses(list);
      // Calcul de l'effectif reel par classe
      const counts = {};
      (Array.isArray(etudData) ? etudData : []).forEach((e) => {
        if (e.classe_id != null) counts[e.classe_id] = (counts[e.classe_id] || 0) + 1;
      });
      setEffectifs(counts);
      if (list.length && !selected) setSelected(list[0]);
    } catch (err) {
      setError("Impossible de charger les classes. Verifiez que le backend est demarre.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, []);

  const filtered = classes.filter((c) => {
    const s = search.toLowerCase();
    const matchSearch = (c.nom || "").toLowerCase().includes(s) || (c.titulaire || "").toLowerCase().includes(s);
    const matchNiveau = niveauActive === "Tous" || c.niveau === niveauActive;
    return matchSearch && matchNiveau;
  });

  const niveaux = ["Tous", ...new Set(classes.map((c) => c.niveau).filter(Boolean))];
  const totalEtudiants = Object.values(effectifs).reduce((a, b) => a + b, 0);
  const classePleine = [...classes].sort((a, b) => (effectifs[b.id] || 0) - (effectifs[a.id] || 0))[0];

  const kpis = [
    { label: "Total classes",   value: classes.length, trend: "Annee 2025/2026", icon: BookOpen,       bg: "bg-blue-50",   iconColor: "text-blue-500"   },
    { label: "Total etudiants", value: totalEtudiants,  trend: "Repartis",        icon: Users,          bg: "bg-green-50",  iconColor: "text-green-500"  },
    { label: "Niveaux",         value: niveaux.length - 1, trend: "Cycles",       icon: GraduationCap,  bg: "bg-purple-50", iconColor: "text-purple-500" },
    { label: "Classe + remplie",value: classePleine ? classePleine.nom : "—", trend: classePleine ? `${effectifs[classePleine.id] || 0} eleves` : "", icon: Award, bg: "bg-amber-50", iconColor: "text-amber-500" },
  ];

  const handleExportPDF = () => {
    if (!filtered.length) { alert("Aucune classe a exporter."); return; }
    exporterPDF({
      titre: "Liste des classes",
      sousTitre: `${filtered.length} classe(s)` + (niveauActive !== "Tous" ? ` — ${niveauActive}` : ""),
      colonnes: ["Classe", "Niveau", "Serie", "Effectif", "Capacite", "Titulaire", "Salle"],
      lignes: filtered.map((c) => [
        c.nom || "", c.niveau || "", c.serie || "",
        effectifs[c.id] || 0, c.max_effectif ?? "", c.titulaire || "", c.salle || "",
      ]),
      nomFichier: "classes",
    });
  };

  const handleCreate = async (ev) => {
    ev.preventDefault();
    setFormError(null);
    if (!form.nom.trim()) { setFormError("Le nom de la classe est obligatoire."); return; }
    try {
      setSaving(true);
      await classeAPI.create({
        ...form,
        max_effectif: form.max_effectif ? Number(form.max_effectif) : 50,
      });
      setShowModal(false);
      setForm(emptyForm);
      await fetchData();
    } catch (err) {
      setFormError(err?.message || "Erreur lors de la creation.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette classe ?")) return;
    try { await classeAPI.delete(id); await fetchData(); }
    catch { alert("Suppression impossible (des etudiants y sont peut-etre rattaches)."); }
  };

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-serif text-[26px] font-semibold text-blue-900">Gestion des Classes</h2>
          <p className="text-[13px] text-gray-400 mt-1">Donnees en temps reel depuis la base de donnees</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-[1.5px] border-blue-300 bg-white text-blue-600 text-[13px] font-medium hover:bg-blue-50 transition-all">
            <Download size={14} /> Exporter PDF
          </button>
          <button onClick={() => { setForm(emptyForm); setFormError(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-[13.5px] font-semibold hover:bg-blue-600 transition-all shadow-md shadow-blue-200">
            <Plus size={14} strokeWidth={2.5} /> Nouvelle classe
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
                <p className={`text-[20px] font-bold text-blue-900 leading-none ${loading ? "animate-pulse" : ""}`}>{k.value}</p>
                <p className="text-[10.5px] text-gray-400 uppercase tracking-wide mt-0.5">{k.label}</p>
                <span className="text-[11px] font-semibold mt-1 inline-block text-blue-500">{k.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-[1fr_300px] gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <p className="text-[15px] font-semibold text-blue-900">Liste des classes</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{filtered.length} resultats</p>
            </div>
          </div>

          {/* Search */}
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="Rechercher une classe, titulaire..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-[13px] text-gray-800 placeholder-gray-400 w-full font-sans" />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50 flex-wrap">
            {niveaux.map((n) => (
              <button key={n} onClick={() => setNiveau(n)}
                className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium border transition-all
                  ${niveauActive === n ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-500"}`}>
                {n}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Classe","Niveau","Effectif","Titulaire","Salle","Actions"].map((h) => (
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
                    <p>Aucune classe trouvee</p>
                  </td></tr>
                ) : filtered.map((c) => {
                  const eff = effectifs[c.id] || 0;
                  const max = c.max_effectif || 50;
                  return (
                    <tr key={c.id} onClick={() => setSelected(c)}
                      className={`border-b border-gray-50 cursor-pointer transition-colors
                        ${selected?.id === c.id ? "bg-blue-50" : "hover:bg-blue-50/50"}`}>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${couleurDe(c.id)} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>
                            {initialesDe(c.nom)}
                          </div>
                          <p className="text-[13.5px] font-semibold text-gray-800">{c.nom}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[12px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">{c.niveau || "—"}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-gray-800">{eff}</span>
                          <span className="text-[11px] text-gray-400">/ {max}</span>
                          <div className="w-10 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"
                              style={{ width: `${Math.min((eff / max) * 100, 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <User size={12} className="text-gray-400" />
                          <span className="text-[12.5px] text-gray-600 whitespace-nowrap">{c.titulaire || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[12.5px] text-gray-500">{c.salle || "—"}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5">
                          <button onClick={(ev) => { ev.stopPropagation(); setSelected(c); }}
                            className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500 text-gray-400 transition-all">
                            <Eye size={13} />
                          </button>
                          <button onClick={(ev) => { ev.stopPropagation(); handleDelete(c.id); }}
                            className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:border-red-400 hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="flex flex-col gap-4">
          {selected && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className={`bg-gradient-to-br ${couleurDe(selected.id)} p-5 text-white`}>
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-[20px] font-bold">
                  {initialesDe(selected.nom)}
                </div>
                <p className="text-[16px] font-semibold mt-3">{selected.nom}</p>
                <p className="text-[12px] text-white/80">{selected.niveau} {selected.serie}</p>
              </div>
              <div className="p-5 flex flex-col gap-3 text-[12.5px] text-gray-600">
                <div className="flex items-center gap-2"><Users size={14} className="text-blue-400" /> {effectifs[selected.id] || 0} / {selected.max_effectif || 50} eleves</div>
                <div className="flex items-center gap-2"><User size={14} className="text-blue-400" /> {selected.titulaire || "—"}</div>
                <div className="flex items-center gap-2"><BookOpen size={14} className="text-blue-400" /> {selected.salle || "—"}</div>
              </div>
            </div>
          )}

          {/* Repartition par niveau */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
              <BarChart2 size={15} className="text-blue-500" />
              <p className="text-[14px] font-semibold text-blue-900">Effectif par niveau</p>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {niveaux.slice(1).map((niv) => {
                const total = classes.filter((c) => c.niveau === niv)
                  .reduce((acc, c) => acc + (effectifs[c.id] || 0), 0);
                const maxTotal = totalEtudiants || 1;
                return (
                  <div key={niv}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[13px] font-medium text-gray-700">{niv}</span>
                      <span className="text-[12px] font-bold text-blue-600">{total}</span>
                    </div>
                    <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-300"
                        style={{ width: `${(total / maxTotal) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL — Nouvelle classe */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-serif text-[20px] font-semibold text-blue-900">Nouvelle classe</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">Renseignez les informations ci-dessous</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 mb-4 text-[12.5px]">{formError}</div>
            )}

            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3.5">
              <div className="col-span-2">
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Nom de la classe *</label>
                <input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400" placeholder="Terminale S1" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Niveau</label>
                <input value={form.niveau} onChange={(e) => setForm({ ...form, niveau: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400" placeholder="Terminale" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Serie</label>
                <input value={form.serie} onChange={(e) => setForm({ ...form, serie: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400" placeholder="S1" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Capacite max</label>
                <input type="number" value={form.max_effectif} onChange={(e) => setForm({ ...form, max_effectif: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400" placeholder="50" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Salle</label>
                <input value={form.salle} onChange={(e) => setForm({ ...form, salle: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400" placeholder="A101" />
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Titulaire</label>
                <input value={form.titulaire} onChange={(e) => setForm({ ...form, titulaire: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400" placeholder="Ibrahima Diallo" />
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