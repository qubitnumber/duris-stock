import { useContext, useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import ThemeContext from "../../context/ThemeContext";
import { ThemeContextType } from '../../types';
import services from '../../services'
import SearchResults from "./SearchResults";
import { StockContextType } from "../../types";
import StockContext from "../../context/StockContext";


const Search = () => {
  const { darkMode } = useContext(ThemeContext) as ThemeContextType;
  const { stock, setStock } = useContext(StockContext) as StockContextType;

  const [input, setInput] = useState("");
  const [bestMatches, setBestMatches] = useState([]);

  const questradeService = services.questrade;

  const updateBestMatches = async () => {
    try {
      if (input) {
        const searchResults = await questradeService.searchSymbols(input);
        setBestMatches(searchResults.data.symbols);
      }
    } catch (error) {
      setBestMatches([]);
      console.log(error);
    }
  };

  const clear = () => {
    setInput("");
    setBestMatches([]);
    setStock({
      ...stock,
      symbol: '', symbolId: 0,
    })
  };

  return (
    <div
      className={`flex items-center my-4 border-2 rounded-md relative z-50 w-full ${
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-neutral-200"
      }`}
    >
      <input
        type="text"
        value={input.toUpperCase()}
        className={`w-full px-4 py-2 focus:outline-none rounded-md ${
          darkMode ? "bg-gray-900" : null
        }`}
        placeholder="Search stock..."
        onChange={(event) => setInput(event.target.value.toUpperCase())}
        onKeyUp={(event) => {
          if (event.key === "Enter") {
            updateBestMatches();
          }
        }}
      />
      {input && (
        <button onClick={clear} className="m-1">
          <XMarkIcon className="h-4 w-4 fill-gray-500" />
        </button>
      )}
      <button
        onClick={updateBestMatches}
        className="h-8 w-8 bg-indigo-600 rounded-md flex justify-center items-center m-1 p-2 transition duration-300 hover:ring-2 ring-indigo-400"
      >
        <MagnifyingGlassIcon className="h-4 w-4 fill-gray-100" />
      </button>
      {input && bestMatches.length > 0 ? (
        <SearchResults results={bestMatches} setBestMatches={setBestMatches}/>
      ) : null}
    </div>
  );
};

export default Search;