import cron from "node-cron";
import payoutProcessorService from "../services/payout.processor.service.js";

cron.schedule(
    "*/30 * * * *",
    async () => {
        console.log("Running payout processor...");
        await payoutProcessorService.run();
    }
);