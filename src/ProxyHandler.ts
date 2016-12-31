import { ProxyRequest } from './ProxyRequest';
import { ProxyResponse } from './ProxyResponse';

export type ProxyHandler = (req: ProxyRequest, res: ProxyResponse) => Promise<void>;
