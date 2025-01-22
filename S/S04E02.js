import { sendData } from './roboFunctions.js';
import { chatWithGPT } from './roboFunctions.js';

global.col = (text) => {
    console.log({ "LOG": text });
};

const url = 'https://centrala.ag3nts.org/report';

const fs = await import('fs/promises');

global.cFile = await fs.readFile("H:\\LIFE\\S03E05\\shuffled_combinations.json", 'utf8');

async function findConnections() {
    try {
        //console.log('cFile:', cFile);
        
        const cFileArray = JSON.parse(cFile);
        for (let i = 0; i < cFileArray.length; i++) {
            console.log(cFileArray[i]);
                
            const message = await sendData(url, cFileArray[i], "research");
            
            if (message['message'].includes('FLG..')) {
                break;
            } else {
                console.log('Nah.. dalej');
            }
        }

        // czas na GPT
        const message = { 
            role: "user",
            content: 
            ""
        };

        //const chatWithGPTData = await chatWithGPT(message);
        
        

    } catch (error) {
        console.error("Wystąpił błąd podczas odczytu katalogu:", error);
        return [];
    }
}


async function main() {
    await findConnections();


    
}

/**Wywołanie funkcji main ktora jest zdefiniowana na poczatku pliku */
main();

