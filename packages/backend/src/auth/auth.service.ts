import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Profile as DiscordProfile } from 'passport-discord';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly db: PrismaService,
  ) {}

  async validateUser(
    access_token: string,
    refreshToken: string,
    user: DiscordProfile,
  ) {
    const { guilds } = user;
    if (
      (guilds ?? [])
        .map((guild) => guild.id)
        .includes(this.configService.getOrThrow('GUILD_ID'))
    )
      throw new UnauthorizedException(
        'You are not in the Progsoc Discord Server',
      );

    const upsertedUpser = await this.db.user.upsert({
      where: { id: `${user.id}` },
      update: {
        accessToken: access_token,
        refreshToken,
        expiresAt: new Date(604800 * 1000 + Date.now()),
      },
      create: {
        id: `${user.id}`,
        accessToken: access_token,
        refreshToken,
        expiresAt: new Date(604800 * 1000 + Date.now()),
      },
    });

    return upsertedUpser;
  }

  async getAccessToken(userId: string) {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User does not exist');
    if (user.expiresAt < new Date()) {
      const { access_token, refresh_token, expires_at } =
        await this.refreshAccessToken(user.refreshToken);
      await this.db.user.update({
        where: { id: userId },
        data: {
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresAt: expires_at,
        },
      });
      return access_token;
    }
    return user.accessToken;
  }

  async refreshAccessToken(refreshToken: string) {
    const refreshUrl = new URL('https://discord.com/api/oauth2/token');

    const formData = new URLSearchParams();
    formData.append(
      'client_id',
      this.configService.getOrThrow('DISCORD_CLIENT_ID'),
    );
    formData.append(
      'client_secret',
      this.configService.getOrThrow('DISCORD_SECRET'),
    );
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', refreshToken);

    const response = await fetch(refreshUrl.toString(), {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token } = (await response.json()) as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };
    return {
      access_token,
      refresh_token,
      expires_at: new Date(604800 * 1000 + Date.now()),
    };
  }
}
