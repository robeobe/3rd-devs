import { fetchData } from './roboFunctions.js';
import { sendData } from './roboFunctions.js';
import { chatWithGPT } from './roboFunctions.js';
import { createImageDALLE3 } from './roboFunctions.js';

const url = 'https://centrala.ag3nts.org/data/0cce5192-1a49-43b5-a30d-41151478918f/robotid.json';
const url2 = 'https://centrala.ag3nts.org/report';

//let previousSummarization = "";

async function main() {
    const fetchedData = await fetchData(url);

    const jsonData = JSON.parse(fetchedData);
    //console.log('fetchedData description: ', jsonData);
    //return jsonData;

    const message = "Wygeneryj obraz używając modelu dalle-3 : " + jsonData.description;
    console.log('message: ', message);
    //return true;

    //const createImage = await createImageDALLE3(message);
    //console.log('createImageDALLE3: odpowiedz ', createImage);

    //sendData(url2, chatWithGPTData, "roborid");

}

main();

