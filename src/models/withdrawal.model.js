import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },

    amount: {
        type: Number,
        required: true,
        min: 1
    },

    status: {
        type: String,
        enum: [
            "PENDING",
            "PROCESSING",
            "SUCCESS",
            "FAILED",
            "REJECTED"
        ],
        default: "PENDING"
    },
    
    refundProcessed: {
      type: Boolean,
      default: false
    }

}, {timestamps: true});

withdrawalSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Withdrawals", withdrawalSchema);