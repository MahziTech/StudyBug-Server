import mongoose from "mongoose";


const FlashCardSetSchema = mongoose.Schema({
    name: {
        type: String,
        default: "",
        required: true,
        min: 1,
        max: 150
    },
    cards: {
        type: Array,
        default: [],
        required: true,
    },
    studyUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudyUnit",
        default: null,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        required: true
    }
}, { timestamps: true })


const FlashCardSet = mongoose.model("FlashCardSet", FlashCardSetSchema)
export default FlashCardSet