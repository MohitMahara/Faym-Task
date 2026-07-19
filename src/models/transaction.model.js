import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users",
        required : true,
    },

    saleId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Sales",
    },
    
    type : {
        type : String,
        enum : ["ADVANCE_PAYOUT", "FINAL_PAYOUT", "REJECTION_ADJUSTMENT", "WITHDRAWAL", "FAILED_WITHDRAWAL_REFUND"],
        required : true
    },

    amount : {
        type : Number,
        required : true
    }

}, {timestamps : true});

export default mongoose.model("Transactions", transactionSchema);