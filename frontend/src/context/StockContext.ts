import React from "react";
import { StockContextType } from '../types';

const StockContext = React.createContext<StockContextType | null>(null);

export default StockContext;