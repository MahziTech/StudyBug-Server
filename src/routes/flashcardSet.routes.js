import express from "express"
import {
    addCardsToFlashcardSet,
    changeFlashcardSetName,
    createFlashcardSet,
    deleteCardFromFlashcardSet,
    deleteFlashcardSet,
    getFlashcardSetById,
    getUserFlashcardSets,
    moveFlashcardSetToStudyUnit
} from "../controllers/flashCardSet.controllers.js"


const FlashcardSetsRouter = express.Router()


FlashcardSetsRouter.post("/create", createFlashcardSet)
FlashcardSetsRouter.get("/id/:id", getFlashcardSetById)
FlashcardSetsRouter.get("/user/:userId", getUserFlashcardSets)
FlashcardSetsRouter.post("/edit/name", changeFlashcardSetName)
FlashcardSetsRouter.post("/edit/studyunit", moveFlashcardSetToStudyUnit)
FlashcardSetsRouter.post("/cards/add", addCardsToFlashcardSet)
FlashcardSetsRouter.post("/cards/remove", deleteCardFromFlashcardSet)
FlashcardSetsRouter.delete("/delete/:id", deleteFlashcardSet)


export default FlashcardSetsRouter