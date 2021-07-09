import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import auth from "@config/auth";
import { EnsureAuthenticatedError } from "@shared/errors/ensureAuthenticatedError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new EnsureAuthenticatedError.TokenMissing();
  }
  const [, token] = authHeader.split(" "); // Bearer Token
  try {
    const { sub: user_id } = verify(token, auth.secret_token) as IPayload;
    request.user = {
      id: user_id,
    };
    next();
  } catch (error) {
    throw new EnsureAuthenticatedError.InvalidToken();
  }
}
