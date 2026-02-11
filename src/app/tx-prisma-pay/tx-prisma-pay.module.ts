import { Module } from '@nestjs/common';
import { TxPrismaPayService } from './tx-prisma-pay.service';
import { TxPrismaPayController } from './tx-prisma-pay.controller';

@Module({
  controllers: [TxPrismaPayController],
  providers: [TxPrismaPayService],
})
export class TxPrismaPayModule {}
