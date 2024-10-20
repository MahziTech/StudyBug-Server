import express from "express"
import { 
    createUserDefault, 
    loginUserDefault,
    createUserGoogle, 
    loginUserGoogle,
    logout,
    logoutAllDevices,
    refreshAccessToken
} from "../controllers/auth.controllers.js"
import { checkAuthentication } from "../middlewares/auth.middlewares.js"


const AuthRouter = express.Router()

AuthRouter.post("/signup/google", createUserGoogle)
AuthRouter.post("/login/google", loginUserGoogle)
AuthRouter.post("/signup/default", createUserDefault)
AuthRouter.post("/login/default", loginUserDefault)
AuthRouter.post("/reauth", refreshAccessToken)
AuthRouter.post("/logout", checkAuthentication, logout)
AuthRouter.post("/masterlogout", checkAuthentication, logoutAllDevices)


export default AuthRouter