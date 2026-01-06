import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsTimestamp(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isTimestamp',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'number' &&
            Number.isInteger(value) &&
            value >= 0 &&
            !isNaN(new Date(value).getTime())
          );
        },
      },
    });
  };
}
