import { Injectable, ForbiddenException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs';

@Injectable()
export class QuestradeService {
  constructor(private http: HttpService) {}

  searchSymbols(prefix: string) {
    return this.http
      .get(`/questrade/symbolSearch`, {
        params: { prefix },
      })
      .pipe(
        map((res) => {
          return res.data;
        }),
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );
  }

  getSymbolCandles(symbol: string, ago: number, interval: string) {
    return this.http
      .get(`/questrade/symbolCandles/${symbol}`, {
        params: { ago, interval },
      })
      .pipe(
        map((res) => {
          return res.data;
        }),
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );
  }

  getCandlesticksById(symbolId: number, ago: number, interval: string) {
    return this.http
      .get(`/questrade/symbolCandlesId/${symbolId}`, {
        params: { ago, interval },
      })
      .pipe(
        map((res) => {
          return res.data;
        }),
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );
  }

  getQuotes(symbolId: number) {
    return this.http
      .get(`/questrade/symbolQuotes/${symbolId}`)
      .pipe(
        map((res) => {
          console.log('getQuotes', res);
          return res.data;
        }),
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );
  }

  getSymbol(symbolId: number) {
    return this.http
      .get(`/questrade/symbolId/${symbolId}`)
      .pipe(
        map((res) => {
          return res.data;
        }),
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );
  }
}
