import withdrawalService from "../services/withdrawal.service.js";

class WithdrawalController {

    async createWithdrawal(req, res, next) {
        try {
            const withdrawal = await withdrawalService.createWithdrawal(req.body);
            return res.status(201).json({
                success: true,
                message: "Withdrawal initiated successfully",
                data: withdrawal
            });

        } catch (error) {
            next(error);
        }
    }

    async updateWithdrawalStatus(req, res, next) {
        try {

            const { withdrawalId } = req.params;
            const { status } = req.body;
            const withdrawal = await withdrawalService.updateWithdrawalStatus( withdrawalId, status );

            return res.status(200).json({
                success: true,
                message: "Withdrawal status updated successfully",
                data: withdrawal
            });

        } catch (error) {
            next(error);
        }
    }

}

export default new WithdrawalController();