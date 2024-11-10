import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BSONError } from 'bson'; // Import BSONError to handle BSON-specific errors
import { ValidationError } from 'class-validator'; // Import ValidationError for class-validator errors
import mongoose from 'mongoose'; // Import mongoose to handle CastError

@Catch(HttpException, BSONError, ValidationError, mongoose.Error.CastError) // Catch additional errors including CastError
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
    // Handle CastError from Mongoose
    else if (exception instanceof mongoose.Error.CastError) {
      status = HttpStatus.BAD_REQUEST; // Typically 400 Bad Request for CastError
      responseBody = {
        message: 'Id không hợp lệ. Vui lòng kiểm tra lại Id.', // Custom message for CastError
        statusCode: status,
      };
    }
    // Handle ValidationError (class-validator errors)
    else if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      responseBody = {
        message: 'Validation failed', // Generic validation message
        errors: exception.message, // Attach the validation errors
        statusCode: status,
      };
    }
    // Handle generic HTTP exceptions
    else if (exception instanceof HttpException) {
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
