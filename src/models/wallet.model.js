import mongoose, { mongo } from "mongoose";

const walletSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users",
        unique : true
    },

    withdrawableBalance : {
        type : Number,
        default : 0
    }
}, {timestamps : true});

export default mongoose.model("wallets", walletSchema);