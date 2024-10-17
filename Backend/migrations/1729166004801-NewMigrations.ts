// import { MigrationInterface, QueryRunner } from "typeorm";

// export class NewMigrations1729166004801 implements MigrationInterface {
//     name = 'NewMigrations1729166004801'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`CREATE TABLE "ports" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "latitude" numeric(10,6) NOT NULL, "longitude" numeric(10,6) NOT NULL, "country" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_291c9f372b1ce97c885e96f5ff4" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`CREATE TABLE "routes" ("id" SERIAL NOT NULL, "distance" double precision NOT NULL, "estimatedTimeDays" integer DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "departurePortId" integer, "destinationPortId" integer, CONSTRAINT "UQ_7eb77f64098c15db10516ab2dd7" UNIQUE ("departurePortId", "destinationPortId"), CONSTRAINT "PK_76100511cdfa1d013c859f01d8b" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`CREATE TYPE "public"."schedules_status_enum" AS ENUM('Scheduled', 'In Transit', 'Completed', 'Cancelled')`);
//         await queryRunner.query(`CREATE TABLE "schedules" ("id" SERIAL NOT NULL, "departure_time" character varying NOT NULL, "arrival_time" character varying NOT NULL, "status" "public"."schedules_status_enum" NOT NULL DEFAULT 'Scheduled', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "vesselId" integer, "routeId" integer, CONSTRAINT "PK_7e33fc2ea755a5765e3564e66dd" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`CREATE TYPE "public"."vessels_status_enum" AS ENUM('AVAILABLE', 'IN_TRANSIT', 'UNDER_MAINTENANCE')`);
//         await queryRunner.query(`CREATE TABLE "vessels" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "capacity" integer NOT NULL, "ownerId" character varying NOT NULL, "status" "public"."vessels_status_enum" NOT NULL DEFAULT 'AVAILABLE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e66e468e2dd8dd71f3bdf91f635" UNIQUE ("name"), CONSTRAINT "PK_be5a5b1f0d546d8bec08e0d1583" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "FK_913fa552e01a0de48058b59d496" FOREIGN KEY ("departurePortId") REFERENCES "ports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "FK_70f6991101545c10e8e62cb7f2a" FOREIGN KEY ("destinationPortId") REFERENCES "ports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_58c844378d23d6bb0dd0cf46c19" FOREIGN KEY ("vesselId") REFERENCES "vessels"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_796dabf6a5077692672d42e704b" FOREIGN KEY ("routeId") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_796dabf6a5077692672d42e704b"`);
//         await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_58c844378d23d6bb0dd0cf46c19"`);
//         await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "FK_70f6991101545c10e8e62cb7f2a"`);
//         await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "FK_913fa552e01a0de48058b59d496"`);
//         await queryRunner.query(`DROP TABLE "vessels"`);
//         await queryRunner.query(`DROP TYPE "public"."vessels_status_enum"`);
//         await queryRunner.query(`DROP TABLE "schedules"`);
//         await queryRunner.query(`DROP TYPE "public"."schedules_status_enum"`);
//         await queryRunner.query(`DROP TABLE "routes"`);
//         await queryRunner.query(`DROP TABLE "ports"`);
//     }

// }
