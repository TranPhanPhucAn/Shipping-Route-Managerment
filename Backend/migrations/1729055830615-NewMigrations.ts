// import { MigrationInterface, QueryRunner } from "typeorm";

// export class NewMigrations1729055830615 implements MigrationInterface {
//     name = 'NewMigrations1729055830615'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "ports" ADD "latitude" numeric(10,6) NOT NULL`);
//         await queryRunner.query(`ALTER TABLE "ports" ADD "longitude" numeric(10,6) NOT NULL`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "ports" DROP COLUMN "longitude"`);
//         await queryRunner.query(`ALTER TABLE "ports" DROP COLUMN "latitude"`);
//     }

// }
