// import { MigrationInterface, QueryRunner } from "typeorm";

// export class NewMigrations1729743596832 implements MigrationInterface {
//     name = 'NewMigrations1729743596832'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "FK_913fa552e01a0de48058b59d496"`);
//         await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "FK_70f6991101545c10e8e62cb7f2a"`);
//         await queryRunner.query(`ALTER TABLE "schedules" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "FK_913fa552e01a0de48058b59d496" FOREIGN KEY ("departurePortId") REFERENCES "ports"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "FK_70f6991101545c10e8e62cb7f2a" FOREIGN KEY ("destinationPortId") REFERENCES "ports"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "FK_70f6991101545c10e8e62cb7f2a"`);
//         await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "FK_913fa552e01a0de48058b59d496"`);
//         await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "updated_at"`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "FK_70f6991101545c10e8e62cb7f2a" FOREIGN KEY ("destinationPortId") REFERENCES "ports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "FK_913fa552e01a0de48058b59d496" FOREIGN KEY ("departurePortId") REFERENCES "ports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//     }

// }
