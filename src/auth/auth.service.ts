import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    let token: string;

    if (username === 'SYSTEM') {
      token = await this.loginSystemUser(pass);
    } else {
      token = await this.loginUser(username, pass);
    }

    return {
      access_token: token,
    };
  }

  private async loginSystemUser(password: string): Promise<string> {
    const isMatch: boolean = await bcrypt.compare(
      password,
      jwtConstants.system_pass,
    );
    if (isMatch) {
      const payload = { sub: 'SYSTEM', userExternalId: 'SYSTEM' };
      return await this.jwtService.signAsync(payload);
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  private async loginUser(username: string, password: string): Promise<string> {
    let user = await this.usersService.findOne({ externalId: username });
    if (!user) {
      user = await this.usersService.create({
        externalId: username,
      });
    }

    const isMatch: boolean = await bcrypt.compare(
      password,
      jwtConstants.user_pass,
    );
    if (isMatch) {
      const payload = { sub: user.userId, userExternalId: user.externalId };
      return await this.jwtService.signAsync(payload);
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
