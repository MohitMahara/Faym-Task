import Sale from "../models/sale.model.js";

class SaleService {

    async createSale(payload) {

        const sale = await Sale.create({
            userId: payload.userId,
            brand: payload.brand,
            earning: payload.earning,
        });

        return sale;
    }

    async updateSaleStatus(saleId, status) {
        const acceptedStatuses = ["Pending", "Rejected", "Approved"];

        if(!acceptedStatuses.includes(status)){
          throw new Error("Invalid status field");
        }

        const sale = await Sale.findById(saleId);

        if (!sale) {
            throw new Error("Sale not found");
        }

        sale.status = status;

        await sale.save();

        return sale;
    }

}

export default new SaleService();