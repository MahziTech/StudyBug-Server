import express from "express"
import { 
    createInstitution, 
    editInstitutionMainDetails, 
    getAllInstitutions, 
    getInstitution 
} from "../controllers/institution.controllers.js"


const InstitutionsRouter = express.Router()

InstitutionsRouter.post("/create", createInstitution)
InstitutionsRouter.post("/edit/main-details", editInstitutionMainDetails)
InstitutionsRouter.get("/id/:id", getInstitution)
InstitutionsRouter.get("/", getAllInstitutions)


export default InstitutionsRouter