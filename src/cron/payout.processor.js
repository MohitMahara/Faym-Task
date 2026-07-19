import cron from "node-cron";
import payoutProcessorService from "../services/payout.processor.service.js";

cron.schedule(
    "* * * * *",
    async () => {
        console.log("Running payout processor...");
        await payoutProcessorService.run();
    }
);