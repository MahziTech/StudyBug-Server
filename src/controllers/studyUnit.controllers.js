import StudyUnitDatabase from "../models/studyUnit.models.js";
import UserDatabase from "../models/user.models.js";
import { getPagination } from "../services/query.services.js";


export const createStudyUnit = async(req, res) => {
    try {
        const { name, userId } = req.body

        const existingStudyUnit = await StudyUnitDatabase.findOne({ name })
        if(existingStudyUnit) {
            return res.status(409).json({ ok: false, error: "You already have a study unit with that same name. try a different name :)" })
        }

        const user = await UserDatabase.findById(userId)

        if(!user) {
            return res.status(409).json({ ok: false, error: "The user could not be found" })
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
            return res.status(409).json({ ok: false, error: "The user could not be found" })
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

        return res.status(200).json({ ok: true, body: studyUnit }) //!MAKE SURE THIS WORKS AS OPPOSED TO FETCHING THE STUDYUNIT AGAIN AND RETURNING THAT
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const deleteStudyUnit = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedStudyUnit = await StudyUnitDatabase.findByIdAndDelete(id);

        if (!deletedStudyUnit) {
            return res.status(404).json({ ok: false, error: 'Study Unit not found' });
        }

        return res.status(200).json({ ok: true, body: deletedStudyUnit });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" });
    }
};