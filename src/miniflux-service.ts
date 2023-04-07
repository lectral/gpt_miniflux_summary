import { IApiClient } from "./miniflux-api-client";
import { RssEntry } from "./rss-entry";

interface MinifluxResponse {
  entries: MinifluxEntry[];
}
interface MinifluxEntry {
  id: number;
  title: string;
  url: string;
  content: string;
  status: string;
}

export class MinifluxService {
  constructor(private apiClient: IApiClient) {}

  async getUnreadEntries(): Promise<RssEntry[]> {
    const minifluxResponse = await this.apiClient.get<MinifluxResponse>(
      "/v1/entries",
      { status: "unread" }
    );

    const rssEntries: RssEntry[] = [];

    for (const entry of minifluxResponse.entries) {
      let rssEntry = new RssEntry(
        entry.id,
        entry.title,
        entry.url,
        entry.content
      );
      let obtainedContent = await this.getContent(rssEntry);
      obtainedContent = RssEntry.process(obtainedContent);
      if (obtainedContent.length > 0) {
        rssEntry.content = obtainedContent;
      }
      rssEntry.process();
      rssEntries.push(rssEntry);
    }
    return rssEntries;
  }

  async getContent(entry: RssEntry): Promise<string> {
    return await this.apiClient
      .get<{ content: string }>(`/v1/entries/${entry.id}/fetch-content`)
      .then((response) => response.content);
  }

  async markAsRead(entries: RssEntry[]): Promise<void> {
    const entryIds = entries.map((entry) => entry.id);
    await this.apiClient.put(`/v1/entries`, {
      entry_ids: entryIds,
      status: "read",
    });
  }
}
