import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BSONError } from 'bson'; // Import BSONError to handle ObjectId errors specifically
import { ValidationError } from 'class-validator'; // Import ValidationError from mongoose

@Catch(HttpException, BSONError, ValidationError) // Catch HttpException, BSONError, and ValidationError
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500 for unhandled errors
    let responseBody: any;

    // Handle BSONError
    if (exception instanceof BSONError) {
      status = HttpStatus.BAD_REQUEST; // Typically, BSON errors are 400 Bad Request
      responseBody = {
        message: 'Id không hợp lệ', // Custom message for BSON errors
        statusCode: status,
      };
    }
    // Handle ValidationError (Mongoose validation error)
    else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST; // Typically 400 Bad Request for validation errors
      responseBody = {
        message: 'Validation failed', // Generic validation message
        errors: exception.message, // Attach the validation errors
        statusCode: status,
      };
    } else if (exception instanceof HttpException) {
      // Handle generic HTTP exceptions
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      responseBody =
        typeof errorResponse === 'string'
          ? { message: errorResponse }
          : errorResponse;

      // If the error is 401 Unauthorized, change the message
      if (status === HttpStatus.UNAUTHORIZED) {
        responseBody.message = 'Người dùng chưa đăng nhập'; // Custom message for unauthorized
      }
    }

    // Send the response back to the client
    response.status(status).json({
      ...responseBody,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
