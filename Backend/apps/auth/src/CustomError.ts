export class CustomError extends Error {
  extensions: { errorCode: string };

  constructor(message: string, errorCode: string) {
    super(message);
    this.name = this.constructor.name;
    this.extensions = { errorCode }; // format the error with extensions
    Error.captureStackTrace(this, this.constructor);
  }
}
