import mongoose from "mongoose";


const UserSchema = mongoose.Schema({
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
        required: true
    },
    profilePicturePath: {
        type: String,
        default: "",
        required: true
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution",
        default: null,
        required: true
    }
}, { timestamps: true })


const User = mongoose.model("User", UserSchema)
export default User