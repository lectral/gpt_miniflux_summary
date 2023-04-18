import parse from "node-html-parser";

export class RssEntry {
  id: number;
  title: string;
  url: string;
  content: string;
  extendedContentObtained: boolean;

  constructor(id: number, title: string, url: string, content: string) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.content = content;
    this.extendedContentObtained = false;
  }

  process() {
    this.content = RssEntry.process(this.content);
  }

  static process(content: string) {
    content = content.trim();
    if (content && content.length > 0) {
      let processedContent: string;
      processedContent = parse(content).textContent;
      // replace \t sign in content
      processedContent = processedContent.replace(/\t/g, " ");
      processedContent = processedContent.replace(/(\r\n|\n|\r)/gm, " ");
      processedContent = processedContent.substring(0, 2000);
      return processedContent;
    }
    return "";
  }
}
