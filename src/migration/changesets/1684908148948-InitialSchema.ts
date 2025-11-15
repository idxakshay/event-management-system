import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1684908148948 implements MigrationInterface {
  name = 'InitialSchema1684908148948';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "id" INTEGER PRIMARY KEY AUTOINCREMENT, "name" varchar(255) NOT NULL UNIQUE)`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "id" INTEGER PRIMARY KEY AUTOINCREMENT, "name" varchar, "email" varchar(255) NOT NULL UNIQUE, "password" varchar(100) NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_role" ("user_id" integer NOT NULL, "role_id" integer NOT NULL, PRIMARY KEY ("user_id", "role_id"), FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE, FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE)`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_d0e5815877f7395a198a4cb0a4" ON "user_role" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_32a6fc2fcb019d8e3a8ace0f55" ON "user_role" ("role_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_32a6fc2fcb019d8e3a8ace0f55"`);
    await queryRunner.query(`DROP INDEX "IDX_d0e5815877f7395a198a4cb0a4"`);
    await queryRunner.query(`DROP TABLE "user_role"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
