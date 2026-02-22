import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useMember } from "../contexts/MemberContext";

export default function NavBar() {
  const { user } = useAuth();
  const { isTrusted } = useMember();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        CircleTrust
      </Link>
      <div className="nav-links">
        <Link
          to="/"
          className={`nav-link ${isActive("/") ? "nav-link-active" : ""}`}
        >
          Resources
        </Link>
        {isTrusted && (
          <>
            <Link
              to="/graph"
              className={`nav-link ${isActive("/graph") ? "nav-link-active" : ""}`}
            >
              Trust Graph
            </Link>
            <Link
              to="/members"
              className={`nav-link ${isActive("/members") ? "nav-link-active" : ""}`}
            >
              Members
            </Link>
            <Link
              to="/help"
              className={`nav-link ${isActive("/help") ? "nav-link-active" : ""}`}
            >
              Help Board
            </Link>
            <Link
              to="/invite"
              className={`nav-link ${isActive("/invite") ? "nav-link-active" : ""}`}
            >
              Invite
            </Link>
          </>
        )}
        {user ? (
          <button
            onClick={() => signOut(auth)}
            className="nav-link"
            style={{ background: "none", color: "#4f46e5", padding: 0 }}
          >
            Sign out
          </button>
        ) : (
          <Link
            to="/login"
            className={`nav-link ${isActive("/login") ? "nav-link-active" : ""}`}
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
