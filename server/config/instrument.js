import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://c6bfceb3f6ea8aa256458bd1236f7987@o4508929334902784.ingest.us.sentry.io/4508929339228160",
  integrations: [
    nodeProfilingIntegration(),
    Sentry.mongoIntegration()
  ],
  // Add Tracing by setting tracesSampleRate
  // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
  // Set sampling rate for profiling
  // This is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});
