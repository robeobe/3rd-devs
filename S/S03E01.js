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
        const directoryPath = "H:\\LIFE\\S02E04_pliki_z_fabryki\\facts";
        const files = await fs.readdir(directoryPath);
        
        col('lista plików: ' + files);

        // !HINT  foreach nie obsługuje asynchroniczności wiec zastąp go pętlą for 
        global.answer = {};
        global.foundPerson = [];

        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            try {
                const content = await fs.readFile(filePath, 'utf8');
                //console.log(`\nZawartość pliku ${file}:`);
                //console.log(content);
                
                // czas na GPT
                const message = { 
                    role: "user",
                    content: "Do podanej sentenji pliku wygeneruj słowa kluczowe w formie mianownika " +
                             "(czyli np. “sportowiec”, a nie “sportowcem”, “sportowców” itp.). " +
                             "Wykryj czy dane dotyczy konkratnej osoby, imie i nazwisko, jeżeli tak to dodaj  przed imieniem [FOUNDPERSON] oraz po nazwisku [FOUNDPERSON]. " +
                             "Odpowiedzi w formie ciagu znaków rozdzielonych przecinkami, wyrazy po polsku: " + 
                             content
                             
                };
                const chatWithGPTData = await chatWithGPT(message);
                
                // Sprawdzamy czy dane dotycza konkretnej osoby 
                const checkFoundPerson = (data) => {
                    const regex = /\[FOUNDPERSON\]/g;
                    return regex.test(data);
                };

                if (checkFoundPerson(chatWithGPTData)) {
                    col(`Znaleziono odniesienie do osoby w pliku ${file} i danych ${chatWithGPTData}`);
                    
                    const regex = /\[FOUNDPERSON\]\s?([a-zA-Z\szżźćńółęąśŻŹĆĄŚĘŁÓŃ]+)\s?\[FOUNDPERSON\]/g;
                    console.log(regex.exec(chatWithGPTData)); return true;

                   } else {
                    col(`Nie znaleziono odniesienia do osoby w pliku ${file}`);
                }

                // zmieniamy answer na obiekt zawierający pliki i ich dane
                answer[file] = chatWithGPTData;
                
            } catch (err) {
                console.error(`Błąd podczas odczytu pliku ${file}:`, err);
            }
        }
        console.log('answer:', answer);
        console.log('foundPerson:', foundPerson);   

        return answer;
    } catch (error) {
        console.error("Wystąpił błąd podczas odczytu katalogu:", error);
        return [];
    }
}

async function main() {
    await getFileFromDirectory();
}

main();

