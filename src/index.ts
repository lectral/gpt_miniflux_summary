import { SummarizedRssEntry } from "./summarized-rss-entry";
import { EntrySummarizer, OpenAIApi } from "./entry-summarizer";
import { Discord } from "./discord";
import { MinifluxService } from "./miniflux-service";
import dayjs from "dayjs";
import { ApiClient as MinifluxApiClient } from "./miniflux-api-client";
import { OPENAI_API_KEY } from "./config";
import * as cron from "cron";

async function main() {
  // Get unread entries from Miniflux
  const minifluxApiClient = new MinifluxApiClient();
  const minifluxService = new MinifluxService(minifluxApiClient);
  const unreadEntries = await minifluxService.getUnreadEntries();
  if (unreadEntries.length === 0) {
    console.log("No unread entries");
    return;
  }
  // Init chatgpt api
  const openAIApi = new OpenAIApi(OPENAI_API_KEY);
  const entrySummarizer = new EntrySummarizer(openAIApi);

  // Summarize entries using chatgpt
  const summarizedEntries: SummarizedRssEntry[] = [];
  const promises: Promise<SummarizedRssEntry>[] = [];
  for (const entry of unreadEntries) {
    promises.push(
      entrySummarizer.summarize(entry).then((summary) => {
        summarizedEntries.push(summary);
        return summary;
      })
    );
  }
  await Promise.all(promises);
  await Discord.sendMessage(
    `**Yo, tu są newsiki z dnia ${dayjs().format("DD-MM-YYYY HH:mm")}**\n\n`
  );
  for (const summary of summarizedEntries) {
    await Discord.sendMessage(summary.summary + "\n");
  }
  console.log("Summarized entries:");
  console.log(summarizedEntries);
  minifluxService.markAsRead(unreadEntries);
  console.log("Run [OK]");
}

if (process.env.SUMMARY_MODE === "cron") {
  console.log(dayjs().format("DD-MM-YYYY HH:mm") + " Starting cron job");
  const job = new cron.CronJob(
    "*/30 * * * *",
    function () {
      console.log(dayjs().format("DD-MM-YYYY HH:mm") + " Executing cron job");

      main();
    },
    null,
    true,
    "Europe/Warsaw"
  );
  job.start();
} else {
  main();
}
