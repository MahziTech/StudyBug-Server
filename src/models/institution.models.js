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
    profilePicturePath: {
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