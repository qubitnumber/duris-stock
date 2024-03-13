import { useContext, Dispatch, SetStateAction } from "react";
import StockContext from "../context/StockContext";
import ThemeContext from "../context/ThemeContext";
import {ThemeContextType, StockContextType } from '../types';

interface Result { 
  symbol: string,
  symbolId: number,
  description: string,
  securityType: string,
  listingExchange: string,
  isTradable: boolean,
  isQuotable: boolean,
  currency: string
}

type SearchResultsProps = {
  results: Result[];
  setBestMatches: Dispatch<SetStateAction<never[]>>
}

const SearchResults = ({ results, setBestMatches }: SearchResultsProps) => {
  const { darkMode } = useContext(ThemeContext) as ThemeContextType;
  const { stock, setStock } = useContext(StockContext) as StockContextType;
  const onClick = (item: { symbol: string, symbolId: number}) => {
    setStock({
      ...stock,
      symbol: item.symbol, symbolId: item.symbolId,
    })
    setBestMatches([]);
  }

  return (
    <ul
      className={`absolute top-12 border-2 w-full rounded-md h-64 overflow-y-scroll ${
        darkMode
          ? "bg-gray-900 border-gray-800 custom-scrollbar custom-scrollbar-dark"
          : "bg-white border-neutral-200 custom-scrollbar"
      }`}
    >
      {results.map((item) => {
        return (
          <li
            key={item.symbol}
            className={`cursor-pointer p-4 m-2 flex items-center justify-between rounded-md ${
              darkMode ? "hover:bg-indigo-600" : "hover:bg-indigo-200 "
            } transition duration-300`}
            onClick={() => onClick(item)}
          >
            <span>{item.symbol}</span>
            <span>{item.description}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default SearchResults;