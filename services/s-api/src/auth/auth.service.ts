import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.getUser({ username });
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user && passwordValid) {
      return user;
    }
    return null;
  }
  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    const access_token = this.jwtService.sign(payload);
    const filter = { username: user.username };
    const update = { token: access_token };
    await this.usersService.updateUser(filter, update);
    return {
      message: 'success',
      access_token,
    };
  }
  async checkAccount(username: string): Promise<object> {
    const user = await this.usersService.getUser({ username });
    return {
      status: user ? 'User exists' : 'User does not exist',
      userExists: user ? true : false,
    };
  }
}
