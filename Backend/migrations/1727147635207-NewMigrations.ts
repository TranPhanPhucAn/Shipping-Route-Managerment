// import { MigrationInterface, QueryRunner } from "typeorm";

// export class NewMigrations1727147635207 implements MigrationInterface {
//     name = 'NewMigrations1727147635207'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "user" ADD "gender" text`);
//         await queryRunner.query(`ALTER TABLE "user" ADD "birthday" text`);
//         await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
//         await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birthday"`);
//         await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
//     }

// }
