import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserSecondFactorKey1625511352413
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "UserSecondFactorKey",
        columns: [
          { name: "user_id", type: "uuid", isPrimary: true },
          { name: "key", type: "varchar" },
          { name: "created_at", type: "timestamp", default: "now()" },
        ],
        foreignKeys: [
          {
            name: "FK_User2FAKey_Users",
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
    await queryRunner.dropTable("UserSecondFactorKey");
  }
}
