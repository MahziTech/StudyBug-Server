import mongoose from "mongoose";


const StudySessionSchema = mongoose.Schema({
    name: {
        type: String,
        default: "",
        required: true,
        min: 1,
        max: 100
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        required: true
    }
}, { timestamps: true })


const StudySession = mongoose.model("StudySession", StudySessionSchema)
export default StudySession