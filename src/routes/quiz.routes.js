import express from "express"
import {
    changeQuizName,
    createQuiz,
    deleteQuiz,
    getAllUserQuizzes,
    getQuizById,
    moveQuizToStudyUnit
} from "../controllers/quiz.controllers.js"


const QuizzesRouter = express.Router()


QuizzesRouter.post("/create", createQuiz)
QuizzesRouter.get("/id/:id", getQuizById)
QuizzesRouter.get("/user/:userId", getAllUserQuizzes)
QuizzesRouter.post("/edit/name", changeQuizName)
QuizzesRouter.post("/edit/studyunit", moveQuizToStudyUnit)
QuizzesRouter.delete("/delete/:id", deleteQuiz)


export default QuizzesRouter