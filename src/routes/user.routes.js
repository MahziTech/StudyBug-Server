import express from "express"
import {
    addUserToInstitution,
    editUserMainDetails, 
    getUser, 
    removeUserFromInstitution,
    searchFilterAndSortAllResources,
} from "../controllers/user.controllers.js"


const UsersRouter = express.Router()


UsersRouter.get("/me", getUser)
UsersRouter.get("/resources", searchFilterAndSortAllResources)
UsersRouter.post("/edit/main-details", editUserMainDetails)
UsersRouter.post("/edit/institution/add", addUserToInstitution)
UsersRouter.post("/edit/institution/remove/user", removeUserFromInstitution)


export default UsersRouter