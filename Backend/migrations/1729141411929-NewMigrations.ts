// import { MigrationInterface, QueryRunner } from "typeorm";

// export class NewMigrations1729141411929 implements MigrationInterface {
//     name = 'NewMigrations1729141411929'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`CREATE TABLE "ports" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "latitude" numeric(10,6) NOT NULL, "longitude" numeric(10,6) NOT NULL, "country" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4f9ec72c579aed1006566533a02" UNIQUE ("name"), CONSTRAINT "PK_291c9f372b1ce97c885e96f5ff4" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "UQ_7eb77f64098c15db10516ab2dd7"`);
//         await queryRunner.query(`ALTER TABLE "routes" DROP COLUMN "departurePortId"`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD "departurePortId" integer`);
//         await queryRunner.query(`ALTER TABLE "routes" DROP COLUMN "destinationPortId"`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD "destinationPortId" integer`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "UQ_7eb77f64098c15db10516ab2dd7" UNIQUE ("departurePortId", "destinationPortId")`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "FK_913fa552e01a0de48058b59d496" FOREIGN KEY ("departurePortId") REFERENCES "ports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "FK_70f6991101545c10e8e62cb7f2a" FOREIGN KEY ("destinationPortId") REFERENCES "ports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "FK_70f6991101545c10e8e62cb7f2a"`);
//         await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "FK_913fa552e01a0de48058b59d496"`);
//         await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "UQ_7eb77f64098c15db10516ab2dd7"`);
//         await queryRunner.query(`ALTER TABLE "routes" DROP COLUMN "destinationPortId"`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD "destinationPortId" character varying`);
//         await queryRunner.query(`ALTER TABLE "routes" DROP COLUMN "departurePortId"`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD "departurePortId" character varying`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "UQ_7eb77f64098c15db10516ab2dd7" UNIQUE ("departurePortId", "destinationPortId")`);
//         await queryRunner.query(`DROP TABLE "ports"`);
//     }

// }
