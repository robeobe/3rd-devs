const url = 'https://poligon.aidevs.pl/dane.txt';
const url2 = 'https://poligon.aidevs.pl/verify';
import { fetchData } from './roboFunctions.js';
import { sendData } from './roboFunctions.js';

const fetchedData = await fetchData(url, "array");
sendData(url2, fetchedData, "POLIGON");

