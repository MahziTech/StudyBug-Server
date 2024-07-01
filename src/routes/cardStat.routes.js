import express from "express"
import { createCardStat } from "../controllers/cardStat.controllers.js"


const CardStatsRouter = express.Router()


CardStatsRouter.post("/create", createCardStat)


export default CardStatsRouter