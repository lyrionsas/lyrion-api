import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlockchainEnum } from 'src/enums/Blockchain.enum';
import { ValidateTransactionDto } from './dto';
import { NetworksService } from './networks.service';

@ApiTags('Networks')
@Controller('networks')
export class NetworksController {
  constructor(private readonly networksService: NetworksService) {}

  @Get('transaction-by-hash')
  async getDataTransactionTron(@Query('hash') hash: string) {
    return this.networksService.getTransactionTronByHash(
      BlockchainEnum.TRC20,
      hash
    );
  }

  @Post('validate-tx-tron')
  @ApiOperation({ summary: 'Validar una transacción en la red TRON' })
  @ApiResponse({
    status: 200,
    description: 'Transacción validada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Hash de transacción inválido o error en la validación',
  })
  async validateTronTransaction(@Body() validateTransactionDto: ValidateTransactionDto) {
    return this.networksService.validateTransaction(
      BlockchainEnum.TRC20,
      {
        hash: validateTransactionDto.hash,
        idTransaction: validateTransactionDto.idTransaction
      }
    );
  }

  @Post('validate-tx-ethereum')
  @ApiOperation({ summary: 'Validar una transacción en la red Ethereum' })
  @ApiResponse({
    status: 200,
    description: 'Transacción validada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Hash de transacción inválido o error en la validación',
  })
  @ApiResponse({
    status: 501,
    description: 'Funcionalidad no implementada aún',
  })
  async validateEthereumTransaction(@Body() validateTransactionDto: ValidateTransactionDto) {
    return this.networksService.validateTransaction(
      BlockchainEnum.ERC20,
      {
        hash: validateTransactionDto.hash,
        idTransaction: validateTransactionDto.idTransaction
      }
    );
  }
}

