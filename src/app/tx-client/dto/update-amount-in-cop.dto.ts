import { IsNumber, IsPositive } from "class-validator";


export class UpdateAmountInCOPDto {
  @IsNumber()
  @IsPositive()
  idTransaction: number;

  @IsNumber()
  @IsPositive()
  amountInCOP: number;

  @IsNumber()
  @IsPositive()
  priceUSDCOP: number;
}
