import CardStatDatabase from "../models/cardStat.models.js";
import FlashcardSetDatabase from "../models/flashCardSet.models.js";


export const createCardStat = async(req, res) => {
    try {
        const { flashcardSetId, userId,  question, answer, correctlyAnswered } = req.body

        const flashcardSet = await FlashcardSetDatabase.findOne({ _id: flashcardSetId, user: userId})
        if(!flashcardSet) {
            return res.status(404).json({ ok: false, error: "FlashcardSet could not be found" })
        }

        const newCardStat = new CardStatDatabase({
            flashcardSet: flashcardSetId,
            user: userId,
            question, 
            answer,
            correctlyAnswered
        })

        const savedCardStat = await newCardStat.save()

        return res.status(201).json({ ok: true, body: savedCardStat })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}