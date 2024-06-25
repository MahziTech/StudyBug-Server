import UserDatabase from "../models/user.models.js";
import bcrypt from "bcrypt"


//!DO EDITUSER INCLUDE INSTITUTUON

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