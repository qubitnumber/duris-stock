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
  ReferenceLine,
} from "recharts";
import { Typography } from "@material-tailwind/react";
import ThemeContext from "../../context/ThemeContext";
import StockContext from "../../context/StockContext";
import { ThemeContextType, StockContextType } from '../../types';
import services from '../../services'
import utils from "../../utils";
import { chartConfig } from "../../constants/config";

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
  inout: number;
  close: number;
  date: string;
}

interface dropInfoProps {
  avgPriceDrop: string;
  threshold: string;
  biggestDrop: string;
}

const dropInfoDefault = {
  avgPriceDrop: '',
  threshold: '',
  biggestDrop: ''
}

const Chart = () => {
  const [filter, setFilter] = useState("1W");
  const { darkMode } = useContext(ThemeContext) as ThemeContextType;
  const { stock } = useContext(StockContext) as StockContextType;
  const [data, setData] = useState<Array<dataProps>>([]);
  const [dropInfo, setDropInfo] = useState<dropInfoProps>(dropInfoDefault);

  const questradeService = services.questrade;

  const formatData = (data: formatDataProps[]) => {
    const scumInOut = data.map((item: formatDataProps, index: number) => {
      return index === 0 ? 0 : (item.close - data[index-1].close)*item.volume;
    })

    return data.map((item: formatDataProps, index: number) => {
      return {
        inout: scumInOut[index-1] + scumInOut[index],
        close: parseFloat(item.close.toFixed(2)),
        date: ["1D", "2D", "3D", "1H"].includes(filter) ?
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
        setData([]);
        setDropInfo(dropInfoDefault);
        const agoHours = getDateRange();
        const interval = chartConfig[filter as keyof typeof chartConfig].interval;
        const result = await questradeService.getCandlesticksBySymbolId(stock.symbolId, agoHours, interval);
        setData(formatData(result.data.candles));
        setDropInfo(result.data.drop_info);
      } catch (error) {
        setData([]);
        setDropInfo(dropInfoDefault);
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
        <>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Tooltip
                contentStyle={darkMode ? { backgroundColor: "#111827" } : {}}
                itemStyle={darkMode ? { color: "#510cf8" } : {}}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="close"
                stroke="#3352FF"
                fillOpacity={0.5}
                strokeWidth={0.5}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="inout"
                stroke="#8812FF"
                fillOpacity={0.5}
                strokeWidth={0.5}
              />
              <XAxis dataKey="date" />
              <YAxis type="number" yAxisId="left" />
              <YAxis type="number" yAxisId="right" orientation="right" />
              <ReferenceLine y={0} yAxisId="right" stroke="red" />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
          <Typography variant="small">{`${dropInfo.avgPriceDrop}  ${dropInfo.threshold}  ${dropInfo.biggestDrop}`}</Typography>
        </>
    </Card>
  );
};

export default Chart;