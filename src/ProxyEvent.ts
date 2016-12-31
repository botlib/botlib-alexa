import { Event } from './Event';

export interface ProxyEvent {
  body: string;
  headers: any;
  httpMethod: string;
  queryStringParameters: any;
}
