import express from "express"
import {
    changeStudyUnitName,
    createStudyUnit,
    deleteStudyUnit,
    getStudyUnitById,
    getUserStudyUnits
} from "../controllers/studyUnit.controllers.js"


const StudyUnitsRouter = express.Router()


StudyUnitsRouter.post("/create", createStudyUnit)
StudyUnitsRouter.get("/id/:id", getStudyUnitById)
StudyUnitsRouter.get("/user/:userId", getUserStudyUnits)
StudyUnitsRouter.post("/edit", changeStudyUnitName)
StudyUnitsRouter.delete("/delete/:id", deleteStudyUnit)


export default StudyUnitsRouter