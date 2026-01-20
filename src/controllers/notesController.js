import{ Note } from "../models/note.js";
import createHttpError from 'http-errors';
export const getAllNotes = async(req,res) =>{
    res.status(200).json({"message": "All notes have been retrieved"});
};

export const getNoteById = async (req,res)=>{
  const {noteId} = req.params;
    res.status(200).json({"message": `Retrieved note with ID: ${noteId}`});
};

export const createNote = async (req,res)=>{
         const note = await Note.create(req.body);
        res.status(201).json(note);
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
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate({ id: noteId }, req.body, { new: true });
  if (!note) {
    next(createHttpError(404, "Note not found"));
    return;
  }
  res.status(200).json({note});
};
