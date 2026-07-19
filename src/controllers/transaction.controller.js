import transactionService from "../services/transaction.service.js";

class TransactionController {

    async getUserTransactions(req, res, next) {
        try {

            const { userId } = req.params;
            const transactions = await transactionService.getUserTransactions(userId);

            return res.status(200).json({
                success: true,
                data: transactions
            });

        } catch (error) {
            next(error);
        }
    }

}

export default new TransactionController();