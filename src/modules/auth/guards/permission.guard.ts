import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IPermission } from '../decorators';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const skipAuth = this.reflector.get<boolean>('skipAuth', context.getHandler());
    if (skipAuth) {
      return true;
    }

    const permissions = this.reflector.get<IPermission[]>('permissions', context.getHandler());

    if (!permissions) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    return this.roleHasPermission(user.roles, permissions);
  }

  roleHasPermission(UserRoles: string[], permissions: IPermission[]): boolean {
    return permissions.some((permission) => {
      const { resource, action } = permission;
      return UserRoles.some((role) => {
        const rolePermissions = this.config.get('roleBasedAccess', []).find((r) => r.role === role);
        if (!rolePermissions) {
          return false;
        }
        return rolePermissions.permissions.some((p) => p.resource === resource && (p.action === action || p.action === '*'));
      });
    });
  }
}
