import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>CircleTrust</h1>
      <p>Sign in to continue</p>
      <button onClick={handleGoogleSignIn} style={{ marginTop: "1.5rem" }}>
        Sign in with Google
      </button>
    </div>
  );
}
