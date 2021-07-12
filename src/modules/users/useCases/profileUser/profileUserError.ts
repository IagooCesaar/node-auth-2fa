/* eslint-disable @typescript-eslint/no-namespace */
import { AppError } from "@shared/errors/appError";

export namespace ProfileUserError {
  export class UserNotFound extends AppError {
    constructor() {
      super("ProfileUserError.UserNotFound", "User not found");
    }
  }
}
