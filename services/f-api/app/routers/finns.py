import os

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Depends
from ..dependencies import get_bear_token
import finnhub

load_dotenv()

router = APIRouter(
    prefix="/finns",
    tags=["finns"],
    dependencies=[Depends(get_bear_token)],
    responses={404: {"description": "Not found"}},
)

# Setup client
finnhub_client = finnhub.Client(api_key=os.getenv('FINNHUB_API_KEY'))

@router.get("/search")
async def searchSymbol(q: str):
    if not q:
        raise HTTPException(status_code=404, detail="Query not found")
    res = finnhub_client.symbol_lookup('apple')
    return res

@router.get("/stock")
async def fetchStockDetails(symbol: str):
    if not symbol:
        raise HTTPException(status_code=404, detail="Symbol not found")
    res = finnhub_client.company_profile2(symbol='apple')
    return res

@router.get("/quote")
async def fetchQuote(symbol: str):
    if not symbol:
        raise HTTPException(status_code=404, detail="Symbol not found")
    res = finnhub_client.quote('apple')
    return res

@router.get("/history")
async def fetchHistoricalData(symbol: str, resolution: str, frm: int, to: int):
    if not symbol or not resolution or not frm or not to:
        raise HTTPException(status_code=404, detail="Query not found")
    res = finnhub_client.stock_candles(symbol, resolution, frm, to)
    return res
