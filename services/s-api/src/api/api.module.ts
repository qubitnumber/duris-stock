import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
        baseURL: process.env.F_SERVER_BASE_URL,
        withCredentials: true,
        headers: {
          Authorization: 'Bearer ' + process.env.F_X_API_KEY,
          'Content-Type': 'application/json',
        },
      }),
    }),
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
