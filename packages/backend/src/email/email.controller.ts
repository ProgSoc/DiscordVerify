import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Redirect,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { GetUser } from 'src/auth/decorators/GetUserDecorator.decorator';
import { EmailDto } from './dto/EmailDto.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('callback')
  @Redirect()
  async onEmailConfirmation(
    @Query('token') token?: string,
    @GetUser('id') id?: string,
  ) {
    if (!token || !id) throw new BadRequestException('Token is required');

    const res = await this.emailService.verifyEmailCallback(token, id);

    if (!res) throw new BadRequestException('Invalid token');

    return { url: '/success' };
  }

  @Post('verify')
  async onEmailVerifyRequest(
    @Body() { email }: EmailDto,
    @GetUser('id') id?: string,
  ) {
    if (!email || !id) throw new BadRequestException('Invalid request');

    await this.emailService.verifyEmail(email, id);

    return 'Email verification sent';
  }
}
