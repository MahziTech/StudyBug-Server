import express from "express"
import {
    changeNoteName,
    createNote,
    deleteNote,
    getNoteById,
    getUserNotes,
    moveNoteToStudyUnit,
    updateNoteContent,

} from "../controllers/note.controllers.js"


const NotesRouter = express.Router()


NotesRouter.post("/create", createNote)
NotesRouter.get("/id/:id", getNoteById)
NotesRouter.get("/user/all", getUserNotes)
NotesRouter.post("/edit/name", changeNoteName)
NotesRouter.post("/edit/content", updateNoteContent)
NotesRouter.post("/edit/studyunit", moveNoteToStudyUnit)
NotesRouter.delete("/delete/:id", deleteNote)


export default NotesRouter