/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
import { AppError } from "@shared/errors/appError";

export namespace ValidateCredentialsError {
  export class UserNotFound extends AppError {
    constructor() {
      super("ValidateCredentialsError.UserNotFound", "User cannot be found");
    }
  }

  export class PasswordNotMatched extends AppError {
    constructor() {
      super("ValidateCredentialsError.PasswordNotMatched", "Wrong password");
    }
  }
}
