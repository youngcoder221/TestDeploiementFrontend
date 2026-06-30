import { useState, useEffect } from "react";
import { etudiantAPI, classeAPI } from "../services/api";
import {
  Users, UserCheck, AlertTriangle, UserPlus,
  Search, Download, Plus, Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight, Mail, CreditCard, BarChart2, Clock
} from "lucide-react";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";

const repartition = [
  { classe: "Terminale S", count: 680, pct: 68 },
  { classe: "Terminale L", count: 520, pct: 52 },
  { classe: "Premiere",    count: 610, pct: 61 },
  { classe: "3eme",        count: 590, pct: 59 },
  { classe: "2nde",        count: 600, pct: 60 },
];

export default function Etudiants() {
  const [etudiants, setEtudiants]   = useState([]);
  const [stats, setStats]           = useState(null);
  const [classes, setClasses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState("");
  const [classeActive, setClasse]   = useState("");
  const [statutFiltre, setStatut]   = useState("");
  const [selected, setSelected]     = useState(null);
  const [page, setPage]             = useState(1);
  const [showModal, setShowModal]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState(null);
  const emptyForm = { matricule: "", nom: "", email: "", phone: "", age: "", classe_id: "", statut: "Actif" };
  const [form, setForm]             = useState(emptyForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search)       params.search    = search;
      if (classeActive) params.classe_id = classeActive;
      if (statutFiltre) params.statut    = statutFiltre;

      const [etudData, statsData, classesData] = await Promise.all([
        etudiantAPI.getAll(params),
        etudiantAPI.getStats(),
        classeAPI.getAll(),
      ]);
      setEtudiants(etudData);
      setStats(statsData);
      setClasses(classesData);
      if (etudData.length > 0 && !selected) setSelected(etudData[0]);
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [search, classeActive, statutFiltre]);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet etudiant ?")) return;
    await etudiantAPI.delete(id);
    fetchData();
  };

  // Export CSV de la liste actuellement affichée
  const handleExport = () => {
    if (!etudiants.length) { alert("Aucun etudiant a exporter."); return; }
    const entetes = ["Matricule", "Nom", "Email", "Telephone", "Age", "Classe", "Statut"];
    const lignes = etudiants.map((e) => [
      e.matricule || "",
      e.nom || "",
      e.email || "",
      e.phone || "",
      e.age || "",
      e.classe_nom || "",
      e.statut || "",
    ]);
    const echap = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [entetes, ...lignes].map((r) => r.map(echap).join(";")).join("\n");
    // BOM pour qu'Excel lise correctement les accents
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `etudiants_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Création d'un nouvel étudiant
  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!form.matricule.trim() || !form.nom.trim()) {
      setFormError("Le matricule et le nom sont obligatoires.");
      return;
    }
    try {
      setSaving(true);
      await etudiantAPI.create({
        ...form,
        age: form.age ? Number(form.age) : null,
        classe_id: form.classe_id || null,
      });
      setShowModal(false);
      setForm(emptyForm);
      await fetchData();
    } catch (err) {
      setFormError(err?.message || "Erreur lors de la creation. Le matricule existe peut-etre deja.");
    } finally {
      setSaving(false);
    }
  };

  const kpis = [
    { label: "Total inscrits",   value: stats ? stats.total    : "...", trendType: "up",   icon: Users,         bg: "bg-blue-50",   iconColor: "text-blue-500"   },
    { label: "Actifs",           value: stats ? stats.actifs   : "...", trendType: "up",   icon: UserCheck,     bg: "bg-green-50",  iconColor: "text-green-500"  },
    { label: "En difficulte",    value: stats ? stats.difficulte:"...", trendType: "warn", icon: AlertTriangle, bg: "bg-yellow-50", iconColor: "text-yellow-500" },
    { label: "Nouveaux ce mois", value: stats ? stats.nouveaux : "...", trendType: "up",   icon: UserPlus,      bg: "bg-purple-50", iconColor: "text-purple-500" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-serif text-[26px] font-semibold text-blue-900">Gestion des Etudiants</h2>
          <p className="text-[13px] text-gray-400 mt-1">Donnees en temps reel depuis la base de donnees</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-[1.5px] border-blue-300 bg-white text-blue-600 text-[13px] font-medium hover:bg-blue-50 transition-all">
            <Download size={14} /> Exporter
          </button>
          <button onClick={() => { setForm(emptyForm); setFormError(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-[13.5px] font-semibold hover:bg-blue-600 transition-all shadow-md shadow-blue-200">
            <Plus size={14} strokeWidth={2.5} /> Nouvel etudiant
          </button>
        </div>
      </div>

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
            <div key={k.label} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-1 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${k.bg}`}>
                <Icon size={22} className={k.iconColor} />
              </div>
              <div>
                <p className={`text-[22px] font-bold text-blue-900 leading-none ${loading ? "animate-pulse" : ""}`}>{k.value}</p>
                <p className="text-[10.5px] text-gray-400 uppercase tracking-wide mt-0.5">{k.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-5">
        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <p className="text-[15px] font-semibold text-blue-900">Liste des etudiants</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{etudiants.length} resultats</p>
            </div>
          </div>

          {/* Search */}
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2 focus-within:border-blue-400 transition-all">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="Rechercher..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-[13px] text-gray-800 placeholder-gray-400 w-full font-sans" />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50 flex-wrap">
            <button onClick={() => setClasse("")}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all
                ${!classeActive ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-blue-400"}`}>
              Toutes
            </button>
            {classes.map((c) => (
              <button key={c.id} onClick={() => setClasse(c.id)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all
                  ${classeActive === c.id ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-blue-400"}`}>
                {c.nom}
              </button>
            ))}
            <select value={statutFiltre} onChange={(e) => setStatut(e.target.value)}
              className="ml-auto px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-[12px] text-gray-600 outline-none font-sans">
              <option value="">Tous statuts</option>
              <option value="Actif">Actif</option>
              <option value="Difficulte">Difficulte</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Etudiant","Matricule","Classe","Age","Statut","Actions"].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : etudiants.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400">
                    <Search size={32} className="mx-auto mb-2 opacity-30" />
                    <p>Aucun etudiant trouve</p>
                  </td></tr>
                ) : etudiants.map((e) => (
                  <tr key={e.id} onClick={() => setSelected(e)}
                    className={`border-b border-gray-50 cursor-pointer transition-colors
                      ${selected?.id === e.id ? "bg-blue-50" : "hover:bg-blue-50/50"}`}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                          {e.nom ? e.nom.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "??"}
                        </div>
                        <div>
                          <p className="text-[13.5px] font-semibold text-gray-800">{e.nom}</p>
                          <p className="text-[11px] text-gray-400">{e.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[11.5px] text-gray-400 font-semibold">{e.matricule}</td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-500">{e.classe_nom || "—"}</td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-500">{e.age ? e.age + " ans" : "—"}</td>
                    <td className="px-4 py-3.5"><Badge statut={e.statut} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5">
                        <button onClick={(ev) => { ev.stopPropagation(); setSelected(e); }}
                          className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500 text-gray-400 transition-all">
                          <Eye size={13} />
                        </button>
                        <button onClick={(ev) => { ev.stopPropagation(); }}
                          className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500 text-gray-400 transition-all">
                          <Pencil size={13} />
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

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-gray-50 border-t border-gray-100">
            <p className="text-[12.5px] text-gray-400">{etudiants.length} etudiants charges</p>
            <div className="flex gap-1">
              <button className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-400 flex items-center justify-center hover:border-blue-400 hover:text-blue-500 transition-all">
                <ChevronLeft size={14} />
              </button>
              <button className="w-8 h-8 rounded-lg text-[13px] border bg-blue-500 border-blue-500 text-white font-medium">1</button>
              <button className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-400 flex items-center justify-center hover:border-blue-400 hover:text-blue-500 transition-all">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* SIDE */}
        <div className="flex flex-col gap-4">
          {selected && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="h-16 bg-gradient-to-r from-blue-700 to-blue-400" />
              <div className="px-5 pb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center text-white text-xl font-bold border-[3px] border-white -mt-7 mb-3 shadow-lg">
                  {selected.nom ? selected.nom.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "??"}
                </div>
                <p className="text-[16px] font-bold text-blue-900">{selected.nom}</p>
                <p className="text-[12px] text-gray-400 mb-4">{selected.classe_nom || "—"} · {selected.matricule}</p>
                {[
                  { icon: <Mail size={13} />,     label: "Email",  value: selected.email  },
                  { icon: <Users size={13} />,    label: "Age",    value: selected.age ? selected.age + " ans" : "—" },
                  { icon: <BarChart2 size={13} />,label: "Statut", value: selected.statut },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-400">{row.icon}</span>
                    <span className="text-[12.5px] text-gray-500">{row.label}</span>
                    <span className="ml-auto text-[12.5px] font-semibold text-gray-800 truncate max-w-[140px]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
              <BarChart2 size={15} className="text-blue-500" />
              <p className="text-[14px] font-semibold text-blue-900">Repartition par classe</p>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {repartition.map((r) => (
                <div key={r.classe}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[13px] font-medium text-gray-700">{r.classe}</span>
                    <span className="text-[12px] font-bold text-blue-600">{r.count}</span>
                  </div>
                  <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-300" style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL — Nouvel etudiant */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-serif text-[20px] font-semibold text-blue-900">Nouvel etudiant</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">Renseignez les informations ci-dessous</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 mb-4 text-[12.5px]">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Matricule *</label>
                <input value={form.matricule} onChange={(e) => setForm({ ...form, matricule: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400"
                  placeholder="ETU-0201" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Nom complet *</label>
                <input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400"
                  placeholder="Awa Diop" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400"
                  placeholder="awa.diop@etu.sn" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Telephone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400"
                  placeholder="771234567" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Age</label>
                <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400"
                  placeholder="16" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Classe</label>
                <select value={form.classe_id} onChange={(e) => setForm({ ...form, classe_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400 bg-white">
                  <option value="">— Choisir —</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Statut</label>
                <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400 bg-white">
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="Difficulte">En difficulte</option>
                </select>
              </div>

              <div className="col-span-2 flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-[13px] font-medium hover:bg-gray-50 transition-all">
                  Annuler
                </button>
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