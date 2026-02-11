import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDto, UpdateBankAccountDto } from './dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/models';

@Controller('bank-accounts')
@Auth() // Requiere autenticación para todos los endpoints
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createBankAccountDto: CreateBankAccountDto,
    @GetUser() user: User,
  ) {
    return this.bankAccountsService.create(createBankAccountDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.bankAccountsService.findAll(user.id);
  }

  @Get('by-user')
  findAllByUser(@GetUser() user: User) {
    return this.bankAccountsService.findAllByUser(user.id);
  }

  @Get('stats')
  getStats(@GetUser() user: User) {
    return this.bankAccountsService.getStats(user.id);
  }

  @Get('have-active-accounts')
  haveActiveAccounts(@GetUser() user: User) {
    return this.bankAccountsService.haveActiveAccounts(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.bankAccountsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
    @GetUser() user: User,
  ) {
    return this.bankAccountsService.update(id, updateBankAccountDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.bankAccountsService.remove(id, user.id);
  }
}
