import parse from "node-html-parser";

export class RssEntry {
  id: number;
  title: string;
  url: string;
  content: string;

  constructor(id: number, title: string, url: string, content: string) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.content = content;
  }

  process() {
    this.content = RssEntry.process(this.content);
  }

  static process(content: string) {
    let processedContent: string;
    processedContent = parse(content).textContent;
    // replace \t sign in content
    processedContent = processedContent.replace(/\t/g, " ");
    processedContent = processedContent.replace(/(\r\n|\n|\r)/gm, " ");
    processedContent = processedContent.substring(0, 1000);
    return processedContent;
  }
}
