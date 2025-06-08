import React from "react";

interface NeonButtonProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  variant?: "default" | "alt";
}

const NeonButton = ({
  icon,
  children,
  onClick,
  active,
  className = "",
  variant = "default",
}: NeonButtonProps) => {
  return (
    <button
      className={`neon-btn${variant === "alt" ? " neon-btn-alt" : ""} ${
        active ? "neon-btn-active" : ""
      } ${className}`}
      onClick={onClick}
      type="button"
    >
      <span className="neon-btn-icon">{icon}</span>
      <span className="neon-btn-label">{children}</span>
    </button>
  );
};

export default NeonButton;
