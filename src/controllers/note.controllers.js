import NoteDatabase from "../models/note.models.js";
import StudyUnitDatabase from "../models/studyUnit.models.js";
import UserDatabase from "../models/user.models.js";
import { getPagination } from "../services/query.services.js";


export const createNote = async(req, res) => {
    try {
        const { name, userId, content, studyUnitId } = req.body

        const existingNote = await NoteDatabase.findOne({ name })
        if(existingNote) {
            return res.status(409).json({ ok: false, error: "You already have a note with that same name. try a different name :)" })
        }

        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "The user could not be found" })
        }

        if(studyUnitId) {
            const studyUnit = await StudyUnitDatabase.findOne({ _id: studyUnitId, user: userId })
            if(!studyUnit) {
                return res.status(404).json({ ok: false, error: "The study unit could not be found" })
            }
        }

        const newNote = new NoteDatabase({
            name,
            user: userId,
            content,
            studyUnit: studyUnitId || null
        })

        const savedNote = await newNote.save()

        return res.status(201).json({ ok: true, body: savedNote })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const getNoteById = async(req, res) => {
    try {
        const { id } = req.params
        const note = await NoteDatabase.findById(id)

        if(note) {
            return res.status(200).json({ ok: true, body: note })
        }

        return res.status(404).json({ ok: false, error: "Note could not be found" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const getUserNotes = async(req, res) => {
    try {
        const { skip, limit, page } = getPagination(req.query)
        const { userId } = req.params

        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "The user could not be found" })
        }

        const notes = await NoteDatabase.find({ user: userId }, { __v: 0 })
        .skip(skip)
        .limit(limit)

        const totalResults = await NoteDatabase.countDocuments({ user: userId })

        return res.status(200).json({
            ok: true,
            page,
            totalResults,
            body: notes,
            totalPages: Math.ceil(totalResults/limit)
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const changeNoteName = async(req, res) => {
    try {
        const { id, newName } = req.body
        const note = await NoteDatabase.findById(id)

        if(!note) {
            return res.status(404).json({ ok: false, error: "Note could not be found" })
        }

        const existingNote = await NoteDatabase.findOne({ name: newName })
        if(existingNote) {
            return res.status(409).json({ ok: false, error: "You already have a note with that same name. try a different name :)" })
        }

        note.name = newName
        await note.save()

        return res.status(200).json({ ok: true, body: note })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const updateNoteContent = async(req, res) => {
    try {
        const { id, updatedContent } = req.body
        const note = await NoteDatabase.findById(id)

        if(!note) {
            return res.status(404).json({ ok: false, error: "Note could not be found" })
        }

        note.content = updatedContent
        await note.save()

        return res.status(200).json({ ok: true, body: note })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const moveNoteToStudyUnit = async(req, res) => {
    try {
        const { userId, noteId, studyUnitId } = req.body

        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "The user could not be found" })
        }

        const note = await NoteDatabase.findById(noteId)
        if(!note) {
            return res.status(404).json({ ok: false, error: "Note could not be found" })
        }

        if(studyUnitId) {
            const studyUnit = await StudyUnitDatabase.findOne({ _id: studyUnitId, user: userId })
            if(!studyUnit) {
                return res.status(404).json({ ok: false, error: "The study unit could not be found" })
            }
        }

        note.studyUnit = studyUnitId
        const updatedNote = await note.save()

        return res.status(200).json({ ok: true, body: updatedNote })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const deleteNote = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedNote = await NoteDatabase.findByIdAndDelete(id);

        if (!deletedNote) {
            return res.status(404).json({ ok: false, error: 'Note not found' });
        }

        return res.status(200).json({ ok: true, body: deletedNote });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" });
    }
}