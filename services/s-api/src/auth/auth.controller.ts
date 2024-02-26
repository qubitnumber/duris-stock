import {
  Body,
  Controller,
  HttpStatus,
  Request,
  Response,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthorizationGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/check-account')
  async createUser(@Body('username') username: string): Promise<any> {
    const result = await this.authService.checkAccount(username);
    return result;
  }

  @UseGuards(AuthorizationGuard)
  @Get('/verify')
  async Authorization(@Request() request, @Response() response) {
    return response.status(HttpStatus.OK).json({
      message: 'success',
    });
  }
}
