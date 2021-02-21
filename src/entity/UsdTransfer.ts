import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { IsString, IsNotEmpty, IsInt, Matches } from "class-validator"
import { v4 as uuid } from "uuid";

import { User } from "./User"
enum Action { withdraw = "withdraw", deposit = "deposit" }

@Entity("UsdTransfers")
export class UsdTransfer extends BaseEntity {

  @PrimaryColumn({ type: "uuid", default: uuid(), nullable: false })
  Id: string;

  @Column({ type: "double precision", nullable: false })
  @IsNotEmpty()
  @IsInt()
  amount: number;

  @Column({ type: "simple-enum", enum: Action, nullable: false, })
  @IsNotEmpty()
  @IsString()
  @Matches(`^${Object.values(Action).filter(v => typeof v !== "number").join('|')}$`, 'i', { message: "action should be either withdraw or deposit" })
  action: Action;

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(type => User, user => user.usdBalances)
  user: User

}