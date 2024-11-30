import { IHashProvider } from './hash.provider.interface';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


/**
 * Injectable service for handling password hashing and comparison using bcrypt.
 *
 * The `BcryptImplProvider` class implements the `IHashProvider` interface and
 * provides methods to hash data and compare plain data with hashed data. It
 * utilizes the `ConfigService` to retrieve configuration settings, specifically
 * the number of salt rounds used in hashing. The class ensures that the salt
 * rounds are set to a secure value, throwing an `HttpException` if the
 * configuration is invalid.
 *
 * @implements IHashProvider
 */
@Injectable()
export class BcryptImplProvider implements IHashProvider {
  private readonly saltRound: number;

  /**
   * Constructs an instance of the BcryptImplProvider.
   *
   * This constructor initializes the BcryptImplProvider by retrieving the salt
   * rounds configuration from the environment using the ConfigService. It ensures
   * that the salt rounds are set to a valid number, which should be at least 10
   * for security purposes. If the salt rounds are not defined or are less than
   * the required minimum, an HttpException is thrown.
   *
   * @param configService - The ConfigService instance used to access environment configurations.
   * @param BcryptProvider - An instance of BcryptImplProvider for handling bcrypt operations.
   *
   * @throws HttpException - Throws an exception if the SALT_ROUNDS environment variable
   * is not defined or is less than the required minimum.
   */
  constructor(private readonly configService: ConfigService) {
    try {
      const getSalt: string | undefined = this.configService.get('SALT_ROUNDS')

      if (getSalt === undefined) {
        console.error('SALT_ROUNDS is not defined');
        throw new HttpException("Invalid Salt environment variable", HttpStatus.INTERNAL_SERVER_ERROR);
      } else if(Number(getSalt) < 12) {
        console.error('SALT_ROUNDS is less than the requirement (12)');
        throw new HttpException("Invalid Salt environment variable", HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        this.saltRound = Number(getSalt) as number
      }

    } catch {
      throw new HttpException("Invalid Salt environment variable", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Compares the provided data with an encrypted string to verify a match.
   *
   * This method uses bcrypt to compare the plain data with the encrypted data.
   * It returns a Promise that resolves to a boolean indicating whether the data
   * matches the encrypted string.
   *
   * @param data - The plain data to be compared, which can be a string or a Buffer.
   * @param encryptedData - The encrypted string to compare against.
   * @returns A Promise that resolves to true if the data matches the encrypted string, otherwise false.
   *
   * @throws Will throw an error if the comparison process fails.
   */
  async compare(data: string | Buffer, encryptedData: string): Promise<boolean> {
    return await bcrypt.compare(data, encryptedData);
  }

  /**
   * Hashes the provided data using bcrypt.
   *
   * This method generates a salt based on the configured number of salt rounds
   * and uses it to hash the input data. The hashing process is synchronous for
   * salt generation and asynchronous for the actual hashing.
   *
   * @param data - The data to be hashed, which can be a string or a Buffer.
   * @returns A Promise that resolves to the hashed string.
   *
   * @throws Will throw an error if the salt generation or hashing process fails.
   */
  hash(data: string | Buffer): Promise<string> {
    const salt = bcrypt.genSaltSync(this.saltRound);
    return bcrypt.hash(data, salt);
  }
}
