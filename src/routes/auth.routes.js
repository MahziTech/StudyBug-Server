import express from "express"
import { 
    createUserDefault, 
    loginUserDefault,
    logout,
    logoutAllDevices,
    refreshAccessToken
} from "../controllers/auth.controllers.js"
import { checkAuthentication } from "../middlewares/auth.middlewares.js"


const AuthRouter = express.Router()

AuthRouter.post("/signup/default", createUserDefault)
AuthRouter.post("/login/default", loginUserDefault)
AuthRouter.post("/reauth", refreshAccessToken)
AuthRouter.post("/logout", checkAuthentication, logout)
AuthRouter.post("/masterlogout", checkAuthentication, logoutAllDevices)


export default AuthRouter