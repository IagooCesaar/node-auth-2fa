/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-namespace */
import { AppError } from "@shared/errors/appError";

export namespace RefreshTokenError {
  export class RefreshTokenNotExists extends AppError {
    constructor() {
      super(
        "RefreshTokenError.RefreshTokenNotExists",
        "Refresh token does not exists"
      );
    }
  }

  export class RefreshTokenExpires extends AppError {
    constructor() {
      super("RefreshTokenError.RefreshTokenExpires", "Refresh token expired");
    }
  }
}
