import HttpClient from './HttpClient'
import constant from './constant'

export default {

  companyNewsBySymbol(symbol: string, from: string, to: string) {
    return HttpClient.requestWithToken.get(`${constant.finnhub}/companyNews`, {
      params: { symbol, from, to }
    })
  }
}