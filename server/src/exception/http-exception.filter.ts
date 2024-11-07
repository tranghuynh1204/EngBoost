import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status = exception.getStatus();
    const responseBody = exception.getResponse();

    // Nếu responseBody là một chuỗi, thì tạo cấu trúc JSON
    const errorResponse =
      typeof responseBody === 'string'
        ? { message: responseBody }
        : responseBody;

    response.status(status).json({
      ...errorResponse,
    });
  }
}
