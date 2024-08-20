import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PostgresErrorCodes } from '../database/postgresErrorCodes.enum';
import { EmailService } from '../email/email.service';
import welcomeSignup from '../common/template/welcomeSignup';
import { signupEmail } from '../common/template/verificationEmail';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Cache } from 'cache-manager';
import { EmailVerificationDto } from '../user/dto/email-verification.dto';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import { Provider } from '@common/enums/provider.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signupUser(createUserDto: CreateUserDto) {
    try {
      return await this.userService.createUser({
        ...createUserDto,
        provider: Provider.LOCAL,
      });
    } catch (error) {
      if (error?.code === PostgresErrorCodes.unique_violation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.CONFLICT,
        );
      } else if (error?.code === PostgresErrorCodes.not_null_violation) {
        throw new HttpException(
          'please check not null body value',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.getUserByEmail(loginUserDto.email);
    const isMatched = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isMatched) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  public generateAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    return token;
  }

  async signupWelcomeEmail(email: string) {
    await this.emailService.sendMail({
      to: email,
      subject: 'Welcome to Jiwoong World',
      html: welcomeSignup(email),
    });
    return 'Please Check your Email!';
  }

  async findPasswordSendEmail(email: string) {
    const payload: any = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('FIND_PASSWORD_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('FIND_PASSWORD_EXPIRATION_TIME')}`,
    });
    // 위에 expiresin 조심하기
    const url = `${this.configService.get('EMAIL_BASE_URL')}/change/password?token=${token}`;
    await this.emailService.sendMail({
      to: email,
      subject: 'Password 변경',
      text: `비밀번호 찾기 ${url}`,
    });
    return 'Please Check your Email!';
  }
  async initiateEmailAddressVerification(email: string) {
    const generateNumber = this.generateOTP();
    await this.cacheManager.set(email, generateNumber);
    await this.emailService.sendMail({
      to: email,
      subject: 'Jiwoong - Verification Email Address',
      html: signupEmail(generateNumber),
    });
  }

  generateOTP() {
    let OTP = '';
    for (let i = 1; i <= 6; i++) {
      OTP += Math.floor(Math.random() * 10);
    }
    return OTP;
  }

  async confirmEmailVerification(emailVerificationDto: EmailVerificationDto) {
    const { email, code } = emailVerificationDto;
    const emailCodeByRedis = await this.cacheManager.get(email);
    if (emailCodeByRedis !== code) {
      throw new HttpException('Wrong code provided', HttpStatus.BAD_REQUEST);
    }
    await this.cacheManager.del(email);
    return true;
  }
}
