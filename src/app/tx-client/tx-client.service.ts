import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTxClientDto } from './dto/create-tx-client.dto';
import { UpdateTxClientDto } from './dto/update-tx-client.dto';
import { TxClient } from './entities/tx-client.entity';
import { User } from 'src/auth/models';
import { StatusTx } from 'src/enums/StatusTx.enum';
import { BlockchainEnum } from 'src/enums/Blockchain.enum';
import { WALLETS_ADDRESS } from 'src/common/const/wallets';
import { UpdateAmountInCOPDto } from './dto/update-amount-in-cop.dto';


@Injectable()
export class TxClientService {
  constructor(
    @InjectRepository(TxClient)
    private readonly txClientRepository: Repository<TxClient>,
  ) {}

  async create(createTxClientDto: CreateTxClientDto, user: User) {
    const txClient = this.txClientRepository.create({
      ...createTxClientDto,
      walletAddressDestination: createTxClientDto.blockchainNetwork === BlockchainEnum.TRC20
        ? WALLETS_ADDRESS.TRON
        : WALLETS_ADDRESS.ETHEREUM,
      user: user, // Asignar el usuario completo del JWT
      transactionHash: null, // Inicialmente nulo
    });

    await this.txClientRepository.save(txClient);

    return {
      message: 'Transacción creada exitosamente',
      idTx: txClient.id,
      limitTimeDeposit: txClient.limitTimeDeposit,
    };
  }

  async findLastTxByUser(user: User) {
    const transactions = await this.txClientRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      take: 3,
    });

    const transactionParsed = transactions.map(tx => ({
      id: `TX${tx.id}`,
      date: tx.createdAt,
      type: `Venta ${tx.currency}`,
      amount: tx.transactionAmount,
      amountInCOP: tx.amountInCOP,
      currency: tx.currency,
      fee: tx.fee,
      status: tx.status,
    }));

    return transactionParsed;
  }

  async findTxPendingByUser(user: User) {
    const transactions = await this.txClientRepository.find({
      where: {
        user: { id: user.id },
        status: StatusTx.PENDING,
      },
    });

    const transactionParsed = transactions.map(tx => ({
      id: `TX${tx.id}`,
      date: tx.createdAt,
      type: `Venta ${tx.currency}`,
      amount: tx.transactionAmount,
      currency: tx.currency,
      fee: tx.fee,
      status: tx.status,
    }));

    return transactionParsed;
  }

  async countAmountCommerceTxByUser(user: User) {
    const completed = await this.txClientRepository
      .createQueryBuilder('tx')
      .select('SUM(tx.transactionAmount)', 'sum')
      .where('tx.user_id = :userId', { userId: user.id })
      .andWhere('tx.status = :status', { status: StatusTx.COMPLETED })
      .getRawOne();

    const pending = await this.txClientRepository
      .createQueryBuilder('tx')
      .select('SUM(tx.transactionAmount)', 'sum')
      .where('tx.user_id = :userId', { userId: user.id })
      .andWhere('tx.status = :status', { status: StatusTx.PENDING })
      .getRawOne();

    const verified = await this.txClientRepository
      .createQueryBuilder('tx')
      .select('SUM(tx.transactionAmount)', 'sum')
      .where('tx.user_id = :userId', { userId: user.id })
      .andWhere('tx.status = :status', { status: StatusTx.VERIFIED })
      .getRawOne();

    return {
      completedAmountCommerceTx: completed.sum || 0,
      pendingAmountCommerceTx: pending.sum || 0,
      verifiedAmountCommerceTx: verified.sum || 0,
    };
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await this.txClientRepository.findAndCount({
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const transaction = await this.txClientRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada`);
    }

    return transaction;
  }

  async findTxByUser(user: User) {
    const transactions = await this.txClientRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });

    const transactionParsed = transactions.map(tx => ({
      id: `TX${tx.id}`,
      date: tx.createdAt,
      type: `Venta ${tx.currency}`,
      amount: tx.transactionAmount,
      amountInCOP: tx.amountInCOP,
      currency: tx.currency,
      fee: tx.fee,
      status: tx.status,
    }));

    return transactionParsed;
  }

  async update(id: number, updateTxClientDto: UpdateTxClientDto) {
    const transaction = await this.findOne(id);

    const updatedTransaction = Object.assign(transaction, updateTxClientDto);
    await this.txClientRepository.save(updatedTransaction);

    return {
      message: 'Transacción actualizada exitosamente',
      data: updatedTransaction,
    };
  }

  async updateAmountInCOP(updateAmountInCOPDto: UpdateAmountInCOPDto) {
    const transaction = await this.findOne(updateAmountInCOPDto.idTransaction);

    transaction.amountInCOP = updateAmountInCOPDto.amountInCOP;
    transaction.priceUSDCOP = updateAmountInCOPDto.priceUSDCOP;

    await this.txClientRepository.save(transaction);

    return {
      message: 'Montos actualizados exitosamente',
      data: transaction,
    };
  }

  async cancelTx(id: number) {
    const transaction = await this.findOne(id);

    transaction.status = StatusTx.CANCELLED;
    await this.txClientRepository.save(transaction);

    return {
      message: 'Transacción cancelada exitosamente',
      data: transaction,
    };
  }

  async remove(id: number) {
    const transaction = await this.findOne(id);
    await this.txClientRepository.remove(transaction);

    return {
      message: 'Transacción eliminada exitosamente',
    };
  }

  /**
   * Genera un hash único para la transacción
   * En producción, deberías obtener este hash de la blockchain real
   */
  private generateTransactionHash(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `0x${timestamp}${random}`;
  }
}
