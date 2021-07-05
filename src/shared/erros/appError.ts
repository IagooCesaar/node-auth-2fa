export class AppError {
  public message: string;
  public errorCode: string;
  public statusCode: number;

  constructor(errorCode: string, message: string, statusCode = 400) {
    this.errorCode = errorCode;
    this.message = message;
    this.statusCode = statusCode;
  }
}