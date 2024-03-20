import os
import httpx

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Depends, Request
from datetime import datetime, timedelta

from ..dependencies import get_bear_token
from ..db.db import token_collection
from ..services import detect_drop_price

load_dotenv()

router = APIRouter(
  prefix="/questrade",
  tags=["quest"],
  dependencies=[Depends(get_bear_token)],
  responses={404: {"description": "Not found"}},
)

class BearerAuth(httpx.Auth):
  def __init__(self, token):
      self.token = token

  def auth_flow(self, request):
      request.headers['Authorization'] = 'Bearer ' + self.token
      yield request

async def get_db_refresh_token():
  refresh_token = await token_collection.find_one({"seq": 1})
  if refresh_token:
      return refresh_token
  raise HTTPException(status_code=404, detail="Refresh Token not found")

async def post_refresh_token(refreshToken, request):
  access_token_url = os.getenv('QUEST_ACCESS_TOKEN_URL')
  params = { 'grant_type': 'refresh_token', 'refresh_token': refreshToken }
  try:
    requests_client = request.app.requests_client
    refreshToken = await requests_client.post(access_token_url, params=params)
    return refreshToken.json()
  except:
    raise HTTPException(status_code=404, detail="Refresh Token not found")
  
async def update_refresh_token(refresh_token: str):
  refresh_token = await token_collection.find_one_and_update(
    {"seq": 1}, {"$set": { "refreshToken" : refresh_token}}
  )
  if refresh_token:
      return refresh_token
  raise HTTPException(status_code=404, detail="Refresh Token not updated")
  
async def redeem_token(request):
  prev_refresh_token = await get_db_refresh_token()
  refreshToken = prev_refresh_token['refreshToken']
  new_refresh_token_dict = await post_refresh_token(refreshToken, request)
  if new_refresh_token_dict:
    await update_refresh_token(new_refresh_token_dict['refresh_token'])
    return new_refresh_token_dict
  raise HTTPException(status_code=404, detail="Access Token not available")


# GET markets/candles/:id => https://api01.iq.questrade.com/v1/markets/candles/38738?startTime=2014-10-01T00:00:00-05:00&endTime=2014-10-20T23:59:59-05:00&interval=OneDay
async def get_candles(symbol_identifier: int, startTime: datetime, endTime: datetime, interval: str, request: Request):
  redeemed_token_dict = await redeem_token(request)
  auth = BearerAuth(redeemed_token_dict['access_token'])
  params = { 'startTime': startTime, 'endTime': endTime, 'interval': interval}
  try:
    url = redeemed_token_dict['api_server'] + 'v1/markets/candles/' + str(symbol_identifier)
    requests_client = request.app.requests_client
    symbolCandles = await requests_client.get(url, auth=auth, params=params)
    return symbolCandles.json()
  except httpx.RequestError as exc:
    raise HTTPException(status_code=404, detail="Symbol candles Token not found")
  

# GET symbols/search => https://api01.iq.questrade.com/v1/symbols/search?prefix=BMO
@router.get("/symbolSearch")
async def search_symbols(prefix: str, request: Request):
  redeemed_token_dict = await redeem_token(request)
  auth = BearerAuth(redeemed_token_dict['access_token'])
  params = { 'prefix': prefix }
  try:
    url = redeemed_token_dict['api_server'] + 'v1/symbols/search'
    requests_client = request.app.requests_client
    symbols = await requests_client.get(url, auth=auth, params=params)
    return symbols.json()
  except httpx.RequestError as exc:
    raise HTTPException(status_code=404, detail="Refresh Token not found")


# GET symbols/:id => https://api01.iq.questrade.com/v1/symbols/8049
@router.get("/symbolId/{symbol_identifier}")
async def get_symbols(symbol_identifier: int, request: Request):
  redeemed_token_dict = await redeem_token(request)
  auth = BearerAuth(redeemed_token_dict['access_token'])
  try:
    url = redeemed_token_dict['api_server'] + 'v1/symbols/' + str(symbol_identifier)
    requests_client = request.app.requests_client
    symbolDetails = await requests_client.get(url, auth=auth)
    return symbolDetails.json()
  except httpx.RequestError as exc:
    raise HTTPException(status_code=404, detail="Symbol information Token not found")

  
# GET markets/quotes/:id => https://api01.iq.questrade.com/v1/markets/quotes/3873
@router.get("/symbolQuotes/{symbol_identifier}")
async def get_quotes(symbol_identifier: int, request: Request):
  redeemed_token_dict = await redeem_token(request)
  auth = BearerAuth(redeemed_token_dict['access_token'])
  try:
    url = redeemed_token_dict['api_server'] + 'v1/markets/quotes/' + str(symbol_identifier)
    requests_client = request.app.requests_client
    symbolQuotes = await requests_client.get(url, auth=auth)
    return symbolQuotes.json()
  except httpx.RequestError as exc:
    raise HTTPException(status_code=404, detail="Symbol candles Token not found")


# GET time => https://api01.iq.questrade.com/v1/time
@router.get("/time")
async def get_time(request: Request):
  redeemed_token_dict = await redeem_token(request)
  auth = BearerAuth(redeemed_token_dict['access_token'])
  try:
    url = redeemed_token_dict['api_server'] + 'v1/time'
    requests_client = request.app.requests_client
    time = await requests_client.get(url, auth=auth)
    return time.json()
  except httpx.RequestError as exc:
    raise HTTPException(status_code=404, detail="Server time not found")
  
  
@router.get("/symbolCandles/{symbol}")
async def get_symbol_candles(symbol: str, ago: int, interval: str, request: Request):
  search_symbol = await search_symbols(symbol, request)
  symbol_identifier = search_symbol['symbols'][0]['symbolId']
  server_time = await get_time(request)
  endTime = datetime.fromisoformat(server_time['time'])
  startTime = endTime - timedelta(hours = ago)
  return await get_candles(symbol_identifier, startTime, endTime, interval, request)

@router.get("/symbolCandlesId/{symbolId}")
async def get_symbol_candles_id(symbolId: int, ago: int, interval: str, request: Request):
  server_time = await get_time(request)
  endTime = datetime.fromisoformat(server_time['time'])
  startTime = endTime - timedelta(hours = ago)
  data = await get_candles(symbolId, startTime, endTime, interval, request)
  drop_info = await detect_drop_price.model(data['candles'], interval)
  data['drop_info'] = {
    'avgPriceDrop':  drop_info['avg_price_drop'],
    'threshold': drop_info['threshold'],
    'biggestDrop': drop_info['biggest_drop']
  }
  return data
  