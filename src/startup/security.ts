import cors from "cors";
import { Express } from "express";
const cookieParser = require("cookie-parser");

const securitySetup = (app: Express, express: any) =>
  app.use(cors()).use(cookieParser()).use(express.json());

export default securitySetup;
