import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryGeneratedColumn, Unique, OneToMany } from "typeorm";
import { IsString, IsNotEmpty, MinLength, IsEmail, IsAlphanumeric, Min } from "class-validator"
import { UsdTransfer } from "@entity/UsdTransfer"
import { BitcoinTransfer } from "@entity/BitcoinTransfer";

@Entity("Users")
@Unique(["username", "email"])
export class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
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

    @Column({ unique: true, nullable: false })
    @IsString()
    @IsEmail({}, { message: "Email must be valid" })
    email: string;

    @Column({ type: "double precision", default: 0, nullable: false })
    @Min(0)
    usdBalance: bigint;

    @Column({ type: "double precision", default: 0, nullable: false })
    @Min(0)
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
