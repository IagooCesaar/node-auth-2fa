import request from "supertest";
import { Connection } from "typeorm";

import { OTPLibProvider } from "@shared/container/providers/OneTimePasswordProvider/implementations/OTPLibProvider";
import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

interface IResponseUser {
  id: string;
}

describe("Refresh Token Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to generate a new refresh token", async () => {
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
    let totp_code = otp.generateToken(key);

    await request(app).post("/users/validate2fa").send({ user_id, totp_code });

    const temporaryTokenResponse = await request(app).post("/sessions").send({
      email: "john.doe@example.com",
      password: "secret",
    });
    const { temporaryToken } = temporaryTokenResponse.body;

    totp_code = otp.generateToken(key);
    const refreshTokenResponse = await request(app)
      .post("/sessions/two-factor")
      .send({
        totp_code,
        temporaryToken,
      });
    const { refreshToken } = refreshTokenResponse.body;

    const response = await request(app).post("/sessions/refresh-token").send({
      refreshToken,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refreshToken");
  });
});
