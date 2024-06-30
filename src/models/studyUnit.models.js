import mongoose from "mongoose";


const StudyUnitSchema = mongoose.Schema({
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
    },
    picturePath: {
        type: String,
        default: "",
    }
}, { timestamps: true })


const StudyUnit = mongoose.model("StudyUnit", StudyUnitSchema)
export default StudyUnit