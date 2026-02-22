import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useMember } from "./contexts/MemberContext";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResourceSearch from "./pages/ResourceSearch";
import TrustGraph from "./pages/TrustGraph";
import MemberDirectory from "./pages/MemberDirectory";
import AcceptInvitation from "./pages/AcceptInvitation";
import HelpRequests from "./pages/HelpRequests";
import CreateInvitation from "./pages/CreateInvitation";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function TrustedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { isTrusted, loading: memberLoading } = useMember();
  if (loading || memberLoading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isTrusted) return <Navigate to="/accept-invitation" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Public — pre-trust layer */}
        <Route path="/" element={<ResourceSearch />} />
        <Route path="/login" element={<Login />} />

        {/* Auth required, trust NOT required */}
        <Route
          path="/accept-invitation"
          element={
            <ProtectedRoute>
              <AcceptInvitation />
            </ProtectedRoute>
          }
        />

        {/* Trusted member routes — post-trust layer */}
        <Route
          path="/dashboard"
          element={
            <TrustedRoute>
              <Dashboard />
            </TrustedRoute>
          }
        />
        <Route
          path="/graph"
          element={
            <TrustedRoute>
              <TrustGraph />
            </TrustedRoute>
          }
        />
        <Route
          path="/members"
          element={
            <TrustedRoute>
              <MemberDirectory />
            </TrustedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <TrustedRoute>
              <HelpRequests />
            </TrustedRoute>
          }
        />
        <Route
          path="/invite"
          element={
            <TrustedRoute>
              <CreateInvitation />
            </TrustedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
