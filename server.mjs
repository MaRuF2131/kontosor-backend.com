import express from 'express';
import { security } from './config/security.config.mjs';
import cookieParser from 'cookie-parser';
const app = express();
app.use(cookieParser());
app.use(express.json());
security(app);

import dotenv from 'dotenv';
import admin from './routes/admin.route.mjs'
dotenv.config();

app.use("/admin",admin)

 app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`); 
}); 

export default app;