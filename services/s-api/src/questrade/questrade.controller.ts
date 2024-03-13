import { Controller, Get, Param, Query } from '@nestjs/common';
import { QuestradeService } from './questrade.service';

@Controller('questrade')
export class QuestradeController {
  constructor(private questradeService: QuestradeService) {}

  @Get('/symbolSearch')
  async searchSymbols(@Query('prefix') prefix: string): Promise<any> {
    return this.questradeService.searchSymbols(prefix);
  }

  @Get('/symbolId/:symbolId')
  async getSymbol(@Param('symbolId') symbolId: number): Promise<any> {
    return this.questradeService.getSymbol(symbolId);
  }

  @Get('/symbolQuotes/:symbolId')
  async getQuotes(@Param('symbolId') symbolId: number): Promise<any> {
    return this.questradeService.getQuotes(symbolId);
  }

  @Get('/symbolCandles/:symbol')
  async getCandlesticks(
    @Param('symbol') symbol: string,
    @Query('ago') ago: number,
    @Query('interval') interval: string,
  ): Promise<any> {
    return this.questradeService.getSymbolCandles(symbol, ago, interval);
  }

  @Get('/symbolCandlesId/:symbolId')
  async getCandlesticksById(
    @Param('symbolId') symbolId: number,
    @Query('ago') ago: number,
    @Query('interval') interval: string,
  ): Promise<any> {
    return this.questradeService.getCandlesticksById(symbolId, ago, interval);
  }
}
