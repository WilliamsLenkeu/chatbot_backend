require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error('La clé API GEMINI_API_KEY est manquante. Vérifiez votre fichier .env.');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "tunedModels/trustyl-n9yv8ryq0eob",
});

const generationConfig = {
    temperature: 0.7,
    topP: 0.8,
    topK: 20,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const allowedKeywords = [
    "compte bancaire", "documents nécessaires", "compte joint", "solde","salut", "horaires", "chèque", "carte bancaire", 
    "crédit immobilier", "épargne automatique", "modification adresse", "frais gestion", "sécurisation données", 
    "carte sans contact", "carte premium", "remboursement prêt", "relevé bancaire", "service client", "virement",
    "litige transaction", "prêts", "numéro téléphone", "notifications", "carte virtuelle", "prêt étudiant", "bénéficiaire",
    "virement international", "carte crédit", "autorisation découvert", "carte prépayée", "chèque volé", "paiement mobile",
    "compte premium", "informations bancaires", "déposer un chèque", "compte à distance", "paiements refusés", "virement instantané",
    "frais virement", "compte en veille", "virement récurrent", "carte débit différé", "carte autorisation systématique",
    "paiements en ligne", "frais guichet automatique", "solde compte", "carte prépayée", "crédit renouvelable"
];

function isValidMessage(message) {
    return allowedKeywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()));
}

app.post('/api/chat', async (req, res) => {
    const { userMessage } = req.body;

    try {
        if (!isValidMessage(userMessage)) {
            return res.json({
                botMessage: "Désolé, je ne peux répondre qu'à des questions liées à nos services bancaires. Je peux vous aider d'une autre facon?"
            });
        }

        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        const result = await chatSession.sendMessage(userMessage);

        res.json({
            botMessage: result.response.text(),
        });
    } catch (error) {
        console.error('Erreur lors de la communication avec le modèle tuned:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
