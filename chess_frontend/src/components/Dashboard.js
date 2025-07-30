import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

// PUBLIC_INTERFACE
function Dashboard() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch game history of logged-in user
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch("/games/history/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : [])
      .then(setGames)
      .finally(() => setLoading(false));
  }, [token]);

  // Start matchmaking
  const handleMatch = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/matchmaking/find", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data?.game_id) {
        navigate(`/game/${data.game_id}`);
      } else {
        alert(data.status || "Matchmaking error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Start vs AI
  const handleAi = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/matchmaking/ai", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data?.game_id) {
        navigate(`/game/${data.game_id}`);
      } else {
        alert(data.status || "AI game error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Start vs friend (asks opponent username)
  const handleFriend = async () => {
    const opponent_username = prompt("Enter friend's username:");
    if (!opponent_username) return;
    setLoading(true);
    try {
      const res = await fetch("/games/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opponent_username,
          vs_ai: false,
        }),
      });
      const data = await res.json();
      if (data?.id) {
        navigate(`/game/${data.id}`);
      } else {
        alert("Failed to create friend game.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "2rem auto",
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
      }}
    >
      <section>
        <h2>
          Welcome,{" "}
          <span style={{ color: "var(--accent, #e67e22)" }}>{user.username}</span>
        </h2>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            margin: "1.2rem 0",
            flexWrap: "wrap",
          }}
        >
          <button
            style={buttonStyle}
            onClick={handleMatch}
            disabled={loading}
          >
            {loading ? "Matching..." : "Find Match"}
          </button>
          <button
            style={buttonStyle}
            onClick={handleAi}
            disabled={loading}
          >
            Play vs AI
          </button>
          <button
            style={buttonStyle}
            onClick={handleFriend}
            disabled={loading}
          >
            Play with Friend
          </button>
        </div>
      </section>
      <section>
        <h3 style={{ marginBottom: 10 }}>Recent Games</h3>
        <GameHistoryTable games={games} />
      </section>
    </div>
  );
}

const buttonStyle = {
  background: "var(--primary, #35495e)",
  color: "#fff",
  border: "none",
  borderRadius: 7,
  fontWeight: 700,
  fontSize: 16,
  padding: "13px 28px",
  cursor: "pointer",
  boxShadow: "0 1px 4px rgba(34,42,60,0.12)",
  transition: "background 0.2s",
};

function GameHistoryTable({ games }) {
  if (!games?.length) return <div>No recent games yet.</div>;
  return (
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
        background: "var(--secondary, #f5f6fa)",
        fontSize: 15,
      }}
    >
      <thead>
        <tr style={{ background: "var(--primary, #35495e)", color: "#fff" }}>
          <th style={cellRule}>White</th>
          <th style={cellRule}>Black</th>
          <th style={cellRule}>Result</th>
          <th style={cellRule}>Started</th>
          <th style={cellRule}>Ended</th>
          <th style={cellRule}></th>
        </tr>
      </thead>
      <tbody>
        {games.map((g) => (
          <tr key={g.id}>
            <td style={cellRule}>{g.white}</td>
            <td style={cellRule}>{g.black}</td>
            <td style={cellRule}>{g.result || "-"}</td>
            <td style={cellRule}>{new Date(g.started_at).toLocaleString()}</td>
            <td style={cellRule}>
              {g.ended_at ? new Date(g.ended_at).toLocaleString() : "-"}
            </td>
            <td style={cellRule}>
              <a
                style={{
                  color: "var(--accent, #e67e22)",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                href={`/game/${g.id}`}
              >
                View
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
const cellRule = {
  padding: "7px 11px",
  border: "1px solid #e2e4ee",
  textAlign: "center",
};
export default Dashboard;
