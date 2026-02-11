import { Injectable, Logger } from '@nestjs/common';
import { TransactionStrategyFactory } from './transaction-strategy.factory';
import { TransactionData } from './interface/transaction-data.interface';
import { BlockchainEnum } from 'src/enums/Blockchain.enum';

@Injectable()
export class NetworksService {
  private readonly logger = new Logger(NetworksService.name);

  constructor(private readonly strategyFactory: TransactionStrategyFactory) {}

  async getTransactionTronByHash(provider: BlockchainEnum, hash: string) {
    try {
      const strategy = this.strategyFactory.getStrategy(provider);
      const result = await strategy.getTransactionByHash(hash);

      return result;
    } catch (error) {
      this.logger.error(`Error obteniendo transacción en ${provider}:`, error.message);
      throw error;
    }
  }

  async validateTransaction(provider: BlockchainEnum, data: TransactionData) {
    try {
      const strategy = this.strategyFactory.getStrategy(provider);
      const result = await strategy.validateTransaction(data);

      return result;
    } catch (error) {
      this.logger.error(`Error validando transacción en ${provider}:`, error.message);
      throw error;
    }
  }
}
