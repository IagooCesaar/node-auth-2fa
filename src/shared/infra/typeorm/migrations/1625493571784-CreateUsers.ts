import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1625493571784 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "Users",
        columns: [
          { name: "id", type: "uuid", isPrimary: true },
          { name: "name", type: "varchar" },
          { name: "email", type: "varchar", isUnique: true },
          { name: "password", type: "varchar" },
          { name: "created_at", type: "timestamp", default: "now()" },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("Users");
  }
}
