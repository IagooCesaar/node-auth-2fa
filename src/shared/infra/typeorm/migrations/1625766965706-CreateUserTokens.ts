import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTokens1625766965706 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "UserTokens",
        columns: [
          { name: "id", type: "uuid", isPrimary: true },
          { name: "refresh_token", type: "varchar" },
          { name: "user_id", type: "uuid" },
          { name: "expires_date", type: "timestamp" },
          { name: "created_at", type: "timestamp", default: "now()" },
        ],
        foreignKeys: [
          {
            name: "FK_UserTokens_Users",
            referencedTableName: "Users",
            referencedColumnNames: ["id"],
            columnNames: ["user_id"],
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users_tokens");
  }
}
