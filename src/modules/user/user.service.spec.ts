import { Test, TestingModule } from '@nestjs/testing';
import { SeedException } from '@snap/core';
import { when } from 'jest-when';
import { Role } from '../role/role.entity';
import { RoleService } from '../role/role.service';
import { CreateUserDTO } from './user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const email = 'akshay@gmail.com';
const name = 'Akshay';
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
const password = 'test-password-123';
const id = 1;
const roleUser = 'USER';
const role: Role = { id, name: roleUser } as Role;
const roles: Role[] = [role];

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let roleService: jest.Mocked<RoleService>;

  beforeEach(async () => {
    const mockUserRepository = { findUserByEmail: jest.fn(), addUser: jest.fn() };

    const mockRoleService = { findByNames: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: UserRepository, useValue: mockUserRepository }, { provide: RoleService, useValue: mockRoleService }],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
    roleService = module.get(RoleService);
  });

  it('can create instance of User Service', () => {
    expect(service).toBeDefined();
  });

  it('createUser - Happy flow', async () => {
    const createUserDto: CreateUserDTO = { name, password, email, roles: [roleUser] } as CreateUserDTO;

    const findUserByEmailSpy = jest.spyOn(userRepository, 'findUserByEmail');
    when(findUserByEmailSpy).expectCalledWith(email).mockReturnValue(undefined);

    const findByNamesSpy = jest.spyOn(roleService, 'findByNames');
    when(findByNamesSpy).expectCalledWith([roleUser]).mockResolvedValue(roles);

    const userTobeCreated: User = new User();
    userTobeCreated.email = email;
    userTobeCreated.password = expect.any(String);
    userTobeCreated.name = name;
    userTobeCreated.roles = Promise.resolve(roles);

    const saveSpy = jest.spyOn(userRepository, 'addUser');
    when(saveSpy)
      .expectCalledWith(userTobeCreated)
      .mockResolvedValue({ id, name, email } as User);

    const result = await service.createUser(createUserDto);
    expect(result.id).toBe(id);
    expect(result.email).toBe(email);
  });

  it('createUser - User already exists', async () => {
    const createUserDto: CreateUserDTO = { name, password, email, roles: [roleUser] } as CreateUserDTO;
    const findUserByEmailSpy = jest.spyOn(userRepository, 'findUserByEmail');
    when(findUserByEmailSpy)
      .expectCalledWith(email)
      .mockReturnValue(Promise.resolve({ email, password, name } as User));
    await expect(service.createUser(createUserDto)).rejects.toThrow(SeedException);
  });

  it('createUser - Contains invalid roles', async () => {
    const createUserDto: CreateUserDTO = { name, password, email, roles: [roleUser] } as CreateUserDTO;

    const findUserByEmailSpy = jest.spyOn(userRepository, 'findUserByEmail');
    when(findUserByEmailSpy).expectCalledWith(email).mockReturnValue(undefined);

    const findByNamesSpy = jest.spyOn(roleService, 'findByNames');
    when(findByNamesSpy).expectCalledWith([roleUser]).mockResolvedValue([]);
    await expect(service.createUser(createUserDto)).rejects.toThrow(SeedException);
  });
});
