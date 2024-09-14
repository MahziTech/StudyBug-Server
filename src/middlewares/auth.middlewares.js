import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import UserDatabase from "../models/user.models.js"
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


//! should i modify it to make sure bboth access and refresh token are present ?????

export const checkAuthentication = async(req, res, next) => {
    try {
        const authHeader = req.header("Authorization")
        console.log(authHeader)
        if(!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ ok: false, error: "You are unauthenticated" })
        }

        const accessToken = authHeader.split(" ")[1]
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        console.log("DECODED: ", decoded)

        const user = await UserDatabase.findById(decoded._id)

        if(!user) {
            return res.status(404).json({ ok: false, error: "User does not exist" })
        }
        req.body.userId = decoded._id
        req.token = accessToken
        next()
    } catch (error) {
        console.log(error)
        if(error.name === "TokenExpiredError") {
            return res.status(400).json({ ok: false, error: "Token expired" })
        }
        return res.status(400).json({ ok: false, error: "Invalid Token" })
    }
}

export const isLoggedInOnCurrentWebDevice = async(req, res) => {
    try {
        const cookies = req.cookies
        console.log(cookies)
        const refreshToken = cookies[REFRESH_TOKEN_CONSTANTS.cookie.name]

        if(!refreshToken) {
            next()
        }

        //! test with wrong rtkns and see
        const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_CONSTANTS.secret)
        const refreshTokenHash = crypto.createHmac("sha256", REFRESH_TOKEN_CONSTANTS.secret)
            .update(refreshToken)
            .digest("hex")
        
        const userWithRTkn = await UserDatabase.findOne({ _id: decodedRefreshToken._id, "tokens.token": refreshTokenHash })
        if(userWithRTkn) {
            return res.status(400).json({ ok: false, error: "You are already logged in" })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
        if(["TokenExpiredError", "JsonWebTokenError"].includes(error.name)) {
            console.log("valid error: ", error.name, " receieved. user not logged in")
            next()
        }
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}