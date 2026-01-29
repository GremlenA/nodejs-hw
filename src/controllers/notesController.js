import { Note } from "../models/note.js";
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {

  const {page=1,perPage=5,tag,search}= req.query;
    const skip = (page-1)*perPage;
    const notesQuery = Note.find();
if (tag) {
      notesQuery.where('tag').equals(tag);
    }


    if (search) {
      notesQuery.where({ $text: { $search: search } });
    }


  try {
    const [totalItems,notes] = await Promise.all([
      notesQuery.clone().countDocuments(),
      notesQuery.skip(skip).limit(perPage),
    ]);
    const totalPage = Math.ceil(totalItems / perPage);


    res.status(200).json({
     totalItems,
      totalPage,
      perPage,
      page,
      notes,
     status: 200,
      message: "Successfully found notes",
      data: notes

    });
  } catch (error) {
    next(error);
  }
};


export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found note with id ${noteId}`,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};


export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);

    res.status(201).json({
      status: 201,
      message: "Successfully created a note",
      data: note,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    res.status(200).json({
      status: 200,
      message: "Successfully deleted a note",
      data: note,
    });
  } catch (error) {
    next(error);
  }
};


export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;


    const note = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!note) {
      throw createHttpError(404, "Note not found");
    }


    res.status(200).json({
      status: 200,
      message: "Successfully updated a note",
      data: note,
    });
  } catch (error) {
    next(error);
  }
};
