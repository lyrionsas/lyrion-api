import { PartialType } from '@nestjs/swagger';
import { CreateTxPrismaPayDto } from './create-tx-prisma-pay.dto';

export class UpdateTxPrismaPayDto extends PartialType(CreateTxPrismaPayDto) {}
