/* eslint-disable @typescript-eslint/no-namespace */
import { AppError } from "@shared/erros/appError";

export namespace Generate2faKeyError {
  export class UserNotFound extends AppError {
    constructor() {
      super(
        "Generate2faKeyError.UserNotFound",
        "Cannot find a user with provided id"
      );
    }
  }
}
