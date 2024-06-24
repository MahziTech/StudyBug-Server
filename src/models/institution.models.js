import mongoose from "mongoose";


const InstitutionSchema = mongoose.Schema({
    name: {
        type: String,
        default: "",
        required: true,
        min: 1,
        max: 60
    },
    profilePicturePath: {
        type: String,
        default: ""
    },
    subscription: {
        type: Object,
        default: null,
        required: true
    },
}, { timestamps: true })


const Institution = mongoose.model("Institution", InstitutionSchema)
export default Institution