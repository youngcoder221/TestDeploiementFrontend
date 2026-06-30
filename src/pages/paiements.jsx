import { useState, useEffect } from "react";
import { paiementAPI, etudiantAPI } from "../services/api";
import {
  DollarSign, CheckCircle, Clock, AlertCircle,
  Download, Plus, TrendingUp,
} from "lucide-react";
import { exporterPDF } from "../utils/exportPdf";

const typeColors = {
  "Frais de scolarité": "bg-blue-50 text-blue-700",
  "Frais d'examen":     "bg-amber-50 text-amber-700",
  "Cantine":            "bg-purple-50 text-purple-700",
  "Transport":          "bg-teal-50 text-teal-700",
};

const statutStyle = {
  "Paye":       "bg-green-100 text-green-700",
  "En attente": "bg-yellow-100 text-yellow-700",
  "Impaye":     "bg-red-100 text-red-700",
};

const COULEURS = [
  "from-blue-500 to-blue-300", "from-sky-400 to-sky-300",
  "from-blue-700 to-blue-500", "from-indigo-500 to-blue-400",
];
const initialesDe = (nom) =>
  nom ? nom.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "??";
const couleurDe = (id) => COULEURS[(Number(id) || 0) % COULEURS.length];

const fmtMontant = (m) => (Number(m) || 0).toLocaleString("fr-FR") + " F";

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  } catch { return d; }
};

export default function Paiements() {
  const [paiements, setPaiements] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [filtre, setFiltre]       = useState("Tous");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState(null);
  const emptyForm = {
    reference: "", etudiant_id: "", type: "Frais de scolarité",
    montant: "", mode: "Wave", statut: "Paye", date_paiement: "",
  };
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paiData, statsData, etudData] = await Promise.all([
        paiementAPI.getAll(),
        paiementAPI.getStats().catch(() => null),
        etudiantAPI.getAll(),
      ]);
      setPaiements(Array.isArray(paiData) ? paiData : []);
      setStats(statsData);
      setEtudiants(Array.isArray(etudData) ? etudData : []);
    } catch (err) {
      setError("Impossible de charger les paiements. Verifiez que le backend est demarre.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchData(); }, []);

  const filtres = ["Tous", "Paye", "En attente", "Impaye"];
  const filtered = paiements.filter((p) => filtre === "Tous" || p.statut === filtre);

  const totalEncaisse = paiements
    .filter((p) => p.statut === "Paye")
    .reduce((acc, p) => acc + (Number(p.montant) || 0), 0);
  const nbPaye    = paiements.filter((p) => p.statut === "Paye").length;
  const nbAttente = paiements.filter((p) => p.statut === "En attente").length;
  const nbImpaye  = paiements.filter((p) => p.statut === "Impaye").length;

  const kpis = [
    { label: "Total encaisse", value: fmtMontant(totalEncaisse), trend: nbPaye + " paiements", trendType: "up",   icon: DollarSign, bg: "bg-green-50",  iconColor: "text-green-500" },
    { label: "Payes",          value: nbPaye,    trend: "Regle",     trendType: "up",   icon: CheckCircle, bg: "bg-blue-50",   iconColor: "text-blue-500"  },
    { label: "En attente",     value: nbAttente, trend: "A traiter", trendType: "warn", icon: Clock,       bg: "bg-yellow-50", iconColor: "text-yellow-500"},
    { label: "Impayes",        value: nbImpaye,  trend: "En retard", trendType: "down", icon: AlertCircle, bg: "bg-red-50",    iconColor: "text-red-500"   },
  ];

  const handleExportPDF = () => {
    if (!filtered.length) { alert("Aucun paiement a exporter."); return; }
    exporterPDF({
      titre: "Liste des paiements",
      sousTitre: filtered.length + " transaction(s)" + (filtre !== "Tous" ? " — " + filtre : ""),
      colonnes: ["Reference", "Etudiant", "Type", "Montant", "Mode", "Date", "Statut"],
      lignes: filtered.map((p) => [
        p.reference || "",
        p.etudiant_nom || ("#" + p.etudiant_id),
        p.type || "",
        fmtMontant(p.montant),
        p.mode || "",
        fmtDate(p.date_paiement),
        p.statut || "",
      ]),
      nomFichier: "paiements",
    });
  };

  const handleCreate = async (ev) => {
    ev.preventDefault();
    setFormError(null);
    if (!form.reference.trim() || !form.etudiant_id || !form.montant) {
      setFormError("Reference, etudiant et montant sont obligatoires.");
      return;
    }
    try {
      setSaving(true);
      await paiementAPI.create({
        ...form,
        montant: Number(form.montant),
        date_paiement: form.date_paiement || null,
      });
      setShowModal(false);
      setForm(emptyForm);
      await fetchData();
    } catch (err) {
      setFormError((err && err.message) || "Erreur lors de l'enregistrement. La reference existe peut-etre deja.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">

      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-serif text-[26px] font-semibold text-blue-900">Gestion des Paiements</h2>
          <p className="text-[13px] text-gray-400 mt-1">Donnees en temps reel depuis la base de donnees</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-[1.5px] border-blue-300 bg-white text-blue-600 text-[13px] font-medium hover:bg-blue-50 transition-all">
            <Download size={14} /> Exporter PDF
          </button>
          <button onClick={() => { setForm(emptyForm); setFormError(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-[13.5px] font-semibold hover:bg-blue-600 transition-all shadow-md shadow-blue-200">
            <Plus size={14} strokeWidth={2.5} /> Nouveau paiement
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-[13px]">{error}</div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white border border-gray-200 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
              <div className={"w-11 h-11 rounded-xl flex items-center justify-center mb-3 " + k.bg}>
                <Icon size={22} className={k.iconColor} />
              </div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold mb-1">{k.label}</p>
              <p className={"text-[24px] font-bold text-blue-900 leading-none mb-1 " + (loading ? "animate-pulse" : "")}>{k.value}</p>
              <span className={"text-[11.5px] font-semibold " + (k.trendType === "up" ? "text-green-600" : k.trendType === "down" ? "text-red-600" : "text-yellow-600")}>
                {k.trend}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-5">

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <p className="text-[15px] font-semibold text-blue-900">Transactions</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{filtered.length} resultats</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
            {filtres.map((f) => (
              <button key={f} onClick={() => setFiltre(f)}
                className={"px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition-all " +
                  (filtre === f ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-500")}>
                {f}
              </button>
            ))}
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Reference", "Etudiant", "Type", "Montant", "Mode", "Date", "Statut"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">Aucun paiement trouve</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3.5 text-[12.5px] font-mono text-gray-500">{p.reference}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={"w-8 h-8 rounded-full bg-gradient-to-br " + couleurDe(p.etudiant_id) + " flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"}>
                        {initialesDe(p.etudiant_nom)}
                      </div>
                      <span className="text-[13px] font-semibold text-gray-800">{p.etudiant_nom || ("#" + p.etudiant_id)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={"text-[11.5px] font-medium px-2.5 py-1 rounded-full " + (typeColors[p.type] || "bg-gray-100 text-gray-600")}>
                      {p.type || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[14px] font-bold text-blue-800 whitespace-nowrap">{fmtMontant(p.montant)}</td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-600">{p.mode || "—"}</td>
                  <td className="px-4 py-3.5 text-[12.5px] text-gray-500 whitespace-nowrap">{fmtDate(p.date_paiement)}</td>
                  <td className="px-4 py-3.5">
                    <span className={"text-[11.5px] font-semibold px-2.5 py-1 rounded-full " + (statutStyle[p.statut] || "bg-gray-100 text-gray-600")}>
                      {p.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100">
              <p className="text-[14px] font-semibold text-blue-900">Repartition par statut</p>
            </div>
            <div className="p-5 flex flex-col gap-3.5">
              {[
                { label: "Payes",      n: nbPaye,    color: "from-green-500 to-green-300" },
                { label: "En attente", n: nbAttente, color: "from-yellow-500 to-yellow-300" },
                { label: "Impayes",    n: nbImpaye,  color: "from-red-500 to-red-300" },
              ].map((r) => {
                const total = paiements.length || 1;
                const pct = Math.round((r.n / total) * 100);
                return (
                  <div key={r.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[13px] font-medium text-gray-700">{r.label}</span>
                      <span className="text-[12px] font-bold text-blue-600">{r.n} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={"h-full rounded-full bg-gradient-to-r " + r.color} style={{ width: pct + "%" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
              <TrendingUp size={15} className="text-blue-500" />
              <p className="text-[14px] font-semibold text-blue-900">Resume</p>
            </div>
            <div className="p-5 flex flex-col gap-2 text-[13px] text-gray-600">
              <div className="flex justify-between"><span>Total transactions</span><span className="font-bold text-blue-900">{paiements.length}</span></div>
              <div className="flex justify-between"><span>Montant encaisse</span><span className="font-bold text-green-600">{fmtMontant(totalEncaisse)}</span></div>
              <div className="flex justify-between"><span>En attente</span><span className="font-bold text-yellow-600">{nbAttente}</span></div>
            </div>
          </div>
        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-serif text-[20px] font-semibold text-blue-900">Nouveau paiement</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">Enregistrer une transaction</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 mb-4 text-[12.5px]">{formError}</div>
            )}

            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Reference *</label>
                <input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400"
                  placeholder="PAY-2026-100" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Etudiant *</label>
                <select value={form.etudiant_id} onChange={(e) => setForm({ ...form, etudiant_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400 bg-white">
                  <option value="">— Choisir —</option>
                  {etudiants.map((et) => (
                    <option key={et.id} value={et.id}>{et.nom} ({et.matricule})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400 bg-white">
                  <option>Frais de scolarité</option>
                  <option>Frais d'examen</option>
                  <option>Cantine</option>
                  <option>Transport</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Montant (F) *</label>
                <input type="number" value={form.montant} onChange={(e) => setForm({ ...form, montant: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400"
                  placeholder="150000" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Mode</label>
                <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400 bg-white">
                  <option>Wave</option>
                  <option>Orange Money</option>
                  <option>Virement</option>
                  <option>Espèces</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Statut</label>
                <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400 bg-white">
                  <option value="Paye">Paye</option>
                  <option value="En attente">En attente</option>
                  <option value="Impaye">Impaye</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[12px] font-semibold text-gray-500 mb-1">Date de paiement</label>
                <input type="date" value={form.date_paiement} onChange={(e) => setForm({ ...form, date_paiement: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-blue-400" />
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