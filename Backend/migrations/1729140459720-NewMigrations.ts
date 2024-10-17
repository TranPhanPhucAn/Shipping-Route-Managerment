// import { MigrationInterface, QueryRunner } from "typeorm";

// export class NewMigrations1729140459720 implements MigrationInterface {
//     name = 'NewMigrations1729140459720'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "FK_913fa552e01a0de48058b59d496"`);
//         await queryRunner.query(`ALTER TABLE "ports" DROP CONSTRAINT "PK_291c9f372b1ce97c885e96f5ff4"`);
//         await queryRunner.query(`ALTER TABLE "ports" DROP COLUMN "id"`);
//         await queryRunner.query(`ALTER TABLE "ports" ADD "id" SERIAL NOT NULL`);
//         await queryRunner.query(`ALTER TABLE "ports" ADD CONSTRAINT "PK_291c9f372b1ce97c885e96f5ff4" PRIMARY KEY ("id")`);
//         await queryRunner.query(`ALTER TABLE "ports" ADD CONSTRAINT "UQ_4f9ec72c579aed1006566533a02" UNIQUE ("name")`);
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
//         await queryRunner.query(`ALTER TABLE "ports" DROP CONSTRAINT "UQ_4f9ec72c579aed1006566533a02"`);
//         await queryRunner.query(`ALTER TABLE "ports" DROP CONSTRAINT "PK_291c9f372b1ce97c885e96f5ff4"`);
//         await queryRunner.query(`ALTER TABLE "ports" DROP COLUMN "id"`);
//         await queryRunner.query(`ALTER TABLE "ports" ADD "id" character varying NOT NULL`);
//         await queryRunner.query(`ALTER TABLE "ports" ADD CONSTRAINT "PK_291c9f372b1ce97c885e96f5ff4" PRIMARY KEY ("id")`);
//         await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "FK_913fa552e01a0de48058b59d496" FOREIGN KEY ("departurePortId") REFERENCES "ports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//     }

// }
