import { ChatGPTAPI } from "chatgpt";
import fs from "fs";
import { RssEntry } from "./rss-entry";
import { SummarizedRssEntry } from "./summarized-rss-entry";

class PromptGenerator {
  public static generatePrompt(entry: RssEntry, prompt: string): string {
    const promptText = fs.readFileSync(`src/prompts/${prompt}.txt`, "utf8");
    return promptText.replace("$CONTENT", JSON.stringify(entry));
  }
}

export class OpenAIApi {
  private chatGPTApi: ChatGPTAPI;

  constructor(apiKey: string) {
    this.chatGPTApi = new ChatGPTAPI({ apiKey });
  }

  public async sendMessage(promptText: string): Promise<string> {
    try {
      const result = await this.chatGPTApi.sendMessage(promptText);
      console.log("Open AI response", result);
      return result.text;
    } catch (error) {
      console.log("[OpenAIApi] Error:", error);
      return "Error obtaining summary.";
    }
  }
}

export class EntrySummarizer {
  private openAIApi: OpenAIApi;

  constructor(openAIApi: OpenAIApi) {
    this.openAIApi = openAIApi;
  }

  public async summarize(entry: RssEntry): Promise<SummarizedRssEntry> {
    const promptText = PromptGenerator.generatePrompt(entry, "summary");
    console.log("[EntrySummarizer] Sending prompt:", { prompt: promptText });

    const summary = await this.openAIApi.sendMessage(promptText);
    return new SummarizedRssEntry(entry, summary);
  }
}
