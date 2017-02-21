import { IntentRequest, LaunchRequest, Request } from './Request';
import { Response } from './Response';
import { Session } from './Session';

export type RequestHandler = (req: Request, session: Session) => Promise<Response>;

export type IntentRequestHandler = (req: IntentRequest, session: Session) => Promise<Response>;

export interface IntentRequestHandlers {
  [id: string]: IntentRequestHandler;
};

export abstract class StateHandler {
  abstract state: string;
  abstract handlers: IntentRequestHandlers;

  async onLaunch(req: LaunchRequest, ses: Session): Promise<Response> {
    return Response.redirect(ses, ':onUnhandled');
  }

  abstract onUnhandled(req: IntentRequest, ses: Session): Promise<Response>;
}

export interface StateHandlers {
  [id: string]: StateHandler;
};
