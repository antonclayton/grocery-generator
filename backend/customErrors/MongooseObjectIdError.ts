import { CustomError } from "../utils/CustomError";

export class MongooseObjectIdError extends CustomError {
  StatusCode = 400;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, MongooseObjectIdError.prototype);
  }
  serialize(): { message: string } {
    return { message: this.message };
  }
}
