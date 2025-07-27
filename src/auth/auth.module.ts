import { Global, Module } from '@nestjs/common';
import { BCryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hash.service';

@Global()
@Module({
  providers: [
    {
      provide: HashingService,
      useClass: BCryptService,
    },
  ],
  exports: [HashingService],
})
export class AuthModule {}
