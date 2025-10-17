import OpenAI from "openai";

export const translateToChineseDefinition: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: "function",
  function: {
    name: "translate_to_chinese",
    description: "Translates English text to Chinese (Simplified Chinese).",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The English text to translate to Chinese.",
        },
        variant: {
          type: "string",
          description: "The Chinese variant to translate to. Options: 'simplified' (default) or 'traditional'.",
          enum: ["simplified", "traditional"],
        },
      },
      required: ["text"],
      additionalProperties: false,
    },
  },
};

export type TranslateToChineseParams = {
  text: string;
  variant?: "simplified" | "traditional";
};

export const translateToChinese = async (params: TranslateToChineseParams): Promise<string> => {
  try {
    // Validate input
    if (!params.text || params.text.trim().length === 0) {
      return JSON.stringify({
        error: "Text parameter is required and cannot be empty.",
      });
    }

    // Set default variant if not provided
    const variant = params.variant || "simplified";
    const variantDescription = variant === "traditional" ? "Traditional Chinese" : "Simplified Chinese";

    // Create OpenAI client
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.omnia.reainternal.net/v1",
    });

    // Prepare the translation prompt
    const systemPrompt = `You are a professional translator. Translate the provided English text to ${variantDescription}. 
    
    Instructions:
    - Provide only the translation, no explanations or additional text
    - Maintain the original tone and meaning
    - Use natural, fluent Chinese expressions
    - For ${variantDescription}, use the appropriate character set
    - If the input contains technical terms, translate them appropriately for Chinese context`;

    const response = await client.chat.completions.create({
      model: "claude-sonnet-4-20250514",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: params.text,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent translations
    });

    const translation = response.choices[0]?.message?.content;

    if (!translation) {
      return JSON.stringify({
        error: "Failed to generate translation. No response received from the translation service.",
      });
    }

    return JSON.stringify({
      success: true,
      originalText: params.text,
      translatedText: translation.trim(),
      variant: variant,
      language: "Chinese",
    });

  } catch (e: any) {
    return JSON.stringify({
      error: e instanceof Error ? e.message : "An unknown error occurred during translation.",
    });
  }
};