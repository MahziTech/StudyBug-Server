import express from "express"
import {
    createUser, 
    getUser, 
    loginUser
} from "../controllers/user.controllers.js"


const UserRouter = express.Router()


UserRouter.post("/create", createUser)
UserRouter.post("/login", loginUser)
UserRouter.get("/id/:id", getUser)


export default UserRouter