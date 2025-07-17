import React from "react";

type ButtonProps = React.PropsWithChildren<{
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}>;

export const Button = ({ onClick, className = "", children, type = "button" }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ${className}`}
    >
      {children}
    </button>
  );
};
