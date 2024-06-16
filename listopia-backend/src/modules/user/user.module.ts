import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { AuthModule } from '../auth/auth.module';
import { AuthResolver } from '../auth/auth.resolver';

@Module({
  controllers: [UserController],
  providers: [UserService, UserResolver, AuthResolver],
  imports: [AuthModule],
})
export class UserModule {}
