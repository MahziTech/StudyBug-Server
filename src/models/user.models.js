import mongoose from "mongoose";


const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        default: "",
        min: 2,
        max: 50,
        trim: true
    },
    lastName: {
        type: String,
        default: "",
        min: 2,
        max: 50,
        trim: true

    },
    email: {
        type: String,
        required: true,
        min: 8,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        default: "",
        min: 8,
        max: 70,
    },
    telephone: {
        type: String,
        default: "",
        min: 5,
        max: 20,
        trim: true
    },
    oauthProvider: {
        type: String,
        default: null,
    },
    profilePicturePath: {
        type: String,
        default: "",
    },
    subscription: {
        type: Object,
        default: null,
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institution",
        default: null,
    },
}, { timestamps: true })


const User = mongoose.model("User", UserSchema)
export default User