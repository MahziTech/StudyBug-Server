import mongoose from "mongoose";


const CardStatSchema = mongoose.Schema({
    flashcardSet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FlashcardSet",
        default: null,
        required: true
    },
    question: {
        type: String,
        default: "",
        required: true,
    },
    answer: {
        type: String,
        default: "",
        required: true,
    },
    correctlyAnswered: {
        type: Boolean,
        default: false,
        required: true,
    }
}, { timestamps: true })


const CardStat = mongoose.model("CardStat", CardStatSchema)
export default CardStat