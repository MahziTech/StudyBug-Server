import express from "express"
import {
    createAdministrator, 
    editAdministratorMainDetails, 
    getAdministrator, 
    loginAdministrator
} from "../controllers/administrator.controllers.js"


const AdministratorsRouter = express.Router()


AdministratorsRouter.post("/create", createAdministrator)
AdministratorsRouter.post("/login", loginAdministrator)
AdministratorsRouter.get("/id/:id", getAdministrator)
AdministratorsRouter.post("/edit/main-details", editAdministratorMainDetails)


export default AdministratorsRouter