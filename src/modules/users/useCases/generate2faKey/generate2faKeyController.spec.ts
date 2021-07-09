import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

interface IResponseUser {
  id: string;
}

describe("Generate 2FA Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to generate a new QRCode for a valid user", async () => {
    //
    const responseUser = await request(app).post("/users").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "secret",
    });
    const { id: user_id } = responseUser.body.user as IResponseUser;

    const response = await request(app)
      .post("/users/generate2fa")
      .send({ user_id });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("qrcode_url");
    expect(response.body).not.toHaveProperty("key");
  });

  it("Should not be able to generate a new QRCode for a inexistent user", async () => {
    const user_id = uuidV4();

    const response = await request(app)
      .post("/users/generate2fa")
      .send({ user_id });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errorCode");
    expect(response.body.errorCode).toBe("Generate2faKeyError.UserNotFound");
  });
});
