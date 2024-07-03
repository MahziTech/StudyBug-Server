import mongoose from "mongoose";
import StudyUnitDatabase from "../models/studyUnit.models.js";
import UserDatabase from "../models/user.models.js";
import FlashcardSetDatabase from "../models/flashcardSet.models.js";
import DocumentDatabase from "../models/document.models.js";
import NoteDatabase from "../models/note.models.js";
import { getPagination } from "../services/query.services.js";


//todo: create picturepath upload and change
//todo: get all studyunit resources
//todo: search and get all resources

export const createStudyUnit = async(req, res) => {
    try {
        const { name, userId } = req.body

        const existingStudyUnit = await StudyUnitDatabase.findOne({ name })
        if(existingStudyUnit) {
            return res.status(409).json({ ok: false, error: "You already have a study unit with that same name. try a different name :)" })
        }

        const user = await UserDatabase.findById(userId)

        if(!user) {
            return res.status(404).json({ ok: false, error: "The user could not be found" })
        }

        const newStudyUnit = new StudyUnitDatabase({
            name,
            user: userId
        })

        const savedStudyUnit = await newStudyUnit.save()

        return res.status(201).json({ ok: true, body: savedStudyUnit })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const getStudyUnitById = async(req, res) => {
    try {
        const { id } = req.params
        console.log(id)
        const studyUnit = await StudyUnitDatabase.findById(id)

        if(studyUnit) {
            return res.status(200).json({ ok: true, body: studyUnit })
        }

        return res.status(404).json({ ok: false, error: "Study unit could not be found" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const getUserStudyUnits = async(req, res) => {
    try {
        const { skip, limit, page } = getPagination(req.query)
        const { userId } = req.params

        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "The user could not be found" })
        }

        const studyUnits = await StudyUnitDatabase.find({ user: userId }, { __v: 0 })
        .skip(skip)
        .limit(limit)

        const totalResults = await StudyUnitDatabase.countDocuments({ user: userId })

        return res.status(200).json({
            ok: true,
            page,
            totalResults,
            body: studyUnits,
            totalPages: Math.ceil(totalResults/limit)
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const changeStudyUnitName = async(req, res) => {
    try {
        const { id, newName } = req.body
        const studyUnit = await StudyUnitDatabase.findById(id)

        if(!studyUnit) {
            return res.status(404).json({ ok: false, error: "Study unit could not be found" })
        }

        const existingStudyUnit = await StudyUnitDatabase.findOne({ name: newName })
        if(existingStudyUnit) {
            return res.status(409).json({ ok: false, error: "You already have a study unit with that same name. try a different name :)" })
        }

        studyUnit.name = newName
        await studyUnit.save()

        return res.status(200).json({ ok: true, body: studyUnit })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const deleteStudyUnit = async (req, res) => {
    const { id } = req.params

    try {
        const deletedStudyUnit = await StudyUnitDatabase.findByIdAndDelete(id)

        if (!deletedStudyUnit) {
            return res.status(404).json({ ok: false, error: 'Study Unit not found' })
        }

        return res.status(200).json({ ok: true, body: deletedStudyUnit })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const SearchGetAndFilterStudyResources = async(req, res) => {
    try {
        const {
            userId,
            studyUnitId,
            searchQuery,
            resourceType,
            minDate,
            maxDate,
            sortByDate // 1 || -1 or default which is the name
        } = req.body

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

        const matchStage = { $match: { user: mongoose.Types.ObjectId(userId) } }
        if (studyUnitId) {
            matchStage.$match.studyUnit = mongoose.Types.ObjectId(studyUnitId)
        }
        if (searchQuery) {
            matchStage.$match.name = { $regex: searchQuery, $options: 'i' }
        }
        if (minDate || maxDate) {
            matchStage.$match.createdAt = {}
            if (minDate) {
                matchStage.$match.createdAt.$gte = new Date(minDate)
            }
            if (maxDate) {
                matchStage.$match.createdAt.$lte = new Date(maxDate)
            }
        }

        // Sort options
        let sortStage = { $sort: {} }
        if (sortByDate) {
            sortStage.$sort["createdAt"] = sortByDate
        } else {
            sortStage.$sort = { name: 1 }
        }

        // Add resourceType field stage
        const addFieldsStageFlashcards = { $addFields: { resourceType: "flashcards" } }
        const addFieldsStageNotes = { $addFields: { resourceType: "notes" } }
        const addFieldsStageDocuments = { $addFields: { resourceType: "documents" } }

        const pipelineFlashcards = [matchStage, addFieldsStageFlashcards, sortStage]
        const pipelineNotes = [matchStage, addFieldsStageNotes, sortStage]
        const pipelineDocuments = [matchStage, addFieldsStageDocuments, sortStage]

        // Fetch resources based on the resourceType
        let results = []
        if (!resourceType || resourceType === 'all') {
            const flashcards = await FlashcardSetDatabase.aggregate(pipelineFlashcards)
            const notes = await NoteDatabase.aggregate(pipelineNotes)
            const documents = await DocumentDatabase.aggregate(pipelineDocuments)
            results = [...flashcards, ...notes, ...documents]
        } else {
            if (resourceType === 'flashcards') {
                results = await FlashcardSetDatabase.aggregate(pipelineFlashcards)
            } else if (resourceType === 'notes') {
                results = await NoteDatabase.aggregate(pipelineNotes)
            } else if (resourceType === 'documents') {
                results = await DocumentDatabase.aggregate(pipelineDocuments)
            } else {
                return res.status(400).json({ ok: false, error: "Invalid resourceType" })
            }
        }

        // Send the results
        res.status(200).json(results)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}