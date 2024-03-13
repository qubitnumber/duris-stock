import { useContext, useEffect, useState } from "react";
import ChartFilter from "./ChartFilter";
import Card from "./Card";
import {
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Legend,
} from "recharts";
import ThemeContext from "../context/ThemeContext";
import StockContext from "../context/StockContext";
import { ThemeContextType, StockContextType } from '../types';
import services from '../services'
import utils from "../utils";
import { chartConfig } from "../constants/config";

interface formatDataProps  {
  VWAP: number;
  close: number;
  end: string;
  high: number;
  low: number;
  open: number;
  start: string;
  volume: number;
}

interface dataProps {
  volume: number;
  close: number;
  date: string;
}

const Chart = () => {
  const [filter, setFilter] = useState("1W");
  const { darkMode } = useContext(ThemeContext) as ThemeContextType;
  const { stock } = useContext(StockContext) as StockContextType;
  const [data, setData] = useState<Array<dataProps>>([]);

  const questradeService = services.questrade;

  const formatData = (data: formatDataProps[]) => {
    return data.map((item: formatDataProps) => {
      return {
        amount: parseFloat((item.close * item.volume/1000000000).toFixed(1)),
        volume: parseFloat((item.volume/1000).toFixed(1)),
        close: parseFloat(item.close.toFixed(2)),
        date: ["1D", "1H"].includes(filter) ?
          item.end.split('T')[1].slice(0, 5) : item.end.split('T')[0]
      };
    });
  };

  useEffect(() => {
    const getDateRange = () => {
      const { hours, days, weeks, months, years } = chartConfig[filter as keyof typeof chartConfig];
      const ago = utils.createAgoHours(hours, days, weeks, months, years);
      return ago;
    };

    const updateChartData = async () => {
      try {
        const ago = getDateRange();
        const interval = chartConfig[filter as keyof typeof chartConfig].interval;
        const result = await questradeService.getCandlesticksBySymbolId(stock.symbolId, ago, interval);
        setData(formatData(result.data.candles));
      } catch (error) {
        setData([]);
        setFilter("1W");
        console.log(error);
      }
    };

    if (stock.symbol) {
      updateChartData();
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stock.symbol, filter]);

  return (
    <Card>
      <ul className="flex absolute top-1 right-1 z-40">
        {Object.keys(chartConfig).map((item) => (
          <li key={item}>
            <ChartFilter
              text={item}
              active={filter === item}
              onClick={() => {
                setFilter(item);
              }}
            />
          </li>
        ))}
      </ul>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Tooltip
            contentStyle={darkMode ? { backgroundColor: "#111827" } : {}}
            itemStyle={darkMode ? { color: "#818cf8" } : {}}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="close"
            stroke="#312e81"
            fill="url(#chartColor)"
            fillOpacity={1}
            strokeWidth={0.3}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="volume"
            stroke="#82ca9d"
            fill="url(#chartColor)"
            fillOpacity={1}
            strokeWidth={0.3}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="amount"
            stroke="#1884d8"
            fill="url(#chartColor)"
            fillOpacity={1}
            strokeWidth={0.3}
          />
          <XAxis dataKey="date" />
          <YAxis type="number" yAxisId="left" />
          <YAxis type="number" yAxisId="right" orientation="right" />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Chart;