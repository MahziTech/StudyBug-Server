import InstitutionDatabase from "../models/institution.models.js";
import UserDatabase from "../models/user.models.js";
import bcrypt from "bcrypt"


//todo: DO EDITUSER SUBSCRIPTION, PASSWORD, PICTURE
//todo: DO DELETE and signout USER

export const createUser = async(req, res) => {
    try {
        const { email, password, oauthProvider } = req.body

        const existingUser = await UserDatabase.findOne({ email: email })

        if(existingUser) {
            return res.status(409).json({ ok: false, error: "An account already exists with this email." })
        }

        let passwordHash
        if(!oauthProvider) {
            const salt = await bcrypt.genSalt()
            passwordHash = await bcrypt.hash(password, salt)
        }

        const newUser = new UserDatabase({
            email,
            password: passwordHash,
            oauthProvider
        })

        const savedUser = await newUser.save()
        if(savedUser) {
            const { password, ...userWithoutPassword } = savedUser.toObject();
            return res.status(200).json({ ok: true, body: userWithoutPassword });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body

        const user = await UserDatabase.findOne({ email })
        if(!user) {
            return res.status(404).json({ ok: false, error: "No account exists with that email" })
        }

        if(user.oauthProvider) {
            const { password, ...userWithoutPassword } = user.toObject();
            return res.status(200).json({ ok: true, body: userWithoutPassword });
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({ ok: false, error: "Invalid password" })

        if(isMatch) {
            const { password, ...userWithoutPassword } = user.toObject();
            return res.status(200).json({ ok: true, body: userWithoutPassword });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const getUser = async(req, res) => {
    try {
        const { id } = req.params

        const user = await UserDatabase.findById(id)
        if(user) {
            const { password, ...userWithoutPassword } = user.toObject();
            return res.status(200).json({ ok: true, body: userWithoutPassword });
        }

        return res.status(404).json({ ok: false, error: "user not found" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const editUserMainDetails = async(req, res) => {
    try {
        const { id, updates } = req.body
        const allowedFields = ["firstName", "lastName", "telephone"]
        const user = await UserDatabase.findById(id)

        if(!user) {
            return res.status(404).json({ ok: false, "error": "The user could not be found" })
        }

        const unallowedField = updates.find(update => !allowedFields.includes(update.field))?.field

        if(unallowedField) {
            return res.status(403).json({ ok: false, error: `You can't change the ${unallowedField} field or this is the wrong way to do it.` })
        }
        updates.forEach(({ field, value }) => {
            user[field] = value
        })

        await user.save()

        const updatedUser = await UserDatabase.findById(id)
        return res.status(200).json({ ok: true, body: updatedUser })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const addUserToInstitution = async(req, res) => {
    try {
        const { userId, institutionId, code } = req.body

        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "user not found" })
        }

        if(user.institution) {
            return res.status(400).json({ ok: false, error: "You are already part of an institution. If you wish to change institutions, exit out of your current one and join a new one" })
        }

        const institution = await InstitutionDatabase.findById(institutionId)
        if(!institution) {
            return res.status(404).json({ ok: false, error: "institution not found" })
        }

        if(code !== institution.code) {
            return res.status(400).json({ ok: false, error: "Invalid code" })
        } else {
            user.institution = institutionId
            await user.save()
            return res.status(201).json({ ok: true, message: "You were successfully added to "+institution.name })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const removeUserFromInstitution = async(req, res) => {
    try {
        const { userId } = req.params

        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "user not found" })
        }

        if(!user.institution) {
            return res.status(400).json({ ok: false, error: "You are not part of an institution" })
        }

        user.institution = null
        await user.save()
        return res.status(201).json({ ok: true, message: "You were successfully removed from the institution" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}