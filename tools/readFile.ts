import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "path";

export const readFileDefinition: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "fs_read_file",
    description: "Reads the content of a file.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "The path to the file to read.",
        },
      },
      required: ["path"],
      additionalProperties: false,
    },
  },
};

export type ReadFileParams = {
  path: string;
};

const applyToolSafeguards = (resolvedPath: string) => {
  if (!resolvedPath.startsWith(process.cwd())) {
    throw new Error("Access to the specified path is not allowed.");
  };
  const fileName = path.basename(resolvedPath);
  const sensitiveFiles = [".env"];
  if (sensitiveFiles.includes(fileName)) {
    throw new Error("Access to the specified file is not allowed.");
  }
};

export const readFile = async (params: ReadFileParams): Promise<string> => {
  try {
    const resolvedPath = path.resolve(params.path);
    applyToolSafeguards(resolvedPath);
    const fileContent = await fs.readFile(resolvedPath, "utf-8");
    return JSON.stringify({ content: fileContent });
  } catch (e: any) {
    return JSON.stringify({
      error: e instanceof Error ? e.message : "An unknown error occurred.",
    });
  }
};