import {Table, Model, Column, DataType, HasMany} from "sequelize-typescript";
import {CardsItems} from "./cardsItems";

@Table({
   timestamps: true,
   tableName: "cards"
})

export class Cards extends Model {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    title!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    order!: number;

    @HasMany(()=>CardsItems)
    cardsItems!: CardsItems[];
}