import express from 'express';
import { OpenAIService } from './OpenAIService';
import type { ChatCompletionMessageParam, ChatCompletionChunk } from "openai/resources/chat/completions";
import type OpenAI from 'openai';

/*
Start Express server
*/
const app = express();
const port = 3000;
app.use(express.json());
app.listen(port, () => console.log(`Server running at http://localhost:${port}. Listening for POST /api/chat requests`));

const openaiService = new OpenAIService();
let previousSummarization = "";

// Function to generate summarization based on the current turn and previous summarization
async function generateSummarization(userMessage: ChatCompletionMessageParam, assistantResponse: ChatCompletionMessageParam): Promise<string> {
  const currentTurn = `Adam: ${userMessage.content}\nAlice: ${assistantResponse.content}`;

  const summarizationPrompt: ChatCompletionMessageParam = {
    role: "system",
    content: `Please summarize the following conversation in a concise manner, incorporating the previous summary if available:

Previous summary: ${previousSummarization || "No previous summary"}

Current turn:
${currentTurn}

Adam: Please update our conversation summary.`
  };

  const response = await openaiService.completion([summarizationPrompt], "gpt-4o", false) as OpenAI.Chat.Completions.ChatCompletion;
  return response.choices[0].message.content ?? "No conversation history";
}

// Function to create system prompt
function createSystemPrompt(summarization: string): ChatCompletionMessageParam {
  return { 
    role: "system", 
    content: `You are Alice, a helpful assistant who speaks using as few words as possible. 

    ${summarization ? `Here is a summary of the conversation so far: 
    <summary>${summarization}</summary>` : ''} 
    
    Let's chat!` 
  };
}

// Chat endpoint POST /api/chat
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  console.log('req.body', req.body);
  console.log('message', message);  

  if (!message || !message.content || !message.role) {
    //return res.status(400).json({ error: 'Invalid message format. Required: content and role' });
  }

  try {
    console.log('trying to complete');
    const systemPrompt = createSystemPrompt(previousSummarization);

    const assistantResponse = await openaiService.completion([
        systemPrompt, 
        message
    ], "gpt-4o", false) as OpenAI.Chat.Completions.ChatCompletion;

    // Generate new summarization
    previousSummarization = await generateSummarization(message, assistantResponse.choices[0].message);
    
    res.json(assistantResponse);
  } catch (error) {
    console.error('Error in OpenAI completion:', JSON.stringify(error));
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

// Demo endpoint POST /api/demo
app.post('/api/demo', async (req, res) => {
  const demoMessages: ChatCompletionMessageParam[] = [
    { content: "Hi! I'm Adam", role: "user" },
    { content: "How are you?", role: "user" },
    { content: "Do you know my name?", role: "user" }
  ];

  let assistantResponse: OpenAI.Chat.Completions.ChatCompletion | null = null;

  for (const message of demoMessages) {
    console.log('--- NEXT TURN ---');
    console.log('Adam:', message.content);

    try {
      const systemPrompt = createSystemPrompt(previousSummarization);

      assistantResponse = await openaiService.completion([
          systemPrompt, 
          message
      ], "gpt-4o", false) as OpenAI.Chat.Completions.ChatCompletion;

      console.log('Alice:', assistantResponse.choices[0].message.content);

      // Generate new summarization
      previousSummarization = await generateSummarization(message, assistantResponse.choices[0].message);
    } catch (error) {
      console.error('Error in OpenAI completion:', JSON.stringify(error));
      res.status(500).json({ error: 'An error occurred while processing your request' });
      return;
    }
  }

  res.json(assistantResponse);
});