import { Test, TestingModule } from '@nestjs/testing';
import { TxPrismaPayController } from './tx-prisma-pay.controller';
import { TxPrismaPayService } from './tx-prisma-pay.service';

describe('TxPrismaPayController', () => {
  let controller: TxPrismaPayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TxPrismaPayController],
      providers: [TxPrismaPayService],
    }).compile();

    controller = module.get<TxPrismaPayController>(TxPrismaPayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
