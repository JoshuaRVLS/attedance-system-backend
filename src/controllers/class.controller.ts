import { Request, Response } from "express";
import StudentClass from "../models/class.model";

export const getClasses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const classes = await StudentClass.findAll();
  res.status(200).json(classes);
};

export const getClass = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const students = await StudentClass.findByPk(id, {
    include: {
      include: ["photo", "class"],
      association: "users",
    },
  });
  res.status(200).json(students);
};
