/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
import { AppError } from "@shared/errors/appError";

export namespace ValidateTwoFactorKeyError {
  export class TemporaryTokenNotFound extends AppError {
    constructor() {
      super(
        "ValidateTwoFactorKeyError.TemporaryTokenNotFound",
        "The provided temporary token is incorrect or already expires"
      );
    }
  }

  export class NoValidKey extends AppError {
    constructor() {
      super(
        "ValidateTwoFactorKeyError.NoValidKey",
        "No valid keys was found for this user"
      );
    }
  }

  export class IncorrectCode extends AppError {
    constructor() {
      super(
        "ValidateTwoFactorKeyError.IncorrectCode",
        "This code is not correct. Try again"
      );
    }
  }
}
