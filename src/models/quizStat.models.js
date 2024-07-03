import mongoose from "mongoose";

const DetailSchema = mongoose.Schema({
    question: {
        type: Object,
        required: true
    },
    userAnswer: {
        type: String,
        required: true
    },
    isAnswerCorrect: {
        type: Boolean,
        required: true
    }
})

const QuizStatSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        default: null,
    },
    details: {
        type: [DetailSchema],
        default: [],
        required: true
    },
    score: {
        type: Number,
        default: 0,
        required: true,
    },
}, { timestamps: true })


const QuizStat = mongoose.model("QuizStat", QuizStatSchema)
export default QuizStat