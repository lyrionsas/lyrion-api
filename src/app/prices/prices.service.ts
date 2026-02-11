import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prices } from './entities/prices.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PricesService {

  constructor(
    @InjectRepository(Prices)
    private readonly pricesRepository: Repository<Prices>,
  ) {}

  async getLatestPrice(currency: string): Promise<Prices | null> {
    return this.pricesRepository.findOne({
      where: { currency },
      order: { time: 'DESC' },
    });
  }
}
