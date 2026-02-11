import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateTransactionDto {

  @ApiProperty({
    description: 'ID de la transacción',
    example: '132',
  })
  @IsNumber()
  @IsNotEmpty()
  idTransaction: number;

  @ApiProperty({
    description: 'Hash de la transacción',
    example: '7c2d4206c03e1358df9867a2c87149a2e7a4cdd3e5b0c4d6f3e2a1b0c9d8e7f6',
  })
  @IsString()
  @IsNotEmpty()
  hash: string;
}
