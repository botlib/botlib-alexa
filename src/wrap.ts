import { debug } from './debug';
import * as env from './env';

import { Callback } from './Callback';
import { Context } from './Context';
import { Event } from './Event';
import { Handler } from './Handler';
import { ProxyEvent } from './ProxyEvent';
import { ProxyHandler } from './ProxyHandler';
import { ProxyRequest } from './ProxyRequest';
import { ProxyResponse } from './ProxyResponse';

export function wrap(handler: Handler) {
  return (event: Event, context: Context, callback: Callback) => {
    debug(event, 'Event');
    handler(event, context)
      .then((result) => {
        debug(result, 'Result');
        this.callback(null, result);
      })
      .catch((err) => {
        debug(err.stack.split('\n'), 'Error');
        this.callback(err);
      });
  };
}

export function wrapProxy(handler: ProxyHandler) {
  return (event: ProxyEvent, context: Context, callback: Callback) => {
    const res = new ProxyResponse(callback);
    let req: ProxyRequest;
    try {
      req = {
        body: <Event> JSON.parse(event.body),
        bodyRaw: event.body,
        headers: event.headers,
        method: event.httpMethod,
        query: event.queryStringParameters || {},
      };
    } catch (err) {
      res.jsonError(err);
    }
    debug(req, 'Request');
    handler(req, res)
      .then((result) => {
        debug(result, 'Response');
        res.json(result);
      })
      .catch((err) => {
        debug(err.stack.split('\n'), 'Error');
        res.jsonError(err);
      });
  };
}
