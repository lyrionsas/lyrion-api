import { IsArray, IsNumber } from "class-validator";


export class CreatePaymentRequestDto {

  @IsNumber()
  transactionId: number;

  @IsNumber()
  totalDistributed: number;

  @IsArray()
  distributions: string[];
}
