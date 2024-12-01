import { Injectable } from '@nestjs/common';
import { BcryptImplProvider } from './hash/bcrypt.impl.provider';
import { isValidPassword } from './password.util';
import { HandleErrors } from '@books4-muse/utils';


@Injectable()
export abstract class AbstractPasswordService {

  protected constructor(private readonly bcryptProvider: BcryptImplProvider) {}

  /**
   * Hashes a given password securely using a bcrypt provider.
   *
   * This method validates the input password and generates a secure hash.
   * It is decorated with the `@HandleErrors` decorator to enhance error handling:
   *
   * @HandleErrors Behavior:
   * - By default:
   *   - On success: Returns `[null, hashedPassword]`.
   *   - On error: Returns `[Error, null]` without throwing the error, allowing for graceful handling.
   * - When `@HandleErrors(true)` is applied:
   *   - On success: Returns the hashed password as a string (preserves the original method's return value).
   *   - On error: Throws the exception, requiring manual error handling.
   *
   *
   * @returns
   * - When `@HandleErrors()` is used: A tuple `[error, hashedPassword]`.
   * - When `@HandleErrors(true)` is used: The hashed password as a string.
   *
   * @throws
   * - An error if the password validation fails.
   * - An error if hashing fails (only when `@HandleErrors(true)` is applied).
   *
   * @example
   * // Using the default tuple return:
   * const [error, hashedPassword] = await passwordService.hashPassword('securePassword');
   * if (error) {
   *   console.error('Error hashing password:', error.message);
   * } else {
   *   console.log('Hashed Password:', hashedPassword);
   * }
   *
   * @example
   * // Using the decorator with `preserveOriginalReturn` set to true:
   * @HandleErrors(true)
   * async hashPassword(password: string | Buffer): Promise<string> {
   *   await isValidPassword(password);
   *   return this.bcryptProvider.hash(password as string);
   * }
   *
   * try {
   *   const hashedPassword = await passwordService.hashPassword('securePassword');
   *   console.log('Hashed Password:', hashedPassword);
   * } catch (error) {
   *   console.error('Error hashing password:', error.message);
   * }
   * @param providedPassword
   */
  @HandleErrors()
  async hashPassword(providedPassword: string | Buffer)  {
    //TODO Validate the input password
    await isValidPassword(providedPassword);

    // Hash the password using the bcrypt provider
    return  await this.bcryptProvider.hash(providedPassword);

  }


  /**
   * Compares a provided password with a hashed password for equality.
   *
   * This method validates the provided password before performing the comparison.
   * It is decorated with `@HandleErrors(true)` to handle errors effectively:
   *
   * ### @HandleErrors(true) Behavior:
   * - On success: Returns a boolean indicating whether the passwords match.
   * - On error: Throws an exception, requiring manual error handling.
   *
   * @param providedPassword - The plain-text password to verify. Must be a valid string or Buffer.
   * @param hashedPassword - The hashed password to compare against.
   *
   * @returns
   * - A boolean value: `true` if the passwords match, `false` otherwise.
   *
   * @throws
   * - An error if the provided password is invalid or the comparison fails.
   *
   * ### Example
   * ```typescript
   * const isValidPassword = await passwordService
   *   .comparePassword('plainTextPassword', 'hashedPassword')
   *   .catch((error) => {
   *     console.error('An error occurred during password comparison:', error);
   *     return false; // Return a default value like `false` to handle the error gracefully
   *   });
   *
   * console.log('Password is valid:', isValidPassword);
   * ```
   */
  @HandleErrors(true)
  async comparePassword(
    providedPassword: string ,
    hashedPassword: string,
  ): Promise<boolean> {
    // Validate the provided password
    await isValidPassword(providedPassword);

    // Compare the provided password with the hashed password
    return await this.bcryptProvider.compare(providedPassword, hashedPassword);
  }

}


