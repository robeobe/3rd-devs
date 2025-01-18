import { OpenAIService } from '../chat/OpenAIService.js';

const openaiService = new OpenAIService();

let assistantResponse = null;


export async function fetchData(url, type) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/text',
            }
        });
        
        const data = await response.text();
        
        console.log('fetchData Success:', data);
        
        if (type === "array") {
            return data.split('\n').map(item => item.trim()).filter(item => item);
        } else {
            return data;
        }
        
        //const parsedData = date.map(item => item.split(' '));
        //console.log('Parsed Data:', parsedData);        
    } catch (error) {
        console.error('fetchData Error:', error);
        return [];
    }
}

export async function sendData(url, dArray, task) {

    console.log('sendData Date:', dArray, 'task: ', task);

    const ans = {
        "task": task,
        "apikey": "0cce5192-1a49-43b5-a30d-41151478918f",
        "answer": dArray
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ans)
        });
        
        const data = await response.json();
        console.log('sendData Response Data:', data);
        
        return data;
    } catch (error) {
        console.error('sendData Error:', error);
        return [];
    }
}

export async function chatWithGPT(message) {
    col('chatWithGPT: message:' + message.content);

    try {
        assistantResponse = await openaiService.completion([
            message
        ], "gpt-4o", false);

        col('chatWithGPT: answer:' + assistantResponse.choices[0].message.content);
        
        return assistantResponse.choices[0].message.content;
    } catch (error) {
        console.error('Error in OpenAI completion:', error);
        return null;
    }
}

export async function createImageDALLE3(prompt2) {
    console.log('createImageDALLE3: prompt:', prompt2);

    const prompt = "A futuristic city with flying cars at sunset";
    const imageSize = "1024x1024";

  try {
    const imageUrl = await openaiService.image(prompt, imageSize);
    console.log("URL obrazu:", imageUrl);
  } catch (error) {
    console.error("Nie udało się wygenerować obrazu:", error);
  }
}