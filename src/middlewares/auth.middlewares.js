import dotenv from "dotenv"
import jwt from "jsonwebtoken"
dotenv.config()


// should we modify it to make sure bboth access and refresh token are present ?????

export const checkAuthentication = async(req, res, next) => {
    try {
        const authHeader = req.header("Authorization")
        if(!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ ok: false, error: "You are unauthenticated" })
        }

        const accessToken = authHeader.split(" ")[1]
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        console.log("DECODED: ", decoded)

        req.decodedUserId = decoded._id
        req.token = accessToken
        next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({ ok: false, error: "Invalid Access Token" })
    }
}