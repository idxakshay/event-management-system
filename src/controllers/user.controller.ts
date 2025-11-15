import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { logger } from '@snap/core';
import { PaginationDto } from '../dto/pager.dto';
import { PermissionGuard, Permissions } from '../modules';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';
import { UserDTO, UserResponseDTO } from '../modules/user/user.dto';
import { UserService } from '../modules/user/user.service';

@Controller('users')
@ApiSecurity('BearerAuthorization')
@ApiTags('users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDTO,
    description: 'UserDTO with user details',
  })
  @Permissions({ resource: 'user', action: 'get' })
  get(): Promise<UserDTO[]> {
    logger.debug('inside getUser');
    return this.userService.getUser();
  }

  @Get('list')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDTO,
    description: 'UserResponseDTO with user & pagination details',
  })
  @Permissions({ resource: 'user', action: 'list' })
  list(@Query() paginationDto: PaginationDto): Promise<UserResponseDTO> {
    if (!paginationDto.limit) {
      paginationDto.limit = 10;
    }
    if (!paginationDto.page) {
      paginationDto.page = 1;
    }
    return this.userService.list(paginationDto);
  }
}
