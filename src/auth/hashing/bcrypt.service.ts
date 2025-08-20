import * as bcrypt from 'bcrypt';
import { HashingService } from './hash.service';

export class BCryptService implements HashingService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
