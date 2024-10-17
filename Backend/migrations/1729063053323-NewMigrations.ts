// import { MigrationInterface, QueryRunner } from "typeorm";

// export class NewMigrations1729063053323 implements MigrationInterface {
//     name = 'NewMigrations1729063053323'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "routes" ADD "estimatedTimeDays" integer DEFAULT '0'`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD "estimatedTimeHours" integer DEFAULT '0'`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "routes" DROP COLUMN "estimatedTimeHours"`);
//         await queryRunner.query(`ALTER TABLE "routes" DROP COLUMN "estimatedTimeDays"`);
//     }

// }
