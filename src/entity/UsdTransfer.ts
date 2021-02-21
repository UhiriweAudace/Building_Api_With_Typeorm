import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { IsString, IsEmpty, IsInt, Matches } from "class-validator"
import { v4 as uuid } from "uuid";

import { User } from "./User"
enum Action { withdraw = "withdraw", deposit = "deposit" }

@Entity("UsdTransfers")
export class UsdTransfer extends BaseEntity {

  @PrimaryColumn({ type: "uuid", default: uuid(), nullable: false })
  Id: string;

  @Column({ type: "double precision", nullable: false })
  @IsEmpty()
  @IsInt()
  amount: number;

  @Column({ type: "simple-enum", enum: Action, nullable: false, })
  @IsEmpty()
  @IsString()
  @Matches(`^${Object.values(Action).filter(v => typeof v !== "number").join('|')}$`, 'i')
  action: Action;

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(type => User, user => user.usdBalances)
  user: User

}