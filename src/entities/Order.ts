// user_id INT, FOREIGN KEY

import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";
import {Product} from "./Product";

@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'int'})
    quantity!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User)
    user!: User; // user_id or userId

    @ManyToOne(() => Product)
    product!: Product; // productId or product_id
}

// orders_products

// user A
// order 1
// order 2

// product A
//
