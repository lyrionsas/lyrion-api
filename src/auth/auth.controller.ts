import { Body, Controller, Get, Headers, Logger, Post } from '@nestjs/common';
// import { Response } from 'express';
// import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { CreateUserDto,
  // ForgotPasswordDto,
  LoginUserDto,
  // ResetPasswordDto
} from './dtos';
// import { Auth, GetUser } from './decorators';
// import { User } from './models';

@Controller('auth')
export class AuthController {
  logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.registerUser(createUserDto);
  }

  // NO SE USA por que no esta funcional el correo de activacion
  // @Get('active-account')
  // async activeAccount(
  //   @Query('token') token: string,
  //   @Res() res: Response,
  // ) {
  //   return this.authService.activeAccount(token, res);
  // }

  @Post('login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto
  ) {
    this.logger.log(`loginUserDto: ${JSON.stringify(loginUserDto)}`);
    return await this.authService.loginUser(loginUserDto);
  }

  // @Post('refresh-token')
  // @Auth()
  // async refreshToken(
  //   @Headers() headers: IncomingHttpHeaders
  // ) {
  //   return await this.authService.refreshToken(headers);
  // }

  // @Post('forgot-password')
  // forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
  //   return this.authService.forgotPassword(forgotPasswordDto);
  // }

  // @Post('reset-password')
  // @Auth()
  // resetPassword(
  //   @Body() resetPasswordDto: ResetPasswordDto,
  //   @Headers() headers: IncomingHttpHeaders,
  // ) {
  //   return this.authService.resetPassword(resetPasswordDto, headers);
  // }

  // @Get('logout')
  // @Auth()
  // logout(
  //   @GetUser() user: User
  // ) {
  //   return this.authService.logout(user);
  // }

  @Post('validate-token')
  async validateToken(@Headers('authorization') authorization: string) {
    if (!authorization) {
      return {
        valid: false,
        message: 'Authorization header is required',
      };
    }

    // Extrae el token del header "Bearer <token>"
    const token = authorization.replace('Bearer ', '');

    return await this.authService.validateAccessToken(token);
  }

  @Get('public')
  public() {
    return 'Hello public';
  }
}
