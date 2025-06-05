import { TextareaHTMLAttributes, DetailedHTMLProps } from "react";

export const Textarea = (
  props: DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
) => (
  <textarea
    className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
);
