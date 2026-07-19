import Sale from "../models/sale.model.js";
import Wallet from "../models/wallet.model.js";
import transactionService from "./transaction.service.js";

class PayoutProcessorService {

  async processAdvancePayouts() {
    const pendingSales = await Sale.find({
      status: "PENDING",
      advancePaid: false,
    });

    for (const sale of pendingSales) {
      const advanceAmount = sale.earning * 0.1;

      const wallet = await Wallet.findOne({
        userId: sale.userId,
      });

      wallet.withdrawableBalance += advanceAmount;

      await wallet.save();

      await transactionService.createTransaction({
        userId: sale.userId,
        saleId: sale._id,
        type: "ADVANCE_PAYOUT",
        amount: advanceAmount,
      });

      sale.advancePaid = true;
      sale.advancePaidAmount = advanceAmount;

      await sale.save();
    }
  }

  async processApprovedSales() {
    const approvedSales = await Sale.find({
      status: "APPROVED",
      settled: false,
    });

    for (const sale of approvedSales) {
      const remainingAmount = sale.earning - sale.advancePaidAmount;

      const wallet = await Wallet.findOne({
        userId: sale.userId,
      });

      wallet.withdrawableBalance += remainingAmount;

      await wallet.save();

      await transactionService.createTransaction({
        userId: sale.userId,
        saleId: sale._id,
        type: "FINAL_PAYOUT",
        amount: remainingAmount,
      });

      sale.settled = true;

      await sale.save();
    }
  }

  async processRejectedSales() {
    const rejectedSales = await Sale.find({
      status: "REJECTED",
      settled: false,
    });

    for (const sale of rejectedSales) {
      if (sale.advancePaid) {
        const wallet = await Wallet.findOne({
          userId: sale.userId,
        });

        wallet.withdrawableBalance -= sale.advancePaidAmount;

        await wallet.save();

        await transactionService.createTransaction({
          userId: sale.userId,
          saleId: sale._id,
          type: "REJECTION_ADJUSTMENT",
          amount: sale.advancePaidAmount,
        });
      }

      sale.settled = true;

      await sale.save();
    }
  }

  async run() {

    console.log("Run method got called");

    await this.processAdvancePayouts();

    await this.processApprovedSales();

    await this.processRejectedSales();
  }
}

export default new PayoutProcessorService();