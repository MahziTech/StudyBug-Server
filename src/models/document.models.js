import mongoose from "mongoose";


const DocumentSchema = mongoose.Schema({
    name: {
        type: String,
        default: "",
        required: true,
        min: 1,
        max: 100
    },
    filePath: {
        type: String,
        default: "",
        required: true
    },
    studySession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudySession",
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


const Document = mongoose.model("Document", DocumentSchema)
export default Document