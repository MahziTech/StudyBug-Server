import express from "express"
import {
    addUserToInstitution,
    editUserMainDetails, 
    getUser, 
    removeUserFromInstitution,
    searchFilterAndSortAllResources,
} from "../controllers/user.controllers.js"
import { checkAuthentication } from "../middlewares/auth.middlewares.js"


const UsersRouter = express.Router()


UsersRouter.get("/id/:id", checkAuthentication, getUser)
UsersRouter.get("/resources", searchFilterAndSortAllResources)
UsersRouter.post("/edit/main-details", editUserMainDetails)
UsersRouter.post("/edit/institution/add", addUserToInstitution)
UsersRouter.post("/edit/institution/remove/:userId", removeUserFromInstitution)


export default UsersRouter