import mongoose from "mongoose";


const InstitutionSchema = mongoose.Schema({
    name: {
        type: String,
        default: "",
        trim: true
    },
    address: {
        type: String,
        default: "",
        trim: true
    },
    password: {
        type: String,
        default: "",
        min: 8,
        max: 70,
        required: true
    },
    email: {
        type: String,
        required: true,
        min: 8,
        max: 50,
        unique: true,
        trim: true
    },
    profilePicturePath: {
        type: String,
        default: "",
    },
    code: {
        type: String,
        default: "",
    },
    subscription: {
        type: Object,
        default: null,
    },
}, { timestamps: true })


const Institution = mongoose.model("Institution", InstitutionSchema)
export default Institution