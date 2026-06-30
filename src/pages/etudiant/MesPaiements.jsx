import EtudiantLayout from "../../layouts/EtudiantLayout";
import { CheckCircle, AlertCircle, Clock, CreditCard } from "lucide-react";

const paiements = [
  { ref: "PAY-0291", type: "Scolarite T1",  montant: "150 000 F", mode: "Wave",         date: "15 Oct 2025",  statut: "Paye"       },
  { ref: "PAY-0290", type: "Cantine T1",    montant: "25 000 F",  mode: "Especes",      date: "01 Nov 2025",  statut: "Paye"       },
  { ref: "PAY-0289", type: "Scolarite T2",  montant: "150 000 F", mode: "Virement",     date: "15 Jan 2026",  statut: "Paye"       },
  { ref: "PAY-0288", type: "Cantine T2",    montant: "25 000 F",  mode: "Orange Money", date: "01 Fev 2026",  statut: "Paye"       },
  { ref: "PAY-0287", type: "Scolarite T3",  montant: "150 000 F", mode: "—",            date: "Echeance Mai", statut: "En attente" },
  { ref: "PAY-0286", type: "Transport",     montant: "40 000 F",  mode: "Wave",         date: "01 Sep 2025",  statut: "Paye"       },
];

const total = paiements.filter(p => p.statut === "Paye").reduce((s, p) => s + parseInt(p.montant.replace(/\D/g,"")), 0);

export default function MesPaiements() {
  return (
    <EtudiantLayout>
      <div className="p-8">
        <div className="mb-6">
          <h2 className="font-serif text-[26px] font-semibold text-blue-900">Mes paiements</h2>
          <p className="text-[13px] text-gray-400 mt-1">Annee scolaire 2025/2026</p>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:border-sky-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={24} className="text-green-500" />
            </div>
            <div>
              <p className="text-[24px] font-bold text-green-600">{paiements.filter(p => p.statut === "Paye").length}</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide">Paiements effectues</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:border-sky-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={24} className="text-yellow-500" />
            </div>
            <div>
              <p className="text-[24px] font-bold text-yellow-600">{paiements.filter(p => p.statut === "En attente").length}</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide">En attente</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:border-sky-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
              <CreditCard size={24} className="text-sky-500" />
            </div>
            <div>
              <p className="text-[22px] font-bold text-sky-700">{total.toLocaleString("fr-FR")} F</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide">Total paye</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-[15px] font-semibold text-blue-900">Historique des paiements</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Reference","Type","Montant","Mode","Date","Statut"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paiements.map((p) => (
                <tr key={p.ref} className="border-b border-gray-50 last:border-0 hover:bg-sky-50/30 transition-colors">
                  <td className="px-5 py-3.5 text-[11.5px] text-gray-400 font-semibold">#{p.ref}</td>
                  <td className="px-5 py-3.5 text-[13.5px] font-semibold text-gray-800">{p.type}</td>
                  <td className="px-5 py-3.5 text-[14px] font-bold text-sky-700">{p.montant}</td>
                  <td className="px-5 py-3.5 text-[13px] text-gray-500">{p.mode}</td>
                  <td className="px-5 py-3.5 text-[12.5px] text-gray-400">{p.date}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full
                      ${p.statut === "Paye" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {p.statut === "Paye" ? <CheckCircle size={11} /> : <Clock size={11} />}
                      {p.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </EtudiantLayout>
  );
}