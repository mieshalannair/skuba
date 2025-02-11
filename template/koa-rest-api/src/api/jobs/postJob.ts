import { contextLogger } from 'src/framework/logging';
import { metricsClient } from 'src/framework/metrics';
import { validateRequestBody } from 'src/framework/validation';
import * as storage from 'src/storage/jobs';
import { filterJobInput } from 'src/types/jobs';
import { Middleware } from 'src/types/koa';

export const postJobHandler: Middleware = async (ctx) => {
  const jobInput = validateRequestBody(ctx, filterJobInput);

  const job = await storage.createJob(jobInput);

  // no PII in these jobs
  contextLogger(ctx).debug({ job }, 'created job');

  metricsClient.increment('job.creations');

  ctx.body = job;
};
