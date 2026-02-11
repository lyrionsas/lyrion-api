import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum ColombianBanks {
  BANCOLOMBIA = 'Bancolombia',
  BANCO_DE_BOGOTA = 'Banco de Bogotá',
  DAVIVIENDA = 'Davivienda',
  BBVA_COLOMBIA = 'BBVA Colombia',
  BANCO_DE_OCCIDENTE = 'Banco de Occidente',
  BANCO_POPULAR = 'Banco Popular',
  ITAU = 'Itaú',
  BANCO_CAJA_SOCIAL = 'Banco Caja Social',
  BANCO_AV_VILLAS = 'Banco AV Villas',
  BANCO_PICHINCHA = 'Banco Pichincha',
  BANCO_GNB_SUDAMERIS = 'Banco GNB Sudameris',
  BANCO_FALABELLA = 'Banco Falabella',
  BANCO_FINANDINA = 'Banco Finandina',
  BANCO_AGRARIO = 'Banco Agrario',
  BANCOOMEVA = 'Bancoomeva',
  BANCO_MUNDO_MUJER = 'Banco Mundo Mujer',
  BANCO_W = 'Banco W',
  BANCO_SERFINANZA = 'Banco Serfinanza',
  SCOTIABANK_COLPATRIA = 'Scotiabank Colpatria',
  NEQUI = 'Nequi',
  DAVIPLATA = 'Daviplata',
  LULO_BANK = 'Lulo Bank',
  NU_COLOMBIA = 'Nu Colombia',
}

export enum AccountType {
  AHORROS = 'Ahorros',
  CORRIENTE = 'Corriente',
}

export enum DocumentType {
  CEDULA_CIUDADANIA = 'Cédula de Ciudadanía',
  CEDULA_EXTRANJERIA = 'Cédula de Extranjería',
  NIT = 'NIT',
  PASAPORTE = 'Pasaporte',
  TARJETA_IDENTIDAD = 'Tarjeta de Identidad',
  REGISTRO_CIVIL = 'Registro Civil',
}

export class CreateBankAccountDto {
  @IsEnum(ColombianBanks, {
    message: 'El banco debe ser uno de los bancos colombianos válidos',
  })
  @IsNotEmpty({ message: 'El nombre del banco es requerido' })
  bankName: ColombianBanks;

  @IsEnum(AccountType, {
    message: 'El tipo de cuenta debe ser Ahorros o Corriente',
  })
  @IsNotEmpty({ message: 'El tipo de cuenta es requerido' })
  accountType: AccountType;

  @IsString()
  @IsNotEmpty({ message: 'El número de cuenta es requerido' })
  @MinLength(6, { message: 'El número de cuenta debe tener al menos 6 dígitos' })
  @MaxLength(20, { message: 'El número de cuenta no puede tener más de 20 dígitos' })
  @Matches(/^[0-9]+$/, {
    message: 'El número de cuenta solo debe contener dígitos numéricos',
  })
  accountNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del titular es requerido' })
  @MinLength(3, { message: 'El nombre del titular debe tener al menos 3 caracteres' })
  accountHolderName: string;

  @IsEnum(DocumentType, {
    message: 'El tipo de documento debe ser uno de los tipos válidos',
  })
  @IsNotEmpty({ message: 'El tipo de documento es requerido' })
  typeDocumentHolder: DocumentType;

  @IsString()
  @IsNotEmpty({ message: 'El documento del titular es requerido' })
  @MinLength(6, { message: 'El documento debe tener al menos 6 caracteres' })
  @MaxLength(15, { message: 'El documento no puede tener más de 15 caracteres' })
  @Matches(/^[0-9]+$/, {
    message: 'El documento solo debe contener dígitos numéricos',
  })
  accountHolderDocument: string;
}
