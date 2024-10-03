// import { MigrationInterface, QueryRunner } from "typeorm";

// export class NewMigrations1727884491766 implements MigrationInterface {
//     name = 'NewMigrations1727884491766'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "role" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "createdAt"`);
//     }

// }
