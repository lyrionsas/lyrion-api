import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from 'src/config';
import { Role } from 'src/auth/models/rol.entity';
import { RoleSeeder } from './seeders/role.seeder';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: envs.POSTGRES_HOST,
        port: +envs.POSTGRES_PORT,
        username: envs.POSTGRES_USER,
        password: envs.POSTGRES_PASSWORD,
        database: envs.POSTGRES_DB,
        autoLoadEntities: true,
        poolSize: 10,
        extra: {
          keepAlive: true, // Mantiene la conexión activa
          idleTimeoutMillis: 30000, // Cierra conexiones inactivas después de 30s
          connectionTimeoutMillis: 5000, // Espera 5s antes de descartar la conexión
        },
        ssl: envs.APP_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
        // synchronize: envs.APP_ENV === 'development' ? true : false,
        synchronize: true, // Auto-crear tablas desde las entidades
      }),
    }),
    TypeOrmModule.forFeature([Role]),
  ],
  providers: [RoleSeeder],
})
export class DatabaseModule {}
