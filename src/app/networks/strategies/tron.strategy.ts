import { Injectable, BadRequestException, Logger } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionStrategy } from "../interface/transaction-strategy.interface";
import { TRON_ENDPOINT } from "../common/config";
import { firstValueFrom } from "rxjs";
import { envs } from "src/config";
import { TransactionData } from "../interface/transaction-data.interface";
import { TxClient } from "src/app/tx-client/entities/tx-client.entity";
import { StatusTx } from "src/enums/StatusTx.enum";


interface TronTransferInfo {
  icon_url: string;
  symbol: string;
  level: string;
  to_address: string;
  tokenType2: string;
  contract_address: string;
  type: string;
  decimals: number;
  name: string;
  vip: boolean;
  tokenType: string;
  from_address: string;
  amount_str: string;
  status: number;
}

interface TronApiResponse {
  trc20TransferInfo?: TronTransferInfo[];
  [key: string]: any;
}

@Injectable()
export class TronStrategy implements TransactionStrategy {
  private readonly logger = new Logger(TronStrategy.name);

  constructor(
    private readonly http: HttpService,
    @InjectRepository(TxClient)
    private readonly txClientRepository: Repository<TxClient>,
  ) {}

  getApiUrl(): string {
    return TRON_ENDPOINT.getTransactionInfoByHash;
  }

  async getTransactionByHash(hash: string): Promise<TronApiResponse> {
    try {
      const url = `${this.getApiUrl()}?hash=${hash}`;
      this.logger.log(`Consultando transacción TRON: ${hash}`);

      const response = await firstValueFrom(
        this.http.get<TronApiResponse>(url, {
          headers: { 'TRON-PRO-API-KEY': envs.API_KEY_TRON }
        })
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error al consultar transacción TRON: ${hash}`, error.stack);
      throw new BadRequestException(
        `Error al consultar la transacción en TRON: ${error.message}`
      );
    }
  }

  async validateTransaction(data: TransactionData): Promise<any> {
    // 1. Obtener la transacción de la base de datos
    const dbTransaction = await this.txClientRepository.findOne({
      where: { id: data.idTransaction },
    });

    if (!dbTransaction) {
      throw new BadRequestException(
        `Transacción con ID ${data.idTransaction} no encontrada en la base de datos`
      );
    }

    // 2. Consultar la transacción en la blockchain de TRON
    const url = `${this.getApiUrl()}?hash=${data.hash}`;
    this.logger.log(`Consultando transacción TRON: ${data.hash}`);

    const response = await firstValueFrom(
      this.http.get<TronApiResponse>(url, {
        headers: { 'TRON-PRO-API-KEY': envs.API_KEY_TRON }
      })
    );

    // 3. Verificar si la transacción existe y tiene datos válidos
    if (!response.data || Object.keys(response.data).length === 0) {
      throw new BadRequestException('Transacción no encontrada en la red TRON');
    }

    // 4. Validar que exista información de transferencia TRC20
    if (!response.data.trc20TransferInfo || response.data.trc20TransferInfo.length === 0) {
      throw new BadRequestException(
        'La transacción no contiene información de transferencia TRC20'
      );
    }

    const transferInfo = response.data.trc20TransferInfo[0];

    // 5. Validar el status de la transacción en la blockchain (0 = exitosa)
    if (transferInfo.status !== 0) {
      throw new BadRequestException(
        'La transacción no fue exitosa en la blockchain de TRON'
      );
    }

    // 6. Validar wallet origen
    if (transferInfo.from_address !== dbTransaction.walletAddressSource) {
      throw new BadRequestException(
        `La wallet de origen no coincide. Esperado: ${transferInfo.from_address}, Recibido: ${dbTransaction.walletAddressSource}`
      );
    }

    // 7. Validar wallet destino
    if (transferInfo.to_address !== dbTransaction.walletAddressDestination) {
      throw new BadRequestException(
        `La wallet de destino no coincide. Esperado: ${dbTransaction.walletAddressDestination}, Recibido: ${transferInfo.to_address}`
      );
    }

    // 8. Validar monto (convertir amount_str considerando decimales)
    const amountFromBlockchain = Number(transferInfo.amount_str) / Math.pow(10, transferInfo.decimals);
    const amountFromDb = Number(dbTransaction.transactionAmount);

    if (Math.abs(amountFromBlockchain - amountFromDb) > 0.000001) { // Tolerancia para decimales
      throw new BadRequestException(
        `El monto no coincide. Esperado: ${amountFromDb} ${transferInfo.symbol}, Recibido: ${amountFromBlockchain} ${transferInfo.symbol}`
      );
    }

    // 9. verificar moneda
    if (transferInfo.symbol !== dbTransaction.currency) {
      throw new BadRequestException(
        `La moneda no coincide. Esperado: ${dbTransaction.currency}, Recibido: ${transferInfo.symbol}`
      );
    }

    // 10. verificar que en base de datos la transaccion no este aun pagada
    if(
      dbTransaction.status === StatusTx.COMPLETED ||
      dbTransaction.status === StatusTx.FAILED ||
      dbTransaction.status === StatusTx.CANCELLED ) {
      throw new BadRequestException(
        `La transacción ya ha sido completada previamente.`
      );
    }

    // 10. Actualizar el estado de la transacción en la base de datos
    dbTransaction.status = StatusTx.VERIFIED;
    dbTransaction.transactionHash = data.hash;
    await this.txClientRepository.save(dbTransaction);

    // TODO: falta validar que la fecha si sea correcta y menor a 10 minutos.

    // 11. Retornar respuesta exitosa
    return {
      success: true,
      blockchain: 'TRC20',
      transactionHash: data.hash,
      validation: {
        walletSource: {
          expected: dbTransaction.walletAddressSource,
          received: transferInfo.from_address,
          match: true,
        },
        walletDestination: {
          expected: dbTransaction.walletAddressDestination,
          received: transferInfo.to_address,
          match: true,
        },
        amount: {
          expected: amountFromDb,
          received: amountFromBlockchain,
          currency: transferInfo.symbol,
          match: true,
        },
        status: {
          blockchain: 'SUCCESS',
          database: StatusTx.VERIFIED,
        }
      },
      data: response.data,
    };
  }

}
