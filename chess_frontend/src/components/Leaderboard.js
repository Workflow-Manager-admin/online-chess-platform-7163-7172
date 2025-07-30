import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";

// PUBLIC_INTERFACE
function Leaderboard() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Users leaderboard
    fetch("/users/leaderboard?limit=15", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : [])
      .then(setUsers);
    // Game leaderboard/quick stats
    fetch("/games/leaderboard?limit=15", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : [])
      .then(setGames)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto" }}>
      <h2>Leaderboard</h2>
      <section style={{ margin: "1.5rem 0" }}>
        <h3 style={{ color: "var(--primary, #35495e)", marginBottom: 8 }}>
          Top Players
        </h3>
        <PlayerLeaderboard players={users} />
      </section>
      <section style={{ marginTop: "2.5rem" }}>
        <h3 style={{ color: "var(--primary, #35495e)", marginBottom: 8 }}>
          Recent Top Games
        </h3>
        <GameLeaderboard games={games} />
      </section>
    </div>
  );
}

function PlayerLeaderboard({ players }) {
  if (!players?.length) return <div>No leaderboard data.</div>;
  return (
    <table style={tableStyle}>
      <thead>
        <tr style={{ background: "var(--primary, #35495e)", color: "#fff" }}>
          <th style={cellRule}>Rank</th>
          <th style={cellRule}>Username</th>
          <th style={cellRule}>Elo</th>
          <th style={cellRule}>Wins</th>
          <th style={cellRule}>Losses</th>
          <th style={cellRule}>Draws</th>
        </tr>
      </thead>
      <tbody>
        {players.map((u, ix) => (
          <tr key={u.id}>
            <td style={cellRule}>{ix + 1}</td>
            <td style={cellRule}>{u.username}</td>
            <td style={cellRule}>{u.elo}</td>
            <td style={cellRule}>{u.wins}</td>
            <td style={cellRule}>{u.losses}</td>
            <td style={cellRule}>{u.draws}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function GameLeaderboard({ games }) {
  if (!games?.length) return <div>No top game data.</div>;
  return (
    <table style={tableStyle}>
      <thead>
        <tr style={{ background: "var(--primary, #35495e)", color: "#fff" }}>
          <th style={cellRule}>White</th>
          <th style={cellRule}>Black</th>
          <th style={cellRule}>Result</th>
          <th style={cellRule}>Date</th>
        </tr>
      </thead>
      <tbody>
        {games.map((g, ix) => (
          <tr key={g.id || ix}>
            <td style={cellRule}>{g.white}</td>
            <td style={cellRule}>{g.black}</td>
            <td style={cellRule}>{g.result || "-"}</td>
            <td style={cellRule}>
              {g.ended_at ? new Date(g.ended_at).toLocaleString() : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 15,
};
const cellRule = {
  padding: "7px 11px",
  border: "1px solid #e2e4ee",
  textAlign: "center",
};

export default Leaderboard;
