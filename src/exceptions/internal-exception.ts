import { HttpException } from "./root";

export class InternalException extends HttpException {
  constructor(message: string, error: string, errorCode: number) {
    super(message, errorCode, 500, error);
  }
}
