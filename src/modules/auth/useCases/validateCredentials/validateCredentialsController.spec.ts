import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

describe("Validate Credentials Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to validate a user's email and password", async () => {
    await request(app).post("/users").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "secret",
    });

    const response = await request(app).post("/sessions").send({
      email: "john.doe@example.com",
      password: "secret",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("temporaryToken");
    expect(response.body).toHaveProperty("expiresInMinutes");
  });

  it("Should not be able to validate with inexistent email", async () => {
    const response = await request(app).post("/sessions").send({
      email: "john.doe.error@example.com",
      password: "secret",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errorCode");
    expect(response.body.errorCode).toBe(
      "ValidateCredentialsError.UserNotFound"
    );
  });

  it("Should not be able to validate a incorrect password", async () => {
    const response = await request(app).post("/sessions").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "not-secret",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errorCode");
    expect(response.body.errorCode).toBe(
      "ValidateCredentialsError.PasswordNotMatched"
    );
  });
});
