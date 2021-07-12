/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
import { AppError } from "@shared/errors/appError";

export namespace EnsureAuthenticatedError {
  export class TokenMissing extends AppError {
    constructor() {
      super("EnsureAuthenticatedError.TokenMissing", "Token missing", 401);
    }
  }

  export class TokenExpired extends AppError {
    constructor() {
      super("EnsureAuthenticatedError.TokenExpired", "Token expired", 401);
    }
  }

  export class InvalidToken extends AppError {
    constructor() {
      super("EnsureAuthenticatedError.InvalidToken", "Invalid token", 401);
    }
  }
}
