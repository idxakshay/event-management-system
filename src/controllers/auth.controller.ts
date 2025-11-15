import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenDTO, RefreshTokenDTO, TokenDTO, TokenDetailsDTO } from '../modules/auth/auth.dto';
import { AuthService } from '../modules/auth/auth.service';
import { CreateUserDTO, CredentialsDTO, UserDTO } from '../modules/user/user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: TokenDetailsDTO,
    description: 'TokenDetailsDTO with token details',
  })
  login(@Body() credentialsDTO: CredentialsDTO): Promise<TokenDTO> {
    return this.authService.login(credentialsDTO);
  }

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserDTO,
    description: 'UserDTO with user details',
  })
  signUp(@Body() createUserDTO: CreateUserDTO): Promise<UserDTO> {
    return this.authService.signUp(createUserDTO);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: AccessTokenDTO,
    description: 'AccessTokenDTO with token details',
  })
  refreshToken(@Body() refreshTokenDTO: RefreshTokenDTO): Promise<AccessTokenDTO> {
    const { refreshToken } = refreshTokenDTO;
    return this.authService.refreshToken(refreshToken);
  }
}
