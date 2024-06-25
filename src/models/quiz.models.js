import mongoose from "mongoose";


const QuizSchema = mongoose.Schema({
    name: {
        type: String,
        default: "",
        required: true,
        min: 1,
        max: 150
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        required: true
    },
    studySession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudySession",
        default: null,
        required: true
    },
    questions: {
        type: Array,
        default: [],
        required: true
    }
}, { timestamps: true })


const Quiz = mongoose.model("Quiz", QuizSchema)
export default Quiz