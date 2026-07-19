import User from "../models/user.model.js";
import Wallet from "../models/wallet.model.js";
import Withdrawal from "../models/withdrawal.model.js";
import transactionService from "./transaction.service.js";

class WithdrawalService {

    async createWithdrawal(payload) {

        const { userId, amount } = payload;

        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        const wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        if (wallet.withdrawableBalance < amount) {
            throw new Error("Insufficient wallet balance");
        }

        const lastSuccessfulWithdrawal =
            await Withdrawal.findOne({
                userId,
                status: "SUCCESS"
            }).sort({ createdAt: -1 });

        if (lastSuccessfulWithdrawal) {

            const hoursDifference =
                (Date.now() -
                    new Date(lastSuccessfulWithdrawal.createdAt).getTime())
                / (1000 * 60 * 60);

            if (hoursDifference < 24) {
                throw new Error(
                    "Only one withdrawal is allowed every 24 hours"
                );
            }
        }

        wallet.withdrawableBalance -= amount;

        await wallet.save();

        const withdrawal = await Withdrawal.create({
            userId,
            amount,
            status: "PENDING"
        });

        await transactionService.createTransaction({
            userId,
            type: "WITHDRAWAL",
            amount
        });

        return withdrawal;
    }

    async updateWithdrawalStatus(withdrawalId, status) {

        const acceptedStatuses = [
            "PENDING",
            "PROCESSING",
            "SUCCESS",
            "FAILED",
            "REJECTED"
        ];

        if (!acceptedStatuses.includes(status)) {
            throw new Error("Invalid withdrawal status");
        }

        const withdrawal =
            await Withdrawal.findById(withdrawalId);

        if (!withdrawal) {
            throw new Error("Withdrawal not found");
        }

        withdrawal.status = status;

        await withdrawal.save();

        if (
            status === "FAILED" &&
            !withdrawal.refundProcessed
        ) {
            await this.refundFailedWithdrawal(
                withdrawal
            );
        }

        return withdrawal;
    }

    async refundFailedWithdrawal(withdrawal) {

        const wallet =
            await Wallet.findOne({
                userId: withdrawal.userId
            });

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        wallet.withdrawableBalance += withdrawal.amount;

        await wallet.save();

        await transactionService.createTransaction({
            userId: withdrawal.userId,
            type: "FAILED_WITHDRAWAL_REFUND",
            amount: withdrawal.amount
        });

        withdrawal.refundProcessed = true;

        await withdrawal.save();

        return withdrawal;
    }
}

export default new WithdrawalService();