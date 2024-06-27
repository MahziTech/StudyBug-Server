import mongoose from "mongoose";


const InstitutionSchema = mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
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
        unique: true
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