// import { MigrationInterface, QueryRunner } from "typeorm";

// export class NewMigrations1727014706755 implements MigrationInterface {
//     name = 'NewMigrations1727014706755'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`CREATE TABLE "ports" ("id" character varying NOT NULL, "name" character varying NOT NULL, "location" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_291c9f372b1ce97c885e96f5ff4" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`CREATE TABLE "routes" ("id" SERIAL NOT NULL, "distance" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "departurePortId" character varying, "destinationPortId" character varying, CONSTRAINT "UQ_7eb77f64098c15db10516ab2dd7" UNIQUE ("departurePortId", "destinationPortId"), CONSTRAINT "PK_76100511cdfa1d013c859f01d8b" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`CREATE TABLE "vessel" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "capacity" integer NOT NULL, "ownerId" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_671324bf91a27587e30e8a59f16" UNIQUE ("name"), CONSTRAINT "PK_87cc5d99bd07c65028ddcc9c785" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`CREATE TYPE "public"."schedule_status_enum" AS ENUM('Scheduled', 'In Transit', 'Completed', 'Cancelled')`);
//         await queryRunner.query(`CREATE TABLE "schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "departure_time" TIMESTAMP NOT NULL, "arrival_time" TIMESTAMP NOT NULL, "status" "public"."schedule_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "vesselIdId" integer NOT NULL, "routeIdId" integer NOT NULL, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "FK_913fa552e01a0de48058b59d496" FOREIGN KEY ("departurePortId") REFERENCES "ports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "FK_70f6991101545c10e8e62cb7f2a" FOREIGN KEY ("destinationPortId") REFERENCES "ports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_e647aea920f8d23a68905dac4e9" FOREIGN KEY ("vesselIdId") REFERENCES "vessel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_bd1f5ca01e3e33c18e72b66ade2" FOREIGN KEY ("routeIdId") REFERENCES "routes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_bd1f5ca01e3e33c18e72b66ade2"`);
//         await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_e647aea920f8d23a68905dac4e9"`);
//         await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "FK_70f6991101545c10e8e62cb7f2a"`);
//         await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "FK_913fa552e01a0de48058b59d496"`);
//         await queryRunner.query(`DROP TABLE "schedule"`);
//         await queryRunner.query(`DROP TYPE "public"."schedule_status_enum"`);
//         await queryRunner.query(`DROP TABLE "vessel"`);
//         await queryRunner.query(`DROP TABLE "routes"`);
//         await queryRunner.query(`DROP TABLE "ports"`);
//     }

// }
