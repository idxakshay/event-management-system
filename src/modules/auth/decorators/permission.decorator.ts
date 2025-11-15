import { SetMetadata } from '@nestjs/common';

export type Resource = 'user' | 'role';

export interface IPermission {
  resource: Resource;
  action: string;
  scope?: string;
}

export const Permissions = (...permissions: IPermission[]): any => SetMetadata('permissions', permissions);
