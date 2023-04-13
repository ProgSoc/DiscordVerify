import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { KeyvModule } from './keyv/keyv.module';
import { RoleConnectionModule } from './role-connection/role-connection.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { fileURLToPath } from 'url';
import path from 'path';
import { MembersModule } from './members/members.module';

const filePath = fileURLToPath(import.meta.url);
const publicDir = path.join(path.dirname(filePath), '../public');

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RoleConnectionModule,
    EmailModule,
    KeyvModule,
    MembersModule,
    ServeStaticModule.forRoot({
      rootPath: publicDir,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
