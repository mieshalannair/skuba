import { log } from '../utils/logging';
import { isFunction, isObject } from '../utils/validation';

import {
  createRequestListenerFromFunction,
  serveRequestListener,
} from './http';

interface Args {
  availablePort?: number;
  entryPoint: unknown;
  functionName: string;
}

/**
 * Create an HTTP server that calls into an exported function.
 */
export const runFunctionHandler = async ({
  availablePort,
  entryPoint,
  functionName,
}: Args): Promise<void> => {
  if (!isObject(entryPoint)) {
    log.subtle(log.bold(functionName), 'is not exported');
    return;
  }

  const fn = entryPoint[functionName];

  if (!isFunction(fn)) {
    log.subtle(log.bold(functionName), 'is not a function');
    return;
  }

  const requestListener = createRequestListenerFromFunction(fn);

  return serveRequestListener(requestListener, availablePort);
};
