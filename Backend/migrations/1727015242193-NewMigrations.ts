// import { MigrationInterface, QueryRunner } from "typeorm";

// export class NewMigrations1727015242193 implements MigrationInterface {
//     name = 'NewMigrations1727015242193'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "user" ADD "phone_number" character varying`);
//         await queryRunner.query(`ALTER TABLE "user" ADD "image_url" character varying`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "image_url"`);
//         await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone_number"`);
//     }

// }
