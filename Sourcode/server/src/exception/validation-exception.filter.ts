import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const responseBody = exception.getResponse();

    // Kiểm tra nếu responseBody là một đối tượng và có thuộc tính "message"
    if (
      typeof responseBody === 'object' &&
      responseBody.hasOwnProperty('message')
    ) {
      const validationErrors: ValidationError[] = responseBody['message'];

      // Tạo một danh sách thông điệp lỗi từ các validation error
      const messages = validationErrors.map((error) => {
        return {
          property: error.property,
          constraints: error.constraints,
        };
      });

      // Gửi phản hồi với thông điệp lỗi tùy chỉnh
      return response.status(status).json({
        statusCode: status,
        errors: messages,
      });
    }

    // Nếu không, trả về phản hồi mặc định
    return response.status(status).json(responseBody);
  }
}
