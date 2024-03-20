import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from "moment-timezone";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Card, Typography, CardBody } from "@material-tailwind/react";
import services from '../../services'
import { useContext, useState } from "react";
import { StockContextType } from "../../types";
import StockContext from "../../context/StockContext";

const TABLE_HEAD = ["Headline", "Positive",	"Negative",	"Neutral", "Date"];

interface formatDataProps  {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
  positive?: number;
  negative?: number;
  neutral?: number;
}

interface dataProps {
  headline: React.ReactElement;
  positive?: number;
  negative?: number;
  neutral?: number;
  date: string;
}

export const TransactionsTable = () => {
  const { stock } = useContext(StockContext) as StockContextType;
  const [data, setData] = useState<Array<dataProps>>([]);
  const finnhubService = services.finnhub;

  const formatData = (data: formatDataProps[]) => {
    return data.map((item: formatDataProps) => {
      return {
        headline: <Link to={item.url} className='w-12' target="_blank" rel="noopener noreferrer">{item.headline}</Link>,
        positive: item.positive ? parseFloat(item.positive.toFixed(2)) : 0,
        negative: item.negative ? parseFloat(item.negative.toFixed(2)) : 0,
        neutral: item.neutral ? parseFloat(item.neutral.toFixed(2)) : 0,
        date: moment(item.datetime * 1000).tz("America/Toronto").format('YYYY-MM-DD HH:mm')
      };
    });
  };

  useEffect(() => {
    setData([]);
  }, [stock.symbol]);

  const updateNewsData = async () => {
    try {
      setData([]);
      const to = moment().tz("America/Toronto").format('YYYY-MM-DD');
      const from = moment().tz("America/Toronto").subtract(7, 'days').format('YYYY-MM-DD');
      if (stock.symbol) {
        const result = await finnhubService.companyNewsBySymbol(stock.symbol, from, to);
        setData(formatData(result.data));
      }
    } catch (error) {
      setData([]);
      console.log(error);
    }
  };

  const SearchIcon = () => {
    return (
      <button
        onClick={updateNewsData}
        className="h-8 w-8 bg-indigo-600 rounded-md flex justify-center items-center p-100 transition duration-300 hover:ring-2 ring-indigo-400"
      >
        <MagnifyingGlassIcon className="h-4 w-4 fill-gray-100" />
      </button>
    );
  }

  const headTitle = (head: string) => {
    if ( head === 'Headline' && stock.symbol && data.length === 0) {
      return (
        ` of Recent Weekly News for ${stock.symbol}`
      )
    }
    return '';
  };
  
  return (
    <Card className="h-full w-full">
      <CardBody className="overflow-scroll px-0 py-2">
        <table className="w-full min-w-max table-auto">
          <thead className="text-left">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {`${head}${headTitle(head)}`}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
            <tbody className="text-left">
            {stock.symbol && data.length > 0 && (
              data.map(
                (
                  {
                    headline,
                    positive,
                    negative,
                    neutral,
                    date,
                  },
                  index,
                ) => {
                  const isLast = index === data.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={index}>
                      <td className={`${classes} md:col-span-1`}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {headline}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {positive}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {negative}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {neutral}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {date}
                        </Typography>
                      </td>
                    </tr>
                  );
                },
            ))}
            </tbody>
        </table>
      </CardBody>
      {stock.symbol && data.length === 0 && (
        <div className="h-full w-full flex text-center justify-center items-center">
          <SearchIcon />
        </div>
      )}
    </Card>
  );
}