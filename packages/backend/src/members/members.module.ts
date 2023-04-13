import { Module } from '@nestjs/common';
import { MembersService } from './members.service';

@Module({
  imports: [],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
