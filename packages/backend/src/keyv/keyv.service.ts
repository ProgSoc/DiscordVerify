import { Injectable } from '@nestjs/common';
import Keyv from 'keyv';

interface KeyVEmail {
  email: string;
  userId: string;
}

@Injectable()
export class KeyvService extends Keyv<KeyVEmail> {
  constructor() {
    super({
      ttl: 1000 * 60 * 60 * 24,
    });
  }
}
