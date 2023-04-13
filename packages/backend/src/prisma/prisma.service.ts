import {
  INestApplicationContext,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly config: ConfigService) {
    const databaseUrl = config.getOrThrow('DATABASE_URL');
    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }

  async enableShutdownHooks(app: INestApplicationContext) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
