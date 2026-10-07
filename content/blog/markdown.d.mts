export type Inline =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "break" }
  | { type: "strong"; children: Inline[] }
  | { type: "em"; children: Inline[] }
  | { type: "link"; href: string; children: Inline[] };

export type Block =
  | { type: "paragraph"; children: Inline[] }
  | { type: "heading"; level: 2 | 3; children: Inline[]; id: string }
  | { type: "list"; ordered: boolean; items: Inline[][] }
  | { type: "code"; lang: string; value: string }
  | { type: "flow"; steps: Inline[][] }
  | { type: "quote"; children: Block[] }
  | { type: "rule" };

export function parseFrontmatter(source: string): { data: Record<string, string>; body: string };
export function parseBlocks(body: string): Block[];
export function parseInline(text: string): Inline[];
export function plainText(nodes: Inline[]): string;
export function documentText(blocks: Block[]): string;
export function slugify(text: string): string;
export function readingMinutes(blocks: Block[]): number;
