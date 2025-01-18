import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export class OpenAIService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async completion(messages: ChatCompletionMessageParam[], model: string, stream: boolean) {
        return await this.openai.chat.completions.create({
            model: model,
            messages: messages,
            stream: stream
        });
    }
} 