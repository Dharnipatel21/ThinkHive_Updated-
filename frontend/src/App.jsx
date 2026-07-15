import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import AppLayout from "./components/Layout/AppLayout";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import RoleProtectedRoute from "./components/Layout/RoleProtectedRoute";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ActivateAccountPage from "./pages/ActivateAccountPage";
import DashboardPage from "./pages/DashboardPage";
import ChatPage from "./pages/ChatPage";
import DocumentsPage from "./pages/DocumentsPage";
import SearchPage from "./pages/SearchPage";
import AdminPage from "./pages/AdminPage";
import DomainsPage from "./pages/DomainsPage";
import HRPage from "./pages/HRPage";
import KnowledgeMapPage from "./pages/KnowledgeMapPage";
import SettingsPage from "./pages/SettingsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportsPage from "./pages/ReportsPage";
export default function App() {
  const { fetchUser, token } = useAuthStore();

  useEffect(() => {
    if (token) fetchUser();
  }, [token]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/activate" element={<ActivateAccountPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/domains" element={<DomainsPage />} />
          <Route path="/hr" element={<HRPage />} />
          <Route path="/knowledge-map" element={<KnowledgeMapPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route element={<RoleProtectedRoute allow={["org_super_admin"]} />}>
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}