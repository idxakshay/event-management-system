import { HttpStatus, Injectable } from '@nestjs/common';
import { logger, SeedException } from '@snap/core';
import * as bcrypt from 'bcrypt';
import { ClsService } from 'nestjs-cls';
import { RequestContext } from '../../../libs/snap/src/request-context/request-context.dto';
import { MessageDTO } from '../../dto/message.dto';
import { getStartIndex, PaginationDto } from '../../dto/pager.dto';
import { BcryptConstants } from '../auth/auth.constants';
import { Role } from '../role/role.entity';
import { RoleService } from '../role/role.service';
import { CreateUserDTO, UserChangePasswordDTO, UserDTO, UserResponseDTO } from './user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly cls: ClsService,
  ) {}

  async createUser(createUserDto: CreateUserDTO): Promise<UserDTO> {
    const { email, name, roles, password } = createUserDto;

    if (await this.userRepository.findUserByEmail(email)) {
      throw new SeedException('email already in use', HttpStatus.CONFLICT);
    }

    const roleEntities: Role[] = await this.roleService.findByNames(roles);

    if (roleEntities.length !== roles.length) {
      throw new SeedException('Contains Invalid Role', HttpStatus.PRECONDITION_FAILED);
    }
    let user: User = new User();
    user.email = email;
    user.name = name;
    user.roles = Promise.resolve(roleEntities);
    user.password = await bcrypt.hash(password, BcryptConstants.saltRounds);

    user = await this.userRepository.addUser(user);
    const { id } = user;
    return { id, name, email } as UserDTO;
  }

  async getUser(): Promise<UserDTO[]> {
    const requestContext = this.cls.get<RequestContext>('requestContext');
    const { userId } = requestContext;
    const users: any[] = await this.userRepository.findUserDetailsWithRole(userId);
    const userDtos: UserDTO[] = [];

    if (users.length === 0) {
      throw new SeedException('No Record Found', HttpStatus.NOT_FOUND);
    }
    for (const user of users) {
      userDtos.push(user);
    }
    return userDtos;
  }

  list(paginationDto: PaginationDto): Promise<UserResponseDTO> {
    const startIndex = getStartIndex(paginationDto.page, paginationDto.limit);
    return this.userRepository.getAllUsers(paginationDto, startIndex);
  }

  findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findUserByEmail(email);
  }

  async changeUserPassword(userChangePwdDto: UserChangePasswordDTO): Promise<MessageDTO> {
    const { email, oldPassword, newPassword } = userChangePwdDto;
    const user: User = await this.findUserByEmail(email);
    if (!user) {
      throw new SeedException('No User Found', HttpStatus.NOT_FOUND);
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new SeedException('Incorrect password', HttpStatus.PRECONDITION_FAILED);
    }

    const updatedPassword = await bcrypt.hash(newPassword, BcryptConstants.saltRounds);
    await this.userRepository.changeUserPassword(email, updatedPassword);

    logger.info(`Password updated successfully for user: ${email}`);

    const res: MessageDTO = new MessageDTO('Password Changed Successfully');
    return res;
  }
}
