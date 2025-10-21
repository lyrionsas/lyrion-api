import { Injectable } from '@nestjs/common';
import { CreateTxPrismaPayDto } from './dto/create-tx-prisma-pay.dto';
import { UpdateTxPrismaPayDto } from './dto/update-tx-prisma-pay.dto';

@Injectable()
export class TxPrismaPayService {
  create(createTxPrismaPayDto: CreateTxPrismaPayDto) {
    return 'This action adds a new txPrismaPay';
  }

  findAll() {
    return `This action returns all txPrismaPay`;
  }

  findOne(id: number) {
    return `This action returns a #${id} txPrismaPay`;
  }

  update(id: number, updateTxPrismaPayDto: UpdateTxPrismaPayDto) {
    return `This action updates a #${id} txPrismaPay`;
  }

  remove(id: number) {
    return `This action removes a #${id} txPrismaPay`;
  }
}
