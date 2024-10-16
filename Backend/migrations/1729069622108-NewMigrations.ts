// import { MigrationInterface, QueryRunner } from "typeorm";

// export class NewMigrations1729069622108 implements MigrationInterface {
//     name = 'NewMigrations1729069622108'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "routes" DROP COLUMN "estimatedTimeHours"`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "routes" ADD "estimatedTimeHours" integer DEFAULT '0'`);
//     }

// }
