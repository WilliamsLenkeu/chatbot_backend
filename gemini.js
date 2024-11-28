require('dotenv').config(); // Charger les variables depuis .env
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuration de l'API Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error('La clé API GEMINI_API_KEY est manquante. Vérifiez votre fichier .env.');
    process.exit(1); // Arrête l'application si la clé est absente
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Route pour gérer les requêtes de chat
app.post('/api/chat', async (req, res) => {
    const { userMessage } = req.body;

    try {
        const result = await model.generateContent([userMessage]);

        res.json({
            botMessage: result.response.text(), // Retourne la réponse générée
        });
    } catch (error) {
        console.error('Erreur lors de la communication avec Gemini:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
