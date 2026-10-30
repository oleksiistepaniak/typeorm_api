import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn() // id INT PRIMARY KEY AUTO_INCREMENT
    id!: number;

    @Column({ type: "varchar", unique: true }) // by default its type varchar
    email!: string;

    @Column({ type: "varchar" })
    password!: string;

    @CreateDateColumn() // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    createdAt!: Date;
}

// normal forms -- normalization
//
