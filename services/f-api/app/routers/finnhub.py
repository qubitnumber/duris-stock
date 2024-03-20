import os
import time

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Depends
from ..dependencies import get_bear_token
from ..services import article_bert_nlp
import finnhub


load_dotenv()

router = APIRouter(
    prefix="/finnhub",
    tags=["finns"],
    dependencies=[Depends(get_bear_token)],
    responses={404: {"description": "Not found"}},
)

# Setup client
finnhub_client = finnhub.Client(api_key=os.getenv('FINNHUB_API_KEY'))

@router.get("/companyNews")
async def companyNews(symbol: str, _from: str, _to: str):
    if not symbol:
        raise HTTPException(status_code=404, detail="Symbol not found")
    res = finnhub_client.company_news(symbol, _from=_from, to=_to)
    for element in res:
        article = element['headline']
        positive, negative, neutral = await article_bert_nlp.model(article)
        element['positive'] = positive
        element['negative'] = negative
        element['neutral'] = neutral
    end = time.time()
    return res


