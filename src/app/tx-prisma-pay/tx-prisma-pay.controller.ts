import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TxPrismaPayService } from './tx-prisma-pay.service';
import { CreateTxPrismaPayDto } from './dto/create-tx-prisma-pay.dto';
import { UpdateTxPrismaPayDto } from './dto/update-tx-prisma-pay.dto';

@Controller('tx-prisma-pay')
export class TxPrismaPayController {
  constructor(private readonly txPrismaPayService: TxPrismaPayService) {}

  @Post()
  create(@Body() createTxPrismaPayDto: CreateTxPrismaPayDto) {
    return this.txPrismaPayService.create(createTxPrismaPayDto);
  }

  @Get()
  findAll() {
    return this.txPrismaPayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.txPrismaPayService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTxPrismaPayDto: UpdateTxPrismaPayDto) {
    return this.txPrismaPayService.update(+id, updateTxPrismaPayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.txPrismaPayService.remove(+id);
  }
}
