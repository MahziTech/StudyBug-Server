import express from "express"
import {
    addUserToInstitution,
    createUser, 
    editUserMainDetails, 
    getUser, 
    loginUser,
    removeUserFromInstitution
} from "../controllers/user.controllers.js"


const UserRouter = express.Router()


UserRouter.post("/create", createUser)
UserRouter.post("/login", loginUser)
UserRouter.get("/id/:id", getUser)
UserRouter.post("/edit/main-details", editUserMainDetails)
UserRouter.post("/edit/institution/add", addUserToInstitution)
UserRouter.post("/edit/institution/remove/:userId", removeUserFromInstitution)


export default UserRouter