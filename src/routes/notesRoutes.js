import { Router } from "express";
import { getAllNotes,getNoteById } from "../controllers/notesController.js";
import { createNote,deleteNote, updateNote} from "../controllers/notesController.js";
import { celebrate } from "celebrate";
import { updateNoteSchema,noteIdSchema,getAllNotesSchema,createNoteSchema} from "../validations/notesValidation.js";
const router = Router();

router.get("/notes",celebrate(getAllNotesSchema),getAllNotes, );
router.get("/notes/:noteId",celebrate(noteIdSchema),getNoteById);
router.post("/notes",celebrate(createNoteSchema),createNote);
router.delete("/notes/:noteId",celebrate(noteIdSchema),deleteNote);
router.patch("/notes/:noteId",celebrate(updateNoteSchema),updateNote);

export default router;
