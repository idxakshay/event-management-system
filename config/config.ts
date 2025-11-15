export const config = (): any => ({
  port: process.env.PORT,
  contextPath: 'api/v1',
  enableMetaData: true,
  database: {
    type: 'sqlite',
    database: process.env.DB_PATH || './data/database.sqlite',
    synchronize: false,
    logging: true,
    entities: ['./modules/**/*.entity.ts'],
    autoLoadEntities: true,
    keepConnectionAlive: true,
  },
  jwt: {
    secret: 'hard!to-guess_secret',
    accessTokenOptions: { expiresIn: 3600 },
    refreshTokenOptions: { expiresIn: 1210000, path: '/auth/refresh' },
    grantTypes: { accessGrant: 'access', refreshGrant: 'refresh' },
  },
  bcrypt: {
    saltRounds: 10,
  },
  swagger: {
    isEnabled: true,
    uiPath: '/swagger-ui',
    authUsers: {
      root: 'toor',
      admin: 'admin@123',
    },
  },
  morgan: {
    format: ':method, :url, :status, :response-time, :total-time,:http-version, :remote-addr, :user-agent',
  },
  roleBasedAccess: [
    {
      role: 'ADMIN',
      permissions: [{ resource: 'user', action: '*' }],
    },
    {
      role: 'USER',
      permissions: [
        { resource: 'user', action: 'get' },
        { resource: 'user', action: 'create' },
      ],
    },
  ],
});
