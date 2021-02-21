// import Sequelize from 'sequelize';
// const { sequelize } = require("#root/configs/database");

// class BitcoinTransfer extends Sequelize.Model {
//   static associate(models: any) {
//     this.belongsTo(models.User, {
//       foreignKey: 'userId',
//       onUpdate: 'CASCADE',
//       onDelete: 'RESTRICT',
//     })
//   }
// }

// BitcoinTransfer.init(
//   {
//     userId: {
//       type: Sequelize.UUID,
//       allowNull: false,
//       primaryKey: true,
//     },
//     amount: {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//       validate: {
//         notEmpty: {
//           msg: 'amount is required!',
//         },
//         isNumeric: {
//           msg: 'amount should be a number',
//         },
//         isGreaterThanOne(value: any) {
//           if (value < 0) {
//             let error: any = new Error('amount should be a positive number and great');
//             error.name = 'Validation error';
//             error.errors = [{ path: 'amount' }];
//             throw error;
//           }
//         },
//       },
//     },
//     action: {
//       type: Sequelize.ENUM,
//       values: ['sell', 'buy'],
//       allowNull: false,
//       validate: {
//         isIn: {
//           args: [['sell', 'buy']],
//           msg: 'action should be either buy or sell',
//         },
//       },
//     },
//   },
//   {
//     hooks: {
//       beforeCreate: (user: any, options: {}) => { },
//     },
//     sequelize,
//     paranoid: true,
//   }
// );

// export { BitcoinTransfer };


import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { IsString, IsEmpty, IsInt, Matches } from "class-validator"
import { User } from "./User";

enum Action { sell = "sell", buy = "buy" }

@Entity("BitcoinTransfers")
export class BitcoinTransfer extends BaseEntity {

  @PrimaryColumn({ type: "uuid", nullable: false })
  userId: number;

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

  @ManyToOne(type => User, user => user.bitcoinBalances)
  user: User
}