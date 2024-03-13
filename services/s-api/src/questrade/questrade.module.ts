import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { QuestradeController } from './questrade.controller';
import { QuestradeService } from './questrade.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
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
  controllers: [QuestradeController],
  providers: [QuestradeService],
})
export class QuestradeModule {}
