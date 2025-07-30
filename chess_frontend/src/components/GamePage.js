import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../App";
import Chessboard from "./game/Chessboard";
import MoveList from "./game/MoveList";

// PUBLIC_INTERFACE
function GamePage() {
  const { token, user } = useContext(AuthContext);
  const { gameId } = useParams();

  const [game, setGame] = useState(null); // Game object
  const [moveInput, setMoveInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [moveError, setMoveError] = useState("");

  // Fetch game info
  useEffect(() => {
    if (!token) return;
    fetch(`/games/${gameId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : null)
      .then(setGame);
  }, [token, gameId]);

  // Handle move submit (input = "e2e4")
  const handleMove = async () => {
    if (!moveInput || loading || !game) return;
    setLoading(true);
    setMoveError("");
    try {
      const from_square = moveInput.slice(0, 2);
      const to_square = moveInput.slice(2, 4);
      // POST /games/move
      const res = await fetch("/games/move", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          game_id: Number(gameId),
          from_square,
          to_square,
        }),
      });
      const data = await res.json();
      if (data.valid) {
        // Refetch game info
        fetch(`/games/${gameId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.ok ? res.json() : null)
          .then(setGame);
        setMoveInput("");
      } else {
        setMoveError(data.message || "Invalid move!");
      }
    } catch (e) {
      setMoveError("Invalid move!");
    } finally {
      setLoading(false);
    }
  };

  if (!game)
    return (
      <div style={{ padding: "2rem" }}>
        <h3>Loading game...</h3>
      </div>
    );

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "2em auto",
        display: "flex",
        flexWrap: "wrap",
        gap: "2.4em",
        alignItems: "flex-start",
      }}
    >
      <section style={{ flex: "1 0 430px" }}>
        <Chessboard fen={game.fen} moves={game.moves} player={user?.username} />
        {game.result && (
          <div
            style={{
              color: "var(--accent, #e67e22)",
              fontWeight: 700,
              fontSize: 22,
              margin: "1em 0",
            }}
          >
            Result: {game.result}
          </div>
        )}
        <form
          style={{
            display: "flex",
            gap: "0.5em",
            marginTop: "1em",
            alignItems: "center",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleMove();
          }}
        >
          <input
            value={moveInput}
            onChange={(e) => setMoveInput(e.target.value)}
            placeholder="Enter move (e.g. e2e4)"
            style={{
              fontSize: 16,
              padding: "8px 12px",
              border: "1.5px solid var(--primary, #35495e)",
              borderRadius: 6,
              width: 120,
            }}
            autoFocus
            disabled={loading}
          />
          <button
            type="submit"
            style={{
              background: "var(--accent, #e67e22)",
              color: "#fff",
              fontWeight: 700,
              padding: "8px 18px",
              borderRadius: 6,
              border: "none",
            }}
            disabled={loading}
          >
            Submit Move
          </button>
        </form>
        {moveError && (
          <div style={{ color: "#e67e22", fontWeight: 600 }}>{moveError}</div>
        )}
      </section>
      <aside style={{ minWidth: 220, flex: "0 1 300px" }}>
        <div
          style={{
            background: "var(--secondary, #f5f6fa)",
            padding: 16,
            borderRadius: 10,
            marginBottom: "2em",
            minHeight: 300,
          }}
        >
          <h4 style={{ color: "var(--primary, #35495e)" }}>Move List</h4>
          <MoveList moves={game.moves} />
        </div>
        <div
          style={{
            background: "var(--secondary, #f5f6fa)",
            padding: 16,
            borderRadius: 10,
            minHeight: 210,
            marginTop: "2em",
          }}
        >
          <h4>Chat (coming soon)</h4>
          <div style={{ fontSize: 14, color: "#aaa" }}>
            Live chat with opponent will be available here.
          </div>
        </div>
      </aside>
    </div>
  );
}

export default GamePage;
