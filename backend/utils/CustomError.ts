export abstract class CustomError extends Error {
  // All errors must have these fields
  constructor(public message: string) {
    super(message);
  }
  abstract StatusCode: number;
  abstract serialize(): { message: string; errors?: any };
}
