/* eslint-disable @typescript-eslint/no-namespace */
import { AppError } from "@shared/errors/appError";

export namespace CreateUserError {
  export class EmailIsAlreadyInUse extends AppError {
    constructor() {
      super(
        "CreateUserError.EmailIsAlreadyInUse",
        "This email is already in use"
      );
    }
  }
}
