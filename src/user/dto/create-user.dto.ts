import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Provider } from '../../common/enums/provider.enum';
import { CreateProductDto } from '@product/dto/create-product.dto';
import { Consent } from '@root/consent/entities/consent.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Jiwoong' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'dnd0311@naver.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)
  @ApiProperty({ example: 'password123@' })
  password?: string;

  @IsString()
  profileImg?: string;

  @IsString()
  provider?: Provider;

  @ApiProperty({ type: CreateProductDto })
  consent?: Consent;
}
