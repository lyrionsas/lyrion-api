import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { TxClientModule } from './app/tx-client/tx-client.module';
import { TxPrismaPayModule } from './app/tx-prisma-pay/tx-prisma-pay.module';

@Module({
  imports: [AuthModule, DatabaseModule, TxClientModule, TxPrismaPayModule],
})
export class AppModule {}
