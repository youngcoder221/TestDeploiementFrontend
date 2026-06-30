export const etudiants = [
  { id: "ETU-0042", nom: "Khadija Diop",     email: "khadija.diop@dgs.sn",     classe: "Terminale L", age: 18, moyenne: 17.9, paiement: "Payé",      statut: "Actif",      initiales: "KD", couleur: "from-blue-500 to-blue-300" },
  { id: "ETU-0017", nom: "Aminata Mbaye",    email: "aminata.mbaye@dgs.sn",    classe: "Terminale S", age: 17, moyenne: 16.4, paiement: "Payé",      statut: "Actif",      initiales: "AM", couleur: "from-sky-400 to-sky-300" },
  { id: "ETU-0031", nom: "Fatou Ba",         email: "fatou.ba@dgs.sn",         classe: "3ème",        age: 15, moyenne: 15.1, paiement: "Payé",      statut: "Actif",      initiales: "FB", couleur: "from-blue-700 to-blue-500" },
  { id: "ETU-0008", nom: "Ousmane Diallo",   email: "ousmane.diallo@dgs.sn",   classe: "Première L",  age: 16, moyenne: 13.8, paiement: "En attente",statut: "Actif",      initiales: "OD", couleur: "from-blue-500 to-blue-400" },
  { id: "ETU-0073", nom: "Moussa Sow",       email: "moussa.sow@dgs.sn",       classe: "2nde",        age: 15, moyenne: 11.2, paiement: "Impayé",    statut: "Difficulté", initiales: "MS", couleur: "from-blue-400 to-blue-300" },
  { id: "ETU-0055", nom: "Boubacar Thiaw",   email: "boubacar.thiaw@dgs.sn",   classe: "Terminale S", age: 18, moyenne: 12.7, paiement: "Payé",      statut: "Actif",      initiales: "BT", couleur: "from-blue-800 to-blue-600" },
  { id: "ETU-0089", nom: "Dieynaba Ly",      email: "dieynaba.ly@dgs.sn",      classe: "Première S",  age: 16, moyenne: 14.5, paiement: "Impayé",    statut: "Actif",      initiales: "DL", couleur: "from-blue-900 to-blue-700" },
  { id: "ETU-0112", nom: "Mariama Ndiaye",   email: "mariama.ndiaye@dgs.sn",   classe: "3ème",        age: 14, moyenne: 13.2, paiement: "Payé",      statut: "Actif",      initiales: "MN", couleur: "from-blue-400 to-blue-300" },
];

export const paiements = [
  { ref: "PAY-0291", etudiant: "Khadija Diop",   initiales: "KD", classe: "Terminale L", type: "Scolarité",  montant: "150 000 F", mode: "Wave",         date: "03 Juin 2026",      statut: "Payé" },
  { ref: "PAY-0290", etudiant: "Aminata Mbaye",  initiales: "AM", classe: "Terminale S", type: "Scolarité",  montant: "150 000 F", mode: "Virement",     date: "02 Juin 2026",      statut: "Payé" },
  { ref: "PAY-0289", etudiant: "Fatou Ba",        initiales: "FB", classe: "3ème",        type: "Cantine",    montant: "25 000 F",  mode: "Espèces",      date: "01 Juin 2026",      statut: "Payé" },
  { ref: "PAY-0288", etudiant: "Ousmane Diallo",  initiales: "OD", classe: "Première L",  type: "Scolarité",  montant: "150 000 F", mode: "Orange Money", date: "31 Mai 2026",       statut: "En attente" },
  { ref: "PAY-0287", etudiant: "Moussa Sow",      initiales: "MS", classe: "2nde",        type: "Scolarité",  montant: "150 000 F", mode: "—",            date: "Échéance: 1 Mai",   statut: "Impayé" },
  { ref: "PAY-0286", etudiant: "Boubacar Thiaw",  initiales: "BT", classe: "Terminale S", type: "Transport",  montant: "40 000 F",  mode: "Wave",         date: "28 Mai 2026",       statut: "Payé" },
];

export const cours = [
  { jour: "Lundi",    debut: 8,  fin: 9,  matiere: "Mathématiques",  prof: "M. Diallo",  salle: "Salle 12", classe: "Tle S",  couleur: "bg-blue-100 border-l-4 border-blue-500" },
  { jour: "Lundi",    debut: 10, fin: 11, matiere: "SVT",             prof: "Mme Sarr",   salle: "Labo Bio", classe: "3ème",   couleur: "bg-green-100 border-l-4 border-green-500" },
  { jour: "Lundi",    debut: 14, fin: 15, matiere: "Histoire-Géo",   prof: "M. Ndiaye",  salle: "Salle 05", classe: "2nde",   couleur: "bg-amber-100 border-l-4 border-amber-500" },
  { jour: "Mardi",    debut: 8,  fin: 10, matiere: "Physique-Chimie", prof: "M. Ba",      salle: "Labo Phys",classe: "Tle S",  couleur: "bg-sky-100 border-l-4 border-sky-500" },
  { jour: "Mardi",    debut: 14, fin: 15, matiere: "Anglais",         prof: "Mme Fall",   salle: "Salle 03", classe: "1ère",   couleur: "bg-rose-100 border-l-4 border-rose-500" },
  { jour: "Mercredi", debut: 8,  fin: 9,  matiere: "Français",        prof: "Mme Mbaye",  salle: "Salle 01", classe: "Tle L",  couleur: "bg-indigo-100 border-l-4 border-indigo-500" },
  { jour: "Mercredi", debut: 10, fin: 12, matiere: "Mathématiques",   prof: "M. Diallo",  salle: "Salle 12", classe: "1ère",   couleur: "bg-blue-100 border-l-4 border-blue-500" },
  { jour: "Jeudi",    debut: 8,  fin: 9,  matiere: "SVT",             prof: "Mme Sarr",   salle: "Labo Bio", classe: "Tle S",  couleur: "bg-green-100 border-l-4 border-green-500" },
  { jour: "Jeudi",    debut: 14, fin: 16, matiere: "Français",        prof: "Mme Mbaye",  salle: "Salle 01", classe: "3ème",   couleur: "bg-indigo-100 border-l-4 border-indigo-500" },
  { jour: "Vendredi", debut: 8,  fin: 10, matiere: "Philosophie",     prof: "Mme Diop",   salle: "Salle 08", classe: "Tle S",  couleur: "bg-purple-100 border-l-4 border-purple-500" },
  { jour: "Vendredi", debut: 14, fin: 15, matiere: "Anglais",         prof: "Mme Fall",   salle: "Salle 03", classe: "Tle L",  couleur: "bg-rose-100 border-l-4 border-rose-500" },
];

export const notes = [
  { rang: 1, nom: "Khadija Diop",   initiales: "KD", classe: "Terminale L", maths: 18, francais: 19, sciences: 16, moyenne: 17.9, mention: "Très Bien", evolution: "+0.8" },
  { rang: 2, nom: "Aminata Mbaye",  initiales: "AM", classe: "Terminale S", maths: 17, francais: 15, sciences: 18, moyenne: 16.4, mention: "Très Bien", evolution: "+1.2" },
  { rang: 3, nom: "Fatou Ba",       initiales: "FB", classe: "3ème",        maths: 14, francais: 16, sciences: 15, moyenne: 15.1, mention: "Bien",      evolution: "+0.4" },
  { rang: 4, nom: "Ousmane Diallo", initiales: "OD", classe: "Première L",  maths: 13, francais: 15, sciences: 13, moyenne: 13.8, mention: "Assez Bien",evolution: "0.0" },
  { rang: 5, nom: "Boubacar Thiaw", initiales: "BT", classe: "Terminale S", maths: 12, francais: 13, sciences: 14, moyenne: 12.7, mention: "Passable",  evolution: "-0.3" },
  { rang: 6, nom: "Moussa Sow",     initiales: "MS", classe: "2nde",        maths: 10, francais: 12, sciences: 11, moyenne: 11.2, mention: "Passable",  evolution: "-1.1" },
];