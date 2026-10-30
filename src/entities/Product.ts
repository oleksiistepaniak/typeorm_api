import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2  })
    price!: number;

    @Column({ type: "int", default: 0 })
    stock!: number;
}
