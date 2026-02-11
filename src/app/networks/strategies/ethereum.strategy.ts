import { Injectable, NotImplementedException, Logger } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { TransactionStrategy } from "../interface/transaction-strategy.interface";
import { TransactionData } from "../interface/transaction-data.interface";


@Injectable()
export class EthereumStrategy implements TransactionStrategy {
  private readonly logger = new Logger(EthereumStrategy.name);

  constructor(private readonly http: HttpService) {}

  getApiUrl(): string {
    // TODO: Implementar URL de API de Ethereum (ej: Etherscan, Infura, Alchemy)
    return "https://api.etherscan.io/api";
  }
  getTransactionByHash(_hash: string): Promise<any> {
    this.logger.warn('Estrategia de Ethereum no implementada aún');
    throw new NotImplementedException(
      'La obtención de transacciones Ethereum aún no está implementada. Próximamente disponible.'
    );
  }

  validateTransaction(_data: TransactionData): Promise<any> {
    this.logger.warn('Estrategia de Ethereum no implementada aún');

    throw new NotImplementedException(
      'La validación de transacciones Ethereum aún no está implementada. Próximamente disponible.'
    );

    // TODO: Implementar validación de transacciones Ethereum
    // Ejemplo de implementación futura:
    /*
    try {
      const url = `${this.getApiUrl()}?module=transaction&action=gettxreceiptstatus&txhash=${data.hash}`;

      this.logger.log(`Consultando transacción Ethereum: ${data.hash}`);

      const response = await firstValueFrom(
        this.http.get(url, {
          params: {
            apikey: envs.API_KEY_ETHEREUM
          }
        })
      );

      return {
        success: true,
        blockchain: 'ERC20',
        transactionHash: data.hash,
        data: response.data,
      };
    } catch (error) {
      this.logger.error(`Error validando transacción Ethereum: ${error.message}`);
      throw new BadRequestException(
        `Error al validar la transacción en Ethereum: ${error.message}`
      );
    }
    */
  }
}
