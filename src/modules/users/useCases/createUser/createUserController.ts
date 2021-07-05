import { Request, Response } from "express";

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    return response.status(201).json({ message: "created" });
  }
}

export { CreateUserController };
