/* eslint-disable max-classes-per-file */
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
  export class QRCodeNotGenerated extends AppError {
    constructor() {
      super(
        "Generate2faKeyError.QRCodeNotGenerated",
        "Cannot generate a QR Code image"
      );
    }
  }
  export class QRCodeNotFound extends AppError {
    constructor() {
      super(
        "Generate2faKeyError.QRCodeNotFound",
        "Cannot find a QR Code image"
      );
    }
  }
}
