import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
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

    // Nếu lỗi 401 Unauthorized, thay thế thông báo lỗi
    if (status === HttpStatus.UNAUTHORIZED) {
      response.status(status).json({
        message: 'Người dùng chưa đăng nhập', // Thông báo tùy chỉnh
        statusCode: status,
      });
    } else {
      // Nếu không phải 401, giữ nguyên thông báo lỗi gốc
      const errorResponse =
        typeof responseBody === 'string'
          ? { message: responseBody }
          : responseBody;

      response.status(status).json({
        ...errorResponse,
        statusCode: status,
      });
    }
  }
}
