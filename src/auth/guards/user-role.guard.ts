import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../models';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  logger = new Logger('UserRoleGuard');

  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get( META_ROLES , context.getHandler() )

    if ( !validRoles ) return true;
    if ( validRoles.length === 0 ) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if ( !user )
      throw new UnauthorizedException('User not found');

    if ( validRoles.includes( user.rol?.name ?? '' ) ) {
      return true;
    }

    this.logger.warn(`User ${ user.firstname } need a valid role: [${ validRoles.join(', ') }]`);
    throw new ForbiddenException(
      `User ${ user.firstname } need a valid role: [${ validRoles.join(', ') }]`
    );
  }
}
