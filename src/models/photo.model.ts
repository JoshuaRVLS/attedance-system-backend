import { Model, DataTypes, Optional } from "sequelize"
import { sequelize } from "../config/database"
import User from "./student.model";

interface PhotoAttributes {
    id: string;
    data: Buffer;
    mimetype: string;
    userId: string;
}

interface PhotoCreationAttributes extends Optional<PhotoAttributes, 'id'> { }

class Photo extends Model<PhotoAttributes, PhotoCreationAttributes> implements PhotoAttributes {
    public id!: string;
    public data!: Buffer;
    public mimetype!: string;
    public userId!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly user?: User;
}

Photo.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    data: {
        type: DataTypes.BLOB('long'),
        allowNull: false
    },
    mimetype: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Photo'
})



export default Photo;