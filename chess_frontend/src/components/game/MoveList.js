import React from "react";

// PUBLIC_INTERFACE
function MoveList({ moves }) {
  if (!moves?.length) return <div>No moves yet.</div>;
  const lines = [];
  for (let i = 0; i < moves.length; i += 2) {
    lines.push([
      Math.floor(i / 2) + 1,
      moves[i],
      i + 1 < moves.length ? moves[i + 1] : "",
    ]);
  }
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
      <thead>
        <tr>
          <th style={cellRule}>#</th>
          <th style={cellRule}>White</th>
          <th style={cellRule}>Black</th>
        </tr>
      </thead>
      <tbody>
        {lines.map(([moveNum, w, b]) => (
          <tr key={moveNum}>
            <td style={cellRule}>{moveNum}</td>
            <td style={cellRule}>{w}</td>
            <td style={cellRule}>{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
const cellRule = {
  border: "1px solid #e2e4ee",
  padding: "6px 10px",
  textAlign: "center",
};

export default MoveList;
