import { Table, Column, Model, DataType, HasMany, Default, Unique, AllowNull } from "sequelize-typescript";

@Table({
    tableName: 'users'
})

class User extends Model {
    @AllowNull(false)
    @Column({ type: DataType.STRING(50) })
    declare name: string;

    @AllowNull(false)
    @Unique(true)
    @Column({ type: DataType.STRING(50) })
    declare email: string;

    @AllowNull(false)
    @Column({ type: DataType.STRING(60) })
    declare password: string;

    @Column({ type: DataType.STRING(100) })
    declare token: string;

    @Default(false)
    @Column({ type: DataType.BOOLEAN })
    declare confirmed: boolean;
}

export default User;