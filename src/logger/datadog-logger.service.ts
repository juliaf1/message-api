import { Injectable, Logger } from '@nestjs/common';
import tracer from 'dd-trace';
import { Request, Response } from 'express';

@Injectable()
export class DatadogLoggerService extends Logger {
  private getTraceInfo() {
    const span = tracer.scope().active();
    if (span) {
      const traceContext = span.context();
      return {
        dd: {
          trace_id: traceContext.toTraceId(),
          span_id: traceContext.toSpanId(),
        },
      };
    }
    return {};
  }

  log(message: string, context?: string) {
    const traceInfo = this.getTraceInfo();
    super.log(`${JSON.stringify({ message, ...traceInfo })}`, context);
  }

  error(message: string, trace?: string, context?: string) {
    const traceInfo = this.getTraceInfo();
    super.error(`${JSON.stringify({ message, trace, ...traceInfo })}`, context);
  }

  warn(message: string, context?: string) {
    const traceInfo = this.getTraceInfo();
    super.warn(`${JSON.stringify({ message, ...traceInfo })}`, context);
  }

  debug(message: string, context?: string) {
    const traceInfo = this.getTraceInfo();
    super.debug(`${JSON.stringify({ message, ...traceInfo })}`, context);
  }

  verbose(message: string, context?: string) {
    const traceInfo = this.getTraceInfo();
    super.verbose(`${JSON.stringify({ message, ...traceInfo })}`, context);
  }

  // Custom methods for structured logging
  logWithMetadata(
    level: 'log' | 'error' | 'warn' | 'debug' | 'verbose',
    message: string,
    metadata: Record<string, any>,
    context?: string,
  ) {
    const traceInfo = this.getTraceInfo();
    const logData = { message, ...metadata, ...traceInfo };

    switch (level) {
      case 'error':
        super.error(JSON.stringify(logData), context);
        break;
      case 'warn':
        super.warn(JSON.stringify(logData), context);
        break;
      case 'debug':
        super.debug(JSON.stringify(logData), context);
        break;
      case 'verbose':
        super.verbose(JSON.stringify(logData), context);
        break;
      default:
        super.log(JSON.stringify(logData), context);
    }
  }

  logRequest(req: Request, res: Response, responseTime: number) {
    const traceInfo = this.getTraceInfo();
    const logData = {
      message: 'HTTP Request',
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      ...traceInfo,
    };

    super.log(JSON.stringify(logData), 'HTTP');
  }
}
