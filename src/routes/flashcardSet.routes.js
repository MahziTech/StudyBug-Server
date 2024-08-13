import express from "express"
import {
    addCardsToFlashcardSet,
    changeFlashcardSetName,
    createFlashcardSet,
    deleteCardFromFlashcardSet,
    deleteFlashcardSet,
    editCardInFlashcardSet,
    getFlashcardSetById,
    getUserFlashcardSets,
    moveFlashcardSetToStudyUnit
} from "../controllers/flashcardSet.controllers.js"


const FlashcardSetsRouter = express.Router()


FlashcardSetsRouter.post("/create", createFlashcardSet)
FlashcardSetsRouter.get("/id/:id", getFlashcardSetById)
FlashcardSetsRouter.get("/user/all", getUserFlashcardSets)
FlashcardSetsRouter.post("/edit/name", changeFlashcardSetName)
FlashcardSetsRouter.post("/edit/studyunit", moveFlashcardSetToStudyUnit)
FlashcardSetsRouter.post("/cards/remove", deleteCardFromFlashcardSet)
FlashcardSetsRouter.post("/cards/edit", editCardInFlashcardSet)
FlashcardSetsRouter.put("/cards/add", addCardsToFlashcardSet)
FlashcardSetsRouter.delete("/delete/:id", deleteFlashcardSet)


export default FlashcardSetsRouter