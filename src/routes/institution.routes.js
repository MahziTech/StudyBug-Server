import express from "express"
import { 
    createInstitution, 
    editInstitutionMainDetails, 
    getAllInstitutionMembers, 
    getAllInstitutions, 
    getInstitution 
} from "../controllers/institution.controllers.js"


const InstitutionsRouter = express.Router()

InstitutionsRouter.post("/create", createInstitution)
InstitutionsRouter.post("/edit/main-details", editInstitutionMainDetails)
InstitutionsRouter.get("/id/:id", getInstitution)
InstitutionsRouter.get("/", getAllInstitutions)
InstitutionsRouter.get("/id/:id/members", getAllInstitutionMembers)


export default InstitutionsRouter