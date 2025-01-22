import { fetchData } from './roboFunctions.js';
import { sendData } from './roboFunctions.js';
import { chatWithGPT } from './roboFunctions.js';
import { createImageDALLE3 } from './roboFunctions.js';

global.col = (text) => {
    console.log({ "LOG": text });
};

//const url = 'https://centrala.ag3nts.org/data/0cce5192-1a49-43b5-a30d-41151478918f/robotid.json';
const url2 = 'https://centrala.ag3nts.org/report';

//let previousSummarization = "";

async function getFileFromDirectory() {
    try {
        const fs = await import('fs/promises');
        const path = await import('path');
        const directoryPathFacts = "H:\\LIFE\\S02E04_pliki_z_fabryki\\facts";
        const directoryPathData = "H:\\LIFE\\S02E04_pliki_z_fabryki\\data";
        
        const filesFacts = await fs.readdir(directoryPathFacts);
        const filesData = await fs.readdir(directoryPathData);
        
        col('lista plików Fakty: ' + filesFacts);
        col('lista plików Dane: ' + filesData);
        
        global.answerFromFacts = [];
        global.foundPersonFacts = [];
        
        global.answerFromData = [];
        global.foundPersonData = [];

        /*
        Najpierw przetwarzamy pliki z faktami
        */
        for (const fileName of filesFacts) {
            const filePath = path.join(directoryPathFacts, fileName);
            const [fP, aFT] = await processFile(filePath, fileName);
            
            if (fP) {
                foundPersonFacts.push(fP);
            }   
            if (aFT) {
                answerFromFacts.push(aFT);
            }
        }
        console.log('answerFromFacts:', JSON.stringify(answerFromFacts, null, 2));
        console.log('foundPersonFacts:', JSON.stringify(foundPersonFacts, null, 2));   

        /*
        Teraz przetwarzamy pliki z danymi
        */
        for (const fileName of filesData) {
            const filePath = path.join(directoryPathData, fileName);
            const [fP, aFT] = await processFile(filePath, fileName);
            
            if (fP) {
                foundPersonData.push(fP);
            }   
            if (aFT) {
                answerFromData.push(aFT);
            }
        }
        console.log('answerFromData:', JSON.stringify(answerFromData, null, 2));
        console.log('foundPersonData:', JSON.stringify(foundPersonData, null, 2));  

        
        
    } catch (error) {
        console.error("Wystąpił błąd podczas odczytu katalogu:", error);
        return [];
    }
}

async function processFile(filePath, fileName) {
    const foundPerson = {};
    const answerFromGPT = {};
        
    try {
        const fs = await import('fs/promises');
        const content = await fs.readFile(filePath, 'utf8');
        col(`Plik ${fileName}`);
        
        // czas na GPT
        const message = { 
            role: "user",
            content: "Do podanej sentenji pliku wygeneruj słowa kluczowe w formie mianownika " +
                     "(czyli np. “sportowiec”, a nie “sportowcem”, “sportowców” itp.). " +
                     "Wykryj czy dane dotyczy konkratnej osoby, imie i nazwisko, jeżeli tak to dodaj  przed imieniem [FOUNDPERSON] oraz po nazwisku [FOUNDPERSON]. " +
                     "Odpowiedzi w formie ciagu znaków rozdzielonych przecinkami, wyrazy po polsku: " + 
                     content
        };
        const chatWithGPTData = await chatWithGPT(message, true);
        
        // Sprawdzamy czy dane dotycza konkretnej osoby 
        const checkFoundPerson = (data) => {
            const regex = /\[FOUNDPERSON\]/g;
            return regex.test(data);
        };

        if (checkFoundPerson(chatWithGPTData)) {
            col(`Znaleziono odniesienie do osoby w pliku ${fileName}`);
            
            const regex = /\[FOUNDPERSON\]\s?([a-zA-Z\szżźćńółęąśŻŹĆĄŚĘŁÓŃ]+)\s?\[FOUNDPERSON\]/g;
            const regData = regex.exec(chatWithGPTData);
            
            // znaleziona osoba i jej dane  aby podmienic w pliku   
            /**
             * TUTAJ ZMIANA NA
             */
            foundPerson[regData[1].trim()] = fileName;
            
        } else {
            col(`Nie znaleziono odniesienia do osoby w pliku ${fileName}`);
        }

        // zmieniamy FromFacts na obiekt zawierający pliki i ich dane
        answerFromGPT[fileName] = chatWithGPTData;
        
    } catch (err) {
        console.error(`Błąd podczas odczytu pliku ${fileName}:`, err);
    }
    
    return [foundPerson, answerFromGPT];
}

async function main() {
    await getFileFromDirectory();
    
}

/**Wywołanie funkcji main ktora jest zdefiniowana na poczatku pliku */
main();

