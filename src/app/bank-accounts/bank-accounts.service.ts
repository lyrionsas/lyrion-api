import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccount } from './entities/bank-accounts.entity';
import { CreateBankAccountDto, UpdateBankAccountDto } from './dto';
import { User } from 'src/auth/models';
import { StatusAccountBank } from 'src/enums/statusAccountBank.enum';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
  ) {}

  async create(
    createBankAccountDto: CreateBankAccountDto,
    user: User,
  ): Promise<BankAccount> {
    // Verificar si el usuario ya tiene una cuenta con el mismo número
    const existingAccount = await this.bankAccountRepository.findOne({
      where: {
        accountNumber: createBankAccountDto.accountNumber,
        userId: { id: user.id },
      },
    });

    if (existingAccount) {
      throw new BadRequestException(
        'Ya tienes una cuenta bancaria registrada con este número',
      );
    }

    // Validar que el número de cuenta tenga la longitud correcta según el banco
    this.validateAccountNumberLength(
      createBankAccountDto.bankName,
      createBankAccountDto.accountNumber,
    );

    const bankAccount = this.bankAccountRepository.create({
      ...createBankAccountDto,
      userId: user,
    });

    return await this.bankAccountRepository.save(bankAccount);
  }

  async findAll(userId: number): Promise<BankAccount[]> {
    return await this.bankAccountRepository.find({
      where: { userId: { id: userId }, isActive: true },
      order: { createAt: 'DESC' },
    });
  }

  async findAllByUser(userId: number): Promise<BankAccount[]> {
    return await this.bankAccountRepository.find({
      where: { userId: { id: userId } },
      order: { createAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<BankAccount> {
    const bankAccount = await this.bankAccountRepository.findOne({
      where: { id, userId: { id: userId }, isActive: true },
    });

    if (!bankAccount) {
      throw new NotFoundException(
        `Cuenta bancaria con ID ${id} no encontrada`,
      );
    }

    return bankAccount;
  }

  async update(
    id: number,
    updateBankAccountDto: UpdateBankAccountDto,
    userId: number,
  ): Promise<BankAccount> {
    const bankAccount = await this.findOne(id, userId);

    // Si se está actualizando el número de cuenta, verificar que no esté duplicado
    if (
      updateBankAccountDto.accountNumber &&
      updateBankAccountDto.accountNumber !== bankAccount.accountNumber
    ) {
      const existingAccount = await this.bankAccountRepository.findOne({
        where: {
          accountNumber: updateBankAccountDto.accountNumber,
          userId: { id: userId },
        },
      });

      if (existingAccount) {
        throw new BadRequestException(
          'Ya tienes una cuenta bancaria registrada con este número',
        );
      }

      // Validar longitud del nuevo número de cuenta
      const bankName = updateBankAccountDto.bankName || bankAccount.bankName;
      this.validateAccountNumberLength(
        bankName,
        updateBankAccountDto.accountNumber,
      );
    }

    Object.assign(bankAccount, updateBankAccountDto);
    return await this.bankAccountRepository.save(bankAccount);
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const bankAccount = await this.findOne(id, userId);

    // Soft delete - solo marcar como inactivo
    bankAccount.isActive = false;
    await this.bankAccountRepository.save(bankAccount);

    return { message: 'Cuenta bancaria eliminada exitosamente' };
  }

  /**
   * Valida que el número de cuenta tenga la longitud correcta según el banco
   */
  private validateAccountNumberLength(
    bankName: string,
    accountNumber: string,
  ): void {
    const accountLength = accountNumber.length;

    // Validaciones específicas según el banco (longitudes comunes en Colombia)
    const validationRules: { [key: string]: number[] } = {
      Bancolombia: [10, 11],
      'Banco de Bogotá': [9, 10, 11],
      Davivienda: [10, 11],
      'BBVA Colombia': [10],
      'Banco de Occidente': [10, 11],
      'Banco Popular': [9, 10],
      Itaú: [8, 9, 10],
      'Banco Caja Social': [10, 11],
      'Banco AV Villas': [10, 11],
      'Banco Pichincha': [10],
      'Banco GNB Sudameris': [10, 11],
      'Banco Falabella': [10, 16],
      'Banco Finandina': [10],
      'Banco Agrario': [11],
      Bancoomeva: [10, 11],
      'Banco Mundo Mujer': [10],
      'Banco W': [10],
      'Banco Serfinanza': [10],
      'Scotiabank Colpatria': [10, 11],
      Nequi: [10],
      Daviplata: [10],
      'Lulo Bank': [10],
      'Nu Colombia': [10, 16],
    };

    const allowedLengths = validationRules[bankName];

    if (allowedLengths && !allowedLengths.includes(accountLength)) {
      throw new BadRequestException(
        `El número de cuenta para ${bankName} debe tener ${allowedLengths.join(' o ')} dígitos`,
      );
    }
  }

  /**
   * Obtener estadísticas de cuentas bancarias del usuario
   */
  async getStats(userId: number): Promise<{
    total: number;
    byBank: { [key: string]: number };
    byType: { [key: string]: number };
  }> {
    const accounts = await this.findAll(userId);

    const stats = {
      total: accounts.length,
      byBank: {} as { [key: string]: number },
      byType: {} as { [key: string]: number },
    };

    accounts.forEach((account) => {
      // Contar por banco
      stats.byBank[account.bankName] =
        (stats.byBank[account.bankName] || 0) + 1;

      // Contar por tipo
      stats.byType[account.accountType] =
        (stats.byType[account.accountType] || 0) + 1;
    });

    return stats;
  }

  async haveActiveAccounts(userId: number): Promise<boolean> {
    const count = await this.bankAccountRepository.count({
      where: { userId: { id: userId }, status: StatusAccountBank.VERIFIED },
    });
    return count > 0;
  }
}
