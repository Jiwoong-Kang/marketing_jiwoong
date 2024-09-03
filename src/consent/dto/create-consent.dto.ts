import { ApiProperty } from '@nestjs/swagger';

export class CreateConsentDto {
  @ApiProperty({ example: true })
  overFourteen: boolean;

  @ApiProperty({ example: true })
  agreeOfTerm: boolean;

  @ApiProperty({ example: true })
  agreeOfPersonalInfo: boolean;

  @ApiProperty({ example: false })
  agreeOfMarketing: boolean;

  @ApiProperty({ example: false })
  agreeOfETC: boolean;
}
