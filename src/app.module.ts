import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatadogLoggerService } from './logger/datadog-logger.service';
import { LoggingInterceptor } from './logger/logging.interceptor';

@Module({
  imports: [MessagesModule, AuthModule, UsersModule],
  controllers: [AppController, AuthController, UsersController],
  providers: [
    AppService,
    AuthService,
    DatadogLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
