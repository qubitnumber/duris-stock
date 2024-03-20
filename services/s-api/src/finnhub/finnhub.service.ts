import { Injectable, ForbiddenException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs';

@Injectable()
export class FinnhubService {
  constructor(private http: HttpService) {}

  companyNews(symbol: string, from: string, to: string) {
    return this.http
      .get(`/finnhub/companyNews`, {
        params: { symbol, _from: from, _to: to },
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
}
