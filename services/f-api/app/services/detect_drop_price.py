import pandas as pd
from datetime import datetime

async def get_minutes_diff(start_date, end_date):
  delta = end_date - start_date
  hours = delta.total_seconds()/60/60
  return hours

async def detect_significant_price_drops(stock_date, threshold = 0.1):
  percentage_change = stock_date['close'].pct_change()
  significant_price_drops = percentage_change[percentage_change < -threshold]
  return significant_price_drops

async def convert_dict_to_df(dict_list: object):
  df = pd.DataFrame.from_records(dict_list)
  df['date']= pd.to_datetime(df['end'])
  df.set_index('date', inplace=True)
  return df

async def model(dict_list: object, interval: str):
  df = await convert_dict_to_df(dict_list)
  significant_price_drops = await detect_significant_price_drops(df, threshold = 0.01)
  NUM_DAYS_BETWEEN_PRICE_DROP = []
  price_drop_len = len(significant_price_drops.index)
  TIME_UNIT = ''

  for i in range(0, price_drop_len-1):
    hours_diff = await get_minutes_diff(significant_price_drops.index[i], significant_price_drops.index[i+1])
    if interval == 'OneDay':
      NUM_DAYS_BETWEEN_PRICE_DROP.append(hours_diff/ 24)
      TIME_UNIT = ' day(s)'
    else:
      NUM_DAYS_BETWEEN_PRICE_DROP.append(hours_diff)
      TIME_UNIT = ' hour(s)'
  
  drop_info = {'avg_price_drop': '', 'threshold': '', 'biggest_drop': ''}

  if price_drop_len > 1:
    average_days_drop = round(sum(NUM_DAYS_BETWEEN_PRICE_DROP) / len(NUM_DAYS_BETWEEN_PRICE_DROP), 1)
    avg_price_drop = round(significant_price_drops.mean() * 100, 2)
    threshold_count = len(significant_price_drops)
    total_times = len(df)
    biggest_drop = round(significant_price_drops.min() * 100, 2)
  
    drop_info = {
      'avg_price_drop': 'Average drop of ' + str(avg_price_drop) + ' % about every ' + str(average_days_drop) + TIME_UNIT,
      'threshold': 'Threshold was met ' + str(threshold_count) + ' out of ' + str(total_times),
      'biggest_drop': 'The biggest drop was ' + str(biggest_drop) + ' %'
    }
  return drop_info
  
  