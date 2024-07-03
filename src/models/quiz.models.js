import mongoose from "mongoose";


const QuestionSchema = mongoose.Schema({
    questionPrompt: {
        type: String,
        required: true,
    },
    type: {
        type: String, // multiple choice, true/false or subjective
        required: true
    },
    options: {
        type: Array
    }
})

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
    info: {
        type: Object,
        required: true,
    },
    studyUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudyUnit",
        default: null,
        required: true
    },
    questions: {
        type: [QuestionSchema],
        default: [],
        required: true
    }
}, { timestamps: true })


const Quiz = mongoose.model("Quiz", QuizSchema)
export default Quiz