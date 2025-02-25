import { Request, Response } from "express";
import Student from "../models/student.model";
import Photo from "../models/photo.model";
import { io } from "..";
import StudentClass from "../models/class.model";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    const users = await Student.findAll({include: [
        {attributes: ['id', 'data', 'mimetype'], association: 'photo', model: Photo},
        {association: 'class', model: StudentClass}
    ]});
    console.log(users);
    res.status(200).json(users);
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await Student.findByPk(id, {include: [
        {attributes: ['id', 'data', 'mimetype'], association: 'photo', model: Photo},
        {association: 'class', model: StudentClass}
    ]}) || 'User ID Not Found';
    res.status(200).json(user);
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, studentClassId } = req.body;

    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    const studentClass = await StudentClass.findByPk(studentClassId);

    if (!studentClass) {
        res.status(404).json({ error: 'Student Class not found' });
        return;
    }

    const student = await Student.create({
        firstName,
        lastName,
        studentClassId: studentClass.id
    })

    const photo = await Photo.create({
        data: Buffer.from(req.file.buffer),
        mimetype: req.file.mimetype,
        userId: student.id
    })

    console.log(req.body);
    res.status(201).json(student.toJSON());
    io.emit('newStudent');
}

export async function updateUser(req: Request, res: Response): Promise<void> {
    const { id: userId } = req.params;
    const student = await Student.update({
        isPresent: true
    }, {
        where: {
            id: userId 
        }
    });
    res.status(204).json({...student, status: 'success'});
    io.emit('newPresentStudent', userId);
}