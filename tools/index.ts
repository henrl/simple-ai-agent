import { readFileDefinition, readFile, type ReadFileParams } from "./readFile.ts";

export const tools = [readFileDefinition];

export const runTool = (async (toolName: string, args: string): Promise<string> => {
  if (toolName === "fs_read_file") {
    return readFile(JSON.parse(args) as ReadFileParams);
  }
  return JSON.stringify({ error: "Tool not found." });
});
