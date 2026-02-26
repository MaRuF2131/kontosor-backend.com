import helmet from "helmet";
import cors from "cors";
import { sanitizeMiddleware } from "../utils/sanitizer.mjs";
import { apiLimiter } from "../middlewares/rateLimit.middleware.mjs";
import { blockBots } from "../middlewares/blockBots.middleware.mjs";

export const security = (app) => {
  app.use(apiLimiter)
  app.use(helmet());
  app.use(blockBots);
  app.use(
    cors({
      origin: ["http://localhost:3000",'http://localhost:5173'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'x-user','authorization',"stripe-signature"]
    })
  );
  app.use(sanitizeMiddleware());
};
