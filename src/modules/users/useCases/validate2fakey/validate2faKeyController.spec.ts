import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

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

  // throw new Validate2faKeyError.NoKeysPendingValidation();
  // throw new Validate2faKeyError.IncorrectCode();

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
      WHERE "UserSecondFactorKey".user_id = $1`,
      [user_id]
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
});
