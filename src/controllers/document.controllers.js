import DocumentDatabase from "../models/document.models.js";
import StudyUnitDatabase from "../models/studyUnit.models.js";
import UserDatabase from "../models/user.models.js";
import { getPagination } from "../services/query.services.js";

//todo: handle file upload, rename and deletion

export const createDocument = async(req, res) => {
    try {
        const { name, userId, studyUnitId } = req.body

        const existingDocument = await DocumentDatabase.findOne({ name })
        if(existingDocument) {
            return res.status(404).json({ ok: false, error: "You already have a document with that same name. try a different name :)" })
        }

        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "The user could not be found" })
        }

        if(studyUnitId) {
            const studyUnit = await StudyUnitDatabase.findById(studyUnitId)
            if(!studyUnit) {
                return res.status(404).json({ ok: false, error: "The study unit could not be found" })
            }
        }

        const newDocument = new DocumentDatabase({
            name,
            user: userId,
            fileType: "microsoft docx", // dont know if this and potentially more file info will be gotten from client or here
            studyUnit: studyUnitId || null
        })

        const savedDocument = await newDocument.save()

        return res.status(201).json({ ok: true, body: savedDocument })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const getDocumentById = async(req, res) => {
    try {
        const { id } = req.params
        const document = await DocumentDatabase.findById(id)

        if(document) {
            return res.status(200).json({ ok: true, body: document })
        }

        return res.status(404).json({ ok: false, error: "Document could not be found" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const getUserDocuments = async(req, res) => {
    try {
        const { skip, limit, page } = getPagination(req.query)
        const { userId } = req.params

        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "The user could not be found" })
        }

        const documents = await DocumentDatabase.find({ user: userId }, { __v: 0 })
        .skip(skip)
        .limit(limit)

        const totalResults = await DocumentDatabase.countDocuments({ user: userId })

        return res.status(200).json({
            ok: true,
            page,
            totalResults,
            body: documents,
            totalPages: Math.ceil(totalResults/limit)
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const changeDocumentName = async(req, res) => { // more complicated than this. name field will be displayed to client. keep original file name or rename by Id for flexible filePath
    try {
        const { id, newName } = req.body
        const document = await DocumentDatabase.findById(id)

        if(!document) {
            return res.status(404).json({ ok: false, error: "Document could not be found" })
        }

        const existingDocument = await DocumentDatabase.findOne({ name: newName })
        if(existingDocument) {
            return res.status(409).json({ ok: false, error: "You already have a document with that same name. try a different name :)" })
        }

        document.name = newName
        await document.save()

        return res.status(200).json({ ok: true, body: document })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const moveDocumentToStudyUnit = async(req, res) => {
    try {
        const { userId, documentId, studyUnitId } = req.body

        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "The user could not be found" })
        }
        
        const document = await DocumentDatabase.findById(documentId)
        if(!document) {
            return res.status(404).json({ ok: false, error: "Document could not be found" })
        }

        if(studyUnitId) {
            const studyUnit = await StudyUnitDatabase.findOne({ _id: studyUnitId, user: userId })
            if(!studyUnit) {
                return res.status(404).json({ ok: false, error: "The study unit could not be found" })
            }
        }

        document.studyUnit = studyUnitId
        const updatedDocument = await document.save()

        return res.status(200).json({ ok: true, body: updatedDocument })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const deleteDocument = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDocument = await DocumentDatabase.findByIdAndDelete(id);

        if (!deletedDocument) {
            return res.status(404).json({ ok: false, error: 'Document not found' });
        }

        return res.status(200).json({ ok: true, body: deletedDocument });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" });
    }
}