declare namespace Express {
  export interface Request {
    clerkId?: string;  // From Clerk middleware
    user?: {
      activeProfile: 'client' | 'trainer';
      mongoUserId: string;
    };
  }
}
