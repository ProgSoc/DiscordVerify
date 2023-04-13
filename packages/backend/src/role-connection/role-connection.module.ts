import { Global, Module } from '@nestjs/common';
import { RoleConnectionService } from './role-connection.service';
@Global()
@Module({
  providers: [RoleConnectionService],
  controllers: [],
  exports: [RoleConnectionService],
})
export class RoleConnectionModule {}
