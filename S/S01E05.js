import { fetchData } from './roboFunctions.js';
import { sendData } from './roboFunctions.js';
import { chatWithGPT } from './roboFunctions.js';

const url = 'https://centrala.ag3nts.org/data/0cce5192-1a49-43b5-a30d-41151478918f/cenzura.txt';
const url2 = 'https://centrala.ag3nts.org/report';

//let previousSummarization = "";

async function main() {
    const fetchedData = await fetchData(url);

    const message = { 
        role: "user",
        content: "Zamień wszelkie wrażliwe dane (imię + nazwisko, nazwę ulicy + numer, miasto, wiek osoby samą wartość na słowo CENZURA. w zdaniu: " + fetchedData
    };
    console.log('main message: ', message);

    const chatWithGPTData = await chatWithGPT(message);
    console.log('chatWithGPTData: odpowiedz ', chatWithGPTData);

    sendData(url2, chatWithGPTData, "CENZURA");

}

main();

