import {Table, Model, Column, DataType, BelongsTo, ForeignKey} from "sequelize-typescript";
import {Cards} from "./cards";

@Table({
   timestamps: true,
   tableName: "cardsItems"
})

export class CardsItems extends Model {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id!: number;
    
    @Column({
        type: DataType.STRING(16384),
        allowNull: true
    })
    cardsList!: string;
    
    @ForeignKey(()=> Cards)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    listID!: number;

    @BelongsTo(()=> Cards)
    cards!: Cards;
}