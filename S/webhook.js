const express = require('express');
const app = express();

app.use(express.json()); // Obsługa JSON w żądaniach

// Endpoint webhooka
app.post('/webhook', (req, res) => {
    console.log('Otrzymano webhook:', req.body);
    // Przetwarzanie danych
    res.status(200).send('Webhook przyjęty');
});

// Nasłuchiwanie na porcie
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});
