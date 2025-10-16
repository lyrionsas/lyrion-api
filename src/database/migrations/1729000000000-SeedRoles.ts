import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoles1729000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO role (role_name, description) VALUES
        ('admin', 'Administrador del sistema con acceso completo'),
        ('user', 'Usuario estándar con permisos básicos'),
        ('moderator', 'Moderador con permisos intermedios')
      ON CONFLICT DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM role WHERE role_name IN ('admin', 'user', 'moderator');
    `);
  }
}
