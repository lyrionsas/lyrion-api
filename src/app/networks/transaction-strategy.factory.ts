import { BadRequestException, Injectable } from "@nestjs/common";
import { TransactionStrategy } from "./interface/transaction-strategy.interface";
import { TronStrategy } from "./strategies/tron.strategy";
import { STRATEGIES } from "./common/config";
import { EthereumStrategy } from "./strategies/ethereum.strategy";
import { BlockchainEnum } from "src/enums/Blockchain.enum";


@Injectable()
export class TransactionStrategyFactory {
  private readonly strategyMap: Map<string, TransactionStrategy>;

  constructor(
    private readonly tronStrategy: TronStrategy,
    private readonly ethereumStrategy: EthereumStrategy,
  ) {
    // Mapeo dinámico
    this.strategyMap = new Map<BlockchainEnum, TransactionStrategy>();

    Object.entries(STRATEGIES).forEach(([key, className]) => {
      const instance = this.resolveStrategyByName(className);
      if (instance) this.strategyMap.set(BlockchainEnum[key], instance);
    });
  }

  private resolveStrategyByName(name: string): TransactionStrategy | null {
    const strategies: Record<string, TransactionStrategy> = {
      TronStrategy: this.tronStrategy,
      EthereumStrategy: this.ethereumStrategy,
    };
    return strategies[name] || null;
  }

  getStrategy(provider: BlockchainEnum): TransactionStrategy {
    const strategy = this.strategyMap.get(provider);
    if (!strategy) {
      throw new BadRequestException(`Proveedor no soportado: ${provider}`);
    }
    return strategy;
  }
}
