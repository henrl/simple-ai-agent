import { readFileDefinition, readFile, type ReadFileParams } from "./readFile.ts";
import { writeFileDefinition, writeFile, type WriteFileParams } from "./writeFile.ts";
import { listFilesDefinition, listFiles, type ListFilesParams } from "./listFiles.ts";
import { translateToChineseDefinition, translateToChinese, type TranslateToChineseParams } from "./translateToChinese.ts";

export const tools = [readFileDefinition, writeFileDefinition, listFilesDefinition, translateToChineseDefinition];

export const runTool = (async (toolName: string, args: string): Promise<string> => {
  if (toolName === "fs_read_file") {
    return readFile(JSON.parse(args) as ReadFileParams);
  } else if (toolName === "fs_write_file") {
    return writeFile(JSON.parse(args) as WriteFileParams);
  } else if (toolName === "fs_list_files") {
    return listFiles(JSON.parse(args) as ListFilesParams);
  } else if (toolName === "translate_to_chinese") {
    return translateToChinese(JSON.parse(args) as TranslateToChineseParams);
  }
  return JSON.stringify({ error: "Tool not found." });
});
