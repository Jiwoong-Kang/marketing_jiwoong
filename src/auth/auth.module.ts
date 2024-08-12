import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalAuthStrategy } from './strategies/local-auth.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';

@Module({
  imports: [UserModule, ConfigService, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthStrategy, AccessTokenStrategy],
})
export class AuthModule {}
