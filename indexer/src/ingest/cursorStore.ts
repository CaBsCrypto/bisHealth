import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type CursorState = {
  rpc?: {
    cursor?: string;
    latestLedger?: number;
    lastIngestedAt?: string;
  };
};

export class FileCursorStore {
  constructor(private readonly filePath: string) {}

  async load(): Promise<CursorState> {
    try {
      const raw = await readFile(this.filePath, "utf8");
      return JSON.parse(raw) as CursorState;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return {};
      }
      throw error;
    }
  }

  async save(state: CursorState): Promise<void> {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(state, null, 2));
  }
}
