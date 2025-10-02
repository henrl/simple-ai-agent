import "dotenv/config";
import OpenAI from "openai";
import process from "node:process";
import readline from "node:readline/promises";
import { tools } from "./tools/index.ts";

const main = async () => {
  console.log("Chat with Omnia (use 'ctrl-c' to quit)");

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.omnia.reainternal.net/v1",
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  process.on("SIGINT", () => {
    rl.close();
  });

  rl.on("close", () => {
    console.log("Exiting chat. Goodbye!");
    process.exit(0);
  });

  const conversation: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

  const getUserMessage = () => rl.question("\u001b[94mYou\u001b[0m: ");

  const runInference = () =>
    client.chat.completions.create({
      model: "gpt-5",
      messages: conversation,
      tools,
    });

  let readUserInput = true;

  while (true) {
    if (readUserInput) {
      const userInput = await getUserMessage();
      const userMessage = { role: "user" as const, content: userInput };
      conversation.push(userMessage);
    }

    const modelResponse = await runInference();
    const modelMessage = modelResponse.choices[0].message;
    conversation.push(modelMessage);

    if (modelMessage.content) {
      console.log(`\u001b[91mOmnia\u001b[0m: ${modelMessage.content}`);
    }

    if (modelMessage.tool_calls) {
      for (const toolCall of modelMessage.tool_calls as OpenAI.Chat.Completions.ChatCompletionMessageFunctionToolCall[]) {
        console.log(
          `\u001b[92mTool\u001b[0m: The model wants to run ${toolCall.function.name} with arguments:`,
          toolCall.function.arguments,
        );
      }
    }
  }
};

main().catch(console.error);
