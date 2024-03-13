import React from "react";
import { ThemeContextType } from '../types';

const ThemeContext = React.createContext<ThemeContextType | null>(null);

export default ThemeContext;