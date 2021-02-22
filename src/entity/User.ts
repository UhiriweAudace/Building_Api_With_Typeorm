import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryColumn, Unique, OneToMany } from "typeorm";
import { v4 as uuid } from "uuid";
import { IsString, IsNotEmpty, MinLength, IsEmail, IsAlphanumeric } from "class-validator"
import { UsdTransfer } from "@entity/UsdTransfer"
import { BitcoinTransfer } from "@entity/BitcoinTransfer";

@Entity("Users")
@Unique(["username"])
export class User extends BaseEntity {

    @PrimaryColumn({ type: "uuid", default: uuid(), nullable: false })
    id: string;

    @Column({ nullable: false })
    @MinLength(3)
    @IsString()
    @IsNotEmpty()
    name: string;

    @Column({ unique: true, nullable: false })
    @MinLength(3)
    @IsAlphanumeric()
    @IsString()
    @IsNotEmpty()
    username: string;

    @Column({ nullable: false })
    @IsString()
    @IsEmail({}, { message: "Email must be valid" })
    email: string;

    @Column({ type: "double precision", default: 0, nullable: false })
    usdBalance: bigint;

    @Column({ type: "double precision", default: 0, nullable: false })
    bitcoinAmount: bigint;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(type => UsdTransfer, usdTransfer => usdTransfer.user)
    usdBalances: UsdTransfer[]

    @OneToMany(type => BitcoinTransfer, bitcoinTransfer => bitcoinTransfer.user)
    bitcoinBalances: BitcoinTransfer[]

}
