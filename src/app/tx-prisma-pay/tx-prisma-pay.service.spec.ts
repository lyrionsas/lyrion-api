import { Test, TestingModule } from '@nestjs/testing';
import { TxPrismaPayService } from './tx-prisma-pay.service';

describe('TxPrismaPayService', () => {
  let service: TxPrismaPayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TxPrismaPayService],
    }).compile();

    service = module.get<TxPrismaPayService>(TxPrismaPayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
