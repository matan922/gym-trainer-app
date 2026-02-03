declare namespace Express {
  export interface Request {
    clerkId?: string;  // From Clerk middleware
    user?: {           // MongoDB user (optional - set by your controllers)
      id: string;
      activeProfile: 'client' | 'trainer';
      email: string;
      firstName: string;
      lastName: string;
    };
  }
}
