import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NetworksService } from './networks.service';
import { NetworksController } from './networks.controller';
import { TransactionStrategyFactory } from './transaction-strategy.factory';
import { TronStrategy } from './strategies/tron.strategy';
import { EthereumStrategy } from './strategies/ethereum.strategy';
import { TxClient } from '../tx-client/entities/tx-client.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([TxClient]),
  ],
  controllers: [NetworksController],
  providers: [
    NetworksService,
    TransactionStrategyFactory,
    TronStrategy,
    EthereumStrategy,
  ],
  exports: [NetworksService],
})
export class NetworksModule {}
