import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey, AllowNull } from 'sequelize-typescript';
import Expense from './Expense';

@Table({
    tableName: 'budgets'
})

class Budget extends Model {
    @AllowNull(false)
    @Column({ type: DataType.STRING(100) })
    declare name: string;

    @AllowNull(false)
    @Column({ type: DataType.DECIMAL })
    declare amount: number;

    @HasMany(() => Expense, {
        onUpdate: 'cascade',
        onDelete: 'cascade'
    })
    declare expenses: Expense[];
};

export default Budget;