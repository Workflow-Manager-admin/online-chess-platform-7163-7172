import React, { useContext } from "react";
import { AuthContext } from "../App";

// PUBLIC_INTERFACE
function Profile() {
  const { user } = useContext(AuthContext);
  if (!user) return null;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>
        Profile:{" "}
        <span style={{ color: "var(--accent, #e67e22)" }}>{user.username}</span>
      </h2>
      <div
        style={{
          background: "var(--secondary, #f5f6fa)",
          borderRadius: 8,
          padding: "1.5rem 2rem",
          boxShadow: "0 1px 5px rgba(34,42,60,0.07)",
          margin: "1.5rem 0",
        }}
      >
        <div>
          <strong>Elo: </strong>
          <span>{user.elo}</span>
        </div>
        <div>
          <strong>Email: </strong>
          <span>{user.email}</span>
        </div>
        <div>
          <strong>Registered: </strong>
          <span>{new Date(user.created_at).toLocaleString()}</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <strong>Wins: </strong>
          <span>{user.wins}</span>
          <strong style={{ marginLeft: 15 }}>Losses: </strong>
          <span>{user.losses}</span>
          <strong style={{ marginLeft: 15 }}>Draws: </strong>
          <span>{user.draws}</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
