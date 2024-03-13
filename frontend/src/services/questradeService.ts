import HttpClient from './HttpClient'
import constant from './constant'

export default {

  searchSymbols(prefix: string) {
    return HttpClient.requestWithToken.get(`${constant.questrade}/symbolSearch`, {
      params: { prefix }
    })
  },

  getSymbol(symbolId: number) {
    return HttpClient.requestWithToken.get(`${constant.questrade}/symbolId/${symbolId}`)
  },

  getQuotes(symbolId: number) {
    return HttpClient.requestWithToken.get(`${constant.questrade}/symbolQuotes/${symbolId}`)
  },

  getCandlesticksBySymbol(symbol: string, ago: number, interval: string) {       
    return HttpClient.requestWithToken.get(`${constant.questrade}/symbolCandles/${symbol}`, {
      params: { ago, interval }
    })
  },

  getCandlesticksBySymbolId(symbolId: number, ago: number, interval: string) {       
    return HttpClient.requestWithToken.get(`${constant.questrade}/symbolCandlesId/${symbolId}`, {
      params: { ago, interval }
    })
  },
}