import { Controller, Get, Query } from '@nestjs/common';
import { FinnhubService } from './finnhub.service';

@Controller('finnhub')
export class FinnhubController {
  constructor(private finnhubService: FinnhubService) {}

  // /company-news?symbol=AAPL&from=2023-08-15&to=2023-08-20
  @Get('/companyNews')
  async companyNews(
    @Query('symbol') symbol: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<any> {
    return this.finnhubService.companyNews(symbol, from, to);
  }
}
