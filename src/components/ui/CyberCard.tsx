import React from "react";

interface CyberCardProps {
  image: string;
  imageAlt: string;
  children: React.ReactNode;
  className?: string;
}

const CyberCard: React.FC<CyberCardProps> = ({
  image,
  imageAlt,
  children,
  className = "",
}) => {
  return (
    <div className={`cyber-card flex flex-row p-2 gap-4 ${className}`}>
      <img
        src={image}
        alt={imageAlt}
        className="rounded-lg object-cover w-40 h-40 bg-cyber-dark-lighter border border-cyber-blue"
      />
      <div className="flex-1 flex flex-col justify-between">{children}</div>
    </div>
  );
};

export default CyberCard;
