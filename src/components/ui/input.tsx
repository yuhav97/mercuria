import { InputHTMLAttributes, DetailedHTMLProps } from "react";

export const Input = (
  props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
) => (
  <input
    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
);