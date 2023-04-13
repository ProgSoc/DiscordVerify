import { Injectable } from '@nestjs/common';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { parse } from 'csv-parse/sync';
import { ConfigService } from '@nestjs/config';

interface Membership {
  first_name: string;
  last_name: string;
  preferred_name: string;
  email: string;
  mobile: string;
  type: string;
  joined_date: string;
  end_date: string;
  price_paid: string;
}

@Injectable()
export class MembersService {
  constructor(private readonly config: ConfigService) {
    this.getMemberships();
  }

  public async getMemberships() {
    const configDir = this.config.getOrThrow('CONFIG_DIR');
    const membershipsUrl = path.join(configDir, 'memberships.csv');

    // 4th column is email
    const membershipFileContent = await fs.readFile(membershipsUrl, 'utf-8');
    const memberships = parse(membershipFileContent, {
      skip_empty_lines: true,
      columns: true,
    }) as Membership[];

    return memberships;
  }

  public async isMember(email: string) {
    const memberships = await this.getMemberships();

    return memberships.find(
      (membership) => membership.email.toLowerCase() === email.toLowerCase(),
    );
  }
}
