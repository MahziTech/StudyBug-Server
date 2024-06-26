import InstitutionDatabase from "../models/institution.models.js";
import UserDatabase from "../models/user.models.js";
import { getPagination } from "../services/query.services.js";
import { generateInstitutionCode } from "../services/utils.services.js";

//todo: create update profile pictute path controller

export const createInstitution = async(req, res) => {
    try {
        const { name, address, profilePicturePath, subscription } = req.body

        if(profilePicturePath) {
            //!handle picture file upload
        }

        const newInstitution = new InstitutionDatabase({
            name, 
            address, 
            profilePicturePath, 
            code: generateInstitutionCode(),
            subscription
        })

        const savedInstitution = await newInstitution.save()

        return res.status(201).json({ ok: true, body: savedInstitution })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const getInstitution = async(req, res) => {
    try {
        const { id } = req.params

        const institution = await InstitutionDatabase.findById(id)

        if(!institution) {
            return res.status(404).json({ ok: false, error: "Institution wasn't found" })
        }
        return res.status(200).json({ ok: true, body: institution })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const getAllInstitutions = async(req, res) => {
    try {
        const institutions = await InstitutionDatabase.find({})
        return res.status(200).json({ ok: true, body: institutions })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const editInstitutionMainDetails = async(req, res) => {
    try {
        const { id, updates } = req.body
        const institution = await InstitutionDatabase.findById(id)

        if(!institution) {
            return res.status(404).json({ ok: false, "error": "The institution could not be found" })
        }

        updates.forEach(({ field, value }) => {
            institution[field] = value
        })

        await institution.save()

        const updatedInstitution = await InstitutionDatabase.findById(id)
        return res.status(200).json({ ok: true, body: updatedInstitution })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const getAllInstitutionMembers = async(req, res) => {
    try {
        const { skip, limit, page } = getPagination(req.query)
        const { id } = req.params

        const institution = await InstitutionDatabase.findById(id)
        if(!institution) {
            return res.status(404).json({ ok: false, error: "Institution wasn't found" })
        }

        const institutionMembers = await UserDatabase.find({ institution: id }, { "__v": 0 })
        .sort({ "name": -1 })
        .skip(skip)
        .limit(limit)

        const totalResults = await UserDatabase.countDocuments({ institution: id })

        return res.status(200).json({
            ok: true,
            page,
            totalResults,
            body: institutionMembers,
            totalPages: Math.ceil(totalResults/limit)
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}