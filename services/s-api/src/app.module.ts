// https://github.com/elvisduru/token-auth-app/blob/master/src/auth/auth.controller.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApiModule } from './api/api.module';
import { QuestradeModule } from './questrade/questrade.module';
import { FinnhubModule } from './finnhub/finnhub.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URI),
    UsersModule,
    AuthModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ApiModule,
    QuestradeModule,
    FinnhubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
