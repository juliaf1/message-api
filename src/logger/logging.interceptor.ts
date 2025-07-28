import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DatadogLoggerService } from './datadog-logger.service';
import { Request, Response } from 'express';
import tracer from 'dd-trace';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: DatadogLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    // Add custom span tags
    const span = tracer.scope().active();
    if (span) {
      span.setTag('http.method', request.method);
      span.setTag('http.url', request.url);
      if (request.user?.userId) {
        span.setTag('user.id', request.user.userId);
      }
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - startTime;
          this.logger.logRequest(request, response, responseTime);

          // Add response data to span
          if (span) {
            span.setTag('http.status_code', response.statusCode);
            span.setTag('http.response_time', responseTime);
          }
        },
        error: (error: Error) => {
          const responseTime = Date.now() - startTime;
          this.logger.error(
            `Request failed: ${error.message}`,
            error.stack,
            'HTTP',
          );

          // Add error information to span
          if (span) {
            span.setTag('error', true);
            span.setTag('error.message', error.message);
            span.setTag('http.status_code', response.statusCode || 500);
            span.setTag('http.response_time', responseTime);
          }
        },
      }),
    );
  }
}
