import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { TxClientService } from './tx-client.service';
import { CreateTxClientDto } from './dto/create-tx-client.dto';
import { UpdateTxClientDto } from './dto/update-tx-client.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/models';
import { UpdateAmountInCOPDto } from './dto/update-amount-in-cop.dto';

@Auth()
@Controller('tx-client')
export class TxClientController {
  constructor(private readonly txClientService: TxClientService) {}

  @Post()
  create(
    @Body() createTxClientDto: CreateTxClientDto,
    @GetUser() user: User,
  ) {
    return this.txClientService.create(createTxClientDto, user);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.txClientService.findAll(page || 1, limit || 10);
  }

  @Get('by-user')
  findTxByUser(@GetUser() user: User) {
    return this.txClientService.findTxByUser(user);
  }

  @Get('last-tx-by-user')
  findLastTxByUser(@GetUser() user: User) {
    return this.txClientService.findLastTxByUser(user);
  }

  @Get('tx-pending-by-user')
  findTxPendingByUser(@GetUser() user: User) {
    return this.txClientService.findTxPendingByUser(user);
  }

  @Get('count-amount-commerce-tx-by-user')
  countAmountCommerceTxByUser(@GetUser() user: User) {
    return this.txClientService.countAmountCommerceTxByUser(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.txClientService.findOne(id);
  }

  @Patch('update-amount-cop')
  updateAmountInCOP(
    @Body() updateAmountInCOPDto: UpdateAmountInCOPDto,
  ) {
    return this.txClientService.updateAmountInCOP(updateAmountInCOPDto);
  }

  @Patch('cancel-tx/:id')
  cancelTx(@Param('id', ParseIntPipe) id: number) {
    return this.txClientService.cancelTx(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTxClientDto: UpdateTxClientDto,
  ) {
    return this.txClientService.update(id, updateTxClientDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.txClientService.remove(id);
  }
}
