import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryColumn, ManyToOne, Generated } from "typeorm";
import { IsString, IsNotEmpty, IsInt, Matches, Min } from "class-validator"

import { User } from "./User";
enum Action { sell = "sell", buy = "buy" }

@Entity("BitcoinTransfers")
export class BitcoinTransfer extends BaseEntity {

  @PrimaryColumn({ type: "uuid", nullable: false })
  @Generated("uuid")
  id: string;

  @Column({ type: "double precision", nullable: false })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  amount: bigint;

  @Column({ type: "simple-enum", enum: Action, nullable: false, })
  @IsNotEmpty()
  @IsString()
  @Matches(`^${Object.values(Action).filter(v => typeof v !== "number").join('|')}$`, 'i',
    { message: "Action should be either sell or buy" })
  action: Action;

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(type => User, user => user.bitcoinBalances)
  user: User
}