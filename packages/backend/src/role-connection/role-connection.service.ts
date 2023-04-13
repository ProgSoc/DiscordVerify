import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class RoleConnectionService {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  async pushMetadata(
    userId: string,
    metadata: Record<string, string | number | undefined>,
  ) {
    const connectionUrl = `https://discord.com/api/v10/users/@me/applications/${this.config.getOrThrow(
      'DISCORD_CLIENT_ID',
    )}/role-connection`;
    const accessToken = await this.authService.getAccessToken(userId);

    const body = {
      platform_name: 'Progsoc',
      metadata,
    };

    const response = await fetch(connectionUrl, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const responseData = await response.json();
      console.log(JSON.stringify(responseData, null, 2));
      throw new Error('Failed to push metadata');
    }
  }

  async getMetadata(userId: string) {
    const connectionUrl = `https://discord.com/api/v10/users/@me/applications/${this.config.getOrThrow(
      'DISCORD_CLIENT_ID',
    )}/role-connection`;
    const accessToken = await this.authService.getAccessToken(userId);

    const response = await fetch(connectionUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(
        `Error getting discord metadata: [${response.status}] ${response.statusText}`,
      );
    }
  }
}
