import express from "express"
import { 
    createInstitution, 
    editInstitutionMainDetails, 
    getAllInstitutionAdministrators, 
    getAllInstitutionMembers, 
    getAllInstitutions, 
    getInstitution, 
    loginToInstitution
} from "../controllers/institution.controllers.js"


const InstitutionsRouter = express.Router()


InstitutionsRouter.post("/create", createInstitution)
InstitutionsRouter.post("/login", loginToInstitution)
InstitutionsRouter.post("/edit/main-details", editInstitutionMainDetails)
InstitutionsRouter.get("/id/:id", getInstitution)
InstitutionsRouter.get("/", getAllInstitutions)
InstitutionsRouter.get("/id/:id/members", getAllInstitutionMembers)
InstitutionsRouter.get("/id/:id/administrators", getAllInstitutionAdministrators)


export default InstitutionsRouter