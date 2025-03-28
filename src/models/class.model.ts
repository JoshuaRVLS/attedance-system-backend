import { Model, Optional, DataTypes } from "sequelize";
import User from "./student.model";
import { sequelize } from "../config/database";

interface ClassAttributes {
  id: string;
  value: string;
}

interface ClassAttributesCration extends Optional<ClassAttributes, "id"> {}

class StudentClass
  extends Model<ClassAttributes, ClassAttributesCration>
  implements ClassAttributes
{
  public id!: string;
  public value!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly students?: User[];
}

StudentClass.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Class",
  },
);

export default StudentClass;
