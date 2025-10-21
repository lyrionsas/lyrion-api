import { Module } from '@nestjs/common';
import { TxClientService } from './tx-client.service';
import { TxClientController } from './tx-client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TxClient } from './entities/tx-client.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TxClient]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [TxClientController],
  providers: [TxClientService],
})
export class TxClientModule {}
