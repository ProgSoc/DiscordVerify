import {
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { DiscordAuthGuard } from './guard/discord.guard';
import { GetUser } from './decorators/GetUserDecorator.decorator';
import { User } from 'discord.js';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('discord')
  @UseGuards(DiscordAuthGuard)
  discordLogin() {
    // initiates the Discord OAuth2 login flow
  }

  @Get('discord/callback')
  @UseGuards(DiscordAuthGuard)
  @Redirect('/')
  async discordLoginCallback() {
    return { url: '/' };
  }

  @Post('logout')
  @Redirect('/')
  async logout(@Req() req: Express.Request, @Res() res: Express.Response) {
    const destroySession = new Promise<void>((res, rej) => {
      req.session.destroy((err) => {
        if (err) rej(err);
        res();
      });
    });

    await destroySession;
  }

  @Get('status')
  async status(@GetUser() user?: User) {
    return {
      loggedIn: !!user,
    };
  }
}
