import express from 'express';
import bodyParser from 'body-parser';
import { chatWithGPT } from './roboFunctions';

// Tworzymy mapę 4x4
const MAP: string[][] = [
    ["las", "jezioro", "łąka", "skały"],
    ["wzgórze", "miasto", "rzeka", "droga"],
    ["pustynia", "bagno", "pole", "las"],
    ["skały", "jezioro", "łąka", "droga"]
];

// Parsuje tekst instrukcji i zwraca przesunięcia
async function parseInstruction(instruction: string): Promise<number[]> {
    const moves = instruction.toLowerCase().split(", ");
    let position: number[] = [0, 0];  // Start z (0, 0)
    for (const move of moves) {
        if (move.includes("prawo")) {
            position[1] += parseInt(move.replace(/\D/g, '') || '1');
        } else if (move.includes("lewo")) {
            position[1] -= parseInt(move.replace(/\D/g, '') || '1');
        } else if (move.includes("dół")) {
            position[0] += parseInt(move.replace(/\D/g, '') || '1');
        } else if (move.includes("góra")) {
            position[0] -= parseInt(move.replace(/\D/g, '') || '1');
        }
        // Upewniamy się, że pozycja nie wychodzi poza mapę
        position[0] = Math.max(0, Math.min(3, position[0]));
        position[1] = Math.max(0, Math.min(3, position[1]));
    }
    return position;
}

// Tworzymy aplikację Express
const app = express();
app.use(bodyParser.json());

// Tworzymy endpoint POST do obsługi instrukcji
app.post('/kurwix_api', async (req, res) => {
    try {
        const instruction = req.body.instruction;
        
        /*** LOGGING ***/
        console.log("INSTRUCTION: " + instruction);

        const message = { 
            role: "user",
            content: "Zadanie polega na wygenerowaniu opisu dla pozycji na mapie. " + 
            "Mapa ma rozmiar 4x4 i zawiera różne elementy środowiska. " + 
            "Na podstawie instrukcji, które otrzymuję, muszę wygenerować opis dla pozycji, " + 
            "która wynika z tych instrukcji. instrukcja: " + instruction
            };
        console.log(message);

        const chatWithGPTData = await chatWithGPT(message);

        console.log("CHAT WITH GPT DATA: " + chatWithGPTData);

        if (!instruction) {
            return res.status(400).json({ error: "Brak pola 'instruction'" });
        }
    
        // Parsowanie instrukcji i wyznaczanie pozycji
        const position = await parseInstruction(instruction);
        const [row, col] = position;
    
        // Pobieramy opis pola z mapy
        const description = MAP[row][col];
    
        // Zwracamy odpowiedź
        res.json({ description });
    } catch (error) {
        res.status(500).json({ error: "Wewnętrzny błąd serwera" });
    }
});

// Tworzymy endpoint GET do sprawdzenia, czy serwer działa
app.get('/kurwix', (req, res) => {
    res.json({ message: 'Serwer jest uruchomiony i gotowy do komunikacji.', port: PORT });
});


// Uruchomienie serwera na localhost
const PORT = 3404;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
