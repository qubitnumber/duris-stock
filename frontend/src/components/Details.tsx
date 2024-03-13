import { useContext } from "react";
import Card from "./Card";
import ThemeContext from "../context/ThemeContext";
import { ThemeContextType, StockDetailsState } from '../types';

interface DetailsProps  { 
  details: StockDetailsState
}

const Details = ({ details }: DetailsProps) => {
  const { darkMode } = useContext(ThemeContext) as ThemeContextType;

  const detailsList = {
    description: "description",
    currency: "currency",
    listingExchange: "listingExchange",
    highPrice52: "highPrice52",
    lowPrice52: "lowPrice52",
    eps: "eps",
    pe: "pe",
    dividend: "dividend",
    yield: "yield",
    industryGroup: "industryGroup",
  };

  return (
    <Card>
      <ul
        className={`w-full h-full flex flex-col justify-between divide-y-1 ${
          darkMode ? "divide-gray-800" : null
        }`}
      >
        {Object.keys(detailsList).map((item) => {
          return (
            <li key={item} className="flex-1 flex justify-between items-center">
              <span>{detailsList[item as keyof typeof detailsList]}</span>
              <span className="font-bold">
                {details[item as keyof typeof detailsList]}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

export default Details;