import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { DiscordStrategy } from './strategy/discord.strategy';
import { SessionSerializer } from './session.serializer';

@Global()
@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
  ],
  providers: [AuthService, DiscordStrategy, SessionSerializer],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
