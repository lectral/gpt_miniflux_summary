// config.ts

import dotenv from "dotenv";
import { from, get } from "env-var";

// Load the .env file
dotenv.config();

// Validate the environment variables
export const MINIFLUX_API_KEY = get("MINIFLUX_API_KEY").required().asString();
export const OPENAI_API_KEY = get("OPENAI_API_KEY").required().asString();
export const MINIFLUX_URL = get("MINIFLUX_URL").required().asString();
export const DISCORD_WEBHOOK_URL = get("DISCORD_WEBHOOK_URL")
  .required()
  .asString();
