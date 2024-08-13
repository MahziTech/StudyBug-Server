import express from "express"
import { 
    createUserDefault, 
    loginUserDefault
} from "../controllers/auth.controllers.js"


const AuthRouter = express.Router()

AuthRouter.post("/signup/default", createUserDefault)
AuthRouter.post("/login/default", loginUserDefault)


export default AuthRouter