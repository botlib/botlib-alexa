import { Context } from './Context';
import { Event } from './Event';

export type Handler = (event: Event, context: Context) => Promise<void>;
