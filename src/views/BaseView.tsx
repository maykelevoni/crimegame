import React from "react";

interface BaseViewProps {
  title: string;
  children: React.ReactNode;
}

const BaseView = ({ title, children }: BaseViewProps) => {
  return (
    <div className="space-y-4">
      <h2 className="cyber-header-title">{title}</h2>
      <div className="cyber-card">{children}</div>
    </div>
  );
};

export default BaseView;
