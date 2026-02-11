import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { TxClientModule } from './app/tx-client/tx-client.module';
import { TxPrismaPayModule } from './app/tx-prisma-pay/tx-prisma-pay.module';
import { NetworksModule } from './app/networks/networks.module';
import { BankAccountsModule } from './app/bank-accounts/bank-accounts.module';
import { PricesModule } from './app/prices/prices.module';
import { RequestPaymentsModule } from './app/request-payments/request-payments.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    HealthModule,
    AuthModule,
    DatabaseModule,
    TxClientModule,
    TxPrismaPayModule,
    NetworksModule,
    BankAccountsModule,
    PricesModule,
    RequestPaymentsModule,
  ],
})
export class AppModule {}
