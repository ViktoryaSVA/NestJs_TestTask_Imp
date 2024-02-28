import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBlackListTable1708959295864 implements MigrationInterface {
    name = 'CreateBlackListTable1708959295864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "black-list" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, CONSTRAINT "PK_93979f22a3f6a8e9893431988ac" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "black-list"`);
    }

}
