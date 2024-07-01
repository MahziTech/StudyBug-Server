import mongoose from "mongoose";

const FlashcardSchema = mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, { timestamps: true });

const FlashcardSetSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 1,
        max: 150
    },
    cards: {
        type: [FlashcardSchema],
        default: [],
        required: true,
    },
    studyUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudyUnit",
        default: null,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })


const FlashcardSet = mongoose.model("FlashcardSet", FlashcardSetSchema)
export default FlashcardSet