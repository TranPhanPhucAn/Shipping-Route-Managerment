// import { MigrationInterface, QueryRunner } from "typeorm";

// export class NewMigrations1729750849344 implements MigrationInterface {
//     name = 'NewMigrations1729750849344'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "routes" DROP COLUMN "updatedAt"`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "routes" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
//     }

// }
