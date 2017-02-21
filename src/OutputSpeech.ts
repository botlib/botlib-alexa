export interface PlainTextOutputSpeech {
  type: 'PlainText';
  text: string;
}

export interface SSMLOutputSpeech {
  type: 'SSML';
  ssml: string;
}

export type OutputSpeech = PlainTextOutputSpeech | SSMLOutputSpeech;
