declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface User {
    id: number;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    email: string | null;
  }
}
