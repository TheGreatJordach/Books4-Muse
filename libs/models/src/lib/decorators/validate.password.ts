
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator } from 'class-validator';

// Custom validation for password matching
@ValidatorConstraint({ async: false })
class IsPasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as any; // Get the object being validated
    return object.password === confirmPassword; // Check if passwords match
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Password and Confirm Password do not match';
  }
}

export function IsPasswordMatch(validationOptions?: any) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsPasswordMatch',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsPasswordMatchConstraint,
    });
  };
}
