import { has, hasIn, isEmpty } from 'lodash';

import { Context } from './Context';
import { Event, EventWithSession } from './Event';
import { RequestHandler, StateHandler, StateHandlers } from './Handler';
import { IntentRequest, LaunchRequest, Request, SessionEndedRequest } from './Request';
import { Response, ResponseObject, ResponseRedirect,
         ResponseRedirectToHandler, ResponseRedirectToIntent } from './Response';
import { Session } from './Session';

import { getState, hasState, setState, validateRequest } from './util';

const STATE_HANDLERS = new WeakMap<Skill, StateHandlers>();

export abstract class Skill {
  abstract defaultState: string;
  abstract handlers: StateHandler[];

  constructor(protected appID: string) {}

  public async run(event: Event): Promise<ResponseObject> {
    event = event as EventWithSession;

    if (!event.session) {
      event.session = {
        attributes: {},
      };
    }

    const { context, request, session, version } = event;

    validateRequest(event, this.appID);

    if (!session.attributes) {
      session.attributes = {};
    }

    if (!hasState(session)) {
      setState(session, this.defaultState);
    }

    if (session.new) {
      await this.onSessionStarted(request, session);
    }

    await this.onSession(request, session);

    const res = await this._handleRequest(request, session, null, null);
    return res.object;
  }

  protected _getStateHandler(state: string): StateHandler {
    if (!STATE_HANDLERS.has(this)) {
      const handlersByState: StateHandlers = {};
      for (const stateHandler of this.handlers) {
        handlersByState[stateHandler.state] = stateHandler;
      }
      STATE_HANDLERS.set(this, handlersByState);
    }
    return STATE_HANDLERS.get(this)[state];
  }

  protected async _getHandler(
      state: string, handlerName: string, req: Request, ses: Session): Promise<Function> {
    const stateHandler = this._getStateHandler(state);
    if (!stateHandler) {
      throw new Error(`missing state handlers for "${state}"`);
    }

    if (handlerName) {
      if (!hasIn(stateHandler, handlerName)) {
        throw new Error(`state handler (${stateHandler.state}) missing function name "${handlerName}"`);
      }
      return (stateHandler as any)[handlerName];
    } else {
      switch (req.type) {
      case 'LaunchRequest': {
        return stateHandler.onLaunch;
      }
      case 'IntentRequest': {
        const intent = req.intent;
        if (intent.name in stateHandler.handlers) {
          return stateHandler.handlers[intent.name];
        }
        return stateHandler.onUnhandled;
      }
      case 'SessionEndedRequest': {
        return this.onSessionEnded;
      }
      default:
        throw new Error(`unknown request type - ${req.type}`);
      }
    }
  }

  protected async _handleRequest(
      req: Request, ses: Session, redirect: ResponseRedirect, prevHandler: Function): Promise<Response> {
    let state = getState(ses);
    let handlerName: string;

    if (redirect) {
      if (has(redirect, 'handler')) {
        redirect = redirect as ResponseRedirectToHandler;
        handlerName = redirect.handler;
      } else {
        redirect = redirect as ResponseRedirectToIntent;
        req = Object.assign(req, {
          intent: redirect.intent,
          type: 'IntentRequest',
        });
      }
      if (!isEmpty(redirect.state)) {
        state = redirect.state;
        setState(ses, state);
      }
    }

    const handler = await this._getHandler(state, handlerName, req, ses);

    if (redirect && handler === prevHandler) {
      throw new Error(`cannot redirect to itself (state=${state}, fn=${handlerName})`);
    }

    const res = await handler(req, ses);

    if (res && res.redirect) {
      if (isEmpty(res.redirect.state)) {
        res.redirect.state = state;
      }
      return this._handleRequest(req, ses, res.redirect, handler);
    }

    return res;
  }

  protected async onSessionStarted(req: Request, ses: Session): Promise<void> {
    return null;
  }

  protected async onSession(req: Request, ses: Session): Promise<void> {
    return null;
  }

  protected async onSessionEnded(req: SessionEndedRequest, ses: Session): Promise<void> {
    return null;
  }
}
