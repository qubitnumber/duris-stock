// https://github.com/smartCoolDev/stock-dashboard-react
import { useContext, useState } from "react";
import ThemeContext from "../context/ThemeContext";
import StockContext from "../context/StockContext";
import Chart from "./Chart";
import Header from "./Header";
import {
  ThemeContextType,
  StockContextType,
} from '../types';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const { darkMode } = useContext(ThemeContext) as ThemeContextType;
  const { stock } = useContext(StockContext) as StockContextType;

  return (
    <div
      className={`h-screen grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-8 md:grid-rows-7 xl:grid-rows-5 auto-rows-fr gap-6 p-10 font-quicksand ${
        darkMode ? "bg-gray-900 text-gray-300" : "bg-neutral-100"
      }`}
    >
      <div className="col-span-1 md:col-span-2 xl:col-span-3 row-span-1 flex justify-start items-center">
        <Header name={stock.symbol} onLogout={onLogout}/>
      </div>
      <div className="md:col-span-2 row-span-4">
        <Chart />
      </div>
    </div>
  );
};

const DashboardWrapper = ({ onLogout }: DashboardProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [stock, setStock] = useState({symbol: '', symbolId: 0});

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <StockContext.Provider value={{ stock, setStock }}>
        <Dashboard onLogout={onLogout}/>
      </StockContext.Provider>
    </ThemeContext.Provider>
  )
}

export default DashboardWrapper;