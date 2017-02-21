import { has } from 'lodash';

import { STATE_KEY } from './constants';
import { EventWithSession } from './Event';
import { Session } from './Session';

export function getState(ses: Session): string {
  return ses.attributes[STATE_KEY];
}

export function hasState(ses: Session): boolean {
  return has(ses.attributes, STATE_KEY);
}

export function setState(ses: Session, state: string): void {
  ses.attributes[STATE_KEY] = state;
}

export function validateRequest(event: EventWithSession, handlerAppID: string) {
  let reqAppID: string;
  let userID: string;

  if (event.context) {
    reqAppID = event.context.System.application.applicationId;
    userID = event.context.System.user.userId;
  } else if (event.session) {
    reqAppID = event.session.application.applicationId;
    userID = event.session.user.userId;
  } else {
    throw new Error('missing application ID');
  }

  if (handlerAppID && reqAppID && handlerAppID !== reqAppID) {
    throw new Error(`invalid application ID: ${reqAppID}`);
  }
}
