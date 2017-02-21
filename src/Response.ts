import { has, isEmpty, isFunction, isPlainObject, isString } from 'lodash';

import { Card, CardObject } from './Card';
import { Directive } from './Directive';
import { RequestHandler } from './Handler';
import { Intent } from './Intent';
import { OutputSpeech } from './OutputSpeech';
import { Session } from './Session';
import { setState } from './util';

export interface ResponseRedirectToHandler {
  handler: string;
  state: string;
}

export interface ResponseRedirectToIntent {
  intent: Intent;
  state: string;
}

export type ResponseRedirect = ResponseRedirectToHandler | ResponseRedirectToIntent;

export interface ResponseObjectResponse {
  outputSpeech?: OutputSpeech;
  card?: CardObject;
  reprompt?: {
    outputSpeech: OutputSpeech;
  };
  directives?: Directive[];
  shouldEndSession?: boolean;
};

export interface ResponseObject {
  version: string;
  response: ResponseObjectResponse;
  sessionAttributes: {
    [id: string]: {};
  };
}

export class Response {
  static ask(
      ses: Session,
      outputSpeech: string | OutputSpeech,
      repromptOutputSpeech: string | OutputSpeech,
      state?: string): Response {
    if (isString(outputSpeech)) {
      outputSpeech = {
        text: outputSpeech,
        type: 'PlainText',
      };
    }
    if (isString(repromptOutputSpeech)) {
      repromptOutputSpeech = {
        text: repromptOutputSpeech,
        type: 'PlainText',
      };
    }
    const res = new Response(ses);
    res.outputSpeech = outputSpeech;
    res.repromptOutputSpeech = repromptOutputSpeech;
    res.shouldEndSession = false;
    if (!isEmpty(state)) {
      res.state = state;
    }
    return res;
  }

  static askWithCard(
      ses: Session,
      outputSpeech: string | OutputSpeech,
      repromptOutputSpeech: string | OutputSpeech,
      card: Card,
      state?: string): Response {
    if (isString(outputSpeech)) {
      outputSpeech = {
        text: outputSpeech,
        type: 'PlainText',
      };
    }
    if (isString(repromptOutputSpeech)) {
      repromptOutputSpeech = {
        text: repromptOutputSpeech,
        type: 'PlainText',
      };
    }
    const res = new Response(ses);
    res.card = card;
    res.outputSpeech = outputSpeech;
    res.repromptOutputSpeech = repromptOutputSpeech;
    res.shouldEndSession = false;
    if (!isEmpty(state)) {
      res.state = state;
    }
    return res;
  }

  static tell(
      ses: Session,
      outputSpeech: string | OutputSpeech,
      state?: string): Response {
    if (isString(outputSpeech)) {
      outputSpeech = {
        text: outputSpeech,
        type: 'PlainText',
      };
    }
    const res = new Response(ses);
    res.outputSpeech = outputSpeech;
    res.shouldEndSession = true;
    if (!isEmpty(state)) {
      res.state = state;
    }
    return res;
  }

  static tellWithCard(
      ses: Session,
      outputSpeech: string | OutputSpeech,
      card: Card,
      state?: string): Response {
    if (isString(outputSpeech)) {
      outputSpeech = {
        text: outputSpeech,
        type: 'PlainText',
      };
    }
    const res = new Response(ses);
    res.card = card;
    res.outputSpeech = outputSpeech;
    res.shouldEndSession = true;
    if (!isEmpty(state)) {
      res.state = state;
    }
    return res;
  }

  static redirect(ses: Session, target: string | Intent, state?: string): Response {
    const res = new Response(ses);
    let redirect: ResponseRedirect;

    if (isString(target)) {
      if (target.startsWith(':')) {
        const handler = target.substring(1);
        redirect = {
          handler,
          state,
        };
      } else {
        redirect = {
          intent: {name: target, slots: {}},
          state,
        };
      }
    } else if (isPlainObject(target)) {
      redirect = {
        intent: target,
        state,
      };
    } else {
      throw new Error(`unknown redirect target - ${target}`);
    }

    res.redirect = redirect;
    return res;
  }

  card: Card;
  directives: Directive[];
  outputSpeech: OutputSpeech;
  repromptOutputSpeech: OutputSpeech;
  shouldEndSession: boolean;
  state: string;

  redirect: ResponseRedirect;

  constructor(public session: Session) {}

  get object(): ResponseObject {
    const result: any = {
      response: {},
      version: '1.0',
    };
    if (has(this, 'card')) {
      result.response.card = this.card.object;
    }
    if (has(this, 'directives')) {
      result.response.directives = this.directives;
    }
    if (has(this, 'outputSpeech')) {
      result.response.outputSpeech = this.outputSpeech;
    }
    if (has(this, 'repromptOutputSpeech')) {
      result.response.reprompt = {};
      result.response.reprompt.outputSpeech = this.repromptOutputSpeech;
    }
    if (has(this, 'shouldEndSession')) {
      result.response.shouldEndSession = this.shouldEndSession;
    }
    if (!isEmpty(this.state)) {
      setState(this.session, this.state);
    }
    result.sessionAttributes = this.session.attributes;
    return result;
  }
}
