import { useState } from "react";
import EnseignantLayout from "../../layouts/EnseignantLayout";
import {
  ChevronLeft, ChevronRight, Plus, Download,
  MapPin, User, Clock, Calendar
} from "lucide-react";

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const heures = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const CELL_HEIGHT = 68;

// Cours de CET enseignant uniquement
const mesCours = [
  { jour: "Lundi",    debut: 8,  duree: 1, classe: "Terminale S", salle: "Salle 12", color: "bg-indigo-100 border-l-4 border-indigo-500 text-indigo-800" },
  { jour: "Lundi",    debut: 14, duree: 1, classe: "3eme A",       salle: "Salle 12", color: "bg-blue-100 border-l-4 border-blue-500 text-blue-800"       },
  { jour: "Mardi",    debut: 10, duree: 2, classe: "Premiere",     salle: "Salle 12", color: "bg-sky-100 border-l-4 border-sky-500 text-sky-800"           },
  { jour: "Mardi",    debut: 16, duree: 1, classe: "Terminale S",  salle: "Salle 12", color: "bg-indigo-100 border-l-4 border-indigo-500 text-indigo-800"  },
  { jour: "Mercredi", debut: 8,  duree: 1, classe: "Premiere",     salle: "Salle 12", color: "bg-sky-100 border-l-4 border-sky-500 text-sky-800"           },
  { jour: "Mercredi", debut: 10, duree: 2, classe: "Terminale S",  salle: "Salle 12", color: "bg-indigo-100 border-l-4 border-indigo-500 text-indigo-800"  },
  { jour: "Jeudi",    debut: 8,  duree: 1, classe: "3eme A",       salle: "Salle 12", color: "bg-blue-100 border-l-4 border-blue-500 text-blue-800"        },
  { jour: "Jeudi",    debut: 14, duree: 2, classe: "Premiere",     salle: "Salle 12", color: "bg-sky-100 border-l-4 border-sky-500 text-sky-800"           },
  { jour: "Vendredi", debut: 8,  duree: 1, classe: "Terminale S",  salle: "Salle 12", color: "bg-indigo-100 border-l-4 border-indigo-500 text-indigo-800"  },
  { jour: "Vendredi", debut: 14, duree: 1, classe: "3eme A",       salle: "Salle 12", color: "bg-blue-100 border-l-4 border-blue-500 text-blue-800"        },
];

const coursAujourdhui = [
  { heure: "08h-09h", classe: "Terminale S", salle: "Salle 12", statut: "Termine",  color: "bg-gray-100 text-gray-500"    },
  { heure: "10h-12h", classe: "Terminale S", salle: "Salle 12", statut: "En cours", color: "bg-green-100 text-green-700"  },
  { heure: "14h-15h", classe: "3eme A",      salle: "Salle 12", statut: "A venir",  color: "bg-indigo-100 text-indigo-700"},
];

const classeColors = {
  "Terminale S": "bg-indigo-50 text-indigo-700 border border-indigo-200",
  "Premiere":    "bg-sky-50 text-sky-700 border border-sky-200",
  "3eme A":      "bg-blue-50 text-blue-700 border border-blue-200",
};

export default function EnseignantPlanning() {
  const [classeFiltre, setClasseFiltre] = useState("Toutes");
  const [vue, setVue] = useState("Semaine");

  const filtered = mesCours.filter(c =>
    classeFiltre === "Toutes" || c.classe === classeFiltre
  );

  // Stats
  const totalHeures = mesCours.reduce((s, c) => s + c.duree, 0);
  const classesUniques = [...new Set(mesCours.map(c => c.classe))];

  return (
    <EnseignantLayout>
      <div className="p-8">

        {/* HEADER */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-serif text-[26px] font-semibold text-blue-900">Mon emploi du temps</h2>
            <p className="text-[13px] text-gray-400 mt-1">Semaine du 2 au 6 Juin 2026 — Mathematiques</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-[1.5px] border-indigo-300 bg-white text-indigo-600 text-[13px] font-medium hover:bg-indigo-50 transition-all">
              <Download size={14} /> Exporter PDF
            </button>
          </div>
        </div>

        {/* STATS RAPIDES */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Heures / semaine", value: totalHeures + "h",        icon: Clock,    color: "text-indigo-500", bg: "bg-indigo-50" },
            { label: "Mes classes",      value: classesUniques.length,     icon: User,     color: "text-blue-500",   bg: "bg-blue-50"   },
            { label: "Cours / semaine",  value: mesCours.length,           icon: Calendar, color: "text-sky-500",    bg: "bg-sky-50"    },
            { label: "Salles",           value: "Salle 12",                icon: MapPin,   color: "text-green-500",  bg: "bg-green-50"  },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-300 transition-all duration-200">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                  <Icon size={20} className={s.color} />
                </div>
                <div>
                  <p className="text-[20px] font-bold text-blue-900 leading-none">{s.value}</p>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {/* Navigation semaine */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-500 transition-all">
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 text-[13px] font-semibold text-blue-900 border-x border-gray-200 h-9 flex items-center">
              2 — 6 Juin 2026
            </span>
            <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-500 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Aujourd'hui */}
          <button className="px-4 py-2 rounded-xl border border-indigo-300 bg-white text-indigo-600 text-[13px] font-medium hover:bg-indigo-50 transition-all">
            Aujourd'hui
          </button>

          {/* Vue tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {["Jour", "Semaine"].map((v) => (
              <button key={v} onClick={() => setVue(v)}
                className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all
                  ${vue === v ? "bg-white text-indigo-600 shadow-sm font-semibold" : "text-gray-400 hover:text-gray-600"}`}>
                {v}
              </button>
            ))}
          </div>

          {/* Filtre classe */}
          <div className="flex items-center gap-2 ml-auto">
            {["Toutes", "Terminale S", "Premiere", "3eme A"].map((c) => (
              <button key={c} onClick={() => setClasseFiltre(c)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all
                  ${classeFiltre === c
                    ? "bg-indigo-500 border-indigo-500 text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-500"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* GRILLE */}
        <div className="grid grid-cols-[1fr_280px] gap-5">

          {/* CALENDRIER */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

            {/* En-têtes jours */}
            <div className="grid border-b border-gray-200"
              style={{ gridTemplateColumns: "60px repeat(5, 1fr)" }}>
              <div className="bg-gray-50 border-r border-gray-200" />
              {[
                { j: "LUN", n: "2" },
                { j: "MAR", n: "3" },
                { j: "MER", n: "4", today: true },
                { j: "JEU", n: "5" },
                { j: "VEN", n: "6" },
              ].map((d) => (
                <div key={d.j} className={`text-center py-3 border-r border-gray-100 last:border-0 ${d.today ? "bg-indigo-50" : "bg-gray-50"}`}>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{d.j}</p>
                  {d.today ? (
                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[16px] font-bold mx-auto mt-1">
                      {d.n}
                    </div>
                  ) : (
                    <p className="text-[20px] font-bold text-blue-900 mt-1">{d.n}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Grille horaire */}
            <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
              <div className="grid" style={{ gridTemplateColumns: "60px repeat(5, 1fr)" }}>

                {/* Colonne heures */}
                <div className="border-r border-gray-200">
                  {heures.map((h) => (
                    <div key={h} className="border-b border-gray-100 flex items-start justify-end pr-2 pt-1"
                      style={{ height: `${CELL_HEIGHT}px` }}>
                      <span className="text-[11px] font-semibold text-gray-400">{h}h</span>
                    </div>
                  ))}
                </div>

                {/* Colonnes jours */}
                {jours.map((jour) => {
                  const coursDuJour = filtered.filter(c => c.jour === jour);
                  return (
                    <div key={jour}
                      className={`relative border-r border-gray-100 last:border-0 ${jour === "Mercredi" ? "bg-indigo-50/30" : ""}`}
                      style={{ height: `${CELL_HEIGHT * heures.length}px` }}>
                      {/* Lignes horaires */}
                      {heures.map((h) => (
                        <div key={h} className="absolute w-full border-b border-gray-100"
                          style={{ top: `${(h - 8) * CELL_HEIGHT}px`, height: `${CELL_HEIGHT}px` }} />
                      ))}
                      {/* Blocs cours */}
                      {coursDuJour.map((c, i) => (
                        <div key={i}
                          className={`absolute left-1 right-1 rounded-xl px-2.5 py-2 cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all duration-150 ${c.color}`}
                          style={{
                            top: `${(c.debut - 8) * CELL_HEIGHT + 2}px`,
                            height: `${c.duree * CELL_HEIGHT - 4}px`,
                          }}>
                          <p className="text-[12px] font-bold leading-tight truncate">Mathematiques</p>
                          <div className="flex items-center gap-1 mt-1">
                            <User size={9} className="opacity-60 flex-shrink-0" />
                            <p className="text-[10px] opacity-75 truncate">{c.classe}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin size={9} className="opacity-60 flex-shrink-0" />
                            <p className="text-[10px] opacity-75 truncate">{c.salle}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock size={9} className="opacity-60 flex-shrink-0" />
                            <p className="text-[10px] opacity-75">{c.debut}h — {c.debut + c.duree}h</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SIDE */}
          <div className="flex flex-col gap-4">

            {/* COURS DU JOUR */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                <Calendar size={15} className="text-indigo-500" />
                <p className="text-[14px] font-semibold text-blue-900">Mercredi 4 — Mes cours</p>
              </div>
              <div>
                {coursAujourdhui.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 last:border-0 hover:bg-indigo-50 transition-colors">
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-gray-800">Mathematiques</p>
                      <p className="text-[11px] text-gray-400">{c.classe} · {c.salle}</p>
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

            {/* MES CLASSES */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                <User size={15} className="text-indigo-500" />
                <p className="text-[14px] font-semibold text-blue-900">Mes classes</p>
              </div>
              <div className="p-4 flex flex-col gap-2.5">
                {classesUniques.map((c) => {
                  const nbCours = mesCours.filter(m => m.classe === c).length;
                  const nbHeures = mesCours.filter(m => m.classe === c).reduce((s, m) => s + m.duree, 0);
                  return (
                    <div key={c} className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${classeColors[c]}`}>
                      <div>
                        <p className="text-[13px] font-semibold">{c}</p>
                        <p className="text-[11px] opacity-70">{nbCours} cours · {nbHeures}h/sem</p>
                      </div>
                      <span className="text-[12px] font-bold">{nbHeures}h</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LEGENDE */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <p className="text-[14px] font-semibold text-blue-900">Legende</p>
              </div>
              <div className="p-4 flex flex-col gap-2.5">
                {[
                  { label: "Terminale S", color: "bg-indigo-500" },
                  { label: "Premiere",    color: "bg-sky-500"    },
                  { label: "3eme A",      color: "bg-blue-500"   },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-2.5">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${l.color}`} />
                    <span className="text-[13px] font-medium text-gray-700">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </EnseignantLayout>
  );
}