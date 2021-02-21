// import Sequelize from 'sequelize';
// const { sequelize } = require("#root/configs/database");

// class BitcoinPrice extends Sequelize.Model {
//   static associate(models: any) { }
// }

// BitcoinPrice.init(
//   {
//     id: {
//       type: Sequelize.UUID,
//       defaultValue: Sequelize.UUIDV4,
//       allowNull: false,
//       primaryKey: true,
//     },
//     price: {
//       type: Sequelize.DOUBLE,
//       allowNull: false,
//       validate: {
//         notEmpty: {
//           msg: 'price amount is required!',
//         },
//         isNumeric: {
//           msg: 'price should be a number',
//         },
//         isGreaterThanOne(value: any) {
//           if (value < 0) {
//             let error: any = new Error('price should be a positive number and great');
//             error.name = 'Validation error';
//             error.errors = [{ path: 'price' }];
//             throw error;
//           }
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

// export { BitcoinPrice };


import { Entity, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryColumn } from "typeorm";
import { IsEmpty, IsInt } from "class-validator"
import { v4 as uuid } from "uuid";

@Entity("BitcoinPrices")
export class BitcoinPrice extends BaseEntity {

    @PrimaryColumn({ type: "uuid", default: uuid() })
    id: string;

    @Column({ type: "double precision", nullable: false, default: 100 })
    @IsEmpty()
    @IsInt()
    price: number;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
