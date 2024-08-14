import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import UserDatabase from "../models/user.models.js"
dotenv.config()


// should we modify it to make sure bboth access and refresh token are present ?????

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