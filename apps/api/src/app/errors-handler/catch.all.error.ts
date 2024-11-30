import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import {Response,Request} from 'express';
import * as process from 'node:process';
@Catch()
export class GlobalErrorHandlerFilter implements ExceptionFilter {

  private readonly logger = new Logger(GlobalErrorHandlerFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Fallback to 500 for non-HTTP exceptions
    const status = exception instanceof  HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Cast ArgumentsHost to ExecutionContext
    const executionContext = host as unknown as { getClass: () => any; getHandler: () => any };

    // Dynamically determine the source (controller and method)
    const controllerName = executionContext.getClass?.()?.name || 'unknownController';
    const handlerName = executionContext.getHandler?.()?.name || 'unknownHandler';


    // Define the custom error structure
    const errorResponse = {
      errorType : exception.constructor.name || "UnknownError",
      where :`${controllerName}.${handlerName}`,
      path: request.url,
      success: false,
      date: new Date().toISOString(),
      message: this.getErrorMessage(exception), // Hide detailed errors in production
      status: status,
    }


    // Log detailed error for debugging
    this.logger.error(errorResponse);

    // Send the custom response
    response.status(status).json(
      `Error in ${errorResponse.where}: ${exception.stack || exception.message}`
    );
  }

  // Return a generic message for production; more detailed in development
  private getErrorMessage(exception: any) {
    return process.env['NODE_ENV'] === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : exception.message || 'An unexpected error occurred.';
  }


}
