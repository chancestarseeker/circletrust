import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import client from "../api/client";

interface UserProfile {
  id: string;
  uid: string;
  email: string;
  display_name: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client
      .get<UserProfile>("/users/me")
      .then((res) => setProfile(res.data))
      .catch((err) => {
        // 404 just means the user hasn't created a profile yet
        if (err.response?.status !== 404) {
          setError("Failed to load profile");
        }
      });
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Dashboard</h1>
        <button onClick={handleSignOut}>Sign out</button>
      </header>

      <p style={{ marginTop: "1rem" }}>
        Signed in as <strong>{user?.email}</strong>
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {profile ? (
        <div style={{ marginTop: "1rem" }}>
          <h2>Your Profile</h2>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      ) : (
        <p style={{ marginTop: "1rem", color: "#666" }}>
          No profile yet &mdash; create one via the API.
        </p>
      )}
    </div>
  );
}
