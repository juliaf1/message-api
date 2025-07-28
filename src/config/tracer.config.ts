// tracer.ts
import tracer from 'dd-trace';

tracer.init({
  service: 'message-api', // Replace with your service name
  env: process.env.NODE_ENV || 'development',
  version: process.env.APP_VERSION || '1.0.0',
  logInjection: true, // This injects trace IDs into logs
  runtimeMetrics: true, // Enable runtime metrics
  profiling: true, // Enable profiling (optional)
});

export default tracer;
