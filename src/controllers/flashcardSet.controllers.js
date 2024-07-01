import { nanoid } from "nanoid";
import FlashcardSetDatabase from "../models/flashCardSet.models.js";
import StudyUnitDatabase from "../models/studyUnit.models.js";
import UserDatabase from "../models/user.models.js";


export const createFlashcardSet = async(req, res) => {
    try {
        const { name, cards, studyUnitId, userId } = req.body

        const existingFlashcardSet = await FlashcardSetDatabase.findOne({ name })
        if(existingFlashcardSet) {
            return res.status(409).json({ ok: false, error: "You already have a set of flashcards with that same name. try a different name :)" })
        }

        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "The user could not be found" })
        }

        if(studyUnitId) {
            const studyUnit = await StudyUnitDatabase.findOne({ _id: studyUnitId, user: userId })
            if(!studyUnit) {
                return res.status(404).json({ ok: false, error: "The study unit could not be found" })
            }
        }

        const newFlashcardSet = new FlashcardSetDatabase({
            name,
            cards,
            studyUnit: studyUnitId || null,
            user: userId
        })

        const savedFlashcardSet = await newFlashcardSet.save()

        return res.status(201).json({ ok: true, body: savedFlashcardSet })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const getFlashcardSetById = async(req, res) => {
    try {
        const { id } = req.params

        const flashcardSet = await FlashcardSetDatabase.findById(id)
        if(flashcardSet) {
            return res.status(200).json({ ok: true, body: flashcardSet })
        }

        return res.status(404).json({ ok: false, error: "flashcard set could not be found" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const getUserFlashcardSets = async(req, res) => {
    try {
        const { skip, limit, page } = getPagination(req.query)
        const { userId } = req.params
        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "The user could not be found" })
        }

        const flashcardSets = await FlashcardSetDatabase.find({ user: userId })
        .skip(skip)
        .limit(limit)

        const totalResults = await FlashcardSetDatabase.countDocuments({ user: userId })

        return res.status(200).json({
            ok: true,
            page,
            totalResults,
            body: flashcardSets,
            totalPages: Math.ceil(totalResults/limit)
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const changeFlashcardSetName = async(req, res) => {
    try {
        const { id, newName } = req.body
        const flashcardSet = await FlashcardSetDatabase.findById(id)

        if(!flashcardSet) {
            return res.status(404).json({ ok: false, error: "FlashcardSet could not be found" })
        }

        const existingFlashcardSet = await FlashcardSetDatabase.findOne({ name: newName })
        if(existingFlashcardSet) {
            return res.status(409).json({ ok: false, error: "You already have a flashcardSet with that same name. try a different name :)" })
        }

        flashcardSet.name = newName
        await flashcardSet.save()

        return res.status(200).json({ ok: true, body: flashcardSet })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const addCardsToFlashcardSet = async(req, res) => {
    try {
        const { id, cards } = req.body

        const flashcardSet = await FlashcardSetDatabase.findById(id)
        if(!flashcardSet) {
            return res.status(404).json({ ok: false, error: "FlashcardSet could not be found" })
        }

        if (!Array.isArray(cards) || cards.length === 0) {
            return res.status(400).json({ ok: false, error: 'Invalid input: expected an array of cards' });
        }
        
        flashcardSet.cards.push(...cards)
        await flashcardSet.save()

        return res.status(200).json({ ok: true, body: flashcardSet })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const deleteCardFromFlashcardSet = async(req, res) => {
    try {
        const { flashcardSetId, cardId } = req.body

        const flashcardSet = await FlashcardSetDatabase.findById(flashcardSetId)
        if(!flashcardSet) {
            return res.status(404).json({ ok: false, error: "FlashcardSet could not be found" })
        }

        const newCards = flashcardSet.cards.filter(card => card._id.toString() !== cardId)
        if (flashcardSet.cards.length === newCards.length) {
            return res.status(404).json({ ok: false, error: 'Card not found' });
        }

        flashcardSet.cards = newCards
        await flashcardSet.save()

        return res.status(200).json({ ok: true, body: flashcardSet })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const moveFlashcardSetToStudyUnit = async(req, res) => {
    try {
        const { userId, flashcardSetId, studyUnitId } = req.body

        const user = await UserDatabase.findById(userId)
        if(!user) {
            return res.status(404).json({ ok: false, error: "The user could not be found" })
        }

        const flashcardSet = await FlashcardSetDatabase.findById(flashcardSetId)
        if(!flashcardSet) {
            return res.status(404).json({ ok: false, error: "FlashcardSet could not be found" })
        }

        if(studyUnitId) {
            const studyUnit = await StudyUnitDatabase.findOne({ _id: studyUnitId, user: userId })
            if(!studyUnit) {
                return res.status(404).json({ ok: false, error: "The study unit could not be found" })
            }
        }

        flashcardSet.studyUnit = studyUnitId
        const updatedFlashcardSet = await flashcardSet.save()

        return res.status(200).json({ ok: true, body: updatedFlashcardSet })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}

export const deleteFlashcardSet = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedflashcardSet = await FlashcardSetDatabase.findByIdAndDelete(id);

        if (!deletedflashcardSet) {
            return res.status(404).json({ ok: false, error: 'flashcardSet not found' });
        }

        return res.status(200).json({ ok: true, body: deletedflashcardSet });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" });
    }
}

export const editCardInFlashcardSet = async(req, res) => {
    try {
        const { cardId, flashcardSetId, update: { question, answer } } = req.body

        const flashcardSet = await FlashcardSetDatabase.findById(flashcardSetId)
        if(!flashcardSet) {
            return res.status(404).json({ ok: false, error: "FlashcardSet could not be found" })
        }

        const targetCard = flashcardSet.cards.id(cardId)
        if(!targetCard) {
            return res.status(404).json({ ok: false, error: "The card you want to update could not be found" })
        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, error: "Internal server error" })
    }
}