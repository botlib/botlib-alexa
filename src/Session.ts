export interface Session {
  new?: boolean;
  sessionId?: string;
  application?: {
    applicationId: string;
  };
  attributes: any;
  user?: {
    userId: string;
    accessToken?: string;
  };
}
