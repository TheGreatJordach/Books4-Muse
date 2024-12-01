import { Logger } from '@nestjs/common';

/**
 * A decorator factory that provides error handling and logging functionality for class methods.
 *
 * This decorator wraps the original method in a try-catch block and provides two different
 * return patterns based on the preserveOriginalReturn parameter:
 * 1. [error, result] tuple pattern (default)
 * 2. Original return value with error propagation
 *
 * The decorator also includes comprehensive error logging using NestJS Logger, capturing:
 * - Class and method names
 * - Error messages
 * - Method arguments
 * - Timestamp of the error
 *
 * @param preserveOriginalReturn - When true, preserves the original return type and throws errors.
 *                                When false (default), returns a tuple of [error, result].
 *
 * @example
 * // Returns [error, result]
 * @HandleErrors()
 * async compareWithTuple(data: string, encrypted: string): Promise<[any, boolean]> {
 *   return await bcrypt.compare(data, encrypted);
 * }
 *
 * @example
 * // Preserves original boolean return type
 * @HandleErrors(true)
 * async compareWithBoolean(data: string, encrypted: string): Promise<boolean> {
 *   return await bcrypt.compare(data, encrypted);
 * }
 *
 * @returns A decorator function that wraps the original method with error handling.
 *
 * @throws If preserveOriginalReturn is true, the original error will be re-thrown.
 *         Otherwise, errors are returned as [error, null].
 */
export function HandleErrors(
  preserveOriginalReturn = false,
): MethodDecorator {
  const logger = new Logger(HandleErrors.name);
  return (
    target : object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>) => {

    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      try {
        if(!Array.isArray(args)) {
          throw new Error("Arguments passed to the method are not in array format");
        }

        const result = await originalMethod.apply(this,args);

        if(preserveOriginalReturn) {
          // Return the original result directly
          return result;
        }
        // Return as [null, result] if not preserving original return
        return [null, result];
      } catch (error: unknown) {
        const clasName = target.constructor.name;
        const methodeName = propertyKey as string;
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        logger.error(
          `Error in ${clasName}.${methodeName}: ${JSON.stringify(errorMessage)}`,
        );

        const enhanceError = {
          methode: methodeName,
          arguments: args.map(arg => (typeof arg === 'string' ? arg.slice(0, 50) : arg)),
          error: errorMessage,
          timeStamp: new Date().toISOString(),
        }

        logger.error(
          `Enhanced Error Details: ${JSON.stringify(enhanceError)}`,
        );

        if(preserveOriginalReturn) {
          throw error
        }
        return [error, null]
      }
    };
    return descriptor;
  }

}
