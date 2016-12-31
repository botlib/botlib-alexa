import { Event } from './Event';

export interface ProxyRequest {
  body: number;
  bodyRaw: string;
  headers: any;
  method: string;
  query: any;
}
