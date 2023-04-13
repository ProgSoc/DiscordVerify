import {
  Profile,
  Strategy,
  StrategyOptionsWithRequest,
} from 'passport-discord';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(private authService: AuthService, config: ConfigService) {
    const options: StrategyOptionsWithRequest = {
      passReqToCallback: true,
      clientID: config.getOrThrow('DISCORD_CLIENT_ID'),
      clientSecret: config.getOrThrow('DISCORD_SECRET'),
      callbackURL: config.getOrThrow('DISCORD_CALLBACK'),
      scope: ['identify', 'role_connections.write'],
    };
    super(options);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const user = await this.authService.validateUser(
      accessToken,
      refreshToken,
      profile,
    );

    return user;
  }
}
