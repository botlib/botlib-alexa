import { Context } from './Context';
import { RequestWithoutSession, RequestWithSession } from './Request';
import { Response } from './Response';
import { Session } from './Session';

export interface EventBase {
  version: string;
  context: Context;
}

export interface EventWithSession extends EventBase {
  session: Session;
  request: RequestWithSession;
}

export interface EventWithoutSession extends EventBase {
  request: RequestWithoutSession;
}

export type Event = EventWithSession | EventWithoutSession;
