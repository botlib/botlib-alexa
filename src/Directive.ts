export interface DirectiveBase {
  type: string;
}

// Sends Alexa a command to stream the audio file identified by the specified audioItem.
export interface AudioPlayerPlayDirective {
  type: 'AudioPlayer.Play';
  playBehavior: 'REPLACE_ALL' | 'ENQUEUE' | 'REPLACE_ENQUEUED';
  audioItem: {
    stream: {
      url: string;
      token: string;
      expectedPreviousToken?: string;
      offsetInMilliseconds: number;
    };
  };
  shouldEndSession: boolean;
}

// Stops any currently playing audio stream.
export interface AudioPlayerStopDirective {
  type: 'AudioPlayer.Stop';
}

// Clears the queue of all audio streams.
export interface AudioPlayerClearQueueDirective {
  type: 'AudioPlayer.ClearQueue';
  clearBehavior: 'CLEAR_ENQUEUED' | 'CLEAR_ALL';
}

export type Directive =
  AudioPlayerPlayDirective |
  AudioPlayerStopDirective |
  AudioPlayerClearQueueDirective;
