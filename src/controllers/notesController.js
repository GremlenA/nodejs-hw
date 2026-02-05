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

      const notesQuery = Note.find({userId: req.user._id});
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
  const note = await Note.findById({_id: noteId, userId: req.user._id});

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
      userId: req.user._id,
    });


  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
   const note = await Note.findByIdAndDelete({_id: noteId, userId: req.user._id});

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
     const note = await Note.findOneAndUpdate(
    // Критерій пошуку по userId
    { _id: noteId, userId: req.user._id },
    req.body,
    { new: true }
  );

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
