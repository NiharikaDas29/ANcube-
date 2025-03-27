import React from "react";

export function Select({ children, onChange, value, className = "" }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`p-2 mb-2 border rounded-xl ${className}`}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children, className = "" }) {
  return <div className={`p-2 border rounded-xl cursor-pointer ${className}`}>{children}</div>;
}

export function SelectContent({ children, className = "" }) {
  return <div className={`p-2 border rounded-xl bg-white ${className}`}>{children}</div>;
}

export function SelectItem({ children, value }) {
  return <option value={value}>{children}</option>;
}
