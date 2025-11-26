// src/components/Card.jsx
export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        p-6 rounded-2xl neon-card
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}
