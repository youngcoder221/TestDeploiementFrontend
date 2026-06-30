export default function Badge({ statut }) {
  const styles = {
    "Payé":        "bg-green-100 text-green-700",
    "Actif":       "bg-green-100 text-green-700",
    "En attente":  "bg-yellow-100 text-yellow-700",
    "Difficulté":  "bg-yellow-100 text-yellow-700",
    "Impayé":      "bg-red-100 text-red-700",
    "Suspendu":    "bg-red-100 text-red-700",
    "Très Bien":   "bg-green-100 text-green-700",
    "Bien":        "bg-blue-100 text-blue-700",
    "Assez Bien":  "bg-blue-50 text-blue-600",
    "Passable":    "bg-yellow-100 text-yellow-700",
  };

  const dotColors = {
    "Payé":       "bg-green-500",  "Actif":      "bg-green-500",
    "En attente": "bg-yellow-500", "Difficulté": "bg-yellow-500",
    "Impayé":     "bg-red-500",    "Suspendu":   "bg-red-500",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold ${styles[statut] || "bg-gray-100 text-gray-600"}`}>
      {dotColors[statut] && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[statut]}`}/>}
      {statut}
    </span>
  );
}