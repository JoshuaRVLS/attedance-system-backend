import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/database";
import Photo from "./photo.model";
import StudentClass from "./class.model";

interface StudentAttributes {
  id: string;
  firstName: string;
  lastName: string;
  studentClassId: string;
  isPresent?: boolean;
}

interface StudentCreationAttributes extends Optional<StudentAttributes, "id"> {}

class User
  extends Model<StudentAttributes, StudentCreationAttributes>
  implements StudentAttributes
{
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public isPresent!: boolean;
  public studentClassId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly photo?: Photo;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPresent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    studentClassId: {
      type: DataTypes.UUID,
      references: {
        model: StudentClass,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Student",
  },
);

User.hasOne(Photo, {
  foreignKey: "userId",
  as: "photo",
});
Photo.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});
StudentClass.hasMany(User, {
  foreignKey: "studentClassId",
  as: "users",
});
User.belongsTo(StudentClass, { foreignKey: "studentClassId", as: "class" });

export default User;
