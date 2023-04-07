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
    this.content = parse(this.content).textContent;
    // replace \t sign in content
    this.content = this.content.replace(/\t/g, " ");
    this.content = this.content.replace(/(\r\n|\n|\r)/gm, " ");
    this.content = this.content.substring(0, 1000);
  }
}
