import React from "react";

// Returns 8x8 grid from FEN, uses unicode chess pieces for clean rendering

const pieceMap = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

// PUBLIC_INTERFACE
function Chessboard({ fen = "", moves = [], player = "" }) {
  // fen: "rnbqkbnr/ppp...."
  const grid = parseFEN(fen);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 48px)",
        gridTemplateRows: "repeat(8, 48px)",
        border: "4px solid var(--primary, #35495e)",
        borderRadius: 8,
        background: "var(--secondary, #f5f6fa)",
        boxShadow: "0 2px 9px rgba(53, 73, 94, 0.10)",
        overflow: "hidden",
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const isLight =
            (r + c) % 2 === 1; // alternate squares
          return (
            <div
              key={`${r}${c}`}
              style={{
                width: 48,
                height: 48,
                background: isLight
                  ? "#fff"
                  : "var(--primary, #35495e)",
                color: isLight
                  ? "var(--primary, #35495e)"
                  : "#fff",
                fontWeight: "bold",
                fontSize: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #eee",
                transition: "background 0.2s",
                userSelect: "none",
              }}
            >
              {pieceMap[cell] || ""}
            </div>
          );
        })
      )}
    </div>
  );
}

function parseFEN(fen) {
  // Returns rows of [ ['r','n','b',...], ... ]
  if (!fen) return Array(8)
    .fill(null).map(() => Array(8).fill(""));
  const rankStr = fen.split(" ")[0];
  const ranks = rankStr.split("/");
  return ranks.map((row) => {
    const arr = [];
    for (let i = 0; i < row.length; ++i) {
      if (isNaN(row[i])) arr.push(row[i]);
      else
        for (let j = 0; j < parseInt(row[i], 10); ++j) arr.push("");
    }
    return arr;
  });
}

export default Chessboard;
