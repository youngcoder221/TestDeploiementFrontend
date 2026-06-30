import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Etudiants from "./pages/Etudiants";
import Enseignants from "./pages/Enseignants";
import Classes from "./pages/Classes";
import Notes from "./pages/Notes";
import Paiements from "./pages/Paiements";
import EmploiDuTemps from "./pages/EmploiDuTemps";

// Enseignant
import EnseignantDashboard from "./pages/enseignant/EnseignantDashboard";
import MesNotes from "./pages/enseignant/MesNotes";
import MesClasses from "./pages/enseignant/MesClasses";
import EnseignantPlanning from "./pages/enseignant/EnseignantPlanning";

// Etudiant
import EtudiantDashboard from "./pages/etudiant/EtudiantDashboard";
import MesNotesEtudiant from "./pages/etudiant/MesNotesEtudiant";
import MesPaiements from "./pages/etudiant/MesPaiements";
import EtudiantPlanning from "./pages/etudiant/EtudiantPlanning";

const isAuthenticated = () => !!localStorage.getItem("token");

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-[248px] flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function AdminRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Connexion */}
        <Route path="/login" element={<Login />} />

        {/* ── ADMIN ── */}
        <Route path="/"                element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/etudiants"       element={<AdminRoute><Etudiants /></AdminRoute>} />
        <Route path="/enseignants"     element={<AdminRoute><Enseignants /></AdminRoute>} />
        <Route path="/classes"         element={<AdminRoute><Classes /></AdminRoute>} />
        <Route path="/notes"           element={<AdminRoute><Notes /></AdminRoute>} />
        <Route path="/emploi-du-temps" element={<AdminRoute><EmploiDuTemps /></AdminRoute>} />
        <Route path="/paiements"       element={<AdminRoute><Paiements /></AdminRoute>} />

        {/* ── ENSEIGNANT ── */}
        <Route path="/enseignant/dashboard"   element={<ProtectedRoute><EnseignantDashboard /></ProtectedRoute>} />
        <Route path="/enseignant/mes-classes" element={<ProtectedRoute><MesClasses /></ProtectedRoute>} />
        <Route path="/enseignant/mes-notes"   element={<ProtectedRoute><MesNotes /></ProtectedRoute>} />
        <Route path="/enseignant/planning"     element={<ProtectedRoute><EnseignantPlanning /></ProtectedRoute>} />

        {/* ── ETUDIANT ── */}
        <Route path="/etudiant/dashboard"  element={<ProtectedRoute><EtudiantDashboard /></ProtectedRoute>} />
        <Route path="/etudiant/mes-notes"  element={<ProtectedRoute><MesNotesEtudiant /></ProtectedRoute>} />
        <Route path="/etudiant/paiements"  element={<ProtectedRoute><MesPaiements /></ProtectedRoute>} />
        <Route path="/etudiant/planning"   element={<ProtectedRoute><EtudiantPlanning /></ProtectedRoute>} />

        {/* Redirection */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}