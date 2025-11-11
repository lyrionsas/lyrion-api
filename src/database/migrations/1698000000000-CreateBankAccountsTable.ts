import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateBankAccountsTable1698000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla bank_accounts
    await queryRunner.createTable(
      new Table({
        name: 'bank_accounts',
        columns: [
          {
            name: 'id_bank_account',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'bank_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'account_type',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'account_number',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'account_holder_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'type_document_holder',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'account_holder_document',
            type: 'varchar',
            length: '15',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'create_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'update_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Crear foreign key hacia la tabla user
    await queryRunner.createForeignKey(
      'bank_accounts',
      new TableForeignKey({
        name: 'FK_bank_accounts_user',
        columnNames: ['user_id'],
        referencedColumnNames: ['id_user'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Crear índice en user_id para mejorar consultas
    await queryRunner.createIndex(
      'bank_accounts',
      new TableIndex({
        name: 'IDX_bank_accounts_user_id',
        columnNames: ['user_id'],
      }),
    );

    // Crear índice en account_number para validaciones de duplicados
    await queryRunner.createIndex(
      'bank_accounts',
      new TableIndex({
        name: 'IDX_bank_accounts_account_number',
        columnNames: ['account_number'],
      }),
    );

    // Crear índice compuesto para búsquedas por usuario y estado
    await queryRunner.createIndex(
      'bank_accounts',
      new TableIndex({
        name: 'IDX_bank_accounts_user_active',
        columnNames: ['user_id', 'is_active'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices
    await queryRunner.dropIndex('bank_accounts', 'IDX_bank_accounts_user_active');
    await queryRunner.dropIndex('bank_accounts', 'IDX_bank_accounts_account_number');
    await queryRunner.dropIndex('bank_accounts', 'IDX_bank_accounts_user_id');

    // Eliminar foreign key
    await queryRunner.dropForeignKey('bank_accounts', 'FK_bank_accounts_user');

    // Eliminar tabla
    await queryRunner.dropTable('bank_accounts');
  }
}
