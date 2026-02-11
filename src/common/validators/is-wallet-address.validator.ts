import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { BlockchainEnum } from 'src/enums/Blockchain.enum';

export function IsWalletAddress(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isWalletAddress',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const { blockchainNetwork } = args.object as any;

          if (blockchainNetwork === BlockchainEnum.ERC20) {
            // Formato Ethereum
            return /^0x[a-fA-F0-9]{40}$/.test(value);
          }

          if (blockchainNetwork === BlockchainEnum.TRC20) {
            // Formato Tron (Base58Check, empieza con T)
            return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(value);
          }

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          const { blockchainNetwork } = args.object as any;
          return `La dirección no coincide con el formato esperado para la red ${blockchainNetwork || 'desconocida'}`;
        },
      },
    });
  };
}
