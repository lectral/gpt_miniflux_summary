import axios from "axios";
import { DISCORD_WEBHOOK_URL } from "./config";

export class Discord {
  static async sendMessage(message: string) {
    await axios.post(DISCORD_WEBHOOK_URL, {
      content: message,
      flags: 1 << 2,
    });
  }
}
