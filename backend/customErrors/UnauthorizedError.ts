import { CustomError } from "../utils/CustomError";

export class UnauthorizedError extends CustomError {
  StatusCode = 401;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
  serialize(): { message: string } {
    return { message: this.message };
  }
}
