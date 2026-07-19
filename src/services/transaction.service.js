import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

class TransactionService {

    async createTransaction(payload) {

        return await Transaction.create({
            userId: payload.userId,
            saleId: payload.saleId || null,
            type: payload.type,
            amount: payload.amount
        });
    }

    async getUserTransactions(userId) {

        const user  = await User.findOneById(userId);

        if(!user){
            throw new Error("User not found");
        }

        return await Transaction.find({ userId }).sort({ createdAt: -1 });
    }

}

export default new TransactionService();