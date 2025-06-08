import React from "react";

interface NeonTabsProps {
  tabs: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const NeonTabs = ({ tabs, value, onChange, className = "" }: NeonTabsProps) => {
  return (
    <div className={`neon-tabs ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`neon-tab-btn${
            value === tab.value ? " neon-tab-btn-active" : ""
          }`}
          onClick={() => onChange(tab.value)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default NeonTabs;
