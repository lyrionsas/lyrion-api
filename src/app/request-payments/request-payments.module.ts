import { Module } from '@nestjs/common';
import { RequestPaymentsService } from './request-payments.service';
import { RequestPaymentsController } from './request-payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestPayments } from './entities/request-payments.entity';
import { PassportModule } from '@nestjs/passport';
import { TxClient } from '../tx-client/entities/tx-client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestPayments, TxClient]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [RequestPaymentsController],
  providers: [RequestPaymentsService],
})
export class RequestPaymentsModule {}
