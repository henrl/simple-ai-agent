# Chinese Translation Tool

## Overview
This tool provides English to Chinese translation functionality using OpenAI's language models. It follows the same architectural patterns as other tools in this project.

## Features
- Translates English text to Chinese (Simplified or Traditional)
- Supports both Simplified Chinese (default) and Traditional Chinese
- Professional translation quality with context awareness
- Consistent error handling and response format
- Type-safe implementation with TypeScript

## Usage

The tool can be invoked by the AI assistant when users request Chinese translations. Examples:

### Basic Translation
```
User: "Translate 'Hello, how are you today?' to Chinese"
```

### Specify Variant
```
User: "Translate 'Welcome to our website' to Traditional Chinese"
```

## Tool Parameters

### Required
- `text` (string): The English text to translate

### Optional  
- `variant` (string): The Chinese variant - "simplified" (default) or "traditional"

## Response Format

### Success Response
```json
{
  "success": true,
  "originalText": "Hello, how are you today?",
  "translatedText": "你好，你今天好吗？",
  "variant": "simplified",
  "language": "Chinese"
}
```

### Error Response
```json
{
  "error": "Error message describing what went wrong"
}
```

## Implementation Details

### Architecture
The tool follows the established patterns in this codebase:

1. **Tool Definition**: OpenAI function calling schema with strict parameters
2. **Type Safety**: TypeScript interfaces for parameters and return types  
3. **Error Handling**: Consistent JSON error responses
4. **Registration**: Properly registered in tools/index.ts

### Code Structure
- `translateToChineseDefinition`: OpenAI tool schema
- `TranslateToChineseParams`: TypeScript interface for parameters
- `translateToChinese`: Main implementation function

### Quality Features
- Input validation for empty/missing text
- Professional translation prompts for natural output
- Lower temperature (0.3) for consistent translations
- Proper handling of technical terms and context
- Support for both Simplified and Traditional Chinese

## Technical Notes

- Uses the same OpenAI client configuration as the main application
- Leverages Claude Sonnet model for high-quality translations
- Maintains the original tone and meaning of source text
- Handles errors gracefully with descriptive messages

This tool seamlessly integrates with the existing chat interface and can be used whenever translation services are needed.