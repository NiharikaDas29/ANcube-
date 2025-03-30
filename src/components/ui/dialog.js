import * as React from "react"
import { cn } from "../lib/utils"
import { X } from "lucide-react"

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-lg">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, onOpenChange }) => {
  return (
    <div className="relative bg-white rounded-lg shadow-xl p-6">
      <button
        className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
        onClick={() => onOpenChange(false)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
      {children}
    </div>
  );
};

const DialogHeader = ({ children, className }) => (
  <div className={cn("mb-4", className)}>
    {children}
  </div>
);

const DialogTitle = ({ children, className }) => (
  <h2 className={cn("text-lg font-semibold", className)}>
    {children}
  </h2>
);

const DialogFooter = ({ children, className }) => (
  <div className={cn("flex justify-end space-x-2 mt-4", className)}>
    {children}
  </div>
);

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle
};