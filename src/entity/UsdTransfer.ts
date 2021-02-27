import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryColumn, ManyToOne, Generated } from "typeorm";
import { IsString, IsNotEmpty, IsInt, Matches, Min } from "class-validator"

import { User } from "./User"
enum Action { withdraw = "withdraw", deposit = "deposit" }

@Entity("UsdTransfers")
export class UsdTransfer extends BaseEntity {

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
  @Matches(`^${Object.values(Action).filter(v => typeof v !== "number").join('|')}$`, 'i', { message: "action should be either withdraw or deposit" })
  action: Action;

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(type => User, user => user.usdBalances)
  user: User

}