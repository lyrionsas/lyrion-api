import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/models';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestPayments } from './entities/request-payments.entity';
import { Repository } from 'typeorm';
import { TxClient } from '../tx-client/entities/tx-client.entity';
import { StatusTx } from 'src/enums/StatusTx.enum';

@Injectable()
export class RequestPaymentsService {

  constructor(
    @InjectRepository(RequestPayments) private readonly requestPaymentsRepository: Repository<RequestPayments>,
    @InjectRepository(TxClient) private readonly txClientRepository: Repository<TxClient>,
  ) {}

  async createPaymentRequest(paymentRequestDto: CreatePaymentRequestDto, user: User) {
    // Verificar que la transacción existe y pertenece al usuario
    const transaction = await this.txClientRepository.findOne({
      where: {
        id: paymentRequestDto.transactionId,
        user: { id: user.id },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada');
    }

    // Validar que la transacción tenga un hash
    if (!transaction.transactionHash) {
      throw new BadRequestException('La transacción no tiene un hash asociado');
    }

    // Validar que la transacción esté en estado VERIFIED
    if (transaction.status !== StatusTx.VERIFIED) {
      throw new BadRequestException('La transacción debe estar en estado VERIFIED para crear una solicitud de pago');
    }

    // Validar que no tenga ya un request payment asociado
    const existingPaymentRequest = await this.requestPaymentsRepository.findOne({
      where: { transactionId: paymentRequestDto.transactionId },
    });

    if (existingPaymentRequest) {
      throw new BadRequestException('Esta transacción ya tiene una solicitud de pago asociada');
    }

    // Crear el payment request
    const paymentRequest = this.requestPaymentsRepository.create({
      userId: user.id,
      transactionId: paymentRequestDto.transactionId,
      hash: transaction.transactionHash,
      amount: paymentRequestDto.totalDistributed,
      distributions: paymentRequestDto.distributions,
    });

    const savedPaymentRequest = await this.requestPaymentsRepository.save(paymentRequest);

    // Actualizar el estado de la transacción a IN_PROCESS_PAYMENT
    transaction.status = StatusTx.IN_PROCESS_PAYMENT;
    await this.txClientRepository.save(transaction);

    return {
      message: 'Solicitud de pago creada exitosamente',
      data: savedPaymentRequest,
    };
  }
}
