import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class AccessTokenDTO {
  @ApiResponseProperty()
  accessToken: string;
}

export class RefreshTokenDTO {
  @ApiProperty()
  refreshToken: string;
}

export class TokenDetailsDTO {
  @ApiResponseProperty()
  token: string;

  @ApiResponseProperty()
  grantType: string;

  @ApiResponseProperty()
  expiresIn: string;
}

export class TokenDTO {
  accessToken: TokenDetailsDTO;

  refreshToken: TokenDetailsDTO;
}
