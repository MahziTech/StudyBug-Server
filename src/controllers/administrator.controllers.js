import AdministratorDatabase from "../models/administrator.models.js";
import bcrypt from "bcrypt"
import InstitutionDatabase from "../models/institution.models.js";

//todo: DO EDITADMINISTRATOR, PASSWORD, PICTURE
//todo: DO DELETE and signout ADMINISTRATOR

export const createAdministrator = async(req, res) => {
    try {
        const { firstName, lastName, email, password, institutionId } = req.body

        const institution = await InstitutionDatabase.findById(institutionId)
        if(!institution) {
            return res.status(404).json({ ok: false, error: "The institution could not be found" })
        }

        const existingAdministrator = await AdministratorDatabase.findOne({ email: email })

        if(existingAdministrator) {
            return res.status(409).json({ ok: false, error: "An account already exists with this email." })
        }

        let passwordHash
        const salt = await bcrypt.genSalt()
        passwordHash = await bcrypt.hash(password, salt)

        const newAdministrator = new AdministratorDatabase({
            firstName,
            lastName,
            email,
            password: passwordHash,
            institution: institutionId,
        })

        const savedAdministrator = await newAdministrator.save()
        if(savedAdministrator) {
            const { password, ...administratorWithoutPassword } = savedAdministrator.toObject();
            return res.status(200).json({ ok: true, body: administratorWithoutPassword });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const loginAdministrator = async(req, res) => {
    try {
        const { email, password } = req.body

        const administrator = await AdministratorDatabase.findOne({ email })
        if(!administrator) {
            return res.status(404).json({ ok: false, error: "No account exists with that email" })
        }

        const isMatch = await bcrypt.compare(password, administrator.password)
        if(!isMatch) return res.status(400).json({ ok: false, error: "Invalid password" })

        if(isMatch) {
            const { password, ...administratorWithoutPassword } = administrator.toObject();
            return res.status(200).json({ ok: true, body: administratorWithoutPassword });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const getAdministrator = async(req, res) => {
    try {
        const { id } = req.params

        const administrator = await AdministratorDatabase.findById(id)
        if(administrator) {
            const { password, ...administratorWithoutPassword } = administrator.toObject();
            return res.status(200).json({ ok: true, body: administratorWithoutPassword });
        }

        return res.status(404).json({ ok: false, error: "administrator not found" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const editAdministratorMainDetails = async(req, res) => {
    try {
        const { id, updates } = req.body
        const allowedFields = ["firstName", "lastName", "telephone"]
        const administrator = await AdministratorDatabase.findById(id)

        if(!administrator) {
            return res.status(404).json({ ok: false, "error": "The administrator could not be found" })
        }

        const unallowedField = updates.find(update => !allowedFields.includes(update.field))?.field

        if(unallowedField) {
            return res.status(403).json({ ok: false, error: `You can't change the ${unallowedField} field or this is the wrong way to do it.` })
        }
        updates.forEach(({ field, value }) => {
            administrator[field] = value
        })

        await administrator.save()

        const updatedAdministrator = await AdministratorDatabase.findById(id)
        return res.status(200).json({ ok: true, body: updatedAdministrator })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}