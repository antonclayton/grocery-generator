import { CustomError } from "../utils/CustomError";

export class DuplicateError extends CustomError {
  StatusCode = 409;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, DuplicateError.prototype);
  }
  serialize(): { message: string } {
    return { message: this.message };
  }
}
