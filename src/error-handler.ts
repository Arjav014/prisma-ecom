import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";
import { ZodError } from "zod";
import { UnprocessableEntity } from "./exceptions/validation";

type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const errorHandler = (method: Controller) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HttpException;
      if (error instanceof ZodError) {
        exception = new UnprocessableEntity(
          error,
          "Unprocessable entity",
          ErrorCode.UNPROCESSABLE_ENTITY
        );
      } else {
        exception =
          error instanceof HttpException
            ? error
            : new InternalException(
                "Something went wrong!",
                error,
                ErrorCode.INTERNAL_EXCEPTION
              );
      }
      next(exception);
    }
  };
};
