import { RssEntry } from "./rss-entry";

export class SummarizedRssEntry {
  originalEntry: RssEntry;
  summary: string;

  constructor(originalEntry: RssEntry, summary: string) {
    this.originalEntry = originalEntry;
    this.summary = summary;
  }
}
