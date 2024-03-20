import { useContext, ReactNode } from "react";
import ThemeContext from "../../context/ThemeContext";
import { ThemeContextType } from '../../types';

interface CardProps  { 
  children: ReactNode
}

const Card = ({ children }: CardProps) => {
  const { darkMode } = useContext(ThemeContext) as ThemeContextType;
  return (
    <div
      className={`w-full h-full rounded-md relative p-12 border-2 ${
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-neutral-200"
      }`}
    >
      {children}
    </div>
  );
};

export default Card;