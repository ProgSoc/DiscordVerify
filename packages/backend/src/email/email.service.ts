import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { KeyvService } from 'src/keyv/keyv.service';
import { MembersService } from 'src/members/members.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleConnectionService } from 'src/role-connection/role-connection.service';

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
      from: 'test@pietschner.com',
      subject: 'Verify your email',
      text: `Please verify your email by clicking this link: ${host}/api/email/callback?token=${token}`,
      html: `<p>Please verify your email by clicking this link: <a href="${host}/api/email/callback?token=${token}">Verify</a></p>`,
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