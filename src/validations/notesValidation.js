import { Joi, Segments } from "celebrate";
import { isValidObjectId } from 'mongoose';

// Кастомний валідатор для ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

// 1. GET /notes (Валідація QUERY params - рядок запиту)
export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag:Joi.string().valid(
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
  'Ideas',
  'Travel',
  'Finance',
  'Health',
  'Important',
  'Todo'),
    search: Joi.string().allow(''),
  }),
};

// 2. GET /notes/:noteId та DELETE /notes/:noteId
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

// 3. POST /notes
// Валідація тіла запиту (BODY)
export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow(''),
    tag:Joi.string().valid(
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
  'Ideas',
  'Travel',
  'Finance',
  'Health',
  'Important',
  'Todo'),
  }),
};

// 4. PATCH /notes/:noteId
export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().allow(''),
    tag:Joi.string().valid(
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
  'Ideas',
  'Travel',
  'Finance',
  'Health',
  'Important',
  'Todo'),
  }).min(1),
};
