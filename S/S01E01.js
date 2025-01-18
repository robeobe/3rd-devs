/*
{{FLG:FIRMWARE}}
*/

const axios = require('axios');
const cheerio = require('cheerio');

import OpenAI from "openai";
const openai = new OpenAI();

const mainURL = 'https://xyz.ag3nts.org'; // Adres URL strony do pobrania

const username = 'tester';
const password = '574e112a';
global.humanQuestion = '';
global.answer = '';

getData();

async function getData() {
    axios.get(mainURL, {
        headers: {
            'User-Agent': 'Mozilla/5.0' // Ustawienie User-Agent
        }
    })
    .then(response => {
        // Ładujemy HTML za pomocą Cheerio
        const $ = cheerio.load(response.data);

        humanQuestion = $('#human-question').text();
        console.log('A Tekst z elementu #human-question:', humanQuestion);
        console.log('Status:', response.status);

        // PARSOWANIE PYTANIA
        parseAiData(humanQuestion);
    })
    .catch(error => {
        console.error('Błąd:', error.message);
    });
}

async function parseAiData(humanQuestion) {
    
    console.log('B Tekst z elementu #human-question:', humanQuestion);

    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "Odpowiadaj zawsze tylko liczbami." },
            { role: "user", content: humanQuestion }
        ],
        model: "gpt-4",
        response_format: { type: "text" },
    });

    // Dostęp do wartości numerycznej
    const number = completion.choices[0].message.content;

    console.log('C Sparsowana odpowiedź:', number);

    postData(number);
}

async function postData(number) {
    // Tworzymy nowy obiekt FormData
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('answer', number);

    // A teraz POST na dane
    axios.post(mainURL, formData, {
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Content-Type': 'multipart/form-data' // Ustawiamy odpowiedni nagłówek
        }
    })
    .then(response => {
         console.log('Odpowiedź z POST:', response.data);
    })
    .catch(error => {
        console.error('Błąd POST:', error.message);
    });
}

