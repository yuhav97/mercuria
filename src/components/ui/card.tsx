import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export const Card = ({ children }: CardProps) => (
  <div className="bg-white rounded-lg shadow p-4 w-full">
    {children}
  </div>
);

export const CardContent = ({ children }: CardProps) => (
  <div className="mt-2">
    {children}
  </div>
);