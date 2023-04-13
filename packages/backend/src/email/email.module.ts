import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { RoleConnectionModule } from 'src/role-connection/role-connection.module';
import { RoleConnectionService } from 'src/role-connection/role-connection.service';
import { MembersModule } from 'src/members/members.module';
import { MembersService } from 'src/members/members.service';

@Module({
  imports: [RoleConnectionModule, MembersModule],
  providers: [EmailService, RoleConnectionService, MembersService],
  controllers: [EmailController],
})
export class EmailModule {}
