/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
import { AppError } from "@shared/errors/appError";

export namespace Validate2faKeyError {
  export class NoKeysPendingValidation extends AppError {
    constructor() {
      super(
        "Validate2faKeyError.NoKeysPendingValidation",
        "There is no keys pending of validations. Try generate a new two-factor key"
      );
    }
  }

  export class IncorrectCode extends AppError {
    constructor() {
      super(
        "Validate2faKeyError.IncorrectCode",
        "This code is not correct. Try again"
      );
    }
  }
}
