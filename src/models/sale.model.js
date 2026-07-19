import mongoose  from "mongoose";

const saleSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users",
        required : true,
    },

    brand : {
        type : String,
        required : true,
    },
    
    earning : {
        type : Number,
        required : true,
    },

    status : {
        type : String,
        enum : ["PENDING", "APPROVED", "REJECTED"],
        default : "PENDING",
    },

    advancePaid: {
        type: Boolean,
        default: false
    },

    advancePaidAmount: {
        type: Number,
        default: 0
    },

    settled: {
        type: Boolean,
        default: false
    }

}, {timestamps : true});

export default mongoose.model("Sales", saleSchema);