import saleService from "../services/sale.service.js";

class SaleController {

    async createSale(req, res, next) {
        try {

            const sale = await saleService.createSale(req.body);

            return res.status(201).json({
                success: true,
                message: "Sale created successfully",
                data: sale
            });

        } catch (error) {
            next(error);
        }
    }

    async updateSaleStatus(req, res, next) {
        try {

            const { saleId } = req.params;
            const { status } = req.body;

            const sale = await saleService.updateSaleStatus(
                saleId,
                status
            );

            return res.status(200).json({
                success: true,
                message: "Sale status updated successfully",
                data: sale
            });

        } catch (error) {
            next(error);
        }
    }

}

export default new SaleController();