import { useState } from "react";
import {
  Calendar, ChevronLeft, ChevronRight,
  Plus, Download, Clock, MapPin, User
} from "lucide-react";
import { exporterPDF } from "../utils/exportPdf";

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const heures = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

const cours = [
  { jour: "Lundi",    debut: 8,  duree: 1, matiere: "Mathematiques",  prof: "M. Diallo",  salle: "Salle 12", classe: "Tle S",  color: "bg-blue-100 border-l-4 border-blue-500 text-blue-800"    },
  { jour: "Lundi",    debut: 10, duree: 1, matiere: "SVT",             prof: "Mme Sarr",   salle: "Labo Bio", classe: "3eme",   color: "bg-green-100 border-l-4 border-green-500 text-green-800"  },
  { jour: "Lundi",    debut: 14, duree: 1, matiere: "Histoire-Geo",    prof: "M. Ndiaye",  salle: "Salle 05", classe: "2nde",   color: "bg-amber-100 border-l-4 border-amber-500 text-amber-800"  },
  { jour: "Lundi",    debut: 16, duree: 2, matiere: "Philosophie",     prof: "Mme Diop",   salle: "Salle 08", classe: "Tle L",  color: "bg-purple-100 border-l-4 border-purple-500 text-purple-800"},
  { jour: "Mardi",    debut: 8,  duree: 2, matiere: "Physique-Chimie", prof: "M. Ba",      salle: "Labo Phys",classe: "Tle S",  color: "bg-sky-100 border-l-4 border-sky-500 text-sky-800"        },
  { jour: "Mardi",    debut: 14, duree: 1, matiere: "Anglais",         prof: "Mme Fall",   salle: "Salle 03", classe: "1ere",   color: "bg-rose-100 border-l-4 border-rose-500 text-rose-800"      },
  { jour: "Mardi",    debut: 16, duree: 1, matiere: "EPS",             prof: "M. Thiaw",   salle: "Terrain",  classe: "3eme",   color: "bg-teal-100 border-l-4 border-teal-500 text-teal-800"      },
  { jour: "Mercredi", debut: 8,  duree: 1, matiere: "Francais",        prof: "Mme Mbaye",  salle: "Salle 01", classe: "Tle L",  color: "bg-indigo-100 border-l-4 border-indigo-500 text-indigo-800"},
  { jour: "Mercredi", debut: 10, duree: 2, matiere: "Mathematiques",   prof: "M. Diallo",  salle: "Salle 12", classe: "1ere",   color: "bg-blue-100 border-l-4 border-blue-500 text-blue-800"    },
  { jour: "Mercredi", debut: 14, duree: 1, matiere: "Histoire-Geo",    prof: "M. Ndiaye",  salle: "Salle 05", classe: "Tle L",  color: "bg-amber-100 border-l-4 border-amber-500 text-amber-800"  },
  { jour: "Mercredi", debut: 16, duree: 1, matiere: "Anglais",         prof: "Mme Fall",   salle: "Salle 03", classe: "3eme",   color: "bg-rose-100 border-l-4 border-rose-500 text-rose-800"      },
  { jour: "Jeudi",    debut: 8,  duree: 1, matiere: "SVT",             prof: "Mme Sarr",   salle: "Labo Bio", classe: "Tle S",  color: "bg-green-100 border-l-4 border-green-500 text-green-800"  },
  { jour: "Jeudi",    debut: 10, duree: 1, matiere: "Physique-Chimie", prof: "M. Ba",      salle: "Labo Phys",classe: "2nde",   color: "bg-sky-100 border-l-4 border-sky-500 text-sky-800"        },
  { jour: "Jeudi",    debut: 14, duree: 2, matiere: "Francais",        prof: "Mme Mbaye",  salle: "Salle 01", classe: "3eme",   color: "bg-indigo-100 border-l-4 border-indigo-500 text-indigo-800"},
  { jour: "Vendredi", debut: 8,  duree: 2, matiere: "Philosophie",     prof: "Mme Diop",   salle: "Salle 08", classe: "Tle S",  color: "bg-purple-100 border-l-4 border-purple-500 text-purple-800"},
  { jour: "Vendredi", debut: 14, duree: 1, matiere: "Anglais",         prof: "Mme Fall",   salle: "Salle 03", classe: "Tle L",  color: "bg-rose-100 border-l-4 border-rose-500 text-rose-800"      },
  { jour: "Vendredi", debut: 16, duree: 1, matiere: "Mathematiques",   prof: "M. Diallo",  salle: "Salle 12", classe: "3eme",   color: "bg-blue-100 border-l-4 border-blue-500 text-blue-800"    },
];

const aujourdhui = [
  { heure: "08h-09h", matiere: "Francais",      prof: "Mme Mbaye", salle: "Salle 01", classe: "Tle L",  color: "bg-indigo-500" },
  { heure: "10h-12h", matiere: "Mathematiques", prof: "M. Diallo", salle: "Salle 12", classe: "1ere",   color: "bg-blue-500"   },
  { heure: "14h-15h", matiere: "Histoire-Geo",  prof: "M. Ndiaye", salle: "Salle 05", classe: "Tle L",  color: "bg-amber-500"  },
  { heure: "16h-17h", matiere: "Anglais",        prof: "Mme Fall",  salle: "Salle 03", classe: "3eme",   color: "bg-rose-500"   },
];

const legende = [
  { matiere: "Mathematiques",  color: "bg-blue-500",    count: "8 cours"  },
  { matiere: "Francais",       color: "bg-indigo-500",  count: "6 cours"  },
  { matiere: "Physique-Chimie",color: "bg-sky-500",     count: "5 cours"  },
  { matiere: "SVT",            color: "bg-green-500",   count: "4 cours"  },
  { matiere: "Histoire-Geo",   color: "bg-amber-500",   count: "6 cours"  },
  { matiere: "Anglais",        color: "bg-rose-500",    count: "5 cours"  },
  { matiere: "Philosophie",    color: "bg-purple-500",  count: "3 cours"  },
  { matiere: "EPS",            color: "bg-teal-500",    count: "3 cours"  },
];

const CELL_HEIGHT = 72; // px par heure

export default function EmploiDuTemps() {
  const [vue, setVue]     = useState("Semaine");
  const [classe, setClasse] = useState("Toutes les classes");

  const filtered = cours.filter(c =>
    classe === "Toutes les classes" || c.classe === classe
  );

  // Ordre des jours pour trier proprement le PDF
  const ordreJours = { "Lundi": 1, "Mardi": 2, "Mercredi": 3, "Jeudi": 4, "Vendredi": 5 };

  const handleExportPDF = () => {
    if (!filtered.length) { alert("Aucun cours a exporter."); return; }
    const lignes = [...filtered]
      .sort((a, b) => (ordreJours[a.jour] - ordreJours[b.jour]) || (a.debut - b.debut))
      .map((c) => [
        c.jour,
        `${String(c.debut).padStart(2, "0")}h - ${String(c.debut + c.duree).padStart(2, "0")}h`,
        c.matiere,
        c.classe,
        c.prof,
        c.salle,
      ]);
    exporterPDF({
      titre: "Emploi du temps",
      sousTitre: "Planning hebdomadaire" + (classe !== "Toutes les classes" ? ` — ${classe}` : ""),
      colonnes: ["Jour", "Horaire", "Matiere", "Classe", "Enseignant", "Salle"],
      lignes,
      nomFichier: "emploi_du_temps",
    });
  };

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-serif text-[26px] font-semibold text-blue-900">Planning hebdomadaire</h2>
          <p className="text-[13px] text-gray-400 mt-1">Semaine du 2 au 6 Juin 2026</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-[1.5px] border-blue-300 bg-white text-blue-600 text-[13px] font-medium hover:bg-blue-50 transition-all">
            <Download size={14} /> Exporter PDF
          </button>
          <button
            disabled
            title="Bientot disponible — necessite la table des cours en base"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-200 text-gray-400 text-[13.5px] font-semibold cursor-not-allowed">
            <Plus size={14} strokeWidth={2.5} /> Ajouter un cours
          </button>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {/* Navigation semaine */}
        <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
          <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all">
            <ChevronLeft size={16} />
          </button>
          <span className="px-4 text-[13.5px] font-semibold text-blue-900 border-x border-gray-200 h-9 flex items-center">
            2 - 6 Juin 2026
          </span>
          <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Aujourd'hui */}
        <button className="px-4 py-2 rounded-xl border border-blue-300 bg-white text-blue-600 text-[13px] font-medium hover:bg-blue-50 transition-all">
          Aujourd'hui
        </button>

        {/* Vue tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {["Jour","Semaine","Mois"].map((v) => (
            <button key={v} onClick={() => setVue(v)}
              className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all
                ${vue === v ? "bg-white text-blue-600 shadow-sm font-semibold" : "text-gray-400 hover:text-gray-600"}`}>
              {v}
            </button>
          ))}
        </div>

        {/* Filtre classe */}
        <select value={classe} onChange={(e) => setClasse(e.target.value)}
          className="ml-auto px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-[13px] text-gray-600 outline-none font-sans cursor-pointer">
          <option>Toutes les classes</option>
          <option>Tle S</option><option>Tle L</option>
          <option>1ere</option><option>3eme</option><option>2nde</option>
        </select>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-[1fr_280px] gap-5">

        {/* CALENDAR GRID */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          {/* Day headers */}
          <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: "64px repeat(5, 1fr)" }}>
            <div className="bg-gray-50 border-r border-gray-200" />
            {[
              { jour: "LUN", num: "2" },
              { jour: "MAR", num: "3" },
              { jour: "MER", num: "4", today: true },
              { jour: "JEU", num: "5" },
              { jour: "VEN", num: "6" },
            ].map((d) => (
              <div key={d.jour} className={`text-center py-3 border-r border-gray-100 last:border-0 ${d.today ? "bg-blue-50" : "bg-gray-50"}`}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{d.jour}</p>
                {d.today ? (
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-[16px] font-bold mx-auto mt-1">
                    {d.num}
                  </div>
                ) : (
                  <p className="text-[20px] font-bold text-blue-900 mt-1">{d.num}</p>
                )}
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="overflow-y-auto" style={{ maxHeight: "520px" }}>
            <div className="grid relative" style={{ gridTemplateColumns: "64px repeat(5, 1fr)" }}>

              {/* Time column */}
              <div className="border-r border-gray-200">
                {heures.map((h) => (
                  <div key={h} className="border-b border-gray-100 flex items-start justify-end pr-2 pt-1"
                    style={{ height: `${CELL_HEIGHT}px` }}>
                    <span className="text-[11px] font-semibold text-gray-400">{h}h</span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {jours.map((jour) => {
                const coursDuJour = filtered.filter(c => c.jour === jour);
                return (
                  <div key={jour} className={`relative border-r border-gray-100 last:border-0 ${jour === "Mercredi" ? "bg-blue-50/30" : ""}`}
                    style={{ height: `${CELL_HEIGHT * heures.length}px` }}>
                    {/* Hour lines */}
                    {heures.map((h) => (
                      <div key={h} className="absolute w-full border-b border-gray-100"
                        style={{ top: `${(h - 8) * CELL_HEIGHT}px`, height: `${CELL_HEIGHT}px` }} />
                    ))}
                    {/* Course blocks */}
                    {coursDuJour.map((c, i) => (
                      <div key={i}
                        className={`absolute left-1 right-1 rounded-xl px-2.5 py-2 cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all duration-150 ${c.color}`}
                        style={{
                          top: `${(c.debut - 8) * CELL_HEIGHT + 2}px`,
                          height: `${c.duree * CELL_HEIGHT - 4}px`,
                        }}>
                        <p className="text-[12px] font-bold leading-tight truncate">{c.matiere}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <User size={9} className="opacity-60 flex-shrink-0" />
                          <p className="text-[10px] opacity-75 truncate">{c.prof}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin size={9} className="opacity-60 flex-shrink-0" />
                          <p className="text-[10px] opacity-75 truncate">{c.salle}</p>
                        </div>
                        {c.duree > 1 && (
                          <span className="mt-1 inline-block text-[9px] font-semibold opacity-60 bg-black/5 px-1.5 py-0.5 rounded-full">
                            {c.classe}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SIDE COLUMN */}
        <div className="flex flex-col gap-4">

          {/* STATS */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
              {[
                { val: "38", lbl: "Cours/semaine", color: "text-blue-600" },
                { val: "8",  lbl: "Matieres",      color: "text-green-600"},
                { val: "12", lbl: "Enseignants",   color: "text-purple-600"},
                { val: "15", lbl: "Salles",        color: "text-amber-600" },
              ].map((s) => (
                <div key={s.lbl} className="p-4 text-center">
                  <p className={`text-[22px] font-bold ${s.color}`}>{s.val}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{s.lbl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PLANNING DU JOUR */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
              <Calendar size={15} className="text-blue-500" />
              <p className="text-[14px] font-semibold text-blue-900">Aujourd'hui - Mercredi 4</p>
            </div>
            <div>
              {aujourdhui.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5 border-b border-gray-100 last:border-0 hover:bg-blue-50 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-1 pt-0.5">
                    <Clock size={13} className="text-gray-400" />
                    <div className="w-px flex-1 bg-gray-200 min-h-[16px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-800">{a.matiere}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <User size={10} className="text-gray-400" />
                      <p className="text-[11px] text-gray-400">{a.prof}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-gray-400" />
                      <p className="text-[11px] text-gray-400">{a.salle} - {a.classe}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold text-white px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${a.color}`}>
                    {a.heure}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* LEGENDE */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100">
              <p className="text-[14px] font-semibold text-blue-900">Legende des matieres</p>
            </div>
            <div className="p-4 flex flex-col gap-2.5">
              {legende.map((l) => (
                <div key={l.matiere} className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${l.color}`} />
                  <span className="text-[12.5px] font-medium text-gray-700 flex-1">{l.matiere}</span>
                  <span className="text-[11px] text-gray-400">{l.count}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}