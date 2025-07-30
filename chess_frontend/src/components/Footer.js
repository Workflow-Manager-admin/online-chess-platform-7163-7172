import React from "react";

// PUBLIC_INTERFACE
function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--accent, #e67e22)",
        background: "var(--secondary, #f5f6fa)",
        color: "var(--primary, #35495e)",
        padding: "10px 0",
        marginTop: "2rem",
        fontSize: 14,
        textAlign: "center",
      }}
    >
      <span>
        &copy; {new Date().getFullYear()} Chess Arena &mdash; A KAVIA React Frontend
      </span>
    </footer>
  );
}
export default Footer;
