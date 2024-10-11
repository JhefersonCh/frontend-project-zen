export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginSuccessInterface {
  tokens: Tokens;
  user: User;
  session: Session;
}

export interface Session {
  accessSessionId: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  email: string;
  id: string;
  rol: Roles;
}

export interface Roles {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
