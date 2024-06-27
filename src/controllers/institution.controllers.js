import InstitutionDatabase from "../models/institution.models.js";
import AdministratorDatabase from "../models/administrator.models.js";
import UserDatabase from "../models/user.models.js";
import { getPagination } from "../services/query.services.js";
import { generateInstitutionCode } from "../services/utils.services.js";
import bcrypt from "bcrypt"


//todo: create update profile pictute path controller

export const createInstitution = async(req, res) => {
    try {
        const { name, address, profilePicturePath, subscription, email, password } = req.body

        if(profilePicturePath) {
            //!handle picture file upload
        }

        const existingInstitution = await InstitutionDatabase.findOne({ email: email })

        if(existingInstitution) {
            return res.status(409).json({ ok: false, error: "An institution already exists with this email." })
        }

        let passwordHash
        const salt = await bcrypt.genSalt()
        passwordHash = await bcrypt.hash(password, salt)

        const newInstitution = new InstitutionDatabase({
            name, 
            address, 
            profilePicturePath, 
            code: generateInstitutionCode(),
            subscription,
            email,
            password: passwordHash
        })

        const savedInstitution = await newInstitution.save()

        if(savedInstitution) {
            const { password, ...institutionWithoutPassword } = savedInstitution.toObject();
            return res.status(200).json({ ok: true, body: institutionWithoutPassword });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const loginToInstitution = async(req, res) => {
    try {
        const { email, password } = req.body

        const institution = await InstitutionDatabase.findOne({ email })
        if(!institution) {
            return res.status(404).json({ ok: false, error: "No institution exists with that email" })
        }

        const isMatch = await bcrypt.compare(password, institution.password)
        if(!isMatch) return res.status(400).json({ ok: false, error: "Invalid password" })

        if(isMatch) {
            const { password, ...institutionWithoutPassword } = institution.toObject();
            return res.status(200).json({ ok: true, body: institutionWithoutPassword });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const getInstitution = async(req, res) => {
    try {
        const { id } = req.params

        const institution = await InstitutionDatabase.findById(id, { password: 0 })

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

export const getAllInstitutionAdministrators = async(req, res) => {
    try {
        const { skip, limit, page } = getPagination(req.query)
        const { id } = req.params

        const institution = await InstitutionDatabase.findById(id)
        if(!institution) {
            return res.status(404).json({ ok: false, error: "Institution wasn't found" })
        }

        const institutionMembers = await AdministratorDatabase.find({ institution: id }, { "__v": 0 })
        .skip(skip)
        .limit(limit)

        const totalResults = await AdministratorDatabase.countDocuments({ institution: id })

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

