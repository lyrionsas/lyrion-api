import { IsNotEmpty, IsNumber } from "class-validator";


export class GeneratePaymentDto {

  @IsNumber()
  idTransaction: number;

  @IsNumber()
  amountInCOP: number;

  @IsNotEmpty()
  listBankPayments: BankPayments[];
}


class BankPayments {}
