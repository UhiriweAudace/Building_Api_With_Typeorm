import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryColumn } from "typeorm";
import { IsNotEmpty, IsInt, Min, IsDateString } from "class-validator"
import { v4 as uuid } from "uuid";

@Entity("BitcoinPrices")
export class BitcoinPrice extends BaseEntity {

    @PrimaryColumn({ type: "uuid", default: uuid() })
    id: string;

    @Column({ type: "double precision", nullable: false, default: 100 })
    @IsNotEmpty()
    @Min(0)
    @IsInt()
    price: number;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    @IsDateString()
    updatedAt: Date

}
