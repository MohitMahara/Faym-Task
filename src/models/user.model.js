import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    }

}, {timestamps : true});

export default mongoose.model("Users", userSchema);