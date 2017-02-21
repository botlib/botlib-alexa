export interface Context {
  System: {
    application: {
      applicationId: string;
    };
    user: {
      userId: string;
      accessToken?: string;
    };
    device: {
      supportedInterfaces: {
        AudioPlayer: any;
      };
    };
  };
  AudioPlayer: {
    token?: string;
    offsetInMilliseconds: number;
    playerActivity: string;
  };
}
