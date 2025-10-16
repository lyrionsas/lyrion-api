import { join } from 'path';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { envs } from 'src/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailsService } from './mails.service';
import { Role, User } from './models';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({
      secret: envs.JWT_SECRET,
      signOptions: { expiresIn: envs.JWT_EXPIRATION_TIME as any },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: envs.EMAIL_HOST,
          port: Number(envs.EMAIL_PORT),
          secure: false,
          auth: {
            user: envs.EMAIL_USER,
            pass: envs.EMAIL_PASSWORD,
          },
        },
        defaults: {
          from: `"ASOGANAN inversiones" <${envs.EMAIL_USER}>`,
        },
        template: {
          dir: join(__dirname, './templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, MailsService, JwtStrategy],
  exports: [],
})
export class AuthModule {}
