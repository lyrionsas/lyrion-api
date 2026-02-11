import { Test, TestingModule } from '@nestjs/testing';
import { BankAccountsService } from './bank-accounts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BankAccount } from './entities/bank-accounts.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ColombianBanks, AccountType, DocumentType } from './dto';
import { User } from 'src/auth/models';

describe('BankAccountsService', () => {
  let service: BankAccountsService;

  const mockUser: User = {
    id: 1,
    firstname: 'Juan',
    lastname: 'Pérez',
    email: 'juan@test.com',
    phone: '3001234567',
    isActive: true,
  } as User;

  const mockBankAccount: BankAccount = {
    id: 1,
    userId: mockUser,
    bankName: ColombianBanks.BANCOLOMBIA,
    accountType: AccountType.AHORROS,
    accountNumber: '1234567890',
    accountHolderName: 'Juan Pérez',
    typeDocumentHolder: DocumentType.CEDULA_CIUDADANIA,
    accountHolderDocument: '1234567890',
    isActive: true,
    createAt: new Date(),
    updateAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankAccountsService,
        {
          provide: getRepositoryToken(BankAccount),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BankAccountsService>(BankAccountsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      bankName: ColombianBanks.BANCOLOMBIA,
      accountType: AccountType.AHORROS,
      accountNumber: '1234567890',
      accountHolderName: 'Juan Pérez',
      typeDocumentHolder: DocumentType.CEDULA_CIUDADANIA,
      accountHolderDocument: '1234567890',
    };

    it('should create a new bank account', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockBankAccount);
      mockRepository.save.mockResolvedValue(mockBankAccount);

      const result = await service.create(createDto, mockUser);

      expect(result).toEqual(mockBankAccount);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        userId: mockUser,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockBankAccount);
    });

    it('should throw BadRequestException if account number already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockBankAccount);

      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid account number length', async () => {
      const invalidDto = {
        ...createDto,
        accountNumber: '123', // Muy corto
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.create(invalidDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all active bank accounts for a user', async () => {
      const accounts = [mockBankAccount];
      mockRepository.find.mockResolvedValue(accounts);

      const result = await service.findAll(mockUser.id);

      expect(result).toEqual(accounts);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: { id: mockUser.id }, isActive: true },
        order: { createAt: 'DESC' },
      });
    });

    it('should return empty array if no accounts found', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll(mockUser.id);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a bank account by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockBankAccount);

      const result = await service.findOne(1, mockUser.id);

      expect(result).toEqual(mockBankAccount);
    });

    it('should throw NotFoundException if account not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999, mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateDto = {
      accountHolderName: 'Juan Carlos Pérez',
    };

    it('should update a bank account', async () => {
      mockRepository.findOne.mockResolvedValue(mockBankAccount);
      mockRepository.save.mockResolvedValue({
        ...mockBankAccount,
        ...updateDto,
      });

      const result = await service.update(1, updateDto, mockUser.id);

      expect(result.accountHolderName).toEqual(updateDto.accountHolderName);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if account not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(999, updateDto, mockUser.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a bank account', async () => {
      mockRepository.findOne.mockResolvedValue(mockBankAccount);
      mockRepository.save.mockResolvedValue({
        ...mockBankAccount,
        isActive: false,
      });

      const result = await service.remove(1, mockUser.id);

      expect(result.message).toEqual('Cuenta bancaria eliminada exitosamente');
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: false }),
      );
    });

    it('should throw NotFoundException if account not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999, mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getStats', () => {
    it('should return statistics of bank accounts', async () => {
      const accounts = [
        mockBankAccount,
        {
          ...mockBankAccount,
          id: 2,
          bankName: ColombianBanks.NEQUI,
          accountType: AccountType.CORRIENTE,
        },
        {
          ...mockBankAccount,
          id: 3,
          bankName: ColombianBanks.BANCOLOMBIA,
        },
      ];

      mockRepository.find.mockResolvedValue(accounts);

      const result = await service.getStats(mockUser.id);

      expect(result.total).toBe(3);
      expect(result.byBank[ColombianBanks.BANCOLOMBIA]).toBe(2);
      expect(result.byBank[ColombianBanks.NEQUI]).toBe(1);
      expect(result.byType[AccountType.AHORROS]).toBe(2);
      expect(result.byType[AccountType.CORRIENTE]).toBe(1);
    });
  });
});
