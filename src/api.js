import express from "express"
import UserRouter from "./routes/user.routes.js"
import InstitutionsRouter from "./routes/institution.routes.js"


const ApiRouter = express.Router()

ApiRouter.use("/users", UserRouter)
ApiRouter.use("/institutions", InstitutionsRouter)


export default ApiRouter