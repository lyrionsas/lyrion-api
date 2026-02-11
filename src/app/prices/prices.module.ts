import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prices } from './entities/prices.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prices])],
  controllers: [PricesController],
  providers: [PricesService],
  exports: [PricesService, TypeOrmModule],
})
export class PricesModule {}
