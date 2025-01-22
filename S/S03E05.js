import { sendData } from './roboFunctions.js';
import { chatWithGPT } from './roboFunctions.js';

global.col = (text) => {
    console.log({ "LOG": text });
};

const url = 'https://centrala.ag3nts.org/report';

const fs = await import('fs/promises');
const path = await import('path');
        
global.connectionsFile = await fs.readFile("H:\\LIFE\\S03E05\\connections.json", 'utf8');
global.usersFile = await fs.readFile("H:\\LIFE\\S03E05\\users.json", 'utf8');
        
async function findConnections() {
    try {
        
        /*
        Najpierw przetwarzamy pliki z faktami
        */
        connectionsFile = JSON.parse(connectionsFile);
        usersFile = JSON.parse(usersFile);  

        console.log('connectionsFile:', connectionsFile["error"]);
        console.log('usersFile:', usersFile["error"]);

       
        try {
            // czas na GPT
            const message = { 
                role: "user",
                content: 
                "Zadanie polega na stworzeniu bazy grafowej na bazie dwóch podanych zbiorów danych w json" +
                "Zbuduj strukturę powiązań miedzy danymi. forma grafu, która będzie pokazywać, która osoba kogo zna." +
                "Załóż oczywiście, że jedna osoba może znać wiele innych osób. Nie są to połączenia jeden do jednego." +
                "Podana lista zawiera identyfikatowy osób ze sobą powiazanych. dane  z parami powiązań między id:" + 
                JSON.stringify(connectionsFile, null, 2) + 
                "Podaj wynik najkrótszego połączenia od id=28 do id=39"
                            };

            const chatWithGPTData = await chatWithGPT(message);
            
            
        } catch (err) {
            console.error(`Błąd podczas odczytu pliku ${fileName}:`, err);
        }



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

