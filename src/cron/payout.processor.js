import cron from "node-cron";
import payoutProcessorService from "../services/payout.processor.service.js";

cron.schedule(
    "* * * * *",    // 1 min for testing, can be increased in production.
    async () => {
        console.log("Running payout processor...");
        await payoutProcessorService.run();
    }
);