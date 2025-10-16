import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../auth/models/rol.entity';
import { ROLES_CONSTANTS } from 'src/auth/constants/userConstants';

@Injectable()
export class RoleSeeder implements OnModuleInit {
  private readonly logger = new Logger(RoleSeeder.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    try {
      const count = await this.roleRepository.count();

      // Solo ejecuta el seed si la tabla está vacía
      if (count > 0) {
        this.logger.log('Roles ya existen en la base de datos');
        return;
      }

      const roles = [
        {
          name: ROLES_CONSTANTS.admin.name,
          description: ROLES_CONSTANTS.admin.description,
        },
        {
          name: ROLES_CONSTANTS.user.name,
          description: ROLES_CONSTANTS.user.description,
        },
        {
          name: ROLES_CONSTANTS.developer.name,
          description: ROLES_CONSTANTS.developer.description,
        }
      ];

      await this.roleRepository.save(roles);
      this.logger.log('✅ Roles por defecto creados exitosamente');
    } catch (error) {
      this.logger.error('❌ Error al crear roles por defecto:', error);
    }
  }
}
