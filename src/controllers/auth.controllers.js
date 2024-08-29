import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import UserDatabase from "../models/user.models.js";
import bcrypt from "bcrypt"
import { generateUserAccessToken, generateUserRefreshToken, isValidEmail } from "../utils/auth.utils.js";
dotenv.config()

const raw = parseInt(process.env.REFRESH_TOKEN_EXPIRY.slice(0, -1))
const rtknExpiry = new Date(Date.now() + (raw * 60 * 1000))
const REFRESH_TOKEN_CONSTANTS = {
    secret: process.env.REFRESH_TOKEN_SECRET,
    cookie: {
        name: "rTkn",
        options: {
            sameSite: "None",
            secure: true,
            httpOnly: false,
            expires: rtknExpiry
        }
    }
}

// when creating google  signup, don't allow users with google signin register with mail and password and vice versa

export const createUserDefault = async(req, res) => {
    try {
        const { email, password } = req.body

        if(!isValidEmail(email) || password.length < 1) { //!CHANGE BACK TO 8CHARS IN PRODUCTION
            return res.status(400).json({ ok: false, error: "unacceptable credentials" })
        }
        const existingUser = await UserDatabase.findOne({ email: email })

        if(existingUser) {
            return res.status(409).json({ ok: false, error: "An account already exists with this email." })
        }

            const salt = await bcrypt.genSalt()
            const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new UserDatabase({
            email,
            password: passwordHash,
        })

        const savedUser = await newUser.save()
        if(savedUser) {
            const accessToken = generateUserAccessToken(savedUser._id, savedUser.email)
            const { refreshToken, refreshTokenHash } = await generateUserRefreshToken(savedUser._id)

            savedUser.tokens.push({ token: refreshTokenHash })
            await savedUser.save()
            const { password, tokens, resetPasswordTokenExpiry, resetPasswordToken, ...userWithoutPassword } = savedUser.toObject();
            res.cookie(
                REFRESH_TOKEN_CONSTANTS.cookie.name,
                refreshToken,
                REFRESH_TOKEN_CONSTANTS.cookie.options
            )
            return res.status(200).json({ ok: true, accessToken, body: userWithoutPassword });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const loginUserDefault = async(req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserDatabase.findOne({ email })
        if(!user) {
            return res.status(404).json({ ok: false, error: "Invalid Email or Password" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({ ok: false, error: "Invalid Email or Password" })

        if(isMatch) {
            const accessToken = generateUserAccessToken(user._id, user.email)
            const { refreshToken, refreshTokenHash } = await generateUserRefreshToken(user._id)

            user.tokens.push({ token: refreshTokenHash })
            await user.save()

            const { password, tokens, resetPasswordTokenExpiry, resetPasswordToken, ...userWithoutPassword } = user.toObject();

            res.cookie(
                REFRESH_TOKEN_CONSTANTS.cookie.name,
                refreshToken,
                REFRESH_TOKEN_CONSTANTS.cookie.options
            )
            return res.status(200).json({ ok: true, accessToken, body: userWithoutPassword });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

//!test if the accesstoken is still valid after logout since we didnot destrouy it
export const logout = async(req, res) => {
    try {
        const userId = req.body.userId
        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(400).json({ ok: false, error: "user not found. you are not authenticated" })
        }
        const cookies = req.cookies
        const refreshToken = cookies[REFRESH_TOKEN_CONSTANTS.cookie.name]

        const rTknHash = crypto
            .createHmac("sha256", REFRESH_TOKEN_CONSTANTS.secret)
            .update(refreshToken)
            .digest("hex")

        user.tokens = user.tokens.filter(tokenObj => tokenObj.token !== rTknHash)
        await user.save()

        const expireCookieOptions = Object.assign(
            {},
            REFRESH_TOKEN_CONSTANTS.cookie.options,
            { expires: new Date(1) }
        )

        res.cookie(REFRESH_TOKEN_CONSTANTS.cookie.name, "", expireCookieOptions)
        return res.status(205).json({ ok: true, message: "user logged out successfully" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const logoutAllDevices = async(req, res) => {
    try {
        const userId = req.decodedUserId
        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(400).json({ ok: false, error: "user not found. you are not authenticated" })
        }
        user.tokens = undefined
        await user.save()

        const expireCookieOptions = Object.assign(
            {},
            REFRESH_TOKEN_CONSTANTS.cookie.options,
            { expires: new Date(1) }
        )

        res.cookie(REFRESH_TOKEN_CONSTANTS.cookie.name, "", expireCookieOptions)
        return res.status(205).json({ ok: true, message: "user logged out successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const refreshAccessToken = async(req, res) => {
    try {
        const cookies = req.cookies
        console.log(cookies)
        const refreshToken = cookies[REFRESH_TOKEN_CONSTANTS.cookie.name]

        if(!refreshToken) {
            return res.status(400).json({ ok: false, error: "No refresh token" })
        }

        const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_CONSTANTS.secret)
        const refreshTokenHash = crypto.createHmac("sha256", REFRESH_TOKEN_CONSTANTS.secret)
            .update(refreshToken)
            .digest("hex")
        
        const userWithRTkn = await UserDatabase.findOne({ _id: decodedRefreshToken._id, "tokens.token": refreshTokenHash })
        if(!userWithRTkn) {
            return res.status(400).json({ ok: false, error: "You are unauthenticated" })
        }

        const newAccessToken = generateUserAccessToken(userWithRTkn._id, userWithRTkn.email)

        res.status(201)
        res.set({ "Cache-Control": "no-store", Pragma: "no-cache" })
        return res.json({
            ok: true,
            accessToken: newAccessToken
        })
    } catch (error) {
        console.log(error)
        if(error?.name === "JsonWebTokenError") {
            return res.status(400).json({ ok: false, error: "Token error. you are unauthenticated" })
        }

        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

