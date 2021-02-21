import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryColumn, Unique, OneToMany } from "typeorm";
import { v4 as uuid } from "uuid";
import { IsString, IsEmpty, IsInt } from "class-validator"
import { UsdTransfer } from "./UsdTransfer"
import { BitcoinTransfer } from "./BitcoinTransfer";

@Entity("Users")
@Unique(["username"])
export class User extends BaseEntity {

    @PrimaryColumn({ type: "uuid", default: uuid(), nullable: false })
    id: string;

    @Column({ nullable: false })
    @IsString()
    @IsEmpty()
    name: string;

    @Column({ unique: true, nullable: false })
    @IsString()
    @IsEmpty()
    username: string;

    @Column({ nullable: false })
    @IsString()
    email: string;

    @Column({ type: "double precision", default: 0, nullable: false })
    @IsInt()
    usdBalance: number;

    @Column({ type: "double precision", default: 0, nullable: false })
    @IsInt()
    bitcoinBalance: number;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(type => UsdTransfer, usdTransfer => usdTransfer.user)
    usdBalances: UsdTransfer[]

    @OneToMany(type => BitcoinTransfer, bitcoinTransfer => bitcoinTransfer.user)
    bitcoinBalances: BitcoinTransfer[]

}
