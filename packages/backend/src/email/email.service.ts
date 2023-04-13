import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { KeyvService } from 'src/keyv/keyv.service';
import { MembersService } from 'src/members/members.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleConnectionService } from 'src/role-connection/role-connection.service';
import { emailTemplate } from './template';

@Injectable()
export class EmailService extends MailService {
  constructor(
    private readonly db: PrismaService,
    private readonly kv: KeyvService,
    private readonly configService: ConfigService,
    private readonly roleConnectionService: RoleConnectionService,
    private readonly memberService: MembersService,
  ) {
    super();
    this.setApiKey(configService.getOrThrow('SENDGRID_KEY'));
  }

  async verifyEmail(email: string, id: string) {
    const token = this.generateToken();
    await this.kv.set(token, { email, userId: id });

    const host = this.configService.getOrThrow('HOST');
    const sendFrom = this.configService.getOrThrow('SEND_FROM');

    await this.send({
      to: email,
      from: sendFrom,
      subject: 'Hey from ProgSoc! Verify your email for our Discord server!',
      templateId: 'd-778479d7b210435cbec21640f4429a26',
      dynamicTemplateData: {
        Weblink: `${host}/api/email/callback?token=${token}`,
      },
    });
  }

  async verifyEmailCallback(token: string, id: string) {
    const email = await this.kv.get(token);
    if (!email) return false;
    if (email.userId !== id) return false;
    await this.db.user.update({
      where: { id },
      data: { email: email.email },
    });
    const isEmailMember = await this.memberService.isMember(email.email);

    await this.roleConnectionService.pushMetadata(id, {
      member: isEmailMember ? 1 : 0,
    });
    return true;
  }

  private generateToken() {
    const token =
      Math.random().toString(36).substring(2, 6) +
      Math.random().toString(36).substring(2, 5);
    return token;
  }
}
