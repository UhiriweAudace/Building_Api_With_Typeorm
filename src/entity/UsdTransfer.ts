// import Sequelize from 'sequelize';
// const { sequelize } = require("#root/configs/database");

// class UsdTransfer extends Sequelize.Model {
//   static associate(models: any) {
//     this.belongsTo(models.User, {
//       foreignKey: 'userId',
//       onUpdate: 'CASCADE',
//       onDelete: 'RESTRICT',
//     })
//   }
// }

// UsdTransfer.init(
//   {
//     userId: {
//       type: Sequelize.UUID,
//       allowNull: false,
//       primaryKey: true,
//     },
//     amount: {
//       type: Sequelize.DOUBLE,
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
//       values: ['withdraw', 'deposit'],
//       allowNull: false,
//       validate: {
//         isIn: {
//           args: [['withdraw', 'deposit']],
//           msg: 'action should be either withdraw or deposit',
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

// export { UsdTransfer };



import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { IsString, IsEmpty, IsInt, Matches } from "class-validator"
import { User } from "./User"
enum Action { withdraw = "withdraw", deposit = "deposit" }

@Entity("UsdTransfers")
export class UsdTransfer extends BaseEntity {

  @PrimaryColumn({ type: "uuid", nullable: false })
  Id: User;

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