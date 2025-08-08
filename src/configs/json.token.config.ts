interface TokenConfig {
  access: {
    secret: string;
    expiration: string;
  };
  refresh: {
    secret: string;
    expiration: string;
  };
}

export const tokenConfig: TokenConfig = {
  access: {
    secret: process.env.ACCESS_TOKEN_SECRET || 'defaultAccessSecret',
    expiration: '15m',
  },
  refresh: {
    secret: process.env.REFRESH_TOKEN_SECRET || 'defaultRefreshSecret',
    expiration: '7d',
  },
};
