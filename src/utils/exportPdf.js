// ─────────────────────────────────────────────────────────────
//  Utilitaire d'export PDF pour DigiSchool
//  Charge jsPDF + jspdf-autotable depuis un CDN (aucune install).
// ─────────────────────────────────────────────────────────────

let _libLoaded = false;

function chargerScript(src) {
  return new Promise((resolve, reject) => {
    // Évite de recharger si déjà présent
    if ([...document.scripts].some((s) => s.src === src)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error("Echec de chargement: " + src));
    document.head.appendChild(s);
  });
}

async function assurerLib() {
  if (_libLoaded && window.jspdf) return;
  await chargerScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  await chargerScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js");
  _libLoaded = true;
}

/**
 * Génère et télécharge un PDF tabulaire.
 * @param {Object} opts
 * @param {string} opts.titre       - Titre affiché en haut du document
 * @param {string} [opts.sousTitre] - Sous-titre optionnel
 * @param {string[]} opts.colonnes  - En-têtes de colonnes
 * @param {Array<Array>} opts.lignes - Données (tableau de tableaux)
 * @param {string} [opts.nomFichier] - Nom du fichier (sans extension)
 */
export async function exporterPDF({ titre, sousTitre, colonnes, lignes, nomFichier }) {
  await assurerLib();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  const bleu = [37, 99, 235];
  const dateStr = new Date().toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });

  // En-tête : marque DigiSchool
  doc.setFontSize(20);
  doc.setTextColor(...bleu);
  doc.setFont("helvetica", "bold");
  doc.text("DigiSchool", 40, 40);

  // Titre du rapport
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text(titre, 40, 64);

  // Sous-titre + date
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  let y = 80;
  if (sousTitre) { doc.text(sousTitre, 40, y); y += 12; }
  doc.text("Genere le " + dateStr, 40, y);

  // Tableau
  doc.autoTable({
    head: [colonnes],
    body: lignes,
    startY: y + 12,
    styles: { fontSize: 8, cellPadding: 5, overflow: "linebreak" },
    headStyles: { fillColor: bleu, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    margin: { left: 40, right: 40 },
  });

  // Pied de page : pagination
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    doc.text(`Page ${i} / ${pages}`, w - 80, h - 20);
    doc.text("DigiSchool — Systeme de gestion scolaire", 40, h - 20);
  }

  const nom = (nomFichier || "export") + "_" + new Date().toISOString().slice(0, 10) + ".pdf";
  doc.save(nom);
}