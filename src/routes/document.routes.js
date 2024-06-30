import express from "express"
import {
    changeDocumentName,
    createDocument,
    deleteDocument,
    getDocumentById,
    getUserDocuments,
    moveDocumentToStudyUnit
} from "../controllers/document.controllers.js"


const DocumentsRouter = express.Router()


DocumentsRouter.post("/create", createDocument)
DocumentsRouter.get("/id/:id", getDocumentById)
DocumentsRouter.get("/user/:userId", getUserDocuments)
DocumentsRouter.post("/edit/name", changeDocumentName)
DocumentsRouter.post("/edit/studyunit", moveDocumentToStudyUnit)
DocumentsRouter.delete("/delete/:id", deleteDocument)


export default DocumentsRouter