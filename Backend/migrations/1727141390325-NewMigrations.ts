// import { MigrationInterface, QueryRunner } from "typeorm";

// export class NewMigrations1727141390325 implements MigrationInterface {
//     name = 'NewMigrations1727141390325'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_e647aea920f8d23a68905dac4e9"`);
//         await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_bd1f5ca01e3e33c18e72b66ade2"`);
//         await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "vesselIdId"`);
//         await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "routeIdId"`);
//         await queryRunner.query(`CREATE TYPE "public"."vessel_status_enum" AS ENUM('AVAILABLE', 'IN_TRANSIT', 'UNDER_MAINTENANCE')`);
//         await queryRunner.query(`ALTER TABLE "vessel" ADD "status" "public"."vessel_status_enum" NOT NULL DEFAULT 'AVAILABLE'`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD "vesselId" integer`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD "routeId" integer`);
//         await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "PK_1c05e42aec7371641193e180046"`);
//         await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "id"`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD "id" SERIAL NOT NULL`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id")`);
//         await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "departure_time"`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD "departure_time" character varying NOT NULL`);
//         await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "arrival_time"`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD "arrival_time" character varying NOT NULL`);
//         await queryRunner.query(`ALTER TABLE "schedule" ALTER COLUMN "status" SET DEFAULT 'Scheduled'`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_eb27db7cec5cd3b2fbb798d1af6" FOREIGN KEY ("vesselId") REFERENCES "vessel"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_3b4f19c3286140b393ee9af676e" FOREIGN KEY ("routeId") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_3b4f19c3286140b393ee9af676e"`);
//         await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_eb27db7cec5cd3b2fbb798d1af6"`);
//         await queryRunner.query(`ALTER TABLE "schedule" ALTER COLUMN "status" DROP DEFAULT`);
//         await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "arrival_time"`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD "arrival_time" TIMESTAMP NOT NULL`);
//         await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "departure_time"`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD "departure_time" TIMESTAMP NOT NULL`);
//         await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "PK_1c05e42aec7371641193e180046"`);
//         await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "id"`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id")`);
//         await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "routeId"`);
//         await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "vesselId"`);
//         await queryRunner.query(`ALTER TABLE "vessel" DROP COLUMN "status"`);
//         await queryRunner.query(`DROP TYPE "public"."vessel_status_enum"`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD "routeIdId" integer NOT NULL`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD "vesselIdId" integer NOT NULL`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_bd1f5ca01e3e33c18e72b66ade2" FOREIGN KEY ("routeIdId") REFERENCES "routes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_e647aea920f8d23a68905dac4e9" FOREIGN KEY ("vesselIdId") REFERENCES "vessel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//     }

// }
