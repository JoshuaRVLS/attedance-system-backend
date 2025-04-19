import { Request, Response } from "express";
import Student from "../models/student.model";
import Photo from "../models/photo.model";
import { io, log } from "..";
import StudentClass from "../models/class.model";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await Student.findAll({
    include: [
      {
        attributes: ["id", "data", "mimetype"],
        association: "photo",
        model: Photo,
      },
      { association: "class", model: StudentClass },
    ],
  });
  log.log(`New Request to GET ALL STUDENTS`);
  res.status(200).json(users);
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user =
    (await Student.findByPk(id, {
      include: [
        {
          attributes: ["id", "data", "mimetype"],
          association: "photo",
          model: Photo,
        },
        { association: "class", model: StudentClass },
      ],
    })) || "User ID Not Found";
  log.log(`New Request to GET STUDENT with ID: ${id}`);
  res.status(200).json(user);
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { firstName, lastName, studentClassId } = req.body;

  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const studentClass = await StudentClass.findByPk(studentClassId);

  if (!studentClass) {
    res.status(404).json({ error: "Student Class not found" });
    return;
  }

  const student = await Student.create({
    firstName,
    lastName,
    studentClassId: studentClass.id,
  });

  const photo = await Photo.create({
    data: Buffer.from(req.file.buffer),
    mimetype: req.file.mimetype,
    userId: student.id,
  });

  log.log(`Student added with ID: ${student.id}`);
  res.status(201).json(student.toJSON());
  io.emit("newStudent");
};

export async function updateUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const student = await Student.update(
    {
      isPresent: true,
    },
    {
      where: {
        id,
      },
    }
  );
  log.log(`Student Updated with id: ${id}`);
  res.status(204).json({ ...student, status: "success" });
  io.emit("newPresentStudent", id);
}
export async function getPhotoById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const photo = await Photo.findOne({
    where: {
      $userId$: id,
    },
  });
  log.log("Get photo by id: " + id);
  res.status(200).json(photo);
}
