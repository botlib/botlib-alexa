import { Intent } from './Intent';

export interface RequestBase {
  requestId: string;
  timestamp: Date;
  locale: string;
}

// Sent when the user invokes your skill without providing a specific intent.
export interface LaunchRequest extends RequestBase {
  type: 'LaunchRequest';
}

// Sent when the user makes a request that corresponds to one of the intents defined in your intent schema.
export interface IntentRequest extends RequestBase {
  type: 'IntentRequest';
  intent: Intent;
}

export interface SessionEndedRequestBase extends RequestBase {
  type: 'SessionEndedRequest';
}

export interface SessionEndedRequestWithError extends SessionEndedRequestBase {
  reason: 'ERROR';
  error: {
    type: string;
    message: string;
  };
}

export interface SessionEndedRequestWithoutError extends SessionEndedRequestBase {
  reason: 'USER_INITIATED' | 'EXCEEDED_MAX_REPROMPTS';
}

// Sent when the current skill session ends for any reason other than your code closing the session.
export type SessionEndedRequest = SessionEndedRequestWithError | SessionEndedRequestWithoutError;

export interface AudioPlayerPlaybackRequestBase extends RequestBase {
  token: string;
  offsetInMilliseconds: number;
}

// Sent when Alexa begins playing the audio stream previously sent in a Play directive.
// This lets your skill verify that playback began successfully.
export interface AudioPlayerPlaybackStartedRequest extends AudioPlayerPlaybackRequestBase {
  type: 'AudioPlayer.PlaybackStarted';
}

// Sent when the stream Alexa is playing comes to an end on its own.
export interface AudioPlayerPlaybackFinishedRequest extends AudioPlayerPlaybackRequestBase {
  type: 'AudioPlayer.PlaybackFinished';
}

// Sent when Alexa stops playing an audio stream in response to a voice request or an AudioPlayer directive.
export interface AudioPlayerPlaybackStoppedRequest extends AudioPlayerPlaybackRequestBase {
  type: 'AudioPlayer.PlaybackStopped';
}

// Sent when the currently playing stream is nearly complete and the device is ready to receive a new stream.
export interface AudioPlayerPlaybackNearlyFinishedRequest extends AudioPlayerPlaybackRequestBase {
  type: 'AudioPlayer.PlaybackNearlyFinished';
}

// Sent when Alexa encounters an error when attempting to play a stream.
export interface AudioPlayerPlaybackFailedRequest extends RequestBase {
  type: 'AudioPlayer.PlaybackFailed';
  token: string;
  error: {
    type: string;
    message: string;
  };
  currentPlaybackState: {
    token: string;
    offsetInMilliseconds: number;
    playerActivity: string;
  };
}

// Sent when the user uses a “next” button with the intent to skip to the next audio item.
export interface PlaybackControllerNextCommandIssuedRequest extends RequestBase {
  type: 'PlaybackController.NextCommandIssued';
}

// Sent when the user uses a “pause” button with the intent to stop playback.
export interface PlaybackControllerPauseCommandIssuedRequest extends RequestBase {
  type: 'PlaybackController.PauseCommandIssued';
}

// Sent when the user uses a “play” or “resume” button with the intent to start or resume playback.
export interface PlaybackControllerPlayCommandIssuedRequest extends RequestBase {
  type: 'PlaybackController.PlayCommandIssued';
}

// Sent when the user uses a “previous” button with the intent to go back to the previous audio item.
export interface PlaybackControllerPreviousCommandIssuedRequest extends RequestBase {
  type: 'PlaybackController.PreviousCommandIssued';
}

// Sent when an AudioPlayer request causes an error.
export interface SystemExceptionEncounteredRequest extends RequestBase {
  type: 'System.ExceptionEncountered';
  error: {
    type: string;
    message: string;
  };
  cause: {
    requestId: string;
  };
}

export type RequestWithSession =
  LaunchRequest |
  IntentRequest |
  SessionEndedRequest |
  AudioPlayerPlaybackStartedRequest |
  AudioPlayerPlaybackFinishedRequest |
  AudioPlayerPlaybackStoppedRequest |
  AudioPlayerPlaybackNearlyFinishedRequest |
  AudioPlayerPlaybackFailedRequest;

export type RequestWithoutSession =
  PlaybackControllerNextCommandIssuedRequest |
  PlaybackControllerPauseCommandIssuedRequest |
  PlaybackControllerPlayCommandIssuedRequest |
  PlaybackControllerPreviousCommandIssuedRequest |
  SystemExceptionEncounteredRequest;

export type Request = RequestWithoutSession | RequestWithSession;
