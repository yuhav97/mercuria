import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  children: ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => (
  <button
    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
    {...props}
  >
    {children}
  </button>
);