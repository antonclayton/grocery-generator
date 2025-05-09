import React from "react";

interface SectionDividerProps {
  className?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ className = "" }) => {
  return (
    <span
      className={`block h-0.5 bg-white my-4 sm:my-6 lg:my-8 xl:my-10 rounded-full w-full ${className}`}
    />
  );
};

export default SectionDivider;
