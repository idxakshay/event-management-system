import { Test, TestingModule } from '@nestjs/testing';
import { CreateRoleDTO, RoleDTO } from './role.dto';
import { Role } from './role.entity';
import { RoleService } from './role.service';

const createRoleDto: CreateRoleDTO = { name: 'test' };

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ providers: [RoleService] }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should create role and return the added role details', async () => {
    jest.spyOn(service, 'createRole').mockImplementation((dto: CreateRoleDTO): Promise<any> => {
      return Promise.resolve(dto);
    });
    const result = await service.create(createRoleDto);
    expect(result.name).toBe(createRoleDto.name);
  });

  it('should find all roles', async () => {
    const dto: RoleDTO[] = [];
    jest.spyOn(service, 'findAllRoles').mockImplementation(() => {
      return Promise.resolve(dto);
    });
    expect(await service.list()).toBe(dto);
  });

  it('should find role by name', async () => {
    const role = new Role();
    jest.spyOn(service, 'findByName').mockImplementation(() => {
      return Promise.resolve(role);
    });
    expect(await service.findByName('user')).toBe(role);
  });
});
