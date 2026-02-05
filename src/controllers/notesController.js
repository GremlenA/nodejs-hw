import { Note } from "../models/note.js";
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { page = 1, perPage = 10, tag, search } = req.query;

    const notesQuery = Note.find({ userId });

    if (tag) {
      notesQuery.where('tag').equals(tag);
    }

    if (search) {
      notesQuery.where({ $text: { $search: search } });
    }

    const limit = Number(perPage);
    const pageNumber = Number(page);
    const skip = (pageNumber - 1) * limit;

    const [totalNotes, notes] = await Promise.all([
      notesQuery.clone().countDocuments(),
      notesQuery.skip(skip).limit(limit),
    ]);

    const totalPages = Math.ceil(totalNotes / limit);

    res.status(200).json({
      status: 200,
      message: "Successfully found notes",
      data: {
        notes,
        totalNotes,
        totalPages,
        page: pageNumber,
        perPage: limit,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { _id: userId } = req.user;

    const note = await Note.findOne({ _id: noteId, userId });

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
    const { _id: userId } = req.user;

    const note = await Note.create({
      ...req.body,
      userId,
    });

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
    const { _id: userId } = req.user;

    const note = await Note.findOneAndDelete({ _id: noteId, userId });

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
    const { _id: userId } = req.user;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      req.body,
      { new: true, runValidators: true }
    );

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
