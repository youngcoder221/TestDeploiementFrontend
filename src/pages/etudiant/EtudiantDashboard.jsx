import EtudiantLayout from "../../layouts/EtudiantLayout";
import { TrendingUp, CreditCard, Award, Clock, CheckCircle, AlertCircle } from "lucide-react";

const kpis = [
  { label: "Ma moyenne",      value: "17.9", trend: "1er de classe",    trendType: "up",   icon: TrendingUp,  bg: "bg-sky-50",    iconColor: "text-sky-500"    },
  { label: "Mon rang",        value: "1er",  trend: "sur 45 etudiants", trendType: "up",   icon: Award,       bg: "bg-amber-50",  iconColor: "text-amber-500"  },
  { label: "Paiement",        value: "OK",   trend: "A jour",           trendType: "up",   icon: CreditCard,  bg: "bg-green-50",  iconColor: "text-green-500"  },
  { label: "Cours auj.",      value: "4",    trend: "Mercredi",         trendType: "warn", icon: Clock,       bg: "bg-blue-50",   iconColor: "text-blue-500"   },
];

const mesNotes = [
  { matiere: "Mathematiques", note: 18, coeff: 5, mention: "Tres Bien",  color: "text-green-600" },
  { matiere: "Francais",      note: 19, coeff: 4, mention: "Tres Bien",  color: "text-green-600" },
  { matiere: "Sciences",      note: 16, coeff: 4, mention: "Tres Bien",  color: "text-green-600" },
  { matiere: "Histoire-Geo",  note: 17, coeff: 3, mention: "Tres Bien",  color: "text-green-600" },
  { matiere: "Anglais",       note: 18, coeff: 3, mention: "Tres Bien",  color: "text-green-600" },
];

const coursAujourdhui = [
  { heure: "08h-09h", matiere: "Francais",        prof: "Mme Mbaye",  salle: "Salle 01", statut: "Termine",  color: "bg-gray-200 text-gray-500"   },
  { heure: "10h-12h", matiere: "Mathematiques",   prof: "M. Diallo",  salle: "Salle 12", statut: "En cours", color: "bg-green-100 text-green-700" },
  { heure: "14h-15h", matiere: "Histoire-Geo",    prof: "M. Ndiaye",  salle: "Salle 05", statut: "A venir",  color: "bg-sky-100 text-sky-700"     },
  { heure: "16h-17h", matiere: "Anglais",         prof: "Mme Fall",   salle: "Salle 03", statut: "A venir",  color: "bg-sky-100 text-sky-700"     },
];

const paiements = [
  { type: "Scolarite T2",  montant: "150 000 F", date: "02 Mars 2026",  statut: "Paye" },
  { type: "Cantine Avril", montant: "25 000 F",  date: "01 Avril 2026", statut: "Paye" },
  { type: "Scolarite T3",  montant: "150 000 F", date: "Echeance Mai",  statut: "En attente" },
];

export default function EtudiantDashboard() {
  const moyenne = (mesNotes.reduce((s, n) => s + n.note * n.coeff, 0) /
    mesNotes.reduce((s, n) => s + n.coeff, 0)).toFixed(1);

  return (
    <EtudiantLayout>
      <div className="p-8">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="font-serif text-[26px] font-semibold text-blue-900">Mon tableau de bord</h2>
          <p className="text-[13px] text-gray-400 mt-1">Terminale L — Trimestre 2 — Annee 2025/2026</p>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-1 hover:shadow-lg hover:border-sky-300 transition-all duration-200">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${k.bg}`}>
                  <Icon size={22} className={k.iconColor} />
                </div>
                <div>
                  <p className="text-[22px] font-bold text-blue-900 leading-none">{k.value}</p>
                  <p className="text-[10.5px] text-gray-400 uppercase tracking-wide mt-0.5">{k.label}</p>
                  <span className={`text-[11px] font-semibold mt-0.5 inline-block
                    ${k.trendType === "up" ? "text-green-600" : "text-sky-500"}`}>
                    {k.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-[1fr_320px] gap-5">

          {/* GAUCHE */}
          <div className="flex flex-col gap-5">

            {/* MES NOTES */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <p className="text-[15px] font-semibold text-blue-900">Mes notes — Trimestre 2</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">Moyenne : <strong className="text-sky-600">{moyenne} / 20</strong></p>
                </div>
                <span className="text-[12px] font-bold text-white bg-green-500 px-3 py-1.5 rounded-full">
                  Tres Bien
                </span>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Matiere","Note","Coeff","Mention","Barre"].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mesNotes.map((n) => (
                    <tr key={n.matiere} className="border-b border-gray-50 hover:bg-sky-50/30 transition-colors">
                      <td className="px-5 py-3.5 text-[13.5px] font-semibold text-gray-800">{n.matiere}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[16px] font-bold ${n.color}`}>{n.note}</span>
                        <span className="text-[12px] text-gray-400"> / 20</span>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-gray-500">{n.coeff}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                          {n.mention}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 w-28">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-400"
                            style={{ width: `${(n.note / 20) * 100}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MES PAIEMENTS */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <p className="text-[15px] font-semibold text-blue-900">Mes paiements</p>
                <span className="text-[12px] text-green-600 font-semibold bg-green-50 border border-green-200 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle size={12} /> Compte a jour
                </span>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Type","Montant","Date","Statut"].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paiements.map((p, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-sky-50/30 transition-colors">
                      <td className="px-5 py-3.5 text-[13.5px] font-semibold text-gray-800">{p.type}</td>
                      <td className="px-5 py-3.5 text-[14px] font-bold text-sky-700">{p.montant}</td>
                      <td className="px-5 py-3.5 text-[12.5px] text-gray-500">{p.date}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit
                          ${p.statut === "Paye" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {p.statut === "Paye" ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
                          {p.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DROITE */}
          <div className="flex flex-col gap-5">

            {/* COURS DU JOUR */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                <Clock size={15} className="text-sky-500" />
                <p className="text-[14px] font-semibold text-blue-900">Mes cours aujourd'hui</p>
              </div>
              <div>
                {coursAujourdhui.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 last:border-0 hover:bg-sky-50 transition-colors">
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-gray-800">{c.matiere}</p>
                      <p className="text-[11px] text-gray-400">{c.prof} · {c.salle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold text-gray-600">{c.heure}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.color}`}>
                        {c.statut}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PROGRESSION */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <p className="text-[14px] font-semibold text-blue-900">Ma progression</p>
              </div>
              <div className="p-5 flex flex-col gap-3.5">
                {mesNotes.map((n) => (
                  <div key={n.matiere}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[12.5px] font-medium text-gray-700">{n.matiere}</span>
                      <span className="text-[12px] font-bold text-sky-600">{n.note} / 20</span>
                    </div>
                    <div className="h-2 bg-sky-50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-400"
                        style={{ width: `${(n.note / 20) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INFOS */}
            <div className="bg-gradient-to-br from-sky-500 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
              <p className="text-[13px] font-semibold mb-1 opacity-80">Mention actuelle</p>
              <p className="text-[28px] font-bold">Tres Bien</p>
              <p className="text-[12px] opacity-70 mt-1">Moyenne : {moyenne} / 20</p>
              <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[20px] font-bold">1er</p>
                  <p className="text-[11px] opacity-70">Rang classe</p>
                </div>
                <div>
                  <p className="text-[20px] font-bold">97%</p>
                  <p className="text-[11px] opacity-70">Assiduite</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </EtudiantLayout>
  );
}