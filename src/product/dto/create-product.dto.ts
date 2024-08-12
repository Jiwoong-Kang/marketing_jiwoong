import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'notebook' })
  name: string;

  @ApiProperty({ example: 'notebook is good' })
  description: string;

  @ApiProperty({ example: 'notebookkk' })
  productImg: string;

  @ApiProperty({ example: '100' })
  price: number;

  @ApiProperty({ example: '4' })
  stock: number;

  @ApiProperty({ example: 'true' })
  isSale: boolean;
}
