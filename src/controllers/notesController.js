import { Note } from "../models/note.js";
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    // Створюємо запит
    const notesQuery = Note.find();

    // Фільтрація по тегу
    if (tag) {
      notesQuery.where('tag').equals(tag);
    }

    // Пошук по тексту
    if (search) {
      notesQuery.where({ $text: { $search: search } });
    }

    // Пагінація
    const limit = Number(perPage);
    const pageNumber = Number(page);
    const skip = (pageNumber - 1) * limit;

    const [totalNotes, notes] = await Promise.all([
      notesQuery.clone().countDocuments(),
      notesQuery.skip(skip).limit(limit),
    ]);

    const totalPages = Math.ceil(totalNotes / limit);


    res.status(200).json({
      notes,
      totalNotes,
      totalPages,
      page: pageNumber,
      perPage: limit,
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
      data: note,
    });
  } catch (error) {
    next(error);
  }
};
