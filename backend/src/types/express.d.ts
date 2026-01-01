declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      activeProfile: 'client' | 'trainer';
      iat?: number;
      exp?: number;
    };
  }
}
