import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "path";

export const writeFileDefinition: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "fs_write_file",
    description: "Creates a new file or writes content to an existing file. Can also edit files by finding and replacing text.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "The path to the file to write to.",
        },
        content: {
          type: "string",
          description: "The content to write to the file.",
        },
        find: {
          type: "string",
          description: "A string to find in the file to replace with the content. If empty, the entire content will be overwritten or a new file created",
        },
      },
      required: ["path", "content", "find"],
      additionalProperties: false,
    },
  },
};

export type WriteFileParams = {
  path: string;
  content: string;
  find: string;
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

const doesFileExist = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

export const writeFile = async (params: WriteFileParams): Promise<string> => {
  try {
    const resolvedPath = path.resolve(params.path);
    applyToolSafeguards(resolvedPath);
    const fileExists = await doesFileExist(resolvedPath);

    if (!fileExists || !params.find) {
      await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
      await fs.writeFile(resolvedPath, params.content, "utf-8");
      return JSON.stringify({
        success: true,
        path: resolvedPath,
        operation: "create-file",
      });
    } else {
      const existingContent = await fs.readFile(resolvedPath, "utf-8");
      const newContent = existingContent.replace(params.find, params.content);
      await fs.writeFile(resolvedPath, newContent, "utf-8");
      return JSON.stringify({
        success: true,
        path: resolvedPath,
        operation: "find-replace",
        replaced: existingContent !== newContent,
      });
    }
  } catch (e: any) {
    return JSON.stringify({
      error: e instanceof Error ? e.message : "An unknown error occurred.",
    });
  }
};
