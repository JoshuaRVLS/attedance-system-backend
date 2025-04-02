import { Request, Response } from "express";
import StudentClass from "../models/class.model";
import { log } from "..";

export const getClasses = async (
  req: Request,
  res: Response
): Promise<void> => {
  log.log("New Request to GET ALL CLASSES");
  const classes = await StudentClass.findAll();
  res.status(200).json(classes);
};

export const getClass = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { withStudents } = req.query;

  if (withStudents === "true") {
    const students = await StudentClass.findByPk(id, {
      include: {
        include: ["photo", "class"],
        association: "users",
      },
    });
    res.status(200).json(students);
  } else {
    const students = await StudentClass.findByPk(id);
    res.status(200).json(students);
  }

  log.log(`New Request to GET CLASS with ID: ${id}`);
};
