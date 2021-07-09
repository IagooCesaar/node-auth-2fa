import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/users").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "secret",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("user");
  });

  it("Should not be able to create a new user if email already exists", async () => {
    const response = await request(app).post("/users").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "secret",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errorCode");
    expect(response.body.errorCode).toBe("CreateUserError.EmailIsAlreadyInUse");
  });
});
