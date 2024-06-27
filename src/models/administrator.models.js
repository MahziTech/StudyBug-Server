import mongoose from "mongoose";


const AdministratorSchema = mongoose.Schema({
    firstName: {
        type: String,
        default: "",
        min: 2,
        max: 50,
        required: true
    },
    lastName: {
        type: String,
        default: "",
        min: 2,
        max: 50,
        required: true
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
    telephone: {
        type: String,
        default: "",
        min: 5,
        max: 20,
    },
    profilePicturePath: {
        type: String,
        default: "",
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution",
        default: null,
        required: true
    }
}, { timestamps: true })


const Administrator = mongoose.model("Administrator", AdministratorSchema)
export default Administrator