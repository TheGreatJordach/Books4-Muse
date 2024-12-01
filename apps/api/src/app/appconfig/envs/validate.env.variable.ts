import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsStrongPassword,
  validateSync,
  ValidationError
} from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidateEnvVariables {
  @IsString()
  @IsNotEmpty()
  DATASOURCE_USERNAME: string;

  @IsString()
  @IsStrongPassword()
  DATASOURCE_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DATASOURCE_DATABASE: string;

  @IsString()
  @IsNotEmpty()
  DATASOURCE_HOST: string;

  @IsInt()
  @IsPositive()
  DATASOURCE_PORT: number;

  @IsInt()
  @IsPositive()
  SALT_ROUNDS: number

  @IsString()
  @IsNotEmpty()
  NODE_ENV: string

  @IsInt()
  @IsPositive()
  APP_PORT: number

}

type envValidationKeys = keyof ValidateEnvVariables;

function formatValidationErrors(errors: ValidationError[]):string[] {
  const messages : string[]= []

  errors.forEach(error => {
    if (error.constraints) {
      for (const [message] of Object.values(error.constraints) ) {
        messages.push(`${error.property}: ${message}`);
      }
    }
  })

  return messages
}

function validateResult(validated: ValidateEnvVariables, errors: ValidationError[]) {
  const validResults: string[] = []
  const errorMessages = formatValidationErrors(errors);

  // Collect validation status of each property
  const properties: envValidationKeys[] = [
    'DATASOURCE_USERNAME',
    'DATASOURCE_PASSWORD',
    'DATASOURCE_DATABASE',
    'DATASOURCE_HOST',
    'DATASOURCE_PORT',
    'APP_PORT',
    'NODE_ENV',
    'SALT_ROUNDS',
  ];

  properties.forEach(property => {
    const isValid = errors.every(error => error.property === property);
    validResults.push(`${property}: ${isValid ? 'OK' : 'Invalid'}`);
  })

  //Merge
  return [...validResults, ...errorMessages]
}

export function loadValidateEnvVariables(
  envs: Record<string, unknown>,
  processResult:typeof validateResult = validateResult,
) {
  const validEnvs : ValidateEnvVariables = plainToInstance(ValidateEnvVariables,envs,{
    enableImplicitConversion: true,
  })

  const errors = validateSync(validEnvs,{
    skipMissingProperties:false,
  })

  const validationResults: string[] = processResult(validEnvs, errors);

  if (errors.length > 0) {
    const errorMessage = `${errors.length} variable(s) failed validation:\n${validationResults.join('\n')}`;
    // TODO Log the error once without rethrowing it as a log
    console.error(errorMessage);

    // Throw HttpException without duplicating the log
    throw new HttpException(
      {
        errorType: 'configErr',
        where: 'ValidateEnvVariables',
        date: new Date().toISOString(),
        data: null,
        message: "Environment validation failed",
      },
      HttpStatus.INTERNAL_SERVER_ERROR
  );
  }



  return validEnvs
}
