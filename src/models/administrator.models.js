import mongoose from "mongoose";


const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        default: "",
        min: 2,
        max: 50
    },
    lastName: {
        type: String,
        default: "",
        min: 2,
        max: 50
    },
    password: {
        type: String,
        default: "",
        min: 8,
        max: 70
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
        max: 20
    },
    profilePicturePath: {
        type: String,
        default: ""
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution",
        default: null
    }
}, { timestamps: true })


const User = mongoose.model("User", UserSchema)
export default User