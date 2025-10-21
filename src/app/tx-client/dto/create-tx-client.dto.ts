import { IsEnum, IsNumber, IsPositive, IsString } from "class-validator";
import { IsWalletAddress } from "src/common/validators/is-wallet-address.validator";
import { BlockchainEnum } from "src/enums/Blockchain.enum";
import { CurrencyEnum } from "src/enums/currency.enum";

export class CreateTxClientDto {

  @IsEnum(BlockchainEnum)
  blockchainNetwork: BlockchainEnum;

  @IsString()
  @IsWalletAddress({ message: 'Dirección de wallet inválida para la red especificada' })
  walletAddressSource: string;

  @IsNumber()
  @IsPositive()
  transactionAmount: number;

  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;
}
