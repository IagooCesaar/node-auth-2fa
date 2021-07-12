import request from "supertest";
import { Connection } from "typeorm";

import { OTPLibProvider } from "@shared/container/providers/OneTimePasswordProvider/implementations/OTPLibProvider";
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

  it("Should be able to validate a new QRCode for a valid user", async () => {
    //
    const responseUser = await request(app).post("/users").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "secret",
    });
    const { id: user_id } = responseUser.body.user as IResponseUser;

    await request(app).post("/users/generate2fa").send({ user_id });

    // obter chave, gerar totp e enviar para validação
    const rawData = await connection.query(
      `SELECT "UserSecondFactorKey".key 
      FROM "UserSecondFactorKey"
      WHERE "UserSecondFactorKey".user_id = $1
      and "UserSecondFactorKey".validated = $2`,
      [user_id, false]
    );
    const { key } = rawData[0];

    const otp = new OTPLibProvider();
    const totp_code = otp.generateToken(key);

    const response = await request(app)
      .post("/users/validate2fa")
      .send({ user_id, totp_code });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("isCorrect");
    expect(response.body.isCorrect).toBe(true);
  });

  it("Should not be able to validate a QRCode with no keys pending of validation", async () => {
    //
    const responseUser = await request(app).post("/users").send({
      name: "John Doe Two",
      email: "john.doe.two@example.com",
      password: "secret",
    });
    const { id: user_id } = responseUser.body.user as IResponseUser;

    await request(app).post("/users/generate2fa").send({ user_id });

    // obter chave, gerar totp e enviar para validação
    const rawData = await connection.query(
      `SELECT "UserSecondFactorKey".key 
      FROM "UserSecondFactorKey"
      WHERE "UserSecondFactorKey".user_id = $1`,
      [user_id]
    );
    const { key } = rawData[0];

    const otp = new OTPLibProvider();
    const totp_code = otp.generateToken(key);

    await request(app).post("/users/validate2fa").send({ user_id, totp_code });

    const response = await request(app)
      .post("/users/validate2fa")
      .send({ user_id, totp_code });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errorCode");
    expect(response.body.errorCode).toBe(
      "Validate2faKeyError.NoKeysPendingValidation"
    );
  });

  it("Should not be able to validate a QRCode with incorrect TOTP code", async () => {
    //
    const responseUser = await request(app).post("/users").send({
      name: "John Doe Three",
      email: "john.doe.three@example.com",
      password: "secret",
    });
    const { id: user_id } = responseUser.body.user as IResponseUser;

    await request(app).post("/users/generate2fa").send({ user_id });

    const totp_code = "000000";

    const response = await request(app)
      .post("/users/validate2fa")
      .send({ user_id, totp_code });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errorCode");
    expect(response.body.errorCode).toBe("Validate2faKeyError.IncorrectCode");
  });
});
