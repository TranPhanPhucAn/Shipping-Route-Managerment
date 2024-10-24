// import { MigrationInterface, QueryRunner } from "typeorm";

// export class NewMigrations1729774760265 implements MigrationInterface {
//     name = 'NewMigrations1729774760265'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_58c844378d23d6bb0dd0cf46c19"`);
//         await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_58c844378d23d6bb0dd0cf46c19" FOREIGN KEY ("vesselId") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_58c844378d23d6bb0dd0cf46c19"`);
//         await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_58c844378d23d6bb0dd0cf46c19" FOREIGN KEY ("vesselId") REFERENCES "vessels"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
//     }

// }
