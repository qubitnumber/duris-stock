export interface IStock {
  symbol: string;
  symbolId: number;
}

export type StockContextType = {
  stock: IStock;
  setStock: (stock: IStock) => void;
};

export type ThemeContextType = {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
};

export enum OptionType {
  Call,
  Put,
}

export enum OptionDurationType {
  Weekly,
  Monthly,
  Quarterly,
  LEAP,
}

export enum OptionExerciseType {
  American,
  European,
}

export enum ListingExchange {
  TSX,
  TSXV,
  CNSX,
  MX,
  NASDAQ,
  NYSE,
  NYSEAM,
  ARCA,
  OPRA,
  PinkSheets,
  OTCBB,
}

export enum SecurityType {
  Stock,
  Option,
  Bond,
  Right,
  Gold,
  MutualFund,
  Index,
}

export interface StockDetailsState {
  symbol: string;
  symbolId: number;
  prevDayClosePrice: number;
  highPrice52: number;
  lowPrice52: number;
  averageVol3Months: number;
  averageVol20Days: number;
  outstandingShares: number;
  eps: number;
  pe: number;
  dividend: number;
  yield: number;
  exDate: Date;
  marketCap: number; 
  tradeUnit: number;
  optionType: OptionType;
  optionDurationType: OptionDurationType;
  optionRoot: string;
  optionExerciseType: OptionExerciseType;
  listingExchange: ListingExchange;
  description: string;
  securityType: SecurityType;
  optionExpiryDate: Date;
  dividendDate: Date;
  optionStrikePrice: number;
  isTradable: boolean;
  isQuotable: boolean;
  hasOptions: boolean;
  currency: string;
  industrySector: string;
  industryGroup:  string;
  industrySubGroup: string;
}

export const defaultStockDetailsState = {
  symbol: '',
  symbolId: 0,
  prevDayClosePrice: 0, 
  highPrice52: 0, 
  lowPrice52: 0, 
  averageVol3Months: 0,
  averageVol20Days: 0,
  outstandingShares: 0, 
  eps: 0,
  pe: 0,
  dividend: 0,
  yield: 0,
  exDate: new Date(), 
  marketCap: 0, 
  tradeUnit: 0, 
  optionType: OptionType.Call,
  optionDurationType: OptionDurationType.LEAP, 
  optionRoot: '',
  optionExerciseType: OptionExerciseType.American,
  listingExchange: ListingExchange.NASDAQ, 
  description: '',
  securityType: SecurityType.Stock,
  optionExpiryDate: new Date(),
  dividendDate: new Date(),
  optionStrikePrice: 0, 
  isTradable: false,
  isQuotable: false,
  hasOptions: false,
  currency: '',
  industrySector: '', 
  industryGroup:  '', 
  industrySubGroup: ''
}

export interface QuoteState {
  c: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
  d: number;
  dp: number;
}

export const defaultQuoteState = {
  c: 0,
  h: 0,
  l: 0,
  o: 0,
  pc: 0,
  t: 0,
  d: 0,
  dp: 0,
}
