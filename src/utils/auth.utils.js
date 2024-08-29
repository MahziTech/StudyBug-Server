import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import crypto from "crypto"
dotenv.config()

export function generateUserAccessToken(id, email) {
    const accessToken = jwt.sign(
        {
            _id: id,
            email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )

    return accessToken
}

export async function generateUserRefreshToken(id) {
    const refreshToken = jwt.sign(
        { _id: id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )

    const refreshTokenHash = crypto
        .createHmac("sha256", process.env.REFRESH_TOKEN_SECRET)
        .update(refreshToken)
        .digest("hex")

    return { refreshToken, refreshTokenHash }
}

export async function generateResetToken() {
    const resetTokenValue = crypto.randomBytes(20).toString("base64url")
    const resetTokenSecret = crypto.randomBytes(10).toString("hex")

    const resetToken = `${resetTokenValue}+${resetTokenSecret}`
    const resetTokenHash = crypto
        .createHmac("sha256", resetTokenSecret)
        .update(resetTokenValue)
        .digest("hex")

    return {
        resetToken,
        resetPasswordToken: resetTokenHash,
        resetPasswordTokenExpiry: Date.now() + (process.env.RESET_PASSWORD_TOKEN_EXPIRY_MINS||5)*60*1000
    }
}

export function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}