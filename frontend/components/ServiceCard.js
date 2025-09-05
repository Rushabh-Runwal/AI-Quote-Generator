import React from "react";

export default function ServiceCard({ label, price, icon, selected, onClick }) {
  return (
    <div
      className={`service-card${selected ? " selected" : ""}`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
    >
      <div className="service-icon">{icon}</div>
      <div className="service-label">{label}</div>
      <div
        style={{
          fontSize: "0.9rem",
          marginTop: "8px",
          fontWeight: "600",
          color: selected ? "#fff" : "#059669",
        }}
      >
        ${price}
      </div>
    </div>
  );
}
