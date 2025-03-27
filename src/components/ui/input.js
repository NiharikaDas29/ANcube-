import React from "react";

export default function Input({ type = "text", placeholder, value, onChange, className = "" }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`p-2 border rounded-xl w-full ${className}`}
    />
  );
}
