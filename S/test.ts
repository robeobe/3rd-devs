import { FileService } from '../web/services/FileService';
import { DatabaseService } from '../web/services/DatabaseService';
import { OpenAIService } from "../web/services/OpenAIService";
import { VectorService } from "../web/services/VectorService";
import { DocumentService } from "../web/services/DocumentService";
import { TextService } from "../web/services/TextService";
import { SearchService } from "../web/services/SearchService";

const fileService = new FileService();
const textService = new TextService();
const openaiService = new OpenAIService();
const vectorService = new VectorService(openaiService);
const searchService = new SearchService(String(process.env.ALGOLIA_APP_ID), String(process.env.ALGOLIA_API_KEY));
const databaseService = new DatabaseService('web/database.db', searchService, vectorService);
const documentService = new DocumentService(openaiService, databaseService, textService);

const { docs } = await fileService.process('https://cloud.overment.com/S00E01-Generatywna-Sztuczna-Inteligencja-1729062000.md', 1000);
for (const doc of docs) {
    await databaseService.insertDocument(doc, true);
}

// ANSWER QUESTION USING HYBRID SEARCH
const tokenizer = await documentService.answer('What is tokenizer?', docs);
console.log(tokenizer);
