import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { IsString, IsNotEmpty, IsInt, Matches } from "class-validator"
import { v4 as uuid } from "uuid";

import { User } from "./User";
enum Action { sell = "sell", buy = "buy" }

@Entity("BitcoinTransfers")
export class BitcoinTransfer extends BaseEntity {

  @PrimaryColumn({ type: "uuid", default: uuid(), nullable: false })
  id: string;

  @Column({ type: "double precision", nullable: false })
  @IsNotEmpty()
  @IsInt()
  amount: number;

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