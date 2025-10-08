import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "path";

export const listFilesDefinition: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "fs_list_files",
    description: "Lists files and folders in a directory.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        dir: {
          type: "string",
          description: "The directory path to list files from.",
        },
      },
      required: ["dir"],
      additionalProperties: false,
    },
  },
};

export type ListFilesParams = {
  dir: string;
};

const applyToolSafeguards = (resolvedPath: string) => {
  if (!resolvedPath.startsWith(process.cwd())) {
    throw new Error("Access to the specified path is not allowed.");
  };
};

export const listFiles = async (params: ListFilesParams): Promise<string> => {
  try {
    const resolvedPath = path.resolve(params.dir);
    applyToolSafeguards(resolvedPath);
    const dirEntries = await fs.readdir(resolvedPath, { withFileTypes: true });
    const fileList = dirEntries.map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
    }));
    return JSON.stringify({ files: fileList });
  } catch (e: any) {
    return JSON.stringify({
      error: e instanceof Error ? e.message : "An unknown error occurred.",
    });
  }
};
