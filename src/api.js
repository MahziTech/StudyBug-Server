import express from "express"
import UsersRouter from "./routes/user.routes.js"
import InstitutionsRouter from "./routes/institution.routes.js"
import AdministratorsRouter from "./routes/administrator.routes.js"
import StudyUnitsRouter from "./routes/studyUnit.routes.js"
import NotesRouter from "./routes/note.routes.js"
import DocumentsRouter from "./routes/document.routes.js"
import FlashcardSetsRouter from "./routes/flashcardSet.routes.js"
import CardStatsRouter from "./routes/cardStat.routes.js"
import QuizzesRouter from "./routes/quiz.routes.js"
import AuthRouter from "./routes/auth.routes.js"
import { checkAuthentication } from "./middlewares/auth.middlewares.js"


const ApiRouter = express.Router()


ApiRouter.use("/auth", AuthRouter)
ApiRouter.use("/users", checkAuthentication, UsersRouter)
ApiRouter.use("/institutions", InstitutionsRouter)
ApiRouter.use("/administrators", AdministratorsRouter)
ApiRouter.use("/studyunits", checkAuthentication, StudyUnitsRouter)
ApiRouter.use("/notes", checkAuthentication, NotesRouter)
ApiRouter.use("/documents", checkAuthentication, DocumentsRouter)
ApiRouter.use("/flashcardsets", checkAuthentication, FlashcardSetsRouter)
ApiRouter.use("/cardstats", checkAuthentication, CardStatsRouter)
// ApiRouter.use("/quizzes", QuizzesRouter)


export default ApiRouter